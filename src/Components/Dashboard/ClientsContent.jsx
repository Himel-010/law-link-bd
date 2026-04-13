import React from "react";
import { FiMoreHorizontal } from "react-icons/fi";

const ClientsContent = ({ clientRows }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Total Clients</p>
          <h3 className="mt-3 text-3xl font-bold text-slate-900">1,248</h3>
          <p className="mt-2 text-sm text-emerald-600">+14 new this week</p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Premium Clients</p>
          <h3 className="mt-3 text-3xl font-bold text-slate-900">382</h3>
          <p className="mt-2 text-sm text-emerald-600">Strong retention rate</p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Pending Approvals</p>
          <h3 className="mt-3 text-3xl font-bold text-slate-900">19</h3>
          <p className="mt-2 text-sm text-amber-600">Needs review today</p>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
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
      </div>
    </div>
  );
};

export default ClientsContent;