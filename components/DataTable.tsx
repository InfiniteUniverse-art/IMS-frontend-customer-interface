"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

type DataTableProps<T> = {
  fetchUrl: string;
  columns: ColumnDef<T, any>[];
  title?: string;
  initialPageSize?: number;
  pageSizeOptions?: number[];
};

export default function DataTable<T extends object>({
  fetchUrl,
  columns,
  title,
  initialPageSize = 5,
  pageSizeOptions = [5, 10, 20, 50],
}: DataTableProps<T>) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(initialPageSize);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetch(fetchUrl)
      .then((r) => r.json())
      .then((json) => {
        if (!mounted) return;
        setData(Array.isArray(json) ? json : []);
      })
      .catch(() => {
        if (!mounted) return;
        setData([]);
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [fetchUrl]);

  const table = useReactTable({
    data,
    columns: columns as ColumnDef<any, any>[],
    state: { globalFilter, pagination: { pageIndex, pageSize } as any },
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: ({ pageIndex: pi, pageSize: ps }: any) => {
      if (typeof pi === "number") setPageIndex(pi);
      if (typeof ps === "number") setPageSize(ps);
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">{title || "Directory"}</h2>
        <div className="flex items-center space-x-3">
          <input
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search..."
            className="border rounded px-3 py-2 text-sm w-80"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm divide-y divide-gray-200">
          <thead className="text-gray-500 text-xs uppercase">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((h) => (
                  <th key={h.id} className="px-4 py-3 text-left">
                    {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="p-6 text-center text-gray-500">Loading...</td>
              </tr>
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3 align-top">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="p-6 text-center text-gray-500">No records found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-600">
          Showing {data.length ? 1 + pageIndex * pageSize : 0} - {Math.min((pageIndex + 1) * pageSize, data.length)} of {data.length}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <div className="px-3 py-1 border rounded bg-blue-600 text-white">{pageIndex + 1}</div>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="border rounded px-2 py-1 text-sm"
          >
            {pageSizeOptions.map((s) => (
              <option key={s} value={s}>{s} / page</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
