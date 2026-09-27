export interface CategoryItem {
  id: number;
  name: string;
  slug?: string;
  children?: CategoryItem[];
  createdAt?: string;
  updatedAt?: string;
}
