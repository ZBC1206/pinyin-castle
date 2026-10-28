/* 拼音逻辑迷宫 — 纯前端 H5；无需账号、外部依赖或服务端。 */
'use strict';
const STORAGE_KEY='pinyin-logic-maze-v3';
const ROOT=document.getElementById('app');
const TOAST=document.getElementById('toast');
const INITIAL_STATE=()=>({version:3,cleared:{},mistakes:{},totalAttempts:0,firstTry:0,hints:0,freeExplore:false,soundOff:false,lastRealm:'initial'});
function readState(){
 try{
  const obj=JSON.parse(localStorage.getItem(STORAGE_KEY)||'null');
  if(obj&&obj.version===3&&obj.cleared&&obj.mistakes)return Object.assign(INITIAL_STATE(),obj);
 }catch(e){}
 return INITIAL_STATE();
}
let state=readState(),screen='map',realmId='initial',session=null,labInitial='j',labFinal='ü',toastHandle=null,voices=[];
function persist(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(state));}catch(e){}refreshShell();}
function E(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;':'&quot;',"'":'&#39;'}[c]));}
function byId(id){return ALL_LEVELS.find(l=>l.id===id);}
function realmById(id){return REALMS.find(r=>r.id===id);}
function realmProgress(id){const r=realmById(id);return r.levels.filter(l=>!!state.cleared[l.id]).length;}
function numCleared(){return Object.keys(state.cleared).length;}
function totalStars(){return Object.values(state.cleared).reduce((a,x)=>a+(x.stars||0),0);}
function stars(n){return '<span class="star-value" aria-label="'+n+'星">'+('★'.repeat(n))+('<span class="stars-empty">'+'☆'.repeat(3-n)+'</span>')+'</span>';}
function isUnlocked(l){
 if(!l)return false;
 if(state.freeExplore)return true;
 if(l.id==='master')return REALMS.every(r=>realmProgress(r.id)>=1);
 const r=realmById(l.realm),idx=r.levels.findIndex(x=>x.id===l.id);
 return idx===0||!!state.cleared[r.levels[idx-1].id];
}
function notify(msg){TOAST.textContent=msg;TOAST.classList.add('show');clearTimeout(toastHandle);toastHandle=setTimeout(()=>TOAST.classList.remove('show'),2200);}
function refreshShell(){
 document.querySelectorAll('[data-active-nav]').forEach(el=>{
  const route=el.dataset.activeNav;
  el.classList.toggle('active',route===screen||(screen==='realm'&&route==='map')||(screen==='puzzle'&&route==='map')||(screen==='result'&&route==='map'));
 });
 const st=document.getElementById('starTotal');if(st)st.textContent=totalStars();
}
function goto(page,id){
 if(page==='realm'){
  if(!realmById(id))return;
  realmId=id;state.lastRealm=id;persist();
 }
 if(page==='puzzle')return startLevel(id);
 screen=page;
 if(page==='map')renderMap();
 else if(page==='realm')renderRealm(realmById(realmId));
 else if(page==='rules')renderRules();
 else if(page==='lab')renderLab();
 else if(page==='records')renderRecords();
 else renderMap();
 refreshShell();window.scrollTo({top:0,behavior:'auto'});
}
function round(p){return Math.round(p);}
function progressBar(n,total,theme='green'){
 return '<div class="meter '+theme+'" role="progressbar" aria-valuemin="0" aria-valuemax="'+total+'" aria-valuenow="'+n+'"><span style="width:'+(total?n/total*100:0)+'%"></span></div>';
}
function castleGlyph(r){
 const lines=r.id==='initial'?'<path d="M38 112V49h20v63M86 112V34h20v78M134 112V55h20v57"/><path d="M33 49h31l-5-12H38zM81 34h31l-5-12H86zM129 55h31l-5-12h-21z"/>':
 r.id==='vowel'?'<path d="M30 112V63l65-40 65 40v49M55 112V70h80v42"/><path d="M80 112V87q15-22 30 0v25"/><path d="M48 57h95"/>':
 '<path d="M42 112V43h105v69M35 112h120M42 44l52-22 53 22"/><path d="M61 59h67v53H61z"/><path d="M75 112V79h38v33"/>';
 return '<svg class="castle-svg" viewBox="0 0 190 140" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><circle cx="95" cy="73" r="63" stroke="currentColor" stroke-opacity=".2" stroke-dasharray="2 5"/><g stroke="currentColor" stroke-width="3.2" stroke-linejoin="round">'+lines+'</g><path d="M15 116H175" stroke="currentColor" stroke-width="4" opacity=".45"/><circle cx="163" cy="23" r="4" fill="currentColor" opacity=".6"/></svg>';
}
function renderMap(){
 const cleared=numCleared(),master=isUnlocked(MASTER);
 const realmCards=REALMS.map((r,idx)=>{
  const count=realmProgress(r.id),total=r.levels.length,pct=count/total;
  return '<button class="realm-card r-'+r.id+'" data-action="realm" data-id="'+r.id+'">'+
   '<div class="realm-card-top"><span class="realm-index">DOMAIN / 0'+(idx+1)+'</span><span class="realm-fraction">'+count+'/'+total+' 关</span></div>'+
   '<div class="realm-image">'+castleGlyph(r)+'<span class="realm-initial">'+r.mark+'</span></div>'+
   '<h3>'+r.name+'</h3><p class="realm-description">'+r.intro+'</p>'+
   '<div class="realm-card-footer">'+progressBar(count,total)+'<span>探索区域 <b>↗</b></span></div></button>';
 }).join('');
 ROOT.innerHTML='<div class="page">'+
 '<section class="hero"><div class="hero-copy"><div class="hero-line"><span class="glowing-dot"></span> PINYIN / LOGIC ADVENTURE <span class="hero-version">V3.0</span></div>'+
 '<h1>拼音逻辑迷宫<span class="hero-period">.</span></h1>'+
 '<p class="hero-subtitle">不是选对答案就结束。<br>每一关，都要找出背后的<span>拼音规律。</span></p>'+
 '<p class="hero-desc">用线索排除、分类归纳、顺序修复和规则验证，破解三座城堡的机关。为小学拼音学习设计，强调“为什么”。</p>'+
 '<div class="hero-buttons"><button class="primary-btn" data-action="realm" data-id="'+state.lastRealm+'">继续探索 <span>↗</span></button>'+
 '<button class="secondary-btn" data-action="goto" data-page="lab">进入拼写实验台 <span>↗</span></button></div>'+
 '<div class="hero-metrics"><span><b>16</b><small>逻辑关卡</small></span><i></i><span><b>51</b><small>原创谜题</small></span><i></i><span><b>'+cleared+'</b><small>已经破解</small></span></div></div>'+
 '<div class="hero-visual" aria-hidden="true"><div class="grid-orbit one"></div><div class="grid-orbit two"></div><div class="center-plate"><span>音</span><small>CODE 01</small></div>'+
 '<div class="chip chip-1">b · p · d · q</div><div class="chip chip-2">ü → u ?</div><div class="chip chip-3">zhi ≠ zh</div><span class="corner-label">FIG. 01 / THE MAZE</span></div></section>'+
 '<div class="section-heading"><div><span class="eyebrow">01 / THREE REALMS</span><h2>选择探索区域</h2><p>三座城堡分别解决不同的拼音难点。先看线索，再动手验证。</p></div>'+
 '<span class="section-aside">每座城堡 · 5 个关卡</span></div>'+
 '<section class="realm-grid">'+realmCards+'</section>'+
 '<section class="map-lower"><button class="master-card '+(master?'ready':'locked')+'" data-action="master"><div class="master-icon">⌘</div><div><div class="eyebrow">'+(master?'FINAL PUZZLE / UNLOCKED':'FINAL PUZZLE / SEALED')+'</div>'+
 '<h3>总控密室 <span>↗</span></h3><p>'+(master?'三座城堡的知识交汇。6 个跨领域逻辑挑战。':'每座城堡先破解至少一关，即可进入最终密室。')+'</p></div><span class="master-status">'+(master?'可以挑战':'尚未解锁')+'</span></button>'+
 '<div class="map-tools"><div class="eyebrow">TOOLS / EXPERIMENTS</div><h3>知识并非凭空记住，而是通过规则解释。</h3>'+
 '<div class="map-tool-links"><button data-action="goto" data-page="lab">拼写实验台 ↗</button><button data-action="goto" data-page="rules">规则档案 ↗</button>'+
 '<button data-action="goto" data-page="records">学习记录 ↗</button></div><button class="free-toggle" data-action="free">'+(state.freeExplore?'☑':'□')+' '+(state.freeExplore?'自由探索已开启':'开启自由探索：暂不限制关卡顺序')+'</button></div></section>'+
 '<div class="site-note">提示：拼读是听觉与口腔动作共同参与的学习。逻辑解谜帮助理解规则，但仍需要真实朗读与听辨练习。</div></div>';
}
function renderRealm(r){
 if(!r){goto('map');return;}
 const solved=realmProgress(r.id);
 const items=r.levels.map((l,idx)=>{
  const unlocked=isUnlocked(l),done=state.cleared[l.id],s=done?stars(done.stars):'';
  return '<button class="level-card '+(unlocked?'open':'sealed')+(done?' done':'')+'" data-action="start" data-id="'+l.id+'" '+(!unlocked?'disabled':'')+'>'+
   '<span class="level-num">'+String(idx+1).padStart(2,'0')+'</span>'+
   '<span class="level-flow"><span class="level-type">'+l.subject+'</span><strong>'+l.name+'</strong><small>'+l.story+'</small></span>'+
   '<span class="level-meta">'+(done?s+'<small>已破解 · '+done.best+'分</small>':unlocked?'<span class="status-open">开始推理 ↗</span><small>3 个谜题</small>':'<span class="status-locked">LOCKED</span><small>先破解上一关</small>')+'</span></button>';
 }).join('');
 ROOT.innerHTML='<div class="page"><div class="crumb"><button data-action="goto" data-page="map">学习地图</button><span>/</span><span>'+r.name+'</span></div>'+
 '<section class="realm-hero r-'+r.id+'"><div><div class="eyebrow">DOMAIN '+r.mark+' / '+r.english+'</div><h1>'+r.name+'</h1><p>'+r.intro+'</p>'+
 '<div class="realm-hero-info"><span>已破解 <strong>'+solved+' / '+r.levels.length+'</strong></span><span>谜题 <strong>'+r.levels.length*3+'</strong></span></div>'+
 '</div><div class="realm-hero-icon">'+castleGlyph(r)+'</div></section>'+
 '<div class="realm-content"><div><div class="section-heading"><div><span class="eyebrow">MISSION LIST / 01—05</span><h2>探索关卡</h2><p>根据线索完成推理；每关三道谜题，解锁下一关。</p></div></div>'+
 '<div class="level-list">'+items+'</div></div>'+
 '<aside class="realm-sidebar"><div class="sidebar-top"><span class="eyebrow">FIELD NOTES</span><h3>本城堡的核心规则</h3></div><p>'+r.rule+'</p>'+
 '<div class="side-divider"></div><strong>你需要做的</strong><ul><li>阅读所有线索，不要着急猜。</li><li>检查答案是否满足每一条条件。</li><li>解出后阅读原理，形成规律。</li></ul>'+
 '<button class="text-link" data-action="goto" data-page="rules">查看全部规则档案 ↗</button></aside></div></div>';
}
function puzzleOptions(q){
 const chosen=session.selected,solved=session.solved;
 if(q.type==='single'){
  return '<div class="choice-grid">'+q.options.map((v,i)=>
   '<button class="answer-option '+(solved&&v===q.answer?'is-right':'')+'" data-action="single" data-index="'+i+'" '+(solved?'disabled':'')+'><span class="option-label">'+String.fromCharCode(65+i)+'</span><strong>'+E(v)+'</strong><span class="option-indicator">↗</span></button>').join('')+'</div>';
 }
 if(q.type==='multi'){
  return '<div class="choice-grid">'+q.options.map((v,i)=>{
   const active=chosen.includes(i);
   return '<button class="answer-option '+(active?'selected ':'')+(solved&&q.answer.includes(v)?'is-right':'')+'" data-action="multi" data-index="'+i+'" '+(solved?'disabled':'')+'><span class="option-label">'+(active?'✓':String.fromCharCode(65+i))+'</span><strong>'+E(v)+'</strong><span class="option-indicator">'+(active?'已选':'选择')+'</span></button>';
  }).join('')+'</div><button class="submit-btn" data-action="check" '+(!chosen.length||solved?'disabled':'')+'>验证选择 <span>→</span></button>';
 }
 if(q.type==='sequence'){
  const selected=chosen.map(i=>q.options[i]);
  return '<div class="sequence-area"><div class="sequence-caption">你的排列 · 点击已选字母可撤回</div>'+
   '<div class="slots">'+q.answer.map((_,i)=>'<button class="slot '+(i<selected.length?'filled':'')+'" data-action="remove-slot" data-index="'+i+'" '+(i>=selected.length||solved?'disabled':'')+'>'+(i<selected.length?E(selected[i]):'<span>?</span>')+'</button>').join('<span class="slot-separator">→</span>')+'</div>'+
   '<div class="sequence-caption">待排列的字母</div><div class="choice-grid">'+q.options.map((v,i)=>{
    const used=chosen.includes(i);
    return '<button class="answer-option '+(used?'used':'')+'" data-action="sequence" data-index="'+i+'" '+(used||solved?'disabled':'')+'><span class="option-label">'+String.fromCharCode(65+i)+'</span><strong>'+E(v)+'</strong></button>';
   }).join('')+'</div><button class="submit-btn" data-action="check" '+(selected.length!==q.answer.length||solved?'disabled':'')+'>验证顺序 <span>→</span></button></div>';
 }
 if(q.type==='match'){
  const entries=q.answer,already=session.matched,selectedLeft=session.left;
  const targetEntries=entries.slice().sort((a,b)=>hash(q.id+'|'+a[1])-hash(q.id+'|'+b[1]));
  return '<div class="pair-wrap"><div class="pair-col"><div class="pair-col-name">左侧 / 已知单位</div>'+
   entries.map((p,i)=>'<button class="pair-item '+(already[i]?'matched':selectedLeft===i?'focused':'')+'" data-action="pair-left" data-index="'+i+'" '+(already[i]||solved?'disabled':'')+'><span>'+String(i+1).padStart(2,'0')+'</span><strong>'+E(p[0])+'</strong><em>'+(already[i]?'✓':'')+'</em></button>').join('')+'</div>'+
   '<div class="pair-connector">⇄</div><div class="pair-col"><div class="pair-col-name">右侧 / 正确解释</div>'+
   targetEntries.map((p,i)=>{
    const pairIdx=entries.findIndex(x=>x[0]===p[0]);
    return '<button class="pair-item '+(already[pairIdx]?'matched':'')+'" data-action="pair-right" data-index="'+pairIdx+'" '+(already[pairIdx]||solved?'disabled':'')+'><span>'+String.fromCharCode(65+i)+'</span><strong>'+E(p[1])+'</strong><em>'+(already[pairIdx]?'✓':'')+'</em></button>';
   }).join('')+'</div></div><div class="matching-hint">先点左侧一项，再点右侧对应解释。'+(selectedLeft!==null?'已选中左侧第 '+(selectedLeft+1)+' 项。':'')+'</div>';
 }
 return '';
}
function hash(s){let h=5381;for(let i=0;i<s.length;i++)h=(h*33)^s.charCodeAt(i);return h>>>0;}
function initPuzzle(){session.selected=[];session.matched={};session.left=null;session.hint=false;session.failures=0;session.solved=false;session.message='';session.awarded=0;}
function startLevel(id){
 const level=byId(id);if(!level)return;
 if(!isUnlocked(level)){notify('先完成前面的关卡，或在学习地图开启自由探索');return;}
 session={levelId:id,index:0,awardedTotal:0,firstTryCount:0,totalFails:0,hintsUsed:0,results:[]};
 initPuzzle();screen='puzzle';renderPuzzle();refreshShell();window.scrollTo({top:0,behavior:'auto'});
}
function currentLevel(){return session?byId(session.levelId):null;}
function currentPuzzle(){const l=currentLevel();return l?l.puzzles[session.index]:null;}
function stageLabel(q){return {single:'线索排除',multi:'集合筛选',sequence:'顺序修复',match:'关系配对'}[q.type]||'逻辑推理';}
function renderPuzzle(){
 const l=currentLevel(),q=currentPuzzle();if(!l||!q){goto('map');return;}
 const part=round(session.index/l.puzzles.length*100);
 const earned=session.awardedTotal;
 const decoded=state.cleared[l.id];
 const panelStatus=session.solved?'correct':session.message?'incorrect':'';
 const feedback=session.solved?
  '<div class="feedback success"><div class="feedback-head"><span class="feedback-icon">✓</span><strong>机关已解开</strong><span>+'+session.awarded+' 分</span></div><p>'+E(q.reason)+'</p>'+
  '<button class="next-btn" data-action="next">'+(session.index===l.puzzles.length-1?'完成本关 · 查看报告':'进入下一道机关')+' <span>→</span></button></div>':
  session.message?'<div class="feedback retry"><strong>推理尚不成立</strong><p>'+E(session.message)+'</p></div>':'';
 const number=String(session.index+1).padStart(2,'0');
 const total=String(l.puzzles.length).padStart(2,'0');
 ROOT.innerHTML='<div class="page puzzle-page"><div class="crumb"><button data-action="goto" data-page="map">学习地图</button><span>/</span>'+
 '<button data-action="realm" data-id="'+l.realm+'">'+(l.realm==='master'?'总控密室':realmById(l.realm).name)+'</button><span>/</span><span>'+l.name+'</span></div>'+
 '<div class="mission-banner"><div><span class="eyebrow">MISSION / '+l.subject.toUpperCase()+'</span><h1>'+l.name+'</h1><p>'+l.story+'</p></div>'+
 '<div class="mission-id">'+String(l.ordinal).padStart(2,'0')+'<small>LEVEL</small></div></div>'+
 '<div class="puzzle-layout"><section class="puzzle-main"><div class="puzzle-progress"><div class="puzzle-meta"><span>机关 '+number+' / '+total+'</span>'+
 '<span>已获得 '+earned+' 分</span></div>'+progressBar(session.index,l.puzzles.length,'teal')+'</div>'+
 '<div class="question-card '+panelStatus+'"><div class="question-header"><span class="puzzle-kind">'+stageLabel(q)+'</span><span class="difficulty-tag">LOGIC TASK / '+number+'</span></div>'+
 '<h2>'+E(q.title)+'</h2><p class="question-clue">'+E(q.clue)+'</p>'+
 '<div class="working-area">'+puzzleOptions(q)+'</div>'+feedback+'</div>'+
 '<div class="puzzle-actions"><button class="hint-btn '+(session.hint?'active':'')+'" data-action="hint" '+(session.hint||session.solved?'disabled':'')+'>⌕ '+(session.hint?'已使用提示':'需要一点提示？')+' <span>使用提示将扣 15 分</span></button>'+
 '<button class="quit-btn" data-action="quit">退出本关</button></div></section>'+
 '<aside class="puzzle-sidebar"><span class="eyebrow">DEDUCTION BOARD</span><h3>线索板</h3><p>'+E(l.story)+'</p>'+
 '<div class="clue-info"><span>本题要求</span><strong>'+stageLabel(q)+'</strong><small>'+
 (q.type==='multi'?'可能有多个正确答案，必须全部选中。':q.type==='sequence'?'按顺序点击卡片填入空位，选错可撤回。':q.type==='match'?'点左侧，再点相应的右侧；配对成功会固定。':'请结合所有线索，选出唯一正确答案。')+
 '</small></div>'+
 (session.hint?'<div class="hint-box"><span>ADDITIONAL CLUE</span><p>'+E(q.hint)+'</p></div>':'<div class="hint-locked">提示未开启<br><span>先利用题目中已有的条件推理。</span></div>')+
 '<div class="side-score"><span>本关已完成</span><strong>'+session.index+' / '+l.puzzles.length+'</strong></div>'+
 (decoded?'<small class="side-replay">本关历史最佳 '+decoded.best+' 分</small>':'')+
 '</aside></div></div>';
}
function fail(msg){
 if(!session||session.solved)return;
 session.failures++;session.totalFails++;state.totalAttempts++;
 state.mistakes[currentPuzzle().id]=(state.mistakes[currentPuzzle().id]||0)+1;
 persist();session.message=msg||'有一条线索尚未满足，请检查后重试。';renderPuzzle();
}
function solve(){
 if(!session||session.solved)return;
 const q=currentPuzzle();session.solved=true;session.message='';
 state.totalAttempts++;
 if(session.failures===0){session.firstTryCount++;state.firstTry++;}
 if(session.failures===0)delete state.mistakes[q.id]; // 曾经做错的题，下一次一遍答对才移出。
 const awarded=Math.max(25,100-20*session.failures-(session.hint?15:0));
 session.awarded=awarded;session.awardedTotal+=awarded;
 session.results.push({id:q.id,firstTry:session.failures===0,usedHint:session.hint,awarded});
 persist();renderPuzzle();
}
function verify(){
 if(!session||session.solved)return;
 const q=currentPuzzle();
 if(q.type==='single')return;
 if(q.type==='multi'){
  const values=session.selected.map(i=>q.options[i]),wanted=q.answer;
  if(values.length===wanted.length&&values.every(x=>wanted.includes(x)))solve();
  else fail('选择的集合与规则不一致。检查是否有遗漏，或把不符合条件的选项混入了。');
 }else if(q.type==='sequence'){
  const values=session.selected.map(i=>q.options[i]);
  if(values.length===q.answer.length&&values.every((x,i)=>x===q.answer[i]))solve();
  else fail('这些元素都选到了，但排列顺序有误。对照线索中的先后关系重新安排。');
 }
}
function takeSingle(index){
 if(!session||session.solved)return;
 const q=currentPuzzle(),value=q.options[index];
 if(value===q.answer)solve();
 else fail('“'+value+'”不能同时满足题目的全部条件。请逐条核对。');
}
function takeMulti(index){
 if(!session||session.solved)return;
 const a=session.selected,idx=a.indexOf(index);
 if(idx>=0)a.splice(idx,1);else a.push(index);
 session.message='';renderPuzzle();
}
function takeSequence(index){
 if(!session||session.solved)return;
 if(session.selected.includes(index)||session.selected.length>=currentPuzzle().answer.length)return;
 session.selected.push(index);session.message='';renderPuzzle();
}
function removeSequence(pos){
 if(!session||session.solved)return;
 if(pos>=0&&pos<session.selected.length){session.selected.splice(pos,1);session.message='';renderPuzzle();}
}
function pairLeft(index){
 if(!session||session.solved||session.matched[index])return;
 session.left=index;session.message='';renderPuzzle();
}
function pairRight(index){
 if(!session||session.solved||session.matched[index])return;
 if(session.left===null){notify('请先点击左侧一项');return;}
 if(session.left!==index){session.left=null;fail('两端的含义没有匹配。先找共同特征，再重新连线。');return;}
 session.matched[index]=true;session.left=null;session.message='';
 if(Object.keys(session.matched).length===currentPuzzle().answer.length)solve();
 else renderPuzzle();
}
function next(){
 if(!session||!session.solved)return;
 const l=currentLevel();
 if(session.index===l.puzzles.length-1){
  const max=l.puzzles.length*100,score=session.awardedTotal;
  const star=score>=max*.9?3:score>=max*.7?2:1;
  const prior=state.cleared[l.id],best=Math.max(prior?.best||0,score);
  state.cleared[l.id]={best,stars:Math.max(prior?.stars||0,star),plays:(prior?.plays||0)+1,updatedAt:new Date().toISOString()};
  session.finished={score,stars:star,max};
  persist();screen='result';renderResult();refreshShell();window.scrollTo({top:0,behavior:'auto'});
 }else{session.index++;initPuzzle();renderPuzzle();window.scrollTo({top:0,behavior:'auto'});}
}
function renderResult(){
 const l=currentLevel();if(!l||!session?.finished){goto('map');return;}
 const f=session.finished,realm=realmById(l.realm),nextLevel=realm?.levels[l.ordinal]||null;
 ROOT.innerHTML='<div class="page result-page"><div class="result-orbit"><span>◇</span></div><span class="eyebrow">MISSION SOLVED / REPORT</span>'+
 '<h1>机关破解成功。</h1><p class="result-sub">'+l.name+' · '+l.subject+'</p><div class="result-score">'+f.score+'<small> / '+f.max+' 分</small></div>'+
 '<div class="result-stars">'+stars(f.stars)+'</div><div class="result-stats"><div><strong>'+session.firstTryCount+' / '+l.puzzles.length+'</strong><span>一次答对</span></div>'+
 '<div><strong>'+session.totalFails+'</strong><span>尝试纠错</span></div><div><strong>'+session.hintsUsed+'</strong><span>使用提示</span></div></div>'+
 '<div class="rule-unlock"><div class="rule-symbol">◈</div><div><span>已收入规则档案</span><h3>'+l.subject+'</h3><p>'+E(l.rule)+'</p></div></div>'+
 '<div class="result-buttons"><button class="primary-btn" data-action="'+(nextLevel?'start':'goto')+'" '+(nextLevel?'data-id="'+nextLevel.id+'"':'data-page="map"')+'">'+(nextLevel?'继续下一关':'返回学习地图')+' ↗</button>'+
 '<button class="outline-btn" data-action="start" data-id="'+l.id+'">再次挑战</button>'+
 '<button class="outline-btn" data-action="goto" data-page="rules">查看规则档案</button></div></div>';
}
function renderRules(){
 const cards=REALMS.map(r=>'<section class="rule-section"><div class="rule-section-title"><span>'+r.mark+'</span><h2>'+r.name+'</h2><small>'+realmProgress(r.id)+' / 5 已发现</small></div>'+
 r.levels.map(l=>{const open=!!state.cleared[l.id];return '<div class="rule-line '+(open?'unlocked':'hidden-rule')+'"><span class="rule-index">'+String(l.ordinal).padStart(2,'0')+'</span><div><h3>'+l.subject+'</h3><p>'+E(open?l.rule:'破解“'+l.name+'”后，这条拼音规律将收录到档案。')+'</p></div><span class="rule-state">'+(open?'✓ 已发现':'尚未发现')+'</span></div>';}).join('')+'</section>').join('');
 const master=state.cleared.master?'<section class="rule-section"><div class="rule-section-title"><span>IV</span><h2>总控密室</h2></div><div class="rule-line unlocked"><div><h3>跨领域综合</h3><p>'+MASTER.rule+'</p></div></div></section>':'';
 ROOT.innerHTML='<div class="page"><div class="page-heading"><span class="eyebrow">RULE ARCHIVE / UNLOCK BY REASONING</span><h1>规则档案</h1><p>推理成功之后，把发现的规律收集起来。它们可以用于破解后面的机关。</p></div>'+
 '<div class="rule-intro"><strong>'+numCleared()+' / 16</strong><span>已发现规则</span>'+progressBar(numCleared(),16)+'</div>'+
 cards+master+'<div class="site-note">学习提示：本页记录的是拼音学习规则，不替代规范的发音示范。</div></div>';
}
function renderLab(){
 const isDropped=['j','q','x'].includes(labInitial),write=labInitial+(isDropped?labFinal.replace('ü','u'):labFinal);
 const compared=[
  ['送气差别','波 · 坡','bō / pō','b 与 p 的送气区别；这里播放的是完整汉字读音。'],
  ['平翘舌','资 · 知','zī / zhī','比较 z 和 zh 的舌位差异。'],
  ['鼻韵尾','安 · 昂','ān / áng','比较前鼻音 -n 与后鼻音 -ng。'],
  ['圆唇辨音','乌 · 鱼','wū / yú','比较与 u、ü 对应的元音特点。']
 ];
 ROOT.innerHTML='<div class="page"><div class="page-heading"><span class="eyebrow">ORTHOGRAPHY / EXPERIMENTS</span><h1>拼写实验台</h1>'+
 '<p>改变一项条件，观察拼音如何变化。先自己推测，再查看实验结果。</p></div>'+
 '<div class="lab-layout"><section class="lab-board"><div class="eyebrow">EXPERIMENT 01 / Ü RULE</div><h2>ü 的两点什么时候会消失？</h2>'+
 '<p>切换声母或韵母，对照左边输入和右边规范拼写。</p><div class="lab-sets"><div><span>声母</span><div class="lab-choices">'+['j','q','x','n','l'].map(v=>'<button class="'+(v===labInitial?'on':'')+'" data-action="lab-initial" data-value="'+v+'">'+v+'</button>').join('')+'</div></div>'+
 '<div><span>韵母</span><div class="lab-choices">'+['ü','üe'].map(v=>'<button class="'+(v===labFinal?'on':'')+'" data-action="lab-final" data-value="'+v+'">'+v+'</button>').join('')+'</div></div></div>'+
 '<div class="lab-equation"><span>'+labInitial+'</span><i>+</i><span>'+labFinal+'</span><i>→</i><strong>'+write+'</strong></div>'+
 '<div class="lab-insight"><span class="lab-insight-flag">'+(isDropped?'触发省点规则':'保留两点')+'</span><p>'+(isDropped?'j、q、x 和 ü 或 üe 相拼时，书写上省去 ü 的两点，但韵母发音不变。':'n、l 与 ü 或 üe 相拼时，书写上保留 ü 的两点。')+'</p></div>'+
 '</section><aside class="lab-aside"><span class="eyebrow">THINK FIRST</span><h3>比较两次实验</h3><p>先选 j + ü，再改成 l + ü。观察哪一个符号改变了，哪一个没有改变。</p>'+
 '<div class="mini-rule"><strong>j + ü → ju</strong><strong>l + ü → lü</strong></div><p>两者读音都含有 ü 的元音音色，变化的是拼写。</p></aside></div>'+
 '<div class="section-heading"><div><span class="eyebrow">EXPERIMENT 02 / AUDIO COMPARISON</span><h2>读音对照</h2><p>听一听例字，思考声母、韵母与声调有什么不同。</p></div></div>'+
 '<section class="sound-grid">'+compared.map((a,i)=>'<article class="sound-card"><span class="sound-index">0'+(i+1)+'</span><h3>'+a[0]+'</h3><div class="sound-symbol">'+a[1]+'</div><span class="sound-pinyin">'+a[2]+'</span><p>'+a[3]+'</p>'+
 '<div class="sound-actions">'+a[1].split(' · ').map((v,j)=>'<button data-action="speak" data-value="'+v+'">▶ 读“'+v+'”</button>').join('')+'</div></article>').join('')+'</section>'+
 '<div class="site-note">语音来自设备的中文语音合成，朗读的是示例汉字，并非独立声母或韵母的标准教学录音；部分设备可能不支持。不能只靠语音合成纠正发音。</div></div>';
}
function speak(s){
 if(state.soundOff){notify('当前已关闭示例字语音，可在学习记录中开启');return;}
 if(!('speechSynthesis' in window)){notify('当前浏览器没有可用的语音合成');return;}
 try{window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(s);u.lang='zh-CN';u.rate=.78;u.pitch=1;
 const v=voices.find(x=>x.lang==='zh-CN')||voices.find(x=>x.lang.toLowerCase().startsWith('zh'));if(v)u.voice=v;
 window.speechSynthesis.speak(u);}catch(e){notify('语音不可用，请检查浏览器设置');}
}
if('speechSynthesis' in window){
 voices=window.speechSynthesis.getVoices();
 window.speechSynthesis.onvoiceschanged=()=>{voices=window.speechSynthesis.getVoices();};
}
function renderRecords(){
 const solved=numCleared(),r=state.totalAttempts?round(state.firstTry/state.totalAttempts*100):0;
 const incorrectIds=Object.entries(state.mistakes).sort((a,b)=>b[1]-a[1]).slice(0,12);
 const missed=incorrectIds.map(([id,count])=>{const q=ALL_PUZZLES.find(q=>q.id===id);return q?'<div class="mistake-row"><span class="mistake-badge">'+count+' 次</span><strong>'+E(q.title)+'</strong><small>'+E(byId(id.split('.').slice(0,2).pop())?.name||q.id)+'</small></div>':'';}).join('');
 ROOT.innerHTML='<div class="page"><div class="page-heading"><span class="eyebrow">LEARNING ANALYTICS</span><h1>探索档案</h1><p>记录解谜结果，不用简单的“认识了几个字母”冒充真正掌握。</p></div>'+
 '<div class="record-stats"><div><span>已破解</span><strong>'+solved+' <small>/16 关</small></strong><p>完成全部机关才能记为破解</p></div>'+
 '<div><span>累积星级</span><strong>'+totalStars()+' <small>/48 ★</small></strong><p>看首次作答与提示使用情况</p></div>'+
 '<div><span>首次判断正确率</span><strong>'+r+'<small>%</small></strong><p>正确首次解谜次数 / 全部判断次数</p></div></div>'+
 '<div class="record-columns"><section class="record-card"><div class="eyebrow">AREAS EXPLORED</div><h2>三座城堡的进度</h2>'+
 REALMS.map(realm=>'<button class="record-realm" data-action="realm" data-id="'+realm.id+'"><strong>'+realm.name+'</strong><span>'+realmProgress(realm.id)+'/5 关</span>'+
 progressBar(realmProgress(realm.id),5)+'</button>').join('')+'</section>'+
 '<section class="record-card"><div class="eyebrow">REVISIT</div><h2>需要再推理的题目</h2>'+
 (missed||'<div class="record-empty">暂时没有需要复习的谜题。解错后会自动记录在这里。</div>')+
 '<div class="record-footnote">这里展示做错过、且尚未在新一轮中一次答对的题目。返回对应关卡复练即可。</div></section></div>'+
 '<div class="record-settings"><div><div class="eyebrow">SETTINGS</div><h3>探索设置</h3></div>'+
 '<button class="toggle-setting" data-action="free">'+(state.freeExplore?'✓ 自由探索：开启':'□ 自由探索：关闭')+'</button>'+
 '<button class="toggle-setting" data-action="sound">'+(state.soundOff?'开启语音':'关闭语音')+'</button>'+
 '<button class="toggle-setting destructive" data-action="reset">清空 V3 学习记录</button></div>'+
 '<div class="site-note">统计数据仅存储在当前浏览器。旧版页面的数据不会被删除，但不同版本之间不自动混用关卡成绩。</div></div>';
}
function restoreOldMistake(id){return ALL_PUZZLES.find(q=>q.id===id);}
document.addEventListener('click',event=>{
 const el=event.target.closest('[data-action]');if(!el||el.disabled)return;
 const act=el.dataset.action,idx=Number(el.dataset.index);
 if(act==='goto')goto(el.dataset.page);
 else if(act==='realm')goto('realm',el.dataset.id);
 else if(act==='start')startLevel(el.dataset.id);
 else if(act==='master'){if(isUnlocked(MASTER))startLevel('master');else notify('先在每座城堡完成至少一关，才能开启总控密室');}
 else if(act==='single')takeSingle(idx);
 else if(act==='multi')takeMulti(idx);
 else if(act==='sequence')takeSequence(idx);
 else if(act==='remove-slot')removeSequence(idx);
 else if(act==='pair-left')pairLeft(idx);
 else if(act==='pair-right')pairRight(idx);
 else if(act==='check')verify();
 else if(act==='next')next();
 else if(act==='hint'){if(session&&!session.hint&&!session.solved){session.hint=true;session.hintsUsed++;state.hints++;persist();renderPuzzle();}}
 else if(act==='quit'){session=null;goto('map');}
 else if(act==='free'){state.freeExplore=!state.freeExplore;persist();if(screen==='records')renderRecords();else renderMap();notify(state.freeExplore?'自由探索已开启，所有关卡可进入':'已恢复顺序解锁');}
 else if(act==='lab-initial'){labInitial=el.dataset.value;renderLab();}
 else if(act==='lab-final'){labFinal=el.dataset.value;renderLab();}
 else if(act==='speak')speak(el.dataset.value);
 else if(act==='sound'){state.soundOff=!state.soundOff;persist();renderRecords();}
 else if(act==='reset'){
  if(window.confirm('将清空当前逻辑解谜版的星级、关卡和错题记录。确定吗？')){
   state=INITIAL_STATE();session=null;persist();renderRecords();notify('学习记录已清空');
  }
 }
});
goto('map');
