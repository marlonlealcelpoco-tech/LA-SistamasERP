import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';

export type ReportRow = {
  productName: string;
  supplierName: string;
  quoted: number;
  priceType: 'un' | 'cx';
  costUnit: number;
  profit: number;
  margin: number;
};

const esc = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const money = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export async function generateAndShareReport(rows: ReportRow[], title = 'Relatório comparativo de cotações') {
  const generatedAt = new Date().toLocaleString('pt-BR');
  const body = rows.map(r => `<tr><td>${esc(r.productName)}</td><td>${esc(r.supplierName)}</td><td>${money(r.quoted)}/${r.priceType}</td><td>${money(r.costUnit)}</td><td>${money(r.profit)}</td><td>${r.margin.toFixed(1)}%</td></tr>`).join('');
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>${esc(title)}</title><style>@page{size:A4 landscape;margin:12mm}body{font-family:Arial,sans-serif;color:#18202a}h1{font-size:22px;margin:0 0 4px}p{font-size:11px;color:#667085}table{width:100%;border-collapse:collapse;margin-top:18px;font-size:11px}th,td{border:1px solid #d0d5dd;padding:7px;text-align:left}th{background:#f2f4f7}tfoot{font-weight:bold}</style></head><body><h1>${esc(title)}</h1><p>Gerado em ${generatedAt} · ${rows.length} registros selecionados</p><table><thead><tr><th>Produto</th><th>Fornecedor</th><th>Cotado</th><th>Custo/un</th><th>Lucro</th><th>Margem</th></tr></thead><tbody>${body}</tbody></table></body></html>`;

  // O Android usa o HTML como fonte para impressão/PDF pelo fluxo nativo de compartilhamento.
  // Também salvamos uma cópia para o usuário abrir em outro aplicativo de impressão/PDF.
  const filename = `LA-Cotacoes-${Date.now()}.html`;
  const result = await Filesystem.writeFile({ path: filename, data: html, directory: Directory.Cache, encoding: Encoding.UTF8 });
  await Share.share({ title, text: `Relatório de cotações gerado em ${generatedAt}`, url: result.uri, dialogTitle: 'Exportar relatório' });
  return result.uri;
}
