/* CH3RRY DESAPEGOS — catálogo editável pelo próprio site 🍒
   As peças adicionadas pelo painel ficam salvas neste navegador (localStorage).
   Para publicar as alterações para todo mundo, use o botão "Exportar catálogo"
   e substitua o catálogo no arquivo do site, ou peça uma nova versão do arquivo.
*/

const defaultProducts = [
  {id:crypto.randomUUID(), name:"Baby tee cerejinha", price:"R$ 35,00", condition:"Usadas", style:"Paty", emoji:"🍒", whatsappText:"Oi! Quero saber sobre a Baby tee cerejinha."},
  {id:crypto.randomUUID(), name:"Calça cargo Y2K", price:"R$ 55,00", condition:"Semi novas", style:"Baddie", emoji:"👖", whatsappText:"Oi! Quero saber sobre a Calça cargo Y2K."},
  {id:crypto.randomUUID(), name:"Regata básica", price:"R$ 25,00", condition:"Usadas", style:"Casual", emoji:"👚", whatsappText:"Oi! Quero saber sobre a Regata básica."},
  {id:crypto.randomUUID(), name:"Jaqueta mix & match", price:"R$ 70,00", condition:"Nunca usadas", style:"Mistura", emoji:"🧥", whatsappText:"Oi! Quero saber sobre a Jaqueta mix & match."},
  {id:crypto.randomUUID(), name:"Saia plissada", price:"R$ 45,00", condition:"Semi novas", style:"Paty", emoji:"🎀", whatsappText:"Oi! Quero saber sobre a Saia plissada."},
  {id:crypto.randomUUID(), name:"Top fashion", price:"R$ 30,00", condition:"Nunca usadas", style:"Baddie", emoji:"💋", whatsappText:"Oi! Quero saber sobre o Top fashion."},
  {id:crypto.randomUUID(), name:"Jeans vintage", price:"R$ 50,00", condition:"Usadas", style:"Casual", emoji:"✨", whatsappText:"Oi! Quero saber sobre o Jeans vintage."},
  {id:crypto.randomUUID(), name:"Peça surpresa", price:"R$ 40,00", condition:"Semi novas", style:"Mistura", emoji:"💿", whatsappText:"Oi! Quero saber sobre a Peça surpresa."}
];

let products = JSON.parse(localStorage.getItem("ch3rryProducts") || "null") || defaultProducts;
const saveProducts = () => localStorage.setItem("ch3rryProducts", JSON.stringify(products));
const productsEl = document.querySelector("#products");
const wa = "https://wa.me/qr/SQVBC7DEONRAC1";

function render(condition="Todos", style="Todos"){
  productsEl.innerHTML = "";
  const filtered = products.filter(p => (condition==="Todos" || p.condition===condition) && (style==="Todos" || p.style===style));
  if(!filtered.length){ productsEl.innerHTML = '<div class="empty-products">🍒 Nenhuma peça encontrada nessa combinação. Tente outra aba!</div>'; return; }
  filtered.forEach(p=>{
    const card=document.createElement("article"); card.className="product";
    const visual = p.image
      ? `<img class="product-img" src="${p.image}" alt="${p.name}" loading="lazy">`
      : `<div class="product-img" aria-label="${p.name}"><span>${p.condition}</span>${p.emoji || "👗"}</div>`;
    const message = encodeURIComponent(p.whatsappText || `Oi! Quero saber sobre a ${p.name}.`);
    card.innerHTML = `${visual}<div class="product-info">
      <h3>${p.name}</h3><p>${p.condition} • Estilo ${p.style}</p><div class="price">${p.price}</div>
      <a class="buy" target="_blank" rel="noopener" href="${wa}?text=${message}">QUERO ESSA ♡</a>
    </div>`;
    productsEl.appendChild(card);
  });
}
render();

function rerender(){
  const condition=document.querySelector(".condition-tab.active").dataset.condition;
  const style=document.querySelector(".style-tab.active").dataset.style;
  render(condition,style);
}

document.querySelectorAll(".condition-tab").forEach(btn=>btn.addEventListener("click",()=>{
  document.querySelectorAll(".condition-tab").forEach(b=>b.classList.remove("active")); btn.classList.add("active"); rerender();
}));
document.querySelectorAll(".style-tab").forEach(btn=>btn.addEventListener("click",()=>{
  document.querySelectorAll(".style-tab").forEach(b=>b.classList.remove("active")); btn.classList.add("active"); rerender();
}));

const menu=document.querySelector(".menu-btn"), nav=document.querySelector("#main-nav");
menu.addEventListener("click",()=>nav.classList.toggle("open"));

// ===== Painel para adicionar peças =====
const form=document.querySelector("#product-form");
const photoInput=document.querySelector("#product-photo");
const preview=document.querySelector("#photo-preview");
photoInput.addEventListener("change",()=>{
  const file=photoInput.files[0];
  if(!file){ preview.hidden=true; return; }
  const reader=new FileReader(); reader.onload=e=>{ preview.src=e.target.result; preview.hidden=false; }; reader.readAsDataURL(file);
});

form.addEventListener("submit", e=>{
  e.preventDefault();
  const name=document.querySelector("#product-name").value.trim();
  const price=document.querySelector("#product-price").value.trim();
  const condition=document.querySelector("#product-condition").value;
  const style=document.querySelector("#product-style").value;
  const emoji=document.querySelector("#product-emoji").value.trim() || "👗";
  const file=photoInput.files[0];
  const finish=image=>{
    products.unshift({id:crypto.randomUUID(),name,price,condition,style,emoji,image,whatsappText:`Oi! Quero saber sobre a ${name}.`});
    saveProducts(); rerender(); form.reset(); preview.hidden=true;
    document.querySelector("#add-result").textContent="✨ Peça adicionada ao seu garimpo!";
  };
  if(file){ const reader=new FileReader(); reader.onload=e=>finish(e.target.result); reader.readAsDataURL(file); }
  else finish("");
});

function renderManageList(){
  const list=document.querySelector("#manage-list"); list.innerHTML="";
  products.forEach(p=>{
    const row=document.createElement("div"); row.className="manage-row";
    row.innerHTML=`<span>${p.image ? "📷" : (p.emoji||"👗")} <strong>${p.name}</strong><small>${p.condition} • ${p.style}</small></span><button data-id="${p.id}" class="delete-product">EXCLUIR</button>`;
    list.appendChild(row);
  });
  list.querySelectorAll(".delete-product").forEach(btn=>btn.addEventListener("click",()=>{
    products=products.filter(p=>p.id!==btn.dataset.id); saveProducts(); renderManageList(); rerender();
  }));
}

document.querySelector("#manage-toggle").addEventListener("click",()=>{
  const panel=document.querySelector("#manage-panel"); panel.classList.toggle("show");
  if(panel.classList.contains("show")) renderManageList();
});
document.querySelector("#reset-catalog").addEventListener("click",()=>{
  if(confirm("Voltar para as peças de exemplo? As peças adicionadas neste navegador serão apagadas.")){ products=defaultProducts; saveProducts(); renderManageList(); rerender(); }
});
document.querySelector("#export-catalog").addEventListener("click",()=>{
  const blob=new Blob([JSON.stringify(products,null,2)],{type:"application/json"});
  const a=document.createElement("a"); a.href=URL.createObjectURL(blob); a.download="ch3rry-catalogo.json"; a.click(); URL.revokeObjectURL(a.href);
});

const answers = [
  [/como comprar|comprar|quero essa/i, "É facinho! 🍒 Escolha a peça, clique em “QUERO ESSA ♡” e fale com a gente pelo WhatsApp. Aí combinamos disponibilidade, pagamento e entrega/retirada em Campo Maior."],
  [/entrega|retirada|enviar|envio/i, "Atenção, bestie: 🛵 fazemos entrega ou retirada somente em Campo Maior, Piauí. Não enviamos para fora da cidade."],
  [/estilo|paty|baddie|casual|mistura/i, "Temos Estilo Paty, Baddie, Casual e Mistura de Estilos. 💿 E você pode separar as peças por condição: Usadas, Semi novas ou Nunca usadas!"],
  [/peças|roupa|catálogo|ver/i, "Claro! 🍒 Role para a área “Encontre seu próximo xodó” e escolha uma categoria. As peças disponíveis aparecem ali."],
  [/whatsapp|contato/i, "Para atendimento e compra, use o WhatsApp. 💗 O botão de cada peça já pode abrir uma mensagem pronta."],
  [/instagram/i, "Nosso Instagram é @ch3rrydesapego. ✨ Você encontra o link dele no rodapé do site."],
  [/oi|olá|ola|oie/i, "Oii! 🐆🍒 Que bom te ver por aqui! Quer saber como comprar, sobre entrega ou ver os estilos?"]
];
function botReply(text){ for(const [regex,answer] of answers) if(regex.test(text)) return answer; return "Hmmm, não peguei essa ainda! 🐆💗 Tenta perguntar sobre como comprar, entrega, retirada, estilos, peças, WhatsApp ou Instagram."; }
function addMessage(text, who){ const el=document.createElement("div"); el.className=`msg ${who}`; el.textContent=text; const box=document.querySelector("#chat-messages"); box.appendChild(el); box.scrollTop=box.scrollHeight; }
function send(text){ if(!text.trim()) return; addMessage(text,"user"); setTimeout(()=>addMessage(botReply(text),"bot"),350); }
document.querySelector("#chat-form").addEventListener("submit",e=>{e.preventDefault();const input=document.querySelector("#chat-input");send(input.value);input.value="";});
document.querySelectorAll(".quick-actions button").forEach(b=>b.addEventListener("click",()=>send(b.dataset.question)));
