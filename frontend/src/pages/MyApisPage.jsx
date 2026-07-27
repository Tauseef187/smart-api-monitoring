import { useMemo, useState } from "react";
import { FiEdit2, FiEye, FiPlus, FiTrash2 } from "react-icons/fi";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import Button from "../components/common/Button";
import ChartCard from "../components/charts/ChartCard";
import EmptyState from "../components/common/EmptyState";
import Input from "../components/common/Input";
import Modal from "../components/common/Modal";
import SearchBar from "../components/common/SearchBar";
import StatusBadge from "../components/common/StatusBadge";
import { useMonitoringData } from "../hooks/useMonitoringData";
import { monitoringService } from "../services/monitoringService";
import { formatDateTime, formatLatency } from "../utils/formatters";
import { getMethodClass } from "../utils/monitoring";

function MyApisPage() {
  const { apis, loading, refresh } = useMonitoringData();
  const [query, setQuery]               = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // ── Create modal state ──
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving]       = useState(false);
  const [form, setForm]           = useState({ name: "", url: "", method: "GET", interval: 5 });

  // ── Edit modal state ──
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editSaving, setEditSaving]       = useState(false);
  const [editForm, setEditForm]           = useState({ name: "", url: "", method: "GET", interval: 5 });
  const [editingApiId, setEditingApiId]   = useState(null);

  // ── Delete state ──
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingApi, setDeletingApi]         = useState(null);
  const [deleteLoading, setDeleteLoading]     = useState(false);

  // ── Filter ──
  const filteredApis = useMemo(() =>
    apis.filter((api) =>
      [api.name, api.url].join(" ").toLowerCase().includes(query.toLowerCase()) &&
      (statusFilter === "ALL" || api.currentStatus === statusFilter)
    ),
    [apis, query, statusFilter]
  );

  // ── Handlers ──
  const handleCreate = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      await monitoringService.createApi({ ...form, interval: Number(form.interval) });
      toast.success("API added");
      setModalOpen(false);
      setForm({ name: "", url: "", method: "GET", interval: 5 });
      refresh();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to create API");
    } finally {
      setSaving(false);
    }
  };

  const handleEditOpen = (api) => {
    setEditingApiId(api._id);
    setEditForm({
      name:     api.name,
      url:      api.url,
      method:   api.method,
      interval: api.interval || 5,
    });
    setEditModalOpen(true);
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    try {
      setEditSaving(true);
      await monitoringService.updateApi(editingApiId, {
        ...editForm,
        interval: Number(editForm.interval),
      });
      toast.success("API updated");
      setEditModalOpen(false);
      setEditingApiId(null);
      refresh();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update API");
    } finally {
      setEditSaving(false);
    }
  };

  const handleDeleteOpen = (api) => {
    setDeletingApi(api);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      setDeleteLoading(true);
      await monitoringService.deleteApi(deletingApi._id);
      toast.success(`"${deletingApi.name}" deleted`);
      setDeleteModalOpen(false);
      setDeletingApi(null);
      refresh();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to delete API");
    } finally {
      setDeleteLoading(false);
    }
  };

  if (!loading && !apis.length) {
    return (
      <>
        <EmptyState
          title="No APIs configured"
          description="Add your first endpoint to start monitoring checks, uptime, and response-time history."
          action={<Button onClick={() => setModalOpen(true)}>Add API</Button>}
        />
        <CreateApiModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          form={form}
          setForm={setForm}
          onSubmit={handleCreate}
          saving={saving}
        />
      </>
    );
  }

  return (
    <>
      {/* ── Main Table ── */}
      <ChartCard
        title="My APIs"
        subtitle="Search, filter, and manage monitored endpoints"
        action={
          <Button className="gap-2" onClick={() => setModalOpen(true)}>
            <FiPlus /> Add API
          </Button>
        }
      >
        <div className="mb-6 flex flex-col gap-4 lg:flex-row">
          <div className="flex-1">
            <SearchBar value={query} onChange={setQuery} placeholder="Search API name or URL..." />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white"
          >
            <option value="ALL">All statuses</option>
            <option value="UP">UP</option>
            <option value="DOWN">DOWN</option>
            <option value="CHECKING">Checking</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-slate-500">
              <tr>
                <th className="pb-4">API Name</th>
                <th className="pb-4">Method</th>
                <th className="pb-4">Status</th>
                <th className="pb-4">Current Latency</th>
                <th className="pb-4">Average Latency</th>
                <th className="pb-4">Last Checked</th>
                <th className="pb-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApis.map((api) => (
                <tr key={api._id} className="border-t border-white/5 text-slate-200">
                  <td className="py-4">
                    <p className="font-semibold text-white">{api.name}</p>
                    <p className="text-xs text-slate-500">{api.url}</p>
                  </td>
                  <td className="py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getMethodClass(api.method)}`}>
                      {api.method}
                    </span>
                  </td>
                  <td className="py-4"><StatusBadge status={api.currentStatus} /></td>
                  <td className="py-4">{formatLatency(api.currentLatency)}</td>
                  <td className="py-4">{formatLatency(api.averageLatency)}</td>
                  <td className="py-4">{formatDateTime(api.lastChecked)}</td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      {/* View */}
                      <Link
                        to={`/app/apis/${api._id}`}
                        className="rounded-xl bg-white/5 p-2 text-slate-300 hover:bg-white/10"
                      >
                        <FiEye />
                      </Link>

                      {/* Edit */}
                      <button
                        className="rounded-xl bg-white/5 p-2 text-slate-300 hover:bg-white/10"
                        onClick={() => handleEditOpen(api)}
                      >
                        <FiEdit2 />
                      </button>

                      {/* Delete */}
                      <button
                        className="rounded-xl bg-rose-500/10 p-2 text-rose-300 hover:bg-rose-500/20"
                        onClick={() => handleDeleteOpen(api)}
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartCard>

      {/* ── Create Modal ── */}
      <CreateApiModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        form={form}
        setForm={setForm}
        onSubmit={handleCreate}
        saving={saving}
      />

      {/* ── Edit Modal ── */}
      <EditApiModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        form={editForm}
        setForm={setEditForm}
        onSubmit={handleEditSubmit}
        saving={editSaving}
      />

      {/* ── Delete Confirm Modal ── */}
      <DeleteConfirmModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        api={deletingApi}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
      />
    </>
  );
}

// ── Create Modal ──────────────────────────────────────────────────────
function CreateApiModal({ open, onClose, form, setForm, onSubmit, saving }) {
  return (
    <Modal open={open} onClose={onClose} title="Add API">
      <form onSubmit={onSubmit} className="grid gap-4">
        <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <Input label="URL"  value={form.url}  onChange={(e) => setForm({ ...form, url: e.target.value })} />
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm text-slate-300">Method</span>
            <select
              value={form.method}
              onChange={(e) => setForm({ ...form, method: e.target.value })}
              className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white"
            >
              {["GET", "POST", "PUT", "DELETE"].map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </label>
          <Input label="Interval (minutes)" type="number" value={form.interval} onChange={(e) => setForm({ ...form, interval: e.target.value })} />
        </div>
        <div className="mt-2 flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={saving}>Save</Button>
        </div>
      </form>
    </Modal>
  );
}

// ── Edit Modal ────────────────────────────────────────────────────────
function EditApiModal({ open, onClose, form, setForm, onSubmit, saving }) {
  return (
    <Modal open={open} onClose={onClose} title="Edit API">
      <form onSubmit={onSubmit} className="grid gap-4">
        <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <Input label="URL"  value={form.url}  onChange={(e) => setForm({ ...form, url: e.target.value })} />
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm text-slate-300">Method</span>
            <select
              value={form.method}
              onChange={(e) => setForm({ ...form, method: e.target.value })}
              className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white"
            >
              {["GET", "POST", "PUT", "DELETE"].map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </label>
          <Input label="Interval (minutes)" type="number" value={form.interval} onChange={(e) => setForm({ ...form, interval: e.target.value })} />
        </div>
        <div className="mt-2 flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={saving}>Update</Button>
        </div>
      </form>
    </Modal>
  );
}

// ── Delete Confirm Modal ──────────────────────────────────────────────
function DeleteConfirmModal({ open, onClose, api, onConfirm, loading }) {
  if (!api) return null;
  return (
    <Modal open={open} onClose={onClose} title="Delete API">
      <div className="grid gap-6">
        <p className="text-slate-300">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-white">"{api.name}"</span>?
          <br />
          <span className="text-sm text-slate-500">
            This will remove all monitoring history for this endpoint.
          </span>
        </p>
        <div className="flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button
            type="button"
            loading={loading}
            onClick={onConfirm}
            className="bg-rose-600 hover:bg-rose-700 text-white"
          >
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default MyApisPage;