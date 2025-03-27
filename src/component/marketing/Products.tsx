"use client";

import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import Papa from "papaparse";
import Image from "next/image";
import uploadProducts from "@/lib/uploadProducts";
import useBrandStore from "@/store/useBrandStore";
import { ClipLoader } from "react-spinners";
import api from "@/lib/axiosInstance";
import { handleDownloadCSV } from "@/lib/downloadCSV";
import UploadedFileComponent from "./form/UploadedFileComponent";
import useCsvStore from "@/store/useCsvStore";
import toast from "react-hot-toast";

// -----------------
// ErrorBoundary Component
// -----------------
interface ErrorBoundaryProps {
  children: React.ReactNode;
  onDismiss: () => void;
}

interface ErrorBoundaryState {
  error: Error | null;
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleDismiss = () => {
    this.props.onDismiss();
    this.setState({ error: null });
  };

  render() {
    if (this.state.error) {
      return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center">
          <div className="bg-[#1d1d1d] p-8 rounded-xl shadow-xl text-center max-w-xl mx-4">
            <h2 className="text-2xl font-bold mb-4 text-white">
              CSV Parsing Error
            </h2>
            <div className="mb-6 text-left text-white">
              <ul className="list-disc ml-5">
                {this.state.error.message.split("\n").map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
            <button
              onClick={this.handleDismiss}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Dismiss
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// -----------------
// Types for CSV Data
// -----------------
type Product = {
  product_name: string;
  product_images: string;
  product_description: string;
  original_price: string;
  discounted_price: string;
  tags: string[];
  purchase_link: string;
};

type OldProduct = {
  product_name: string;
  product_description: string;
  product_images: string;
  product_prices: { Original_price: string; Discounted_price: string };
  tags: string[];
  purchase_link: string;
};

// -----------------
// ProductCard Component
// -----------------
const ProductCard = ({ product }: { product: Product }) => {
  let domain = "";

  try {
    const url = new URL(product?.purchase_link);
    domain = url.hostname;
  } catch (error) {
    toast.error(
      `Invalid URL for product "${product.product_name}". Received: "${product.purchase_link}". Please check the CSV data.`
    );
  }

  return (
    <div className="border p-4 rounded-xl bg-[#161616] text-yellow-50 flex flex-col h-full">
      <Image
        src={product.product_images}
        alt={product.product_name}
        width={100}
        height={48}
        className="w-full h-48 object-cover rounded-xl"
      />
      <h2 className="font-semibold text-xl mt-2">{product.product_name}</h2>
      <p className="text-sm mt-1 line-clamp-3 text-[whitesmoke] opacity-55">
        {product.product_description}
      </p>
      <p className="mt-4">
        <span className="line-through mr-2 text-[whitesmoke] opacity-65">
          {product.original_price}
        </span>
        <span className="text-green-400">{product.discounted_price}</span>
      </p>
      <div className="mt-2 flex flex-wrap gap-x-2 gap-y-2">
        {product.tags.map((tag, idx) => (
          <span
            key={idx}
            className="bg-[#1d1d1d] border-[#2d2d2d] border-[2px] px-[6px] py-[3px] text-[12px] rounded whitespace-no-wrap max-w-fit break-all"
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="mt-2 ml-1 flex gap-x-[8px] justify-start items-center">
        <a
          href={product.purchase_link}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border-[2px] border-[#2d2d2d] overflow-hidden"
        >
          <Image
            src={`https://www.google.com/s2/favicons?domain=${domain}`}
            alt={`Favicon for ${domain}`}
            width={30}
            height={30}
          />
        </a>
      </div>
    </div>
  );
};

// -----------------
// Products Component
// -----------------
const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [csvError, setCsvError] = useState<string | null>(null);
  const brandName = useBrandStore((state) => state.brandName);
  const brandId = useBrandStore((state) => state.brandId);
  const [oldProducts, setOldProducts] = useState<OldProduct[]>([]);
  const [csvDetails, setCsvDetails] = useState(null);
  const { setSelectedCsv, selectedCsv } = useCsvStore();
  const [productExisting, setProductExisting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const latestId = useRef();

  const renderOldProducts = oldProducts.map((product, index) => (
    <ProductCard
      key={index}
      product={{
        product_name: product.product_name || "Unknown Product",
        product_description:
          product.product_description || "No description available",
        product_images: product.product_images[0] || "",
        original_price: product.product_prices?.Original_price || "N/A",
        discounted_price: product.product_prices?.Discounted_price || "N/A",
        tags: product.tags || [],
        purchase_link: product.purchase_link || "",
      }}
    />
  ));

  useEffect(() => {
    if (selectedCsv) {
      setUploadedFile(selectedCsv);

      const reader = new FileReader();
      reader.onload = (event) => {
        const csvData = event.target?.result as string; // Read CSV data as string

        parseCSVData(csvData); // Call parsing function
      };
      reader.readAsText(selectedCsv); // Read file as text
    }
  }, [selectedCsv]);

  useEffect(() => {
    const widgetContainerCleanup = document.getElementById(
      "anyhting-all-wrapper"
    );
    if (widgetContainerCleanup) {
      widgetContainerCleanup.remove();
    }
  }, []);

  const parseCSVData = (csvData: string, type: string): Promise<any[]> => {
    setCsvError("");
    return new Promise((resolve, reject) => {
      Papa.parse(csvData, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
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
            const trimmedFields = results.meta.fields.map((field: any) =>
              field.trim()
            );

            const missingFields = requiredFields.filter(
              (field) => !trimmedFields.includes(field)
            );

            if (missingFields.length > 0) {
              setCsvError(
                `CSV header error: Missing or misspelled field(s):\n${missingFields.join(
                  "\n"
                )}`
              );
              reject(
                new Error(
                  `CSV header error: Missing or misspelled field(s):\n${missingFields.join(
                    "\n"
                  )}`
                )
              );
              return;
            }
          } else {
            setCsvError("CSV header error: Unable to read header fields.");
            reject(
              new Error("CSV header error: Unable to read header fields.")
            );
            return;
          }

          try {
            const data = results.data as any[];
            const parsedProducts = data.map((row, index) => {
              let missingFields = [];
              let missingColumns = [];

              const trimmedRow = Object.keys(row).reduce((acc, key) => {
                acc[key.trim()] = row[key];
                return acc;
              }, {});

              for (const field of requiredFields) {
                if (
                  trimmedRow[field] === undefined ||
                  trimmedRow[field] === "" ||
                  trimmedRow[field] === null
                ) {
                  const columnNumber = requiredFields.indexOf(field) + 1;
                  missingFields.push(field);
                  missingColumns.push(columnNumber);
                  break;
                }
              }

              if (missingFields.length > 0) {
                const missingDetails = missingFields
                  .map((field, i) => `${field} (Column ${missingColumns[i]})`)
                  .join(", ");
                throw new Error(
                  `Row ${
                    index + 1
                  } is missing the following fields: ${missingDetails}. Please check the CSV data.`
                );
              }

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

            // Update Zustand store with parsed products
            if (type !== "uploading") {
              setProducts(parsedProducts);
              resolve(parsedProducts); // Resolve with parsed products
              return;
            }
            resolve(parsedProducts);
            return parsedProducts; // Make sure to return the parsed products
          } catch (error: any) {
            setCsvError(error.message);
            reject(error); // Reject the promise with the error
          }
        },
        error: (error) => {
          console.error("Error parsing CSV:", error);
          setCsvError(`Error parsing CSV: ${error.message}`);
          reject(error);
        },
      });
    });
  };
  const handleCSVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      const reader = new FileReader();

      reader.onload = async (event: ProgressEvent<FileReader>) => {
        const csvData = event.target?.result as string;
        try {
          const data = await parseCSVData(csvData, "uploading");
          await handleSubmit(file, data); // Wait for handleSubmit to complete
          setUploadedFile(file);
        } catch (error: any) {
          // Handle errors from parseCSVData or handleSubmit
          console.error("Error during CSV processing:", error);
          e.target.value = "";
        } finally {
          e.target.value = "";
        }
      };

      reader.onerror = (error) => {
        console.error("Error reading file:", error);
        // Handle file reading errors
      };

      reader.readAsText(file);
    }
  };

  const handleDiscard = () => {
    setUploadedFile(null);
    setProducts([]);
    setCsvError("");
  };

  const handleRemoveCSV = () => {
    if ((productExisting && csvDetails) || latestId) {
      setDeleting(true);
      const deleteCsv = async () => {
        try {
          const response = await api.delete(
            `${process.env.NEXT_PUBLIC_DEVBASEURL}/files/${
              csvDetails?.id || latestId.current
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
          setProducts([]);
          setCsvError(null);
          setSelectedCsv(null);
          setSelectedCsv(null);
          return <b>Removed csv.Please upload a new csv!</b>;
        },
        error: <b>Could not delete the CSV. Please try again!</b>,
      });
    }
    setSelectedCsv(null);
    setProducts([]);
    setCsvError(null);
    setOldProducts([]);
  };

  const handleSubmit = async (uploadedFile: any, data: any) => {
    setLoading(true);

    if (!uploadedFile) {
      alert("Please upload a CSV file first!");
      setLoading(false);
      return;
    }

    try {
      const productResponse = await fetch(
        `https://shoppie-backend.aroundme.global/api/upload/generate-upload-url`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: `${brandName.replace(/\s+/g, "-").toLowerCase()}-product/${
              uploadedFile?.name
            }`,
            contentType: `${uploadedFile?.type}`,
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

      latestId.current = responseFileUpload.data.id;
      const brandBody = {};
      const responseUpdateBrand = await api.put(
        `${process.env.NEXT_PUBLIC_DEVBASEURL}/brands/?brand_id=${brandId}`,
        brandBody
      );

      setProducts(data);
      toast.success("CSV added successfully");
      setSelectedCsv(uploadedFile);
      setLoading(false);
    } catch (error) {
      setLoading(false);

      toast.error("something went wrong please try again later!");
      console.log(error, "error from uploading csv from products page");
    }
  };

  useEffect(() => {
    const fetchOldProducts = async () => {
      const responseOldProducts = await api.get(
        `${process.env.NEXT_PUBLIC_DEVBASEURL}/files/?brand_id=${brandId}`
      );
      if (responseOldProducts.data.length) {
        setOldProducts(responseOldProducts.data);
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
      setCsvDetails(data[0]);
    };
    if (brandId) {
      fetchOldProducts();
      csvName();
    }
  }, [brandId]);

  return (
    <div className="p-5 pt-0 overflow-y-auto h-full">
      {/* CSV Error Overlay */}
      {csvError && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center">
          <div className="bg-[#1d1d1d] p-8 rounded-xl shadow-xl text-center max-w-xl mx-4">
            <h2 className="text-2xl font-bold mb-4 text-white">
              CSV Parsing Error
            </h2>
            <div className="mb-6 text-left text-white">
              <ul className="list-disc ml-5">
                {csvError.split("\n").map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
            <button
              onClick={handleDiscard}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center z-50">
          <ClipLoader color="white" loading={loading} size={50} />
        </div>
      )}

      <div className="flex flex-col mt-3 px-28 gap-10 overflow-hidden">
        {/* {!uploadedFile ? ( */}
        <div className="rounded-xl p-6 bg-[#161616] shadow">
          <h2 className="text-2xl font-bold mb-2">
            Add your products to AI and let people discover them.
          </h2>
          <p className="mb-4 text-[#fff]/60">
            First, download the sample CSV, then import your products to
            showcase them effortlessly.
          </p>
          <button
            onClick={handleDownloadCSV}
            className="flex items-center font-meidum   justify-between bg-white border text-gray-800 px-4 py-2 rounded-xl hover:bg-[#3d3d3d] hover:text-white focus:border-[#4d4d4d]"
          >
            Download Sample CSV
          </button>
          <div className="border-dashed border-[#2d2d2d]  border-[2px] w-full  mt-5 rounded-xl p-5">
            {!products?.length && !oldProducts?.length ? (
              <div className="flex  flex-col items-center justify-center text-white  rounded-xl">
                <button
                  type="button"
                  onClick={() => document.getElementById("csvInput")?.click()}
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
            ) : (
              <UploadedFileComponent
                file={uploadedFile || csvDetails}
                deletePdf={handleRemoveCSV}
                idx={""}
              />
              // <div className="flex justify-between items-center bg-[#161616] p-4 rounded-xl">
              //   <span className="text-white">{uploadedFile.name}</span>
              //   <div className="flex items-center gap-5 pt-2">
              //     <button
              //       className="mt-[-10px] cursor-pointer flex items-center justify-between w-full border border-[#2d2d2d] rounded-xl py-2 px-4 bg-[#1d1d1d] text-yellow-50 focus:outline-none focus:ring-0 focus:border-[#4d4d4d] hover:bg-[#4d4d4d] hover:bg-[red]/30 hover:border-[red]/60"
              //       onClick={handleDiscard}
              //     >
              //       Discard
              //     </button>
              //     <button
              //       className={`py-2 px-4 mt-[-10px] rounded-2xl ${
              //         uploadedFile
              //           ? "cursor-pointer bg-[#00AFFE]"
              //           : "cursor-not-allowed flex items-center justify-between w-full border border-[#2d2d2d] rounded-xl py-2 px-4 bg-[#1d1d1d] text-yellow-50 focus:outline-none focus:ring-0 focus:border-[#4d4d4d] hover:bg-[#4d4d4d]"
              //       }`}
              //       onClick={handleSubmit}
              //       disabled={!uploadedFile}
              //     >
              //       Save
              //     </button>
              //   </div>
              // </div>
            )}
          </div>
        </div>
        {/* // ) : (
        //   <div className="flex justify-between items-center bg-[#161616] p-4 rounded-xl">
        //     <span className="text-white">{uploadedFile.name}</span>
        //     <div className="flex items-center gap-5 pt-2">
        //       <button
        //         className="mt-[-10px] cursor-pointer flex items-center justify-between w-full border border-[#2d2d2d] rounded-xl py-2 px-4 bg-[#1d1d1d] text-yellow-50 focus:outline-none focus:ring-0 focus:border-[#4d4d4d] hover:bg-[#4d4d4d] hover:bg-[red]/30 hover:border-[red]/60"
        //         onClick={handleDiscard}
        //       >
        //         Discard
        //       </button>
        //       <button
        //         className={`py-2 px-4 mt-[-10px] rounded-2xl ${
        //           uploadedFile
        //             ? "cursor-pointer bg-[#00AFFE]"
        //             : "cursor-not-allowed flex items-center justify-between w-full border border-[#2d2d2d] rounded-xl py-2 px-4 bg-[#1d1d1d] text-yellow-50 focus:outline-none focus:ring-0 focus:border-[#4d4d4d] hover:bg-[#4d4d4d]"
        //         }`}
        //         onClick={handleSubmit}
        //         disabled={!uploadedFile}
        //       >
        //         Save
        //       </button>
        //     </div>
        //   </div>
        // )} */}

        <ErrorBoundary onDismiss={handleDiscard}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
          </div>
        </ErrorBoundary>
      </div>

      <div className="flex flex-col mt-3 px-28 gap-10 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {renderOldProducts}
        </div>
      </div>
    </div>
  );
};

export default Products;
