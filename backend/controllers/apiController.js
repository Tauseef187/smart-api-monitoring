const Api = require("../models/Api");

// ── CREATE ────────────────────────────────────────────────────────────
exports.createApi = async (req, res) => {
    try {
        const { name, url, method, interval } = req.body;

        if (!name || !url) {
            return res.status(400).json({
                message: "Name and URL required"
            });
        }

        const api = await Api.create({
            user:     req.user.id,
            name,
            url,
            method,
            interval
        });

        res.status(201).json(api);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ── GET ALL (mine) ────────────────────────────────────────────────────
exports.getMyApis = async (req, res) => {
    try {
        const apis = await Api.find({ user: req.user.id });
        res.json(apis);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ── GET ONE ───────────────────────────────────────────────────────────
exports.getApiById = async (req, res) => {
    try {
        const api = await Api.findById(req.params.id);

        if (!api) {
            return res.status(404).json({ message: "API not found" });
        }

        // Make sure this API belongs to the logged in user
        if (api.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized" });
        }

        res.json(api);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ── EDIT (UPDATE) ─────────────────────────────────────────────────────
exports.updateApi = async (req, res) => {
    try {
        const api = await Api.findById(req.params.id);

        if (!api) {
            return res.status(404).json({ message: "API not found" });
        }

        // Make sure this API belongs to the logged in user
        if (api.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized" });
        }

        const { name, url, method, interval } = req.body;

        // Only update fields that were actually sent
        if (name)     api.name     = name;
        if (url)      api.url      = url;
        if (method)   api.method   = method;
        if (interval) api.interval = interval;

        const updatedApi = await api.save();

        res.json(updatedApi);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ── DELETE ────────────────────────────────────────────────────────────
exports.deleteApi = async (req, res) => {
    try {
        const api = await Api.findById(req.params.id);

        if (!api) {
            return res.status(404).json({ message: "API not found" });
        }

        // Make sure this API belongs to the logged in user
        if (api.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized" });
        }

        await api.deleteOne();

        res.json({ message: "API deleted successfully", id: req.params.id });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};