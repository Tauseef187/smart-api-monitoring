import { Outlet, useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import Button from "../components/common/Button";
import { useAuth } from "../hooks/useAuth";

function AppLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-brand-bg px-4 py-6 lg:px-6">
      <div className="mx-auto flex max-w-[1600px] gap-6">
        <Sidebar />
        <main className="w-full">
          <Navbar />
          <div className="mb-6 flex justify-end lg:hidden">
            <Button variant="ghost" className="gap-2" onClick={() => { logout(); navigate('/login'); }}>
              <FiLogOut />
              Logout
            </Button>
          </div>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;

