/* 拼音逻辑迷宫 · 原创关卡数据。
   所有答案由具体线索唯一限定，题目不依赖随机生成。 */
const Q=(type,title,clue,options,answer,reason,hint)=>({type,title,clue,options,answer,reason,hint});
const SINGLE=(title,clue,options,answer,reason,hint)=>Q('single',title,clue,options,answer,reason,hint);
const MULTI=(title,clue,options,answer,reason,hint)=>Q('multi',title,clue,options,answer,reason,hint);
const SEQ=(title,clue,options,answer,reason,hint)=>Q('sequence',title,clue,options,answer,reason,hint);
const MATCH=(title,clue,pairs,reason,hint)=>Q('match',title,clue,pairs.map(p=>p[0]),pairs,reason,hint);
const REALMS=[
 {id:'initial',mark:'I',name:'声母城堡',english:'THE CONSONANT VAULT',tag:'23 个声母 · 看形辨音',color:'#74c9c0',intro:'观察形状、发音位置和气流线索，不靠死记硬背。',rule:'声母发音一般轻而短，拼读时要和韵母自然连起来。',levels:[
  {id:'i1',name:'镜像回廊',subject:'字形推理',story:'四扇镜子里藏着 b、p、d、q。根据圆肚子和竖线的位置，恢复正确的字母。',rule:'b：竖在左、圆在右下；p：竖在左、圆在右上；d：圆在左下、竖在右；q：圆在左上、竖在右。',puzzles:[
   SINGLE('镜面线索 01','竖线在左边，圆肚子在右下角。是哪一个字母？',['b','d','p','q'],'b','b 的竖在左，圆肚子在右下；与 p 的区别在圆肚子的上下位置。','先锁定“竖在左”，只剩 b 或 p。'),
   SINGLE('镜面线索 02','圆肚子在左上方，竖线向下延伸到右侧。',['b','p','d','q'],'q','q 的圆在左上、竖在右；d 的圆在左下。','先排除竖线在左的 b 和 p。'),
   MATCH('镜像归位','把每个字母接到正确的形状说明。',[['b','左竖 · 右下圆'],['p','左竖 · 右上圆'],['d','右竖 · 左下圆'],['q','右竖 · 左上圆']],'用“竖线在哪边”和“圆在哪个角”两个维度，能稳定区分 b、p、d、q。','先判断竖线在左还是右，再看圆在上还是下。')
  ]},
  {id:'i2',name:'气流实验室',subject:'发音机制',story:'一扇门只能被正确的发音特征开启。试着用嘴唇、气流和鼻腔三个维度判断。',rule:'b/p 都是双唇音，区别在送气；m 也是双唇音，但气流从鼻腔通过；f 用上齿接触下唇。',puzzles:[
   SINGLE('双唇暗号','双唇先闭合再打开；和 p 比，发音时送出的气流较弱。',['b','p','m','f'],'b','b 是双唇、不送气的声母；p 是双唇、送气的声母。','想想 b 和 p：哪一个气流较弱？'),
   MULTI('双唇过滤器','选出全部用“双唇接触”形成发音的声母。',['f','b','m','p','d'],['b','p','m'],'b、p、m 都是双唇音；f 是唇齿音，d 是舌尖中音。','注意：f 虽然也用到嘴唇，但它与上齿配合。'),
   SINGLE('鼻音探测器','双唇闭合，发声时气流主要从鼻腔通过。',['b','p','m','f'],'m','m 是双唇鼻音，与 b、p 的口腔爆破发声不同。','鼻音通常能让你感到鼻腔有共鸣。')
  ]},
  {id:'i3',name:'舌位控制台',subject:'分组归纳',story:'控制台把发音部位弄乱了。还原不同声母所属的发音位置。',rule:'d t n l 属于舌尖中音，g k h 属于舌根音，j q x 属于舌面音。',puzzles:[
   MATCH('位置配对','选择声母所在的主要发音位置。',[['d','舌尖中音'],['k','舌根音'],['q','舌面音']],'d 归舌尖中音；k 归舌根音；q 归舌面音。','分别读一遍 d、k、q，感受舌头哪个部位更用力。'),
   MULTI('同组回收','下列声母中，哪些与 d 同属于“舌尖中音”？',['t','g','n','l','h'],['t','n','l'],'d、t、n、l 是同一个发音部位组；g、h 属于舌根音。','舌尖中音的四名成员是 d、t、n、l。'),
   SINGLE('排除法','我是舌根音，不属于舌尖中音，也不属于舌面音。',['j','d','g','x'],'g','g 是舌根音。','先排除 j、x。')
  ]},
  {id:'i4',name:'平翘舌岔路',subject:'对照分类',story:'路线分成平舌和翘舌两侧。只有按发音特点正确分流，吊桥才会升起。',rule:'z c s 是平舌音；zh ch sh r 是翘舌音。练习时注意舌尖的位置。',puzzles:[
   MULTI('通向左侧的门','左门只接受平舌声母。选出全部可以通过的字母。',['zh','z','ch','c','s','sh'],['z','c','s'],'z、c、s 是平舌音；zh、ch、sh 是翘舌音。','平舌声母不带 h。'),
   MULTI('通向右侧的门','右门只接受翘舌声母。选出全部可以通过的字母。',['r','s','ch','zh','c','sh'],['zh','ch','sh','r'],'zh、ch、sh、r 是常见翘舌声母。','除了 zh、ch、sh，还要想一想 r。'),
   MATCH('一一对应','按“同一基础字形、是否加 h”的关系连接三组声母。',[['z','zh'],['c','ch'],['s','sh']],'z/zh、c/ch、s/sh 构成三组常用平翘舌对照。','先看有没有共同的首字母。')
  ]},
  {id:'i5',name:'声母总机',subject:'多条件推理',story:'最终机关同时使用形状、发音部位和分组规则。',rule:'23 个声母：b p m f d t n l g k h j q x zh ch sh r z c s y w。',puzzles:[
   SINGLE('三条线索','① 我是双唇音。② 我不是鼻音。③ 发音时送气明显。',['b','p','m','f'],'p','p 属于双唇送气音；b 不送气，m 是鼻音，f 是唇齿音。','第一条排除 f，第二条排除 m，最后比较 b/p。'),
   SINGLE('反向侦探','① 属于翘舌声母。② 拼写中没有 h。③ 是单个字母。',['zh','sh','r','s'],'r','在这些选项里，r 是不带 h 的翘舌声母；s 是平舌声母。','注意“翘舌”不等于“字母里必须有 h”。'),
   SEQ('声母序列修复','按课本常用声母表的顺序，重排这四个相邻声母。',['f','p','b','m'],['b','p','m','f'],'常用声母表开头依次是 b、p、m、f。','从第一个双唇不送气音 b 开始。')
  ]}
 ]},
 {id:'vowel',mark:'II',name:'韵母城堡',english:'THE VOWEL ARCHIVE',tag:'24 个韵母 · 组合与变化',color:'#e6b86e',intro:'从口形、结构和鼻音尾音找规律，逐步理解拼读。',rule:'韵母是音节的主要发声部分。单韵母、复韵母、鼻韵母都有不同的结构规律。',levels:[
  {id:'v1',name:'六元音密室',subject:'单韵母分类',story:'六块元音石板混在一起。先还原单韵母，再辨认特殊口形。',rule:'六个单韵母：a o e i u ü。ü 发音时双唇前伸呈圆形，与 u 的发音位置不同。',puzzles:[
   MULTI('找回六块石板','选出所有单韵母。',['a','ai','ü','o','ang','e','u','i'],['a','o','e','i','u','ü'],'a、o、e、i、u、ü 是六个单韵母；ai 是复韵母，ang 是后鼻韵母。','单韵母常由一个字母表示，ü 也算。'),
   SINGLE('圆唇线索','这个单韵母写法很像 u，但上面还有两点。',['u','ü','i','e'],'ü','ü 和 u 不能混为一谈，两点是重要拼写标记。','看字母上方的两点。'),
   SEQ('记忆通道','按小学常见单韵母表顺序排列后四个。',['ü','i','e','u'],['e','i','u','ü'],'单韵母顺序是 a、o、e、i、u、ü。','a、o 已在前面，接着轮到 e。')
  ]},
  {id:'v2',name:'元音组合机',subject:'复韵母识别',story:'有些韵母不是一个固定口形，要从一个元音滑向另一个元音。',rule:'ai ei ui ao ou iu ie üe er 是小学拼音常见的九个复韵母。',puzzles:[
   MULTI('双元音仓库','下列哪些是复韵母，而不是单韵母或鼻韵母？',['ai','an','ou','e','ie','ing','ui'],['ai','ou','ie','ui'],'ai、ou、ie、ui 都属于复韵母；an、ing 是鼻韵母。','复韵母的发音通常涉及连续的元音变化。'),
   SINGLE('结构排除','① 不是单韵母。② 不以 n 或 ng 结尾。③ 写法以 a 开头，以 i 结尾。',['an','ai','ao','ang'],'ai','ai 符合“a 开头、i 结尾”的两字母复韵母特征。','把“首字母”和“末字母”一起看。'),
   MATCH('名称与样本','把三个韵母连接到其所属结构类别。',[['ai','复韵母'],['a','单韵母'],['ang','后鼻韵母']],'从结构看，a 是单韵母，ai 是复韵母，ang 是后鼻韵母。','观察结尾是否有 -ng。')
  ]},
  {id:'v3',name:'鼻音双通道',subject:'前后鼻音',story:'一条通向 -n，另一条通向 -ng。读音尾部的差别，能帮助我们分清字形。',rule:'前鼻韵母：an en in un ün；后鼻韵母：ang eng ing ong。注意比较 an/ang、en/eng、in/ing。',puzzles:[
   MULTI('前鼻音通道','哪些韵母以 -n 收尾，属于前鼻韵母？',['an','ang','en','ing','in','ün','ong'],['an','en','in','ün'],'an、en、in、ün 都是前鼻韵母；带 -ng 的通常归入后鼻韵母。','观察结尾：-n 和 -ng 是不一样的。'),
   MATCH('成对辨形','找到只差末尾 g 的常见前后鼻韵母对照。',[['an','ang'],['en','eng'],['in','ing']],'an/ang、en/eng、in/ing 是三组有代表性的前后鼻音对照。','先找到开头相同的部分。'),
   SINGLE('两步排除','① 我是后鼻韵母。② 我的首字母是 i。',['in','ing','an','eng'],'ing','ing 以 -ng 收尾且以 i 开头。','后鼻韵母的结尾有 g。')
  ]},
  {id:'v4',name:'声调密码箱',subject:'四声辨析',story:'相同的字母组合，声调不同就会开启不同的抽屉。',rule:'普通话四声的基本调型：一声平、二声升、三声先降后升、四声降。选择前可以听示例字。',puzzles:[
   MATCH('四条音高曲线','将声调符号与它代表的调型配对。',[['ˉ','一声 · 平'],['ˊ','二声 · 升'],['ˇ','三声 · 拐弯'],['ˋ','四声 · 降']],'四声符号分别对应平、升、先降后升、降的基本调型。','一声像平线，四声像向下的斜线。'),
   SINGLE('认出第三声','“马”这个字正确的拼音是哪一个？',['mā','má','mǎ','mà'],'mǎ','马读 mǎ，第三声。','先看汉字“马”的音调，再找折线形调号。'),
   MATCH('四声对照','把汉字与它的带调拼音对应起来。',[['妈','mā'],['麻','má'],['马','mǎ'],['骂','mà']],'mā、má、mǎ、mà 四种声调对应不同汉字，拼读时调值不能省略。','同一个 ma，要读出四种音高走势。')
  ]},
  {id:'v5',name:'ü 的隐身规则',subject:'规则迁移',story:'两个小点在某些声母后会隐身，但拼音的韵母并没有因此变成 u。',rule:'j、q、x 与 ü 或 üe 相拼时，两点省略：j + ü → ju；q + ü → qu；x + üe → xue。n、l 与 ü 相拼时通常保留两点：nü、lü。',puzzles:[
   SINGLE('省点实验 01','根据拼写规则：j + ü = ?',['jü','ju','ji','jui'],'ju','j、q、x 与 ü 相拼时省略两点，所以 j + ü 写作 ju。','j 后面的 ü 要省去两点。'),
   MULTI('规则作用范围','选出全部与 ü 相拼时需要省去两点的声母。',['j','n','q','l','x','g'],['j','q','x'],'j、q、x 与 ü 拼写时省点；n、l 与 ü 相拼时不省点。','这是一个固定的小组合。'),
   SINGLE('反例检验','哪一个拼写保留了 ü 上的两点？',['ju','qu','lü','xu'],'lü','l + ü 写成 lü；ju、qu、xu 中两点省略。','想想 n、l 跟 j、q、x 的区别。')
  ]}
 ]},
 {id:'whole',mark:'III',name:'整体认读城堡',english:'THE WHOLE-SYLLABLE CODEX',tag:'16 个整体认读音节 · 直读',color:'#a7a5f3',intro:'直接认读完整音节，再通过对照找出字母书写规律。',rule:'16 个整体认读音节：zhi chi shi ri zi ci si yi wu yu ye yue yuan yin yun ying。',levels:[
  {id:'w1',name:'七枚声符',subject:'直读与归类',story:'前七枚音节石板与部分声母长得很像，但要把它们当作完整音节读。',rule:'zhi chi shi ri zi ci si 是整体认读音节。不能用声母与韵母生硬拆拼。',puzzles:[
   MULTI('筛选石板','选出所有整体认读音节，不要选只有声母的石板。',['zh','zhi','ch','chi','si','s','ri'],['zhi','chi','si','ri'],'zhi、chi、si、ri 都是整体认读音节；zh、ch、s 只是声母。','整体认读音节在此组里通常比对应声母多一个 i。'),
   MATCH('声母与整体音节','找出外形对应关系（不是拆拼运算）。',[['zh','zhi'],['ch','chi'],['sh','shi'],['r','ri']],'zh → zhi、ch → chi、sh → shi、r → ri 是字形联系；这些整体音节仍应直接认读。','观察右边是否多了 i。'),
   SINGLE('不要硬拆','“zi”属于哪一类？',['单韵母','复韵母','声母','整体认读音节'],'整体认读音节','zi 属于整体认读音节，不按 z+i 机械拼读。','zi 是一个完整单位。')
  ]},
  {id:'w2',name:'y 与 w 的变换',subject:'书写规则',story:'三个常见整体音节从 i、u、ü 的书写联系中出现。',rule:'yi、wu、yu 属于整体认读音节；书写上分别与 i、u、ü 有联系。yu 中的 ü 省略两点。',puzzles:[
   MATCH('字形密码','将整体认读音节与它在书写上对应的单韵母联系起来。',[['yi','i'],['wu','u'],['yu','ü']],'yi 与 i、wu 与 u、yu 与 ü 有书写对应关系；都应直接认读。','yu 中虽然没有两点，发音联系的是 ü。'),
   SINGLE('辨清 yu','根据整体认读音节书写规则，y + ü 的常用拼写是？',['yü','yu','yi','wu'],'yu','yu 写作 y-u 的形式，不写成 yü。','先想想 ü 上的两点要不要保留。'),
   MULTI('同属一组','这几项里，哪些是整体认读音节？',['yi','i','wu','u','yu','ü'],['yi','wu','yu'],'yi、wu、yu 整体认读；i、u、ü 属于单韵母。','这道题要区分“单韵母”和“完整音节”。')
  ]},
  {id:'w3',name:'六音节档案',subject:'识别规律',story:'剩下六枚音节以 y 开头。把它们从普通声韵组合里准确找出来。',rule:'ye、yue、yuan、yin、yun、ying 都是整体认读音节。整体认读表共 16 个。',puzzles:[
   MULTI('完整的六枚','从选项中选出本组全部整体认读音节。',['ye','yue','yan','yuan','yin','yun','ying','you'],['ye','yue','yuan','yin','yun','ying'],'ye、yue、yuan、yin、yun、ying 是常见的六个整体认读音节；yan、you 不在小学规定的 16 个整体认读音节表中。','注意“以 y 开头”不是充分条件。'),
   SINGLE('鼻音线索','① 我属于整体认读音节。② 以 y 开头。③ 最后两个字母是 ng。',['yin','yun','ying','yuan'],'ying','ying 以 -ng 结尾，是后鼻韵尾的整体认读音节。','找最后两个字母是 ng 的那个。'),
   SINGLE('别被外形骗了','哪一个以 y 开头，却不在 16 个整体认读音节表中？',['ye','yuan','you','yun'],'you','you 虽然以 y 开头，但不属于小学常见的 16 个整体认读音节。','不是所有 y 开头的音节都整体认读。')
  ]},
  {id:'w4',name:'真假音节机关',subject:'分类与辨误',story:'真假音节混在一起，利用分类知识判断谁能进入整体认读档案。',rule:'“声母”“韵母”“整体认读音节”是不同学习类别。字形相似，不代表类别相同。',puzzles:[
   MATCH('类别识别','根据小学拼音学习分类连接。',[['sh','声母'],['ing','韵母'],['shi','整体认读音节']],'sh 是声母，ing 是韵母，shi 是整体认读音节。','一个多了 i 的音节，可能属于整体认读。'),
   MULTI('辨认陷阱','从下列选项里挑出全部整体认读音节。',['ri','re','zi','ze','ye','ya','yue'],['ri','zi','ye','yue'],'ri、zi、ye、yue 属于 16 个整体认读音节；re、ze、ya 不属于。','记住固定的 16 个，不要只用外形猜。'),
   SINGLE('破解误判','有人说：“所有以 y 开头的拼音都是整体认读音节。”哪一个例子可以推翻它？',['yi','yu','ya','yin'],'ya','ya 是由 y 起头的合法音节，但不属于整体认读表，说明“所有 y 开头都整体认读”是错误的。','要找一个 y 开头、却不属于整体认读的音节。')
  ]},
  {id:'w5',name:'十六音节终章',subject:'综合推理',story:'最后一扇门只认完整的整体认读音节清单。使用排除法修正遗漏。',rule:'完整清单可分成 7+3+6：zhi chi shi ri zi ci si / yi wu yu / ye yue yuan yin yun ying。',puzzles:[
   MULTI('第一组密码','选出七个“zhi/chi/shi/ri/zi/ci/si”组中的全部成员。',['shi','si','chi','zhi','ri','zi','ci','sh','z'],['zhi','chi','shi','ri','zi','ci','si'],'第一组共 7 个：zhi、chi、shi、ri、zi、ci、si。','不要把单独的声母 sh、z 混进去。'),
   MATCH('三组归档','把代表音节放到正确的记忆组里。',[['zhi','七音节组'],['yu','yi/wu/yu 组'],['yuan','六音节组']],'常用的整体认读记忆分组是 7 + 3 + 6 = 16。','分别数一数每一组有几个。'),
   SINGLE('最终缺失项','档案里已有“ye yue yuan yin yun”，最后还缺哪一个？',['you','yan','ying','yong'],'ying','ye、yue、yuan、yin、yun、ying 是六个一组的整体认读音节。','剩余音节末尾是 -ng。')
  ]}
 ]}
];
const MASTER={
 id:'master',name:'总控密室',subject:'规则迁移',story:'三个城堡的规则在这里交汇。线索没有直接告诉答案，需要组合多条知识判断。',rule:'辨形、分类、声韵拼写和整体认读共同决定正确答案。',puzzles:[
 SINGLE('线索交叉：声母','① 我的字形含 h。② 属于翘舌声母。③ 去掉 h 后是平舌声母 c。',['zh','ch','sh','r'],'ch','ch 去掉 h 是 c，属于翘舌声母。','先从字母 c 出发，想它对应的翘舌音。'),
 MULTI('两套鼻音','把所有后鼻韵母找出来。',['an','ang','en','eng','in','ing','ong'],['ang','eng','ing','ong'],'ang、eng、ing、ong 是四个后鼻韵母。','观察 -ng 结尾。'),
 SINGLE('特殊拼写：诊断','哪一个是 j + üe 的正确拼写？',['jüe','jue','jie','jiue'],'jue','j + üe 写作 jue，ü 的两点省略。','j 与 üe 相拼时，两点需要省略。'),
 MATCH('类别总检','连接各学习单位所属的正确类别。',[['zh','声母'],['ang','后鼻韵母'],['ai','复韵母'],['zhi','整体认读音节']],'这四个单位分别属于声母、后鼻韵母、复韵母、整体认读音节。','从字母结构和固定清单两方面判断。'),
 SINGLE('整体认读辨误','哪一个虽然以 y 开头，但不是 16 个整体认读音节之一？',['yun','yi','you','yuan'],'you','you 不在固定的 16 个整体认读音节清单中。','不要只凭首字母 y 判断。'),
 SEQ('最后一把钥匙','按课本整体认读音节表顺序，排列这四个连续音节。',['ri','zhi','shi','chi'],['zhi','chi','shi','ri'],'这一段的顺序是 zhi、chi、shi、ri。','从 zhi 开始。')
]};
for(const realm of REALMS){
 realm.levels.forEach((level,n)=>{
  level.realm=realm.id;level.ordinal=n+1;
  level.puzzles.forEach((q,i)=>{q.id=realm.id+'.'+level.id+'.'+(i+1);});
 });
}
MASTER.realm='master';MASTER.ordinal=1;
MASTER.puzzles.forEach((q,i)=>{q.id='master.'+(i+1);});
const ALL_LEVELS=REALMS.flatMap(r=>r.levels).concat([MASTER]);
const ALL_PUZZLES=ALL_LEVELS.flatMap(l=>l.puzzles);
