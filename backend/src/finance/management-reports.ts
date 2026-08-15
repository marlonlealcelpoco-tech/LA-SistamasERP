export type CashFlowRow = {
  date: string;
  income: number;
  expense: number;
  net: number;
  balance: number;
};

export type DreReport = {
  grossRevenue: number;
  salesReturns: number;
  netRevenue: number;
  costOfGoodsSold: number;
  grossProfit: number;
  operatingExpenses: number;
  operatingResult: number;
};

export function buildCashFlow(rows: Array<{ date: string; income: number; expense: number }>, openingBalance = 0): CashFlowRow[] {
  let balance = openingBalance;
  return rows.map((row) => {
    const income = Number(row.income || 0);
    const expense = Number(row.expense || 0);
    const net = income - expense;
    balance += net;
    return { date: row.date, income, expense, net, balance };
  });
}

export function buildDre(input: {
  grossRevenue: number;
  salesReturns?: number;
  costOfGoodsSold?: number;
  operatingExpenses?: number;
}): DreReport {
  const grossRevenue = Number(input.grossRevenue || 0);
  const salesReturns = Number(input.salesReturns || 0);
  const costOfGoodsSold = Number(input.costOfGoodsSold || 0);
  const operatingExpenses = Number(input.operatingExpenses || 0);
  const netRevenue = grossRevenue - salesReturns;
  const grossProfit = netRevenue - costOfGoodsSold;
  return {
    grossRevenue,
    salesReturns,
    netRevenue,
    costOfGoodsSold,
    grossProfit,
    operatingExpenses,
    operatingResult: grossProfit - operatingExpenses
  };
}
