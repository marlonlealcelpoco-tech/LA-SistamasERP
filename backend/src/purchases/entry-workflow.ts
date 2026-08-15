export type PurchaseEntryMode = "MANUAL" | "XML";

export type PurchaseEntryItemDraft = {
  productId: number | null;
  code: string;
  description: string;
  quantity: number;
  unitCost: number;
};

export type PurchaseEntryDraft = {
  mode: PurchaseEntryMode;
  supplierId: number;
  documentNumber?: string | null;
  series?: string | null;
  documentDate: string;
  entryDate: string;
  xmlAccessKey?: string | null;
  items: PurchaseEntryItemDraft[];
  total: number;
  installmentPlanConfirmed: boolean;
};

/**
 * A product is introduced into stock through a purchase entry/document.
 * Individual product maintenance remains available, but is not the primary
 * stock-entry workflow. The entry must be confirmed before stock/financial
 * effects are persisted.
 */
export function validatePurchaseEntryBeforeConfirmation(entry: PurchaseEntryDraft): void {
  if (!entry.supplierId) throw new Error("Fornecedor é obrigatório.");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(entry.documentDate)) throw new Error("Data da nota inválida.");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(entry.entryDate)) throw new Error("Data de entrada inválida.");
  if (!entry.items.length) throw new Error("A entrada precisa ter pelo menos um item.");
  if (!Number.isFinite(entry.total) || entry.total <= 0) throw new Error("Total da entrada inválido.");
  if (!entry.installmentPlanConfirmed) throw new Error("Confirme as condições e datas do financeiro antes de lançar a entrada.");

  for (const item of entry.items) {
    if (!Number.isFinite(item.quantity) || item.quantity <= 0) throw new Error(`Quantidade inválida para ${item.description}.`);
    if (!Number.isFinite(item.unitCost) || item.unitCost < 0) throw new Error(`Custo inválido para ${item.description}.`);
  }
}
