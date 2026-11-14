import { appStorage } from "./storage.js";
import { LESSONS } from "../features/lessons-meta.js";
import { lessonProgress } from "../core/stores.js";

export const THEME_KEY="esco-theme-v101";
export function applyAppTheme(t){
  const isLight=t==="light";
  document.documentElement.setAttribute("data-theme",isLight?"light":"dark");
  const btn=document.getElementById("theme-toggle-btn");
  if(btn)btn.textContent=isLight?"🌙 Dark":"☀️ Sun";
}
export function toggleAppTheme(){
  const next=document.documentElement.getAttribute("data-theme")==="light"?"dark":"light";
  try{appStorage.setItem(THEME_KEY,next);}catch(e){}
  applyAppTheme(next);
}

export const USER_PREFS_KEY="esco-user-prefs-v99";
export let userPrefs={level:"auto",focus:"all",blindEar:false,hablarTab:"regions"};
try{
  const rawP=JSON.parse(appStorage.getItem(USER_PREFS_KEY)||"null");
  if(rawP&&typeof rawP==="object"){
    if(["auto","starter","explorer","fluent"].includes(rawP.level))userPrefs.level=rawP.level;
    if(["all","sanjuan","travel","daily"].includes(rawP.focus))userPrefs.focus=rawP.focus;
    userPrefs.blindEar=!!rawP.blindEar;
    if(["regions","visual","ear","trampas","all"].includes(rawP.hablarTab))userPrefs.hablarTab=rawP.hablarTab;
  }
}catch(e){}
export function saveUserPrefs(){try{appStorage.setItem(USER_PREFS_KEY,JSON.stringify(userPrefs));}catch(e){}}
export function effectiveLevel(){
  if(userPrefs.level!=="auto")return userPrefs.level;
  try{
    const done=LESSONS.filter(x=>lessonProgress[x.id]).length;
    return done>=3?"explorer":"starter";
  }catch(e){return "starter";}
}
export function isBlindEarActive(){return !!(userPrefs.blindEar||effectiveLevel()==="fluent");}
export function initTheme(){ try{ applyAppTheme(appStorage.getItem(THEME_KEY)||"dark"); }catch(e){} }
