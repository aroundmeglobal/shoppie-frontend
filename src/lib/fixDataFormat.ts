export default function fixDataFormat(data: any) {
  // If the data is already an object, return it as is
  if (typeof data === "object" && data !== null) {
    return data;
  }

  // If it's a string, clean and parse it
  if (typeof data === "string") {
    try {
      // Clean up any escape characters like backslashes
      const cleanedData = data.replace(/\\/g, "");

      // Parse the cleaned data string into a valid object
      const parsedData = JSON.parse(cleanedData);

      // Check for missing fields and set default values if necessary
      const requiredFields = [
        "id",
        "title",
        "image_url",
        "original_price",
        "discounted_price",
        "product_description",
        "buy_link",
      ];

      requiredFields.forEach((field) => {
        if (!parsedData[field]) {
          parsedData[field] = null; // Or provide a default value here
        }
      });

      // Example: If there's no price, assign a default value
      if (!parsedData.original_price) {
        parsedData.original_price = "₹ 0";
      }
      if (!parsedData.discounted_price) {
        parsedData.discounted_price = "₹ 0";
      }

      return parsedData;
    } catch (error) {
      console.error("Error parsing data:", error);
      return null;
    }
  }

  return null; // If the data is neither a valid object nor a string, return null
}
