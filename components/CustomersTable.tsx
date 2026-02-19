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
  const columns = useMemo<ColumnDef<Customer, any>[]>(
    () => [
      {
        id: "name",
        header: "NAME",
        cell: ({ row }) => {
          const r = row.original;
          const initials = `${r.first_name?.[0] || ""}${r.last_name?.[0] || ""}`.toUpperCase();
          return (
            <div className="flex items-center">
              <div className="h-9 w-9 rounded-full bg-slate-200 flex items-center justify-center text-sm font-medium text-slate-700">
                {initials}
              </div>
              <div className="ml-3">
                <div className="font-medium">{r.first_name} {r.last_name}</div>
                <div className="text-sm text-gray-500">{r.email}</div>
              </div>
            </div>
          );
        },
      },
      { accessorKey: "email", header: "EMAIL ADDRESS" },
      { accessorKey: "phone", header: "PHONE NUMBER" },
      { accessorKey: "gender", header: "GENDER" },
      { accessorKey: "age", header: "AGE" },
      {
        id: "policies",
        header: "POLICIES",
        cell: () => <a className="text-blue-600 hover:underline">View (1)</a>,
      },
      {
        id: "actions",
        header: "ACTIONS",
        cell: () => (
          <div className="flex items-center space-x-2 text-gray-600">
            <button className="p-1 hover:text-blue-600" aria-label="edit">✏️</button>
            <button className="p-1 hover:text-red-600" aria-label="delete">🗑️</button>
          </div>
        ),
      },
    ],
    []
  );

  return <DataTable<Customer> fetchUrl={'http://localhost:3000/api/v1/customers'} columns={columns} title={'Customer Directory'} initialPageSize={5} />;
}
