import React from "react";
import { FiCheckCircle } from "react-icons/fi";

const BillingContent = () => {
  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
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
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
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
      </div>
    </div>
  );
};

export default BillingContent;