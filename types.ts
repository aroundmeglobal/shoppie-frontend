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

export interface ThemeFields {
  userBgColor: string;
  assistantBgColor: string;
  embedId: string;
  baseApiUrl: string;
  headerColor: string;
  textHeaderColor: string;
  bgColor: string;
  inputbarColor: string;
  cardBgColor: string;
  userTextColor: string;
  botTextColor: string;
  cardTextColor: string;
  cardTextSubColour: string;
  inputbarDisabled: boolean;
  startingMessageTheme: string;
  openingMessageTextColor: string;
  inputTextColor: string;
}

interface ColorFieldProps {
  label: string;
  name: string;
}

export interface ColorCategory {
  category: string;
  fields: ColorFieldProps[];
}
