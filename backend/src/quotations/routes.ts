import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { QuotationRepository } from "./repository.js";

const id = z.coerce.number().int().positive();
const product = z.object({ name:z.string().trim().min(2).max(180), categoryId:id.nullable().optional(), salePrice:z.coerce.number().nonnegative(), unitsPerBox:z.coerce.number().int().positive() });
const supplier = z.object({ name:z.string().trim().min(2).max(180), contact:z.string().trim().max(180).optional().nullable() });
const quotation = z.object({ productId:id, supplierId:id, priceType:z.enum(["un","cx"]), value:z.coerce.number().nonnegative() });

// As cotações são usadas pelos administradores do APK. Este módulo não exige login.
export function registerQuotationRoutes(app: FastifyInstance, repo: QuotationRepository) {
  app.get("/quotations/bootstrap", async () => ({ categories:await repo.listCategories(), products:await repo.listProducts(), suppliers:await repo.listSuppliers(), quotations:await repo.listQuotations() }));
  app.post("/quotations/categories", async (request, reply) => reply.code(201).send({ category:await repo.createCategory(z.object({name:z.string().trim().min(2).max(120)}).parse(request.body).name) }));
  app.post("/quotations/products", async (request, reply) => reply.code(201).send({ product:await repo.createProduct(product.parse(request.body)) }));
  app.put("/quotations/products/:id", async (request, reply) => { const item=await repo.updateProduct(id.parse((request.params as any).id), product.parse(request.body)); if(!item)return reply.code(404).send({message:"Produto não encontrado."}); return {product:item}; });
  app.delete("/quotations/products/:id", async (request, reply) => { await repo.deleteProduct(id.parse((request.params as any).id)); return {ok:true}; });
  app.post("/quotations/suppliers", async (request, reply) => reply.code(201).send({ supplier:await repo.createSupplier(supplier.parse(request.body)) }));
  app.put("/quotations/suppliers/:id", async (request, reply) => { const item=await repo.updateSupplier(id.parse((request.params as any).id), supplier.parse(request.body)); if(!item)return reply.code(404).send({message:"Fornecedor não encontrado."}); return {supplier:item}; });
  app.delete("/quotations/suppliers/:id", async (request, reply) => { await repo.deleteSupplier(id.parse((request.params as any).id)); return {ok:true}; });
  app.post("/quotations", async (request, reply) => reply.code(201).send({quotation:await repo.createQuotation(quotation.parse(request.body))}));
  app.delete("/quotations/:id", async (request, reply) => { await repo.deleteQuotation(id.parse((request.params as any).id)); return {ok:true}; });
  app.get("/quotations", async () => ({ quotations:await repo.listQuotations() }));
}
