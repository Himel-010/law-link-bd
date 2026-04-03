import React, { useMemo, useState } from "react";
import {
  FiHome,
  FiUsers,
  FiBriefcase,
  FiBarChart2,
  FiSettings,
  FiBell,
  FiSearch,
  FiChevronRight,
  FiTrendingUp,
  FiCalendar,
  FiActivity,
  FiCreditCard,
  FiMoreHorizontal,
  FiArrowUpRight,
  FiFolder,
  FiClock,
  FiCheckCircle,
  FiGrid,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const Dashboard = () => {
  const [activeMenu, setActiveMenu] = useState("overview");

  const menuItems = [
    { id: "overview", label: "Overview", icon: FiHome },
    { id: "clients", label: "Clients", icon: FiUsers },
    { id: "projects", label: "Projects", icon: FiBriefcase },
    { id: "analytics", label: "Analytics", icon: FiBarChart2 },
    { id: "billing", label: "Billing", icon: FiCreditCard },
    { id: "settings", label: "Settings", icon: FiSettings },
  ];

  const stats = [
    {
      title: "Total Revenue",
      value: "$24,560",
      change: "+12.8%",
      icon: FiTrendingUp,
      sub: "Compared to last month",
    },
    {
      title: "Active Clients",
      value: "1,248",
      change: "+8.2%",
      icon: FiUsers,
      sub: "Returning engagement growing",
    },
    {
      title: "Open Projects",
      value: "38",
      change: "+4.1%",
      icon: FiFolder,
      sub: "Across 6 teams",
    },
    {
      title: "Completion Rate",
      value: "96.4%",
      change: "+2.3%",
      icon: FiCheckCircle,
      sub: "Delivery performance",
    },
  ];

  const activities = [
    {
      title: "New enterprise client onboarded",
      time: "12 min ago",
      tag: "Client",
    },
    {
      title: "Monthly analytics report generated",
      time: "48 min ago",
      tag: "Report",
    },
    {
      title: "Design approval received for Project Nova",
      time: "2 hrs ago",
      tag: "Project",
    },
    {
      title: "Subscription payment successfully processed",
      time: "4 hrs ago",
      tag: "Billing",
    },
  ];

  const projects = [
    {
      name: "Project Nova",
      team: "Design Team",
      progress: 84,
      status: "In Progress",
    },
    {
      name: "Atlas CRM",
      team: "Product Team",
      progress: 67,
      status: "Review",
    },
    {
      name: "Helix Campaign",
      team: "Marketing Team",
      progress: 91,
      status: "Completed",
    },
    {
      name: "Zenith Portal",
      team: "Development Team",
      progress: 42,
      status: "Pending",
    },
  ];

  const clientRows = [
    { name: "Acme Corporation", contact: "Sarah Wilson", plan: "Premium", status: "Active" },
    { name: "Nexus Labs", contact: "James Clark", plan: "Business", status: "Active" },
    { name: "BrightPath", contact: "Emma Lewis", plan: "Standard", status: "Pending" },
    { name: "Orion Tech", contact: "Michael Reed", plan: "Premium", status: "Active" },
  ];

  const analyticsBars = [76, 52, 91, 68, 84, 60, 95];

  const pageTitle = useMemo(() => {
    const found = menuItems.find((item) => item.id === activeMenu);
    return found ? found.label : "Overview";
  }, [activeMenu]);

  const renderContent = () => {
    switch (activeMenu) {
      case "overview":
        return <OverviewContent stats={stats} activities={activities} projects={projects} />;
      case "clients":
        return <ClientsContent clientRows={clientRows} />;
      case "projects":
        return <ProjectsContent projects={projects} />;
      case "analytics":
        return <AnalyticsContent analyticsBars={analyticsBars} />;
      case "billing":
        return <BillingContent />;
      case "settings":
        return <SettingsContent />;
      default:
        return <OverviewContent stats={stats} activities={activities} projects={projects} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="w-[290px] border-r border-white/60 bg-slate-950 text-white">
          <div className="flex h-full flex-col px-5 py-6">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-500 shadow-lg">
                <FiGrid className="text-lg" />
              </div>
              <div>
                <h1 className="text-lg font-semibold tracking-wide">PrimeDesk</h1>
                <p className="text-xs text-slate-400">Professional Dashboard</p>
              </div>
            </div>

            <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-3">
              <div className="flex items-center gap-3">
                <img
                  src="https://i.pravatar.cc/100?img=12"
                  alt="Profile"
                  className="h-12 w-12 rounded-xl object-cover"
                />
                <div>
                  <h2 className="text-sm font-semibold">S.M. Asif Arafat</h2>
                  <p className="text-xs text-slate-400">Administrator</p>
                </div>
              </div>
            </div>

            <nav className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeMenu === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveMenu(item.id)}
                    className={`group relative flex w-full items-center justify-between overflow-hidden rounded-2xl px-4 py-3 text-left transition-all duration-300 ${
                      isActive
                        ? "bg-white text-slate-900 shadow-xl"
                        : "text-slate-300 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <div className="relative z-10 flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-xl transition ${
                          isActive
                            ? "bg-slate-100 text-slate-900"
                            : "bg-white/5 text-slate-300 group-hover:bg-white/10"
                        }`}
                      >
                        <Icon className="text-[18px]" />
                      </div>
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>

                    <FiChevronRight
                      className={`relative z-10 text-sm transition ${
                        isActive ? "translate-x-0 opacity-100" : "-translate-x-1 opacity-0"
                      }`}
                    />

                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 rounded-2xl border border-white/70 bg-white"
                        transition={{ type: "spring", stiffness: 300, damping: 28 }}
                      />
                    )}
                  </button>
                );
              })}
            </nav>

            <div className="mt-auto rounded-3xl border border-white/10 bg-gradient-to-br from-violet-600/20 to-indigo-500/10 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Upgrade</p>
              <h3 className="mt-2 text-lg font-semibold leading-snug">
                Unlock premium tools for better workflow
              </h3>
              <button className="mt-4 w-full rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:scale-[1.02]">
                Go Premium
              </button>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 p-6 md:p-8">
          {/* Top Bar */}
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm text-slate-500">Dashboard / {pageTitle}</p>
              <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
                {pageTitle}
              </h2>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                <FiSearch className="text-slate-400" />
                <input
                  type="text"
                  placeholder="Search anything..."
                  className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                />
              </div>

              <button className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5">
                <FiBell className="text-lg text-slate-700" />
                <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeMenu}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.25 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

const CardShell = ({ children, className = "" }) => (
  <div className={`rounded-3xl border border-slate-200 bg-white p-6 shadow-sm ${className}`}>
    {children}
  </div>
);

const OverviewContent = ({ stats, activities, projects }) => {
  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
            >
              <CardShell className="relative overflow-hidden">
                <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-slate-100 blur-2xl" />
                <div className="relative flex items-start justify-between">
                  <div>
                    <p className="text-sm text-slate-500">{item.title}</p>
                    <h3 className="mt-3 text-3xl font-bold text-slate-900">{item.value}</h3>
                    <p className="mt-2 text-sm font-medium text-emerald-600">{item.change}</p>
                    <p className="mt-1 text-xs text-slate-400">{item.sub}</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white">
                    <Icon className="text-lg" />
                  </div>
                </div>
              </CardShell>
            </motion.div>
          );
        })}
      </div>

      {/* Middle Section */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <CardShell className="xl:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-slate-900">Performance Overview</h3>
              <p className="text-sm text-slate-500">Monthly business growth and engagement</p>
            </div>
            <button className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
              View Report
            </button>
          </div>

          <div className="grid h-[280px] grid-cols-12 items-end gap-3">
            {[45, 62, 58, 80, 72, 90, 76, 95, 68, 88, 74, 98].map((h, idx) => (
              <motion.div
                key={idx}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ duration: 0.5, delay: idx * 0.04 }}
                className="rounded-t-2xl bg-gradient-to-t from-slate-900 to-slate-500"
              />
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
            <span>Jan</span>
            <span>Feb</span>
            <span>Mar</span>
            <span>Apr</span>
            <span>May</span>
            <span>Jun</span>
            <span>Jul</span>
            <span>Aug</span>
            <span>Sep</span>
            <span>Oct</span>
            <span>Nov</span>
            <span>Dec</span>
          </div>
        </CardShell>

        <CardShell>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-slate-900">Schedule</h3>
              <p className="text-sm text-slate-500">Today’s timeline</p>
            </div>
            <FiCalendar className="text-slate-400" />
          </div>

          <div className="mt-6 space-y-4">
            {[
              { title: "Team Standup", time: "09:00 AM", type: "Internal" },
              { title: "Client Review Call", time: "11:30 AM", type: "Meeting" },
              { title: "Analytics Presentation", time: "02:00 PM", type: "Report" },
              { title: "Product Sync", time: "05:00 PM", type: "Planning" },
            ].map((event) => (
              <div
                key={event.title}
                className="flex items-center gap-4 rounded-2xl border border-slate-200 p-4"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                  <FiClock />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-900">{event.title}</h4>
                  <p className="text-sm text-slate-500">{event.time}</p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                  {event.type}
                </span>
              </div>
            ))}
          </div>
        </CardShell>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <CardShell className="xl:col-span-2">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-slate-900">Recent Projects</h3>
              <p className="text-sm text-slate-500">Monitor current work progress</p>
            </div>
            <button className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700">
              Manage
            </button>
          </div>

          <div className="space-y-4">
            {projects.map((project) => (
              <div
                key={project.name}
                className="rounded-2xl border border-slate-200 p-4 transition hover:border-slate-300"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h4 className="text-base font-semibold text-slate-900">{project.name}</h4>
                    <p className="text-sm text-slate-500">{project.team}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-48">
                      <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
                        <span>Progress</span>
                        <span>{project.progress}%</span>
                      </div>
                      <div className="h-2.5 rounded-full bg-slate-100">
                        <div
                          className="h-2.5 rounded-full bg-slate-900"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                      {project.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardShell>

        <CardShell>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-slate-900">Activity Feed</h3>
              <p className="text-sm text-slate-500">Latest updates</p>
            </div>
            <FiActivity className="text-slate-400" />
          </div>

          <div className="space-y-4">
            {activities.map((item, index) => (
              <div key={index} className="flex gap-4">
                <div className="mt-1 flex flex-col items-center">
                  <div className="h-3 w-3 rounded-full bg-slate-900" />
                  {index !== activities.length - 1 && (
                    <div className="mt-2 h-full w-px bg-slate-200" />
                  )}
                </div>
                <div className="pb-5">
                  <h4 className="font-medium text-slate-900">{item.title}</h4>
                  <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                    <span>{item.time}</span>
                    <span>•</span>
                    <span>{item.tag}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardShell>
      </div>
    </div>
  );
};

const ClientsContent = ({ clientRows }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <CardShell>
          <p className="text-sm text-slate-500">Total Clients</p>
          <h3 className="mt-3 text-3xl font-bold text-slate-900">1,248</h3>
          <p className="mt-2 text-sm text-emerald-600">+14 new this week</p>
        </CardShell>
        <CardShell>
          <p className="text-sm text-slate-500">Premium Clients</p>
          <h3 className="mt-3 text-3xl font-bold text-slate-900">382</h3>
          <p className="mt-2 text-sm text-emerald-600">Strong retention rate</p>
        </CardShell>
        <CardShell>
          <p className="text-sm text-slate-500">Pending Approvals</p>
          <h3 className="mt-3 text-3xl font-bold text-slate-900">19</h3>
          <p className="mt-2 text-sm text-amber-600">Needs review today</p>
        </CardShell>
      </div>

      <CardShell>
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-xl font-semibold text-slate-900">Client Directory</h3>
            <p className="text-sm text-slate-500">Manage your client relationships</p>
          </div>
          <button className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-95">
            Add New Client
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-3">
            <thead>
              <tr className="text-left text-sm text-slate-500">
                <th className="px-4">Company</th>
                <th className="px-4">Contact</th>
                <th className="px-4">Plan</th>
                <th className="px-4">Status</th>
                <th className="px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {clientRows.map((client) => (
                <tr key={client.name} className="rounded-2xl bg-slate-50">
                  <td className="rounded-l-2xl px-4 py-4 font-semibold text-slate-900">
                    {client.name}
                  </td>
                  <td className="px-4 py-4 text-slate-600">{client.contact}</td>
                  <td className="px-4 py-4 text-slate-600">{client.plan}</td>
                  <td className="px-4 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        client.status === "Active"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {client.status}
                    </span>
                  </td>
                  <td className="rounded-r-2xl px-4 py-4">
                    <button className="rounded-xl p-2 text-slate-600 transition hover:bg-white">
                      <FiMoreHorizontal />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardShell>
    </div>
  );
};

const ProjectsContent = ({ projects }) => {
  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
      <CardShell className="xl:col-span-2">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-slate-900">Project Board</h3>
            <p className="text-sm text-slate-500">Track and organize team progress</p>
          </div>
          <button className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white">
            New Project
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {projects.map((project) => (
            <div
              key={project.name}
              className="rounded-3xl border border-slate-200 p-5 transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">
                  <FiBriefcase className="text-slate-700" />
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                  {project.status}
                </span>
              </div>

              <h4 className="mt-4 text-lg font-semibold text-slate-900">{project.name}</h4>
              <p className="mt-1 text-sm text-slate-500">{project.team}</p>

              <div className="mt-5">
                <div className="mb-2 flex items-center justify-between text-sm text-slate-500">
                  <span>Progress</span>
                  <span>{project.progress}%</span>
                </div>
                <div className="h-2.5 rounded-full bg-slate-100">
                  <div
                    className="h-2.5 rounded-full bg-slate-900"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              <button className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
                Open Project <FiArrowUpRight />
              </button>
            </div>
          ))}
        </div>
      </CardShell>

      <CardShell>
        <h3 className="text-xl font-semibold text-slate-900">Project Summary</h3>
        <p className="mt-1 text-sm text-slate-500">Quick performance overview</p>

        <div className="mt-6 space-y-5">
          {[
            ["Completed", "18"],
            ["In Progress", "11"],
            ["Pending", "6"],
            ["On Hold", "3"],
          ].map(([label, value]) => (
            <div key={label} className="flex items-center justify-between">
              <span className="text-slate-500">{label}</span>
              <span className="text-lg font-semibold text-slate-900">{value}</span>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-3xl bg-slate-900 p-5 text-white">
          <p className="text-sm text-slate-300">Efficiency Score</p>
          <h4 className="mt-2 text-3xl font-bold">89%</h4>
          <p className="mt-2 text-sm text-slate-300">
            Project delivery performance is staying above target.
          </p>
        </div>
      </CardShell>
    </div>
  );
};

const AnalyticsContent = ({ analyticsBars }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
        {[
          ["Visits", "48.2K"],
          ["Conversions", "3.86K"],
          ["Bounce Rate", "18.4%"],
          ["Avg. Session", "6m 12s"],
        ].map(([title, value]) => (
          <CardShell key={title}>
            <p className="text-sm text-slate-500">{title}</p>
            <h3 className="mt-3 text-3xl font-bold text-slate-900">{value}</h3>
          </CardShell>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <CardShell className="xl:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-slate-900">Traffic Analytics</h3>
              <p className="text-sm text-slate-500">Weekly performance breakdown</p>
            </div>
            <button className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700">
              Export
            </button>
          </div>

          <div className="flex h-[320px] items-end gap-4">
            {analyticsBars.map((bar, index) => (
              <div key={index} className="flex flex-1 flex-col items-center gap-3">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${bar}%` }}
                  transition={{ duration: 0.5, delay: index * 0.06 }}
                  className="w-full rounded-t-3xl bg-gradient-to-t from-slate-900 to-slate-400"
                />
                <span className="text-xs text-slate-400">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index]}
                </span>
              </div>
            ))}
          </div>
        </CardShell>

        <CardShell>
          <h3 className="text-xl font-semibold text-slate-900">Top Metrics</h3>
          <p className="mt-1 text-sm text-slate-500">Channel performance</p>

          <div className="mt-6 space-y-5">
            {[
              ["Organic Search", "72%"],
              ["Direct Traffic", "58%"],
              ["Paid Campaigns", "43%"],
              ["Referral", "31%"],
            ].map(([label, value]) => (
              <div key={label}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-slate-500">{label}</span>
                  <span className="font-semibold text-slate-900">{value}</span>
                </div>
                <div className="h-2.5 rounded-full bg-slate-100">
                  <div className="h-2.5 rounded-full bg-slate-900" style={{ width: value }} />
                </div>
              </div>
            ))}
          </div>
        </CardShell>
      </div>
    </div>
  );
};

const BillingContent = () => {
  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
      <CardShell className="xl:col-span-2">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-slate-900">Billing Overview</h3>
            <p className="text-sm text-slate-500">Payments and invoices summary</p>
          </div>
          <button className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white">
            Create Invoice
          </button>
        </div>

        <div className="space-y-4">
          {[
            ["INV-1001", "Acme Corporation", "$1,250", "Paid"],
            ["INV-1002", "Nexus Labs", "$860", "Pending"],
            ["INV-1003", "BrightPath", "$2,100", "Paid"],
            ["INV-1004", "Orion Tech", "$740", "Overdue"],
          ].map(([invoice, client, amount, status]) => (
            <div
              key={invoice}
              className="flex flex-col gap-4 rounded-2xl border border-slate-200 p-4 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <h4 className="font-semibold text-slate-900">{invoice}</h4>
                <p className="text-sm text-slate-500">{client}</p>
              </div>
              <div className="text-slate-700">{amount}</div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  status === "Paid"
                    ? "bg-emerald-100 text-emerald-700"
                    : status === "Pending"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {status}
              </span>
            </div>
          ))}
        </div>
      </CardShell>

      <CardShell>
        <h3 className="text-xl font-semibold text-slate-900">Current Plan</h3>
        <p className="mt-1 text-sm text-slate-500">Premium business subscription</p>

        <div className="mt-6 rounded-3xl bg-slate-900 p-6 text-white">
          <p className="text-sm text-slate-300">Plan</p>
          <h4 className="mt-2 text-3xl font-bold">Business Pro</h4>
          <p className="mt-3 text-sm text-slate-300">$49 / month</p>
        </div>

        <div className="mt-6 space-y-4">
          {["Unlimited projects", "Priority support", "Advanced analytics", "Team access"].map(
            (feature) => (
              <div key={feature} className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100">
                  <FiCheckCircle className="text-slate-700" />
                </div>
                <span className="text-sm text-slate-700">{feature}</span>
              </div>
            )
          )}
        </div>
      </CardShell>
    </div>
  );
};

const SettingsContent = () => {
  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
      <CardShell className="xl:col-span-2">
        <h3 className="text-xl font-semibold text-slate-900">Account Settings</h3>
        <p className="mt-1 text-sm text-slate-500">Manage profile and preferences</p>

        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-600">Full Name</label>
            <input
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-400"
              defaultValue="S.M. Asif Arafat"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-600">Email Address</label>
            <input
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-400"
              defaultValue="arafat@example.com"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-600">Company</label>
            <input
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-400"
              defaultValue="PrimeDesk Studio"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-600">Phone</label>
            <input
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-400"
              defaultValue="+880 1XXX-XXXXXX"
            />
          </div>
        </div>

        <button className="mt-6 rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:opacity-95">
          Save Changes
        </button>
      </CardShell>

      <CardShell>
        <h3 className="text-xl font-semibold text-slate-900">Preferences</h3>
        <p className="mt-1 text-sm text-slate-500">Customize workspace behavior</p>

        <div className="mt-6 space-y-4">
          {[
            "Email notifications",
            "Weekly summary reports",
            "Auto-save drafts",
            "Enable dark preview mode",
          ].map((item, index) => (
            <div
              key={item}
              className="flex items-center justify-between rounded-2xl border border-slate-200 p-4"
            >
              <span className="text-sm font-medium text-slate-700">{item}</span>
              <div
                className={`relative h-7 w-12 rounded-full transition ${
                  index < 3 ? "bg-slate-900" : "bg-slate-200"
                }`}
              >
                <div
                  className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
                    index < 3 ? "left-6" : "left-1"
                  }`}
                />
              </div>
            </div>
          ))}
        </div>
      </CardShell>
    </div>
  );
};

export default Dashboard;