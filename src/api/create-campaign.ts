
interface CampaignFormData {
  campaignName: string;
  campaignType: string;
  budget: string;
  titles: string;
  productDetails: string;
  openingMessage: string;
  maxMessagePerChitchat: string;
  category: string;
  region: string;
  faqs: string;
  customInstruction: string;
};

const createCampaign = async (formData: CampaignFormData) => {

  const url = `https://fastapi.aroundme.tech/api/chitchats/create`;

  const body = {
    title: formData.titles,
    topics: ["Advices"], // Assuming titles is a comma-separated string
    meta: { brand: { first_message: formData.openingMessage } },
    radius: 15,
    place: "Pragati Nagar",
    latitude: "17.5186", // Use dynamic latitude if needed
    longitude: "78.3963", // Use dynamic longitude if neede
    is_public: true,
    is_sponsored: true,
  };

  console.log(body);

  const options: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Ensure session cookie is sent with request
    body: JSON.stringify(body),
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    if (response.ok) {
      console.log('Campaign created successfully:', data);
    } else {
      console.error('Error creating campaign:', data);
    }
  } catch (error) {
    console.error('Network error:', error);
  }
};


export default createCampaign;
