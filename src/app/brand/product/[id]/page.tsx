import React from "react";

interface PageProps {
  id: string;
}

function Page({ id }: PageProps) {
  return <div>{id}</div>;
}

export default Page;
