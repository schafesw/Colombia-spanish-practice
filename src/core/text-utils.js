export function spanishStressHint(text){
  const clean=String(text||"").replace(/[¿?¡!.,;:]+/g,"").trim();
  const words=clean.split(/\s+/).filter(Boolean).slice(0,14);
  return words.map(raw=>{
    const w=raw.toLowerCase();
    if(w.length<=2)return w;
    const vowels=[...w.matchAll(/[aeiouáéíóúü]/gi)];
    if(!vowels.length)return w;
    const acc=w.search(/[áéíóú]/i);
    if(acc>=0)return w.slice(0,acc)+w[acc].toUpperCase()+w.slice(acc+1);
    const endsVowelOrNS=/[aeiousn]$/i.test(w);
    const targetV=vowels[Math.max(0,endsVowelOrNS?vowels.length-2:vowels.length-1)];
    return w.slice(0,targetV.index)+targetV[0].toUpperCase()+w.slice(targetV.index+1);
  }).join(" · ");
}
export function normalizeDictation(text,stripAccents){
  let s=String(text||"").toLowerCase().trim().replace(/[¿?¡!.,;:…]+/g,"").replace(/\s+/g," ");
  return stripAccents?s.normalize("NFD").replace(/n\u0303/g,"ñ").replace(/[\u0300-\u036f]/g,""):s;
}
export function normalizeQuizText(text){return String(text||"").toLowerCase().normalize("NFD").replace(/n\u0303/g,"ñ").replace(/[\u0300-\u036f]/g,"").replace(/[’‘]/g,"'").replace(/\bit's\b/g,"it is").replace(/\bi'm\b/g,"i am").replace(/\b(you|we|they)'re\b/g,"$1 are").replace(/[¿?¡!.,;:…]+/g,"").replace(/\s+/g," ").trim();}
/* Audit prompts keep accents so "si" and "sí" are not treated as the same
   Spanish word. Answer cleanup ignores parenthetical teaching notes when it
   compares duplicate records. */
export function normalizeQuizPrompt(text){return String(text||"").toLowerCase().replace(/[¿?¡!.,;:…]+/g,"").replace(/\s+/g," ").trim();}
export function normalizeQuizAnswer(text){return String(text||"").toLowerCase().replace(/\([^)]*\)/g,"").replace(/[¿?¡!.,;:…]+/g,"").replace(/\s+/g," ").trim();}
/* Treat a plain vocabulary translation and an authored `meaning` question
   with the same Spanish/English pair as one learning item. Keep other kinds
   separate: a reply, tense check, listening item, or pronoun drill can share
   a prompt while testing a different skill. */
export function quizItemKey(q){
  const family=q.kind==="meaning"||!q.kind?"meaning":q.kind;
  return normalizeQuizText(`${family}|${q.es}|${q.answer}`);
}
export function escapeVocabHtml(value){return String(value||"").replace(/[&<>\"]/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'\"':"&quot;"}[ch]||ch));}
export function scrollAppTop(){
  const s=document.querySelector(".scroll");
  if(s)s.scrollTop=0;
  window.scrollTo(0,0);
}
export function lpEl(cls,html){const d=document.createElement("div");d.className=cls;if(html!==undefined)d.innerHTML=html;return d;}
export function localDayKey(date=new Date()){
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`;
}
/**
 * Apply responsive length classes to a quiz prompt and option grid so long
 * items fit inside a single viewport without vertical scrolling.
 */
export function applyQuizFitClasses(promptEl,optsEl,promptText,optTexts){
  if(promptEl){
    const len=String(promptText||"").trim().length;
    promptEl.classList.toggle("qc-med",len>=24&&len<50);
    promptEl.classList.toggle("qc-long",len>=50&&len<82);
    promptEl.classList.toggle("qc-xl",len>=82);
  }
  if(optsEl&&Array.isArray(optTexts)){
    const lens=optTexts.map(t=>String(t||"").trim().length);
    const maxLen=lens.length?Math.max(...lens):0;
    const totalLen=lens.reduce((a,b)=>a+b,0);
    optsEl.classList.toggle("opts-stack",maxLen>40||totalLen>120);
    optsEl.classList.toggle("opts-dense",maxLen>72||totalLen>205);
  }
}
let appToastTimer=null;
export function showAppToast(message,tone="info"){
  if(typeof document==="undefined"||!document.body)return;
  let el=document.getElementById("app-status-toast");
  if(!el){
    el=document.createElement("div");
    el.id="app-status-toast";
    el.setAttribute("role","status");
    el.setAttribute("aria-live","polite");
    document.body.appendChild(el);
  }
  el.className=`app-status-toast ${tone}`;
  el.textContent=String(message||"");
  el.hidden=false;
  clearTimeout(appToastTimer);
  appToastTimer=setTimeout(()=>{el.hidden=true;},3200);
}
