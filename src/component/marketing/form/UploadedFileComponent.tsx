import { useEffect, useState } from "react";
import { MdAttachFile } from "react-icons/md";

interface Types {
  file: any;
  deletePdf: (idx: number | string | null,id:number|any) => void;
  idx: number | string;
}

export default function UploadedFileComponent({ file, deletePdf, idx }: Types) {
  const [fileName, setFileName] = useState<string | null>(null);

  const handleRemove = () => {
    if (file.type === "text/csv") {
      deletePdf(null);
    } else {
      deletePdf(idx, file.id);
    }
  };

  useEffect(() => {
    if (file.file_type === "products" || file.file_type === "knowledge") {
      const name = file.file_name.split("/").pop();
      setFileName(name);
    } else {
      setFileName(file?.name || null);
    }
  }, [file]);

  if (!file) return null;

  return (
    <div className="flex bg-[#161616] w-full align-center rounded-xl h-20">
      <div className="w-1/6 bg-[#272727] flex items-center justify-center rounded-tl-xl rounded-bl-xl border-r-[1px] border-[#3d3d3d]">
        <MdAttachFile size={30} />
      </div>
      <div className="w-5/6 flex justify-between items-center mx-5">
        <h1>{fileName}</h1>
        <div className="flex flex-row gap-5">
          <div className="flex flex-row items-center justify-center text-white rounded-xl">
            <button
              type="button"
              onClick={handleRemove}
              className="bg-red-500 text-white font-medium py-2 px-4 rounded-xl flex items-center"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
