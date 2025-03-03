import { FAQ } from "@/component/ui/FaqComponent";

const embed = async (userId: string, locations: string[]) => {
  if (locations.length > 0) {
    try {
      const body = {
        adds: locations.map(location => `${location}`),
      };

      const responseUpdateEmbeddings = await fetch(
        `${process.env.NEXT_PUBLIC_LLM_BASE_URL}v1/workspace/${userId}/update-embeddings`,
        {
          method: "POST",
          body: JSON.stringify(body),
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_LLM_AUTH_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!responseUpdateEmbeddings.ok) {
        const errorMessage = await responseUpdateEmbeddings.text();
        throw new Error(`Embedding update failed: ${errorMessage}`);
      }

      const embeddingData = await responseUpdateEmbeddings.json();
      console.log("Embedding update successful:", embeddingData);
    } catch (error) {
      console.error("Error updating embeddings:", error);
      throw error;
    }
  }
};



const createWorkspace = async (
  pdfs: File[],
  faqs: FAQ[],
  customInstruction: string,
  userId: string,
  setIsLoading: (loading: boolean) => void
) => {
  try {
    setIsLoading(true); 

    // Step 1: Create Workspace
    const body = {
      name: `${userId}`,
      similarityThreshold: 0.25,
      openAiTemp: 0.7,
      openAiHistory: 20,
      openAiPrompt: `Given the following conversation, relevant context, and a follow-up question, reply with an answer to the current question the user is asking. Return only your response to the question given the above information following the user's instructions as needed. ${customInstruction}`,
      queryRefusalResponse:
        "There is no relevant information in this workspace to answer your query.",
      chatMode: "query",
      chatProvider: "openai",
      chatModel: "gpt-4o-mini",
      topN: 4,
    };

    let workspaceData = null;

    try {
      const responseCreateWorkspace = await fetch(
        `${process.env.NEXT_PUBLIC_LLM_BASE_URL}v1/workspace/new`,
        {
          method: "POST",
          body: JSON.stringify(body),
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_LLM_AUTH_TOKEN}`,
          },
        }
      );

      if (!responseCreateWorkspace.ok) {
        const errorMessage = await responseCreateWorkspace.text();
        throw new Error(`Workspace creation failed: ${errorMessage}`);
      }

      workspaceData = await responseCreateWorkspace.json();
      console.log("Workspace created:", workspaceData);
    } catch (error) {
      console.error("Error in creating workspace:", error);
      throw error;
    }

    // Step 2: Upload PDFs

    const pdfLocations: string[] = []; // To store the locations of uploaded PDFs

    for (const file of pdfs) {
      try {
        const pdfToSend = new FormData();
        pdfToSend.append("file", file);
        pdfToSend.append("folder", `${userId}`); // Folder name is the userId

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

    // // step 3: Update embedings for pdf
  
    await embed(userId, pdfLocations);

    // step 4: upload faqs as rawtext

    let textContent = "";
    for (const faq of faqs) {
      textContent += `${faq.question}\n\n${faq.answer}\n\n`; 
    }

    const textBlob = new Blob([textContent], { type: "text/plain" });
    
    const formData = new FormData();
    formData.append("file", textBlob, "faqs.txt"); 
    formData.append("folder", `${userId}`); 

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


    //embding it in workspace

    await embed(userId, [textData.documents[0].location]);

    return { success: true, message: "Data uploaded successfully, Your Personalized AI BOT is ready" };

  } catch (error) {
    return { success: false, message: "Error creating workspace. Please try again." };
  } finally {
    setIsLoading(false); // Stop the loading spinner
  }
};

export default createWorkspace;
