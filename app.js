'use strict';
const MODULES={
 initial:{title:'声母城堡',code:'INITIALS',focus:'辨清发音位置，读得轻而短',count:23,color:'#d67e40',note:'声母是音节开头的部分。通过例字体会发音，不把整个例字的读音误当作声母本身。',groups:[
 ['唇音','b p m f','观察双唇和上齿的动作，区分送气与不送气。'],
 ['舌尖中音','d t n l','听清 d/t、n/l 的不同。'],
 ['舌根音','g k h','留意舌根靠近软腭时的气流变化。'],
 ['舌面音','j q x','三个声母要与后面的韵母组合练习。'],
 ['平舌音','z c s','舌尖向前，注意与 zh/ch/sh 的区别。'],
 ['翘舌音','zh ch sh r','感受舌尖抬起，重点练习平翘舌对照。'],
 ['特殊声母','y w','常用于音节拼写，注意与 i、u 的联系。']]},
 vowel:{title:'韵母城堡',code:'FINALS',focus:'听清口形变化与前后鼻音',count:24,color:'#087d79',note:'韵母决定音节的主体响度。复韵母要连贯滑动，鼻韵母要辨清 -n 和 -ng。',groups:[
 ['单韵母','a o e i u ü','观察口形和舌位。ü 要保持圆唇。'],
 ['复韵母','ai ei ui ao ou iu ie üe er','发音由一个元音自然滑向另一个，不能读成两个断开的音。'],
 ['前鼻韵母','an en in un ün','读到尾音时，舌尖上抬形成 -n。'],
 ['后鼻韵母','ang eng ing ong','读到尾音时舌根后抬形成 -ng，注意对照 an/ang 等。']]},
 whole:{title:'整体认读城堡',code:'WHOLE SYLLABLES',focus:'识别完整音节，不拆开硬拼',count:16,color:'#7352a6',note:'整体认读音节按完整的读音识记；一些拼写形态与声母、韵母有关，但练习时直接认读。',groups:[
 ['翘舌类','zhi chi shi ri','整体认读，留意与 zh/ch/sh/r 声母读法的关系。'],
 ['平舌类','zi ci si','整体认读，不按 z+i 等逐字母拼。'],
 ['yi / wu / yu','yi wu yu','对照 i、u、ü 相关的书写形式。'],
 ['常用直读音节','ye yue yuan yin yun ying','先整体读准，再观察音节中的字母。']]}
};
const EX={
 initial:{b:['波','bō'],p:['坡','pō'],m:['摸','mō'],f:['发','fā'],d:['得','dé'],t:['特','tè'],n:['讷','nè'],l:['勒','lè'],g:['哥','gē'],k:['科','kē'],h:['喝','hē'],j:['鸡','jī'],q:['七','qī'],x:['西','xī'],zh:['知','zhī'],ch:['吃','chī'],sh:['狮','shī'],r:['日','rì'],z:['资','zī'],c:['次','cì'],s:['丝','sī'],y:['衣','yī'],w:['乌','wū']},
 vowel:{a:['啊','ā'],o:['喔','ō'],e:['鹅','é'],i:['衣','yī'],u:['乌','wū'],'ü':['鱼','yú'],ai:['爱','ài'],ei:['杯','bēi'],ui:['水','shuǐ'],ao:['猫','māo'],ou:['手','shǒu'],iu:['牛','niú'],ie:['叶','yè'],'üe':['月','yuè'],er:['耳','ěr'],an:['山','shān'],en:['门','mén'],in:['林','lín'],un:['春','chūn'],'ün':['云','yún'],ang:['羊','yáng'],eng:['风','fēng'],ing:['星','xīng'],ong:['东','dōng']},
 whole:{zhi:['知','zhī'],chi:['吃','chī'],shi:['狮','shī'],ri:['日','rì'],zi:['字','zì'],ci:['次','cì'],si:['丝','sī'],yi:['衣','yī'],wu:['乌','wū'],yu:['鱼','yú'],ye:['叶','yè'],yue:['月','yuè'],yuan:['圆','yuán'],yin:['音','yīn'],yun:['云','yún'],ying:['鹰','yīng']}
};
const WORDS=[
 ['b','a','ba','bà','爸'],['p','a','pa','pá','爬'],['m','a','ma','mā','妈'],
 ['f','an','fan','fàn','饭'],['d','eng','deng','dēng','灯'],['t','ang','tang','táng','糖'],
 ['n','iu','niu','niú','牛'],['l','in','lin','lín','林'],['g','ou','gou','gǒu','狗'],
 ['k','ai','kai','kāi','开'],['j','in','jin','jīn','金'],['q','iu','qiu','qiū','秋'],
 ['x','ing','xing','xīng','星'],['zh','ong','zhong','zhōng','中'],
 ['ch','un','chun','chūn','春'],['sh','ui','shui','shuǐ','水'],
 ['r','en','ren','rén','人'],['z','ao','zao','zǎo','早'],
 ['c','ao','cao','cǎo','草'],['s','an','san','sān','三'],
 ['b','ao','bao','bāo','包'],['l','ong','long','lóng','龙'],
 ['t','ou','tou','tóu','头'],['h','ai','hai','hǎi','海'],
 ['j','üe','jue','jué','决'],['q','üe','que','què','确'],
 ['x','üe','xue','xué','学']
];
const TONES=[
 {base:'ma',items:[['mā','妈'],['má','麻'],['mǎ','马'],['mà','骂']]},
 {base:'ba',items:[['bā','八'],['bá','拔'],['bǎ','把'],['bà','爸']]},
 {base:'shi',items:[['shī','师'],['shí','十'],['shǐ','史'],['shì','是']]},
 {base:'yi',items:[['yī','衣'],['yí','姨'],['yǐ','椅'],['yì','意']]}
];
const SPELL=[
 ['j','ü','ju','jü','jiu','jui'],
 ['q','ü','qu','qü','qiu','qui'],
 ['x','ü','xu','xü','xiu','xui'],
 ['j','üe','jue','jüe','jie','juee'],
 ['q','üe','que','qüe','qie','quee'],
 ['x','üe','xue','xüe','xie','xuee']
];
const STORE='pinyin-lab-v2';
function blankState(){return {learned:{initial:[],vowel:[],whole:[]},points:0,attempts:0,correct:0,sessions:0,mistakes:{},soundOff:false};}
function loadState(){
 let state=blankState();
 try{
  const v=JSON.parse(localStorage.getItem(STORE)||'null');
  if(v&&typeof v==='object'){
   state=Object.assign(state,v);
   state.learned=Object.assign(blankState().learned,v.learned||{});
   state.mistakes=v.mistakes&&typeof v.mistakes==='object'?v.mistakes:{};
   return state;
  }
  const old=JSON.parse(localStorage.getItem('pinyin-magic-castles-v1')||'null');
  if(old&&old.learned){['initial','vowel','whole'].forEach(function(id){state.learned[id]=Array.isArray(old.learned[id])?old.learned[id]:[];});}
 }catch(e){}
 return state;
}
let state=loadState(),page='home',moduleId='initial',session=null,selected=null,voices=[],toastTimer=0;
const app=document.getElementById('app'),modal=document.getElementById('modal'),toastEl=document.getElementById('toast');
function save(){try{localStorage.setItem(STORE,JSON.stringify(state));}catch(e){}updateHeader();}
function known(id){return (state.learned[id]||[]).filter(function(x){return allUnits(id).includes(x);}).length;}
function totalKnown(){return Object.keys(MODULES).reduce(function(n,id){return n+known(id);},0);}
function allUnits(id){return MODULES[id].groups.reduce(function(a,g){return a.concat(g[1].split(' '));},[]);}
function esc(t){return String(t).replace(/[&<>"']/g,function(ch){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch];});}
function shuffle(a){const out=a.slice();for(let i=out.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[out[i],out[j]]=[out[j],out[i]];}return out;}
function label(id){return MODULES[id].title;}
function toast(msg){toastEl.textContent=msg;toastEl.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(function(){toastEl.classList.remove('show');},2100);}
function updateHeader(){
 const n=document.getElementById('knownStat');if(n)n.textContent=totalKnown()+'/63';
 document.querySelectorAll('[data-nav]').forEach(function(el){const key=el.dataset.nav;el.classList.toggle('active',key===page||(page==='castle'&&key==='home')||(page==='session'&&key==='challenge'));});
}
function speak(text){
 if(state.soundOff){toast('声音已关闭，请在学习档案中开启');return;}
 if(!('speechSynthesis' in window)){toast('当前浏览器不支持语音，建议使用 Safari 或 Chrome');return;}
 try{
  window.speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance(text);u.lang='zh-CN';u.rate=.83;u.pitch=1;u.volume=1;
  if(voices.length){const v=voices.find(function(x){return /^zh-CN$/i.test(x.lang);})||voices.find(function(x){return /^zh/i.test(x.lang);});if(v)u.voice=v;}
  window.speechSynthesis.speak(u);
 }catch(e){toast('朗读不可用，请检查设备音量');}
}
if('speechSynthesis' in window){
 voices=window.speechSynthesis.getVoices();
 window.speechSynthesis.onvoiceschanged=function(){voices=window.speechSynthesis.getVoices();};
}
function castleArt(color){
 return '<svg viewBox="0 0 190 145" role="img" aria-label="城堡建筑图形" xmlns="http://www.w3.org/2000/svg">'+
 '<circle cx="96" cy="65" r="56" fill="none" stroke="'+color+'" stroke-opacity=".17" stroke-dasharray="2 6"/>'+
 '<path d="M16 119H174" stroke="'+color+'" stroke-width="2" opacity=".4"/>'+
 '<path d="M33 56h27v63H33zM130 56h27v63h-27z" fill="'+color+'" opacity=".75"/>'+
 '<path d="M29 56V43h8v7h9v-7h8v7h9v6zM126 56V43h8v7h9v-7h8v7h9v6z" fill="'+color+'"/>'+
 '<path d="M61 69h69v50H61z" fill="'+color+'" opacity=".88"/>'+
 '<path d="M66 69V51h10v9h13v-9h11v9h13v-9h10v18z" fill="'+color+'"/>'+
 '<path d="M83 119V97a13 13 0 0 1 26 0v22" fill="#fff" opacity=".86"/>'+
 '<path d="M41 71h10v17H41zM139 71h10v17h-10zM89 77h13v13H89z" fill="#fff" opacity=".75"/>'+
 '<path d="M95 51V21" stroke="'+color+'" stroke-width="3"/><path d="M95 22h26l-6 9H95z" fill="'+color+'"/>'+
 '<path d="M18 124h154" stroke="'+color+'" stroke-width="5" stroke-linecap="round" opacity=".55"/>'+
 '</svg>';
}
function renderHome(){
 let cards=Object.keys(MODULES).map(function(id,i){
  const m=MODULES[id],n=known(id),pct=Math.round(n/m.count*100);
  return '<button class="path-card '+id+'" data-action="castle" data-id="'+id+'">'+
   '<div class="path-art"><span class="code">0'+(i+1)+' / '+m.code+'</span>'+castleArt(m.color)+'</div>'+
   '<div class="path-top"><small>第 '+(i+1)+' 区域 · '+m.count+' 个基础单位</small></div>'+
   '<h3>'+m.title+'</h3><p>'+m.focus+'。'+(id==='whole'?'完整读音，直接识记。':'从识别走向运用。')+'</p>'+
   '<div class="progress-track"><i style="width:'+pct+'%"></i></div>'+
   '<div class="path-foot"><span>已认识 <b>'+n+'/'+m.count+'</b></span><span class="goto">进入学习 ↗</span></div></button>';
 }).join('');
 app.innerHTML='<div class="page">'+
  '<section class="hero"><div class="hero-copy"><div class="eyebrow light">PINYIN LEARNING SYSTEM · V2.0</div>'+
  '<h1>把字母学会，<br><em>把拼读练熟。</em></h1>'+
  '<p>从三个城堡出发，走过发音识别、声韵组合、声调判断和综合闯关。不是反复点卡片，而是让每一次练习都有反馈。</p>'+
  '<div class="hero-actions"><button class="btn main" data-action="nav" data-page="challenge">开始综合闯关 ↗</button><button class="btn line" data-action="nav" data-page="blend">进入拼读工坊</button></div></div>'+
  '<div class="hero-graphic" aria-hidden="true"><div class="orbit"></div><div class="graphic-core"><span>拼</span></div>'+
  '<div class="orbit-node a"><strong>23</strong><small>INITIALS</small></div>'+
  '<div class="orbit-node b"><strong>24</strong><small>FINALS</small></div>'+
  '<div class="orbit-node c"><strong>16</strong><small>WHOLE</small></div><div class="hero-side-label">EXPLORE · PRACTICE · MASTER</div></div></section>'+
  '<div class="section-head"><div><div class="eyebrow">LEARNING MAP</div><h2>三座城堡 · 一条进阶路线</h2><p>按自己掌握的程度学习，难点随时返回复练。</p></div><span class="meta">总计 63 个基础单位</span></div>'+
  '<section class="paths">'+cards+'</section>'+
  '<section class="home-bottom"><div class="panel feature-card"><div class="eyebrow light">PRACTICE STUDIO</div><h3 style="margin-top:9px">真正的拼读，从组合开始</h3><p>分清声母和韵母，正确拼出完整音节；再处理变调、标调和特殊拼写。</p>'+
  '<div class="feature-tags"><span>声母 + 韵母</span><span>平翘舌</span><span>前后鼻音</span><span>ü 的省点规则</span></div>'+
  '<button class="btn main" data-action="nav" data-page="blend">进入训练 ↗</button></div>'+
  '<div class="panel"><div class="eyebrow">LEARNING RECORD</div><h3 style="margin-top:9px">学习记录</h3><p>“已认识”由自己确认，练习正确率和待复习错题单独记录。</p>'+
  '<div class="mini-metrics"><div class="metric"><b>'+totalKnown()+'</b><small>已认识 / 63</small></div>'+
  '<div class="metric"><b>'+state.attempts+'</b><small>练习题数</small></div>'+
  '<div class="metric"><b>'+Object.keys(state.mistakes).length+'</b><small>待复习题</small></div></div></div></section>'+
  '<p class="site-footer">发音按钮播放的是示例汉字的普通话读音；设备语音不等于专业声母、韵母教学录音。学习进度只保存在当前浏览器。</p></div>';
}
function renderCastle(){
 const m=MODULES[moduleId],pct=Math.round(known(moduleId)/m.count*100);
 let groups=m.groups.map(function(g,index){
  const units=g[1].split(' ').map(function(py){
   const ex=EX[moduleId][py],done=(state.learned[moduleId]||[]).includes(py);
   return '<button class="unit '+(done?'learned':'')+'" data-action="unit" data-unit="'+esc(py)+'" aria-label="'+esc(py)+'，示例字'+esc(ex[0])+(done?'，已认识':'')+'">'+
    (done?'<span class="check">✓</span>':'')+'<strong>'+esc(py)+'</strong><small>'+esc(ex[0])+'</small></button>';
  }).join('');
  return '<section class="group-card"><div class="group-head"><h3>'+g[0]+'</h3><small>'+(index+1)+' / '+m.groups.length+' · '+g[1].split(' ').length+' 个</small></div>'+
    '<p class="group-note">'+g[2]+'</p><div class="unit-grid">'+units+'</div></section>';
 }).join('');
 app.innerHTML='<div class="page"><div class="page-head"><div><button class="back" data-action="nav" data-page="home">← 返回学习地图</button>'+
  '<div class="eyebrow">'+m.code+' · CASTLE</div><h1 class="page-title">'+m.title+'</h1>'+
  '<p class="page-sub">'+m.note+'</p></div><div class="page-heading-right"><span class="status-chip">'+known(moduleId)+' / '+m.count+' 已认识</span></div></div>'+
  '<section class="learning-intro"><div><div class="eyebrow light">LEARNING TARGET</div><h2>'+m.focus+'</h2>'+
  '<p>点击字母，打开发音与辨析卡。完成学习后，进入本城堡专项训练。</p>'+
  '<div style="margin-top:18px"><button class="btn main" data-action="start" data-mode="castle">本城堡专项训练 ↗</button></div></div>'+
  '<div class="side"><div class="big-code">'+(moduleId==='initial'?'b·p':moduleId==='vowel'?'ai·an':'zhi')+'</div></div></section>'+
  groups+'<p class="bottom-hint">标记“已经认识”只是自我确认，不代表在听音和拼读测试中已经熟练。建议两者结合练习。</p></div>';
}
function renderBlend(){
 app.innerHTML='<div class="page"><div class="page-head"><div><div class="eyebrow">PRACTICE STUDIO</div>'+
  '<h1 class="page-title">拼读工坊</h1><p class="page-sub">看懂组合规则，也能把陌生音节独立拼出来。</p></div></div>'+
  '<div class="workbench"><div class="method-grid">'+
  '<section class="method"><div class="method-no">TRAINING 01</div><div class="symbol">b + ao → bao</div><h3>声韵组合</h3><p>根据声母和韵母，选出正确拼写。特殊组合也会进入练习。</p><button class="btn blue" data-action="start" data-mode="blend">开始 10 题 ↗</button></section>'+
  '<section class="method"><div class="method-no">TRAINING 02</div><div class="symbol">j + ü → ju</div><h3>特殊拼写</h3><p>理解 j、q、x 与 ü、üe 相拼时省略两点的规则。</p><button class="btn outline" data-action="start" data-mode="spell">练习 6 题 ↗</button></section>'+
  '<section class="method"><div class="method-no">TRAINING 03</div><div class="symbol">zh / z</div><h3>发音归类</h3><p>辨认不同发音部位，区分平翘舌及前后鼻韵母。</p><button class="btn outline" data-action="start" data-mode="class">开始 10 题 ↗</button></section>'+
  '<section class="method"><div class="method-no">TRAINING 04</div><div class="symbol">↻</div><h3>错题复盘</h3><p>以前做错的题自动收集，答对后从待复习队列移除。</p><button class="btn outline" data-action="review">'+(Object.keys(state.mistakes).length?'复习 '+Object.keys(state.mistakes).length+' 题 ↗':'查看错题 ↗')+'</button></section>'+
  '</div><aside class="guide-panel"><div class="eyebrow">HOW TO LEARN</div><h3 style="margin-top:9px">拼读三步法</h3>'+
  '<div class="formula">b <span>+</span> ao <span>→</span> bao</div>'+
  '<ol><li>先看清声母，发音轻短。</li><li>再读准韵母，发音响亮。</li><li>两部分连贯拼读成音节。</li></ol>'+
  '<p>注意：j、q、x 和 ü 相拼时，ü 上两点省略，但韵母的发音并没有变成 u。</p>'+
  '<button class="btn light" data-action="nav" data-page="tones">学习四声与标调 →</button></aside></div>'+
  '<p class="site-footer">本训练采用经过筛选的真实汉字音节示例；并非任意声母和韵母都能合法组合。</p></div>';
}
function renderTones(){
 let lines=['M5 9H85','M5 31L85 5','M5 5Q33 52 47 29Q67 15 85 10','M5 5L85 34'];
 let charts=TONES[0].items.map(function(item,i){
  return '<div class="tone-box"><svg class="graph" viewBox="0 0 90 39" aria-hidden="true"><path d="'+lines[i]+'" fill="none" stroke="#2b768a" stroke-width="5" stroke-linecap="round"/></svg>'+
  '<strong>'+item[0]+'</strong><small>'+['一声 · 平','二声 · 升','三声 · 拐弯','四声 · 降'][i]+'</small>'+
  '<span class="han">'+item[1]+'</span><button data-action="speak" data-text="'+item[1]+'">听发音 ↗</button></div>';
 }).join('');
 const sets=TONES.map(function(g){
  return '<div class="tone-set"><h3>'+g.base+' 的四声对照</h3><div class="tone-choices">'+g.items.map(function(item){
   return '<button class="tone-choice" data-action="speak" data-text="'+item[1]+'"><strong>'+item[0]+'</strong><small>'+item[1]+' · 播放</small></button>';
  }).join('')+'</div></div>';
 }).join('');
 app.innerHTML='<div class="page"><div class="page-head"><div><div class="eyebrow">TONE STUDY</div><h1 class="page-title">声调研究室</h1>'+
  '<p class="page-sub">同一个音节，声调不同，意义可能完全不同。先听出变化，再选对带调拼音。</p></div>'+
  '<button class="btn blue" data-action="start" data-mode="tone">四声挑战 ↗</button></div>'+
  '<div class="section-head" style="margin-top:12px"><div><h2>用“ma”理解四声</h2><p>观察音高走势，点击示例汉字对照发音。</p></div></div>'+
  '<div class="tone-lineup">'+charts+'</div><div class="section-head"><div><h2>同音节四声对照</h2><p>不要只背调号，要能听出和读出每一个声调。</p></div></div>'+
  '<div class="tone-sets">'+sets+'</div>'+
  '<div class="panel" style="margin-top:18px"><h3>标调提示</h3><p>有 a 先标 a；没有 a 找 o、e；i 和 u 并列时，标在后面的字母上；轻声不标调。例如 <strong>hǎo、liú、guì</strong>。</p></div></div>';
}
function renderProgress(){
 const rate=state.attempts?Math.round(state.correct/state.attempts*100):0;
 const tiles=Object.keys(MODULES).map(function(id){
  const m=MODULES[id],n=known(id);return '<div class="panel"><div class="eyebrow">'+m.code+'</div><h3 style="margin-top:9px">'+m.title+'</h3>'+
  '<p>已认识 '+n+' / '+m.count+'</p><div class="progress-track" style="--accent:'+m.color+'"><i style="width:'+(n/m.count*100)+'%"></i></div>'+
  '<button style="margin-top:16px" class="btn light" data-action="castle" data-id="'+id+'">继续学习 →</button></div>';
 }).join('');
 let wrong=Object.keys(state.mistakes).map(function(key){
  const row=state.mistakes[key],q=makeQuestion(row);
  return q?'<span class="review-chip">'+esc(q.short)+'</span>':'';
 }).join('');
 app.innerHTML='<div class="page"><div class="page-head"><div><div class="eyebrow">LEARNING RECORD</div><h1 class="page-title">学习档案</h1>'+
  '<p class="page-sub">认识进度、练习正确率、待复习内容分开统计，更清楚知道下一步练什么。</p></div></div>'+
  '<section class="prog-grid"><div class="prog-card"><small>基础单位已认识</small><strong>'+totalKnown()+' / 63</strong><p>手动确认的认识进度</p></div>'+
  '<div class="prog-card"><small>累积练习正确率</small><strong>'+rate+'%</strong><p>'+state.correct+' / '+state.attempts+' 题</p></div>'+
  '<div class="prog-card"><small>待复习错题</small><strong>'+Object.keys(state.mistakes).length+'</strong><p>答对可移出队列</p></div></section>'+
  '<div class="section-head"><div><h2>三座城堡进度</h2></div></div><section class="progress-module">'+tiles+'</section>'+
  '<div class="section-head"><div><h2>错题复习</h2><p>错误会保留在这里，直至同题答对。</p></div></div>'+
  '<div class="panel">'+(wrong?'<div class="review-list">'+wrong+'</div><button class="btn blue" data-action="review">开始错题复练 ↗</button>':
  '<div class="empty-state">目前没有待复习的错题。可以从综合闯关开始建立自己的练习记录。</div><div style="margin-top:16px"><button class="btn light" data-action="nav" data-page="challenge">进入闯关 →</button></div>')+
  '<div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-top:22px;padding-top:18px;border-top:1px solid #e3e9ed">'+
  '<button class="btn outline" data-action="sound">'+(state.soundOff?'开启语音':'关闭语音')+'</button>'+
  '<button class="btn danger" data-action="reset">清空学习记录</button></div></div>'+
  '<p class="site-footer">学习记录仅保存在此设备浏览器中，不会上传到服务器。清理浏览器数据可能会丢失进度。</p></div>';
}
function openUnit(py){
 const ex=EX[moduleId][py];if(!ex)return;selected=py;
 const m=MODULES[moduleId],done=state.learned[moduleId].includes(py);
 const group=m.groups.find(function(g){return g[1].split(' ').includes(py);});
 const special=moduleId==='initial'?'声母发音要轻而短。这里播放的是示例汉字，而不是孤立声母的标准教学音频。':
 moduleId==='vowel'?'注意口形、发音过程和鼻音尾音。播放的是包含该韵母的示例字。':
 '这是整体认读音节，直接认读，不要拆成声母和韵母硬拼。';
 modal.innerHTML='<div class="modal"><button class="modal-close" data-action="close" aria-label="关闭">×</button>'+
  '<div class="modal-overline">'+m.title+' / '+esc(group[0])+'</div><div class="modal-letter">'+esc(py)+'</div>'+
  '<div class="modal-example"><div class="han">'+esc(ex[0])+'</div><div class="py">'+esc(ex[1])+'</div></div>'+
  '<p class="modal-note">'+esc(group[2])+'<br>'+special+'</p>'+
  '<div class="modal-btns"><button class="btn outline" data-action="speak" data-text="'+esc(ex[0])+'">▶ 听示例字</button>'+
  '<button class="btn '+(done?'light':'blue')+'" data-action="mark">'+(done?'取消认识标记':'标记已认识 ✓')+'</button></div></div>';
 modal.classList.add('open');document.body.style.overflow='hidden';
}
function closeModal(){modal.classList.remove('open');document.body.style.overflow='';selected=null;}
function markUnit(){
 if(!selected)return;const arr=state.learned[moduleId],idx=arr.indexOf(selected);
 if(idx>=0)arr.splice(idx,1);else arr.push(selected);
 save();closeModal();renderCastle();toast(idx>=0?'已取消认识标记':'已记录：认识 '+selected);
}
function qSpec(type,id){return {type:type,id:id};}
function keyOf(spec){return spec.type+':'+spec.id;}
function makeQuestion(spec){
 if(!spec||!spec.type)return null;
 const type=spec.type,id=spec.id;
 if(type==='sound'){
  const parts=id.split('|'),cat=parts[0],py=parts[1];
  if(!EX[cat]||!EX[cat][py])return null;
  const ex=EX[cat][py],pool=allUnits(cat).filter(function(s){return s!==py;});
  return {key:keyOf(spec),spec:spec,short:py+' 听音',kind:'听音辨字母',title:'听示例字，找出对应的'+(cat==='initial'?'声母':cat==='vowel'?'韵母':'整体认读音节'),
   hint:'点击播放后，再选择。',display:'audio',audio:ex[0],choices:shuffle([py].concat(shuffle(pool).slice(0,3))),answer:py,
   explain:'示例字“'+ex[0]+'”读作 '+ex[1]+'，对应本组学习单位 '+py+'。'};
 }
 if(type==='class'){
  const parts=id.split('|'),cat=parts[0],py=parts[1],m=MODULES[cat];
  if(!m)return null;
  const g=m.groups.find(function(x){return x[1].split(' ').includes(py);});if(!g)return null;
  return {key:keyOf(spec),spec:spec,short:py+' 分类',kind:'发音归类',title:'“'+py+'”属于哪个学习分组？',
   hint:'观察这个拼音的发音特点。',display:py,choices:shuffle([g[0]].concat(shuffle(m.groups.filter(function(x){return x[0]!==g[0];}).map(function(x){return x[0];})).slice(0,3))),answer:g[0],
   explain:py+' 属于“'+g[0]+'”。'+g[2]};
 }
 if(type==='blend'){
  const w=WORDS.find(function(x){return x[2]===id;});if(!w)return null;
  const pool=WORDS.filter(function(x){return x[2]!==w[2];}).map(function(x){return x[2];});
  const similar=pool.filter(function(x){return x.startsWith(w[0])||x.endsWith(w[1]);});
  return {key:keyOf(spec),spec:spec,short:w[2]+' 拼读',kind:'声韵组合',title:'把声母和韵母连起来，选出正确音节',
   hint:'先读声母，再连贯地读韵母。',display:[w[0],w[1]],choices:shuffle([w[2]].concat(shuffle(similar.concat(pool.filter(function(x){return !similar.includes(x);}))).slice(0,3))),answer:w[2],
   explain:w[0]+' + '+w[1]+' → '+w[2]+'。例如“'+w[4]+'”读 '+w[3]+'。'+('jqx'.includes(w[0])&&w[1].includes('ü')?'注意：j、q、x 后面的 ü 省略两点。':'')};
 }
 if(type==='tone'){
  const parts=id.split('|'),g=TONES.find(function(x){return x.base===parts[0];}),idx=Number(parts[1]);
  if(!g||!g.items[idx])return null;
  const item=g.items[idx];
  return {key:keyOf(spec),spec:spec,short:item[1]+' 声调',kind:'声调判断',title:'这个汉字应该选哪一个带调拼音？',
   hint:'看清声调符号，听听声音的升降。',display:item[1],audio:item[1],choices:shuffle(g.items.map(function(x){return x[0];})),answer:item[0],
   explain:'“'+item[1]+'”读 '+item[0]+'，是'+['第一声','第二声','第三声','第四声'][idx]+'。'};
 }
 if(type==='spell'){
  const w=SPELL.find(function(x){return x[2]===id;});if(!w)return null;
  return {key:keyOf(spec),spec:spec,short:w[2]+' 规则',kind:'特殊拼写',title:'按照拼音书写规则，应该写成哪一个？',
   hint:'j、q、x 与 ü、üe 相拼时，两点要省略。',display:[w[0],w[1]],choices:shuffle(w.slice(2)),answer:w[2],
   explain:w[0]+' + '+w[1]+' → '+w[2]+'。ü 上两点省略，读音仍保留 ü 的特点。'};
 }
 return null;
}
function pickSpecs(mode){
 const U=function(id){return allUnits(id).map(function(py){return qSpec('sound',id+'|'+py);});};
 const C=function(id){return allUnits(id).map(function(py){return qSpec('class',id+'|'+py);});};
 const B=function(){return WORDS.map(function(w){return qSpec('blend',w[2]);});};
 const T=function(){return TONES.flatMap(function(g){return g.items.map(function(x,i){return qSpec('tone',g.base+'|'+i);});});};
 const S=function(){return SPELL.map(function(w){return qSpec('spell',w[2]);});};
 if(mode==='castle')return shuffle(U(moduleId)).slice(0,6).concat(shuffle(C(moduleId)).slice(0,4));
 if(mode==='blend')return shuffle(B()).slice(0,10);
 if(mode==='spell')return shuffle(S());
 if(mode==='class')return shuffle(C('initial').concat(C('vowel'),C('whole'))).slice(0,10);
 if(mode==='tone')return shuffle(T()).slice(0,10);
 if(mode==='review')return Object.keys(state.mistakes).map(function(k){return state.mistakes[k];}).filter(function(x){return !!makeQuestion(x);}).slice(0,20);
 return shuffle(U('initial').concat(U('vowel'),U('whole'))).slice(0,3)
  .concat(shuffle(C('initial').concat(C('vowel'),C('whole'))).slice(0,2),
  shuffle(B()).slice(0,3),shuffle(T()).slice(0,2),shuffle(S()).slice(0,2));
}
const MODE_NAMES={challenge:'综合闯关',castle:'城堡专项训练',blend:'拼读工坊',spell:'特殊拼写训练',class:'发音归类训练',tone:'四声挑战',review:'错题复习'};
function startSession(mode){
 const specs=shuffle(pickSpecs(mode)).map(makeQuestion).filter(Boolean);
 if(!specs.length){toast('当前没有错题，先去完成一轮闯关吧');return;}
 session={mode:mode,questions:specs,index:0,score:0,wrong:0,answered:false,selected:null,started:true};
 state.sessions++;save();navigate('session',null,true);
}
function renderSession(){
 if(!session){navigate('challenge');return;}
 if(session.index>=session.questions.length){renderFinished();return;}
 const q=session.questions[session.index];if(!q){session.index++;renderSession();return;}
 const stage=q.display==='audio'?'<button class="play-circle" data-action="qplay" aria-label="播放示例字">▶</button><div class="question-example">点按播放示例字，再选择答案</div>':
 Array.isArray(q.display)?'<div class="question-symbol split"><span>'+esc(q.display[0])+'</span><i>+</i><span>'+esc(q.display[1])+'</span><i>= ?</i></div>':
 '<div class="question-symbol">'+esc(q.display)+'</div>'+
 (q.audio?'<button class="btn light" data-action="qplay">▶ 听发音</button>':'');
 const options=q.choices.map(function(opt,i){
  let cls='';
  if(session.answered&&opt===q.answer)cls=' correct';
  else if(session.answered&&i===session.selected)cls=' wrong';
  return '<button class="choice'+cls+'" data-action="answer" data-index="'+i+'" '+(session.answered?'disabled':'')+'>'+esc(opt)+'</button>';
 }).join('');
 const right=session.selected!==null&&q.choices[session.selected]===q.answer;
 const feedback=session.answered?'<div class="feedback '+(right?'':'wrong')+'" role="status"><strong>'+(right?'判断正确。':'这题需要再巩固。')+'</strong><div>'+esc(q.explain)+'</div></div>'+
 '<div class="session-next"><button class="btn blue" data-action="next">'+(session.index===session.questions.length-1?'查看成绩 →':'下一题 →')+'</button></div>':'';
 const percent=Math.round(session.index/session.questions.length*100);
 app.innerHTML='<div class="page session-wrap"><button class="back" data-action="leave">← 结束训练</button>'+
 '<div class="eyebrow">'+MODE_NAMES[session.mode].toUpperCase()+'</div><h1 class="page-title">'+MODE_NAMES[session.mode]+'</h1>'+
 '<div class="session-top"><span class="count">第 '+(session.index+1)+' / '+session.questions.length+' 题</span><span class="score">当前得分 '+session.score+'</span></div>'+
 '<div class="progress-track"><i style="width:'+percent+'%;background:#24837e"></i></div>'+
 '<div class="session-card"><div class="question-kicker">'+q.kind+' / '+(session.index+1).toString().padStart(2,'0')+'</div>'+
 '<h2 class="question-heading">'+esc(q.title)+'</h2><p class="question-hint">'+esc(q.hint)+'</p>'+
 '<div class="question-stage">'+stage+'</div><div class="choices">'+options+'</div>'+feedback+'</div></div>';
}
function answer(index){
 if(!session||session.answered)return;
 const q=session.questions[session.index];
 if(!q||index<0||index>=q.choices.length)return;
 session.answered=true;session.selected=index;
 const good=q.choices[index]===q.answer;
 state.attempts++;
 if(good){session.score+=10;state.correct++;state.points+=10;delete state.mistakes[q.key];}
 else{session.wrong++;state.mistakes[q.key]=q.spec;}
 save();renderSession();
 if(good&&q.audio)speak(q.audio);
}
function nextQuestion(){if(!session||!session.answered)return;session.index++;session.answered=false;session.selected=null;renderSession();}
function renderFinished(){
 const all=session.questions.length,got=all-session.wrong,rate=Math.round(got/all*100);
 app.innerHTML='<div class="page session-wrap"><button class="back" data-action="nav" data-page="home">← 返回学习地图</button>'+
 '<div class="session-card finish"><div class="eyebrow">SESSION COMPLETE</div><div class="grade">'+rate+'%</div>'+
 '<h2>'+(rate>=90?'完成得很扎实':rate>=70?'继续巩固，进步明显':'发现了需要加强的知识点')+'</h2>'+
 '<p>答对 '+got+' / '+all+' 题 · 获得 '+session.score+' 分<br>本轮出现 '+session.wrong+' 道错题。错题会留在复习队列，直到答对。</p>'+
 '<div class="btns"><button class="btn blue" data-action="retry">再练一轮 ↗</button>'+
 '<button class="btn outline" data-action="review">复习错题</button>'+
 '<button class="btn light" data-action="nav" data-page="progress">查看学习档案</button></div></div></div>';
}
function navigate(to,id,keepSession){
 if(!keepSession&&page==='session')session=null;
 page=to;
 if(to==='castle'&&MODULES[id])moduleId=id;
 closeModal();
 if(to==='home')renderHome();
 else if(to==='castle')renderCastle();
 else if(to==='blend')renderBlend();
 else if(to==='tones')renderTones();
 else if(to==='progress')renderProgress();
 else if(to==='session')renderSession();
 else if(to==='challenge'){startSession('challenge');return;}
 else{page='home';renderHome();}
 updateHeader();window.scrollTo({top:0,behavior:'instant'});
}
document.addEventListener('click',function(ev){
 const el=ev.target.closest('[data-action]');if(!el)return;
 const a=el.dataset.action;
 if(a==='nav')navigate(el.dataset.page);
 else if(a==='castle')navigate('castle',el.dataset.id);
 else if(a==='unit')openUnit(el.dataset.unit);
 else if(a==='close')closeModal();
 else if(a==='mark')markUnit();
 else if(a==='speak')speak(el.dataset.text||'');
 else if(a==='start')startSession(el.dataset.mode);
 else if(a==='review')startSession('review');
 else if(a==='qplay'){if(session){const q=session.questions[session.index];if(q&&q.audio)speak(q.audio);}}
 else if(a==='answer')answer(Number(el.dataset.index));
 else if(a==='next')nextQuestion();
 else if(a==='retry'){if(session)startSession(session.mode);}
 else if(a==='leave'){session=null;navigate('home');}
 else if(a==='sound'){state.soundOff=!state.soundOff;save();renderProgress();if(!state.soundOff)speak('语音已开启');}
 else if(a==='reset'){
  if(confirm('清空所有“已认识”标记、练习记录和错题？此操作无法撤销。')){
   state=blankState();save();renderProgress();toast('已清空学习记录');
  }
 }
});
modal.addEventListener('click',function(ev){if(ev.target===modal)closeModal();});
document.addEventListener('keydown',function(ev){if(ev.key==='Escape')closeModal();});
navigate('home');
