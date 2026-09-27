export interface ProductBrand {
  id: number;
  name: string;
}

export interface ProductCategory {
  id: number;
  name: string;
}

export interface ProductMedia {
  id: string;
  url: string;
  position: number;
}

export interface ProductAttributeItem {
  productAttributeId: number;
  name: string;
  value: string;
}

export interface ProductOptionValue {
  id: number;
  value: string;
  position: number;
}

export interface ProductOption {
  productOptionId: number;
  name: string;
  position: number;
  values: ProductOptionValue[];
}

export interface ProductVariant {
  id: number;
  title: string;
  productOptionValueIds: number[];
  attributeValues: ProductAttributeItem[];
  sku: string;
  price: number;
  quantity: number;
  mediaId?: string | null;
  mediaUrl?: string | null;
}

export interface ProductDetail {
  id: number;
  name: string;
  description: string;
  slug: string;
  metaTitle?: string | null;
  metaKeyword?: string | null;
  metaDescription?: string | null;
  brand: ProductBrand;
  category: ProductCategory;
  medias: ProductMedia[];
  attributes: ProductAttributeItem[];
  options: ProductOption[];
  variants: ProductVariant[];
  createdAt?: string;
  updatedAt?: string;
}
