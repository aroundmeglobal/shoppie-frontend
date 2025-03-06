// import api from "@/lib/axiosInstance";

// export async function getBradData(brandId: string) {  
//   const res = await api.get(
//     `${process.env.NEXT_PUBLIC_DEVBASEURL}/brands/${brandId}`
//   );
//   if (!res.status) {
//     throw new Error("Error fetching chat history");
//   }
//   return res;
// }
import api from "@/lib/axiosInstance";

export async function getBradData(brandId: string) {
  try {
    console.log(brandId);
    
    // POST Request
    const contactRes = await api.get(
      `${process.env.NEXT_PUBLIC_DEVBASEURL}/brand_contact/${brandId}`,
    );
    if (contactRes.status !== 200) {
      throw new Error("Error requesting brand contact details data");
    }

    // GET Request
    const brandRes = await api.get(
      `${process.env.NEXT_PUBLIC_DEVBASEURL}/brands/${brandId}`
    );
    if (brandRes.status !== 200) {
      throw new Error("Error fetching brand general data");
    }

    return {
      contactData: contactRes.data,
      brandData: brandRes.data,
    };

  } catch (error) {
    console.error("Error:", error);
    throw new Error(error.message || "An error occurred while fetching data");
  }
}
