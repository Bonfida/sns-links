// import { useState } from "react";
// import EditRecordModal from "./EditRecordModal";

// const RecordCard = ({ record }: { record: string }) => {
//   const [editingRecord, setEditingRecord] = useState(false);

//   const handleEdit = () => {
//     if (!editingRecord) {
//       setEditingRecord(true);
//     } else {
//       setEditingRecord(false);
//     }
//   };
//   return (
//     <div className="group h-20 w-56 items-center my-3 flex flex-col border border-[#2A2A51] rounded-lg justify-center">
//       <div className="w-56 border-b border-[#2A2A51] flex items-center justify-center">
//         <h1 className="font-bold text-center text-white">
//           {record[0].charAt(0).toUpperCase() + record[0].slice(1)}
//         </h1>
//         <button
//           className="transition-opacity duration-300 opacity-0 group-hover:opacity-100"
//           onClick={handleEdit}
//         >
//           <img src="/edit-icon.svg" />
//         </button>
//       </div>
//       <div className="flex items-end justify-center h-10">
//         {editingRecord ? (
//           <EditRecordModal
//             recordToUpdate={record}
//             setEditingRecord={setEditingRecord}
//           />
//         ) : (
//           <h1 className="text-center text-white">{record[1]}</h1>
//         )}
//       </div>
//     </div>
//   );
// };

// export default RecordCard;
