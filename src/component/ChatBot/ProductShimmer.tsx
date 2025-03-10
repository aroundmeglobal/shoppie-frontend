const ProductCardShimmer = () => {
  return (
    <div className="w-[200px] h-[280px] mt-2 bg-[#1d1d1d] rounded-xl flex flex-col gap-3  animate-pulse">
      {/* Image Placeholder */}
      <div className="w-full h-[180px] bg-[#5a5a5a] rounded-xl rounded-b-none shimmer"></div>

      {/* Text Placeholder */}
      <div className="flex flex-col gap-2 px-3">
        <div className="h-4 bg-[#5a5a5a] rounded w-full"></div>
        <div className="h-4 bg-[#5a5a5a] rounded w-1/2 "></div>
        <div className="h-3 bg-[#5a5a5a] rounded w-1/3 mt-2"></div>
      </div>
    </div>
  );
};

export default ProductCardShimmer;
