import { Button } from "@/components/ui/button";
import {
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import React, { useEffect, useState } from "react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import axios from "axios";
import Papa from "papaparse";
import { useToast } from "@/hooks/use-toast";
import { handleSave } from "@/utils";

const Edit = ({ fileContent, fileName }) => {
  const [originalData, setOriginalData] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [edit, setEdit] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const toast = useToast();
  useEffect(() => {
    setOriginalData(fileContent);
  }, [fileContent]);

  const columns = React.useMemo(
    () =>
      originalData.length > 0
        ? Object.keys(originalData[0]).map((key) => ({
            Header: key,
            accessor: key,
            id: key,
          }))
        : [],
    [originalData]
  );

  const table = useReactTable({
    data: originalData,
    columns: columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="p-4">
      {fileContent.length > 0 ? (
        <>
          <div className="flex justify-end items-center mb-4">
            <Button onClick={() => setEdit(!edit)} className="ml-4">
              {edit ? "Disable Edit Mode" : "Enable Edit Mode"}
            </Button>

            <Button
              onClick={() => {
                handleSave(setIsSaving, originalData, fileName, setEdit, toast);
              }}
              className="ml-4 bg-green-400 hover:bg-green-800 rounded-xl text-white"
            >
              {isSaving ? (
                <div className="flex justify-center items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white-500"></div>
                </div>
              ) : (
                "Save"
              )}
            </Button>
          </div>

          <div className="overflow-x-auto">
            <Table className="min-w-full border-collapse border border-gray-300">
              <TableCaption className="text-left text-sm text-gray-500">
                Changes will not be saved until you click the Save button.
              </TableCaption>
              <TableHeader className="bg-gray-100">
                <TableRow>
                  {table.getHeaderGroups().map((headerGroup) =>
                    headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        className="px-4 py-2 border border-gray-300 text-left font-semibold"
                      >
                        {header?.column?.columnDef?.Header}
                      </TableHead>
                    ))
                  )}
                </TableRow>
              </TableHeader>

              <TableBody>
                {table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="hover:bg-gray-50 even:bg-gray-100"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="px-4 py-2 border border-gray-300"
                      >
                        {edit ? (
                          <Input
                            type="text"
                            value={row.original[cell.column.id]}
                            onChange={(e) =>
                              setOriginalData((prev) => {
                                const updated = [...prev];
                                updated[row.index][cell.column.id] =
                                  e.target.value;
                                return updated;
                              })
                            }
                            className="border rounded p-1 text-sm w-full"
                          />
                        ) : (
                          <span className="text-sm">
                            {row.original[cell.column.id]}
                          </span>
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <Button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="px-4 py-2"
            >
              Previous
            </Button>
            <span className="text-sm">
              Page{" "}
              <strong>
                {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
              </strong>
            </span>
            <Button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="px-4 py-2"
            >
              Next
            </Button>
          </div>
        </>
      ) : (
        <p className="text-gray-500 text-center">We are not having any file</p>
      )}
    </div>
  );
};

export default Edit;
