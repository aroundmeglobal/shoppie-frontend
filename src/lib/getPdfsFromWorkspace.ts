const getPdfsFromWorkspace = async (folderName: string): Promise<any> => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_LLM_BASE_URL}v1/documents/folder/${folderName}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_LLM_AUTH_TOKEN}`,
          },
        }
      );
  
      if (!response.ok) {
        throw new Error("Failed to fetch data from the server");
      }
  
      const textResponse = await response.text();
      const data = JSON.parse(textResponse);
        
      return data.documents; // Return documents array to be used elsewhere
    } catch (error) {
      console.error("Error fetching data: ", error);
      return [];
    }
  };
  
  export default getPdfsFromWorkspace;
  