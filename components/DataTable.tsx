"use client";

import React, { useEffect, useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  PaginationState,
  Updater,
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
  
  // Manage pagination state
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: initialPageSize,
  });

  // Fetch Data
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    
    // Reset to page 1 when the URL changes to avoid "empty page" bugs
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));

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
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => { mounted = false; };
  }, [fetchUrl]);

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
      pagination: { pageIndex, pageSize },
    },
    onGlobalFilterChange: setGlobalFilter,
    // FIX: Correctly handle the functional updater from TanStack Table
    onPaginationChange: (updater: Updater<PaginationState>) => {
      setPagination((old) => {
        const next = typeof updater === "function" ? updater(old) : updater;
        return next;
      });
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      {/* Header Area */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">{title || "Directory"}</h2>
        <input
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search records..."
          className="border border-gray-300 rounded-md px-4 py-2 text-sm w-72 focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* Table Area */}
      <div className="overflow-x-auto rounded-md border border-gray-200">
        <table className="min-w-full text-sm divide-y divide-gray-200">
          <thead className="bg-gray-50 text-gray-600 text-xs uppercase font-semibold">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((h) => (
                  <th key={h.id} className="px-4 py-3 text-left tracking-wider">
                    {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody className="divide-y divide-gray-100 bg-white">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="p-10 text-center text-gray-400">
                  <div className="animate-pulse">Loading data...</div>
                </td>
              </tr>
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-4 whitespace-nowrap">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="p-10 text-center text-gray-500">
                  No records found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-gray-500">
          Showing <strong>{table.getRowModel().rows.length ? (pageIndex * pageSize) + 1 : 0}</strong> to{" "}
          <strong>{Math.min((pageIndex + 1) * pageSize, data.length)}</strong> of <strong>{data.length}</strong> results
        </div>

        <div className="flex items-center space-x-3">
          <select
            value={pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            className="border rounded-md px-2 py-1.5 text-sm bg-white outline-none focus:border-blue-500"
          >
            {pageSizeOptions.map((s) => (
              <option key={s} value={s}>{s} per page</option>
            ))}
          </select>

          <div className="flex items-center bg-gray-100 rounded-md p-1">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="px-3 py-1 text-sm font-medium rounded hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent transition-all"
            >
              Back
            </button>
            <span className="px-4 text-sm font-bold text-blue-600">{pageIndex + 1}</span>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="px-3 py-1 text-sm font-medium rounded hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent transition-all"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}