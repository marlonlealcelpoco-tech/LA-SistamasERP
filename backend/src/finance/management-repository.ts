import type { Pool } from "pg";

export class FinancialManagementRepository {
  constructor(private readonly pool: Pool) {}

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
    const result = await this.pool.query(`
      SELECT movement_date::date AS date,
        COALESCE(SUM(CASE WHEN direction='IN' THEN amount ELSE 0 END),0) AS income,
        COALESCE(SUM(CASE WHEN direction='OUT' THEN amount ELSE 0 END),0) AS expense
      FROM financial_account_movements
      WHERE movement_date::date BETWEEN $1::date AND $2::date
      GROUP BY movement_date::date ORDER BY date`, [startDate, endDate]);
    let balance = 0;
    return result.rows.map((row) => {
      balance += Number(row.income) - Number(row.expense);
      return { date: row.date, income: Number(row.income), expense: Number(row.expense), balance: Number(balance.toFixed(2)) };
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
