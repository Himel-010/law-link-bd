import React, { useCallback, useEffect, useMemo, useState } from "react";

const API_BASE = "http://localhost:4000/api/posts";

const initialForm = {
  client: "",
  title: "",
  description: "",
  category: "other",
  budgetMin: 0,
  budgetMax: 0,
  urgency: "medium",
  division: "",
  district: "",
  documents: "",
  status: "open",
  isPriority: 0,
  expiresAt: "",
};

const categoryOptions = [
  "family",
  "criminal",
  "property",
  "corporate",
  "civil",
  "tax",
  "labour",
  "cyber",
  "immigration",
  "other",
];

const urgencyOptions = ["low", "medium", "high"];
const statusOptions = ["open", "in_progress", "closed", "cancelled"];

const getStoredAuth = () => {
  const localUser = localStorage.getItem("currentUser");
  const sessionUser = sessionStorage.getItem("currentUser");
  const localToken = localStorage.getItem("token");
  const sessionToken = sessionStorage.getItem("token");

  let user = null;
  let token = "";

  try {
    if (localToken && localUser) {
      user = JSON.parse(localUser);
      token = localToken;
    } else if (sessionToken && sessionUser) {
      user = JSON.parse(sessionUser);
      token = sessionToken;
    }
  } catch (error) {
    console.error("Auth parse error:", error);
  }

  return { user, token };
};

const formatCurrency = (value) => {
  const num = Number(value || 0);
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(num);
};

const formatDateTime = (value) => {
  if (!value) return "Not set";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Invalid date";
  return date.toLocaleString();
};

const getStatusBadgeStyle = (status) => {
  const map = {
    open: {
      background: "#ecfdf3",
      color: "#027a48",
      border: "1px solid #abefc6",
    },
    in_progress: {
      background: "#eff8ff",
      color: "#175cd3",
      border: "1px solid #b2ddff",
    },
    closed: {
      background: "#f2f4f7",
      color: "#344054",
      border: "1px solid #d0d5dd",
    },
    cancelled: {
      background: "#fef3f2",
      color: "#b42318",
      border: "1px solid #fecdca",
    },
  };

  return map[status] || map.open;
};

const getUrgencyBadgeStyle = (urgency) => {
  const map = {
    low: {
      background: "#f2f4f7",
      color: "#344054",
      border: "1px solid #d0d5dd",
    },
    medium: {
      background: "#fffaeb",
      color: "#b54708",
      border: "1px solid #fedf89",
    },
    high: {
      background: "#fef3f2",
      color: "#b42318",
      border: "1px solid #fecdca",
    },
  };

  return map[urgency] || map.medium;
};

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f8fafc",
    padding: "28px",
    color: "#0f172a",
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  shell: {
    maxWidth: "1450px",
    margin: "0 auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "16px",
    marginBottom: "24px",
    flexWrap: "wrap",
  },
  headerLeft: {
    display: "grid",
    gap: "8px",
  },
  overline: {
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "#475467",
  },
  title: {
    margin: 0,
    fontSize: "32px",
    lineHeight: 1.15,
    fontWeight: 800,
    color: "#101828",
  },
  subtitle: {
    margin: 0,
    fontSize: "14px",
    color: "#667085",
    maxWidth: "760px",
  },
  statGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: "16px",
    marginBottom: "24px",
  },
  statCard: {
    background: "#ffffff",
    border: "1px solid #eaecf0",
    borderRadius: "20px",
    padding: "18px",
    boxShadow: "0 8px 24px rgba(16, 24, 40, 0.06)",
  },
  statLabel: {
    fontSize: "13px",
    color: "#667085",
    marginBottom: "10px",
    fontWeight: 600,
  },
  statValue: {
    fontSize: "28px",
    fontWeight: 800,
    color: "#101828",
    marginBottom: "6px",
  },
  statMeta: {
    fontSize: "13px",
    color: "#475467",
  },
  alertBase: {
    borderRadius: "14px",
    padding: "14px 16px",
    marginBottom: "18px",
    fontSize: "14px",
    fontWeight: 600,
  },
  success: {
    background: "#ecfdf3",
    color: "#027a48",
    border: "1px solid #abefc6",
  },
  danger: {
    background: "#fef3f2",
    color: "#b42318",
    border: "1px solid #fecdca",
  },
  mainGrid: {
    display: "grid",
    gridTemplateColumns: "420px minmax(0, 1fr)",
    gap: "24px",
    alignItems: "start",
  },
  panel: {
    background: "#ffffff",
    border: "1px solid #eaecf0",
    borderRadius: "22px",
    boxShadow: "0 10px 30px rgba(16, 24, 40, 0.06)",
  },
  stickyPanel: {
    position: "sticky",
    top: "24px",
  },
  panelHeader: {
    padding: "20px 22px 16px",
    borderBottom: "1px solid #f2f4f7",
  },
  panelTitle: {
    margin: 0,
    fontSize: "20px",
    fontWeight: 800,
    color: "#101828",
  },
  panelDesc: {
    margin: "6px 0 0",
    fontSize: "13px",
    color: "#667085",
  },
  panelBody: {
    padding: "20px 22px 22px",
  },
  formGrid: {
    display: "grid",
    gap: "14px",
  },
  fieldWrap: {
    display: "grid",
    gap: "8px",
  },
  label: {
    fontSize: "13px",
    fontWeight: 700,
    color: "#344054",
  },
  input: {
    width: "100%",
    border: "1px solid #d0d5dd",
    borderRadius: "12px",
    background: "#ffffff",
    padding: "12px 14px",
    fontSize: "14px",
    outline: "none",
    color: "#101828",
    boxSizing: "border-box",
  },
  textarea: {
    width: "100%",
    border: "1px solid #d0d5dd",
    borderRadius: "12px",
    background: "#ffffff",
    padding: "12px 14px",
    fontSize: "14px",
    outline: "none",
    color: "#101828",
    resize: "vertical",
    minHeight: "120px",
    boxSizing: "border-box",
  },
  row2: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
  },
  buttonRow: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    marginTop: "6px",
  },
  primaryButton: {
    border: "none",
    background: "#111827",
    color: "#ffffff",
    borderRadius: "12px",
    padding: "12px 16px",
    fontSize: "14px",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 6px 16px rgba(17, 24, 39, 0.16)",
  },
  secondaryButton: {
    border: "1px solid #d0d5dd",
    background: "#ffffff",
    color: "#344054",
    borderRadius: "12px",
    padding: "12px 16px",
    fontSize: "14px",
    fontWeight: 700,
    cursor: "pointer",
  },
  destructiveButton: {
    border: "1px solid #fda29b",
    background: "#ffffff",
    color: "#b42318",
    borderRadius: "10px",
    padding: "10px 14px",
    fontSize: "13px",
    fontWeight: 700,
    cursor: "pointer",
  },
  softButton: {
    border: "1px solid #d0d5dd",
    background: "#ffffff",
    color: "#344054",
    borderRadius: "10px",
    padding: "10px 14px",
    fontSize: "13px",
    fontWeight: 700,
    cursor: "pointer",
  },
  darkSoftButton: {
    border: "1px solid #d0d5dd",
    background: "#111827",
    color: "#ffffff",
    borderRadius: "10px",
    padding: "10px 14px",
    fontSize: "13px",
    fontWeight: 700,
    cursor: "pointer",
  },
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    marginBottom: "18px",
    flexWrap: "wrap",
  },
  searchWrap: {
    display: "flex",
    gap: "10px",
    flex: 1,
    minWidth: "280px",
  },
  searchInput: {
    flex: 1,
    border: "1px solid #d0d5dd",
    borderRadius: "12px",
    background: "#ffffff",
    padding: "12px 14px",
    fontSize: "14px",
    outline: "none",
    color: "#101828",
  },
  sectionTitle: {
    margin: 0,
    fontSize: "20px",
    fontWeight: 800,
    color: "#101828",
  },
  postList: {
    display: "grid",
    gap: "16px",
  },
  postCard: {
    border: "1px solid #eaecf0",
    borderRadius: "18px",
    padding: "18px",
    background: "#ffffff",
    boxShadow: "0 4px 16px rgba(16, 24, 40, 0.04)",
  },
  postTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "14px",
    flexWrap: "wrap",
  },
  postTitle: {
    margin: 0,
    fontSize: "20px",
    fontWeight: 800,
    color: "#101828",
  },
  postDesc: {
    margin: "10px 0 16px",
    color: "#475467",
    fontSize: "14px",
    lineHeight: 1.7,
  },
  chipRow: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
    marginTop: "8px",
  },
  chip: {
    padding: "7px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: 700,
  },
  metaGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: "12px",
    marginTop: "8px",
    marginBottom: "16px",
  },
  metaCard: {
    background: "#f8fafc",
    border: "1px solid #eaecf0",
    borderRadius: "14px",
    padding: "12px",
  },
  metaLabel: {
    fontSize: "12px",
    color: "#667085",
    marginBottom: "6px",
    fontWeight: 700,
  },
  metaValue: {
    fontSize: "14px",
    color: "#101828",
    fontWeight: 700,
  },
  actionRow: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    paddingTop: "6px",
  },
  emptyState: {
    border: "1px dashed #d0d5dd",
    borderRadius: "18px",
    padding: "30px",
    textAlign: "center",
    color: "#667085",
    background: "#fcfcfd",
  },
  detailWrapper: {
    marginTop: "24px",
  },
  detailHeaderRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    alignItems: "flex-start",
    flexWrap: "wrap",
    marginBottom: "16px",
  },
  detailGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: "14px",
    marginBottom: "20px",
  },
  detailCard: {
    background: "#f8fafc",
    border: "1px solid #eaecf0",
    borderRadius: "16px",
    padding: "14px",
  },
  detailLabel: {
    fontSize: "12px",
    color: "#667085",
    marginBottom: "8px",
    fontWeight: 700,
  },
  detailValue: {
    fontSize: "14px",
    color: "#101828",
    lineHeight: 1.6,
    fontWeight: 700,
    wordBreak: "break-word",
  },
  bidsGrid: {
    display: "grid",
    gap: "14px",
  },
  bidCard: {
    border: "1px solid #eaecf0",
    borderRadius: "16px",
    padding: "16px",
    background: "#ffffff",
  },
  bidGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: "12px",
    marginTop: "12px",
    marginBottom: "14px",
  },
  bidMeta: {
    background: "#f8fafc",
    border: "1px solid #eaecf0",
    borderRadius: "12px",
    padding: "12px",
  },
};

export default function AdminPostsManager() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState(initialForm);
  const [authUser, setAuthUser] = useState(null);
  const [token, setToken] = useState("");

  useEffect(() => {
    const auth = getStoredAuth();
    setAuthUser(auth.user);
    setToken(auth.token);
  }, []);

  const isAdmin = useMemo(() => authUser?.role === "admin", [authUser]);

  const authHeaders = useMemo(() => {
    if (!token) return {};
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }, [token]);

  const stats = useMemo(() => {
    const total = posts.length;
    const open = posts.filter((p) => p.status === "open").length;
    const inProgress = posts.filter((p) => p.status === "in_progress").length;
    const priority = posts.filter((p) => Number(p.isPriority) === 1).length;

    return { total, open, inProgress, priority };
  }, [posts]);

  const clearAlerts = () => {
    setError("");
    setMessage("");
  };

  const fetchPosts = useCallback(async () => {
    if (!token || !isAdmin) return;

    try {
      setLoading(true);
      setError("");

      const query = search ? `?search=${encodeURIComponent(search)}` : "";
      const res = await fetch(`${API_BASE}/admin/all${query}`, {
        method: "GET",
        headers: authHeaders,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch posts");
      }

      setPosts(data.data || []);
    } catch (err) {
      setError(err.message || "Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  }, [token, isAdmin, search, authHeaders]);

  const fetchSinglePost = useCallback(
    async (id) => {
      if (!token || !isAdmin) return;

      try {
        setDetailLoading(true);
        setError("");

        const res = await fetch(`${API_BASE}/admin/${id}`, {
          method: "GET",
          headers: authHeaders,
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch post");
        }

        setSelectedPost(data.data);
      } catch (err) {
        setError(err.message || "Failed to fetch post");
      } finally {
        setDetailLoading(false);
      }
    },
    [token, isAdmin, authHeaders]
  );

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "budgetMin" ||
        name === "budgetMax" ||
        name === "isPriority"
          ? Number(value)
          : value,
    }));
  };

  const resetForm = () => {
    setFormData(initialForm);
    setEditingId(null);
  };

  const refreshAfterMutation = async (postId = null) => {
    await fetchPosts();
    if (postId) {
      await fetchSinglePost(postId);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setError("Login token paoa jai nai. Please abar login koro.");
      return;
    }

    if (!authUser || !isAdmin) {
      setError("Only admin can access this page.");
      return;
    }

    try {
      setFormLoading(true);
      clearAlerts();

      const payload = {
        ...formData,
        documents: formData.documents
          ? formData.documents
              .split(",")
              .map((doc) => doc.trim())
              .filter(Boolean)
          : [],
        expiresAt: formData.expiresAt || null,
      };

      const url = editingId
        ? `${API_BASE}/admin/update/${editingId}`
        : `${API_BASE}/admin/create`;

      const method = editingId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: authHeaders,
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Request failed");
      }

      setMessage(data.message || "Success");
      const affectedId = editingId || data.data?._id || null;
      resetForm();
      await refreshAfterMutation(affectedId);
    } catch (err) {
      setError(err.message || "Request failed");
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (post) => {
    setEditingId(post._id);
    setFormData({
      client: post.client?._id || "",
      title: post.title || "",
      description: post.description || "",
      category: post.category || "other",
      budgetMin: post.budgetMin || 0,
      budgetMax: post.budgetMax || 0,
      urgency: post.urgency || "medium",
      division: post.division || "",
      district: post.district || "",
      documents: Array.isArray(post.documents) ? post.documents.join(", ") : "",
      status: post.status || "open",
      isPriority: post.isPriority || 0,
      expiresAt: post.expiresAt
        ? new Date(post.expiresAt).toISOString().slice(0, 16)
        : "",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (!confirmDelete) return;

    try {
      setActionLoading(true);
      clearAlerts();

      const res = await fetch(`${API_BASE}/admin/delete/${id}`, {
        method: "DELETE",
        headers: authHeaders,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Delete failed");
      }

      setMessage(data.message || "Post deleted successfully");
      if (selectedPost?._id === id) setSelectedPost(null);
      await fetchPosts();
    } catch (err) {
      setError(err.message || "Delete failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleStatusAction = async (id, action) => {
    try {
      setActionLoading(true);
      clearAlerts();

      const res = await fetch(`${API_BASE}/${id}/${action}`, {
        method: "PATCH",
        headers: authHeaders,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || `Failed to ${action} post`);
      }

      setMessage(data.message || "Status updated");
      await refreshAfterMutation(id);
    } catch (err) {
      setError(err.message || "Failed to update status");
    } finally {
      setActionLoading(false);
    }
  };

  const handleAcceptBid = async (postId, bidId) => {
    try {
      setActionLoading(true);
      clearAlerts();

      const res = await fetch(`${API_BASE}/${postId}/accept-bid/${bidId}`, {
        method: "PATCH",
        headers: authHeaders,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to accept bid");
      }

      setMessage(data.message || "Bid accepted successfully");
      await refreshAfterMutation(postId);
    } catch (err) {
      setError(err.message || "Failed to accept bid");
    } finally {
      setActionLoading(false);
    }
  };

  const renderBadge = (label, customStyle) => (
    <span style={{ ...styles.chip, ...customStyle }}>{label}</span>
  );

  if (!token) {
    return (
      <div style={styles.page}>
        <div style={styles.shell}>
          <div style={{ ...styles.alertBase, ...styles.danger }}>
            Login token paoa jai nai. Please abar login koro.
          </div>
        </div>
      </div>
    );
  }

  if (!authUser) {
    return (
      <div style={styles.page}>
        <div style={styles.shell}>
          <div style={{ ...styles.alertBase, ...styles.danger }}>
            Current user data paoa jai nai. Please abar login koro.
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div style={styles.page}>
        <div style={styles.shell}>
          <div style={{ ...styles.alertBase, ...styles.danger }}>
            Forbidden: Only admin can access posts management.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.shell}>
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <span style={styles.overline}>Admin Dashboard</span>
            <h1 style={styles.title}>Posts Management Console</h1>
            <p style={styles.subtitle}>
              Manage legal service posts, review bids, control post lifecycle,
              and monitor operational activity from a clean professional admin
              interface.
            </p>
          </div>
        </div>

        {message && (
          <div style={{ ...styles.alertBase, ...styles.success }}>{message}</div>
        )}

        {error && (
          <div style={{ ...styles.alertBase, ...styles.danger }}>{error}</div>
        )}

        <div style={styles.statGrid}>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Total Posts</div>
            <div style={styles.statValue}>{stats.total}</div>
            <div style={styles.statMeta}>All records currently available</div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statLabel}>Open Posts</div>
            <div style={styles.statValue}>{stats.open}</div>
            <div style={styles.statMeta}>Active posts ready for responses</div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statLabel}>In Progress</div>
            <div style={styles.statValue}>{stats.inProgress}</div>
            <div style={styles.statMeta}>Posts currently being handled</div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statLabel}>Priority Posts</div>
            <div style={styles.statValue}>{stats.priority}</div>
            <div style={styles.statMeta}>Marked for urgent visibility</div>
          </div>
        </div>

        <div style={styles.mainGrid}>
          <div style={{ ...styles.panel, ...styles.stickyPanel }}>
            <div style={styles.panelHeader}>
              <h2 style={styles.panelTitle}>
                {editingId ? "Update Post" : "Create New Post"}
              </h2>
              <p style={styles.panelDesc}>
                Fill out the details carefully to publish or update a post.
              </p>
            </div>

            <div style={styles.panelBody}>
              <form onSubmit={handleSubmit} style={styles.formGrid}>
                <div style={styles.fieldWrap}>
                  <label style={styles.label}>Client ID</label>
                  <input
                    type="text"
                    name="client"
                    placeholder="Enter client ID"
                    value={formData.client}
                    onChange={handleChange}
                    required
                    style={styles.input}
                  />
                </div>

                <div style={styles.fieldWrap}>
                  <label style={styles.label}>Post Title</label>
                  <input
                    type="text"
                    name="title"
                    placeholder="Enter post title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    style={styles.input}
                  />
                </div>

                <div style={styles.fieldWrap}>
                  <label style={styles.label}>Description</label>
                  <textarea
                    name="description"
                    placeholder="Write a clear and detailed description"
                    rows="5"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    style={styles.textarea}
                  />
                </div>

                <div style={styles.row2}>
                  <div style={styles.fieldWrap}>
                    <label style={styles.label}>Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      style={styles.input}
                    >
                      {categoryOptions.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={styles.fieldWrap}>
                    <label style={styles.label}>Urgency</label>
                    <select
                      name="urgency"
                      value={formData.urgency}
                      onChange={handleChange}
                      style={styles.input}
                    >
                      {urgencyOptions.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={styles.row2}>
                  <div style={styles.fieldWrap}>
                    <label style={styles.label}>Budget Min</label>
                    <input
                      type="number"
                      name="budgetMin"
                      placeholder="Minimum budget"
                      value={formData.budgetMin}
                      onChange={handleChange}
                      style={styles.input}
                    />
                  </div>

                  <div style={styles.fieldWrap}>
                    <label style={styles.label}>Budget Max</label>
                    <input
                      type="number"
                      name="budgetMax"
                      placeholder="Maximum budget"
                      value={formData.budgetMax}
                      onChange={handleChange}
                      style={styles.input}
                    />
                  </div>
                </div>

                <div style={styles.row2}>
                  <div style={styles.fieldWrap}>
                    <label style={styles.label}>Division</label>
                    <input
                      type="text"
                      name="division"
                      placeholder="Enter division"
                      value={formData.division}
                      onChange={handleChange}
                      style={styles.input}
                    />
                  </div>

                  <div style={styles.fieldWrap}>
                    <label style={styles.label}>District</label>
                    <input
                      type="text"
                      name="district"
                      placeholder="Enter district"
                      value={formData.district}
                      onChange={handleChange}
                      style={styles.input}
                    />
                  </div>
                </div>

                <div style={styles.fieldWrap}>
                  <label style={styles.label}>Document URLs</label>
                  <input
                    type="text"
                    name="documents"
                    placeholder="Comma separated document links"
                    value={formData.documents}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </div>

                <div style={styles.row2}>
                  <div style={styles.fieldWrap}>
                    <label style={styles.label}>Status</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      style={styles.input}
                    >
                      {statusOptions.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={styles.fieldWrap}>
                    <label style={styles.label}>Priority</label>
                    <select
                      name="isPriority"
                      value={formData.isPriority}
                      onChange={handleChange}
                      style={styles.input}
                    >
                      <option value={0}>Normal</option>
                      <option value={1}>Priority</option>
                    </select>
                  </div>
                </div>

                <div style={styles.fieldWrap}>
                  <label style={styles.label}>Expiry Date & Time</label>
                  <input
                    type="datetime-local"
                    name="expiresAt"
                    value={formData.expiresAt}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </div>

                <div style={styles.buttonRow}>
                  <button
                    type="submit"
                    disabled={formLoading}
                    style={{
                      ...styles.primaryButton,
                      opacity: formLoading ? 0.7 : 1,
                      cursor: formLoading ? "not-allowed" : "pointer",
                    }}
                  >
                    {formLoading
                      ? "Saving..."
                      : editingId
                      ? "Update Post"
                      : "Create Post"}
                  </button>

                  {editingId && (
                    <button
                      type="button"
                      onClick={resetForm}
                      style={styles.secondaryButton}
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          <div style={styles.panel}>
            <div style={styles.panelHeader}>
              <div style={styles.toolbar}>
                <div>
                  <h2 style={styles.sectionTitle}>All Posts</h2>
                  <p style={styles.panelDesc}>
                    Search, review, edit, and manage all submitted posts.
                  </p>
                </div>

                <div style={styles.searchWrap}>
                  <input
                    type="text"
                    placeholder="Search posts by keyword..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={styles.searchInput}
                  />
                  <button
                    onClick={fetchPosts}
                    style={styles.primaryButton}
                    disabled={loading}
                  >
                    {loading ? "Searching..." : "Search"}
                  </button>
                </div>
              </div>
            </div>

            <div style={styles.panelBody}>
              {loading ? (
                <div style={styles.emptyState}>Loading posts...</div>
              ) : posts.length === 0 ? (
                <div style={styles.emptyState}>No posts found.</div>
              ) : (
                <div style={styles.postList}>
                  {posts.map((post) => (
                    <div key={post._id} style={styles.postCard}>
                      <div style={styles.postTop}>
                        <div style={{ flex: 1, minWidth: "260px" }}>
                          <h3 style={styles.postTitle}>{post.title}</h3>

                          <div style={styles.chipRow}>
                            {renderBadge(
                              post.status,
                              getStatusBadgeStyle(post.status)
                            )}
                            {renderBadge(
                              post.urgency,
                              getUrgencyBadgeStyle(post.urgency)
                            )}
                            {Number(post.isPriority) === 1 &&
                              renderBadge("priority", {
                                background: "#111827",
                                color: "#ffffff",
                                border: "1px solid #111827",
                              })}
                          </div>
                        </div>
                      </div>

                      <p style={styles.postDesc}>{post.description}</p>

                      <div style={styles.metaGrid}>
                        <div style={styles.metaCard}>
                          <div style={styles.metaLabel}>Client</div>
                          <div style={styles.metaValue}>
                            {post.client?.name || "N/A"}
                          </div>
                        </div>

                        <div style={styles.metaCard}>
                          <div style={styles.metaLabel}>Category</div>
                          <div style={styles.metaValue}>{post.category}</div>
                        </div>

                        <div style={styles.metaCard}>
                          <div style={styles.metaLabel}>Budget</div>
                          <div style={styles.metaValue}>
                            {formatCurrency(post.budgetMin)} -{" "}
                            {formatCurrency(post.budgetMax)}
                          </div>
                        </div>

                        <div style={styles.metaCard}>
                          <div style={styles.metaLabel}>Bids</div>
                          <div style={styles.metaValue}>
                            {post.bids?.length || 0}
                          </div>
                        </div>
                      </div>

                      <div style={styles.actionRow}>
                        <button
                          onClick={() => fetchSinglePost(post._id)}
                          style={styles.darkSoftButton}
                          disabled={detailLoading}
                        >
                          {detailLoading && selectedPost?._id !== post._id
                            ? "Loading..."
                            : "View Details"}
                        </button>

                        <button
                          onClick={() => handleEdit(post)}
                          style={styles.softButton}
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(post._id)}
                          style={styles.destructiveButton}
                          disabled={actionLoading}
                        >
                          Delete
                        </button>

                        {post.status !== "closed" && (
                          <button
                            onClick={() =>
                              handleStatusAction(post._id, "close")
                            }
                            style={styles.softButton}
                            disabled={actionLoading}
                          >
                            Close
                          </button>
                        )}

                        {post.status !== "cancelled" &&
                          post.status !== "closed" && (
                            <button
                              onClick={() =>
                                handleStatusAction(post._id, "cancel")
                              }
                              style={styles.softButton}
                              disabled={actionLoading}
                            >
                              Cancel
                            </button>
                          )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {selectedPost && (
          <div style={styles.detailWrapper}>
            <div style={styles.panel}>
              <div style={styles.panelHeader}>
                <div style={styles.detailHeaderRow}>
                  <div>
                    <h2 style={styles.panelTitle}>Post Details</h2>
                    <p style={styles.panelDesc}>
                      Detailed view of the selected post and submitted bids.
                    </p>
                  </div>

                  <div style={styles.chipRow}>
                    {renderBadge(
                      selectedPost.status,
                      getStatusBadgeStyle(selectedPost.status)
                    )}
                    {renderBadge(
                      selectedPost.urgency,
                      getUrgencyBadgeStyle(selectedPost.urgency)
                    )}
                    {Number(selectedPost.isPriority) === 1 &&
                      renderBadge("priority", {
                        background: "#111827",
                        color: "#ffffff",
                        border: "1px solid #111827",
                      })}
                  </div>
                </div>
              </div>

              <div style={styles.panelBody}>
                {detailLoading ? (
                  <div style={styles.emptyState}>Loading post details...</div>
                ) : (
                  <>
                    <div style={styles.detailGrid}>
                      <div style={styles.detailCard}>
                        <div style={styles.detailLabel}>Title</div>
                        <div style={styles.detailValue}>{selectedPost.title}</div>
                      </div>

                      <div style={styles.detailCard}>
                        <div style={styles.detailLabel}>Client</div>
                        <div style={styles.detailValue}>
                          {selectedPost.client?.name || "N/A"}
                          <br />
                          <span style={{ color: "#667085", fontWeight: 500 }}>
                            {selectedPost.client?.email || "No email"}
                          </span>
                        </div>
                      </div>

                      <div style={styles.detailCard}>
                        <div style={styles.detailLabel}>Selected Lawyer</div>
                        <div style={styles.detailValue}>
                          {selectedPost.selectedLawyer?.name || "Not selected"}
                        </div>
                      </div>

                      <div style={styles.detailCard}>
                        <div style={styles.detailLabel}>Category</div>
                        <div style={styles.detailValue}>
                          {selectedPost.category || "N/A"}
                        </div>
                      </div>

                      <div style={styles.detailCard}>
                        <div style={styles.detailLabel}>Location</div>
                        <div style={styles.detailValue}>
                          {selectedPost.division || "N/A"}
                          {selectedPost.district
                            ? `, ${selectedPost.district}`
                            : ""}
                        </div>
                      </div>

                      <div style={styles.detailCard}>
                        <div style={styles.detailLabel}>Budget Range</div>
                        <div style={styles.detailValue}>
                          {formatCurrency(selectedPost.budgetMin)} -{" "}
                          {formatCurrency(selectedPost.budgetMax)}
                        </div>
                      </div>

                      <div style={styles.detailCard}>
                        <div style={styles.detailLabel}>Expires At</div>
                        <div style={styles.detailValue}>
                          {formatDateTime(selectedPost.expiresAt)}
                        </div>
                      </div>

                      <div style={styles.detailCard}>
                        <div style={styles.detailLabel}>Documents</div>
                        <div style={styles.detailValue}>
                          {selectedPost.documents?.length
                            ? selectedPost.documents.length
                            : 0}{" "}
                          linked file(s)
                        </div>
                      </div>

                      <div style={styles.detailCard}>
                        <div style={styles.detailLabel}>Total Bids</div>
                        <div style={styles.detailValue}>
                          {selectedPost.bids?.length || 0}
                        </div>
                      </div>
                    </div>

                    <div style={{ ...styles.detailCard, marginBottom: "20px" }}>
                      <div style={styles.detailLabel}>Description</div>
                      <div style={{ ...styles.detailValue, fontWeight: 500 }}>
                        {selectedPost.description}
                      </div>
                    </div>

                    <div>
                      <h3
                        style={{
                          marginTop: 0,
                          marginBottom: "14px",
                          fontSize: "18px",
                          fontWeight: 800,
                          color: "#101828",
                        }}
                      >
                        Bids
                      </h3>

                      {!selectedPost.bids || selectedPost.bids.length === 0 ? (
                        <div style={styles.emptyState}>No bids found.</div>
                      ) : (
                        <div style={styles.bidsGrid}>
                          {selectedPost.bids.map((bid) => (
                            <div key={bid._id} style={styles.bidCard}>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "flex-start",
                                  gap: "12px",
                                  flexWrap: "wrap",
                                }}
                              >
                                <div>
                                  <h4
                                    style={{
                                      margin: 0,
                                      fontSize: "18px",
                                      fontWeight: 800,
                                      color: "#101828",
                                    }}
                                  >
                                    {bid.lawyer?.name || "Unknown Lawyer"}
                                  </h4>
                                  <p
                                    style={{
                                      margin: "6px 0 0",
                                      color: "#667085",
                                      fontSize: "14px",
                                    }}
                                  >
                                    {bid.lawyer?.email || "No email"}
                                  </p>
                                </div>

                                {renderBadge(bid.status || "pending", {
                                  background: "#f8fafc",
                                  color: "#344054",
                                  border: "1px solid #d0d5dd",
                                })}
                              </div>

                              <div style={styles.bidGrid}>
                                <div style={styles.bidMeta}>
                                  <div style={styles.detailLabel}>Proposed Fee</div>
                                  <div style={styles.detailValue}>
                                    {formatCurrency(bid.proposedFee)}
                                  </div>
                                </div>

                                <div style={styles.bidMeta}>
                                  <div style={styles.detailLabel}>Estimated Days</div>
                                  <div style={styles.detailValue}>
                                    {bid.estimatedDays || 0} day(s)
                                  </div>
                                </div>

                                <div style={styles.bidMeta}>
                                  <div style={styles.detailLabel}>Bid Status</div>
                                  <div style={styles.detailValue}>
                                    {bid.status || "N/A"}
                                  </div>
                                </div>

                                <div style={styles.bidMeta}>
                                  <div style={styles.detailLabel}>Lawyer</div>
                                  <div style={styles.detailValue}>
                                    {bid.lawyer?.name || "N/A"}
                                  </div>
                                </div>
                              </div>

                              <div style={{ ...styles.bidMeta, marginBottom: "12px" }}>
                                <div style={styles.detailLabel}>Message</div>
                                <div
                                  style={{
                                    ...styles.detailValue,
                                    fontWeight: 500,
                                  }}
                                >
                                  {bid.message || "No message provided"}
                                </div>
                              </div>

                              {selectedPost.status === "open" &&
                                bid.status !== "withdrawn" && (
                                  <button
                                    onClick={() =>
                                      handleAcceptBid(selectedPost._id, bid._id)
                                    }
                                    style={styles.primaryButton}
                                    disabled={actionLoading}
                                  >
                                    {actionLoading ? "Processing..." : "Accept Bid"}
                                  </button>
                                )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}