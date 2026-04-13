import React from "react";
import { motion } from "framer-motion";
import { FiCalendar, FiClock, FiActivity } from "react-icons/fi";

const OverviewContent = ({ stats, activities, projects }) => {
  return (
    <div className="space-y-6">
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
              <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
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
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
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
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
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
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
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
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
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
        </div>
      </div>
    </div>
  );
};

export default OverviewContent;