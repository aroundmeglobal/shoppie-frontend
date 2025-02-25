interface Workspace {
    slug: string;
  }
  
  const getFilteredWorkspaces = async (slug: string): Promise<Workspace[]> => {
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
      throw new Error(`Failed to fetch workspaces: ${errorMessage}`);
    }
  
    const workspacesResponse = await allWorkspaces.json();
    const workspaces: Workspace[] = workspacesResponse.workspaces || [];
  
    if (!Array.isArray(workspaces)) {
      console.error("Expected workspaces to be an array, but got:", workspaces);
      return [];
    }
  
    const filteredWorkspaces = workspaces.filter((workspace) =>
      workspace.slug.startsWith(slug)
    );
  
    return filteredWorkspaces;
  };
  
  export default getFilteredWorkspaces;
  