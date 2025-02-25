const checkWorkspaceExistence = async (slug: string): Promise<boolean> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_LLM_BASE_URL}v1/workspace/${slug}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_LLM_AUTH_TOKEN}`,
      },
    }
  );

  const textResponse = await response.text();
  const data = JSON.parse(textResponse); 

  return data.workspace.length > 0;
};

export default checkWorkspaceExistence;
