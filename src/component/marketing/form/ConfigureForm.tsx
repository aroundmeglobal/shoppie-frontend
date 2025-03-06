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
import api from "@/lib/axiosInstance";

const Form: React.FC = () => {
  const brandId = useBrandStore((state) => state.brandId);
  const brandName = useBrandStore((state) => state.brandName);
  const brandDescription = useBrandStore((state) => state.brandDescription);
  const brandDomain = useBrandStore((state) => state.brandDomain);
  const brandFaqs = useBrandStore((state) => state.faqs);
  const workspaceExist = useBrandStore((state) => state.workspaceExists);
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
  const setWorkspaceExist = useBrandStore((state) => state.setWorkspaceExists);
  const setFaqs = useBrandStore((state) => state.setFaqs);
  const setCustomInstruction = useBrandStore(
    (state) => state.setCustomInstruction
  );
  // const setBrandId = useBrandStore((state) => state.setBrandId)

  

  // useEffect(()=>{setBrandId('9')},[])

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const data = await getPdfsFromWorkspace(brandId);
  //     console.log("pdf", data);
  //     setDocuments(data);
  //   };
  //   fetchData();
  // }, [brandId]);

  const [initialValues, setInitialValues] = useState({
    pdfs: [] as File[],
    brandDescription: brandDescription,
    faqs: brandFaqs,
    customInstruction: brandCustomInstruction,
  });

  useEffect(() => {
    setInitialValues({
      pdfs: [] as File[],
      brandDescription: brandDescription,
      faqs: brandFaqs,
      customInstruction: brandCustomInstruction,
    });
  }, [brandDescription]);

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
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
      if (workspaceExist) {
        // const submissionData = {
        //   brandId,
        //   brandName:
        //     values.brandDescription !== brandDescription ? brandName : "",
        //   brandDescription:
        //     values.brandDescription !== brandDescription
        //       ? values.brandDescription
        //       : "",
        //   brandDomain:
        //     values.brandDescription !== brandDescription ? brandDomain : "",
        //   pdfs: values.pdfs,
        //   deletedDocuments: deletedDocuments,
        //   faqs: values.faqs !== brandFaqs ? values.faqs : "",
        //   customInstruction:
        //     values.customInstruction !== brandCustomInstruction
        //       ? values.customInstruction
        //       : "",
        // };
        const submissionData = {
          brandId,
          brandName: brandName,  // Always include brandName
          brandDescription: values.brandDescription !== brandDescription ? values.brandDescription : brandDescription, // If changed, send the new one
          brandDomain: values.brandDescription !== brandDescription ? brandDomain : brandDomain,  // Always include brandDomain
          pdfs: values.pdfs,
          deletedDocuments: deletedDocuments,
          faqs: values.faqs !== brandFaqs ? values.faqs : brandFaqs, // Send updated faqs if changed
          customInstruction: values.customInstruction !== brandCustomInstruction ? values.customInstruction : brandCustomInstruction, // Send updated customInstruction if changed
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
      } else {
        const body = {
          name: `${brandId}`,
          slug: `${brandId}`,
          similarity_threshold: 0.7,
          open_ai_temp: 0.7,
          open_ai_history: 20,
          open_ai_prompt: `
      BRAND_NAME  : ${brandName}
      BRAND_DESCRIPTION : ${brandDescription}
      BRAND_DOMAIN : ${brandDomain}
      given the following conversation, relevant context, and a follow-up question, reply with an answer to the current question the user is asking. Return only your response to the question given the above information following the user's instructions as needed.
      You are an ai agent of above provided brand, access the above provided data. if somebody asks what you do you reply with i help customers in navigating them with their needs. Assist them in whatever way possible. Reply them to what they ask specifically be precise , helpful, considerate towards human feeling and humble.
      
      And only  whenever a user asks for product suggestions, please respond with a JSON object formatted exactly as shown below. Don’t respond with this if not clearly asked for product suggestion. The response must begin with a beautifully crafted one-liner appreciating and responding to the text and then it should give a reply:
  
  @@SUGGESTIONS START@@
  
  and end with:
  
  @@SUGGESTIONS END@@
  
  Between these markers, output a JSON object with one key "products" that contains an array of product objects. Each product object must have the following keys:
  - id
  - title
  - image_url
  - original_price
  - buy_link
  
  For example, a valid output might look like:
  
  @@SUGGESTIONS START@@
  {
    "products": [
      {
        "id": "001",
        "title": "product name",
        "image_url": "product image_url",
        "original_price": "original price",
        "buy_link": "buy link"
      },
       {
        "id": "002",
        "title": "product name",
        "image_url": "product image_url",
        "original_price": "original price",
        "buy_link": "buy link"
      },
    ]
  }
  @@SUGGESTIONS END@@
      `,
          query_refusal_response:
            "There is no relevant information in this workspace to answer your query.",
          chat_mode: "chat",
          top_n: 4,
          brand_id: brandId,
        };

        console.log("body", body);

        const responseCreateWorkspace = await api.post(
          `${process.env.NEXT_PUBLIC_DEVBASEURL}/workspaces/`,
          body
        );

        if (responseCreateWorkspace.status !== 200) {
          console.error(
            "Error creating workspace:",
            responseCreateWorkspace.statusText
          );
          throw new Error(
            `Workspace creation failed: ${responseCreateWorkspace.statusText}`
          );
        } else setWorkspaceExist(true);
      }
      setIsLoading(false);
    },
  });

  // useEffect(() => {
  //   formik.setFieldValue("brandDescription", brandDescription);
  // }, [brandDescription]);

  const handlePdfs = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const updatedFiles = [...formik.values.pdfs, ...newFiles];
      const totalSize = updatedFiles.reduce((acc, file) => acc + file.size, 0);
      if (totalSize > 10 * 1024 * 1024) {
        alert(
          "The total file size exceeds 10 MB. Please select smaller files."
        );
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

      <form
        onSubmit={formik.handleSubmit}
        className="flex flex-col justify-between h-full"
      >
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
            {formik.touched.brandDescription &&
              formik.errors.brandDescription && (
                <div className="text-red-500 text-sm">
                  {formik.errors.brandDescription}
                </div>
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
          {/* <FaqComponent
            faqs={formik.values.faqs}
            onChange={(newFaqs: FAQ[]) => {
              formik.setFieldValue("faqs", newFaqs);
            }}
          /> */}

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
            {formik.touched.customInstruction &&
              formik.errors.customInstruction && (
                <div className="text-red-500 text-sm">
                  {formik.errors.customInstruction}
                </div>
              )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!formik.dirty || loading} // Only enable if form is dirty and not loading
          className={`w-full py-2 rounded-xl text-white ${
            formik.dirty && !loading
              ? "bg-[#00AFFE] cursor-pointer"
              : "bg-[#2d2d2d] cursor-not-allowed"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {workspaceExist ? "Update" : "Get started"}
        </button>
      </form>
    </div>
  );
};

export default Form;
