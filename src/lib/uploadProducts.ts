import Papa from "papaparse";
import embedDocInWorkspace from "./embedDocInWorkspace";
import getFilteredWorkspaces from "./getFilteredWorkspaces";
import api from "./axiosInstance";

// Wrap Papa Parse in a Promise for easier async/await usage.
const parseCSV = (text: string): Promise<{ data: any[] }> => {
  return new Promise((resolve, reject) => {
    Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
      complete: (results: { data: any[] }) => resolve(results),
      error: (error: any) => reject(error),
    });
  });
};

const uploadProducts = async (slug: string, file: File): Promise<void> => {
  console.log("file", file);

  try {
    // Read the CSV file
    const text = await file.text();

    // Parse the CSV file using the Promise-based wrapper
    const results = await parseCSV(text);

    // Clean the purchase links
    const cleanedData = results.data.map((row: any) => {
      const cleanedLink = cleanLink(row.Purchase_link);

      return {
        Product_name: row.Product_name,
        Product_images: row.Product_images,
        Product_description: row.Product_description,
        Original_price: row.Original_price,
        Discounted_price: row.Discounted_price,
        Tags: row.Tags
          ? row.Tags.split(",").map((tag: string) => tag.trim())
          : [],
        Purchase_link: cleanedLink,
      };
    });

    const cleanedCSV = Papa.unparse(cleanedData);

    const blob = new Blob([cleanedCSV], { type: "text/csv" });

    const formDataForDB = new FormData();
    formDataForDB.append("csv_file", blob, "brand-products.csv");

    const formData = new FormData();
    formData.append("file", blob, "brand-products");
    formData.append("folder", slug);

    const uploadTextResponse = await fetch(
      `${process.env.NEXT_PUBLIC_LLM_BASE_URL}v1/document/upload-folder`,
      {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_LLM_AUTH_TOKEN}`,
        },
      }
    );

    if (!uploadTextResponse.ok) {
      const errorMessage = await uploadTextResponse.text();
      throw new Error(
        `Brand overview text file upload failed: ${errorMessage}`
      );
    }

    const textData = await uploadTextResponse.json();
    console.log("New brand file upload:", textData);

    const filteredWorkspaces = await getFilteredWorkspaces(slug);

    for (const workspace of filteredWorkspaces) {
      try {
        console.log(`Embedding document in workspace: ${workspace.slug}`);
        await embedDocInWorkspace(workspace.slug, [
          textData.documents[0].location,
        ]);
      } catch (embedError) {
        console.error(
          `Error embedding document in workspace ${workspace.slug}:`,
          embedError
        );
      }
    }

    // uploading to my db

    // const response = await api.post("/users/insert-product-csv", {
    //   formDataForDB,
    // });

    // if (response.status === 200) {
    //   console.log("CSV file successfully uploaded to the backend");
    // } else {
    //   console.error("Error uploading CSV file to the backend");
    // }
  } catch (error) {
    console.error("Error in uploadProducts:", error);
  }
};

// Function to clean the purchase link and extract the base URL
const cleanLink = (link: string): string => {
  try {
    const url = new URL(link); // Create a URL object from the string
    return url.origin + url.pathname; // Return the base URL (hostname + path)
  } catch (error) {
    console.error("Error cleaning the link:", error);
    return link; // Return the original link if it can't be cleaned
  }
};

export default uploadProducts;
