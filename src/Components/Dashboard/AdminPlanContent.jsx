import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiRefreshCw,
  FiX,
  FiPackage,
  FiCheckCircle,
  FiAlertCircle,
  FiLoader,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE_URL = "http://localhost:4000/api";

const initialFeatureState = {
  casePostLimit: 0,
  proposalLimit: 0,
  shortlistLimit: 0,
  proposalCredits: 0,
  priorityAccess: false,
  profileBoost: false,
  unlimitedChat: false,
  paidConsultationEnabled: false,
  shortlistUnlockEnabled: false,
};

const initialForm = {
  name: "",
  slug: "",
  roleType: "client",
  description: "",
  price: 0,
  durationInDays: 30,
  currency: "BDT",
  isActive: true,
  sortOrder: 0,
  features: initialFeatureState,
};

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

const normalizeSlug = (value = "") =>
  String(value)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-");

const featureConfig = [
  { key: "casePostLimit", label: "Case Post Limit", type: "number" },
  { key: "proposalLimit", label: "Proposal Limit", type: "number" },
  { key: "shortlistLimit", label: "Shortlist Limit", type: "number" },
  { key: "proposalCredits", label: "Proposal Credits", type: "number" },
  { key: "priorityAccess", label: "Priority Access", type: "checkbox" },
  { key: "profileBoost", label: "Profile Boost", type: "checkbox" },
  { key: "unlimitedChat", label: "Unlimited Chat", type: "checkbox" },
  {
    key: "paidConsultationEnabled",
    label: "Paid Consultation",
    type: "checkbox",
  },
  {
    key: "shortlistUnlockEnabled",
    label: "Shortlist Unlock",
    type: "checkbox",
  },
];

const AdminPlanContent = () => {
  const [form, setForm] = useState(initialForm);
  const [plans, setPlans] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [editingPlanId, setEditingPlanId] = useState("");
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");
  const [authUser, setAuthUser] = useState(null);
  const [token, setToken] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [activeFilter, setActiveFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const auth = getStoredAuth();
    setAuthUser(auth.user);
    setToken(auth.token);
  }, []);

  const isAdmin = useMemo(() => authUser?.role === "admin", [authUser]);

  const filteredPlans = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return plans;

    return plans.filter((plan) => {
      return (
        plan.name?.toLowerCase().includes(q) ||
        plan.slug?.toLowerCase().includes(q) ||
        plan.roleType?.toLowerCase().includes(q) ||
        plan.description?.toLowerCase().includes(q)
      );
    });
  }, [plans, searchTerm]);

  const fetchPlans = useCallback(async () => {
    if (!token || !isAdmin) return;

    try {
      setLoadingPlans(true);
      setError("");

      const params = {};
      if (roleFilter) params.roleType = roleFilter;
      if (activeFilter !== "") params.isActive = activeFilter;

      const res = await axios.get(`${API_BASE_URL}/plans/admin/all/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params,
      });

      setPlans(res.data?.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load plans");
    } finally {
      setLoadingPlans(false);
    }
  }, [token, isAdmin, roleFilter, activeFilter]);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans, reloadKey]);

  const triggerReload = useCallback(() => {
    setReloadKey((prev) => prev + 1);
  }, []);

  const resetForm = useCallback(() => {
    setForm(initialForm);
    setEditingPlanId("");
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    resetForm();
    setError("");
    setResponse(null);
  }, [resetForm]);

  const openCreateModal = useCallback(() => {
    resetForm();
    setError("");
    setResponse(null);
    setIsModalOpen(true);
  }, [resetForm]);

  const openEditModal = useCallback((plan) => {
    setEditingPlanId(plan._id);
    setForm({
      name: plan.name || "",
      slug: plan.slug || "",
      roleType: plan.roleType || "client",
      description: plan.description || "",
      price: plan.price ?? 0,
      durationInDays: plan.durationInDays ?? 30,
      currency: plan.currency || "BDT",
      isActive: Boolean(plan.isActive),
      sortOrder: plan.sortOrder ?? 0,
      features: {
        casePostLimit: plan.features?.casePostLimit ?? 0,
        proposalLimit: plan.features?.proposalLimit ?? 0,
        shortlistLimit: plan.features?.shortlistLimit ?? 0,
        proposalCredits: plan.features?.proposalCredits ?? 0,
        priorityAccess: Boolean(plan.features?.priorityAccess),
        profileBoost: Boolean(plan.features?.profileBoost),
        unlimitedChat: Boolean(plan.features?.unlimitedChat),
        paidConsultationEnabled: Boolean(plan.features?.paidConsultationEnabled),
        shortlistUnlockEnabled: Boolean(plan.features?.shortlistUnlockEnabled),
      },
    });
    setError("");
    setResponse(null);
    setIsModalOpen(true);
  }, []);

  const handleChange = useCallback(
    (e) => {
      const { name, value, type, checked } = e.target;

      setForm((prev) => {
        let updatedValue = type === "checkbox" ? checked : value;

        if (["price", "durationInDays", "sortOrder"].includes(name)) {
          updatedValue = value === "" ? "" : Number(value);
        }

        const updated = {
          ...prev,
          [name]: updatedValue,
        };

        if (name === "name" && !editingPlanId) {
          updated.slug = normalizeSlug(value);
        }

        if (name === "slug") {
          updated.slug = normalizeSlug(value);
        }

        return updated;
      });

      setError("");
      setResponse(null);
    },
    [editingPlanId]
  );

  const handleFeatureChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      features: {
        ...prev.features,
        [name]:
          type === "checkbox"
            ? checked
            : value === ""
            ? ""
            : Number(value),
      },
    }));

    setError("");
    setResponse(null);
  }, []);

  const validateForm = useCallback(() => {
    if (!token) return "Login token paoa jai nai. Please abar login koro.";
    if (!authUser) return "Current user data paoa jai nai. Please abar login koro.";
    if (!isAdmin) return "Only admin can manage plans.";
    if (!form.name.trim()) return "Plan name is required";
    if (!form.slug.trim()) return "Plan slug is required";
    if (!form.roleType) return "roleType is required";
    if (form.price === "" || Number(form.price) < 0) return "Valid price is required";
    if (form.durationInDays === "" || Number(form.durationInDays) < 1) {
      return "durationInDays must be at least 1";
    }
    return "";
  }, [token, authUser, isAdmin, form]);

  const buildPayload = useCallback(() => {
    return {
      name: form.name.trim(),
      slug: normalizeSlug(form.slug || form.name),
      roleType: form.roleType,
      description: form.description.trim(),
      price: Number(form.price),
      durationInDays: Number(form.durationInDays),
      currency: form.currency.trim().toUpperCase() || "BDT",
      isActive: Boolean(form.isActive),
      sortOrder: Number(form.sortOrder || 0),
      features: {
        casePostLimit: Number(form.features.casePostLimit || 0),
        proposalLimit: Number(form.features.proposalLimit || 0),
        shortlistLimit: Number(form.features.shortlistLimit || 0),
        proposalCredits: Number(form.features.proposalCredits || 0),
        priorityAccess: Boolean(form.features.priorityAccess),
        profileBoost: Boolean(form.features.profileBoost),
        unlimitedChat: Boolean(form.features.unlimitedChat),
        paidConsultationEnabled: Boolean(form.features.paidConsultationEnabled),
        shortlistUnlockEnabled: Boolean(form.features.shortlistUnlockEnabled),
      },
    };
  }, [form]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      const validationMessage = validateForm();
      if (validationMessage) {
        setError(validationMessage);
        return;
      }

      try {
        setSubmitting(true);
        setError("");
        setResponse(null);

        const payload = buildPayload();

        let res;
        if (editingPlanId) {
          res = await axios.patch(
            `${API_BASE_URL}/plans/${editingPlanId}`,
            payload,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
        } else {
          res = await axios.post(`${API_BASE_URL}/plans`, payload, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
        }

        setResponse(res.data);
        closeModal();
        triggerReload();
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to save plan");
      } finally {
        setSubmitting(false);
      }
    },
    [validateForm, buildPayload, editingPlanId, token, closeModal, triggerReload]
  );

  const handleDelete = useCallback(
    async (planId) => {
      const confirmed = window.confirm(
        "Are you sure you want to delete this plan?"
      );
      if (!confirmed) return;

      try {
        setDeletingId(planId);
        setError("");
        setResponse(null);

        const res = await axios.delete(`${API_BASE_URL}/plans/${planId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setResponse(res.data);

        if (editingPlanId === planId) {
          closeModal();
        }

        triggerReload();
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to delete plan");
      } finally {
        setDeletingId("");
      }
    },
    [token, editingPlanId, closeModal, triggerReload]
  );

  if (!token) {
    return (
      <div className="rounded-3xl border border-red-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">Admin Plan Manager</h2>
        <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          Login token paoa jai nai. Please abar login koro.
        </div>
      </div>
    );
  }

  if (!authUser) {
    return (
      <div className="rounded-3xl border border-orange-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">Admin Plan Manager</h2>
        <div className="mt-4 rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-700">
          Current user data paoa jai nai. Please abar login koro.
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="rounded-3xl border border-orange-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">Admin Plan Manager</h2>
        <div className="mt-4 rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-700">
          Logged in user admin na. Ei page access korte admin account diye login korte hobe.
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Dynamic Plan Manager
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Client আর lawyer role-এর জন্য dynamic plan create, update, delete আর manage করো।
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={triggerReload}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <FiRefreshCw />
                Refresh
              </button>

              <button
                type="button"
                onClick={openCreateModal}
                className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:scale-[1.02]"
              >
                <FiPlus />
                Create Plan
              </button>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
            <strong>Logged in as:</strong> {authUser?.name || "Admin"} (
            {authUser?.email || "No email"}) — role: {authUser?.role}
          </div>
        </div>

        {response?.success && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {response?.message || "Operation completed successfully"}
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-bold text-slate-900">Filters</h3>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Search Plan
                </label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, slug, role..."
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-violet-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Role Filter
                </label>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-violet-400"
                >
                  <option value="">All</option>
                  <option value="client">client</option>
                  <option value="lawyer">lawyer</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Status Filter
                </label>
                <select
                  value={activeFilter}
                  onChange={(e) => setActiveFilter(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-violet-400"
                >
                  <option value="">All</option>
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">
                Latest Plans
              </h3>
              <div className="rounded-2xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600">
                Total: {filteredPlans.length}
              </div>
            </div>

            {loadingPlans ? (
              <div className="flex min-h-[220px] items-center justify-center">
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                  <FiLoader className="animate-spin" />
                  Loading latest plans...
                </div>
              </div>
            ) : filteredPlans.length === 0 ? (
              <div className="flex min-h-[220px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
                <FiPackage className="mb-3 text-3xl text-slate-400" />
                <p className="text-sm font-medium text-slate-700">
                  No plans found
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Create a new plan or change your filter.
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredPlans.map((plan) => (
                  <div
                    key={plan._id}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:shadow-md"
                  >
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-base font-bold text-slate-900">
                            {plan.name}
                          </h4>
                          <span
                            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                              plan.isActive
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {plan.isActive ? "Active" : "Inactive"}
                          </span>
                          <span className="rounded-full bg-violet-100 px-2.5 py-1 text-[11px] font-semibold text-violet-700">
                            {plan.roleType}
                          </span>
                        </div>

                        <p className="mt-1 text-xs text-slate-500">
                          slug: {plan.slug}
                        </p>

                        {plan.description && (
                          <p className="mt-3 text-sm text-slate-600">
                            {plan.description}
                          </p>
                        )}

                        <div className="mt-4 grid gap-3 sm:grid-cols-3">
                          <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">
                            <p className="text-[11px] font-medium text-slate-500">
                              Price
                            </p>
                            <p className="mt-1 text-sm font-bold text-slate-900">
                              {plan.currency || "BDT"} {plan.price}
                            </p>
                          </div>
                          <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">
                            <p className="text-[11px] font-medium text-slate-500">
                              Duration
                            </p>
                            <p className="mt-1 text-sm font-bold text-slate-900">
                              {plan.durationInDays} days
                            </p>
                          </div>
                          <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">
                            <p className="text-[11px] font-medium text-slate-500">
                              Sort Order
                            </p>
                            <p className="mt-1 text-sm font-bold text-slate-900">
                              {plan.sortOrder ?? 0}
                            </p>
                          </div>
                        </div>

                        {plan.features && (
                          <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                            {Object.entries(plan.features).map(([key, value]) => (
                              <div
                                key={key}
                                className="rounded-xl border border-slate-200 bg-white px-3 py-2"
                              >
                                <p className="text-[11px] font-medium capitalize text-slate-500">
                                  {key}
                                </p>
                                <p className="mt-1 text-sm font-bold text-slate-900">
                                  {typeof value === "boolean"
                                    ? value
                                      ? "Yes"
                                      : "No"
                                    : value}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex shrink-0 gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(plan)}
                          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                        >
                          <FiEdit2 />
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(plan._id)}
                          disabled={deletingId === plan._id}
                          className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:bg-red-300"
                        >
                          {deletingId === plan._id ? (
                            <>
                              <FiLoader className="animate-spin" />
                              Deleting...
                            </>
                          ) : (
                            <>
                              <FiTrash2 />
                              Delete
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white shadow-2xl"
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {editingPlanId ? "Update Plan" : "Create New Plan"}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Name, role, price, duration আর features set করো।
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-2xl border border-slate-200 p-3 text-slate-600 transition hover:bg-slate-50"
                >
                  <FiX />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6 p-6">
                {error && (
                  <div className="flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    <FiAlertCircle />
                    {error}
                  </div>
                )}

                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Plan Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="e.g. Client Premium"
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-violet-400"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Slug *
                    </label>
                    <input
                      type="text"
                      name="slug"
                      value={form.slug}
                      onChange={handleChange}
                      placeholder="e.g. client-premium"
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-violet-400"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Role Type *
                    </label>
                    <select
                      name="roleType"
                      value={form.roleType}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-violet-400"
                    >
                      <option value="client">client</option>
                      <option value="lawyer">lawyer</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Currency
                    </label>
                    <input
                      type="text"
                      name="currency"
                      value={form.currency}
                      onChange={handleChange}
                      placeholder="BDT"
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm uppercase outline-none transition focus:border-violet-400"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Price *
                    </label>
                    <input
                      type="number"
                      name="price"
                      min="0"
                      value={form.price}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-violet-400"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Duration (Days) *
                    </label>
                    <input
                      type="number"
                      name="durationInDays"
                      min="1"
                      value={form.durationInDays}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-violet-400"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Sort Order
                    </label>
                    <input
                      type="number"
                      name="sortOrder"
                      value={form.sortOrder}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-violet-400"
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-8">
                    <input
                      id="isActive"
                      type="checkbox"
                      name="isActive"
                      checked={form.isActive}
                      onChange={handleChange}
                      className="h-4 w-4 rounded border-slate-300"
                    />
                    <label
                      htmlFor="isActive"
                      className="text-sm font-semibold text-slate-700"
                    >
                      Active Plan
                    </label>
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Plan description"
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-violet-400"
                    />
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <h4 className="mb-4 text-lg font-bold text-slate-900">
                    Plan Features
                  </h4>

                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {featureConfig.map((field) => (
                      <div key={field.key}>
                        {field.type === "number" ? (
                          <>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                              {field.label}
                            </label>
                            <input
                              type="number"
                              min="0"
                              name={field.key}
                              value={form.features[field.key]}
                              onChange={handleFeatureChange}
                              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-violet-400"
                            />
                          </>
                        ) : (
                          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                            <input
                              id={field.key}
                              type="checkbox"
                              name={field.key}
                              checked={form.features[field.key]}
                              onChange={handleFeatureChange}
                              className="h-4 w-4 rounded border-slate-300"
                            />
                            <label
                              htmlFor={field.key}
                              className="text-sm font-semibold text-slate-700"
                            >
                              {field.label}
                            </label>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap justify-end gap-3 border-t border-slate-200 pt-5">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="rounded-2xl bg-slate-200 px-5 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-300"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:bg-slate-400"
                  >
                    {submitting ? (
                      <>
                        <FiLoader className="animate-spin" />
                        {editingPlanId ? "Updating..." : "Creating..."}
                      </>
                    ) : (
                      <>
                        <FiCheckCircle />
                        {editingPlanId ? "Update Plan" : "Create Plan"}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminPlanContent;