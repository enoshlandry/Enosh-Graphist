const SUPABASE_URL="https://gsndkjbjflbnhqfaufca.supabase.co";
const SUPABASE_PUBLISHABLE_KEY="sb_publishable_tVsDipwNRIccqE18qXqRLg_n7GmyB6h";
const {createClient}=supabase;
const db=createClient(SUPABASE_URL,SUPABASE_PUBLISHABLE_KEY);

const state={projects:[],filter:"Tous",currentProject:null,galleryIndex:0,selectedFiles:[]};
const $=s=>document.querySelector(s);
const esc=s=>String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
const sleep=ms=>new Promise(r=>setTimeout(r,ms));

document.addEventListener("DOMContentLoaded",async()=>{
  setupMenu(); setupFilters(); setupModals(); setupContact(); setupAdmin();
  await loadProjects();
});

function setupMenu(){
 const btn=$("#menuBtn"), links=$("#navLinks");
 btn?.addEventListener("click",()=>{const open=links.classList.toggle("mobile-open");btn.setAttribute("aria-expanded",open)});
 links?.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>links.classList.remove("mobile-open")));
}
function setupFilters(){ $("#filters")?.addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;state.filter=b.dataset.filter;$("#filters .active")?.classList.remove("active");b.classList.add("active");renderProjects();}); }

async function loadProjects(){
 const {data,error}=await db.from("projects").select("*").order("created_at",{ascending:false});
 if(error){console.error(error);$("#workGrid").innerHTML='<p class="loading">Impossible de charger les travaux pour le moment.</p>';return}
 const projects=data||[];
 if(!projects.length){$("#workGrid").innerHTML='<p class="loading">Aucun projet publié pour le moment.</p>';state.projects=[];return}
 const ids=projects.map(p=>p.id);
 const {data:imgs}=await db.from("project_images").select("id,project_id,image_url,position").in("project_id",ids).order("position");
 state.projects=projects.map(p=>({...p,images:(imgs||[]).filter(i=>i.project_id===p.id).sort((a,b)=>a.position-b.position)}));
 renderProjects();
}

function renderProjects(){
 const grid=$("#workGrid"); const list=state.projects.filter(p=>state.filter==="Tous"||p.category===state.filter);
 if(!list.length){grid.innerHTML='<p class="loading">Aucun projet dans cette catégorie pour le moment.</p>';return}
 grid.innerHTML=list.map((p,i)=>{
   const first=p.images?.[0]?.image_url;
   const fallback=`<div class="work-art"><div class="art-word">${esc(p.title)}</div></div>`;
   return `<article class="work-card" data-id="${esc(p.id)}" tabindex="0">
      <div class="work-image">${first?`<img loading="lazy" src="${esc(first)}" alt="${esc(p.title)}">`:fallback}</div>
      <div class="work-info"><div><h3>${esc(p.title)}</h3><span>${esc(p.category)} · ${esc(p.year||"")}</span></div><div class="work-arrow">↗</div></div>
   </article>`;
 }).join("");
 grid.querySelectorAll(".work-card").forEach(c=>{c.addEventListener("click",()=>openProject(c.dataset.id));c.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" ")openProject(c.dataset.id)})});
}

function setupModals(){
 $("#modalClose").onclick=closeProject;
 document.querySelectorAll("[data-close]").forEach(x=>x.addEventListener("click",closeProject));
 $("#galleryPrev").onclick=()=>changeGallery(-1); $("#galleryNext").onclick=()=>changeGallery(1);
 document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeProject();closeAdmin()} if($("#projectModal").classList.contains("open")){if(e.key==="ArrowLeft")changeGallery(-1);if(e.key==="ArrowRight")changeGallery(1)}})
}
function openProject(id){
 const p=state.projects.find(x=>x.id===id);if(!p)return;state.currentProject=p;state.galleryIndex=0;
 $("#modalTag").textContent=p.category||"";$("#modalTitle").textContent=p.title;$("#modalDesc").textContent=p.description||"";
 $("#modalMeta").innerHTML=`<div><b>Client</b><span>${esc(p.client||"—")}</span></div><div><b>Année</b><span>${esc(p.year||"—")}</span></div><div><b>Visuels</b><span>${p.images.length} / 6</span></div><div><b>Projet</b><span>${esc(p.category||"—")}</span></div>`;
 renderGallery();$("#projectModal").classList.add("open");$("#projectModal").setAttribute("aria-hidden","false");document.body.classList.add("locked");
}
function closeProject(){$("#projectModal").classList.remove("open");$("#projectModal").setAttribute("aria-hidden","true");document.body.classList.remove("locked");}
function renderGallery(){
 const p=state.currentProject, imgs=p?.images||[], frame=$("#galleryFrame");
 frame.classList.remove("gallery-swap");
 void frame.offsetWidth;
 frame.classList.add("gallery-swap");
 if(!imgs.length){frame.innerHTML='<div style="color:white;text-align:center">Aucun visuel disponible</div>';$("#galleryCount").textContent="0 / 0";$("#thumbs").innerHTML="";return}
 const item=imgs[state.galleryIndex];frame.innerHTML=`<img src="${esc(item.image_url)}" alt="${esc(p.title)} — visuel ${state.galleryIndex+1}">`;
 $("#galleryCount").textContent=`${state.galleryIndex+1} / ${imgs.length}`;
 $("#galleryPrev").style.display=imgs.length>1?"block":"none";$("#galleryNext").style.display=imgs.length>1?"block":"none";
 $("#thumbs").innerHTML=imgs.map((x,i)=>`<button class="gallery-thumb thumb ${i===state.galleryIndex?"active":""}" data-i="${i}" aria-label="Voir le visuel ${i+1}"><img src="${esc(x.image_url)}" alt=""></button>`).join("");
 $("#thumbs").querySelectorAll(".thumb").forEach(b=>b.onclick=()=>{state.galleryIndex=+b.dataset.i;renderGallery()});
}
function changeGallery(delta){const n=state.currentProject?.images?.length||0;if(!n)return;state.galleryIndex=(state.galleryIndex+delta+n)%n;renderGallery()}

function setupContact(){
 $("#contactForm").addEventListener("submit",e=>{e.preventDefault();const f=new FormData(e.currentTarget);const subject=encodeURIComponent("Projet — Enosh. Graphist.");const body=encodeURIComponent(`Nom : ${f.get("name")}\nEmail : ${f.get("email")}\n\nProjet :\n${f.get("message")}`);window.location.href=`mailto:contact@enoshgraphist.com?subject=${subject}&body=${body}`;$("#contactStatus").textContent="Ton application email va s’ouvrir pour envoyer le brief.";});
}

function setupAdmin(){
 $("#adminOpen").onclick=openAdmin;$("#adminClose").onclick=closeAdmin;document.querySelectorAll("[data-admin-close]").forEach(x=>x.addEventListener("click",closeAdmin));
 $("#loginForm").addEventListener("submit",login);
 $("#logoutBtn").onclick=logout;
 $("#pickImages").onclick=()=>$("#pImages").click();
 $("#pImages").addEventListener("change",e=>handleFiles([...e.target.files]));
 $("#newProjectBtn").onclick=resetForm;
 $("#projectForm").addEventListener("submit",saveProject);
}
async function openAdmin(){
 $("#adminModal").classList.add("open");$("#adminModal").setAttribute("aria-hidden","false");document.body.classList.add("locked");
 const {data:{session}}=await db.auth.getSession();
 if(session)showAdmin(session.user);else showLogin();
}
function closeAdmin(){$("#adminModal").classList.remove("open");$("#adminModal").setAttribute("aria-hidden","true");document.body.classList.remove("locked")}
function showLogin(){$("#loginView").hidden=false;$("#adminView").hidden=true;$("#loginStatus").textContent=""}
function showAdmin(user){$("#loginView").hidden=true;$("#adminView").hidden=false;$("#adminUser").textContent=user.email||"Administrateur";refreshAdminList()}
async function login(e){
 e.preventDefault();$("#loginStatus").textContent="Connexion…";
 const {data,error}=await db.auth.signInWithPassword({email:$("#loginEmail").value.trim(),password:$("#loginPassword").value});
 if(error){$("#loginStatus").textContent="Connexion refusée : "+error.message;return}
 showAdmin(data.user);
}
async function logout(){await db.auth.signOut();showLogin();resetForm()}
function resetForm(){
 $("#projectForm").reset();$("#projectId").value="";state.selectedFiles=[];renderUploadPreview();$("#adminStatus").textContent="Nouveau projet.";
}
async function handleFiles(files){
 const chosen=files.slice(0,6);
 if(files.length>6)$("#adminStatus").textContent="Maximum 6 images : seules les 6 premières sont retenues.";
 state.selectedFiles=chosen;
 renderUploadPreview();
}
function renderUploadPreview(){
 const box=$("#uploadPreview"); if(!state.selectedFiles.length){box.innerHTML="";return}
 box.innerHTML=state.selectedFiles.map((f,i)=>`<div class="preview"><img src="${URL.createObjectURL(f)}" alt=""><span>${i+1}</span></div>`).join("");
}
function editProject(id){
 const p=state.projects.find(x=>x.id===id);if(!p)return;
 $("#projectId").value=p.id;$("#pTitle").value=p.title;$("#pTag").value=p.category;$("#pClient").value=p.client||"";$("#pYear").value=p.year||"";$("#pDesc").value=p.description||"";
 state.selectedFiles=[];renderUploadPreview();$("#adminStatus").textContent="Projet chargé. Pour changer les images, sélectionne jusqu'à 6 nouveaux visuels.";
 window.scrollTo({top:document.querySelector(".admin-panel").scrollTop||0,behavior:"smooth"});
}
function refreshAdminList(){
 const box=$("#adminList");if(!state.projects.length){box.innerHTML='<p style="color:var(--muted);font-size:13px">Aucun projet en ligne.</p>';return}
 box.innerHTML=state.projects.map(p=>`<div class="admin-item"><div>${p.images?.[0]?`<img src="${esc(p.images[0].image_url)}" alt="">`:'<div style="width:72px;height:72px;border-radius:10px;background:var(--bg)"></div>'}</div><div><h3>${esc(p.title)}</h3><p>${esc(p.category)} · ${esc(p.year||"")} · ${p.images.length} image(s)</p></div><div class="admin-item-actions"><button class="mini-btn" data-edit="${esc(p.id)}">Modifier</button><button class="mini-btn delete" data-delete="${esc(p.id)}">Supprimer</button></div></div>`).join("");
 box.querySelectorAll("[data-edit]").forEach(b=>b.onclick=()=>editProject(b.dataset.edit));
 box.querySelectorAll("[data-delete]").forEach(b=>b.onclick=()=>deleteProject(b.dataset.delete));
}
async function compressImage(file,max=1800,quality=.82){
 return new Promise((resolve,reject)=>{
  const img=new Image(),url=URL.createObjectURL(file);img.onload=()=>{
   let w=img.naturalWidth,h=img.naturalHeight,scale=Math.min(1,max/Math.max(w,h));w=Math.round(w*scale);h=Math.round(h*scale);
   const c=document.createElement("canvas");c.width=w;c.height=h;c.getContext("2d").drawImage(img,0,0,w,h);URL.revokeObjectURL(url);
   c.toBlob(b=>b?resolve(b):reject(new Error("Compression impossible")),"image/jpeg",quality);
  };img.onerror=reject;img.src=url;
 });
}
async function uploadImages(projectId,files){
 const urls=[];
 for(let i=0;i<files.length;i++){
   $("#adminStatus").textContent=`Upload du visuel ${i+1}/${files.length}…`;
   const blob=await compressImage(files[i]);
   const path=`${projectId}/${Date.now()}-${i}.jpg`;
   const {error}=await db.storage.from("portfolio").upload(path,blob,{contentType:"image/jpeg",upsert:false});
   if(error)throw error;
   const {data}=db.storage.from("portfolio").getPublicUrl(path);
   urls.push({image_url:data.publicUrl,position:i+1,path});
 }
 return urls;
}
async function saveProject(e){
 e.preventDefault();const btn=$("#saveProjectBtn");btn.disabled=true;$("#adminStatus").textContent="Enregistrement…";
 try{
   const id=$("#projectId").value;
   const payload={title:$("#pTitle").value.trim(),category:$("#pTag").value,client:$("#pClient").value.trim(),year:$("#pYear").value.trim(),description:$("#pDesc").value.trim()};
   if(!payload.title)throw new Error("Le titre est obligatoire.");
   let projectId=id;
   if(id){
     const {error}=await db.from("projects").update(payload).eq("id",id);if(error)throw error;
     if(state.selectedFiles.length){
       const old=state.projects.find(p=>p.id===id)?.images||[];
       await db.from("project_images").delete().eq("project_id",id);
       const uploaded=await uploadImages(id,state.selectedFiles);
       const {error:e2}=await db.from("project_images").insert(uploaded.map(x=>({project_id:id,image_url:x.image_url,position:x.position})));if(e2)throw e2;
       // old storage files are intentionally left as a safety net; they can be cleaned later.
     }
   }else{
     const {data,error}=await db.from("projects").insert(payload).select().single();if(error)throw error;projectId=data.id;
     if(state.selectedFiles.length){const uploaded=await uploadImages(projectId,state.selectedFiles);const {error:e2}=await db.from("project_images").insert(uploaded.map(x=>({project_id:projectId,image_url:x.image_url,position:x.position})));if(e2)throw e2;}
   }
   $("#adminStatus").textContent="✓ Projet enregistré en ligne. Les visiteurs peuvent maintenant le voir.";
   resetForm();await loadProjects();refreshAdminList();
 }catch(err){console.error(err);$("#adminStatus").textContent="Erreur : "+(err.message||"opération impossible");}
 finally{btn.disabled=false}
}
async function deleteProject(id){
 const p=state.projects.find(x=>x.id===id);if(!p||!confirm(`Supprimer « ${p.title} » ?`))return;
 $("#adminStatus").textContent="Suppression…";
 const {error}=await db.from("projects").delete().eq("id",id);if(error){$("#adminStatus").textContent="Erreur : "+error.message;return}
 await loadProjects();refreshAdminList();resetForm();$("#adminStatus").textContent="Projet supprimé.";
}

db.auth.onAuthStateChange((_event,session)=>{if(session && $("#adminModal").classList.contains("open"))showAdmin(session.user)});
