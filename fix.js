const fs=require('fs'); 
const data=JSON.parse(fs.readFileSync('strings.json','utf8')); 
let s=fs.readFileSync('src/replica/SelfServiceQueryBoardCard.tsx','utf8').replace(/\uFEFF/,''); 
const chip=s.lastIndexOf('\nfunction FieldChip('); 
if(chip>0)s=s.slice(0,chip)+'\n';
const block=['const COMMON_TABS = [',...data.COMMON.map(x=  '+JSON.stringify(x)+','),'] as const;','','const LEVEL1_TABS = COMMON_TABS;','const LEVEL2_TABS = [\" "\u540c\u73af\u6bd4\, ...COMMON_TABS] as const;','','const PENDING_FIELDS = [',...data.PENDING.map(x=  '+JSON.stringify(x)+','),'];',''].join('\n'); 
s=s.replace(/const COMMON_TABS[\s\S]*?type MetricKind/,block+'type MetricKind'); 
const block=['const COMMON_TABS = [',...data.COMMON.map(x=  '+JSON.stringify(x)+','),'] as const;','','const LEVEL1_TABS = COMMON_TABS;','const LEVEL2_TABS = [\" "\u540c\u73af\u6bd4\, ...COMMON_TABS] as const;','','const PENDING_FIELDS = [',...data.PENDING.map(x=  '+JSON.stringify(x)+','),'];',''].join('\n'); 
s=s.replace(/const COMMON_TABS[\s\S]*?type MetricKind/,block+'type MetricKind'); 
