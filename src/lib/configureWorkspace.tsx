import useBrandStore from "@/store/useBrandStore";
import api from "./axiosInstance";
import embedDocInWorkspace from "./embedDocInWorkspace";

interface UpdateBrandPayload {
  user_id: number;
  domain?: string;
  brand_name?: string;
  meta?: {
    brand_description?: string;
    custom_instruction?: string;
    faqs?: Array<{
      question: string;
      answer: string;
    }>;
    // Add any other properties in meta you need
  };
}
// configureWorkspace.ts
const configureWorkspace = async (submissionData: any): Promise<any> => {
  try {
    // //fetch all workspaces

    const allWorkspaces = await fetch(
      `${process.env.NEXT_PUBLIC_LLM_BASE_URL}/v1/workspaces`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_LLM_AUTH_TOKEN}`,
        },
      }
    );

    if (!allWorkspaces.ok) {
      const errorMessage = await allWorkspaces.text();
      throw new Error(
        `Brand overview text file upload failed: ${errorMessage}`
      );
    }

    let workspacesResponse = await allWorkspaces.json();

    let workspaces = workspacesResponse.workspaces || [];

    if (!Array.isArray(workspaces)) {
      console.error("Expected workspaces to be an array, but got:", workspaces);
      return;
    }

    const filteredWorkspaces = workspaces.filter((workspace) =>
      workspace.slug.startsWith(submissionData.userId)
    );

    // updating brand description

    if (submissionData.brandDescription) {
      // Create a general template text file with brand info
      const textContent = `
    Brand Overview:

    Brand Name: ${submissionData.brandName}

    Brand Description:
    ${submissionData.brandDescription}

    Brand Domain:
    ${submissionData.brandDomain}

    Key Information:
    - Name: ${submissionData.brandName}
    - Description: ${submissionData.brandDescription}
    - Domain: ${submissionData.brandDomain}

    Overview Summary:
    - The brand "${submissionData.brandName}" offers innovative solutions in the domain of "${submissionData.brandDomain}". With a mission to provide high-quality products and services, the brand focuses on delivering value to its customers. The brand's description highlights its commitment to excellence and customer satisfaction.
    `;

      //fetching brand data documnetn
      const allDocumnets = await fetch(
        `${process.env.NEXT_PUBLIC_LLM_BASE_URL}v1/documents/folder/${submissionData.userId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_LLM_AUTH_TOKEN}`,
          },
        }
      );

      if (!allDocumnets.ok) {
        const errorMessage = await allDocumnets.text();
        throw new Error(`Failed to fetch all documents: ${errorMessage}`);
      }

      const brandDocumnets = await allDocumnets.json();

      // //   Extract the document that starts with 'brand-overview'
      const brandOverviewDocuments = brandDocumnets.documents.filter(
        (document) => document.name.startsWith("brand-overview")
      );

      // //dlete old file

      const deleteBody = {
        names: [`${submissionData.userId}/${brandOverviewDocuments[0].name}`],
      };

      const removeDocumnet = await fetch(
        `${process.env.NEXT_PUBLIC_LLM_BASE_URL}v1/system/remove-documents`,
        {
          method: "DELETE",
          body: JSON.stringify(deleteBody),
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_LLM_AUTH_TOKEN}`,
          },
        }
      );

      if (!removeDocumnet.ok) {
        const errorMessage = await removeDocumnet.text();
        throw new Error(`Remove documnet failed: ${errorMessage}`);
      }

      const embeddingData = await removeDocumnet.json();
      console.log("Succefully removed old file");

      // // upload new file

      const textBlob = new Blob([textContent], { type: "text/plain" });

      const formData = new FormData();
      formData.append("file", textBlob, "brand-overview.txt");
      formData.append("folder", `${submissionData.userId}`);

      // Upload the text file
      const UploadText = await fetch(
        `${process.env.NEXT_PUBLIC_LLM_BASE_URL}v1/document/upload-folder`,
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_LLM_AUTH_TOKEN}`,
          },
        }
      );

      if (!UploadText.ok) {
        const errorMessage = await UploadText.text();
        throw new Error(
          `Brand overview text file upload failed: ${errorMessage}`
        );
      }

      const textData = await UploadText.json();

      console.log("new brand file upload");

      //embeding in the workspace
      for (let workspace of filteredWorkspaces) {
        try {
          console.log(`Embedding document in workspace: ${workspace.slug}`);
          await embedDocInWorkspace(workspace.slug, [
            textData.documents[0].location,
          ]);
        } catch (error) {
          console.error(
            `Error embedding document in workspace ${workspace.slug}:`,
            error
          );
        }
      }
    }

    // // delete old pdf

    if (submissionData.deletedDocuments.length > 0) {
      console.log("now we need to delete", submissionData.deletedDocuments);

      const deleteBody = {
        names: submissionData.deletedDocuments.map(
          (doc) => `${submissionData.userId}/${doc.name}`
        ),
      };
      const removeDocumnet = await fetch(
        `${process.env.NEXT_PUBLIC_LLM_BASE_URL}v1/system/remove-documents`,
        {
          method: "DELETE",
          body: JSON.stringify(deleteBody),
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_LLM_AUTH_TOKEN}`,
          },
        }
      );

      if (!removeDocumnet.ok) {
        const errorMessage = await removeDocumnet.text();
        throw new Error(`Remove documnet failed: ${errorMessage}`);
      }

      const embeddingData = await removeDocumnet.json();
      console.log("Succefully removed old file");
    }

    // // // upload pdfs
    if (submissionData.pdfs.length > 0) {
      console.log("need to upload pdfs", submissionData.pdfs);

      const pdfLocations: string[] = []; // To store the locations of uploaded PDFs

      for (const file of submissionData.pdfs) {
        try {
          const pdfToSend = new FormData();
          pdfToSend.append("file", file);
          pdfToSend.append("folder", `${submissionData.userId}`); // Folder name is the userId

          const responseUploadPdfs = await fetch(
            `${process.env.NEXT_PUBLIC_LLM_BASE_URL}v1/document/upload-folder`,
            {
              method: "POST",
              body: pdfToSend,
              headers: {
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_LLM_AUTH_TOKEN}`,
              },
            }
          );

          if (!responseUploadPdfs.ok) {
            const errorMessage = await responseUploadPdfs.text();
            throw new Error(`PDF upload failed: ${errorMessage}`);
          }

          const pdfData = await responseUploadPdfs.json();
          console.log("PDF uploaded:", pdfData);

          const documentLocation = pdfData.documents[0].location;
          if (documentLocation) {
            pdfLocations.push(documentLocation);
          } else {
            console.error("Location not found in uploaded PDF data");
          }
        } catch (error) {
          console.error("Error uploading PDF:", error);
          throw error;
        }
      }

      console.log(pdfLocations);

      for (let workspace of filteredWorkspaces) {
        try {
          console.log(`Embedding document in workspace: ${workspace.slug}`);
          await embedDocInWorkspace(workspace.slug, pdfLocations);
        } catch (error) {
          console.error(
            `Error embedding document in workspace ${workspace.slug}:`,
            error
          );
        }
      }
    }

    // // upload faqs

    if (submissionData.faqs.length > 0) {
      console.log("faqs");

      let textContent = "";
      for (const faq of submissionData.faqs) {
        textContent += `${faq.question}\n\n${faq.answer}\n\n`;
      }

      const textBlob = new Blob([textContent], { type: "text/plain" });

      const formData = new FormData();
      formData.append("file", textBlob, "faqs.txt");
      formData.append("folder", `${submissionData.userId}`);

      const responseUploadText = await fetch(
        `${process.env.NEXT_PUBLIC_LLM_BASE_URL}v1/document/upload-folder`,
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_LLM_AUTH_TOKEN}`,
          },
        }
      );

      if (!responseUploadText.ok) {
        const errorMessage = await responseUploadText.text();
        throw new Error(`FAQ text file upload failed: ${errorMessage}`);
      }

      const textData = await responseUploadText.json();
      console.log("FAQ text file uploaded:", textData);

      for (let workspace of filteredWorkspaces) {
        try {
          console.log(`Embedding document in workspace: ${workspace.slug}`);
          await embedDocInWorkspace(workspace.slug, [
            textData.documents[0].location,
          ]);
        } catch (error) {
          console.error(
            `Error embedding document in workspace ${workspace.slug}:`,
            error
          );
        }
      }
    }

    // // custom instructions
    if (submissionData.customInstruction) {
      const body = {
        ...filteredWorkspaces[0],
        openAiPrompt: `${submissionData.customInstruction}. brand prompt:  ${filteredWorkspaces[0].openAiPrompt} `, // Append the custom instruction
      };

      const updateWorkspace = await fetch(
        `${process.env.NEXT_PUBLIC_LLM_BASE_URL}v1/workspace/${filteredWorkspaces[0].slug}/update`,
        {
          method: "POST",
          body: JSON.stringify(body), // Convert body to JSON string
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_LLM_AUTH_TOKEN}`,
          },
        }
      );
      if (!updateWorkspace.ok) {
        const errorMessage = await updateWorkspace.text();
        throw new Error(`Custom insstruction  upload failed: ${errorMessage}`);
      }

      const updatedWorkspace = await updateWorkspace.json();
      console.log("Custom instruction updated:", updatedWorkspace);
    }

    // // api updation for our db

    // 1. Fetch existing brand data from DB
    const brandDataInDB = await api.get("/users/brand-details");

    console.log("brand data", brandDataInDB.data);

    const dbBrandData = brandDataInDB.data;

    // 2. Copy the current meta from the DB
    let updatedMeta = { ...dbBrandData.meta };

    // 3. Overwrite meta fields only if they are present in submissionData
    if (
      submissionData.brandDescription &&
      submissionData.brandDescription.trim()
    ) {
      updatedMeta.brand_description = submissionData.brandDescription;
    }

    if (
      submissionData.customInstruction &&
      submissionData.customInstruction.trim()
    ) {
      updatedMeta.custom_instruction = submissionData.customInstruction;
    }

    if (submissionData.faqs && submissionData.faqs.length > 0) {
      updatedMeta.faqs = submissionData.faqs;
    }

    // If you have PDFs or documents to add, handle them similarly:
    // e.g., updatedMeta.pdfs = ... (depending on how you want to store them)

    // 4. Prepare the body for the update API call
    const requestBody: UpdateBrandPayload = {
      user_id: submissionData.userId,
    };

    // Only include domain if it is provided in submissionData
    if (submissionData.brandDomain && submissionData.brandDomain.trim()) {
      requestBody.domain = submissionData.brandDomain;
    }

    // Only include brand_name if you need to update it
    if (submissionData.brandName && submissionData.brandName.trim()) {
      requestBody.brand_name = submissionData.brandName;
    }

    // Finally, attach the updated meta
    requestBody.meta = updatedMeta;

    // 5. Make the PUT request to update the brand
    await api.put("/users/update-brand", requestBody);

    return { success: true };

    // embed in all owrkspaces
  } catch (error) {
    console.error("Error configuring workspace:", error);
    throw new Error("Error configuring workspace");
  }
};

export default configureWorkspace;

//delete previous instance
