// import React, {
//   useState,
//   ChangeEvent,
//   FormEvent,
//   useEffect,
// } from "react";
// import { FiUpload, FiX } from "react-icons/fi"; // Import FiX for delete icon
// import useBrandStore from "@/store/useBrandStore";
// import { ClipLoader } from "react-spinners";
// import getPdfsFromWorkspace from "@/lib/getPdfsFromWorkspace";
// import configureWorkspace from "@/lib/configureWorkspace";
// import toast, { Toaster } from "react-hot-toast";
// import FaqComponent from "../FaqComponent";
// import { FAQ } from "../../../../types";

// interface FormData {
//   pdfs: File[];
//   faqs: FAQ[];
//   customInstruction: string;
//   brandDescription: string;
// }

// const Form: React.FC = () => {
//   const userId = useBrandStore((state) => state.userId);
//   const brandName = useBrandStore((state) => state.brandName);
//   const brandDescription = useBrandStore((state) => state.brandDescription);
//   const brandDomain = useBrandStore((state) => state.brandDomain);
//   const brandFaqs = useBrandStore((state) => state.faqs);
//   const brandCustomInstruction = useBrandStore(
//     (state) => state.customInstruction
//   );
//   const [documents, setDocuments] = useState<any[]>([]);
//   const [deletedDocuments, setDeletedDocuments] = useState<any[]>([]);
//   const [loading, setIsLoading] = useState(false);

//   const setBrandDescription = useBrandStore(
//     (state) => state.setBrandDescription
//   );
//   const setBrandDomain = useBrandStore((state) => state.setBrandDomain);
//   const setFaqs = useBrandStore((state) => state.setFaqs);
//   const setCustomInstruction = useBrandStore(
//     (state) => state.setCustomInstruction
//   );

//   const [formData, setFormData] = useState<FormData>({
//     pdfs: [],
//     faqs: [],
//     customInstruction: "",
//     brandDescription: "",
//   });
//   const [isFormModified, setIsFormModified] = useState(false);

//   useEffect(() => {
//     const fetchData = async () => {
//       setFormData({
//         pdfs: [],
//         faqs: brandFaqs,
//         customInstruction: brandCustomInstruction,
//         brandDescription: brandDescription,
//       });
//       const data = await getPdfsFromWorkspace(userId);
//       console.log("pdf", data);

//       setDocuments(data);
//     };
//     fetchData();
//   }, []);

//   const handleInputChange = (
//     e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => {
//       const updatedFormData = { ...prev, [name]: value };
//       setIsFormModified(true); // Set form as modified when any input changes
//       return updatedFormData;
//     });
//   };

//   const handlePdfs = (e: ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       const newFiles = Array.from(e.target.files);
//       setFormData((prev) => {
//         const updatedFiles = [...prev.pdfs, ...newFiles];
//         const totalSize = updatedFiles.reduce(
//           (acc, file) => acc + file.size,
//           0
//         );
//         if (totalSize > 10 * 1024 * 1024) {
//           alert(
//             "The total file size exceeds 10 MB. Please select smaller files."
//           );
//           return prev;
//         }
//         setIsFormModified(true);
//         return { ...prev, pdfs: updatedFiles }; // Update pdfs, not uploadKnowledge
//       });
//       e.target.value = "";
//     }
//   };

//   const handleDeletePdf = (index: number) => {
//     setFormData((prev) => {
//       const updatedFiles = prev.pdfs.filter((_, idx) => idx !== index);
//       setIsFormModified(true);
//       return { ...prev, pdfs: updatedFiles };
//     });
//   };

//   const handleDeleteDocument = (docId: number) => {
//     // Find the document that is being deleted
//     const deletedDoc = documents.find((doc) => doc.id === docId);

//     if (deletedDoc) {
//       // Update documents and track deleted ones
//       setDocuments((prev) => prev.filter((doc) => doc.id !== docId));
//       setIsFormModified(true);
//       setDeletedDocuments((prev) => [...prev, deletedDoc]); // Store the entire document object
//     }
//   };

//   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setIsLoading(true);

//     const submissionData = {
//       userId,
//       brandName:
//         formData.brandDescription !== brandDescription ? brandName : "", // Brand name from the store
//       brandDescription:
//         formData.brandDescription !== brandDescription
//           ? formData.brandDescription
//           : "", // New brand description from formData
//       brandDomain:
//         formData.brandDescription !== brandDescription ? brandDomain : "", // Brand domain from the store
//       pdfs: formData.pdfs.map((file) => file), // List of uploaded PDFs by name
//       deletedDocuments: deletedDocuments, // Deleted documents (full object)
//       faqs: formData.faqs !== brandFaqs ? formData.faqs : "", // FAQs from formData
//       customInstruction:
//         formData.customInstruction != brandCustomInstruction
//           ? formData.customInstruction
//           : "", // Custom instructions from formData
//     };

//     try {
//       const response = await configureWorkspace(submissionData);
//       console.log("Workspace configured successfully:", response);
//       if (formData.brandDescription !== brandDescription)
//         setBrandDescription(formData.brandDescription);
//       if (formData.brandDescription !== brandDescription)
//         setBrandDomain(formData.brandDescription);
//       if (formData.faqs !== brandFaqs) setFaqs(formData.faqs);
//       if (formData.customInstruction !== brandCustomInstruction)
//         setCustomInstruction(formData.customInstruction);
//       toast.success("Workspace configured successfully!");
//       setIsLoading(false);
//     } catch (error) {
//       console.error("Error configuring workspace:", error);
//       toast.error("Error configuring workspace. Please try again.");
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="h-full">
//       {/* Overlay with spinner */}
//       {loading && (
//         <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center z-50">
//           <ClipLoader color="white" loading={loading} size={50} />
//         </div>
//       )}

//       <form
//         onSubmit={handleSubmit}
//         className="flex flex-col justify-between h-full"
//       >
//         <div>
//           {/* Brand Name */}
//           <div className="mb-4">
//             <label
//               htmlFor="brandName"
//               className="block text-sm font-semibold text-[#FAFAFA]"
//             >
//               Brand Name:
//             </label>
//             <div className="mt-1 text-sm block w-full border border-[#2d2d2d] rounded-xl p-2 bg-transparent text-white focus:outline-none focus:ring-0 focus:border-[#4d4d4d] ">
//               {brandName}
//             </div>
//           </div>

//           <div className="mb-4">
//             <label
//               htmlFor="brandDescription"
//               className="block text-[16px] font-semibold text-[#FAFAFA]"
//             >
//               Brand Description:
//             </label>
//             <textarea
//               id="brandDescription"
//               name="brandDescription"
//               value={formData.brandDescription}
//               onChange={handleInputChange}
//               placeholder="Enter brand description"
//               className="mt-1 text-sm block w-full border border-[#2d2d2d] rounded-xl p-2 bg-transparent text-white focus:outline-none focus:ring-0 focus:border-[#4d4d4d] "
//               rows={6}
//             ></textarea>
//           </div>

//           {/* Upload Knowledge PDFs */}
//           <div className="mb-4">
//             <label
//               htmlFor="pdfs"
//               className="block text-sm font-semibold text-[#FAFAFA] "
//             >
//               Upload PDFs:
//             </label>
//             <div className="relative mt-1 mb-4">
//               <input
//                 type="file"
//                 id="pdfs"
//                 name="pdfs"
//                 accept="application/pdf"
//                 multiple
//                 onChange={handlePdfs}
//                 className="absolute inset-0 opacity-0 z-50 cursor-pointer"
//                     aria-label="Upload PDF files"
//               />
//               <div className="mt-1 text-sm flex items-center justify-between w-full border border-[#2d2d2d] rounded-xl px-2 py-[5px] bg-transparent text-white focus:outline-none focus:ring-0 focus:border-[#4d4d4d] ">
//                 <span className="text-white text-base">Upload</span>
//                 <FiUpload className="mr-1" />
//               </div>
//             </div>

//             {/* Preview PDFs */}
//             {formData.pdfs.length > 0 && (
//               <div className="flex flex-wrap ml-4 mr-2">
//                 {formData.pdfs.map((file, idx) => (
//                   <div
//                     key={idx}
//                     className="w-full" // Set width to 1/2 for two in a row
//                   >
//                     <div className="flex justify-between w-full mb-2">
//                       <div className="text-sm text-gray-300">
//                         <span>{file.name}</span>
//                       </div>
//                       <button
//                         type="button"
//                         onClick={() => handleDeletePdf(idx)}
//                         aria-label={`Delete file: ${file.name}`} 
//                         className=" text-red-500" // Position button at top-right corner
//                       >
//                         <FiX size={16} />
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//             {documents.length > 0 && (
//               <div className="flex flex-wrap ml-4 mr-2">
//                 {documents.map((doc, idx) => (
//                   <div key={idx} className="w-full">
//                     <div className="flex justify-between w-full mb-2">
//                       <div className="text-sm text-gray-300">
//                         <span>{doc.title}</span>
//                       </div>
//                       <button
//                         type="button"
//                         onClick={() => handleDeleteDocument(doc.id)} // Using document id for deletion
//                         className=" text-red-500"
//                         aria-label={`Delete file: ${doc.id}`} 
//                       >
//                         <FiX size={16} />
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* FAQs Section (Using the Reusable FAQ Component) */}
//           <FaqComponent
//             faqs={formData.faqs}
//             onChange={(newFaqs) => {
//               setFormData((prev) => ({ ...prev, faqs: newFaqs }));
//               setIsFormModified(true);
//             }}
//           />

//           {/* Custom Instruction */}
//           <div className="mb-4">
//             <label
//               htmlFor="customInstruction"
//               className="block text-sm font-semibold text-[#FAFAFA]"
//             >
//               Custom Instruction:
//             </label>
//             <textarea
//               id="customInstruction"
//               name="customInstruction"
//               value={formData.customInstruction}
//               onChange={handleInputChange}
//               placeholder="Enter custom instructions..."
//               className="mt-1 text-sm flex items-center justify-between w-full border border-[#2d2d2d] rounded-xl px-2 py-[5px] bg-transparent text-white focus:outline-none focus:ring-0 focus:border-[#4d4d4d] "
//               rows={4}
//             ></textarea>
//           </div>
//         </div>
//         {/* Submit Button */}

//         {/* Form content here */}
//         <button
//           type="submit"
//           disabled={!isFormModified}
//           className={`w-full py-2 rounded-xl text-white ${
//             isFormModified
//               ? "bg-[#00AFFE] cursor-pointer"
//               : "bg-[#2d2d2d] cursor-not-allowed"
//           } disabled:opacity-50 disabled:cursor-not-allowed`}
//         >
//           Send
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Form;
import React, { useState, ChangeEvent, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FiUpload, FiX } from "react-icons/fi"; // Import FiX for delete icon
import useBrandStore from "@/store/useBrandStore";
import { ClipLoader } from "react-spinners";
import getPdfsFromWorkspace from "@/lib/getPdfsFromWorkspace";
import configureWorkspace from "@/lib/configureWorkspace";
import toast, { Toaster } from "react-hot-toast";
import FaqComponent from "../FaqComponent";
import { FAQ } from "../../../../types";

const Form: React.FC = () => {
  const userId = useBrandStore((state) => state.userId);
  const brandName = useBrandStore((state) => state.brandName);
  const brandDescription = useBrandStore((state) => state.brandDescription);
  const brandDomain = useBrandStore((state) => state.brandDomain);
  const brandFaqs = useBrandStore((state) => state.faqs);
  const brandCustomInstruction = useBrandStore(
    (state) => state.customInstruction
  );
  const [documents, setDocuments] = useState<any[]>([]);
  const [deletedDocuments, setDeletedDocuments] = useState<any[]>([]);
  const [loading, setIsLoading] = useState(false);

  const setBrandDescription = useBrandStore(
    (state) => state.setBrandDescription
  );
  const setBrandDomain = useBrandStore((state) => state.setBrandDomain);
  const setFaqs = useBrandStore((state) => state.setFaqs);
  const setCustomInstruction = useBrandStore(
    (state) => state.setCustomInstruction
  );

  useEffect(() => {
    const fetchData = async () => {
      const data = await getPdfsFromWorkspace(userId);
      console.log("pdf", data);
      setDocuments(data);
    };
    fetchData();
  }, [userId]);

  const formik = useFormik({
    initialValues: {
      pdfs: [] as File[],
      faqs: brandFaqs,
      customInstruction: brandCustomInstruction,
      brandDescription: brandDescription,
    },
    validationSchema: Yup.object({
      brandDescription: Yup.string().required("Brand description is required"),
      customInstruction: Yup.string(),
      pdfs: Yup.array().test(
        "fileSize",
        "The total file size should be less than 10 MB",
        (files) => {
          if (files && files.length > 0) {
            const totalSize = files.reduce(
              (acc: number, file: File) => acc + file.size,
              0
            );
            return totalSize <= 10 * 1024 * 1024;
          }
          return true;
        }
      ),
      // You can add additional validations for FAQs if needed
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      const submissionData = {
        userId,
        brandName:
          values.brandDescription !== brandDescription ? brandName : "",
        brandDescription:
          values.brandDescription !== brandDescription
            ? values.brandDescription
            : "",
        brandDomain:
          values.brandDescription !== brandDescription ? brandDomain : "",
        pdfs: values.pdfs,
        deletedDocuments: deletedDocuments,
        faqs: values.faqs !== brandFaqs ? values.faqs : "",
        customInstruction:
          values.customInstruction !== brandCustomInstruction
            ? values.customInstruction
            : "",
      };

      try {
        const response = await configureWorkspace(submissionData);
        console.log("Workspace configured successfully:", response);
        if (values.brandDescription !== brandDescription) {
          setBrandDescription(values.brandDescription);
          setBrandDomain(values.brandDescription);
        }
        if (values.faqs !== brandFaqs) setFaqs(values.faqs);
        if (values.customInstruction !== brandCustomInstruction)
          setCustomInstruction(values.customInstruction);
        toast.success("Workspace configured successfully!");
      } catch (error) {
        console.error("Error configuring workspace:", error);
        toast.error("Error configuring workspace. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handlePdfs = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const updatedFiles = [...formik.values.pdfs, ...newFiles];
      const totalSize = updatedFiles.reduce(
        (acc, file) => acc + file.size,
        0
      );
      if (totalSize > 10 * 1024 * 1024) {
        alert("The total file size exceeds 10 MB. Please select smaller files.");
        return;
      }
      formik.setFieldValue("pdfs", updatedFiles);
      e.target.value = "";
    }
  };

  const handleDeletePdf = (index: number) => {
    const updatedFiles = formik.values.pdfs.filter((_, idx) => idx !== index);
    formik.setFieldValue("pdfs", updatedFiles);
  };

  const handleDeleteDocument = (docId: number) => {
    const deletedDoc = documents.find((doc) => doc.id === docId);
    if (deletedDoc) {
      setDocuments((prev) => prev.filter((doc) => doc.id !== docId));
      setDeletedDocuments((prev) => [...prev, deletedDoc]);
    }
  };

  return (
    <div className="h-full">
      {loading && (
        <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center z-50">
          <ClipLoader color="white" loading={loading} size={50} />
        </div>
      )}

      <form onSubmit={formik.handleSubmit} className="flex flex-col justify-between h-full">
        <div>
          {/* Brand Name */}
          <div className="mb-4">
            <label
              htmlFor="brandName"
              className="block text-sm font-semibold text-[#FAFAFA]"
            >
              Brand Name:
            </label>
            <div className="mt-1 text-sm block w-full border border-[#2d2d2d] rounded-xl p-2 bg-transparent text-white focus:outline-none focus:ring-0 focus:border-[#4d4d4d] ">
              {brandName}
            </div>
          </div>

          {/* Brand Description */}
          <div className="mb-4">
            <label
              htmlFor="brandDescription"
              className="block text-[16px] font-semibold text-[#FAFAFA]"
            >
              Brand Description:
            </label>
            <textarea
              id="brandDescription"
              name="brandDescription"
              value={formik.values.brandDescription}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter brand description"
              className="mt-1 text-sm block w-full border border-[#2d2d2d] rounded-xl p-2 bg-transparent text-white focus:outline-none focus:ring-0 focus:border-[#4d4d4d] "
              rows={6}
            ></textarea>
            {formik.touched.brandDescription && formik.errors.brandDescription && (
              <div className="text-red-500 text-sm">{formik.errors.brandDescription}</div>
            )}
          </div>

          {/* Upload Knowledge PDFs */}
          <div className="mb-4">
            <label
              htmlFor="pdfs"
              className="block text-sm font-semibold text-[#FAFAFA] "
            >
              Upload PDFs:
            </label>
            <div className="relative mt-1 mb-4">
              <input
                type="file"
                id="pdfs"
                name="pdfs"
                accept="application/pdf"
                multiple
                onChange={handlePdfs}
                className="absolute inset-0 opacity-0 z-50 cursor-pointer"
                aria-label="Upload PDF files"
              />
              <div className="mt-1 text-sm flex items-center justify-between w-full border border-[#2d2d2d] rounded-xl px-2 py-[5px] bg-transparent text-white focus:outline-none focus:ring-0 focus:border-[#4d4d4d] ">
                <span className="text-white text-base">Upload</span>
                <FiUpload className="mr-1" />
              </div>
            </div>

            {/* Preview Uploaded PDFs */}
            {formik.values.pdfs.length > 0 && (
              <div className="flex flex-wrap ml-4 mr-2">
                {formik.values.pdfs.map((file, idx) => (
                  <div key={idx} className="w-full">
                    <div className="flex justify-between w-full mb-2">
                      <div className="text-sm text-gray-300">
                        <span>{file.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeletePdf(idx)}
                        aria-label={`Delete file: ${file.name}`}
                        className=" text-red-500"
                      >
                        <FiX size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Preview Existing Documents */}
            {documents.length > 0 && (
              <div className="flex flex-wrap ml-4 mr-2">
                {documents.map((doc, idx) => (
                  <div key={idx} className="w-full">
                    <div className="flex justify-between w-full mb-2">
                      <div className="text-sm text-gray-300">
                        <span>{doc.title}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteDocument(doc.id)}
                        className=" text-red-500"
                        aria-label={`Delete file: ${doc.id}`}
                      >
                        <FiX size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* FAQs Section */}
          <FaqComponent
            faqs={formik.values.faqs}
            onChange={(newFaqs: FAQ[]) => {
              formik.setFieldValue("faqs", newFaqs);
            }}
          />

          {/* Custom Instruction */}
          <div className="mb-4">
            <label
              htmlFor="customInstruction"
              className="block text-sm font-semibold text-[#FAFAFA]"
            >
              Custom Instruction:
            </label>
            <textarea
              id="customInstruction"
              name="customInstruction"
              value={formik.values.customInstruction}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter custom instructions..."
              className="mt-1 text-sm flex items-center justify-between w-full border border-[#2d2d2d] rounded-xl px-2 py-[5px] bg-transparent text-white focus:outline-none focus:ring-0 focus:border-[#4d4d4d] "
              rows={4}
            ></textarea>
            {formik.touched.customInstruction && formik.errors.customInstruction && (
              <div className="text-red-500 text-sm">{formik.errors.customInstruction}</div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!formik.dirty || loading}
          className={`w-full py-2 rounded-xl text-white ${
            formik.dirty && !loading
              ? "bg-[#00AFFE] cursor-pointer"
              : "bg-[#2d2d2d] cursor-not-allowed"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Form;
