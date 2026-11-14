import {
  VC, VOCAB_EXAMPLES, SPECIAL_SOUNDS, CONVERSATIONS, TONGUE_TWISTERS,
  PRONUNCIATION_TIPS, PHONETIC_WARMUP, ENGLISH_INTERFERENCE, MINIMAL_PAIRS,
  SPANISH_THINKING_PROMPTS, SPEAKING_GUIDE, LESSON_META, LESSON_CONTENT, FRASES,
  PICTURE_MATCH_BANK, GRINGO_TRAPS, NATURAL_EAR_CLIPS, VISUAL_GUIDES,
  VERB_VERSATILITY_ENGINE, COLOMBIAN_STORIES, COLOMBIA_CHATS, ROLEPLAY_IMAGES,
  CONVERSATION_MISSIONS, READINGS,
} from "../../data/index.js";
import { LESSONS } from "../features/lessons-meta.js";
import { normalizeQuizText } from "./text-utils.js";
import { PHRASE_DIALOGUES, CONVERSATION_QUIZ, FILL_BLANK_QUIZ, aQ } from "./quiz-bank.js";

export function runDataValidator(){
  const issues=[];
  try{
    const seen=new Set();
    VC.forEach(c=>{
      if(seen.has(c.id))issues.push("Duplicate category id: "+c.id);
      seen.add(c.id);
      if(c.items&&typeof VOCAB_EXAMPLES!=="undefined"&&VOCAB_EXAMPLES[c.id]&&VOCAB_EXAMPLES[c.id].length!==c.items.length)
        issues.push('Examples misaligned in "'+c.id+'": '+c.items.length+' words vs '+VOCAB_EXAMPLES[c.id].length+' examples');
    });
    LESSONS.forEach(l=>{
      if(!VC.some(c=>c.id===l.vocab))issues.push('Lesson "'+l.id+'": vocab "'+l.vocab+'" does not exist');
      if(!PHRASE_DIALOGUES.some(d=>d.title===l.dialogue))issues.push('Lesson "'+l.id+'": dialogue "'+l.dialogue+'" does not exist');
      if(l.quizCat!=="all"&&!aQ.some(q=>q.cat===l.quizCat))issues.push('Lesson "'+l.id+'": quiz category "'+l.quizCat+'" is empty');
      if(typeof LESSON_CONTENT!=="undefined"&&!LESSON_CONTENT[l.id])issues.push('Lesson "'+l.id+'": no LESSON_CONTENT entry');
    });
    if(typeof LESSON_CONTENT!=="undefined")Object.entries(LESSON_CONTENT).forEach(([id,c])=>{
      if(!c||!c.goal||!c.goal.es||!c.goal.en)issues.push('Lesson content "'+id+'": missing bilingual goal');
      if(!Array.isArray(c&&c.words)||c.words.length<3)issues.push('Lesson content "'+id+'": needs at least three key words');
      if(!Array.isArray(c&&c.phrases)||c.phrases.length<3)issues.push('Lesson content "'+id+'": needs at least three speaking phrases');
      (c&&c.words||[]).forEach((w,i)=>{if(!w.es||!w.en)issues.push('Lesson content "'+id+'" word '+(i+1)+' missing Spanish or English');});
      (c&&c.phrases||[]).forEach((p,i)=>{if(!p.es||!p.en)issues.push('Lesson content "'+id+'" phrase '+(i+1)+' missing Spanish or English');});
    });
    CONVERSATION_MISSIONS.forEach(m=>{if(!m.id||!m.scenario||!m.prompt||!Array.isArray(m.models)||m.models.length<2)issues.push('Mission "'+(m.id||"?")+'": missing scenario, prompt, or model answers');});
    SPECIAL_SOUNDS.forEach(s=>{if(!s.id||!s.label||!s.tip||!Array.isArray(s.examples)||!s.examples.length)issues.push('Special sound "'+(s.id||"?")+ '": incomplete examples');});
    READINGS.forEach(r=>{if(!r.id||!r.title||!Array.isArray(r.lines)||r.lines.length<3)issues.push('Reading "'+(r.id||"?")+ '": needs at least three lines');r.lines&&r.lines.forEach((line,i)=>{if(!line.es||!line.en||!line.tts)issues.push('Reading "'+r.id+'" line '+(i+1)+' missing Spanish, English, or tts');});});
    CONVERSATIONS.forEach(c=>{c.lines.forEach(L=>{if(!L.tts)issues.push('Conversation "'+c.title+'" ('+c.tense+'): line missing tts');});(c.alternates||[]).forEach((L,i)=>{if(!L.es||!L.en||!L.tts)issues.push('Conversation "'+c.title+'" alternate '+(i+1)+' missing Spanish, English, or tts');});});
    if(typeof TONGUE_TWISTERS!=="undefined")TONGUE_TWISTERS.forEach(t=>{if(!t.id||!t.target||!t.text||!t.en||!t.tts)issues.push('Tongue twister "'+(t.id||"?")+'": incomplete Spanish, English, or audio text');});
    if(typeof PRONUNCIATION_TIPS!=="undefined")PRONUNCIATION_TIPS.forEach(t=>{if(!t.target||!t.title||!t.sound||!Array.isArray(t.steps)||!t.steps.length||!t.avoid)issues.push('Pronunciation tip "'+(t.target||"?")+'": incomplete coaching content');});
    if(typeof PHONETIC_WARMUP!=="undefined")PHONETIC_WARMUP.forEach(s=>{if(!s.id||!s.label||!s.detail||!s.tts||!s.target||!s.note)issues.push('Warm-up step "'+(s.id||"?")+'": incomplete practice content');});
    if(typeof ENGLISH_INTERFERENCE!=="undefined")ENGLISH_INTERFERENCE.forEach(s=>{if(!s.pattern||!s.spanish||!s.english||!s.example||!s.en||!s.tts)issues.push('English interference card "'+(s.pattern||"?")+'": incomplete content');});
    if(typeof MINIMAL_PAIRS!=="undefined")MINIMAL_PAIRS.forEach(s=>{if(!s.a||!s.aEn||!s.b||!s.bEn||!s.tip||!s.tts)issues.push('Minimal pair "'+(s.a||"?")+'": incomplete content');});
    if(typeof SPANISH_THINKING_PROMPTS!=="undefined")SPANISH_THINKING_PROMPTS.forEach(s=>{if(!s.intent||!s.model||!s.tts)issues.push('Spanish-thinking prompt missing intent, model, or tts');});
    if(typeof SPEAKING_GUIDE!=="undefined")SPEAKING_GUIDE.forEach(g=>{if(!g.id||!g.title||!g.formula||!g.explain||!g.mistake||!g.exercise)issues.push('Speaking guide "'+(g.id||"?")+ '": incomplete explanation');(g.examples||[]).forEach((ex,i)=>{if(!ex.es||!ex.en||!ex.tts)issues.push('Speaking guide "'+g.id+'" example '+(i+1)+' missing Spanish, English, or tts');});});
    if(typeof LESSON_META!=="undefined")LESSONS.forEach(l=>{const m=LESSON_META[l.id];if(!m)return;(m.guideIds||[]).forEach(id=>{if(typeof SPEAKING_GUIDE!=="undefined"&&!SPEAKING_GUIDE.some(g=>g.id===id))issues.push('Lesson "'+l.id+'": guide "'+id+'" does not exist');});});
    [...CONVERSATION_QUIZ,...FILL_BLANK_QUIZ].forEach((q,i)=>{if(!Array.isArray(q.choices))return;const choices=q.choices.map(String);const normalized=choices.map(normalizeQuizText);if(choices.length!==4)issues.push('Data quiz question '+(i+1)+' needs exactly four answer choices');if(new Set(normalized).size!==normalized.length)issues.push('Data quiz question '+(i+1)+' has duplicate answer choices');if(q.en&&!normalized.includes(normalizeQuizText(q.en)))issues.push('Data quiz question '+(i+1)+' correct answer is not in its choices');if(q.kind==="blank"&&!String(q.es).includes("___"))issues.push('Data quiz question '+(i+1)+' is marked blank but has no blank in its Spanish prompt');});
    aQ.forEach((q,i)=>{if(!Array.isArray(q.choices))return;const choices=q.choices.map(String);const normalized=choices.map(normalizeQuizText);if(choices.length!==4)issues.push('Quiz question '+(i+1)+' needs exactly four answer choices');if(new Set(normalized).size!==normalized.length)issues.push('Quiz question '+(i+1)+' has duplicate answer choices');if(q.en&&!normalized.includes(normalizeQuizText(q.en)))issues.push('Quiz question '+(i+1)+' correct answer is not in its choices');if(q.kind==="blank"&&!String(q.es).includes("___"))issues.push('Quiz question '+(i+1)+' is marked blank but has no blank in its Spanish prompt');});
    FRASES.forEach(s=>{if(s.id&&s.section)issues.push('FRASES "'+s.id+'": has BOTH id and section (breaks hybrid filters)');});
    if(typeof PICTURE_MATCH_BANK!=="undefined")PICTURE_MATCH_BANK.forEach(p=>{if(!p.id||!p.word||!p.img||!p.tts||!p.en)issues.push('Picture match "'+(p.id||"?")+'": missing required field');});
    if(typeof GRINGO_TRAPS!=="undefined")GRINGO_TRAPS.forEach(g=>{if(!g.id||!g.trap||!g.local||!g.tts||!g.why)issues.push('Gringo trap "'+(g.id||"?")+'": missing required field');});
    if(typeof NATURAL_EAR_CLIPS!=="undefined")NATURAL_EAR_CLIPS.forEach(n=>{if(!n.id||!n.fast||!n.clear||!Array.isArray(n.choices)||n.choices.length<3||!n.answer)issues.push('Natural ear clip "'+(n.id||"?")+'": incomplete clip');});
    if(typeof VISUAL_GUIDES!=="undefined")VISUAL_GUIDES.forEach(v=>{if(!v.id||!v.title||!v.img||!v.es||!v.en)issues.push('Visual guide "'+(v.id||"?")+'": missing required field');});
    if(typeof VERB_VERSATILITY_ENGINE!=="undefined")VERB_VERSATILITY_ENGINE.forEach(v=>{
      if(!v.id||!v.verb||!v.forms)issues.push('Verb Lab "'+(v.id||"?")+'": incomplete');
      else ["yo","tu","vos","usted","nosotros"].forEach(p=>{
        if(!v.forms[p])issues.push('Verb Lab "'+v.id+'": missing person '+p);
        else ["past","just","now","future","polite"].forEach(t=>{if(!v.forms[p][t]||!v.forms[p][t].es||!v.forms[p][t].en)issues.push('Verb Lab "'+v.id+'" '+p+'.'+t+' incomplete');});
      });
    });
    if(typeof COLOMBIAN_STORIES!=="undefined")COLOMBIAN_STORIES.forEach(st=>{
      if(!st.id||!st.title||!Array.isArray(st.parts)||st.parts.length!==3)issues.push('Story "'+(st.id||"?")+'": must have 3 parts');
      else st.parts.forEach((pt,pi)=>{if(!Array.isArray(pt.options)||pt.options.length<3)issues.push('Story "'+st.id+'" part '+(pi+1)+' needs >=3 options');});
    });
    if(typeof COLOMBIA_CHATS!=="undefined")COLOMBIA_CHATS.forEach(c=>{
      if(!c.id||!c.title||!c.partner||!Array.isArray(c.turns)||c.turns.length!==4)issues.push('Colombia chat "'+(c.id||"?")+'": must have 4 turns');
      else c.turns.forEach((t,ti)=>{
        if(!t.botEs||!t.tts||!Array.isArray(t.options)||t.options.length<3)issues.push('Chat "'+c.id+'" turn '+(ti+1)+' incomplete');
        else if(!t.options.some(o=>o.quality==="natural"))issues.push('Chat "'+c.id+'" turn '+(ti+1)+' missing natural option');
      });
    });
    if(typeof ROLEPLAY_IMAGES!=="undefined")Object.entries(ROLEPLAY_IMAGES).forEach(([k,fn])=>{if(!fn||!String(fn).endsWith(".webp"))issues.push('ROLEPLAY_IMAGES "'+k+'": expected .webp asset');});
  }catch(e){issues.push("Validator crashed: "+e.message);}
  if(issues.length){
    const b=document.createElement("div");b.className="data-warning";
    b.innerHTML="⚠️ <strong>Data problems detected:</strong><br>"+issues.slice(0,6).join("<br>")+(issues.length>6?"<br>…and "+(issues.length-6)+" more (see console)":"");
    document.body.appendChild(b);
    console.warn("DATA VALIDATOR:",issues);
  }
  return issues;
}
