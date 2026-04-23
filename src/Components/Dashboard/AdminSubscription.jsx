import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:4000/api";

const initialForm = {
  userId: "",
  roleType: "client",
  planName: "free",
  startDate: "",
  status: "",
  paymentStatus: "",
  transactionId: "",
  paymentMethod: "",
  notes: "",
};

const getStoredAuth = () => {
  const localUser = localStorage.getItem("currentUser");
  const sessionUser = sessionStorage.getItem("currentUser");
  const localToken = localStorage.getItem("token");
  const sessionToken = sessionStorage.getItem("token");

  let user = null;
  let token = "";

  try {
    if (localUser) {
      user = JSON.parse(localUser);
      token = localToken || "";
    } else if (sessionUser) {
      user = JSON.parse(sessionUser);
      token = sessionToken || "";
    }
  } catch (error) {
    console.error("Auth parse error:", error);
  }

  return { user, token };
};

const AdminSubscriptionContent = () => {
  const [form, setForm] = useState(initialForm);
  const [plans, setPlans] = useState({});
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");
  const [authUser, setAuthUser] = useState(null);
  const [token, setToken] = useState("");

  useEffect(() => {
    const auth = getStoredAuth();
    setAuthUser(auth.user);
    setToken(auth.token);
  }, []);

  const isAdmin = useMemo(() => {
    return authUser?.role === "admin";
  }, [authUser]);

  useEffect(() => {
    if (token) {
      fetchPlans();
    }
  }, [token]);

  const fetchPlans = async () => {
    try {
      setLoadingPlans(true);
      setError("");

      const res = await axios.get(`${API_BASE_URL}/subscriptions/plans`, {
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {},
        withCredentials: true,
      });

      setPlans(res.data?.data || {});
      setPaymentMethods(res.data?.paymentMethods || []);

      const defaultRole = "client";
      const defaultPlan =
        Object.keys(res.data?.data?.[defaultRole] || {})[0] || "free";

      setForm((prev) => ({
        ...prev,
        roleType: defaultRole,
        planName: defaultPlan,
      }));
    } catch (err) {
      setError(
        err?.response?.data?.message || "Failed to load subscription plans"
      );
    } finally {
      setLoadingPlans(false);
    }
  };

  const availablePlans = useMemo(() => {
    return Object.keys(plans?.[form.roleType] || {});
  }, [plans, form.roleType]);

  const selectedPlanDetails = useMemo(() => {
    return plans?.[form.roleType]?.[form.planName] || null;
  }, [plans, form.roleType, form.planName]);

  const isPaidPlan = useMemo(() => {
    return (selectedPlanDetails?.price || 0) > 0;
  }, [selectedPlanDetails]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => {
      const updated = {
        ...prev,
        [name]: value,
      };

      if (name === "roleType") {
        const nextPlans = Object.keys(plans?.[value] || {});
        updated.planName = nextPlans[0] || "";
      }

      if (name === "planName") {
        const nextPlan = plans?.[prev.roleType]?.[value];
        if (nextPlan?.price === 0) {
          updated.paymentStatus = "paid";
          updated.paymentMethod = "";
          updated.transactionId = "";
        }
      }

      return updated;
    });

    setError("");
    setResponse(null);
  };

  const buildPayload = () => {
    const payload = {
      userId: form.userId.trim(),
      roleType: form.roleType,
      planName: form.planName,
    };

    if (form.startDate) payload.startDate = form.startDate;
    if (form.status) payload.status = form.status;
    if (form.notes.trim()) payload.notes = form.notes.trim();

    if (isPaidPlan) {
      if (form.paymentStatus) payload.paymentStatus = form.paymentStatus;
      if (form.transactionId.trim()) {
        payload.transactionId = form.transactionId.trim();
      }
      if (form.paymentMethod) payload.paymentMethod = form.paymentMethod;
    } else {
      payload.paymentStatus = "paid";
    }

    return payload;
  };

  const validateForm = () => {
    if (!token) return "Login token paoa jai nai. Please abar login koro.";
    if (!authUser) return "Current user data paoa jai nai. Please abar login koro.";
    if (!isAdmin) return "Only admin can create subscription.";
    if (!form.userId.trim()) return "userId is required";
    if (!form.roleType) return "roleType is required";
    if (!form.planName) return "planName is required";

    if (isPaidPlan) {
      const finalStatus = form.status || "pending";
      const finalPaymentStatus = form.paymentStatus || "unpaid";

      const needsPaymentInfo =
        finalPaymentStatus === "paid" || finalStatus === "active";

      if (needsPaymentInfo && !form.paymentMethod) {
        return "paymentMethod is required for paid/active subscription";
      }

      if (form.paymentMethod && !paymentMethods.includes(form.paymentMethod)) {
        return "Invalid payment method";
      }
    }

    return "";
  };

  const handleSubmit = async (e) => {
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

      const res = await axios.post(
        `${API_BASE_URL}/subscriptions/admin/create`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      setResponse(res.data);

      setForm((prev) => ({
        ...initialForm,
        roleType: prev.roleType,
        planName: Object.keys(plans?.[prev.roleType] || {})[0] || "free",
      }));
    } catch (err) {
      setError(
        err?.response?.data?.message || "Failed to create subscription"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!token) {
    return (
      <div className="rounded-3xl border border-red-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">
          Admin Create Subscription
        </h2>
        <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          Login token paoa jai nai. Please abar login koro.
        </div>
      </div>
    );
  }

  if (!authUser) {
    return (
      <div className="rounded-3xl border border-orange-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">
          Admin Create Subscription
        </h2>
        <div className="mt-4 rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-700">
          Current user data paoa jai nai. Please abar login koro.
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="rounded-3xl border border-orange-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">
          Admin Create Subscription
        </h2>
        <div className="mt-4 rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-700">
          Logged in user admin na. Ei page access korte admin account diye login korte hobe.
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900">
            Admin Create Subscription
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Admin panel theke user er jonno subscription create koro.
          </p>
        </div>

        <div className="mb-6 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
          <strong>Logged in as:</strong> {authUser?.name || "Admin"} (
          {authUser?.email || "No email"}) — role: {authUser?.role}
        </div>

        {loadingPlans ? (
          <p className="text-sm text-slate-500">Loading plans...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  User ID *
                </label>
                <input
                  type="text"
                  name="userId"
                  value={form.userId}
                  onChange={handleChange}
                  placeholder="Enter target user MongoDB ObjectId"
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
                  Plan Name *
                </label>
                <select
                  name="planName"
                  value={form.planName}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-violet-400"
                >
                  {availablePlans.map((plan) => (
                    <option key={plan} value={plan}>
                      {plan}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={form.startDate}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-violet-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Status
                </label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-violet-400"
                >
                  <option value="">Auto Select</option>
                  <option value="pending">pending</option>
                  <option value="active">active</option>
                  <option value="expired">expired</option>
                  <option value="cancelled">cancelled</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Payment Status
                </label>
                <select
                  name="paymentStatus"
                  value={form.paymentStatus}
                  onChange={handleChange}
                  disabled={!isPaidPlan}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition disabled:bg-slate-100 focus:border-violet-400"
                >
                  <option value="">
                    {isPaidPlan ? "Auto Select" : "Free Plan Auto Paid"}
                  </option>
                  {isPaidPlan && <option value="unpaid">unpaid</option>}
                  {isPaidPlan && <option value="paid">paid</option>}
                  {isPaidPlan && <option value="failed">failed</option>}
                  {isPaidPlan && <option value="refunded">refunded</option>}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Payment Method
                </label>
                <select
                  name="paymentMethod"
                  value={form.paymentMethod}
                  onChange={handleChange}
                  disabled={!isPaidPlan}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition disabled:bg-slate-100 focus:border-violet-400"
                >
                  <option value="">
                    {isPaidPlan ? "Select method" : "Not needed"}
                  </option>
                  {paymentMethods.map((method) => (
                    <option key={method} value={method}>
                      {method}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Transaction ID
                </label>
                <input
                  type="text"
                  name="transactionId"
                  value={form.transactionId}
                  onChange={handleChange}
                  placeholder="Optional"
                  disabled={!isPaidPlan}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition disabled:bg-slate-100 focus:border-violet-400"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Optional admin note"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-violet-400"
                />
              </div>
            </div>

            {selectedPlanDetails && (
              <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-slate-700">
                <div className="mb-2 font-semibold text-slate-900">
                  Plan Summary
                </div>
                <p>
                  <strong>Price:</strong> ৳{selectedPlanDetails.price}
                </p>
                <p>
                  <strong>Duration:</strong>{" "}
                  {selectedPlanDetails.durationInDays} days
                </p>
              </div>
            )}

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {response?.success && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {response?.message || "Subscription created successfully"}
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {submitting ? "Creating..." : "Create Subscription"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setForm((prev) => ({
                    ...initialForm,
                    roleType: prev.roleType,
                    planName:
                      Object.keys(plans?.[prev.roleType] || {})[0] || "free",
                  }));
                  setError("");
                  setResponse(null);
                }}
                className="rounded-2xl bg-slate-200 px-5 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-300"
              >
                Reset
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-bold text-slate-900">
            Selected Plan Info
          </h3>

          <div className="space-y-2 text-sm text-slate-600">
            <p>
              <strong className="text-slate-900">Role:</strong> {form.roleType}
            </p>
            <p>
              <strong className="text-slate-900">Plan:</strong> {form.planName}
            </p>
            <p>
              <strong className="text-slate-900">Price:</strong> ৳
              {selectedPlanDetails?.price ?? 0}
            </p>
            <p>
              <strong className="text-slate-900">Duration:</strong>{" "}
              {selectedPlanDetails?.durationInDays ?? 0} days
            </p>
            <p>
              <strong className="text-slate-900">Payment Required:</strong>{" "}
              {isPaidPlan ? "Yes" : "No"}
            </p>
          </div>
        </div>

        {selectedPlanDetails?.features && (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-bold text-slate-900">
              Selected Plan Features
            </h3>

            <div className="grid gap-3">
              {Object.entries(selectedPlanDetails.features).map(
                ([key, value]) => (
                  <div
                    key={key}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-3"
                  >
                    <p className="text-xs font-medium capitalize text-slate-500">
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
                )
              )}
            </div>
          </div>
        )}

        {response?.data && (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-bold text-slate-900">
              Created Subscription
            </h3>

            <div className="space-y-2 break-all text-sm text-slate-600">
              <p>
                <strong className="text-slate-900">ID:</strong>{" "}
                {response.data._id}
              </p>
              <p>
                <strong className="text-slate-900">User:</strong>{" "}
                {response.data.user}
              </p>
              <p>
                <strong className="text-slate-900">Role:</strong>{" "}
                {response.data.roleType}
              </p>
              <p>
                <strong className="text-slate-900">Plan:</strong>{" "}
                {response.data.planName}
              </p>
              <p>
                <strong className="text-slate-900">Status:</strong>{" "}
                {response.data.status}
              </p>
              <p>
                <strong className="text-slate-900">Price:</strong> ৳
                {response.data.price}
              </p>
              <p>
                <strong className="text-slate-900">Start:</strong>{" "}
                {response.data.startDate
                  ? new Date(response.data.startDate).toLocaleDateString()
                  : "-"}
              </p>
              <p>
                <strong className="text-slate-900">End:</strong>{" "}
                {response.data.endDate
                  ? new Date(response.data.endDate).toLocaleDateString()
                  : "-"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSubscriptionContent;