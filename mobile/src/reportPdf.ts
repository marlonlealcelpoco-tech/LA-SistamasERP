import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export type ReportRow = {
  productName: string;
  supplierName: string;
  quoted: number;
  priceType: 'un' | 'cx';
  costUnit: number;
  profit: number;
  margin: number;
};

const money = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export async function generateAndShareReport(rows: ReportRow[], title = 'Relatório comparativo de cotações') {
  if (!rows.length) throw new Error('Selecione pelo menos uma linha do relatório.');

  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const generatedAt = new Date().toLocaleString('pt-BR');
  doc.setFontSize(16);
  doc.text(title, 14, 14);
  doc.setFontSize(9);
  doc.text(`Gerado em ${generatedAt} · ${rows.length} registros selecionados`, 14, 20);

  autoTable(doc, {
    startY: 25,
    head: [['Produto', 'Fornecedor', 'Cotado', 'Custo/un', 'Lucro', 'Margem']],
    body: rows.map(r => [r.productName, r.supplierName, `${money(r.quoted)}/${r.priceType}`, money(r.costUnit), money(r.profit), `${r.margin.toFixed(1)}%`]),
    styles: { fontSize: 8, cellPadding: 3 },
    headStyles: { fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [245, 247, 250] },
    margin: { left: 14, right: 14 }
  });

  const base64 = doc.output('datauristring').split(',')[1];
  const filename = `LA-Cotacoes-${Date.now()}.pdf`;
  const result = await Filesystem.writeFile({ path: filename, data: base64, directory: Directory.Cache });
  await Share.share({ title, text: `Relatório de cotações · ${rows.length} registros`, url: result.uri, dialogTitle: 'Imprimir ou compartilhar relatório' });
  return result.uri;
}
