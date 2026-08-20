import { useEffect, useRef, useCallback } from 'react';

export interface SyncableData {
  categories: Category[];
  products: Product[];
  suppliers: Supplier[];
  quotations: Quotation[];
}

export type Category = { id: number; name: string };
export type Product = { id: number; name: string; categoryId: number | null; category: string | null; salePrice: string | number; unitsPerBox: number };
export type Supplier = { id: number; name: string; contact: string | null };
export type Quotation = { id: number; productId: number; supplierId: number; productName: string; supplierName: string; priceType: 'un' | 'cx'; value: string | number; unitsPerBox: number; costUnit: number; salePrice: string | number; profit: number; margin: number };

const SYNC_INTERVAL = 10000;
const SYNC_TIMEOUT = 5000;

export function useSyncData(
  onDataChange: (data: SyncableData) => void,
  enabled: boolean = true
) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastHashRef = useRef<string>('');

  const computeHash = useCallback((data: SyncableData): string => {
    return JSON.stringify({
      categories: data.categories.length,
      products: data.products.length,
      suppliers: data.suppliers.length,
      quotations: data.quotations.length,
      lastProduct: data.products[data.products.length - 1]?.id,
      lastQuotation: data.quotations[data.quotations.length - 1]?.id,
    });
  }, []);

  const fetchLatestData = useCallback(async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), SYNC_TIMEOUT);

      const response = await fetch('/quotations/bootstrap', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('la_cotacoes_token') || ''}`,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('la_cotacoes_token');
        }
        return;
      }

      const data: SyncableData = await response.json();
      const newHash = computeHash(data);

      if (newHash !== lastHashRef.current) {
        lastHashRef.current = newHash;
        onDataChange(data);
      }
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        console.warn('Erro ao sincronizar dados:', error);
      }
    }
  }, [onDataChange, computeHash]);

  useEffect(() => {
    if (!enabled) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    void fetchLatestData();

    intervalRef.current = setInterval(() => {
      void fetchLatestData();
    }, SYNC_INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [enabled, fetchLatestData]);
}
