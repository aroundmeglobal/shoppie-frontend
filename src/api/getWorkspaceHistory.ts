export async function getWorkspaceHistory(workspaceId: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_LLM_BASE_URL}/v1/workspace/${workspaceId}/chats`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_LLM_AUTH_TOKEN}`,
        },
      });
    if (!res.ok) {
      throw new Error("Error fetching chat history");
    }
    return res.json();
  }
  