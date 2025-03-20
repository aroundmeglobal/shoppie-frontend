export async function fetchUniqueViewData(brandId: string) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_ANALYSIS_BACKEND}/unique-view?brand_id=${brandId}`
    );
    if (!response.ok) {
      throw new Error("Error fetching unique view data");
    }
    return response.json();
  }
  
  export async function fetchTotalSentMessagesData(brandId: string) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_ANALYSIS_BACKEND}/total-sent-messages?brand_id=${brandId}`
    );
    if (!response.ok) {
      throw new Error("Error fetching total sent messages data");
    }
    return response.json();
  }
  
  export async function fetchTotalFirstMessagesData(brandId: string) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_ANALYSIS_BACKEND}/total-first-messages?brand_id=${brandId}`
    );
    if (!response.ok) {
      throw new Error("Error fetching total first messages data");
    }
    return response.json();
  }
  
  export async function fetchTotalWidgetTapsData(brandId: string) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_ANALYSIS_BACKEND}/total-widget-taps?brand_id=${brandId}`
    );
    if (!response.ok) {
      throw new Error("Error fetching total widget taps data");
    }
    return response.json();
  }
  