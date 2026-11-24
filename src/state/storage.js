/** Local multi-profile storage wrapper & JSON backup controls. */
import { showAppToast } from "../core/text-utils.js";
let audioTestHook = () => {};
let themeToggleHook = () => {};

export function registerStorageUiHooks({ onAudioTest, onThemeToggle } = {}) {
  if (onAudioTest) audioTestHook = onAudioTest;
  if (onThemeToggle) themeToggleHook = onThemeToggle;
}

// Spanish learning app behavior
// ── Voice ─────────────────────────────────────────────────────────────────────
// ── Local profiles ──────────────────────────────────────────────────────────
// Profiles are intentionally local to this browser/device. They keep quiz,
// lesson, SRS, streak, and practice state separate without requiring accounts.
export const nativeStorage=window.localStorage;
export const PROFILE_LIST_KEY="esco-profiles-v1";
export const ACTIVE_PROFILE_KEY="esco-active-profile-v1";
export const PROFILE_MIGRATION_KEY="esco-profile-migrated-v1";
const SETH_PROFILE={id:"seth",label:"Seth",emoji:"🧑‍🎓"};
const GUEST_PROFILE={id:"guest",label:"Guest",emoji:"👤"};
export const DEFAULT_PROFILES=[SETH_PROFILE,GUEST_PROFILE];
export const REMOVED_PROFILE_IDS=new Set(["brad"]);
function hasExistingSethData(){
  try{
    for(let i=0;i<nativeStorage.length;i++){
      const k=nativeStorage.key(i);
      if(!k)continue;
      if(k.startsWith("esco-profile-seth-"))return true;
      if(k.startsWith("esco-")&&!k.startsWith("esco-profile-")&&![PROFILE_LIST_KEY,ACTIVE_PROFILE_KEY,PROFILE_MIGRATION_KEY].includes(k))return true;
    }
  }catch(e){}
  return false;
}
export const APP_VERSION = "v128.0";
const SYNC_EXCLUDED_KEYS = new Set(["esco-selected-voice-v45", "esco-selected-voice-v1", "esco-selected-voice-v3"]);
const savedActiveBeforeInit=(()=>{try{return nativeStorage.getItem(ACTIVE_PROFILE_KEY);}catch(e){return null;}})();
const portalPrincipal = (typeof window !== "undefined" && window.__ESCO_ME && window.__ESCO_ME.principal_id) ? window.__ESCO_ME : null;
const sethDeviceDetected=!portalPrincipal && (hasExistingSethData()||savedActiveBeforeInit==="seth");
const baseDefaultProfiles=portalPrincipal
  ? [{id:`principal-${portalPrincipal.principal_id}`,label:(portalPrincipal.display_name||portalPrincipal.username||"My account"),emoji:"👤"}]
  : (sethDeviceDetected?[SETH_PROFILE,GUEST_PROFILE]:[GUEST_PROFILE]);
export let profileList=baseDefaultProfiles.slice();
export let activeProfileId=portalPrincipal?`principal-${portalPrincipal.principal_id}`:(sethDeviceDetected?"seth":"guest");
if(!portalPrincipal){
  try{
    const savedProfiles=JSON.parse(nativeStorage.getItem(PROFILE_LIST_KEY)||"null");
    if(Array.isArray(savedProfiles)&&savedProfiles.length){
      const hasCustomSeth=savedProfiles.some(p=>p&&p.id==="seth");
      const effectiveBase=(sethDeviceDetected||hasCustomSeth)?[SETH_PROFILE,GUEST_PROFILE]:[GUEST_PROFILE];
      const savedById=new Map(savedProfiles.filter(p=>p&&p.id).map(p=>[p.id,p]));
      profileList=effectiveBase.map(p=>savedById.get(p.id)||p).concat(savedProfiles.filter(p=>p&&p.id&&!REMOVED_PROFILE_IDS.has(p.id)&&!effectiveBase.some(d=>d.id===p.id)));
    }
    const savedActive=savedActiveBeforeInit;
    if(profileList.some(p=>p.id===savedActive))activeProfileId=savedActive;
  }catch(e){}
  try{
    for(let i=nativeStorage.length-1;i>=0;i--){
      const key=nativeStorage.key(i);
      if(key&&key.startsWith("esco-profile-brad-"))nativeStorage.removeItem(key);
    }
    if(activeProfileId==="brad")activeProfileId=(profileList[0]&&profileList[0].id)||"guest";
  }catch(e){}
  /* Preserve the existing single-profile app the first time profiles are used. */
  try{
    if(!nativeStorage.getItem(PROFILE_MIGRATION_KEY)){
      for(let i=0;i<nativeStorage.length;i++){
        const key=nativeStorage.key(i);
        if(!key||!key.startsWith("esco-")||key.startsWith("esco-profile-")||[PROFILE_LIST_KEY,ACTIVE_PROFILE_KEY,PROFILE_MIGRATION_KEY].includes(key))continue;
        const destination="esco-profile-seth-"+key;
        if(nativeStorage.getItem(destination)===null)nativeStorage.setItem(destination,nativeStorage.getItem(key));
      }
      nativeStorage.setItem(PROFILE_MIGRATION_KEY,"1");
    }
    nativeStorage.setItem(PROFILE_LIST_KEY,JSON.stringify(profileList));
    nativeStorage.setItem(ACTIVE_PROFILE_KEY,activeProfileId);
  }catch(e){}
}
export const profileStorage={
  getItem:key=>nativeStorage.getItem("esco-profile-"+activeProfileId+"-"+key),
  setItem:(key,value)=>{
    if(typeof window!=="undefined"&&window.__escoQueueSync&&!SYNC_EXCLUDED_KEYS.has(key))window.__escoQueueSync(key,value);
    try{nativeStorage.setItem("esco-profile-"+activeProfileId+"-"+key,value);}
    catch(err){if(typeof window!=="undefined"&&!window.__escoStorageWarned){window.__escoStorageWarned=true;console.warn("[Storage] Write failed:",err);}}
  },
  removeItem:key=>{
    const fullKey="esco-profile-"+activeProfileId+"-"+key;
    const existed=nativeStorage.getItem(fullKey)!==null;
    if(existed&&typeof window!=="undefined"&&window.__escoQueueSync&&!SYNC_EXCLUDED_KEYS.has(key))window.__escoQueueSync(key,null);
    nativeStorage.removeItem(fullKey);
  },
  key:index=>{const prefix="esco-profile-"+activeProfileId+"-";const keys=[];for(let i=0;i<nativeStorage.length;i++){const k=nativeStorage.key(i);if(k&&k.startsWith(prefix))keys.push(k.slice(prefix.length));}return keys[index]||null;},
  get length(){const prefix="esco-profile-"+activeProfileId+"-";let n=0;for(let i=0;i<nativeStorage.length;i++){const k=nativeStorage.key(i);if(k&&k.startsWith(prefix))n++;}return n;}
};
// Existing app code can continue using localStorage; this proxy scopes it.
// Exported explicitly as appStorage (no global localStorage shadowing).
function initialsOf(name){return String(name||"?").trim().split(/\s+/).slice(0,2).map(w=>w[0]||"").join("").toUpperCase()||"?";}
function saveAvatar(avatar){
  fetch("/api/avatar",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({avatar})})
    .then(r=>{if(!r.ok)throw new Error("avatar");if(window.__ESCO_ME)window.__ESCO_ME.avatar=avatar;buildProfileBar();showAppToast("✅ Avatar updated","ok");})
    .catch(()=>showAppToast("⚠️ Could not save avatar — check connection.","warn"));
}
if(typeof document!=="undefined"&&!window.__escoSyncListenerBound){
  window.__escoSyncListenerBound=true;
  document.addEventListener("esco-sync",e=>{const d=document.getElementById("sync-dot");if(d)d.style.color=e.detail&&e.detail.online?"var(--accent)":"var(--gold)";});
}
function buildAccountBar(host){
  host.innerHTML="";
  const me=window.__ESCO_ME;
  const name=me.display_name||me.username||"My Account";
  const drawer=document.createElement("details");drawer.className="top-utility-drawer profile-utility-drawer";
  const summary=document.createElement("summary");summary.className="top-utility-summary account-summary";
  const avSpan=document.createElement("span");avSpan.className="account-avatar";
  const av=me.avatar||{};
  if(av.kind==="photo"&&av.data){const im=document.createElement("img");im.src=av.data;im.alt="";avSpan.appendChild(im);}
  else avSpan.textContent=av.kind==="emoji"?(av.value||"👤"):initialsOf(name);
  const nameSpan=document.createElement("span");nameSpan.className="account-name";nameSpan.textContent=name;
  const dotSpan=document.createElement("small");dotSpan.className="sync-dot";dotSpan.id="sync-dot";dotSpan.title="Progress synced";dotSpan.textContent="●";
  if(window.__escoSyncState&&!window.__escoSyncState.online)dotSpan.style.color="var(--gold)";
  summary.append(avSpan,nameSpan,dotSpan);
  const utilityBody=document.createElement("div");utilityBody.className="top-utility-body";
  const pendingImport=typeof window!=="undefined"&&window.__ESCO_PENDING_LOCAL_IMPORT;
  if(pendingImport&&Object.keys(pendingImport).length){
    const impBanner=document.createElement("div");impBanner.className="import-legacy-banner";
    const impText=document.createElement("span");impText.textContent=`Previous local progress found (${Object.keys(pendingImport).length} items). Import into this account?`;
    const impBtn=document.createElement("button");impBtn.type="button";impBtn.className="profile-reset";impBtn.textContent="📥 Import local progress";
    impBtn.onclick=()=>{
      impBtn.disabled=true;
      fetch("/api/import",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({items:pendingImport})})
        .then(r=>{if(!r.ok&&r.status!==409)throw new Error("import");const p=`esco-profile-${activeProfileId}-`;Object.entries(pendingImport).forEach(([k,v])=>{if(typeof v==="string")nativeStorage.setItem(p+k,v);});delete window.__ESCO_PENDING_LOCAL_IMPORT;location.reload();})
        .catch(()=>{impBtn.disabled=false;showAppToast("⚠️ Could not import progress — try again.","warn");});
    };
    impBanner.append(impText,impBtn);utilityBody.appendChild(impBanner);
  }
  const bar=document.createElement("div");bar.className="profile-bar account-bar";
  const who=document.createElement("span");who.className="profile-label account-who";
  who.textContent=(me.email||"")+(me.provider?(" · "+me.provider):"");
  const controls=[who];
  if(me.profile_url){
    const portal=document.createElement("a");portal.className="profile-reset account-link";portal.href=me.profile_url;portal.target="_blank";portal.rel="noopener";portal.textContent="My Account";portal.title="View your Global Entry portal profile";
    controls.push(portal);
  }
  const reset=document.createElement("button");reset.type="button";reset.className="profile-reset";reset.textContent="Reset progress";
  reset.onclick=()=>{
    if(!confirm("Clear your saved progress? Only your account will be reset."))return;
    const prefix=`esco-profile-${activeProfileId}-`;const keys=[];
    for(let i=0;i<nativeStorage.length;i++){const k=nativeStorage.key(i);if(k&&k.startsWith(prefix))keys.push(k);}
    keys.forEach(k=>{const rawKey=k.slice(prefix.length);if(window.__escoQueueSync&&!SYNC_EXCLUDED_KEYS.has(rawKey))window.__escoQueueSync(rawKey,null);nativeStorage.removeItem(k);});
    location.reload();
  };
  const ver=document.createElement("button");ver.type="button";ver.className="profile-reset";ver.textContent="v128.0 🔊";ver.title="Tap to test iPhone/computer audio";
  ver.onclick=()=>audioTestHook("Hola, buenos días Colombia",0.82);
  const themeBtn=document.createElement("button");themeBtn.type="button";themeBtn.id="theme-toggle-btn";themeBtn.className="profile-reset";themeBtn.textContent=(appStorage.getItem("esco-theme-v101")==="light"?"🌙 Dark":"☀️ Sun");themeBtn.title="Switch dark / sunlight theme";themeBtn.onclick=()=>themeToggleHook();
  const picker=document.createElement("div");picker.className="avatar-picker";
  const pLabel=document.createElement("span");pLabel.className="profile-label";pLabel.textContent="Avatar";
  ["🦉","🦜","☕","🌮","🚕","📚"].forEach(e=>{
    const b=document.createElement("button");b.type="button";b.className="avatar-preset";b.textContent=e;b.title="Choose avatar";
    b.onclick=()=>saveAvatar({kind:"emoji",value:e});picker.appendChild(b);
  });
  const photoBtn=document.createElement("label");photoBtn.className="profile-reset avatar-photo";photoBtn.textContent="Upload photo";
  const file=document.createElement("input");file.type="file";file.accept="image/*";file.hidden=true;
  file.onchange=()=>{
    const f=file.files&&file.files[0];if(!f)return;
    const url=URL.createObjectURL(f);const img=new Image();
    img.onload=()=>{
      const c=document.createElement("canvas");c.width=128;c.height=128;
      const ctx=c.getContext("2d");const side=Math.min(img.width,img.height);
      ctx.drawImage(img,(img.width-side)/2,(img.height-side)/2,side,side,0,0,128,128);
      URL.revokeObjectURL(url);
      saveAvatar({kind:"photo",data:c.toDataURL("image/jpeg",0.82)});
    };
    img.src=url;
  };
  photoBtn.appendChild(file);
  const initBtn=document.createElement("button");initBtn.type="button";initBtn.className="profile-reset";initBtn.textContent="Initials";
  initBtn.onclick=()=>saveAvatar({kind:"initials"});
  picker.prepend(pLabel);picker.append(photoBtn,initBtn);
  controls.push(reset,ver,themeBtn);
  bar.append(...controls);utilityBody.append(picker,bar);attachProfileBackupControls(utilityBody);
  drawer.append(summary,utilityBody);host.appendChild(drawer);
}
export function buildProfileBar(){
  const host=document.getElementById("profile-host");if(!host)return;
  if(typeof window!=="undefined"&&window.__ESCO_ME&&window.__ESCO_ME.principal_id){buildAccountBar(host);return;}
  host.innerHTML="";
  const currentProfile=profileList.find(p=>p.id===activeProfileId)||{label:activeProfileId,emoji:"👤"};
  const drawer=document.createElement("details");drawer.className="top-utility-drawer profile-utility-drawer";
  const summary=document.createElement("summary");summary.className="top-utility-summary";
  const summaryTitle=document.createElement("span");summaryTitle.textContent="👤 Profile";
  const summaryName=document.createElement("small");summaryName.textContent=`${currentProfile.emoji||"👤"} ${currentProfile.label}`;
  summary.append(summaryTitle,summaryName);
  const utilityBody=document.createElement("div");utilityBody.className="top-utility-body";
  const bar=document.createElement("div");bar.className="profile-bar";
  const label=document.createElement("span");label.className="profile-label";label.textContent="Profile";
  const select=document.createElement("select");select.className="profile-select";select.setAttribute("aria-label","Choose local profile");
  profileList.forEach(p=>{const o=document.createElement("option");o.value=p.id;o.textContent=(p.emoji||"👤")+" "+p.label;select.appendChild(o);});
  select.value=activeProfileId;
  select.onchange=()=>{activeProfileId=select.value;nativeStorage.setItem(ACTIVE_PROFILE_KEY,activeProfileId);location.reload();};
  const addBtn=document.createElement("button");addBtn.type="button";addBtn.className="profile-reset";addBtn.textContent="+ New";addBtn.title="Create a separate local profile on this device";
  addBtn.onclick=()=>{
    const raw=prompt("New local profile name (saved on this device only):","");
    const label=(raw||"").trim().slice(0,24);
    if(!label)return;
    const baseId=label.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")||"learner";
    let newId=baseId;let n=2;
    while(profileList.some(p=>p.id===newId)||REMOVED_PROFILE_IDS.has(newId)){newId=`${baseId}-${n++}`;}
    const next=[...profileList,{id:newId,label,emoji:"🙂"}];
    nativeStorage.setItem(PROFILE_LIST_KEY,JSON.stringify(next));
    nativeStorage.setItem(ACTIVE_PROFILE_KEY,newId);
    location.reload();
  };
  const reset=document.createElement("button");reset.type="button";reset.className="profile-reset";reset.textContent=`Reset ${currentProfile.label}`;reset.title=`Clear ${currentProfile.label} progress only`;
  reset.onclick=()=>{
    if(!confirm(`Clear the ${currentProfile.label} profile's saved progress? Other profiles will not change.`))return;
    const prefix=`esco-profile-${activeProfileId}-`;const keys=[];
    for(let i=0;i<nativeStorage.length;i++){const k=nativeStorage.key(i);if(k&&k.startsWith(prefix))keys.push(k);}
    keys.forEach(k=>nativeStorage.removeItem(k));
    location.reload();
  };
  const ver=document.createElement("button");ver.type="button";ver.className="profile-reset";ver.textContent="v128.0 🔊";ver.title="Tap to test iPhone/computer audio";
  ver.onclick=()=>audioTestHook("Hola, buenos días Colombia",0.82);const themeBtn=document.createElement("button");themeBtn.type="button";themeBtn.id="theme-toggle-btn";themeBtn.className="profile-reset";themeBtn.textContent=(appStorage.getItem("esco-theme-v101")==="light"?"🌙 Dark":"☀️ Sun");themeBtn.title="Switch dark / sunlight theme";themeBtn.onclick=()=>themeToggleHook();
  bar.append(label,select,addBtn,reset,ver,themeBtn);utilityBody.appendChild(bar);attachProfileBackupControls(utilityBody);drawer.append(summary,utilityBody);host.appendChild(drawer);
}
export const appStorage = profileStorage;

export function attachProfileBackupControls(utilityBody){
  if(!utilityBody)return;
  const row=document.createElement("div");row.className="profile-backup-row";
  const expBtn=document.createElement("button");expBtn.type="button";expBtn.className="profile-reset profile-backup-btn";
  expBtn.textContent="💾 Export Backup";expBtn.title="Download a JSON backup of this profile's progress to transfer to iPhone or PC";
  const impBtn=document.createElement("button");impBtn.type="button";impBtn.className="profile-reset profile-backup-btn";
  impBtn.textContent="📂 Import Backup";impBtn.title="Restore progress from a saved JSON backup file";
  const fileIn=document.createElement("input");fileIn.type="file";fileIn.accept="application/json,.json";fileIn.hidden=true;
  const status=document.createElement("small");status.className="profile-backup-status";status.setAttribute("aria-live","polite");
  expBtn.onclick=()=>{
    try{
      const prefix=`esco-profile-${activeProfileId}-`;
      const data={};
      for(let i=0;i<nativeStorage.length;i++){
        const k=nativeStorage.key(i);
        if(k&&k.startsWith(prefix))data[k.slice(prefix.length)]=nativeStorage.getItem(k);
      }
      const payload=JSON.stringify({app:"espanol-colombia",version:"v128.0",profile:activeProfileId,exportedAt:new Date().toISOString(),data},null,2);
      const blob=new Blob([payload],{type:"application/json"});
      const url=URL.createObjectURL(blob);
      const a=document.createElement("a");
      a.href=url;a.download=`espanol-colombia-${activeProfileId}-backup.json`;
      document.body.appendChild(a);a.click();a.remove();
      setTimeout(()=>URL.revokeObjectURL(url),1500);
      status.textContent="✅ Backup downloaded!";
    }catch(e){status.textContent="⚠️ Could not export backup.";}
  };
  impBtn.onclick=()=>fileIn.click();
  fileIn.onchange=()=>{
    const f=fileIn.files&&fileIn.files[0];if(!f)return;
    const reader=new FileReader();
    reader.onload=()=>{
      try{
        const parsed=JSON.parse(String(reader.result||"{}"));
        const entries=parsed&&parsed.data&&typeof parsed.data==="object"?parsed.data:null;
        if(!entries)throw new Error("Invalid backup file");
        const prefix=`esco-profile-${activeProfileId}-`;
        const keyOk=/^esco-[a-z0-9][a-z0-9-]{0,80}$/;
        let imported=0;
        Object.entries(entries).slice(0,120).forEach(([k,v])=>{
          if(keyOk.test(k)&&typeof v==="string"&&v.length<=512000){
            nativeStorage.setItem(prefix+k,v);
            imported++;
          }
        });
        if(!imported)throw new Error("No valid backup entries");
        status.textContent="✅ Backup restored! Reloading…";
        setTimeout(()=>location.reload(),350);
      }catch(e){status.textContent="⚠️ Invalid backup JSON file.";}
    };
    reader.readAsText(f);
  };
  row.append(expBtn,impBtn,fileIn,status);
  utilityBody.appendChild(row);
}
