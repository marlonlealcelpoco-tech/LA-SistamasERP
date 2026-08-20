import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export type ReportRow={productName:string;supplierName:string;category?:string;quoted:number;priceType:'un'|'cx';costUnit:number;salePrice:number;profit:number;markup:number;saleUnit:string};
const money=(value:number)=>value.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
export async function generateAndShareReport(rows:ReportRow[],title='Relatório de melhores preços'){
 if(!rows.length)throw new Error('Selecione pelo menos uma linha do relatório.');
 const doc=new jsPDF({orientation:'landscape',unit:'mm',format:'a4'});const generatedAt=new Date().toLocaleString('pt-BR');
 doc.setFontSize(16);doc.text(title,14,14);doc.setFontSize(9);doc.text(`Gerado em ${generatedAt} · ${rows.length} produtos vencedores`,14,20);
 let y=25;
 const bySupplier=new Map<string,ReportRow[]>();
 for(const r of rows){if(!bySupplier.has(r.supplierName))bySupplier.set(r.supplierName,[]);bySupplier.get(r.supplierName)!.push(r)}
 for(const [supplier,items] of bySupplier){
   if(y>180){doc.addPage();y=18}
   doc.setFontSize(12);doc.text(`Fornecedor: ${supplier}`,14,y);y+=6;
   const byCategory=new Map<string,ReportRow[]>();
   for(const r of items){const c=r.category||'Sem categoria';if(!byCategory.has(c))byCategory.set(c,[]);byCategory.get(c)!.push(r)}
   for(const [category,catItems] of byCategory){
     if(y>180){doc.addPage();y=18}
     doc.setFontSize(9);doc.text(category.toUpperCase(),14,y);y+=3;
     autoTable(doc,{startY:y,head:[['Produto','Custo','Unidade','Venda','Lucro','Lucro sobre custo']],body:catItems.map(r=>[r.productName,money(r.costUnit),r.saleUnit,money(r.salePrice),money(r.profit),`${r.markup.toFixed(2)}%`]),styles:{fontSize:8,cellPadding:3},headStyles:{fontStyle:'bold'},alternateRowStyles:{fillColor:[245,247,250]},margin:{left:14,right:14}});
     y=(doc as any).lastAutoTable.finalY+8;
   }
 }
 const base64=doc.output('datauristring').split(',')[1];const filename=`LA-Cotacoes-${Date.now()}.pdf`;const result=await Filesystem.writeFile({path:filename,data:base64,directory:Directory.Cache});await Share.share({title,text:`Relatório de melhores preços · ${rows.length} produtos`,url:result.uri,dialogTitle:'Imprimir ou compartilhar relatório'});return result.uri;
}
