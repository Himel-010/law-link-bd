import React, { useMemo, useState } from "react";
import {
  FiHome,
  FiUsers,
  FiBriefcase,
  FiBarChart2,
  FiSettings,
  FiCreditCard,
  FiTrendingUp,
  FiFolder,
  FiCheckCircle,
  FiFileText,
  FiLayers,
  FiPackage,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import OverviewContent from "./OverviewContent";
import ClientsContent from "./ClientsContent";
import ProjectsContent from "./ProjectsContent";
import AnalyticsContent from "./AnalyticsContent";
import BillingContent from "./BillingContent";
import SettingsContent from "./SettingsContent";
import PostContent from "./PostContent";
import AdminSubscriptionContent from "./AdminSubscription";
import AdminPlanContent from "./AdminPlanContent";

const Dashboard = () => {
  const [activeMenu, setActiveMenu] = useState("overview");

  const menuItems = [
    { id: "overview", label: "Overview", icon: FiHome },
    { id: "clients", label: "Clients", icon: FiUsers },
    { id: "projects", label: "Projects", icon: FiBriefcase },
    { id: "posts", label: "Posts", icon: FiFileText },
    { id: "plans", label: "Plans", icon: FiPackage },
    { id: "subscriptions", label: "Subscriptions", icon: FiLayers },
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
    {
      name: "Acme Corporation",
      contact: "Sarah Wilson",
      plan: "Premium",
      status: "Active",
    },
    {
      name: "Nexus Labs",
      contact: "James Clark",
      plan: "Business",
      status: "Active",
    },
    {
      name: "BrightPath",
      contact: "Emma Lewis",
      plan: "Standard",
      status: "Pending",
    },
    {
      name: "Orion Tech",
      contact: "Michael Reed",
      plan: "Premium",
      status: "Active",
    },
  ];

  const analyticsBars = [76, 52, 91, 68, 84, 60, 95];

  const posts = [
    {
      id: 1,
      title: "Launch Update for PrimeDesk 2.0",
      category: "Announcement",
      author: "Admin Team",
      status: "Published",
      date: "12 Apr 2026",
      views: "12.4K",
    },
    {
      id: 2,
      title: "How to Improve Team Productivity",
      category: "Blog",
      author: "Sarah Wilson",
      status: "Draft",
      date: "10 Apr 2026",
      views: "4.1K",
    },
    {
      id: 3,
      title: "Monthly Product Roadmap Highlights",
      category: "Update",
      author: "Product Team",
      status: "Published",
      date: "08 Apr 2026",
      views: "8.7K",
    },
    {
      id: 4,
      title: "New Client Success Story",
      category: "Case Study",
      author: "Emma Lewis",
      status: "Review",
      date: "06 Apr 2026",
      views: "2.9K",
    },
  ];

  const pageTitle = useMemo(() => {
    const found = menuItems.find((item) => item.id === activeMenu);
    return found ? found.label : "Overview";
  }, [activeMenu]);

  const renderContent = () => {
    switch (activeMenu) {
      case "overview":
        return (
          <OverviewContent
            stats={stats}
            activities={activities}
            projects={projects}
          />
        );
      case "clients":
        return <ClientsContent clientRows={clientRows} />;
      case "projects":
        return <ProjectsContent projects={projects} />;
      case "posts":
        return <PostContent posts={posts} />;
      case "plans":
        return <AdminPlanContent />;
      case "subscriptions":
        return <AdminSubscriptionContent />;
      case "analytics":
        return <AnalyticsContent analyticsBars={analyticsBars} />;
      case "billing":
        return <BillingContent />;
      case "settings":
        return <SettingsContent />;
      default:
        return (
          <OverviewContent
            stats={stats}
            activities={activities}
            projects={projects}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <div className="flex min-h-screen">
        <Sidebar
          menuItems={menuItems}
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
        />

        <main className="flex-1 px-6 pb-8 pt-24 md:px-8 md:pb-10 md:pt-28">
          <Topbar pageTitle={pageTitle} />

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

export default Dashboard;