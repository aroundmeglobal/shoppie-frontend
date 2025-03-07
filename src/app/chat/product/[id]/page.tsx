"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import { percentageDifference } from "@/lib/price";
import api from "@/lib/axiosInstance";
import Link from "next/link";

const ProductPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [productDetails, setProductDetails] = useState<any[]>([]);

  // Extracting query parameters
  const brandId = searchParams.get("brand_id");
  const productName = searchParams.get("product_name");
  const productDescription = searchParams.get("product_description");
  const productImages = searchParams.get("product_images");
  const originalPrice = searchParams.get("original_price");
  const discountedPrice = searchParams.get("discounted_price");
  const tags = searchParams.get("tags");
  const purchaseLink = searchParams.get("purchase_link")?.split(","); // Convert to array

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
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

    fetchProductDetails();
  }, []);

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  const getFavicon = (url: string) => {
    const domain = extractDomain(url);
    if (domain) {
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
    }
    return null;
  };

  const extractDomain = (url: string) => {
    try {
      const { hostname } = new URL(url);
      return hostname.replace("www.", ""); // Remove 'www.' part from the domain if needed
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  return (
    <div>
      <div className="flex items-start w-full mt-3 ">
        <span
          role="img"
          aria-label="Back"
          onClick={() => {
            router.back();
          }}
        >
          <Image
            src={"/img/white-back-arrow.svg"}
            alt="Back"
            width={16}
            height={16}
            style={{
              width: "16px",
              height: "16px",
              margin: "10px",
            }}
          />
        </span>
        <div className="text-[15px] w-[80%] ont-bold flex flex-col gap-[15px] text-white p-2 items-center justify-center">
          Details
        </div>
      </div>
      <div className="text-[15px] mx-6 my-2 h-[250px] bg-[#1d1d1d] rounded-xl font-bold items-center justify-center">
        <Image
          src={productImages || ""}
          alt={productName || ""}
          width={80}
          height={80}
          style={{ width: "100%", height: "100%", borderRadius: 20 }}
        />
      </div>
      <div className="rounded-md w-full px-6 py-2">
        <div className="mt-2 text-white ">
          <h3 className="text-[18px] font-bold">{productName}</h3>
          <div className="mt-[5px] text-[13px]">
            <div>
              <span className="text-[18px] font-bold">{originalPrice}</span>
              <span className="line-through text-[15px] font-medium text-[#a4a4a4] ml-2">
                {discountedPrice}
              </span>
              <span className=" text-[#15CF74] ml-2">
                {`${percentageDifference(
                  originalPrice || "",
                  discountedPrice || ""
                )}% Off`}
              </span>
            </div>
          </div>
          <BrandDescription description={productDescription || ""} />
        </div>
      </div>
      <div className="w-full p-2">
        <h1 className="text-[14px] font-semibold m-4">
          Buy this product through
        </h1>
        <div className="bg-[#1d1d1d] m-4 rounded-xl flex items-center p-[14px] space-x-4">
          {purchaseLink?.map((url, index) => {
            const faviconUrl = getFavicon(url);
            return (
              <a
                target="blank"
                href={url}
                key={index}
                className="rounded-xl overflow-hidden"
              >
                {faviconUrl && (
                  <Image
                    width={40}
                    height={40}
                    src={faviconUrl}
                    alt="Favicon"
                  />
                )}
              </a>
            );
          })}
        </div>

        {/* Similar products */}
        <div className="text-[#fff] text-[14px] font-semibold m-4 flex justify-between items-center">
          <h1>Similar products</h1>
          <button
            onClick={() => {
              router.push(`/chat/all-products/${brandId}`);
            }}
            className="text-white/80"
          >
            See All
          </button>
        </div>
        <div className="flex gap-6 mt-4 ml-4 mb-4 overflow-hidden overflow-x-auto">
          {productDetails?.map((product: any) => (
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
              className="bg-[#1c1c1c] rounded-xl overflow-hidden min-w-[200px]"
            >
              <div className="flex flex-col items-center">
                <Image
                  src={product.product_images[0]}
                  alt={product.product_name}
                  width={150}
                  height={180}
                  className="w-[100%]"
                />
                <div className="px-3 text-[13px] bg-[#2d2d2d] py-2 w-full">
                  <h3 className="text-white line-clamp-1">
                    {product.product_name}
                  </h3>
                  <div>
                    <span>{product.product_prices.Discounted_price}</span>
                    <span className="line-through text-[#a4a4a4] ml-2">
                      {product.product_prices.Original_price}
                    </span>
                    <span className="text-[#15CF74] ml-2">
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
};

export default ProductPage;

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
