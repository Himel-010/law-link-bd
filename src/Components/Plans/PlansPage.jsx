"use client";

import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  FiSearch,
  FiFilter,
  FiClock,
  FiCheckCircle,
  FiBriefcase,
  FiUser,
  FiUsers,
  FiShield,
  FiMessageCircle,
  FiStar,
  FiArrowRight,
  FiLoader,
  FiAlertCircle,
} from "react-icons/fi";
import { motion } from "framer-motion";

const API_BASE_URL = "http://localhost:4000/api";

const roleOptions = [
  { id: "client", label: "Client Plans", icon: FiUser },
  { id: "lawyer", label: "Lawyer Plans", icon: FiBriefcase },
];

const getFeatureLabel = (key) => {
  const map = {
    casePostLimit: "Case Post Limit",
    proposalLimit: "Proposal Limit",
    shortlistLimit: "Shortlist Limit",
    proposalCredits: "Proposal Credits",
    priorityAccess: "Priority Access",
    profileBoost: "Profile Boost",
    unlimitedChat: "Unlimited Chat",
    paidConsultationEnabled: "Paid Consultation",
    shortlistUnlockEnabled: "Shortlist Unlock",
  };

  return map[key] || key;
};

const formatFeatureValue = (value) => {
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (value === 999999 || value === 9999) return "Unlimited";
  return value;
};

const PlanCard = ({ plan }) => {
  const visibleFeatures = Object.entries(plan.features || {}).filter(
    ([, value]) => value !== false && value !== 0 && value !== null
  );

  return (
    <motion.div
      className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 hover:border-cyan-300"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 260 }}
    >
      <div className="mb-6">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700 mb-3">
              <FiShield className="w-3.5 h-3.5" />
              {plan.roleType === "client" ? "Client Plan" : "Lawyer Plan"}
            </div>
            <h3 className="text-2xl font-bold text-slate-800">{plan.name}</h3>
            <p className="text-sm text-slate-500 mt-1">{plan.description || "No description available."}</p>
          </div>

          {plan.isActive && (
            <div className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
              Active
            </div>
          )}
        </div>

        <div className="flex items-end gap-2 mb-4">
          <span className="text-4xl font-bold text-slate-900">
            ৳{Number(plan.price || 0).toLocaleString()}
          </span>
          <span className="text-slate-500 text-sm mb-1">
            / {plan.durationInDays} days
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-slate-50 border border-slate-200 px-3 py-3">
            <p className="text-xs text-slate-500 mb-1">Duration</p>
            <div className="flex items-center gap-2 text-slate-800 font-semibold">
              <FiClock className="w-4 h-4 text-cyan-600" />
              {plan.durationInDays} Days
            </div>
          </div>

          <div className="rounded-lg bg-slate-50 border border-slate-200 px-3 py-3">
            <p className="text-xs text-slate-500 mb-1">Role</p>
            <div className="flex items-center gap-2 text-slate-800 font-semibold">
              {plan.roleType === "client" ? (
                <FiUsers className="w-4 h-4 text-cyan-600" />
              ) : (
                <FiBriefcase className="w-4 h-4 text-cyan-600" />
              )}
              {plan.roleType}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-sm font-semibold text-slate-700 mb-3">Included Features</h4>

        {visibleFeatures.length > 0 ? (
          <div className="space-y-2">
            {visibleFeatures.map(([key, value]) => (
              <div
                key={key}
                className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"
              >
                <div className="flex items-center gap-2 text-slate-700">
                  <FiCheckCircle className="w-4 h-4 text-green-600 shrink-0" />
                  <span className="text-sm">{getFeatureLabel(key)}</span>
                </div>
                <span className="text-sm font-semibold text-slate-900">
                  {formatFeatureValue(value)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-4 text-sm text-slate-500">
            No notable features listed for this plan.
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <motion.button
          className="flex-1 bg-cyan-600 text-white py-3 rounded-lg font-semibold hover:bg-cyan-700 transition-colors flex items-center justify-center gap-2"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          Choose Plan
          <FiArrowRight className="w-4 h-4" />
        </motion.button>

        <motion.button
          className="px-4 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-slate-700 font-medium"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          Details
        </motion.button>
      </div>
    </motion.div>
  );
};

const PlansPage = () => {
  const [activeRole, setActiveRole] = useState("client");
  const [searchTerm, setSearchTerm] = useState("");
  const [priceFilter, setPriceFilter] = useState("all");
  const [plansByRole, setPlansByRole] = useState({
    client: [],
    lawyer: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPlans = async () => {
    try {
      setLoading(true);
      setError("");

      const [clientRes, lawyerRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/plans`, {
          params: { roleType: "client" },
        }),
        axios.get(`${API_BASE_URL}/plans`, {
          params: { roleType: "lawyer" },
        }),
      ]);

      setPlansByRole({
        client: clientRes.data?.data || [],
        lawyer: lawyerRes.data?.data || [],
      });
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load plans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const activePlans = useMemo(() => {
    return plansByRole[activeRole] || [];
  }, [plansByRole, activeRole]);

  const filteredPlans = useMemo(() => {
    return activePlans.filter((plan) => {
      const q = searchTerm.trim().toLowerCase();

      const matchesSearch =
        !q ||
        plan.name?.toLowerCase().includes(q) ||
        plan.description?.toLowerCase().includes(q) ||
        plan.slug?.toLowerCase().includes(q);

      const matchesPrice =
        priceFilter === "all" ||
        (priceFilter === "free" && Number(plan.price) === 0) ||
        (priceFilter === "paid" && Number(plan.price) > 0);

      return matchesSearch && matchesPrice;
    });
  }, [activePlans, searchTerm, priceFilter]);

  const totalPlans = plansByRole.client.length + plansByRole.lawyer.length;

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-cyan-100 px-4 py-2 text-sm font-semibold text-cyan-700 mb-5">
            <FiStar className="w-4 h-4" />
            Flexible Pricing Plans
          </div>

          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            Choose the Right Plan for You
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Explore separate plans for clients and lawyers with flexible pricing, duration, and premium features.
          </p>
        </motion.div>

        <motion.div
          className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-3">
              {roleOptions.map((role) => {
                const Icon = role.icon;
                const isActive = activeRole === role.id;

                return (
                  <button
                    key={role.id}
                    onClick={() => setActiveRole(role.id)}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                      isActive
                        ? "bg-cyan-600 text-white shadow-md"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {role.label}
                  </button>
                );
              })}
            </div>

            <div className="rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-600">
              Total Public Plans: <span className="font-bold text-slate-900">{totalPlans}</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search plans..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 bg-white"
              />
            </div>

            <select
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
              className="px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 bg-white"
            >
              <option value="all">All Plans</option>
              <option value="free">Free Plans</option>
              <option value="paid">Paid Plans</option>
            </select>

            <button
              type="button"
              onClick={fetchPlans}
              className="bg-cyan-600 text-white px-6 py-3 rounded-lg hover:bg-cyan-700 transition-colors flex items-center justify-center gap-2 font-semibold"
            >
              <FiFilter className="w-4 h-4" />
              Refresh Plans
            </button>
          </div>
        </motion.div>

        <motion.div
          className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-slate-600">
            Showing <span className="font-semibold text-slate-800">{filteredPlans.length}</span> of{" "}
            <span className="font-semibold text-slate-800">{activePlans.length}</span>{" "}
            {activeRole} plans
          </p>

          <div className="text-sm text-slate-500">
            Currently viewing:{" "}
            <span className="font-semibold text-cyan-700 capitalize">{activeRole}</span>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="inline-flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm text-slate-700">
              <FiLoader className="w-5 h-5 animate-spin text-cyan-600" />
              Loading plans...
            </div>
          </div>
        ) : error ? (
          <div className="flex justify-center py-16">
            <div className="max-w-xl w-full rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-red-700 flex items-start gap-3">
              <FiAlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold">Could not load plans</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        ) : filteredPlans.length === 0 ? (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-4">
              <FiMessageCircle className="w-7 h-7" />
            </div>
            <p className="text-slate-700 text-lg font-semibold">
              No plans found matching your criteria.
            </p>
            <p className="text-slate-500 mt-2">
              Try changing role, search term, or filter.
            </p>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredPlans.map((plan) => (
              <PlanCard key={plan._id || `${plan.roleType}-${plan.slug}`} plan={plan} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlansPage;