"use client";

import React, { useMemo } from "react";
import DataTable from "./DataTable";
import type { ColumnDef } from "@tanstack/react-table";

type Customer = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  gender: string;
  age: number;
  profile_image?: string | null;
  policy_id?: number;
};

export default function CustomersTable() {
  const columns = useMemo<ColumnDef<Customer>[]>(
    () => [
      {
        id: "name",
        header: "Name",
        cell: ({ row }) => {
          const r = row.original;
          const initials = `${r.first_name?.[0] || ""}${r.last_name?.[0] || ""}`.toUpperCase();
          return (
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700 border border-blue-200">
                {initials}
              </div>
              <div className="ml-3">
                <div className="font-semibold text-gray-900">{r.first_name} {r.last_name}</div>
                <div className="text-xs text-gray-500">{r.phone}</div>
              </div>
            </div>
          );
        },
      },
      { accessorKey: "email", header: "Email Address" },
      { accessorKey: "gender", header: "Gender" },
      { accessorKey: "age", header: "Age" },
      {
        id: "policies",
        header: "Policies",
        cell: () => (
          <button className="text-blue-600 font-medium hover:text-blue-800 transition-colors">
            View (1)
          </button>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: () => (
          <div className="flex items-center space-x-3 text-gray-400">
            <button className="hover:text-blue-600 transition-colors" title="Edit">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            </button>
            <button className="hover:text-red-600 transition-colors" title="Delete">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <DataTable<Customer> 
        fetchUrl="http://localhost:3000/api/v1/customers" 
        columns={columns} 
        title="Customer Directory" 
        initialPageSize={5} 
      />
    </div>
  );
}