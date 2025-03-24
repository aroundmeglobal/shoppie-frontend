import api from "@/lib/axiosInstance";

export async function fetchUniqueViewData(brandId: string) {
  console.log(brandId);

  const response = await api.get(
    `${process.env.NEXT_PUBLIC_ANALYSIS_BACKEND}/unique-view?brand_id=${brandId}`
  );

  return response.data;
}

export async function fetchTotalSentMessagesData(brandId: string) {
  const response = await api.get(
    `${process.env.NEXT_PUBLIC_ANALYSIS_BACKEND}/total-sent-messages?brand_id=${brandId}`
  );
  return response.data;
}

export async function fetchTotalFirstMessagesData(brandId: string) {
  const response = await api.get(
    `${process.env.NEXT_PUBLIC_ANALYSIS_BACKEND}/total-first-messages?brand_id=${brandId}`
  );
  return response.data;
}

export async function fetchTotalWidgetTapsData(brandId: string) {
  const response = await api.get(
    `${process.env.NEXT_PUBLIC_ANALYSIS_BACKEND}/total-widget-taps?brand_id=${brandId}`
  );
  return response.data;
}

export async function getAverage(brandId: string) {
  const response = await api.get(
    `${process.env.NEXT_PUBLIC_ANALYSIS_BACKEND}/average-messages-per-conversation/?brand_id=${brandId}`
  );
  return response.data;
}

export async function getProductTaps(brandId: string) {
  const response = await api.get(
    `${process.env.NEXT_PUBLIC_ANALYSIS_BACKEND}/product-taps/?brand_id=${brandId}`
  );
  return response.data;
}

export async function getProducts(brandId: string, product_title: any) {
  const products = Object.keys(product_title);
  const response = await api.post(
    `${process.env.NEXT_PUBLIC_DEVBASEURL}/files/product-name-details?brand_id=${brandId}`,
    {
      products: products,
    }
  );
  return response.data;
}
