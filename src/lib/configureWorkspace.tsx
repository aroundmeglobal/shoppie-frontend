import useBrandStore from "@/store/useBrandStore";
import api from "./axiosInstance";
import embedDocInWorkspace from "./embedDocInWorkspace";

type FileItem = {
  name: string;
  lastModified: number;
  lastModifiedDate: Date;
  webkitRelativePath: string;
  size: number;
  type: string;
};

type SubmissionData = {
  brandId: number;
  brandName: string;
  brandDescription: string;
  brandDomain: string;
  pdfs: FileItem[];
  deletedDocuments: string[];
  faqs: string;
  customInstruction: string;
};

const configureWorkspace = async (
  submissionData: SubmissionData
): Promise<any> => {
  // Check if pdfs exist in the submission data and loop through each file for upload
  if (submissionData.pdfs && submissionData.pdfs.length > 0) {
    for (const uploadedFile of submissionData.pdfs) {
      try {

        const uploadFileType = uploadedFile.type;

        // Request to generate signed URL

        const pdfResonse = await fetch(
          `https://fastapi.aroundme.tech/api/upload/generate-upload-url`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: `${submissionData.brandName
                .replace(/\s+/g, "-")
                .toLowerCase()}${uploadedFile.name}`,
              type: uploadFileType,
              asset_for: "user-pdf",
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
          console.log("File uploaded successfully:", uploadedFile.name);
          console.log("Product data URL:", pdfData.public_url);
        } else {
          throw new Error(`Error uploading file: ${uploadedFile.name}`);
        }

        //hit file upload api

        const body = {
          brand_id: submissionData.brandId,
          file: `${pdfData.public_url}`,
        };


        const responseFileUpload = await api.post(
          `${process.env.NEXT_PUBLIC_DEVBASEURL}/files/upload-knowledge`,
          body
        );

        const brandBody = {};
        const responseUpdateBrand = await api.put(
          `${process.env.NEXT_PUBLIC_DEVBASEURL}/brands/?brand_id=${submissionData.brandId}`,
          brandBody
        );

      } catch (error) {
        console.error("Error during file upload:", error);
      }
    }
  }

  if (submissionData.customInstruction || submissionData.brandDescription) {
    const responseCreateWorkspace = await api.get(
      `${process.env.NEXT_PUBLIC_DEVBASEURL}/brands/${submissionData.brandId}`
    );

    const workspacId = responseCreateWorkspace.data.workspaces[0].id;

    const body = {
      open_ai_prompt: `${submissionData.customInstruction}`,
    };

    const responseUpdateBrand = await api.put(
      `${process.env.NEXT_PUBLIC_DEVBASEURL}/workspaces/${workspacId}`,
      body
    );

    // now

    if (submissionData.brandDescription) {
      const body = {
        description: submissionData.brandDescription,
      };

      const responseUpdateBrandDescription = await api.put(
        `${process.env.NEXT_PUBLIC_DEVBASEURL}/brands/?brand_id=${submissionData.brandId}`,
        body
      );

    }
  }
};

export default configureWorkspace;
