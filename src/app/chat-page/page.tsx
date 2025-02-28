"use client";
import React from "react";
import useBrandStore from "@/store/selectedBrand";

export default function Page() {
  const brand = useBrandStore((state) => state.brand);
  return <div>{brand.name}</div>;
}
