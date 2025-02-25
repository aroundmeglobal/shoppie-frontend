const embedDocInWorkspace = async (userId: string, locations: string[]) => {
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


  export default embedDocInWorkspace;