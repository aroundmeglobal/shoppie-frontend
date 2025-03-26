const AnalyticsCardShimmer = () => {
  return (
    <div className="w-1/3 h-[160px] max-w-[calc(33.333%-1.25rem)]  bg-[#1d1d1d]  rounded-xl shadow-md overflow-hidden relative animate-pulse -z-10 ">
      <div className="p-4">
        <div className="h-[25px]  bg-[#5a5a5a] rounded w-1/2" />
        <div className="h-[45px]  bg-[#5a5a5a] rounded w-20  mt-5 " />
        <div className="h-[18px] bg-[#5a5a5a] rounded w-10/12 mt-5"></div>
      </div>
    </div>
  );
};

export default AnalyticsCardShimmer;
