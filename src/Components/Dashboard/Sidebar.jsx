import React from "react";
import { FiChevronRight, FiGrid } from "react-icons/fi";
import { motion } from "framer-motion";

const Sidebar = ({ menuItems, activeMenu, setActiveMenu }) => {
  return (
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
  );
};

export default Sidebar;