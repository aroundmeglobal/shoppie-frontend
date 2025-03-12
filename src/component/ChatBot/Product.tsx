import Image from "next/image";

interface Types {
  product: any;
}

const Product = ({ product }: Types) => {
  if (!product) return;

  return (
    <div
      key={product.id}
      className="product-card flex-shrink-0 flex flex-col items-start w-[200px] bg-gborder  rounded-xl bg-[#1d1d1d] text-yellow-50 h-[300px] gap-3 cursor-pointer pb-2"
    >
      <Image
        src={product.image_url ?? product?.product_images[0]}
        alt={product.title ?? product.product_name}
        width={100}
        height={48}
        className="w-full h-[180px]  object-contain rounded-xl rounded-b-none  bg-[#1d1d1d]"
      />
      <div className="mx-3  flex flex-col justify-between  gap-2 flex-grow  text-start ">
        <h3 className="font-medium text-[13px] line-clamp-2 md:line-clamp-2 ">
          {product.title ?? product.product_name}
        </h3>
        <div className="flex-col gap-1 flex">
          <h3 className="text-md font-semibold">
            {product.discounted_price ??
              product?.product_prices?.Discounted_price}
          </h3>
          <h3 className="line-through text-sm text-[grey]/90">
            {product?.original_price ?? product.product_prices?.Original_price}
          </h3>
        </div>
      </div>
    </div>
  );
};

export default Product;
