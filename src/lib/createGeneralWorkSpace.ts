import embedDocInWorkspace from "./embedDocInWorkspace";

const createGeneralWorkSpace = async (
  userId: string,
  brandName: string,
  brandDescription: string,
  brandDomain: string
): Promise<boolean> => {
  const body = {
    name: `${userId}`,
    similarityThreshold: 0.25,
    openAiTemp: 0.7,
    openAiHistory: 20,
    openAiPrompt: `Given the following conversation, relevant context, and a follow-up question, reply with an answer to the current question the user is asking. Return only your response to the question given the above information following the user's instructions as needed.`,
    queryRefusalResponse:
      "There is no relevant information in this workspace to answer your query.",
    chatMode: "query",
    chatProvider: "openai",
    chatModel: "gpt-4o-mini",
    topN: 4,
    brand: {
      name: brandName,
      description: brandDescription,
      domain: brandDomain,
    },
  };

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
      console.error("Error creating workspace:", errorMessage);
      throw new Error(`Workspace creation failed: ${errorMessage}`);
    }

    const workspaceData = await responseCreateWorkspace.json();
    console.log("Workspace created successfully:", workspaceData);

    // Create a general template text file with brand info
    const textContent = `
Brand Overview:

Brand Name: ${brandName}

Brand Description:
${brandDescription}

Brand Domain:
${brandDomain}

Key Information:
- Name: ${brandName}
- Description: ${brandDescription}
- Domain: ${brandDomain}

Overview Summary:
- The brand "${brandName}" offers innovative solutions in the domain of "${brandDomain}". With a mission to provide high-quality products and services, the brand focuses on delivering value to its customers. The brand's description highlights its commitment to excellence and customer satisfaction.  
`;

    const textBlob = new Blob([textContent], { type: "text/plain" });

    const formData = new FormData();
    formData.append("file", textBlob, "brand-overview.txt");
    formData.append("folder", `${userId}`);

    // Upload the text file
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
      throw new Error(
        `Brand overview text file upload failed: ${errorMessage}`
      );
    }

    const textData = await responseUploadText.json();
    console.log("Brand overview text file uploaded:", textData);

    //embding it in workspace

    await embedDocInWorkspace(userId, [textData.documents[0].location]);

    return true;
  } catch (error) {
    console.error("Error in creating workspace or uploading file:", error);
    return false;
  }
};

export default createGeneralWorkSpace;
