const fs=require(String.fromCharCode(102,115));
const lv=String.fromCharCode(36)+String.fromCharCode(123,108,97,98,101,108,125);
const u=(...a)=>String.fromCharCode(...a);
let lines=fs.readFileSync(String.fromCharCode(115,114,99,47,114,101,112,108,105,99,97,47,83,101,108,102,83,101,114,118,105,99,101,81,117,101,114,121,66,111,97,114,100,67,97,114,100,46,116,115,120),String.fromCharCode(117,116,102,56)).split(String.fromCharCode(10));
for(let i=0;i<lines.length;i++){const x=lines[i];
if(x.indexOf(String.fromCharCode(80,69,78,68,73,78,71,95,70,73,69,76,68,83))>0&&x.indexOf(String.fromCharCode(84,105,110,121,66,117,116,116,111,110))>0&&x.indexOf(String.fromCharCode(62,60))>0){lines[i]=String.fromCharCode(32,32,32,32,32,32,32,32,32,32,32,32,60)+String.fromCharCode(84,105,110,121,66,117,116,116,111,110)+String.fromCharCode(32,111,110,67,108,105,99,107,61,123,40,41,32,61,62,32,111,110,67,104,97,110,103,101,40,110,101,119,32,83,101,116,40,80,69,78,68,73,78,71,95,70,73,69,76,68,83,41,41,125,62)+u(20840,36873)+String.fromCharCode(60,47,84,105,110,121,66,117,116,116,111,110,62);}
}
fs.writeFileSync(String.fromCharCode(115,114,99,47,114,101,112,108,105,99,97,47,83,101,108,102,83,101,114,118,105,99,101,81,117,101,114,121,66,111,97,114,100,67,97,114,100,46,116,115,120),lines.join(String.fromCharCode(10)));