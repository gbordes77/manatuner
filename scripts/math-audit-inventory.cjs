// Reproducible syntactic inventory. Presence here does not imply mathematical validation.
const fs=require('fs'),path=require('path'),ts=require('typescript');
function files(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(d=>d.isDirectory()?files(path.join(dir,d.name)):[path.join(dir,d.name)])}
const rows=[];
const outputDir=process.argv[2] || 'docs/math/audit-2026-09-05';
for(const file of files('src').filter(f=>/\.tsx?$/.test(f)&&!/__tests__|\.test\./.test(f))){
 const source=fs.readFileSync(file,'utf8'),tree=ts.createSourceFile(file,source,ts.ScriptTarget.Latest,true);
 function visit(node){
  const expression=node.getText(tree);
  const numeric=(ts.isBinaryExpression(node)&&[ts.SyntaxKind.PlusToken,ts.SyntaxKind.MinusToken,ts.SyntaxKind.AsteriskToken,ts.SyntaxKind.SlashToken,ts.SyntaxKind.PercentToken,ts.SyntaxKind.AsteriskAsteriskToken].includes(node.operatorToken.kind))||
    (ts.isCallExpression(node)&&/^(Math\.|hypergeom\.|hg\.|calculate|compute|scaleKarsten|cardsSeen|createSeededRng|mulliganStopping)/.test(node.expression.getText(tree)));
  if(numeric){
   let enclosing=node.parent,name='module';
   while(enclosing){if(ts.isFunctionDeclaration(enclosing)||ts.isMethodDeclaration(enclosing)){name=enclosing.name?.getText(tree)||'anonymous';break}if(ts.isVariableDeclaration(enclosing)){name=enclosing.name.getText(tree);break}enclosing=enclosing.parent}
   const line=tree.getLineAndCharacterOfPosition(node.getStart()).line+1;
   const code=expression.replace(/\s+/g,' ').slice(0,180);
   if(!rows.some(r=>r.file===file&&r.line===line&&r.function===name))rows.push({file,line,function:name,expression:code});
  }
  ts.forEachChild(node,visit);
 }
 visit(tree);
}
fs.mkdirSync(outputDir,{recursive:true});
fs.writeFileSync(path.join(outputDir,'arithmetic-inventory.json'),JSON.stringify(rows,null,2)+'\n');
const md=['# Inventaire arithmétique reproductible','',`${rows.length} sites détectés dans le code de production. Inclut aussi des calculs de présentation, de cache et de temporisation : ce relevé syntaxique est un filet de contrôle, pas une preuve de validité. La matrice sémantique est dans le rapport.`, '', '| Fichier:ligne | Fonction / variable | Expression |','|---|---|---|',...rows.map(r=>`| ${r.file}:${r.line} | ${r.function} | \`${r.expression.replace(/\|/g,'&#124;').replace(/`/g,"'")}\` |`)];
fs.writeFileSync(path.join(outputDir,'INVENTORY.md'),md.join('\n')+'\n');
console.log(JSON.stringify({sites:rows.length,files:new Set(rows.map(r=>r.file)).size}));
