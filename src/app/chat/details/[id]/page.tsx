"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import useSelectedBrandStore from "@/store/selectedBrand";
import { MdVerified } from "react-icons/md";
import api from "@/lib/axiosInstance";
import { percentageDifference } from "@/lib/price";
import Link from "next/link";

interface PageProps {
  params: {
    id: string;
  };
}

export default function Page({ params }: PageProps) {
  const router = useRouter();
  const brandId = params.id;
  const brand = useSelectedBrandStore((state) => state.brand);
  const [brandDetails, setBrandDetails] = useState<any>(null);
  const [socialDetails, setSocialDetails] = useState<any[]>([]);
  const [productDetails, setProductDetails] = useState<any[]>([]);

  const handleBack = () => {
    router.back();
  };

  useEffect(() => {
    const getBrandDetails = async () => {
      const response = await api.get(`/brands/${brandId}`);
      const data = response.data;
      setBrandDetails(data);
      console.log(data);
    };
    const fetchSocialDetails = async () => {
      try {
        const response = await api.get(`/social/brand-social/${brandId}`);
        const data = response.data;
        setSocialDetails(data);
      } catch (err) {
        console.error(err);
      }
    };
    const fetchProductDetails = async () => {
      try {
        // Construct query params correctly
        const response = await api.get("/files/", {
          params: {
            brand_id: brandId || "",
          },
        });
        const data = response.data;
        setProductDetails(data);
      } catch (err) {
        console.error(err);
      }
    };

    getBrandDetails();
    fetchSocialDetails();
    fetchProductDetails();
  }, [params.id]);

  const extractDomain = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return domain;
    } catch (e) {
      return null;
    }
  };

  const getFavicon = (url: string): string => {
    const domain = extractDomain(url);
    if (domain) {
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
    }
    // Return a fallback image path if domain is null
    return "/aroundImg.png";
  };

  const socialLinks = socialDetails.map((link: any) => ({
    name: link.type,
    url: link.link,
  }));

  const handleSeeAllClick = () => {
    router.push(`/chat/all-products/${brandId}`);
  };

  return (
    <div className="w-full h-full bg-[#09090b] p-2">
      {/* Top Bar */}
      <div className="flex justify-between md:justify-between items-center ">
        <div className="text-[15px] font-bold flex flex-1 items-center gap-[15px] text-white">
          <span
            role="img"
            aria-label="Back"
            onClick={handleBack}
            className=" mt-[-60px] "
          >
            <Image
              src={"/img/white-back-arrow.svg"}
              alt="Back"
              width={16}
              height={16}
              style={{
                width: "16px",
                height: "16px",
                marginLeft: "10px",
              }}
            />
          </span>
          <div className="flex flex-1 mt-2 justify-center">
            <div className=" ml-[-50px] flex flex-col gap-2 items-center ">
              <Image
                src={brand?.brand_logo}
                alt="Brand Logo"
                width={20}
                height={20}
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "40px",
                }}
              />
              <div className="flex items-center gap-2">
                <div className="text-white text-xl">{brand?.brand_name}</div>
                <MdVerified color="#1E60FB" size={18} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Brand Description */}
      <div className="px-2 py-2">
        <h1 className="text-[#a4a4a4] text-[13px] font-semibold mt-8 font-[BR Firma]">
          Brand Description
        </h1>

        <BrandDescription description={brandDetails?.description} />

        {/* Social Media Links */}
        <h1 className="text-[#fff]/50 text-[14px] font-semibold mt-4">
          Socials
        </h1>
        <div className="rounded-xl mt-2 bg-[#1d1d1d] flex items-center p-[14px] min-h-[55px]">
          {socialLinks.map((link, index) =>
            link.url ? (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mr-4"
              >
                <Image
                  src={getFavicon(link.url)}
                  alt={link.name}
                  width={45}
                  height={45}
                  style={{ borderRadius: 50, backgroundColor: "white" }}
                />
              </a>
            ) : null
          )}
        </div>

        {/* Products and See All Button */}
        <div className="text-[#fff] text-[14px] font-semibold mt-4 flex justify-between items-center">
          <h1>Our Products</h1>
          <button onClick={handleSeeAllClick} className="text-white/80">
            See All
          </button>
        </div>
        <div className="grid grid-cols-2  gap-6 mt-4 ">
          {productDetails.slice(0, 4).map((product: any) => (
            <Link
              key={product.id}
              href={{
                pathname: `/chat/product/${product.id}`,
                query: {
                  brand_id: brandId,
                  product_name: product.product_name,
                  product_description: product.product_description,
                  product_images: product.product_images[0],
                  original_price: product.product_prices?.Original_price,
                  discounted_price: product.product_prices?.Discounted_price,
                  tags: product.tags.join(","),
                  purchase_link: product.purchase_link.join(","),
                },
              }}
              passHref
              className="bg-[#1c1c1c] rounded-xl overflow-hidden "
            >
              <div className="flex flex-col items-center">
                <Image
                  src={product.product_images[0]}
                  alt={product.title}
                  width={150}
                  height={180}
                  className="w-[100%]"
                />
                <div className="px-3 text-[13px] bg-[#2d2d2d] py-2 w-full">
                  <h3 className="text-white  line-clamp-1">
                    {product.product_name}
                  </h3>
                  <div>
                    <span className="">
                      {product.product_prices?.Discounted_price}
                    </span>
                    <span className=" line-through text-[#a4a4a4] ml-2">
                      {product.product_prices?.Original_price}
                    </span>
                    <span className=" text-[#15CF74] ml-2">
                      {`${percentageDifference(
                        product.product_prices?.Original_price,
                        product.product_prices?.Discounted_price
                      )}% Off`}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

const BrandDescription = ({ description }: { description: string }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);

  const trimmedDescription =
    description?.length > 150 ? description.slice(0, 150) + "..." : description;

  return (
    <div className="rounded-xl text-[13px] w-full mt-2 bg-[#1d1d1d] p-[14px] min-h-[55px]">
      <div className="text-white">
        <p>{showFullDescription ? description : trimmedDescription}</p>
      </div>
      {description?.length > 150 && (
        <button
          onClick={() => setShowFullDescription(!showFullDescription)}
          className="text-[#1E60FB] text-[12px] mt-2"
        >
          {showFullDescription ? "Show Less" : "Show More"}
        </button>
      )}
    </div>
  );
};
