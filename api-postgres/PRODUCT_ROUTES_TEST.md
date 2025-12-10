# Product Routes - cURL Test Commands

Base URL: `http://localhost:3001`

## 1. Get All Products (with pagination & sorting)

```bash
# Get all products (default)
curl -X GET "http://localhost:3001/products"

# Get products with pagination
curl -X GET "http://localhost:3001/products?page=1&limit=10"

# Get products with sorting
curl -X GET "http://localhost:3001/products?sortBy=title&order=asc"

# Get products with pagination and sorting
curl -X GET "http://localhost:3001/products?page=1&limit=20&sortBy=created_at&order=desc"

# Search products
curl -X GET "http://localhost:3001/products?q=shirt"
```

## 2. Get Product by ID

```bash
# Replace 123 with actual product ID
curl -X GET "http://localhost:3001/products/123"
```

## 3. Get Product by Handle (slug)

```bash
# Replace 'product-handle' with actual product handle
curl -X GET "http://localhost:3001/products/handle/product-handle"
```

## 4. Get Products by Vendor

```bash
# Get products by vendor (default pagination)
curl -X GET "http://localhost:3001/products/vendor/tentree"

# With pagination
curl -X GET "http://localhost:3001/products/vendor/tentree?page=1&limit=10"

# With sorting
curl -X GET "http://localhost:3001/products/vendor/tentree?sortBy=title&order=asc"

# With pagination and sorting
curl -X GET "http://localhost:3001/products/vendor/tentree?page=1&limit=20&sortBy=created_at&order=desc"
```

## 5. Get Products by Type

```bash
# Get products by type (default pagination)
curl -X GET "http://localhost:3001/products/type/Apparel"

# With pagination
curl -X GET "http://localhost:3001/products/type/Apparel?page=1&limit=10"

# With sorting
curl -X GET "http://localhost:3001/products/type/Apparel?sortBy=title&order=asc"

# With pagination and sorting
curl -X GET "http://localhost:3001/products/type/Apparel?page=1&limit=20&sortBy=created_at&order=desc"
```

## 6. Get Products by Tag

```bash
# Get products by tag (default pagination)
curl -X GET "http://localhost:3001/products/tag/sustainable"

# With pagination
curl -X GET "http://localhost:3001/products/tag/sustainable?page=1&limit=10"

# With sorting
curl -X GET "http://localhost:3001/products/tag/sustainable?sortBy=title&order=asc"

# With pagination and sorting
curl -X GET "http://localhost:3001/products/tag/sustainable?page=1&limit=20&sortBy=created_at&order=desc"
```

## 7. Get All Vendors

```bash
curl -X GET "http://localhost:3001/products/vendors"
```

## 8. Get All Product Types

```bash
curl -X GET "http://localhost:3001/products/types"
```

## 9. Get All Tags

```bash
curl -X GET "http://localhost:3001/products/tags"
```

## 10. Get All Variants for a Product

```bash
# Replace 123 with actual product ID
curl -X GET "http://localhost:3001/products/123/variants"
```

## 11. Get Specific Variant by ID

```bash
# Replace 123 with product ID and 456 with variant ID
curl -X GET "http://localhost:3001/products/123/variants/456"
```

---

## Windows Git Bash Format (if needed)

```bash
# Get all products
curl -X GET "http://localhost:3001/products"

# Get products with pagination
curl -X GET "http://localhost:3001/products?page=1&limit=10"

# Get products by vendor
curl -X GET "http://localhost:3001/products/vendor/tentree"

# Get all vendors
curl -X GET "http://localhost:3001/products/vendors"
```

---

## Example Response Formats

### Paginated Response:

```json
{
  "success": true,
  "message": "Products retrieved successfully",
  "data": {
    "data": [...products...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5
    }
  }
}
```

### Single Product Response:

```json
{
  "success": true,
  "message": "Product retrieved successfully",
  "data": {
    "id": 123,
    "title": "Product Name",
    "handle": "product-handle",
    ...
  }
}
```

### Metadata Response (vendors/types/tags):

```json
{
  "success": true,
  "message": "Vendors retrieved successfully",
  "data": ["vendor1", "vendor2", "vendor3"]
}
```
