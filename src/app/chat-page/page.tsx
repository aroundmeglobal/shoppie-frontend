"use client";
import React from "react";
import useSelectedBrandStore from "@/store/selectedBrand";

export default function Page() {
  const brand = useSelectedBrandStore((state) => state.brand);
  return <div>{brand.name}</div>;
}
