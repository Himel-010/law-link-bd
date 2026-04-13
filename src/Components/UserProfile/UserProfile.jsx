"use client";

import { useMemo } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  FaUserCircle,
  FaEnvelope,
  FaPhoneAlt,
  FaIdCard,
  FaBalanceScale,
  FaUserShield,
  FaCheckCircle,
  FaTimesCircle,
  FaCrown,
  FaCalendarAlt,
  FaRegEdit,
  FaShieldAlt,
} from "react-icons/fa";
import { MdVerifiedUser, MdSubscriptions } from "react-icons/md";
import { RiProfileLine } from "react-icons/ri";

const UserProfile = () => {
  const currentUser = useSelector((state) => state.user.currentUser);

  const user = useMemo(() => {
    if (!currentUser) {
      try {
        const localUser = localStorage.getItem("currentUser");
        const sessionUser = sessionStorage.getItem("currentUser");
        return localUser
          ? JSON.parse(localUser)
          : sessionUser
          ? JSON.parse(sessionUser)
          : null;
      } catch (error) {
        return null;
      }
    }
    return currentUser;
  }, [currentUser]);

  const getInitials = (name = "") => {
    const parts = name.trim().split(" ").filter(Boolean);
    if (parts.length === 0) return "U";
    if (parts.length === 1) return parts[0][0]?.toUpperCase() || "U";
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not available";
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "Not available";
    return date.toLocaleDateString("en-BD", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getRoleBadgeStyle = (role) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-700 border border-purple-200";
      case "lawyer":
        return "bg-cyan-100 text-cyan-700 border border-cyan-200";
      default:
        return "bg-amber-100 text-amber-700 border border-amber-200";
    }
  };

  const getSubscriptionBadgeStyle = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700 border border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border border-yellow-200";
      case "expired":
        return "bg-red-100 text-red-700 border border-red-200";
      case "cancelled":
        return "bg-gray-100 text-gray-700 border border-gray-200";
      default:
        return "bg-slate-100 text-slate-700 border border-slate-200";
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-white flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-lg w-full bg-white rounded-3xl shadow-2xl border border-slate-100 p-10 text-center"
        >
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-cyan-500 to-cyan-700 flex items-center justify-center text-white text-4xl shadow-lg">
            <FaUserCircle />
          </div>

          <h2 className="mt-6 text-3xl font-bold text-slate-800">
            No User Found
          </h2>
          <p className="mt-3 text-slate-500 text-base leading-relaxed">
            Please sign in first to view your professional profile dashboard.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mt-14 min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50/40 to-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="relative overflow-hidden rounded-[28px] bg-white border border-slate-200 shadow-[0_20px_70px_rgba(0,0,0,0.06)]"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-cyan-500 to-sky-500 opacity-95"></div>
          <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl -translate-y-20 translate-x-20"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl translate-y-20 -translate-x-20"></div>

          <div className="relative px-6 md:px-10 py-10 md:py-12">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white text-3xl md:text-4xl font-bold shadow-xl"
                >
                  {getInitials(user?.name)}
                </motion.div>

                <div className="text-white">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                      {user?.name || "Unnamed User"}
                    </h1>
                    <span
                      className={`px-4 py-1.5 rounded-full text-sm font-semibold backdrop-blur-md bg-white/15 border border-white/20 capitalize`}
                    >
                      {user?.role || "client"}
                    </span>
                  </div>

                  <p className="text-white/90 text-base md:text-lg flex items-center gap-2">
                    <FaEnvelope className="text-white/90" />
                    {user?.email || "No email available"}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold ${getSubscriptionBadgeStyle(
                        user?.subscriptionStatus
                      )}`}
                    >
                      Subscription: {user?.subscriptionStatus || "none"}
                    </span>

                    <span className="px-4 py-2 rounded-full text-sm font-semibold bg-white/15 border border-white/20 text-white">
                      Joined: {formatDate(user?.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white text-cyan-700 font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  <FaRegEdit />
                  Edit Profile
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-900/20 text-white border border-white/20 backdrop-blur-md font-semibold hover:bg-slate-900/30 transition-all"
                >
                  <FaShieldAlt />
                  Account Security
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mt-8">
          {/* Left Side */}
          <div className="xl:col-span-2 space-y-8">
            {/* Personal Information */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="bg-white rounded-[26px] border border-slate-200 shadow-[0_12px_40px_rgba(0,0,0,0.05)] p-6 md:p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-cyan-100 text-cyan-700 flex items-center justify-center text-xl">
                  <RiProfileLine />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">
                    Personal Information
                  </h2>
                  <p className="text-slate-500 text-sm">
                    Your core account and identity details
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <InfoCard
                  icon={<FaUserCircle />}
                  label="Full Name"
                  value={user?.name || "Not available"}
                />
                <InfoCard
                  icon={<FaEnvelope />}
                  label="Email Address"
                  value={user?.email || "Not available"}
                />
                <InfoCard
                  icon={<FaPhoneAlt />}
                  label="Phone Number"
                  value={user?.phone || "Not available"}
                />
                <InfoCard
                  icon={<FaUserShield />}
                  label="User Role"
                  value={user?.role || "client"}
                  capitalize
                />
              </div>
            </motion.div>

            {/* Professional / Legal Info */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.2 }}
              className="bg-white rounded-[26px] border border-slate-200 shadow-[0_12px_40px_rgba(0,0,0,0.05)] p-6 md:p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-xl">
                  <FaBalanceScale />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">
                    Professional & Legal Information
                  </h2>
                  <p className="text-slate-500 text-sm">
                    Lawyer specific or account verification related data
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <InfoCard
                  icon={<FaIdCard />}
                  label="National ID (NID)"
                  value={user?.nid || "Not available"}
                />
                <InfoCard
                  icon={<FaBalanceScale />}
                  label="Law Registration Number"
                  value={user?.lawRegNumber || "Not available"}
                />
                <InfoCard
                  icon={<MdVerifiedUser />}
                  label="Phone Verification"
                  value={user?.phoneVerified === 1 ? "Verified" : "Not Verified"}
                />
                <InfoCard
                  icon={<FaCalendarAlt />}
                  label="Account Created"
                  value={formatDate(user?.createdAt)}
                />
              </div>
            </motion.div>

            {/* Account Activity / Summary */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.3 }}
              className="bg-white rounded-[26px] border border-slate-200 shadow-[0_12px_40px_rgba(0,0,0,0.05)] p-6 md:p-8"
            >
              <h2 className="text-2xl font-bold text-slate-800 mb-6">
                Account Summary
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <SummaryCard
                  title="Current Role"
                  value={user?.role || "client"}
                  icon={<FaUserShield />}
                  styleClass={getRoleBadgeStyle(user?.role)}
                />
                <SummaryCard
                  title="Subscription"
                  value={user?.subscriptionStatus || "none"}
                  icon={<MdSubscriptions />}
                  styleClass={getSubscriptionBadgeStyle(user?.subscriptionStatus)}
                />
                <SummaryCard
                  title="Phone Status"
                  value={user?.phoneVerified === 1 ? "Verified" : "Unverified"}
                  icon={
                    user?.phoneVerified === 1 ? (
                      <FaCheckCircle />
                    ) : (
                      <FaTimesCircle />
                    )
                  }
                  styleClass={
                    user?.phoneVerified === 1
                      ? "bg-green-100 text-green-700 border border-green-200"
                      : "bg-red-100 text-red-700 border border-red-200"
                  }
                />
              </div>
            </motion.div>
          </div>

          {/* Right Side */}
          <div className="space-y-8">
            {/* Subscription Card */}
            <motion.div
              initial={{ opacity: 0, x: 25 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45, delay: 0.15 }}
              className="bg-white rounded-[26px] border border-slate-200 shadow-[0_12px_40px_rgba(0,0,0,0.05)] p-6"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white flex items-center justify-center text-xl shadow-md">
                  <FaCrown />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">
                    Subscription Plan
                  </h3>
                  <p className="text-sm text-slate-500">
                    Your current membership overview
                  </p>
                </div>
              </div>

              <div
                className={`rounded-2xl p-5 ${getSubscriptionBadgeStyle(
                  user?.subscriptionStatus
                )}`}
              >
                <p className="text-sm font-medium mb-2">Status</p>
                <h4 className="text-2xl font-extrabold capitalize">
                  {user?.subscriptionStatus || "none"}
                </h4>
              </div>

              <div className="mt-5 space-y-4">
                <MiniDetail
                  label="Current Subscription ID"
                  value={user?.currentSubscription || "No active subscription"}
                />
                <MiniDetail
                  label="Account Type"
                  value={(user?.role || "client").toUpperCase()}
                />
              </div>

              <button className="w-full mt-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-600 to-cyan-700 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all">
                Manage Subscription
              </button>
            </motion.div>

            {/* Verification Card */}
            <motion.div
              initial={{ opacity: 0, x: 25 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45, delay: 0.25 }}
              className="bg-white rounded-[26px] border border-slate-200 shadow-[0_12px_40px_rgba(0,0,0,0.05)] p-6"
            >
              <h3 className="text-xl font-bold text-slate-800 mb-5">
                Verification Status
              </h3>

              <div className="space-y-4">
                <StatusRow
                  icon={<FaEnvelope />}
                  label="Email Available"
                  status={!!user?.email}
                />
                <StatusRow
                  icon={<FaPhoneAlt />}
                  label="Phone Added"
                  status={!!user?.phone}
                />
                <StatusRow
                  icon={<MdVerifiedUser />}
                  label="Phone Verified"
                  status={user?.phoneVerified === 1}
                />
                <StatusRow
                  icon={<FaBalanceScale />}
                  label="Lawyer Credentials"
                  status={!!user?.lawRegNumber}
                />
                <StatusRow
                  icon={<FaIdCard />}
                  label="NID Submitted"
                  status={!!user?.nid}
                />
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 25 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45, delay: 0.35 }}
              className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[26px] p-6 text-white shadow-[0_20px_50px_rgba(15,23,42,0.28)]"
            >
              <h3 className="text-xl font-bold mb-2">Quick Actions</h3>
              <p className="text-slate-300 text-sm mb-6">
                Keep your profile secure and updated for better account
                experience.
              </p>

              <div className="space-y-3">
                <ActionButton icon={<FaRegEdit />} label="Update Profile" />
                <ActionButton icon={<FaShieldAlt />} label="Security Settings" />
                <ActionButton
                  icon={<MdSubscriptions />}
                  label="Billing & Subscription"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoCard = ({ icon, label, value, capitalize = false }) => {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 hover:shadow-md transition-all"
    >
      <div className="flex items-start gap-4">
        <div className="w-11 h-11 rounded-xl bg-white text-cyan-700 flex items-center justify-center text-lg shadow-sm border border-slate-100">
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-sm text-slate-500 font-medium">{label}</p>
          <h4
            className={`mt-1 text-base font-bold text-slate-800 break-words ${
              capitalize ? "capitalize" : ""
            }`}
          >
            {value}
          </h4>
        </div>
      </div>
    </motion.div>
  );
};

const SummaryCard = ({ title, value, icon, styleClass }) => {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="rounded-2xl border border-slate-200 p-5 bg-white shadow-sm"
    >
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-slate-500 font-medium">{title}</p>
        <div className="text-slate-600 text-lg">{icon}</div>
      </div>

      <div
        className={`inline-flex px-4 py-2 rounded-full text-sm font-bold capitalize ${styleClass}`}
      >
        {value}
      </div>
    </motion.div>
  );
};

const MiniDetail = ({ label, value }) => {
  return (
    <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 font-semibold text-slate-800 break-words">{value}</p>
    </div>
  );
};

const StatusRow = ({ icon, label, status }) => {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-white text-cyan-700 flex items-center justify-center border border-slate-100">
          {icon}
        </div>
        <span className="font-medium text-slate-700">{label}</span>
      </div>

      <div
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold ${
          status
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        {status ? <FaCheckCircle /> : <FaTimesCircle />}
        {status ? "Done" : "Missing"}
      </div>
    </div>
  );
};

const ActionButton = ({ icon, label }) => {
  return (
    <motion.button
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.98 }}
      className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/10 border border-white/10 text-white hover:bg-white/15 transition-all"
    >
      <span className="text-lg">{icon}</span>
      <span className="font-medium">{label}</span>
    </motion.button>
  );
};

export default UserProfile;