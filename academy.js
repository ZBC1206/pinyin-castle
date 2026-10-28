/* 未来文字探索基地 V4 — 课程、小游戏与本地学习档案 */
"use strict";
const KEY="future-literacy-base-v4";
const defaultState=()=>({version:4,completed:{},attempts:0,correct:0,failures:{},gameBest:{},freeExplore:false,soundOff:false,lastLesson:"v01",sessions:0});
function loadState(){try{const s=JSON.parse(localStorage.getItem(KEY)||"null");if(s&&s.version===4&&s.completed&&s.failures)return Object.assign(defaultState(),s);}catch(e){}return defaultState();}
let state=loadState(),page="home",baseId="vowels",lessonId="v01",run=null,voices=[];
const root=document.getElementById("app"),toastBox=document.getElementById("toast");
const dataBase=id=>BASES.find(b=>b.id===id);
const getLesson=id=>ALL_LESSONS.find(l=>l.id===id);
const getSport=id=>SPORTS.find(g=>g.id===id);
const safe=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const completed=id=>!!state.completed[id];
const doneCount=id=>dataBase(id).lessons.filter(l=>completed(l.id)).length;
const allDone=()=>Object.keys(state.completed).length;
function save(){try{localStorage.setItem(KEY,JSON.stringify(state));}catch(e){}updateNav();}
let toastT=0;function toast(t){toastBox.textContent=t;toastBox.classList.add("visible");clearTimeout(toastT);toastT=setTimeout(()=>toastBox.classList.remove("visible"),2200);}
function speak(word){if(state.soundOff){toast("语音已关闭，可在学习档案中重新开启");return;}if(!("speechSynthesis" in window)){toast("当前设备不支持文字转语音");return;}try{window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(word);u.lang="zh-CN";u.rate=.79;u.pitch=1;const v=voices.find(v=>v.lang==="zh-CN")||voices.find(v=>v.lang.startsWith("zh"));if(v)u.voice=v;window.speechSynthesis.speak(u);}catch(e){toast("设备语音暂不可用");}}
if("speechSynthesis" in window){voices=window.speechSynthesis.getVoices();window.speechSynthesis.onvoiceschanged=()=>voices=window.speechSynthesis.getVoices();}
function ribbon(t){return '<span class="eyebrow">'+safe(t)+'</span>';}
function progress(n,t){return '<div class="track"><div style="width:'+(t?n/t*100:0)+'%"></div></div>';}
function lockedLesson(l){if(state.freeExplore)return false;const b=dataBase(l.base);return l.index>0&&!completed(b.lessons[l.index-1].id);}
function scoreValue(record){return record?record.best:0;}
function updateNav(){
 document.querySelectorAll("[data-nav]").forEach(el=>{
  const a=el.dataset.nav;el.classList.toggle("active",a===page||(page==="base"&&a==="home")||(page==="lesson"&&a==="home")||(page==="quiz"&&a==="home")||(page==="finish"&&a==="home")||(page==="sport"&&a==="games"));
 });
 const count=document.getElementById("completed-count");if(count)count.textContent=allDone()+"/"+ALL_LESSONS.length;
}
function pageTo(p,id){
 if(p==="base"&&dataBase(id))baseId=id;
 if(p==="lesson"&&getLesson(id))lessonId=id;
 page=p;
 if(p==="home")home();
 else if(p==="base")basePage();
 else if(p==="lesson")lessonPage();
 else if(p==="games")gamesPage();
 else if(p==="records")recordsPage();
 else if(p==="quiz")quizPage();
 else if(p==="sport")sportPage();
 else if(p==="finish")finishPage();
 else home();
 updateNav();window.scrollTo({top:0,behavior:"auto"});
}
function sceneSVG(){
 return '<svg class="future-scene" viewBox="0 0 650 450" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">'+
 '<defs><linearGradient id="sky" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#b5edff" stop-opacity=".26"/><stop offset="1" stop-color="#4352af" stop-opacity=".16"/></linearGradient><linearGradient id="island" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#86f3e5"/><stop offset="1" stop-color="#4a98a9"/></linearGradient><linearGradient id="tower" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#aecaf7"/><stop offset="1" stop-color="#5366bb"/></linearGradient></defs>'+
 '<g stroke="#8fdbeb" opacity=".14"><path d="M0 390L340 195L650 370M0 300L340 105L650 280M0 210L340 15L650 190"/><path d="M90 445L460 225M200 450L560 235M0 445L350 225M120 100L600 390"/></g>'+
 '<path d="M73 282L299 151L545 291L319 425L73 282Z" fill="#122f53" stroke="#78d2e4" stroke-width="3"/>'+
 '<path d="M73 282L319 425V444L73 301V282Z" fill="#122d49"/><path d="M319 425L545 291V311L319 444V425Z" fill="#183c58"/>'+
 '<path d="M106 279L299 167L510 293L320 401L106 279Z" fill="url(#island)" opacity=".38"/>'+
 '<path d="M199 221L300 164L398 222L298 281L199 221Z" fill="#c6eafa" opacity=".7"/>'+
 '<path d="M199 221V314L298 372V281L199 221Z" fill="#426d9a"/><path d="M398 222V315L298 372V281L398 222Z" fill="#2f568f"/>'+
 '<path d="M225 196L300 152L372 195L299 237L225 196Z" fill="#e3f5ff"/>'+
 '<path d="M225 196V230L299 273V237L225 196Z" fill="#5674ad"/><path d="M372 195V231L299 273V237L372 195Z" fill="#3c5590"/>'+
 '<path d="M259 115L302 89L343 114L300 140L259 115Z" fill="#ddf0ff"/>'+
 '<path d="M259 115V196L300 219V140L259 115Z" fill="url(#tower)"/><path d="M343 114V197L300 219V140L343 114Z" fill="#425c99"/>'+
 '<path d="M299 58L335 79L299 102L263 81L299 58Z" fill="#8ceded"/><path d="M263 81V103L299 125V102L263 81Z" fill="#4cb2c7"/><path d="M335 79V101L299 125V102L335 79Z" fill="#2c8eb2"/>'+
 '<path d="M296 25L319 39V68L296 83L272 69V41L296 25Z" fill="#fbe6ac" stroke="#fff4cf" stroke-width="2"/>'+
 '<path d="M296 83V108" stroke="#bff7fc" stroke-width="3"/>'+
 '<path d="M117 258L170 227L220 258L169 289L117 258Z" fill="#a8d9ec"/><path d="M117 258V305L169 336V289L117 258Z" fill="#4d91b9"/><path d="M220 258V305L169 336V289L220 258Z" fill="#31658f"/>'+
 '<path d="M378 290L439 256L484 284L423 319L378 290Z" fill="#d1ccff"/><path d="M378 290V328L423 355V319L378 290Z" fill="#7776ae"/><path d="M484 284V322L423 355V319L484 284Z" fill="#535491"/>'+
 '<path d="M225 196L169 227M371 197L440 256M301 372L320 401" stroke="#c8f7f5" stroke-width="4" stroke-dasharray="4 10" opacity=".85"/>'+
 '<circle cx="169" cy="218" r="15" fill="#fce5a3" opacity=".85"/><circle cx="437" cy="247" r="13" fill="#c2c6ff" opacity=".9"/>'+
 '<g fill="#ddfaff" font-family="Arial" font-weight="bold"><text x="285" y="184" font-size="26">a</text><text x="157" y="278" font-size="19">字</text><text x="411" y="307" font-size="18">词</text></g>'+
 '<g fill="#d6faff"><circle cx="78" cy="132" r="3"/><circle cx="559" cy="102" r="4"/><circle cx="548" cy="208" r="2.5"/><circle cx="135" cy="78" r="2"/></g></svg>';
}
function home(){
 const cards=BASES.map((b,i)=>'<button class="base-card base-'+b.id+'" data-action="base" data-id="'+b.id+'">'+
 '<div class="base-top"><span>EXPLORATION '+b.no+'</span><span>'+doneCount(b.id)+' / '+b.lessons.length+' 节</span></div>'+
 '<div class="base-glyph">'+(i===0?'a<span>·</span>ü':i===1?'b<span>+</span>ao':'字<span>→</span>词')+'</div>'+
 '<h3>'+b.name+'</h3><p>'+b.description+'</p>'+
 progress(doneCount(b.id),b.lessons.length)+
 '<div class="base-foot"><span>进入探索区域</span><b>↗</b></div></button>').join("");
 const feat=[["01","认识韵母","发现 a、o、e 等发音与结构"],["02","独立拼读","让声母和韵母组合成完整音节"],["03","识别汉字","把声音对应到字形和意义"],["04","读词读句","逐步减少拼音提示，读懂文字"]];
 root.innerHTML='<div class="page"><section class="hero"><div class="hero-content">'+ribbon("FUTURE LANGUAGE EXPEDITION / 2026")+
 '<h1>未来文字<br><em>探索基地<span>.</span></em></h1><p class="hero-claim">从一个韵母，走进整个文字世界。</p>'+
 '<p class="hero-detail">观察字母、探索拼读、认识汉字、理解词句。科学思维负责发现规律，体育小游戏负责练习，真正的目标是<strong>独立识字与阅读</strong>。</p>'+
 '<div class="hero-actions"><button class="primary-btn" data-action="lesson" data-id="'+state.lastLesson+'">继续学习 <span>↗</span></button>'+
 '<button class="glass-btn" data-action="games">进入运动实验场 ↗</button></div>'+
 '<div class="hero-small"><span>3 个学习基地</span><i></i><span>'+ALL_LESSONS.length+' 节课程</span><i></i><span>'+ALL_QUESTIONS.length+' 道基础训练</span></div></div>'+
 '<div class="hero-art">'+sceneSVG()+'<span class="floating-note n1">VOWEL / 01</span><span class="floating-note n2">BUILD THE SOUND</span><span class="floating-note n3">READ THE WORLD</span></div></section>'+
 '<div class="heading"><div>'+ribbon("01 / LEARNING UNIVERSE")+'<h2>三个基地，一条学习主线</h2><p>韵母是起点；拼读与识字才是要逐步建立的能力。</p></div><span class="heading-side">LEVEL 01—22</span></div>'+
 '<div class="base-grid">'+cards+'</div>'+
 '<div class="heading"><div>'+ribbon("02 / LEARNING SCIENCE")+'<h2>让知识真的连接起来</h2><p>每一节采用“观察 → 组合 → 验证 → 应用”的流程。</p></div></div>'+
 '<div class="path-grid">'+feat.map(f=>'<div class="path-step"><span>'+f[0]+'</span><strong>'+f[1]+'</strong><p>'+f[2]+'</p></div>').join("")+'</div>'+
 '<section class="games-banner"><div><span class="eyebrow">SPORTS LAB / LEARN THROUGH PLAY</span><h2>运动实验场</h2><p>足球练拼读，篮球练声调，保龄球练汉字与词语。答对才能进球，不靠运气。</p><button class="secondary-btn" data-action="games">选择体育挑战 ↗</button></div><div class="sport-icons"><span>⚽</span><span>🏀</span><span>🎳</span></div></section>'+
 '<p class="footer-note">发音按钮采用设备中文语音合成朗读示例字词，不等于孤立声母、韵母的规范示范；建议孩子跟随老师或家长实际朗读。</p></div>';
}
function basePage(){
 const b=dataBase(baseId);if(!b)return pageTo("home");
 const count=doneCount(baseId);
 const cards=b.lessons.map((l,i)=>{
  const blocked=lockedLesson(l),rec=state.completed[l.id];
  return '<button class="lesson-row '+(blocked?'blocked':rec?'done':'open')+'" data-action="lesson" data-id="'+l.id+'" '+(blocked?'disabled':'')+'>'+
  '<span class="lesson-no">'+String(i+1).padStart(2,"0")+'</span>'+
  '<span class="lesson-main"><span class="lesson-kind">'+safe(l.subtitle)+'</span><strong>'+safe(l.title)+'</strong><small>'+safe(l.goal)+'</small></span>'+
  '<span class="lesson-side">'+(rec?'<strong>★ '+rec.stars+'</strong><small>最佳 '+rec.best+' 分</small>':blocked?'<small>尚未解锁</small>':'<strong>开始探索 ↗</strong>')+'</span></button>';
 }).join("");
 root.innerHTML='<div class="page"><div class="crumb"><button data-action="home">学习地图</button><span>/</span>'+safe(b.name)+'</div>'+
 '<section class="base-header base-'+baseId+'"><div>'+ribbon(b.code)+'<h1>'+safe(b.name)+'</h1><p>'+safe(b.description)+'</p>'+
 '<div class="base-stats"><span>已完成 '+count+' / '+b.lessons.length+' 节</span><span>循序渐进 · 每节 4 题</span></div></div>'+
 '<div class="big-symbol">'+(baseId==="vowels"?"a o e":baseId==="syllables"?"b + a":"字 · 词")+'</div></section>'+
 '<div class="lesson-layout"><div><div class="heading"><div>'+ribbon("MISSION ROADMAP")+'<h2>学习关卡</h2><p>每一节先认识知识，再进入练习；完成后解锁下一节。</p></div></div><div class="lesson-list">'+cards+'</div></div>'+
 '<aside class="info-card">'+ribbon("EXPEDITION NOTES")+'<h3>本基地要完成什么？</h3><p>'+safe(b.description)+'</p>'+
 '<div class="subline"></div><strong>科学学习四步</strong><ol><li>观察例子与线索</li><li>猜测背后规律</li><li>通过练习验证</li><li>把知识应用到文字</li></ol>'+
 '<button class="small-link" data-action="games">去体育实验场练习 ↗</button></aside></div></div>';
}
function lessonPage(){
 const l=getLesson(lessonId);if(!l)return pageTo("home");
 if(lockedLesson(l)){toast("完成前一节再来探索，也可以在学习档案开启自由探索");return pageTo("base",l.base);}
 const b=dataBase(l.base),rec=state.completed[l.id];
 const tiles=l.units.map(u=>'<article class="unit"><div class="unit-notation">'+safe(u.symbol)+'</div><div class="unit-hanzi">'+safe(u.hanzi)+'</div><div class="unit-pinyin">'+safe(u.pinyin)+'</div><p>'+safe(u.note)+'</p>'+
 '<button data-action="speak" data-voice="'+safe(u.hanzi)+'">▶ 听例字/词</button></article>').join("");
 root.innerHTML='<div class="page"><div class="crumb"><button data-action="home">学习地图</button><span>/</span><button data-action="base" data-id="'+b.id+'">'+safe(b.name)+'</button><span>/</span>'+safe(l.title)+'</div>'+
 '<div class="lesson-hero"><div><span class="eyebrow">LESSON '+String(ALL_LESSONS.indexOf(l)+1).padStart(2,"0")+' / '+b.code+'</span>'+
 '<h1>'+safe(l.title)+'</h1><p>'+safe(l.goal)+'</p>'+
 '<div class="lesson-detail"><span>观察学习</span><i>→</i><span>动手验证</span><i>→</i><span>获得解释</span></div></div>'+
 '<div class="lesson-hero-right"><span>4</span><small>INTERACTIVE QUESTIONS</small></div></div>'+
 '<div class="heading"><div>'+ribbon("OBSERVE / FIND THE PATTERN")+'<h2>先观察，再推理</h2><p>点击例字可以听读音。观察音节、文字和规律的联系。</p></div></div>'+
 '<section class="unit-grid">'+tiles+'</section>'+
 '<div class="insight-card"><span>◈</span><div><strong>本课的重要规律</strong><p>'+safe(l.knowledge)+'</p></div></div>'+
 '<div class="start-lesson"><div><h3>'+(rec?'挑战过这一关，还可以再巩固':'准备好开始验证了吗？')+'</h3><p>四道交互题，需要主动判断、组合和辨认。答错可以重试，并会记录薄弱知识点。</p></div>'+
 '<button class="primary-btn" data-action="start-lesson" data-id="'+l.id+'">'+(rec?'重新闯关':'开始 4 题练习')+' ↗</button></div></div>';
}
function initQuestion(){
 if(!run)return;
 run.selected=[];run.tried=0;run.hint=false;run.solved=false;run.feedback="";run.gained=0;run.pending=false;
}
function startLesson(id){
 const l=getLesson(id);if(!l)return;
 if(lockedLesson(l)){toast("当前课程尚未解锁");return;}
 state.lastLesson=id;save();
 run={mode:"lesson",id,questions:l.questions,index:0,score:0,first:0,hints:0,misses:0};
 initQuestion();state.sessions++;pageTo("quiz");
}
function startGame(id){
 const g=getSport(id);if(!g)return;
 run={mode:"sport",id,questions:g.prompts.map((q,i)=>({...q,id:"game-"+id+"-"+(i+1)})),index:0,score:0,first:0,hints:0,misses:0};
 initQuestion();state.sessions++;pageTo("sport");
}
function currentQ(){return run?.questions[run.index];}
function currentLabel(){return run?.mode==="lesson"?getLesson(run.id).title:getSport(run.id).name;}
function choicesHtml(q){
 if(q.type==="choice"){
  return '<div class="options">'+q.options.map((o,i)=>{
   const right=run.solved&&o===q.answer;
   return '<button class="option '+(right?'correct':'')+'" data-action="choice" data-index="'+i+'" '+(run.solved?'disabled':'')+'><span>'+String.fromCharCode(65+i)+'</span><strong>'+safe(o)+'</strong><i>↗</i></button>';
  }).join("")+'</div>';
 }
 if(q.type==="multi"){
  return '<div class="options">'+q.options.map((o,i)=>{
   const checked=run.selected.includes(i),right=run.solved&&q.answer.includes(o);
   return '<button class="option '+(checked?'selected ':'')+(right?'correct':'')+'" data-action="multi" data-index="'+i+'" '+(run.solved?'disabled':'')+'><span>'+(checked?'✓':String.fromCharCode(65+i))+'</span><strong>'+safe(o)+'</strong></button>';
  }).join("")+'</div><button class="verify-btn" data-action="verify" '+(run.selected.length===0||run.solved?'disabled':'')+'>验证选择 ↗</button>';
 }
 if(q.type==="order"){
  const p=run.selected.map(i=>q.pieces[i]);
  const blanks=q.answer.map((_,i)=>'<button class="slot '+(p[i]!==undefined?'filled':'')+'" data-action="undo" data-index="'+i+'" '+(run.solved||i>=p.length?'disabled':'')+'>'+(p[i]!==undefined?safe(p[i]):'?')+'</button>').join('<span class="slot-arrow">→</span>');
  return '<div class="slots">'+blanks+'</div><p class="order-instruction">按正确顺序点击下方卡片。点上方已选的卡片可以撤回。</p>'+
  '<div class="options">'+q.pieces.map((o,i)=>'<button class="option '+(run.selected.includes(i)?'used':'')+'" data-action="piece" data-index="'+i+'" '+(run.solved||run.selected.includes(i)||run.selected.length>=q.answer.length?'disabled':'')+'><span>'+String.fromCharCode(65+i)+'</span><strong>'+safe(o)+'</strong></button>').join("")+'</div>'+
  '<button class="verify-btn" data-action="verify" '+(run.selected.length!==q.answer.length||run.solved?'disabled':'')+'>验证组合 ↗</button>';
 }
 return "";
}
function explanationHtml(q){
 if(run.solved)return '<div class="explain success"><div class="explain-top"><strong>✓ 验证成功</strong><span>+'+run.gained+' 分</span></div><p>'+safe(q.why)+'</p>'+
 '<button class="primary-btn next-btn" data-action="next">'+(run.index===run.questions.length-1?'查看学习报告':'进入下一题')+' ↗</button></div>';
 if(run.feedback)return '<div class="explain error"><strong>还不符合条件</strong><p>'+safe(run.feedback)+'</p></div>';
 return '';
}
function questionBody(){
 const q=currentQ(),lesson=run.mode==="lesson"?getLesson(run.id):null;
 return '<div class="quiz-title">'+ribbon(q.skill||"LEARNING CHECK")+'<h2>'+safe(q.prompt)+'</h2>'+
 '<div class="display-tile">'+safe(q.display||'按规律判断')+'</div></div>'+
 (q.voice?'<button class="speak-bar" data-action="speak" data-voice="'+safe(q.voice)+'">▶ 听示例汉字发音</button>':'')+
 '<div class="quiz-controls">'+choicesHtml(q)+'</div>'+
 (run.hint?'<div class="hint-card">提示：'+safe(lesson?.knowledge||"结合拼音的读音、字形和意义判断。")+'</div>':'')+
 explanationHtml(q);
}
function quizPage(){
 if(!run||run.mode!=="lesson")return pageTo("home");
 const l=getLesson(run.id),b=dataBase(l.base),q=currentQ();
 root.innerHTML='<div class="page"><div class="crumb"><button data-action="base" data-id="'+b.id+'">'+safe(b.name)+'</button><span>/</span>'+safe(l.title)+'</div>'+
 '<div class="exercise-heading"><div>'+ribbon("TEST / OBSERVE · COMBINE · VERIFY")+'<h1>'+safe(l.title)+'</h1></div><div class="exercise-count">第 '+(run.index+1)+' / '+run.questions.length+' 题</div></div>'+
 progress(run.index,run.questions.length)+
 '<div class="exercise-layout"><div class="exercise-main">'+questionBody()+'</div><aside class="exercise-aside">'+ribbon("RESEARCH NOTE")+
 '<h3>不要直接猜。</h3><p>观察题目条件，再根据字形、拼写、读音或字义排除不合理选项。</p>'+
 '<div class="question-box"><strong>本课知识</strong><p>'+safe(l.knowledge)+'</p></div>'+
 '<button class="hint-button" data-action="hint" '+(run.hint||run.solved?'disabled':'')+'>'+(run.hint?'✓ 已查看提示':'⌕ 查看本题提示')+'</button>'+
 '<button class="leave-button" data-action="leave">退出练习</button></aside></div></div>';
}
function miss(reason){
 if(!run||run.solved)return;
 run.tried++;run.misses++;state.attempts++;
 const q=currentQ();state.failures[q.id]=(state.failures[q.id]||0)+1;save();
 run.feedback=reason;rerender();
}
function solved(){
 if(!run||run.solved)return;
 run.solved=true;run.feedback="";
 state.attempts++;state.correct++;
 if(run.tried===0){run.first++;delete state.failures[currentQ().id];}
 run.gained=Math.max(40,100-run.tried*20-(run.hint?10:0));
 run.score+=run.gained;
 save();rerender();
}
function choose(i){
 if(!run||run.solved)return;
 const q=currentQ(),answer=q.options[i];
 if(answer===q.answer)solved();
 else miss('“'+answer+'”不是正确答案。检查题目中的拼音、声调或汉字含义，再试一次。');
}
function multi(i){if(!run||run.solved)return;const arr=run.selected,at=arr.indexOf(i);if(at<0)arr.push(i);else arr.splice(at,1);run.feedback='';rerender();}
function piece(i){if(!run||run.solved)return;const q=currentQ();if(run.selected.includes(i)||run.selected.length>=q.answer.length)return;run.selected.push(i);run.feedback='';rerender();}
function undo(i){if(!run||run.solved)return;run.selected.splice(i,1);run.feedback='';rerender();}
function verify(){
 if(!run||run.solved)return;
 const q=currentQ();
 if(q.type==='multi'){
  const got=run.selected.map(i=>q.options[i]);
  if(got.length===q.answer.length&&got.every(x=>q.answer.includes(x)))solved();
  else miss("有选项被漏掉了，或者选入了不符合规律的项目。请重新核对每个选项。");
 }else if(q.type==='order'){
  const got=run.selected.map(i=>q.pieces[i]);
  if(got.length===q.answer.length&&got.every((x,i)=>x===q.answer[i]))solved();
  else miss("顺序没有匹配目标。按照字母拼读或组成词句的正确顺序重新排列。");
 }
}
function next(){
 if(!run||!run.solved)return;
 if(run.index<run.questions.length-1){run.index++;initQuestion();rerender();window.scrollTo({top:0,behavior:"auto"});return;}
 const max=run.questions.length*100,stars=run.score>=max*.9?3:run.score>=max*.7?2:1;
 if(run.mode==="lesson"){
  const old=state.completed[run.id],record={best:Math.max(old?.best||0,run.score),stars:Math.max(old?.stars||0,stars),plays:(old?.plays||0)+1};
  state.completed[run.id]=record;
 }else{
  const old=state.gameBest[run.id]||0;state.gameBest[run.id]=Math.max(old,run.score);
 }
 run.result={score:run.score,stars,max};save();pageTo("finish");
}
function gamesPage(){
 root.innerHTML='<div class="page"><div class="page-title">'+ribbon("SPORTS & LANGUAGE PRACTICE")+'<h1>运动实验场</h1>'+
 '<p>先思考拼音和汉字，再出手。每一次成功射门、投篮或击瓶，都是一次知识验证。</p></div>'+
 '<div class="sports-cards">'+SPORTS.map(g=>'<button class="sport-card sport-'+g.id+'" data-action="start-game" data-id="'+g.id+'">'+
 '<div class="sport-card-top">'+safe(g.tag)+'<span>BEST '+(state.gameBest[g.id]||'—')+'</span></div>'+
 '<div class="sport-glyph">'+(g.id==='football'?'⚽':g.id==='basketball'?'🏀':'🎳')+'</div>'+
 '<h2>'+safe(g.name)+'</h2><p>'+safe(g.description)+'</p><div class="sport-start">开始 6 轮挑战 <span>↗</span></div></button>').join("")+'</div>'+
 '<div class="work-principle">'+ribbon("HOW THE GAME WORKS")+'<h2>不是随机点击，而是完成一次真实学习判断。</h2><p>足球：识别完整音节。篮球：选择正确声调。保龄球：认汉字、组词和理解句子。答对后才会出现进球、入篮或击倒球瓶动画。</p></div></div>';
}
function sportsSVG(id,animate,good){
 const cls=(animate?(good?' play good':' play miss'):'');
 if(id==='football')return '<div class="arena football-arena'+cls+'"><div class="field-lines"><div class="goal-frame"><div class="goal-net"></div></div><div class="soccer-ball">⚽</div></div><span class="arena-label">SYLLABLE / SHOT 01</span></div>';
 if(id==='basketball')return '<div class="arena basket-arena'+cls+'"><div class="backboard"></div><div class="hoop-rim"></div><div class="hoop-net"></div><div class="basket-ball">🏀</div><span class="arena-label">TONE / SHOT 02</span></div>';
 return '<div class="arena bowl-arena'+cls+'"><div class="lane"></div><div class="pins">'+Array.from({length:6},(_,i)=>'<span class="pin p'+i+'">♟</span>').join("")+'</div><div class="bowl-ball">●</div><span class="arena-label">CHARACTER / STRIKE 03</span></div>';
}
function sportPage(){
 if(!run||run.mode!=="sport")return pageTo("games");
 const game=getSport(run.id),q=currentQ();
 root.innerHTML='<div class="page"><div class="crumb"><button data-action="games">运动实验场</button><span>/</span>'+safe(game.name)+'</div>'+
 '<div class="sport-heading">'+ribbon(game.tag)+'<h1>'+safe(game.name)+'</h1><p>'+safe(game.description)+'</p></div>'+
 '<div class="sports-play-layout"><section class="arena-main">'+sportsSVG(run.id,run.solved||run.tried>0,run.solved)+
 '<div class="game-status"><span>ROUND '+String(run.index+1).padStart(2,'0')+' / '+String(run.questions.length).padStart(2,'0')+'</span><span>当前分数：'+run.score+'</span></div>'+
 '<div class="sport-question">'+ribbon('MAKE A DECISION')+'<h2>'+safe(q.prompt)+'</h2>'+
 '<div class="display-tile">'+safe(q.display)+'</div>'+
 '<div class="options">'+q.options.map((o,i)=>'<button class="option '+(run.solved&&q.answer===o?'correct':'')+'" data-action="choice" data-index="'+i+'" '+(run.solved?'disabled':'')+'><span>'+String.fromCharCode(65+i)+'</span><strong>'+safe(o)+'</strong></button>').join("")+'</div>'+
 explanationHtml(q)+'</div></section>'+
 '<aside class="exercise-aside">'+ribbon('SPORTS RULE')+'<h3>答对才能得分</h3><p>'+safe(game.description)+'</p>'+
 '<p>答对会触发运动动画。答错会出现偏离轨迹的动画，并记录需要复习的题目。</p>'+
 '<button class="leave-button" data-action="leave-game">返回运动场</button></aside></div></div>';
}
function finishPage(){
 if(!run||!run.result)return pageTo("home");
 const isSport=run.mode==="sport",lesson=isSport?null:getLesson(run.id),game=isSport?getSport(run.id):null;
 const nextLesson=lesson?dataBase(lesson.base).lessons[lesson.index+1]:null;
 const r=run.result;
 root.innerHTML='<div class="page"><section class="finish"><div class="finish-icon">✦</div>'+
 ribbon('LEARNING MISSION COMPLETE')+'<h1>'+(isSport?'本场挑战完成！':'本课验证完成！')+'</h1>'+
 '<p class="finish-name">'+safe(isSport?game.name:lesson.title)+'</p>'+
 '<div class="finish-score">'+r.score+'<small> / '+r.max+' 分</small></div>'+
 '<div class="finish-stars">'+('★'.repeat(r.stars))+'<span>'+('☆'.repeat(3-r.stars))+'</span></div>'+
 '<div class="finish-detail"><div><strong>'+run.first+' / '+run.questions.length+'</strong><small>一次答对</small></div>'+
 '<div><strong>'+run.misses+'</strong><small>需要改正</small></div><div><strong>'+run.hints+'</strong><small>使用提示</small></div></div>'+
 '<div class="finish-advice"><strong>学会解释，比碰巧猜对更重要。</strong><p>'+(isSport?'体育挑战结束后，可以返回课程基地巩固对应知识。':'建议大声读出本课的示例词，再尝试不看拼音认出其中的汉字。')+'</p></div>'+
 '<div class="finish-buttons">'+(nextLesson?'<button class="primary-btn" data-action="lesson" data-id="'+nextLesson.id+'">下一节课程 ↗</button>':'')+
 '<button class="primary-btn" data-action="'+(isSport?'start-game':'start-lesson')+'" data-id="'+run.id+'">再挑战一次 ↗</button>'+
 '<button class="glass-btn" data-action="'+(isSport?'games':'base')+'" '+(!isSport?'data-id="'+lesson.base+'"':'')+'>返回'+(isSport?'体育场':'基地')+'</button></div></section></div>';
}
function recordsPage(){
 const total=ALL_LESSONS.length,mastery=state.attempts?Math.round(state.correct/state.attempts*100):0;
 const weak=Object.entries(state.failures).sort((a,b)=>b[1]-a[1]).slice(0,12);
 root.innerHTML='<div class="page"><div class="page-title">'+ribbon('LEARNING PROFILE')+'<h1>学习档案</h1><p>按照真实学习任务记录进度：韵母、拼读、汉字、词句，以及需要再次练习的地方。</p></div>'+
 '<div class="dashboard"><div><small>课程完成</small><strong>'+allDone()+' <em>/ '+total+'</em></strong><p>每节 4 题全部通过才算完成</p></div>'+
 '<div><small>答题正确率</small><strong>'+mastery+'<em>%</em></strong><p>全部判定尝试中正确的比例</p></div>'+
 '<div><small>薄弱知识点</small><strong>'+weak.length+'</strong><p>做错过且尚未一遍答对的题目</p></div></div>'+
 '<div class="record-grid"><section class="record-panel">'+ribbon('THE THREE BASES')+'<h2>三个基地的进度</h2>'+
 BASES.map(b=>'<button class="record-base" data-action="base" data-id="'+b.id+'"><div><strong>'+safe(b.name)+'</strong><small>'+doneCount(b.id)+' / '+b.lessons.length+' 节</small></div>'+progress(doneCount(b.id),b.lessons.length)+'</button>').join("")+'</section>'+
 '<section class="record-panel">'+ribbon('REVIEW / WHAT TO TRY AGAIN')+'<h2>需要再练的题目</h2>'+
 (weak.length?weak.map(([id,n])=>{const q=ALL_QUESTIONS.find(x=>x.id===id);const g=SPORTS.find(s=>s.prompts.some((_,i)=>id==='game-'+s.id+'-'+(i+1)));const idx=g?.prompts.findIndex((_,i)=>id==='game-'+g.id+'-'+(i+1))??-1;const title=q?.prompt||(idx>=0?g.prompts[idx].prompt:"复习题");return '<div class="weak-row"><b>'+n+' 次</b><span>'+safe(title)+'</span></div>';}).join(""):'<p class="empty">没有待复习题目。继续学习时，答错的知识点会收集在这里。</p>')+
 '<p class="record-foot">回到相关课程重新练习，并在新一次挑战中一次答对，可移出待复习列表。</p></section></div>'+
 '<div class="settings"><div>'+ribbon("PREFERENCES")+'<h3>学习设置</h3></div>'+
 '<button data-action="free">'+(state.freeExplore?'✓ 自由探索已开启':'□ 自由探索已关闭')+'</button>'+
 '<button data-action="sound">'+(state.soundOff?'打开示例字朗读':'关闭示例字朗读')+'</button>'+
 '<button class="destructive" data-action="reset">清空 V4 学习记录</button></div>'+
 '<p class="footer-note">学习记录仅保存在本设备当前浏览器内；清除网站数据后可能丢失。旧版逻辑迷宫的成绩仍单独存储，不会被这个版本覆盖。</p></div>';
}
function rerender(){if(page==="quiz")quizPage();else if(page==="sport")sportPage();}
function toggleFree(){state.freeExplore=!state.freeExplore;save();if(page==="records")recordsPage();else if(page==="base")basePage();else home();toast(state.freeExplore?"已开启自由探索，可自由选择课程":"已恢复顺序学习模式");}
document.addEventListener("click",e=>{
 const el=e.target.closest("[data-action]");if(!el||el.disabled)return;
 const a=el.dataset.action,id=el.dataset.id,i=Number(el.dataset.index);
 if(a==="home")pageTo("home");
 else if(a==="base"){if(run)run=null;pageTo("base",id);}
 else if(a==="lesson"){if(run)run=null;pageTo("lesson",id);}
 else if(a==="games"){run=null;pageTo("games");}
 else if(a==="records"){run=null;pageTo("records");}
 else if(a==="start-lesson")startLesson(id);
 else if(a==="start-game")startGame(id);
 else if(a==="choice")choose(i);
 else if(a==="multi")multi(i);
 else if(a==="piece")piece(i);
 else if(a==="undo")undo(i);
 else if(a==="verify")verify();
 else if(a==="next")next();
 else if(a==="hint"){if(run&&!run.solved&&!run.hint){run.hint=true;run.hints++;rerender();}}
 else if(a==="leave"){const l=getLesson(run.id);run=null;pageTo("lesson",l.id);}
 else if(a==="leave-game"){run=null;pageTo("games");}
 else if(a==="speak")speak(el.dataset.voice);
 else if(a==="free")toggleFree();
 else if(a==="sound"){state.soundOff=!state.soundOff;save();recordsPage();}
 else if(a==="reset"){
  if(confirm("清空新版《未来文字探索基地》全部课程成绩、错题和游戏纪录？此操作无法恢复。")){
   state=defaultState();run=null;save();recordsPage();toast("学习记录已清空");
  }
 }
});
pageTo("home");
