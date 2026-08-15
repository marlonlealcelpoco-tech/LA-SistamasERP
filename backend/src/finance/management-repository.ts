import type { Pool } from "pg";
import { FinancialMovementRepository } from "./financial-movement-repository";

export class FinancialManagementRepository {
  private readonly movements: FinancialMovementRepository;

  constructor(private readonly pool: Pool) {
    this.movements = new FinancialMovementRepository(pool);
  }

  async summary(startDate: string, endDate: string) {
    const result = await this.pool.query(`
      SELECT
        COALESCE(SUM(CASE WHEN type='PAYABLE' AND status IN ('PENDING','PARTIAL') THEN amount-settled_amount ELSE 0 END),0) AS payable_open,
        COALESCE(SUM(CASE WHEN type='RECEIVABLE' AND status IN ('PENDING','PARTIAL') THEN amount-settled_amount ELSE 0 END),0) AS receivable_open,
        COALESCE(SUM(CASE WHEN type='PAYABLE' AND status IN ('PENDING','PARTIAL') AND due_date < CURRENT_DATE THEN amount-settled_amount ELSE 0 END),0) AS overdue_payable,
        COALESCE(SUM(CASE WHEN type='RECEIVABLE' AND status IN ('PENDING','PARTIAL') AND due_date < CURRENT_DATE THEN amount-settled_amount ELSE 0 END),0) AS overdue_receivable,
        COALESCE(SUM(CASE WHEN type='RECEIVABLE' AND paid_at::date BETWEEN $1::date AND $2::date THEN settled_amount ELSE 0 END),0) AS received_period,
        COALESCE(SUM(CASE WHEN type='PAYABLE' AND paid_at::date BETWEEN $1::date AND $2::date THEN settled_amount ELSE 0 END),0) AS paid_period
      FROM financial_entries`, [startDate, endDate]);
    return result.rows[0];
  }

  async cashFlow(startDate: string, endDate: string) {
    const movements = await this.movements.list(startDate, endDate);
    const byDate = new Map<string, { income: number; expense: number }>();

    for (const movement of movements) {
      const date = new Date(movement.date).toISOString().slice(0, 10);
      const current = byDate.get(date) ?? { income: 0, expense: 0 };
      if (movement.amount >= 0) current.income += movement.amount;
      else current.expense += Math.abs(movement.amount);
      byDate.set(date, current);
    }

    let balance = 0;
    return [...byDate.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([date, values]) => {
      balance += values.income - values.expense;
      return {
        date,
        income: Number(values.income.toFixed(2)),
        expense: Number(values.expense.toFixed(2)),
        balance: Number(balance.toFixed(2))
      };
    });
  }

  async totalsByCategory(startDate: string, endDate: string, kind: "INCOME" | "EXPENSE") {
    const result = await this.pool.query(`
      SELECT COALESCE(c.name, 'Sem categoria') AS category,
        COALESCE(SUM(e.settled_amount),0) AS amount
      FROM financial_entries e
      LEFT JOIN financial_categories c ON c.id = e.category_id
      WHERE e.paid_at::date BETWEEN $1::date AND $2::date
        AND (($3='INCOME' AND e.type='RECEIVABLE') OR ($3='EXPENSE' AND e.type='PAYABLE'))
      GROUP BY c.name ORDER BY amount DESC`, [startDate, endDate, kind]);
    return result.rows;
  }
}
