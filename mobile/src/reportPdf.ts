import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
export type ReportRow={productName:string;supplierName:string;category?:string;quoted:number;priceType:'un'|'cx';quantity:number;costUnit:number;totalCost:number;salePrice:number;profit:number;markup:number;saleUnit:string};
const money=(value:number)=>value.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
export async function generateAndShareReport(rows:ReportRow[],title='Relatório de melhores preços'){
 if(!rows.length)throw new Error('Selecione pelo menos uma linha do relatório.');
 const doc=new jsPDF({orientation:'portrait',unit:'mm',format:'a4'});const generatedAt=new Date().toLocaleString('pt-BR');
 doc.setFontSize(16);doc.setFont('helvetica','bold');doc.text(title,14,14);doc.setFontSize(9);doc.setFont('helvetica','normal');doc.text(`Gerado em ${generatedAt} · ${rows.length} produtos vencedores`,14,20);
 let y=27;
 const suppliers=[...new Set(rows.map(r=>r.supplierName))];
 for(const supplier of suppliers){
  const items=rows.filter(r=>r.supplierName===supplier);
  if(y>250){doc.addPage();y=18}
  doc.setFontSize(13);doc.setFont('helvetica','bold');doc.text(`FORNECEDOR: ${supplier.toUpperCase()}`,14,y);y+=6;
  autoTable(doc,{startY:y,head:[['Produto','Categoria','Qtd.','Custo unit.','Subtotal','Venda','Margem']],body:items.map(r=>[r.productName,r.category||'Sem categoria',`${r.quantity} ${r.saleUnit}`,money(r.costUnit),money(r.totalCost),money(r.salePrice),`${r.markup.toFixed(2)}%`]),styles:{fontSize:7,cellPadding:2},headStyles:{fontStyle:'bold'},margin:{left:14,right:14},didDrawPage:()=>{doc.setFontSize(8);doc.setFont('helvetica','normal')}});
  y=(doc as any).lastAutoTable.finalY+5;
  const subtotal=items.reduce((sum,r)=>sum+r.totalCost,0);
  if(y>270){doc.addPage();y=18}
  doc.setFontSize(10);doc.setFont('helvetica','bold');doc.text(`Subtotal ${supplier}: ${money(subtotal)}`,14,y);y+=10;
 }
 const total=rows.reduce((sum,r)=>sum+r.totalCost,0);if(y>270){doc.addPage();y=18}doc.setFontSize(12);doc.setFont('helvetica','bold');doc.text(`TOTAL GERAL DA COTAÇÃO: ${money(total)}`,14,y);
 const base64=doc.output('datauristring').split(',')[1];const filename=`LA-Cotacoes-${Date.now()}.pdf`;const result=await Filesystem.writeFile({path:filename,data:base64,directory:Directory.Cache});await Share.share({title,text:`${title} · ${rows.length} produtos`,url:result.uri,dialogTitle:'Imprimir ou compartilhar relatório'});return result.uri;
}
