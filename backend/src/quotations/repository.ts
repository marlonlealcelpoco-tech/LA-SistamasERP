import type { Pool } from "pg";

export type Category = { id: number; name: string };
export type Product = { id: number; name: string; categoryId: number | null; category: string | null; salePrice: string; unitsPerBox: number };
export type Supplier = { id: number; name: string; contact: string | null };
export type Quotation = { id: number; productId: number; supplierId: number; productName: string; supplierName: string; priceType: "un" | "cx"; value: string; unitsPerBox: number; costUnit: number; salePrice: string; profit: number; margin: number };

export class QuotationRepository {
  constructor(private readonly pool: Pool) {}
  async listCategories() { return (await this.pool.query<Category>(`SELECT id, name FROM quotation_categories ORDER BY name`)).rows; }
  async createCategory(name: string) { return (await this.pool.query<Category>(`INSERT INTO quotation_categories (name) VALUES ($1) RETURNING id, name`, [name.trim()])).rows[0]; }
  async listProducts() { return (await this.pool.query<Product>(`SELECT p.id, p.name, p.category_id AS "categoryId", c.name AS category, p.sale_price AS "salePrice", p.units_per_box AS "unitsPerBox" FROM quotation_products p LEFT JOIN quotation_categories c ON c.id=p.category_id WHERE p.active=TRUE ORDER BY p.name`)).rows; }
  async createProduct(input: { name: string; categoryId: number | null; salePrice: number; unitsPerBox: number }) { return (await this.pool.query<Product>(`INSERT INTO quotation_products (name, category_id, sale_price, units_per_box) VALUES ($1,$2,$3,$4) RETURNING id, name, category_id AS "categoryId", sale_price AS "salePrice", units_per_box AS "unitsPerBox"`, [input.name.trim(), input.categoryId, input.salePrice, input.unitsPerBox])).rows[0]; }
  async updateProduct(id: number, input: { name: string; categoryId: number | null; salePrice: number; unitsPerBox: number }) { return (await this.pool.query<Product>(`UPDATE quotation_products SET name=$2, category_id=$3, sale_price=$4, units_per_box=$5, updated_at=CURRENT_TIMESTAMP WHERE id=$1 AND active=TRUE RETURNING id, name, category_id AS "categoryId", sale_price AS "salePrice", units_per_box AS "unitsPerBox"`, [id, input.name.trim(), input.categoryId, input.salePrice, input.unitsPerBox])).rows[0]; }
  async deleteProduct(id: number) { await this.pool.query(`UPDATE quotation_products SET active=FALSE, updated_at=CURRENT_TIMESTAMP WHERE id=$1`, [id]); }
  async listSuppliers() { return (await this.pool.query<Supplier>(`SELECT id, name, contact FROM quotation_suppliers WHERE active=TRUE ORDER BY name`)).rows; }
  async createSupplier(input: { name: string; contact?: string | null }) { return (await this.pool.query<Supplier>(`INSERT INTO quotation_suppliers (name, contact) VALUES ($1,$2) RETURNING id, name, contact`, [input.name.trim(), input.contact?.trim() || null])).rows[0]; }
  async updateSupplier(id: number, input: { name: string; contact?: string | null }) { return (await this.pool.query<Supplier>(`UPDATE quotation_suppliers SET name=$2, contact=$3, updated_at=CURRENT_TIMESTAMP WHERE id=$1 AND active=TRUE RETURNING id, name, contact`, [id, input.name.trim(), input.contact?.trim() || null])).rows[0]; }
  async deleteSupplier(id: number) { await this.pool.query(`UPDATE quotation_suppliers SET active=FALSE, updated_at=CURRENT_TIMESTAMP WHERE id=$1`, [id]); }
  async listQuotations() {
    const result = await this.pool.query<any>(`SELECT q.id, q.product_id AS "productId", q.supplier_id AS "supplierId", p.name AS "productName", s.name AS "supplierName", q.price_type AS "priceType", q.value, p.units_per_box AS "unitsPerBox", p.sale_price AS "salePrice" FROM quotations q JOIN quotation_products p ON p.id=q.product_id JOIN quotation_suppliers s ON s.id=q.supplier_id WHERE p.active=TRUE AND s.active=TRUE ORDER BY p.name, q.value`);
    return result.rows.map((q) => { const costUnit = q.priceType === "cx" ? Number(q.value)/Number(q.unitsPerBox || 1) : Number(q.value); const salePrice=Number(q.salePrice); const profit=salePrice-costUnit; return { ...q, costUnit, profit, margin: salePrice>0 ? (profit/salePrice)*100 : 0 }; }) as Quotation[];
  }
  async createQuotation(input: { productId: number; supplierId: number; priceType: "un" | "cx"; value: number }) { return (await this.pool.query(`INSERT INTO quotations (product_id, supplier_id, price_type, value) VALUES ($1,$2,$3,$4) RETURNING id`, [input.productId, input.supplierId, input.priceType, input.value])).rows[0]; }
  async deleteQuotation(id: number) { await this.pool.query(`DELETE FROM quotations WHERE id=$1`, [id]); }
}
