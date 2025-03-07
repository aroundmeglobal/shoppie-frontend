const cleanPrice = (price: string) => {
    return parseFloat(price.replace(/[₹,]/g, ""));
  };
  
export const percentageDifference = (
    originalPrice: string,
    discountedPrice: string
  ) => {
    const original = cleanPrice(originalPrice);
    const discounted = cleanPrice(discountedPrice);
  
    return Math.round(((original - discounted) / original) * 100);
  };