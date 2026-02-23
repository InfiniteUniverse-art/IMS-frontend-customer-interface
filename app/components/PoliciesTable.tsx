"use client";

import React, { useMemo } from "react";
import DataTable from "./DataTable";
import type { ColumnDef } from "@tanstack/react-table";

type Policy = {
  policy_number: string;
  type?: string;
  status?: string;
  coverage_amount?: string;
  premium?: string;
};

export default function PoliciesTable() {
  const columns = useMemo<ColumnDef<Policy, any>[]>(
    () => [
      { accessorKey: "policy_number", header: "POLICY NUMBER" },
      { accessorKey: "type", header: "TYPE" },
      { accessorKey: "status", header: "STATUS" },
      { accessorKey: "coverage_amount", header: "COVERAGE AMOUNT" },
      { accessorKey: "premium", header: "PREMIUM" },
      {
        id: "actions",
        header: "ACTIONS",
        cell: () => <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm">View Claims</button>,
      },
    ],
    []
  );

  return <DataTable<Policy> fetchUrl={'/api/v1/policies'} columns={columns} title={'My Policies'} initialPageSize={5} />;
}
