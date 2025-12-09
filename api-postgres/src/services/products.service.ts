import pool from "../config/database";

export interface Product {
  id: number;
  title: string;
  handle: string;
  body_html: string | null;
  vendor: string | null;
  product_type: string | null;
  created_at: Date | null;
  updated_at: Date | null;
  published_at: Date | null;
  tags: string[] | null;
  raw_json: any;
}

export interface ProductWithDetails extends Product {
  images?: Array<{
    id: number;
    src: string;
    alt: string | null;
    position: number | null;
  }>;
  variants?: Array<{
    id: number;
    title: string | null;
    price: string | null;
    compare_at_price: string | null;
    sku: string | null;
    available: boolean | null;
  }>;
  options?: Array<{
    name: string;
    values: string[];
  }>;
}

export async function getAllProducts(): Promise<Product[]> {
  const result = await pool.query(
    "SELECT * FROM products ORDER BY created_at DESC"
  );
  return result.rows;
}

export async function getProductById(id: number): Promise<Product | null> {
  const result = await pool.query("SELECT * FROM products WHERE id = $1", [id]);
  return result.rows[0] || null;
}

export async function getProductByHandle(
  handle: string
): Promise<Product | null> {
  const result = await pool.query("SELECT * FROM products WHERE handle = $1", [
    handle,
  ]);
  return result.rows[0] || null;
}

export async function getProductWithDetails(
  id: number
): Promise<ProductWithDetails | null> {
  const productResult = await pool.query(
    "SELECT * FROM products WHERE id = $1",
    [id]
  );

  if (productResult.rows.length === 0) {
    return null;
  }

  const product = productResult.rows[0] as Product;

  // Get images
  const imagesResult = await pool.query(
    "SELECT id, src, alt, position FROM product_images WHERE product_id = $1 ORDER BY position ASC",
    [id]
  );

  // Get variants
  const variantsResult = await pool.query(
    "SELECT id, title, price, compare_at_price, sku, available FROM variants WHERE product_id = $1 ORDER BY position ASC",
    [id]
  );

  // Get options
  const optionsResult = await pool.query(
    "SELECT name, values FROM product_options WHERE product_id = $1 ORDER BY position ASC",
    [id]
  );

  return {
    ...product,
    images: imagesResult.rows,
    variants: variantsResult.rows,
    options: optionsResult.rows,
  };
}

export async function searchProducts(query: string): Promise<Product[]> {
  const searchTerm = `%${query.toLowerCase()}%`;
  const result = await pool.query(
    `SELECT * FROM products 
     WHERE LOWER(title) LIKE $1 
        OR LOWER(vendor) LIKE $1 
        OR LOWER(product_type) LIKE $1
     ORDER BY created_at DESC`,
    [searchTerm]
  );
  return result.rows;
}
