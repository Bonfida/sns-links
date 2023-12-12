"use client";
import { useContext, useState, useMemo, Dispatch, SetStateAction } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  createColumnHelper,
  flexRender,
  getFilteredRowModel,
  ColumnHelper,
} from "@tanstack/react-table";
import { useFetchDomains } from "@/hooks/useFetchDomains";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { useRouter } from "next/navigation";
import SelectedDomainContext from "@/context/selectedDomain";
import Loading from "./Loading";

const DomainTable = () => {
  const { connected, publicKey } = useWallet();
  const { connection } = useConnection();
  const { data: domainsOwned, isLoading: domainsLoading } = useFetchDomains(
    connection,
    publicKey
  );
  const router = useRouter();
  const [search, setSearch] = useState<string>("");

  const { setSelectedDomain, selectedDomain } = useContext(
    SelectedDomainContext
  );

  const handleClick = (domain: any) => {
    setSelectedDomain(domain);
    console.log("domain in table", domain);

    router.push(`/links/${domain}`);
  };

  const columnHelper: ColumnHelper<unknown> = createColumnHelper();
  const columns = [
    columnHelper.accessor((row) => row, {
      id: "domain",
      header: "Domain",
      cell: (info) => (
        <div className="flex flex-col items-center justify-center">
          <span>{info.getValue() as string}.sol</span>
          <button
            onClick={() => handleClick(info.getValue())}
            className="text-slate-600 mt-2"
          >
            View
          </button>
        </div>
      ),
    }),
  ];

  const globalFilterFn = (row: any, columnId: any, filterValue: any) => {
    return row.original.domain
      .toLowerCase()
      .includes(filterValue.toLowerCase());
  };
  const filterFns = useMemo(
    () => ({
      global: globalFilterFn,
    }),
    []
  );

  const table = useReactTable({
    data: domainsOwned!,
    columns,
    filterFns,
    state: {
      globalFilter: search,
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  //ToDo update styling, add search and filter
  return (
    <div className="relative flex flex-col items-center ">
      <div className="md:w-[200px] md:h-[200px] w-[75px] h-[75px] rounded-full bg-gradient-to-r -top-[50px] -right-[100px] absolute from-indigo-500 blur-lg z-0" />
      <div className="md:w-[200px] md:h-[200px] w-[75px] h-[75px] rounded-full bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% -bottom-[50px] -left-[100px] z-0 absolute  blur-lg" />
      {domainsLoading ? (
        <Loading />
      ) : (
        <div className="border-[1px] bg-white/10 backdrop-blur-sm border-white/20 rounded-xl space-y-2 p-10  mt-10 md:w-[800px] sm:w-[500px] w-[350px]">
          <Filter search={search} setSearch={setSearch} />
          <table className="z-10 w-full mt-4 text-white items-center justify-center table-fixed">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      className="p-4 w-1/4 text-center rounded-tl-xl align-middle rounded-xl text-lg md:text-base bg-[#191C30] "
                      colSpan={header.colSpan}
                      key={header.id}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="items-center justify-center">
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="justify-center border-b-[1px] border-white border-opacity-20 items-center p-4 text-sm md:text-base text-center font-semibold"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DomainTable;

const Filter = ({
  search,
  setSearch,
}: {
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
}) => {
  return (
    <div>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search Domains"
        className="search-input bg-inherit rounded-xl"
      />
    </div>
  );
};
