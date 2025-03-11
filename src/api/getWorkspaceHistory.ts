// Define the type for the function parameters
interface GetWorkspaceHistoryParams {
  embed_id: string;
  sessionId: string;
}

// Update the function with the type for the arguments
export async function getWorkspaceHistory({
  embed_id,
  sessionId,
}: GetWorkspaceHistoryParams): Promise<any> {
  const chatData = await fetch(
    `https://anythingllm.aroundme.global/api/embed/${embed_id}/${sessionId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_LLM_AUTH_TOKEN}`,
      },
    }
  );

  if (!chatData.ok) {
    throw new Error("Error fetching chat history");
  }

  return chatData.json();
}
