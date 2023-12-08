import { useContext } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  createColumnHelper,
  flexRender,
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

  const { setSelectedDomain, selectedDomain } = useContext(
    SelectedDomainContext
  );

  const handleClick = (domain: any) => {
    setSelectedDomain(domain);
    console.log("domain in table", domain);

    router.push(`/links/${domain}`);
  };

  const columnHelper = createColumnHelper();
  const columns = [
    columnHelper.accessor((row) => row, {
      id: "domain",
      header: "Domain",
      cell: (info) => info.getValue(),
    }),

    columnHelper.display({
      id: "actions",
      header: "View Links",
      cell: (props) => (
        <button
          className="py-1 px-2 bg-blue-600 rounded-xl"
          onClick={() => {
            let domain = props.row.getValue("domain");
            handleClick(domain);
          }}
        >
          View
        </button>
      ),
    }),
  ];

  const table = useReactTable({
    data: domainsOwned!,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="relative flex flex-col items-center">
      <div className="w-[200px] h-[200px] rounded-full bg-gradient-to-r -top-[50px] -right-[100px] absolute from-indigo-500 blur-lg z-0" />
      <div className="w-[200px] h-[200px] rounded-full bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% -bottom-[50px] -left-[100px] z-0 absolute  blur-lg" />
      {domainsLoading ? (
        <Loading />
      ) : (
        <div className="border-[1px] bg-white/10 backdrop-blur-sm border-white/20 rounded-xl space-y-2 p-10  md:mt-10 mt-28 max-w-[800px]">
          <table className="z-10 w-full mt-4 text-white items-center justify-center table-fixed">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      className="p-4 w-1/4 text-center rounded-tl-xl rounded-tr-xl text-sm md:text-base bg-[#191C30] "
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
                      className="justify-center border-b-[1px] border-white border-opacity-20 items-center p-4 text-xs md:text-base text-center font-semibold"
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
