import json,pathlib,re
p=pathlib.Path(chr(90)+chr(58)+chr(47)+chr(115)+chr(114)+chr(99)+chr(47)+chr(114)+chr(101)+chr(112)+chr(108)+chr(105)+chr(99)+chr(97)+chr(47)+chr(83)+chr(101)+chr(108)+chr(102)+chr(83)+chr(101)+chr(114)+chr(118)+chr(105)+chr(99)+chr(101)+chr(81)+chr(117)+chr(101)+chr(114)+chr(121)+chr(66)+chr(111)+chr(97)+chr(114)+chr(100)+chr(67)+chr(97)+chr(114)+chr(100)+chr(46)+chr(116)+chr(115)+chr(120))
data=json.loads(pathlib.Path(chr(90)+chr(58)+chr(47)+chr(115)+chr(116)+chr(114)+chr(105)+chr(110)+chr(103)+chr(115)+chr(46)+chr(106)+chr(115)+chr(111)+chr(110)).read_text(encoding=chr(117)+chr(116)+chr(102)+chr(45)+chr(56)))
s=p.read_text(encoding=chr(117)+chr(116)+chr(102)+chr(45)+chr(56)+chr(45)+chr(115)+chr(105)+chr(103))
chip=s.rfind(chr(10)+chr(102)+chr(117)+chr(110)+chr(99)+chr(116)+chr(105)+chr(111)+chr(110)+chr(32)+chr(70)+chr(105)+chr(101)+chr(108)+chr(100)+chr(67)+chr(104)+chr(105)+chr(112)+chr(40))
if chip!=-1: s=s[:chip]+chr(10)
C,P=data[chr(67)+chr(79)+chr(77)+chr(77)+chr(79)+chr(78)],data[chr(80)+chr(69)+chr(78)+chr(68)+chr(73)+chr(78)+chr(71)]
lines=[chr(99)+chr(111)+chr(110)+chr(115)+chr(116)+chr(32)+chr(67)+chr(79)+chr(77)+chr(77)+chr(79)+chr(78)+chr(95)+chr(84)+chr(65)+chr(66)+chr(83)+chr(32)+chr(61)+chr(32)+chr(91)]
for x in C: lines.append(chr(32)*2+json.dumps(x,ensure_ascii=False)+chr(44))
lines.append(chr(93)+chr(32)+chr(97)+chr(115)+chr(32)+chr(99)+chr(111)+chr(110)+chr(115)+chr(116)+chr(59))
lines.append(chr(99)+chr(111)+chr(110)+chr(115)+chr(116)+chr(32)+chr(76)+chr(69)+chr(86)+chr(69)+chr(76)+chr(49)+chr(95)+chr(84)+chr(65)+chr(66)+chr(83)+chr(32)+chr(61)+chr(32)+chr(67)+chr(79)+chr(77)+chr(77)+chr(79)+chr(78)+chr(95)+chr(84)+chr(65)+chr(66)+chr(83)+chr(59))
lines.append(chr(99)+chr(111)+chr(110)+chr(115)+chr(116)+chr(32)+chr(76)+chr(69)+chr(86)+chr(69)+chr(76)+chr(50)+chr(95)+chr(84)+chr(65)+chr(66)+chr(83)+chr(32)+chr(61)+chr(32)+chr(91)+json.dumps(chr(21512)+chr(29615)+chr(27604),ensure_ascii=False)+chr(44)+chr(32)+chr(46)+chr(46)+chr(46)+chr(67)+chr(79)+chr(77)+chr(77)+chr(79)+chr(78)+chr(95)+chr(84)+chr(65)+chr(66)+chr(83)+chr(93)+chr(32)+chr(97)+chr(115)+chr(32)+chr(99)+chr(111)+chr(110)+chr(115)+chr(116)+chr(59))
lines.append(chr(99)+chr(111)+chr(110)+chr(115)+chr(116)+chr(32)+chr(80)+chr(69)+chr(78)+chr(68)+chr(73)+chr(78)+chr(71)+chr(95)+chr(70)+chr(73)+chr(69)+chr(76)+chr(68)+chr(83)+chr(32)+chr(61)+chr(32)+chr(91))
for x in P: lines.append(chr(32)*2+json.dumps(x,ensure_ascii=False)+chr(44))
lines.append(chr(93)+chr(59))
block=chr(10).join(lines)+chr(10)*2
pat=chr(99)+chr(111)+chr(110)+chr(115)+chr(116)+chr(32)+chr(67)+chr(79)+chr(77)+chr(77)+chr(79)+chr(78)+chr(95)+chr(84)+chr(65)+chr(66)+chr(83)+chr(91)+chr(92)+chr(115)+chr(92)+chr(83)+chr(93)+chr(63)+chr(116)+chr(121)+chr(112)+chr(101)+chr(32)+chr(77)+chr(101)+chr(116)+chr(114)+chr(105)+chr(99)+chr(75)+chr(105)+chr(110)+chr(100)
s=re.sub(pat,block+chr(116)+chr(121)+chr(112)+chr(101)+chr(32)+chr(77)+chr(101)+chr(116)+chr(114)+chr(105)+chr(99)+chr(75)+chr(105)+chr(110)+chr(100),s,count=1)
p.write_text(s.replace(chr(13)+chr(10),chr(10)),encoding=chr(117)+chr(116)+chr(102)+chr(45)+chr(56))
print(len(s.splitlines()))
