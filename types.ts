export interface FAQ {
  question: string;
  answer: string;
}

export type Product = {
  product_name: string;
  product_images: string;
  product_description: string;
  original_price: string;
  discounted_price: string;
  tags: string[];
  purchase_link: string;
};
