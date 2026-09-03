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

let projects=loadProjects(), currentIndex=0, imageData="";

function loadProjects(){try{const x=JSON.parse(localStorage.getItem(STORAGE_KEY));return Array.isArray(x)&&x.length?x:structuredClone(defaultProjects)}catch{return structuredClone(defaultProjects)}}
function saveProjects(){localStorage.setItem(STORAGE_KEY,JSON.stringify(projects))}
function esc(s=""){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}

function renderProjects(filter="Tous"){
 const grid=document.getElementById("workGrid");
 const list=projects.filter(p=>filter==="Tous"||p.tag===filter);
 grid.innerHTML=list.map(p=>`
 <article class="work-card" data-id="${p.id}" tabindex="0" aria-label="Voir ${esc(p.title)}">
   <div class="work-image" style="--c1:${esc(p.c1||"#2B2E83")};--c2:${esc(p.c2||"#17173A")}">
     ${p.image?`<img src="${esc(p.image)}" alt="${esc(p.title)}">`:`<div class="work-art"><div class="art-word">${esc(p.title.split(" ").slice(0,2).join("<br>"))}<br><em>${esc((p.tag||"DESIGN").toUpperCase())}</em></div></div>`}
   </div>
   <div class="work-info"><div><h3>${esc(p.title)}</h3><span>${esc(p.tag)} · ${esc(p.year||"")}</span></div><div class="work-arrow">↗</div></div>
 </article>`).join("");
 if(!list.length) grid.innerHTML=`<p style="color:var(--muted)">Aucun projet dans cette catégorie pour le moment.</p>`;
 grid.querySelectorAll(".work-card").forEach(card=>{card.addEventListener("click",()=>openModal(Number(card.dataset.id)));card.addEventListener("keydown",e=>{if(e.key==="Enter")openModal(Number(card.dataset.id))})});
}

function openModal(id){
 currentIndex=projects.findIndex(p=>p.id===id); if(currentIndex<0)return;
 const p=projects[currentIndex];
 document.getElementById("modalTag").textContent=p.tag||"Projet";
 document.getElementById("modalTitle").textContent=p.title;
 document.getElementById("modalMeta").textContent=[p.client,p.year,p.sector].filter(Boolean).join(" · ");
 document.getElementById("modalDesc").textContent=p.desc||"";
 document.getElementById("modalDeliverables").innerHTML=(p.deliverables||[]).map(x=>`<li>${esc(x)}</li>`).join("");
 const hero=document.getElementById("modalHero");
 hero.style.background=`linear-gradient(135deg, ${p.c1||"#2B2E83"}, ${p.c2||"#17173A"})`;
 hero.innerHTML=p.image?`<img src="${esc(p.image)}" alt="" style="width:100%;height:100%;object-fit:cover">`:`<div class="art-word" style="top:35px;left:35px;font-size:clamp(48px,8vw,90px)">${esc(p.title)}<br><em>${esc((p.tag||"DESIGN").toUpperCase())}</em></div>`;
 const o=document.getElementById("modalOverlay");o.classList.add("open");o.setAttribute("aria-hidden","false");document.body.classList.add("locked");
}
function closeModal(){document.getElementById("modalOverlay").classList.remove("open");document.body.classList.remove("locked")}
function moveModal(dir){if(!projects.length)return;currentIndex=(currentIndex+dir+projects.length)%projects.length;openModal(projects[currentIndex].id)}

document.querySelectorAll(".filters button").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll(".filters button").forEach(x=>x.classList.remove("active"));b.classList.add("active");renderProjects(b.dataset.filter)}));
document.getElementById("modalClose").onclick=closeModal;
document.getElementById("modalOverlay").addEventListener("click",e=>{if(e.target.id==="modalOverlay")closeModal()});
document.getElementById("modalPrev").onclick=()=>moveModal(-1);
document.getElementById("modalNext").onclick=()=>moveModal(1);

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
 document.getElementById("adminForm").reset();document.getElementById("projectId").value="";imageData="";document.getElementById("imagePreview").innerHTML="";document.getElementById("pColor1").value="#2B2E83";document.getElementById("pColor2").value="#17173A";
}
function editProject(id){
 const p=projects.find(x=>x.id===id);if(!p)return;
 document.getElementById("projectId").value=p.id;document.getElementById("pTitle").value=p.title||"";document.getElementById("pTag").value=p.tag||"";document.getElementById("pClient").value=p.client||"";document.getElementById("pYear").value=p.year||"";document.getElementById("pSector").value=p.sector||"";document.getElementById("pColor1").value=p.c1||"#2B2E83";document.getElementById("pColor2").value=p.c2||"#17173A";document.getElementById("pDesc").value=p.desc||"";document.getElementById("pDeliverables").value=(p.deliverables||[]).join("\n");imageData=p.image||"";document.getElementById("imagePreview").innerHTML=imageData?`<img src="${esc(imageData)}" alt="">`:"";
}
function deleteProject(id){if(!confirm("Supprimer ce projet ?"))return;projects=projects.filter(p=>p.id!==id);saveProjects();renderAdmin();renderProjects(document.querySelector(".filters .active").dataset.filter)}
document.getElementById("adminCancel").onclick=resetForm;
document.getElementById("removeImage").onclick=()=>{imageData="";document.getElementById("imagePreview").innerHTML=""};
document.getElementById("pImage").addEventListener("change",e=>{
 const file=e.target.files[0];if(!file)return;
 if(file.size>3*1024*1024){alert("Image trop lourde. Maximum : 3 Mo.");e.target.value="";return}
 const r=new FileReader();r.onload=()=>{imageData=r.result;document.getElementById("imagePreview").innerHTML=`<img src="${esc(imageData)}" alt="">`};r.readAsDataURL(file);
});
document.getElementById("adminForm").addEventListener("submit",e=>{
 e.preventDefault();
 const id=Number(document.getElementById("projectId").value)||Date.now();
 const p={id,title:document.getElementById("pTitle").value.trim(),tag:document.getElementById("pTag").value.trim(),client:document.getElementById("pClient").value.trim(),year:document.getElementById("pYear").value.trim(),sector:document.getElementById("pSector").value.trim(),c1:document.getElementById("pColor1").value,c2:document.getElementById("pColor2").value,desc:document.getElementById("pDesc").value.trim(),deliverables:document.getElementById("pDeliverables").value.split("\n").map(x=>x.trim()).filter(Boolean),image:imageData};
 const i=projects.findIndex(x=>x.id===id);if(i>=0)projects[i]=p;else projects.push(p);saveProjects();renderAdmin();renderProjects(document.querySelector(".filters .active").dataset.filter);resetForm();document.getElementById("adminStatus").textContent="Projet enregistré.";
});
document.getElementById("adminExport").onclick=()=>{
 const blob=new Blob([JSON.stringify(projects,null,2)],{type:"application/json"}),a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="enosh-projects.json";a.click();URL.revokeObjectURL(a.href);
};
document.getElementById("adminImport").addEventListener("change",e=>{
 const file=e.target.files[0];if(!file)return;const r=new FileReader();
 r.onload=()=>{try{const data=JSON.parse(r.result);if(!Array.isArray(data))throw 0;projects=data;saveProjects();renderAdmin();renderProjects("Tous");document.getElementById("adminStatus").textContent="Import terminé."}catch{alert("Fichier JSON invalide.")}};r.readAsText(file);
});
document.getElementById("adminReset").onclick=()=>{if(confirm("Revenir aux projets par défaut ?")){projects=structuredClone(defaultProjects);saveProjects();renderAdmin();renderProjects("Tous")}};

document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeModal();adminOverlay.classList.remove("open");document.body.classList.remove("locked")}});

renderProjects("Tous");
