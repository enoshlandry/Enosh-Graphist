const ADMIN_PASSWORD="enosh2026";
const STORAGE_KEY="enosh_projects_v2";

const defaultProjects=[
 {id:1,title:"Campagne Agro",tag:"Campagne",client:"Projet campagne",year:"2026",sector:"Agroalimentaire",c1:"#F2941D",c2:"#FFB65C",desc:"Direction artistique et déclinaison d'une campagne pensée pour créer de la visibilité autour d'un produit grand public.",deliverables:["Concept visuel","Key visual","Déclinaisons print","Déclinaisons social media"]},
 {id:2,title:"Social Impact",tag:"Digital",client:"Projet digital",year:"2026",sector:"Communication",c1:"#2B2E83",c2:"#6B70D6",desc:"Système de contenus social media conçu pour garder une présence régulière, reconnaissable et cohérente.",deliverables:["Direction visuelle","Posts","Stories","Templates"]},
 {id:3,title:"Packaging",tag:"Print",client:"Projet packaging",year:"2025",sector:"FMCG",c1:"#17173A",c2:"#F2941D",desc:"Travail de mise en valeur produit et de hiérarchie visuelle pour un support packaging destiné au point de vente.",deliverables:["Piste graphique","Hiérarchie informationnelle","Exécution","Fichiers production"]},
 {id:4,title:"PLV Retail",tag:"Print",client:"Projet retail",year:"2025",sector:"Distribution",c1:"#3C3FA0",c2:"#FFB65C",desc:"Création de supports de visibilité pensés pour attirer le regard et faciliter la compréhension de l'offre en magasin.",deliverables:["Concept","Affiche","PLV","Déclinaisons"]},
 {id:5,title:"Campagne Saison",tag:"Campagne",client:"Projet 360°",year:"2025",sector:"Grand public",c1:"#F2941D",c2:"#2B2E83",desc:"Une idée centrale adaptée à plusieurs points de contact pour conserver la même personnalité visuelle pendant toute la campagne.",deliverables:["Concept","Key visual","Digital","Print","Déclinaisons"]},
 {id:6,title:"Direction Artistique",tag:"Direction artistique",client:"Projet créatif",year:"2026",sector:"Communication",c1:"#17173A",c2:"#6B70D6",desc:"Construction d'une direction visuelle de campagne : ton, composition, rythme, système graphique et supervision des déclinaisons.",deliverables:["Moodboard","Direction artistique","Système graphique","Suivi créatif"]}
];

let projects=loadProjects(), currentIndex=0, galleryIndex=0, imageData=[];

function normalizeProject(p){
 const images=Array.isArray(p.images)?p.images:(p.image?[p.image]:[]);
 return {...p,images:images.slice(0,6),image:images[0]||""};
}
function loadProjects(){try{const x=JSON.parse(localStorage.getItem(STORAGE_KEY));return Array.isArray(x)&&x.length?x.map(normalizeProject):structuredClone(defaultProjects).map(normalizeProject)}catch{return structuredClone(defaultProjects).map(normalizeProject)}}
function saveProjects(){
 try{localStorage.setItem(STORAGE_KEY,JSON.stringify(projects)); return true}
 catch(e){alert("La mémoire du navigateur est pleine. Réduis la taille des images puis réessaie."); return false}
}
function esc(s=""){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}

function renderProjects(filter="Tous"){
 const grid=document.getElementById("workGrid");
 const list=projects.filter(p=>filter==="Tous"||p.tag===filter);
 grid.innerHTML=list.map(p=>`
 <article class="work-card" data-id="${p.id}" tabindex="0" aria-label="Voir ${esc(p.title)}">
   <div class="work-image" style="--c1:${esc(p.c1||"#2B2E83")};--c2:${esc(p.c2||"#17173A")}">
     ${(p.images&&p.images.length?p.images[0]:p.image)?`<img src="${esc((p.images&&p.images.length?p.images[0]:p.image))}" alt="${esc(p.title)}">`:`<div class="work-art"><div class="art-word">${esc(p.title.split(" ").slice(0,2).join("<br>"))}<br><em>${esc((p.tag||"DESIGN").toUpperCase())}</em></div></div>`}
   </div>
   <div class="work-info"><div><h3>${esc(p.title)}</h3><span>${esc(p.tag)} · ${esc(p.year||"")}</span></div><div class="work-arrow">↗</div></div>
 </article>`).join("");
 if(!list.length) grid.innerHTML=`<p style="color:var(--muted)">Aucun projet dans cette catégorie pour le moment.</p>`;
 grid.querySelectorAll(".work-card").forEach(card=>{card.addEventListener("click",()=>openModal(Number(card.dataset.id)));card.addEventListener("keydown",e=>{if(e.key==="Enter")openModal(Number(card.dataset.id))})});
}

function openModal(id){
 currentIndex=projects.findIndex(p=>p.id===id); if(currentIndex<0)return;
 galleryIndex=0; renderModalProject();
 const o=document.getElementById("modalOverlay");o.classList.add("open");o.setAttribute("aria-hidden","false");document.body.classList.add("locked");
}
function renderModalProject(){
 const p=normalizeProject(projects[currentIndex]);
 document.getElementById("modalTag").textContent=p.tag||"Projet";
 document.getElementById("modalTitle").textContent=p.title;
 document.getElementById("modalMeta").textContent=[p.client,p.year,p.sector].filter(Boolean).join(" · ");
 document.getElementById("modalDesc").textContent=p.desc||"";
 document.getElementById("modalDeliverables").innerHTML=(p.deliverables||[]).map(x=>`<li>${esc(x)}</li>`).join("");
 const images=(p.images&&p.images.length?p.images:[p.image]).filter(Boolean);
 const media=document.getElementById("modalMedia"), hero=document.getElementById("modalHero");
 hero.style.background=`linear-gradient(135deg, ${p.c1||"#2B2E83"}, ${p.c2||"#17173A"})`;
 if(images.length){
   const src=images[galleryIndex]||images[0];
   media.innerHTML=`<img class="modal-main-image" src="${esc(src)}" alt="${esc(p.title)} — visuel ${galleryIndex+1}" loading="eager">`;
   const img=media.querySelector("img");
   img.onload=()=>{hero.style.setProperty("--media-ratio", `${img.naturalWidth}/${img.naturalHeight}`)};
   document.getElementById("galleryCounter").textContent=`${galleryIndex+1} / ${images.length}`;
   document.getElementById("galleryPrev").hidden=images.length<2;document.getElementById("galleryNext").hidden=images.length<2;
 }else{
   media.innerHTML=`<div class="modal-placeholder"><div class="art-word">${esc(p.title)}<br><em>${esc((p.tag||"DESIGN").toUpperCase())}</em></div></div>`;
   hero.style.setProperty("--media-ratio","16/9");document.getElementById("galleryCounter").textContent="";document.getElementById("galleryPrev").hidden=true;document.getElementById("galleryNext").hidden=true;
 }
 const thumbs=document.getElementById("galleryThumbs");
 thumbs.innerHTML=images.map((src,i)=>`<button class="gallery-thumb ${i===galleryIndex?"active":""}" data-i="${i}" aria-label="Voir le visuel ${i+1}"><img src="${esc(src)}" alt=""></button>`).join("");
 thumbs.querySelectorAll("button").forEach(b=>b.onclick=()=>{galleryIndex=Number(b.dataset.i);renderModalProject()});
}
function moveGallery(dir){
 const p=normalizeProject(projects[currentIndex]);const images=(p.images&&p.images.length?p.images:[p.image]).filter(Boolean);if(images.length<2)return;
 galleryIndex=(galleryIndex+dir+images.length)%images.length;renderModalProject();
}
function closeModal(){document.getElementById("modalOverlay").classList.remove("open");document.body.classList.remove("locked")}
function moveModal(dir){if(!projects.length)return;currentIndex=(currentIndex+dir+projects.length)%projects.length;openModal(projects[currentIndex].id)}

document.querySelectorAll(".filters button").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll(".filters button").forEach(x=>x.classList.remove("active"));b.classList.add("active");renderProjects(b.dataset.filter)}));
document.getElementById("modalClose").onclick=closeModal;
document.getElementById("modalOverlay").addEventListener("click",e=>{if(e.target.id==="modalOverlay")closeModal()});
document.getElementById("modalPrev").onclick=()=>moveModal(-1);
document.getElementById("modalNext").onclick=()=>moveModal(1);
document.getElementById("galleryPrev").onclick=()=>moveGallery(-1);
document.getElementById("galleryNext").onclick=()=>moveGallery(1);

const menuBtn=document.getElementById("menuBtn"),navLinks=document.getElementById("navLinks");
menuBtn.onclick=()=>{const open=navLinks.classList.toggle("open");menuBtn.setAttribute("aria-expanded",open)};
navLinks.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>navLinks.classList.remove("open")));

document.getElementById("contactForm").addEventListener("submit",e=>{
 e.preventDefault();const f=new FormData(e.currentTarget);
 const subject=encodeURIComponent("Projet — "+f.get("name"));
 const body=encodeURIComponent(`Bonjour Enosh,\n\nNom : ${f.get("name")}\nEmail : ${f.get("email")}\n\nProjet :\n${f.get("message")}\n\nMerci.`);
 window.location.href=`mailto:contact@enoshgraphist.com?subject=${subject}&body=${body}`;
 document.querySelector(".field-status").textContent="Votre messagerie va s'ouvrir avec le brief prérempli.";
});

const adminOverlay=document.getElementById("adminOverlay");
document.getElementById("adminOpen").onclick=()=>{adminOverlay.classList.add("open");adminOverlay.setAttribute("aria-hidden","false");document.body.classList.add("locked")};
document.getElementById("adminClose").onclick=()=>{adminOverlay.classList.remove("open");document.body.classList.remove("locked")};
document.getElementById("adminLoginBtn").onclick=loginAdmin;
document.getElementById("adminPassword").addEventListener("keydown",e=>{if(e.key==="Enter")loginAdmin()});

function loginAdmin(){
 const s=document.getElementById("adminLoginStatus");
 if(document.getElementById("adminPassword").value!==ADMIN_PASSWORD){s.textContent="Mot de passe incorrect.";return}
 document.getElementById("adminLogin").hidden=true;document.getElementById("adminArea").hidden=false;renderAdmin();
}
function renderAdmin(){
 const list=document.getElementById("adminList");
 list.innerHTML=projects.map(p=>`<div class="admin-item"><div><b>${esc(p.title)}</b><br><small>${esc(p.tag)} · ${esc(p.year||"")}</small></div><div class="admin-item-actions"><button data-edit="${p.id}">Modifier</button><button data-del="${p.id}">Supprimer</button></div></div>`).join("");
 list.querySelectorAll("[data-edit]").forEach(b=>b.onclick=()=>editProject(Number(b.dataset.edit)));
 list.querySelectorAll("[data-del]").forEach(b=>b.onclick=()=>deleteProject(Number(b.dataset.del)));
}
function resetForm(){
 document.getElementById("adminForm").reset();document.getElementById("projectId").value="";imageData=[];renderImagePreview();document.getElementById("pColor1").value="#2B2E83";document.getElementById("pColor2").value="#17173A";
}
function renderImagePreview(){
 const wrap=document.getElementById("imagePreview");document.getElementById("imageCount").textContent=`${imageData.length}/6`;
 wrap.innerHTML=imageData.map((src,i)=>`<div class="image-preview-item"><img src="${esc(src)}" alt="Visuel ${i+1}"><button type="button" data-remove-image="${i}" aria-label="Supprimer le visuel ${i+1}">×</button><span>${i+1}</span></div>`).join("");
 wrap.querySelectorAll("[data-remove-image]").forEach(b=>b.onclick=()=>{imageData.splice(Number(b.dataset.removeImage),1);renderImagePreview();autoSaveDraft()});
}
function editProject(id){
 const p=projects.find(x=>x.id===id);if(!p)return;
 document.getElementById("projectId").value=p.id;document.getElementById("pTitle").value=p.title||"";document.getElementById("pTag").value=p.tag||"";document.getElementById("pClient").value=p.client||"";document.getElementById("pYear").value=p.year||"";document.getElementById("pSector").value=p.sector||"";document.getElementById("pColor1").value=p.c1||"#2B2E83";document.getElementById("pColor2").value=p.c2||"#17173A";document.getElementById("pDesc").value=p.desc||"";document.getElementById("pDeliverables").value=(p.deliverables||[]).join("\n");imageData=(p.images&&p.images.length?p.images:(p.image?[p.image]:[])).slice(0,6);renderImagePreview();
}
function deleteProject(id){if(!confirm("Supprimer ce projet ?"))return;projects=projects.filter(p=>p.id!==id);saveProjects();renderAdmin();renderProjects(document.querySelector(".filters .active").dataset.filter)}
document.getElementById("adminCancel").onclick=resetForm;
document.getElementById("removeImage").onclick=()=>{imageData=[];renderImagePreview();autoSaveDraft()};
document.getElementById("pImage").addEventListener("change",e=>{
 const files=[...e.target.files].filter(f=>f.type.startsWith("image/"));if(!files.length)return;
 if(imageData.length+files.length>6){alert("Maximum 6 images par projet.");e.target.value="";return}
 let done=0;
 files.forEach(file=>{compressImage(file,(data)=>{imageData.push(data);done++;if(done===files.length){renderImagePreview();autoSaveDraft();e.target.value=""}})});
});
function compressImage(file,cb){
 const r=new FileReader();r.onload=()=>{const img=new Image();img.onload=()=>{const max=1800,scale=Math.min(1,max/Math.max(img.naturalWidth,img.naturalHeight));const c=document.createElement("canvas");c.width=Math.round(img.naturalWidth*scale);c.height=Math.round(img.naturalHeight*scale);c.getContext("2d").drawImage(img,0,0,c.width,c.height);cb(c.toDataURL("image/jpeg",.82))};img.src=r.result};r.readAsDataURL(file);
}
function formProject(){return normalizeProject({id:Number(document.getElementById("projectId").value)||Date.now(),title:document.getElementById("pTitle").value.trim(),tag:document.getElementById("pTag").value.trim(),client:document.getElementById("pClient").value.trim(),year:document.getElementById("pYear").value.trim(),sector:document.getElementById("pSector").value.trim(),c1:document.getElementById("pColor1").value,c2:document.getElementById("pColor2").value,desc:document.getElementById("pDesc").value.trim(),deliverables:document.getElementById("pDeliverables").value.split("\n").map(x=>x.trim()).filter(Boolean),images:imageData});}
function autoSaveDraft(){try{localStorage.setItem("enosh_project_draft_v1",JSON.stringify(formProject()))}catch{}}
document.getElementById("adminForm").addEventListener("input",autoSaveDraft);
document.getElementById("adminForm").addEventListener("submit",e=>{
 e.preventDefault();const p=formProject();if(!p.title||!p.tag){document.getElementById("adminStatus").textContent="Titre et catégorie sont obligatoires.";return}
 const i=projects.findIndex(x=>x.id===p.id);if(i>=0)projects[i]=p;else projects.push(p);
 if(saveProjects()){localStorage.removeItem("enosh_project_draft_v1");renderAdmin();renderProjects(document.querySelector(".filters .active").dataset.filter);resetForm();document.getElementById("adminStatus").textContent="✓ Projet enregistré automatiquement dans ce navigateur."}
});

document.getElementById("adminExport").onclick=()=>{
 const blob=new Blob([JSON.stringify(projects,null,2)],{type:"application/json"}),a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="enosh-projects.json";a.click();URL.revokeObjectURL(a.href);
};
document.getElementById("adminImport").addEventListener("change",e=>{
 const file=e.target.files[0];if(!file)return;const r=new FileReader();
 r.onload=()=>{try{const data=JSON.parse(r.result);if(!Array.isArray(data))throw 0;projects=data.map(normalizeProject);saveProjects();renderAdmin();renderProjects("Tous");document.getElementById("adminStatus").textContent="Import terminé."}catch{alert("Fichier JSON invalide.")}};r.readAsText(file);
});
document.getElementById("adminReset").onclick=()=>{if(confirm("Revenir aux projets par défaut ?")){projects=structuredClone(defaultProjects).map(normalizeProject);saveProjects();renderAdmin();renderProjects("Tous")}};

document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeModal();adminOverlay.classList.remove("open");document.body.classList.remove("locked")}});

renderProjects("Tous");
