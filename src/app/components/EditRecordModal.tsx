import { useState } from "react";

const EditRecordModal = ({ recordToUpdate }) => {
  const recordName = recordToUpdate[0];
  const recordVal = recordToUpdate[1];
  const [isModalVisible, setisModalVisible] = useState(true);

  const closeModal = () => {
    setisModalVisible(false);
  };
  return (
    <>
      {isModalVisible && (
        <div
          className="fixed inset-0 bg-white bg-opacity-10 flex justify-center items-center"
          onClick={closeModal}
        >
          <div
            className="bg-[#03001A] sm:min-w-[880px] h-fit flex flex-col justify-center items-center border border-[#2A2A51] rounded-lg p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <h1 className="font-azeret text-white text-xl">
              Edit {recordName} record
            </h1>
            <div className="bg-gradient-to-r from-transparent to-transparent via-[#7C7CFF] w-full h-[1px] my-5" />
            <input
              className="bg-[#03001A] text-white h-[64px] w-full text-center border border-[#2A2A51] rounded-lg"
              placeholder="Enter new record"
            />
            <div className="flex justify-between items-center w-full mt-10 space-x-4">
              <button className="w-1/2 h-[64px] rounded-[24px] border-opacity-20 border-white border-[1px] text-white font-azeret">
                Cancel
              </button>
              <button className="w-1/2 h-[64px] rounded-[24px] border-opacity-20 border-white border-[1px] text-white font-azeret">
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EditRecordModal;
