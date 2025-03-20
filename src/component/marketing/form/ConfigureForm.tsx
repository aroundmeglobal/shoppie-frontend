"use client";
import React, { useState, ChangeEvent, useEffect, useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FiUpload, FiX } from "react-icons/fi"; // Import FiX for delete icon
import useBrandStore from "@/store/useBrandStore";
import { ClipLoader } from "react-spinners";
import configureWorkspace from "@/lib/configureWorkspace";
import toast, { Toaster } from "react-hot-toast";
import FaqComponent from "../FaqComponent";
import { FAQ } from "../../../../types";
import api from "@/lib/axiosInstance";
import { handleDownloadCSV } from "@/lib/downloadCSV";
import Papa from "papaparse";
import Product from "@/component/ChatBot/Product";
import UploadedFileComponent from "./UploadedFileComponent";
import ProductCardForForm from "./ProductCardForForm";
import { SlArrowRight } from "react-icons/sl";
import { useRouter } from "next/navigation";
import useCsvStore from "@/store/useCsvStore";

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

  const { setSelectedCsv, selectedCsv } = useCsvStore();

  const [documents, setDocuments] = useState<any[]>([]);
  const [deletedDocuments, setDeletedDocuments] = useState<any[]>([]);
  const [loading, setIsLoading] = useState(false);
  const [deletingPdf, setDeletingPdf] = useState(false);

  const setBrandDescription = useBrandStore(
    (state) => state.setBrandDescription
  );
  const setBrandDomain = useBrandStore((state) => state.setBrandDomain);
  const setWorkspaceExist = useBrandStore((state) => state.setWorkspaceExists);
  const setFaqs = useBrandStore((state) => state.setFaqs);
  const setCustomInstruction = useBrandStore(
    (state) => state.setCustomInstruction
  );

  const router = useRouter();

  const [csvError, setCsvError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [productExisting, setProductExisting] = useState(false);
  const [pdfExisting, setPdfExisting] = useState(false);

  const [csvName, setCsvName] = useState(null);
  const latestCsvId = useRef();

  const [initialValues, setInitialValues] = useState({
    pdfs: [] as File[],
    brandDescription: brandDescription,
    faqs: brandFaqs,
    customInstruction: brandCustomInstruction,
    csv: null as File | null,
  });

  useEffect(() => {
    const fetchOldProducts = async () => {
      const responseOldProducts = await api.get(
        `${process.env.NEXT_PUBLIC_DEVBASEURL}/files/?brand_id=${brandId}`
      );
      // setOldProducts(responseOldProducts.data);
      if (responseOldProducts.data.length) {
        setProducts(responseOldProducts.data);
        setProductExisting(true);
      }
    };
    const csvName = async () => {
      const response = await api.get(
        `${process.env.NEXT_PUBLIC_DEVBASEURL}/files/file-details?brand_id=${brandId}`
      );

      const data = response.data.filter(
        (item) => item.file_type === "products"
      );
      const pdfFiles = response.data.filter(
        (item) => item.file_type === "knowledge"
      );

      if (pdfFiles.length) {
        setInitialValues({
          pdfs: pdfFiles,
          brandDescription: brandDescription,
          faqs: brandFaqs,
          customInstruction: brandCustomInstruction,
          csv: null as File | null,
        });
        setPdfExisting(true);
      } else {
        setInitialValues({
          pdfs: [] as File[],
          brandDescription: brandDescription,
          faqs: brandFaqs,
          customInstruction: brandCustomInstruction,
          csv: null as File | null,
        });
      }
      setCsvName(data);
    };

    if (brandId) {
      fetchOldProducts();
      csvName();
    }
  }, [brandId, brandDescription]);

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: Yup.object({
      brandDescription: Yup.string().required("Brand description is required"),
      customInstruction: Yup.string(),
      pdfs: Yup.array().test(
        "fileSize",
        "Each file should be less than 10 MB", // Changed message
        (files) => {
          if (files && files.length > 0) {
            for (const file of files) {
              if (file.size > 2 * 1024 * 1024) {
                return false; // If any file is over 10MB, return false
              }
            }
          }
          return true; // All files are within the limit
        }
      ),
      // You can add additional validations for FAQs if needed
    }),

    onSubmit: async (values, { resetForm }) => {
      const brandDescriptionChanged =
        values.brandDescription !== brandDescription;
      const customInstructionChanged =
        values.customInstruction !== initialValues.customInstruction;
      const pdfChanged = values.pdfs !== initialValues.pdfs;

      // return
      if (!uploadedFile && !values.pdfs) {
        toast.error("csv or knowledge pdf is mandatory");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      if (workspaceExist) {
        const submissionData = {
          brandId,
          brandName: brandName, // Always include brandName
          brandDescription:
            values.brandDescription !== brandDescription
              ? values.brandDescription
              : brandDescription, // If changed, send the new one
          brandDomain:
            values.brandDescription !== brandDescription
              ? brandDomain
              : brandDomain, // Always include brandDomain
          pdfs: values.pdfs,
          deletedDocuments: deletedDocuments,
          faqs: values.faqs !== brandFaqs ? values.faqs : brandFaqs, // Send updated faqs if changed
          customInstruction:
            values.customInstruction !== brandCustomInstruction
              ? values.customInstruction
              : brandCustomInstruction, // Send updated customInstruction if changed
        };

        try {
          if (uploadedFile) {
            const productResponse = await fetch(
              `https://shoppie-backend.aroundme.global/api/upload/generate-upload-url`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  name: `${brandName
                    .replace(/\s+/g, "-")
                    .toLowerCase()}-product/${uploadedFile.name}`,
                  contentType: `${uploadedFile.type}`,
                  folder: "user-products",
                }),
              }
            );

            const productData = await productResponse.json();

            await fetch(productData.signed_url, {
              method: "PUT",
              headers: {
                "Content-Type": uploadedFile.type,
              },
              body: uploadedFile,
            });

            const body = {
              brand_id: brandId,
              file: `${productData.public_url}`,
            };
            const responseFileUpload = await api.post(
              `${process.env.NEXT_PUBLIC_DEVBASEURL}/files/upload-products`,
              body
            );

            latestCsvId.current = responseFileUpload.data.id;

            const brandBody = {};
            const responseUpdateBrand = await api.put(
              `${process.env.NEXT_PUBLIC_DEVBASEURL}/brands/?brand_id=${brandId}`,
              brandBody
            );

            setSelectedCsv(null);
          }
          const response = await configureWorkspace(
            submissionData,
            brandDescriptionChanged,
            customInstructionChanged,
            pdfChanged
          );
          console.log("Workspace configured successfully:", response);
          if (values.brandDescription !== brandDescription) {
            setBrandDescription(values.brandDescription);
            setBrandDomain(values.brandDescription);
          }
          if (values.faqs !== brandFaqs) setFaqs(values.faqs);
          if (values.customInstruction !== brandCustomInstruction)
            setCustomInstruction(values.customInstruction);
          toast.success("Workspace configured successfully!");
          resetForm({ values });
          setIsLoading(false);
          setProductExisting(true);
        } catch (error) {
          console.error("Error configuring workspace:", error);
          toast.error("Error configuring workspace. Please try again.");
          resetForm({ values });

          setIsLoading(false);
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
          open_ai_prompt: `${values.customInstruction}`,
          query_refusal_response:
            "There is no relevant information in this workspace to answer your query.",
          chat_mode: "chat",
          top_n: 4,
          brand_id: brandId,
        };

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
        } else {
          if (uploadedFile) {
            const productResponse = await fetch(
              `${process.env.NEXT_PUBLIC_DEVBASEURL}/upload/generate-upload-url`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  name: `${brandName
                    .replace(/\s+/g, "-")
                    .toLowerCase()}-product`,
                  contentType: `${uploadedFile.type}`,
                  folder: "user-products",
                }),
              }
            );

            const productData = await productResponse.json();

            await fetch(productData.signed_url, {
              method: "PUT",
              headers: {
                "Content-Type": uploadedFile.type,
              },
              body: uploadedFile,
            });

            const body = {
              brand_id: brandId,
              file: `${productData.public_url}`,
            };
            const responseFileUpload = await api.post(
              `${process.env.NEXT_PUBLIC_DEVBASEURL}/files/upload-products`,
              body
            );
            latestCsvId.current = responseFileUpload.data.id;
          } else if (values.pdfs) {
            const newPdfsToUpload = values.pdfs.filter((pdf) => !pdf.id);

            if (newPdfsToUpload && newPdfsToUpload.length > 0) {
              for (const uploadedFile of newPdfsToUpload) {
                try {
                  const uploadFileType = uploadedFile.type;

                  // Request to generate signed URL

                  const pdfResonse = await fetch(
                    `${process.env.NEXT_PUBLIC_DEVBASEURL}/upload/generate-upload-url`,
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        name: `${brandName
                          .replace(/\s+/g, "-")
                          .toLowerCase()}/${uploadedFile.name}`,
                        contentType: uploadFileType,
                        folder: "user-pdf",
                      }),
                    }
                  );

                  const pdfData = await pdfResonse.json();

                  // Upload the file to the generated signed URL
                  const uploadResponse = await fetch(pdfData.signed_url, {
                    method: "PUT",
                    headers: {
                      "Content-Type": uploadedFile.type,
                    },
                    body: uploadedFile,
                  });

                  if (uploadResponse.ok) {
                    console.log(
                      "File uploaded successfully:",
                      uploadedFile.name
                    );
                    console.log("Product data URL:", pdfData.public_url);
                  } else {
                    resetForm({ values });
                    setIsLoading(false);
                    throw new Error(
                      `Error uploading file: ${uploadedFile.name}`
                    );
                  }

                  //hit file upload api

                  const body = {
                    brand_id: brandId,
                    file: `${pdfData.public_url}`,
                  };

                  const responseFileUpload = await api.post(
                    `${process.env.NEXT_PUBLIC_DEVBASEURL}/files/upload-knowledge`,
                    body
                  );
                } catch (error) {
                  resetForm({ values });
                  setIsLoading(false);
                  toast.error("Error during file upload, Please try again !");
                  console.error("Error during file upload:", error);
                }
              }
            }
          } else if (brandDescriptionChanged) {
            if (values.brandDescription) {
              const body = {
                description: values.brandDescription,
              };

              const responseUpdateBrandDescription = await api.put(
                `${process.env.NEXT_PUBLIC_DEVBASEURL}/brands/?brand_id=${brandId}`,
                body
              );
            }
          }
          const brandBody = {};
          const responseUpdateBrand = await api.put(
            `${process.env.NEXT_PUBLIC_DEVBASEURL}/brands/?brand_id=${brandId}`,
            brandBody
          );
          resetForm({ values });
          setProductExisting(true);
          setWorkspaceExist(true);
        }
      }
      setIsLoading(false);
    },
  });

  const handlePdfs = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);

      for (const file of newFiles) {
        if (file.size > 2 * 1024 * 1024) {
          toast.error(`${file.name} exceeds the 2 MB limit.`);
          return;
        }
      }

      const updatedFiles = [...formik.values.pdfs, ...newFiles];
      formik.setFieldValue("pdfs", updatedFiles);
      e.target.value = "";
    }
  };

  const handleDeletePdf = async (index: number, id: number) => {
    setDeletingPdf(true);
    if (pdfExisting) {
      // Create a promise for the delete and update operations
      const deletePromise = async () => {
        if (!id) return;
        const response = await api.delete(
          `${process.env.NEXT_PUBLIC_DEVBASEURL}/files/${id}`
        );

        const brandBody = {};
        await api.put(
          `${process.env.NEXT_PUBLIC_DEVBASEURL}/brands/?brand_id=${brandId}`,
          brandBody
        );

        return response; // Return the response for further processing if needed
      };

      // Use toast.promise to handle the promise
      toast.promise(deletePromise(), {
        loading: "Deleting PDF...",
        success: () => {
          // Update formik state only on success
          const updatedFiles = formik.values.pdfs.filter(
            (_, idx) => idx !== index
          );
          formik.setFieldValue("pdfs", updatedFiles);
          return <b>PDF removed. Please upload a new PDF!</b>;
        },
        error: <b>Could not delete the PDF. Please try again!</b>,
      });
    }
    const updatedFiles = formik.values.pdfs.filter((_, idx) => idx !== index);
    formik.setFieldValue("pdfs", updatedFiles);
    setDeletingPdf(false);
  };

  const handleDeleteDocument = (docId: number) => {
    const deletedDoc = documents.find((doc) => doc.id === docId);
    if (deletedDoc) {
      setDocuments((prev) => prev.filter((doc) => doc.id !== docId));
      setDeletedDocuments((prev) => [...prev, deletedDoc]);
    }
  };

  // useEffect to parse CSV data when it's passed as a prop
  useEffect(() => {
    if (selectedCsv) {
      parseCSVData(selectedCsv);
    }
  }, [selectedCsv]);

  // Function to parse CSV data and set the products state
  const parseCSVData = (csvData: string) => {
    Papa?.parse(csvData, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        // Check CSV header for required fields.
        const requiredFields = [
          "Product_name",
          "Product_images",
          "Product_description",
          "Original_price",
          "Discounted_price",
          "Tags",
          "Purchase_link",
        ];
        if (results.meta && results.meta.fields) {
          const missingFields = requiredFields.filter(
            (field) => !results.meta!.fields.includes(field)
          );
          if (missingFields.length > 0) {
            setCsvError(
              `CSV header error: Missing or misspelled field(s):\n${missingFields.join(
                "\n"
              )}`
            );
            return;
          }
        } else {
          setCsvError("CSV header error: Unable to read header fields.");
          return;
        }

        // Wrap row validation and mapping in a try-catch block.
        try {
          const data = results.data as any[];
          const parsedProducts: Product[] = data.map((row, index) => {
            let missing = false;
            for (const field of requiredFields) {
              if (
                row[field] === undefined ||
                row[field] === null ||
                row[field].toString().trim() === ""
              ) {
                missing = true;
                break;
              }
            }
            if (missing) {
              throw new Error(
                `Row ${
                  index + 1
                } has missing fields. Please check the CSV data.`
              );
            }
            return {
              product_name: row.Product_name,
              product_images: row.Product_images,
              product_description: row.Product_description,
              original_price: row.Original_price,
              discounted_price: row.Discounted_price,
              tags: row.Tags
                ? row.Tags.split(",").map((tag: string) => tag.trim())
                : [],
              purchase_link: row.Purchase_link,
            };
          });
          setProducts(parsedProducts);
          setUploadedFile(csvData);
          formik.setFieldValue("csv", csvData);
        } catch (error: any) {
          setCsvError(error.message);
        }
      },
      error: (error) => {
        console.error("Error parsing CSV:", error);
        setCsvError(`Error parsing CSV: ${error.message}`);
      },
    });
  };

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Use Papa.parse to read and parse the CSV file directly
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          // Define required fields for validation
          const requiredFields = [
            "Product_name",
            "Product_images",
            "Product_description",
            "Original_price",
            "Discounted_price",
            "Tags",
            "Purchase_link",
          ];

          // Check for missing fields in the CSV header
          if (results.meta && results.meta.fields) {
            const missingFields = requiredFields.filter(
              (field) => !results.meta.fields.includes(field)
            );
            if (missingFields.length > 0) {
              setCsvError(
                `CSV header error: Missing or misspelled field(s):\n${missingFields.join(
                  "\n"
                )}`
              );
              return;
            }
          } else {
            setCsvError("CSV header error: Unable to read header fields.");
            return;
          }

          // Try to map the parsed data to your product structure
          try {
            const data = results.data as any[]; // Cast to any[] or define a specific type
            const parsedProducts = data.map((row, index) => {
              // Validate each row for required fields
              let missing = false;
              for (const field of requiredFields) {
                if (
                  row[field] === undefined ||
                  row[field] === null ||
                  row[field].toString().trim() === ""
                ) {
                  missing = true;
                  break;
                }
              }
              if (missing) {
                throw new Error(
                  `Row ${
                    index + 1
                  } has missing fields. Please check the CSV data.`
                );
              }

              // Return a structured product object
              return {
                product_name: row.Product_name,
                product_images: row.Product_images,
                product_description: row.Product_description,
                original_price: row.Original_price,
                discounted_price: row.Discounted_price,
                tags: row.Tags
                  ? row.Tags.split(",").map((tag) => tag.trim())
                  : [],
                purchase_link: row.Purchase_link,
              };
            });

            // Update products state with parsed products
            setProducts(parsedProducts);
          } catch (error: any) {
            formik.errors.csv = error.message; // Capture error in Formik
            setCsvError(error.message); // Set CSV error state
          }
        },
        error: (error) => {
          console.error("Error parsing CSV:", error);
          setCsvError(`Error parsing CSV: ${error.message}`);
        },
      });

      // Update Formik and Zustand states with the uploaded file
      formik.setFieldValue("csv", file);
      setSelectedCsv(file); // Store in Zustand
      setUploadedFile(file); // Store uploaded file state
    }
  };

  const handleRemoveCSV = () => {
    if (productExisting && latestCsvId) {
      const deleteCsv = async () => {
        try {
          const response = await api.delete(
            `${process.env.NEXT_PUBLIC_DEVBASEURL}/files/${
              csvName[0]?.id || latestCsvId.current
            }`
          );
          const brandBody = {};
          const responseUpdateBrand = await api.put(
            `${process.env.NEXT_PUBLIC_DEVBASEURL}/brands/?brand_id=${brandId}`,
            brandBody
          );
        } catch (error) {
          console.log(error, "error while deleting csv");
        }
      };

      toast.promise(deleteCsv(), {
        loading: "Deleting CSV...",
        success: () => {
          formik.setFieldValue("csv", null);
          setProducts([]);
          setCsvError(null);
          setSelectedCsv(null);
          return <b>Removed csv.Please upload a new csv!</b>;
        },
        error: <b>Could not delete the CSV. Please try again!</b>,
      });
    }
    formik.setFieldValue("csv", null);
    setProducts([]);
    setCsvError(null);
    setSelectedCsv(null);
  };

  return (
    <div className="h-full">
      {(loading || deletingPdf) && (
        <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center z-50">
          <ClipLoader color="white" loading={loading} size={50} />
        </div>
      )}

      <form
        onSubmit={formik.handleSubmit}
        className="flex flex-col justify-between h-full"
      >
        <div className="space-y-8">
          {/* Brand Name */}
          <div className="mb-4">
            <label
              htmlFor="brandName"
              className="block text-sm font-semibold text-[#FAFAFA]"
            >
              Brand Name:
            </label>
            <div className="mt-1 h-10 text-sm block w-full border border-[#2d2d2d] rounded-xl p-2 bg-transparent text-white focus:outline-none focus:ring-0 focus:border-[#4d4d4d] ">
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

          <div className="mb-4">
            <label
              htmlFor="brandDescription"
              className="block text-[16px] font-semibold text-[#FAFAFA]"
            >
              Products:
            </label>

            <div className=" mt-1 flex w-full items-center justify-center bg-[#1d1d1d]  rounded-2xl overflow-hidden">
              {/* Download CSV Template Button */}
              {!products?.length ? (
                <>
                  <div className="w-1/3 bg-[#272727] p-6 py-10">
                    <div className="flex  flex-col items-center justify-center  text-white  rounded-lg ">
                      <button
                        onClick={handleDownloadCSV}
                        type="button"
                        className="bg-white text-black font-medium text-[13px] py-2 px-4 rounded-xl hover:bg-gray-200"
                      >
                        Download CSV template
                      </button>
                      <p className="text-sm text-gray-400 mt-2">
                        Get a template for your products.
                      </p>
                    </div>
                  </div>

                  {/* Upload CSV Button */}
                  <div className="flex w-2/3 flex-col items-center justify-center text-white  rounded-xl">
                    <button
                      type="button"
                      onClick={() =>
                        document.getElementById("csvInput")?.click()
                      }
                      className=" border-2 border-[#2d2d2d] text-white font-medium py-2 px-4 rounded-xl flex items-center"
                    >
                      Upload CSV
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 ml-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M16 8l-4-4-4 4M12 4v12"
                        />
                      </svg>
                    </button>
                    <input
                      type="file"
                      id="csvInput"
                      accept=".csv"
                      onChange={handleCSVUpload}
                      className="hidden"
                    />
                    <p className="text-sm text-gray-400 mt-2">
                      Upload your product list.
                    </p>
                  </div>
                </>
              ) : (
                <div className="p-5 gap-5 flex flex-col w-full">
                  <UploadedFileComponent
                    idx={""}
                    file={formik.values.csv || csvName[0]}
                    deletePdf={handleRemoveCSV}
                  />
                  <div className="flex flex-row gap-5   w-full ">
                    {products?.slice(0, 3)?.map((product, index) => (
                      <ProductCardForForm product={product} key={index} />
                    ))}
                    <div
                      onClick={() => router.push(`/brand/product`)}
                      className=" cursor-pointer flex-col gap-5 h-[250px] w-[180px] bg-[#2d2d2d] rounded-xl flex items-center justify-center"
                    >
                      <div className="bg-[#3d3d3d] rounded-full p-5 ">
                        <SlArrowRight />
                      </div>
                      <p>See all</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {formik.touched.csv && formik.errors.csv && (
              <div className="text-red-500 text-sm">{formik.errors.csv}</div>
            )}
          </div>

          {/* Upload Knowledge PDFs */}
          {/* {!workspaceExist && ( */}
          <div className="mb-4">
            <label
              htmlFor="pdfs"
              className="block text-sm font-semibold text-[#FAFAFA] "
            >
              Knowledge PDF:
            </label>
            <div className="min-h-28 py-5 mt-1 bg-[#1d1d1d] flex  flex-col items-center justify-center text-white  rounded-xl">
              {!formik.values.pdfs.length ? (
                <>
                  <button
                    type="button"
                    onClick={() => document.getElementById("pdfInput")?.click()}
                    className=" border-2 border-[#2d2d2d] text-white font-medium py-2 px-4 rounded-xl flex items-center"
                  >
                    Upload PDF
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 ml-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M16 8l-4-4-4 4M12 4v12"
                      />
                    </svg>
                  </button>
                  <input
                    type="file"
                    id="pdfInput"
                    name="pdfs"
                    accept="application/pdf"
                    onChange={handlePdfs}
                    className="hidden"
                  />
                  <p className="text-sm text-gray-400 mt-2">
                    Upload brand Knowledge pdf.
                  </p>
                </>
              ) : (
                <div className="px-5 w-[100%] gap-5 flex-col flex">
                  <button
                    type="button"
                    className="bg-[#272727] rounded-xl flex justify-center items-center w-full h-10 "
                    onClick={() => document.getElementById("pdfInput")?.click()}
                  >
                    Add file +
                    <input
                      type="file"
                      id="pdfInput"
                      name="pdfs"
                      accept="application/pdf"
                      onChange={handlePdfs}
                      className="hidden"
                    />
                  </button>
                  {formik.values.pdfs.length > 0 &&
                    formik.values.pdfs.map((file, idx) => (
                      <UploadedFileComponent
                        file={file}
                        key={idx}
                        deletePdf={handleDeletePdf}
                        idx={idx}
                      />
                    ))}
                </div>
              )}
            </div>
            {formik.touched.pdfs && formik.errors.pdfs && (
              <div className="text-red-500 text-sm">
                {
                  typeof formik.errors.pdfs === "string"
                    ? formik.errors.pdfs
                    : Array.isArray(formik.errors.pdfs)
                    ? formik.errors.pdfs.map((error, index) => (
                        <div key={index}>{String(error)}</div> // Convert to string if necessary
                      ))
                    : "An error occurred" // Fallback
                }
              </div>
            )}

            {/* {formik.values.pdfs.length > 0 && (
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
              )} */}

            {/* {documents.length > 0 && (
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
            )} */}
          </div>
          {/* )} */}

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
          className={`w-full py-2 rounded-xl mt-8 text-white ${
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
