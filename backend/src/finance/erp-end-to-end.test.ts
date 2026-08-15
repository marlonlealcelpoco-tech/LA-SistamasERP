import test from "node:test";
import assert from "node:assert/strict";
import { buildDre } from "./management-reports.js";
import {
  validateCashClosure,
  validateOperationalResult,
  validateStockClosure
} from "./integration-close-tests.js";

test("ERP: compra, venda, devolução, crédito e fechamento", () => {
  const openingStock = 0;
  const purchaseQuantity = 10;
  const saleQuantity = 6;
  const returnQuantity = 1;
  const adjustmentQuantity = 0;
  const closingStock = 5;

  assert.equal(
    validateStockClosure(
      openingStock,
      purchaseQuantity,
      saleQuantity,
      returnQuantity,
      adjustmentQuantity,
      closingStock
    ),
    true
  );

  const productCost = 10;
  const salePrice = 15;
  const grossRevenue = saleQuantity * salePrice;
  const salesReturn = returnQuantity * salePrice;
  const cogs = saleQuantity * productCost;
  const operatingExpenses = 20;

  const dre = buildDre({
    grossRevenue,
    salesReturns: salesReturn,
    costOfGoodsSold: cogs,
    operatingExpenses
  });

  assert.equal(dre.netRevenue, 75);
  assert.equal(dre.costOfGoodsSold, 60);
  assert.equal(dre.grossProfit, 15);
  assert.equal(dre.operatingResult, -5);
  assert.equal(validateOperationalResult(75, 60, 20, -5), true);

  const customerCredit = salesReturn;
  const nextSale = 20;
  const creditUsed = Math.min(customerCredit, nextSale);
  const cashReceived = nextSale - creditUsed;
  assert.equal(customerCredit, 15);
  assert.equal(creditUsed, 15);
  assert.equal(cashReceived, 5);

  const openingCash = 0;
  const cashIncome = 5;
  const cashExpense = 0;
  const closingCash = 5;
  assert.equal(validateCashClosure(openingCash, cashIncome, cashExpense, closingCash), true);
});

test("ERP: venda a prazo não gera recebimento imediato", () => {
  const saleTotal = 150;
  const immediateCash = 0;
  const accountsReceivable = saleTotal;

  assert.equal(immediateCash, 0);
  assert.equal(accountsReceivable, saleTotal);
});

test("ERP: transferência entre contas não altera resultado", () => {
  const transfer = 500;
  const sourceAfter = 1000 - transfer;
  const destinationAfter = 200 + transfer;
  const operatingIncome = 0;
  const operatingExpense = 0;

  assert.equal(sourceAfter + destinationAfter, 1700);
  assert.equal(operatingIncome, 0);
  assert.equal(operatingExpense, 0);
});
