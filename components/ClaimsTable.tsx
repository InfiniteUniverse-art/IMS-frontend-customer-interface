"use client";

import React, { useMemo } from "react";
import DataTable from "./DataTable";
import type { ColumnDef } from "@tanstack/react-table";

type Claim = {
  id: number;
  claim_number: string;
  policy_reference?: string;
  amount?: number;
  status?: string;
  date?: string;
  remarks?: string;
};

export default function ClaimsTable() {
  const columns = useMemo<ColumnDef<Claim, any>[]>(
    () => [
      { accessorKey: "id", header: "ID" },
      { accessorKey: "claim_number", header: "CLAIM NUMBER" },
      { accessorKey: "policy_reference", header: "POLICY REFERENCE" },
      { accessorKey: "amount", header: "AMOUNT ($)" },
      { accessorKey: "status", header: "STATUS" },
      { accessorKey: "date", header: "DATE" },
      { accessorKey: "remarks", header: "REMARKS" },
    ],
    []
  );

  return <DataTable<Claim> fetchUrl={'/api/v1/claims'} columns={columns} title={'Claim Details'} initialPageSize={6} />;
}
