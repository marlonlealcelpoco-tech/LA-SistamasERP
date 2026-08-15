import type { Pool, PoolClient } from "pg";

export const PAYMENT_METHODS = ["CASH", "PIX", "DEBIT_CARD", "CREDIT_CARD", "TRANSFER", "CREDIT"] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export type SaleInput = {
  cashSessionId: number;
  sellerId: number;
  customerId?: number | null;
  items: Array<{ productId: number; quantity: number; unitPrice: number }>;
  payments: Array<{ paymentMethod: PaymentMethod; amount: number; dueDate?: string | null }>;
};

export type SaleRecord = {
  id: number;
  customer_id: number | null;
  seller_id: number | null;
  cash_session_id: number | null;
  status: string;
  total: string;
  created_at: Date;
};

export class SalesRepository {
  constructor(private readonly pool: Pool) {}

  async create(input: SaleInput): Promise<SaleRecord> {
    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");
      const session = await client.query<{ seller_id: number }>(
        "SELECT seller_id FROM cash_sessions WHERE id = $1 AND status = 'OPEN' FOR UPDATE",
        [input.cashSessionId]
      );
      if (!session.rows[0]) throw new Error("Caixa não está aberto.");
      if (session.rows[0].seller_id !== input.sellerId) {
        throw new Error("A venda deve ser registrada no caixa do vendedor.");
      }

      const total = input.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
      const sale = await client.query<SaleRecord>(
        `INSERT INTO sales (customer_id, seller_id, cash_session_id, status, total)
         VALUES ($1, $2, $3, 'CONFIRMED', $4)
         RETURNING id, customer_id, seller_id, cash_session_id, status, total, created_at`,
        [input.customerId ?? null, input.sellerId, input.cashSessionId, total]
      );

      for (const item of input.items) {
        await this.decreaseStock(client, item.productId, item.quantity);
        await client.query(
          `INSERT INTO sale_items (sale_id, product_id, quantity, unit_price, total)
           VALUES ($1, $2, $3, $4, $5)`,
          [sale.rows[0].id, item.productId, item.quantity, item.unitPrice, item.quantity * item.unitPrice]
        );
        await client.query(
          `INSERT INTO stock_movements (product_id, type, quantity, reference, notes)
           VALUES ($1, 'EXIT', $2, $3, 'Saída por venda')`,
          [item.productId, item.quantity, `VENDA-${sale.rows[0].id}`]
        );
      }

      for (const payment of input.payments) {
        await client.query(
          `INSERT INTO sale_payments (sale_id, payment_method, amount, due_date)
           VALUES ($1, $2, $3, $4)`,
          [sale.rows[0].id, payment.paymentMethod, payment.amount, payment.dueDate ?? null]
        );
        const eventType = payment.paymentMethod === "CREDIT" ? "CREDIT_SALE" : "SALE_PAYMENT";
        await client.query(
          `INSERT INTO cash_events (cash_session_id, sale_id, type, payment_method, amount, description)
           VALUES ($1, $2, $3, $4, $5, 'Recebimento de venda')`,
          [input.cashSessionId, sale.rows[0].id, eventType, payment.paymentMethod, payment.amount]
        );
      }

      await client.query("COMMIT");
      return sale.rows[0];
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  async cancel(saleId: number, sellerId: number): Promise<"not_found" | "not_allowed" | "already_cancelled" | SaleRecord> {
    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");
      const sale = await client.query<SaleRecord>(
        `SELECT id, customer_id, seller_id, cash_session_id, status, total, created_at
         FROM sales WHERE id = $1 FOR UPDATE`,
        [saleId]
      );
      const record = sale.rows[0];
      if (!record) {
        await client.query("ROLLBACK");
        return "not_found";
      }
      if (record.seller_id !== sellerId) {
        await client.query("ROLLBACK");
        return "not_allowed";
      }
      if (record.status === "CANCELLED") {
        await client.query("ROLLBACK");
        return "already_cancelled";
      }

      const items = await client.query<{ product_id: number; quantity: string }>(
        "SELECT product_id, quantity FROM sale_items WHERE sale_id = $1",
        [saleId]
      );
      for (const item of items.rows) {
        await client.query("UPDATE stock SET quantity = quantity + $2 WHERE product_id = $1", [item.product_id, item.quantity]);
        await client.query(
          `INSERT INTO stock_movements (product_id, type, quantity, reference, notes)
           VALUES ($1, 'ENTRY', $2, $3, 'Estorno por cancelamento de venda')`,
          [item.product_id, item.quantity, `CANCELAMENTO-${saleId}`]
        );
      }

      const payments = await client.query<{ payment_method: string; amount: string }>(
        "SELECT payment_method, amount FROM sale_payments WHERE sale_id = $1",
        [saleId]
      );
      for (const payment of payments.rows) {
        await client.query(
          `INSERT INTO cash_events (cash_session_id, sale_id, type, payment_method, amount, description)
           VALUES ($1, $2, 'CANCELLATION', $3, $4, 'Cancelamento de venda')`,
          [record.cash_session_id, saleId, payment.payment_method, -Number(payment.amount)]
        );
      }

      const cancelled = await client.query<SaleRecord>(
        `UPDATE sales SET status = 'CANCELLED', cancelled_at = CURRENT_TIMESTAMP
         WHERE id = $1
         RETURNING id, customer_id, seller_id, cash_session_id, status, total, created_at`,
        [saleId]
      );
      await client.query("COMMIT");
      return cancelled.rows[0];
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  private async decreaseStock(client: PoolClient, productId: number, quantity: number): Promise<void> {
    const product = await client.query<{ id: number }>(
      "SELECT id FROM products WHERE id = $1 AND active = TRUE FOR UPDATE",
      [productId]
    );
    if (!product.rows[0]) throw new Error("Produto inexistente ou inativo.");

    const stock = await client.query<{ quantity: string }>(
      `UPDATE stock SET quantity = quantity - $2
       WHERE product_id = $1 AND quantity >= $2
       RETURNING quantity`,
      [productId, quantity]
    );
    if (!stock.rows[0]) throw new Error("Estoque insuficiente para concluir a venda.");
  }
}
