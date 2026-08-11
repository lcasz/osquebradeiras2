/* ============================================================
   OS QUEBRADEIRAS — FOOTBALL MANAGEMENT
   script.js
   ============================================================ */

/* ==================== STORAGE KEYS ==================== */
const LS_KEY = 'quebradeiras_data_v1';
const SEED_URL = 'data/dados.json';

/* ==================== SINCRONIZAÇÃO EM NUVEM ====================
   Isso é o que permite que QUALQUER pessoa edite o site (em
   qualquer computador ou celular) e todo mundo que abrir o link
   veja a última versão editada — em vez de cada edição ficar
   presa só no navegador de quem editou.

   COMO ATIVAR (grátis, leva uns 2 minutos):
   1. Crie uma conta grátis em https://jsonbin.io
   2. No painel, vá em "API Keys" e copie a sua "X-Master-Key"
   3. Clique em "Create Bin", cole o conteúdo abaixo e crie:
        {}
      Copie o "Bin ID" que aparece na URL do bin criado.
   4. Cole os dois valores nos campos abaixo e troque "enabled"
      para true.
   5. Salve este arquivo, publique no GitHub Pages (ou onde for
      hospedar) e pronto: o site inteiro passa a compartilhar os
      mesmos dados entre todos os visitantes.

   Sem essa configuração, o site funciona normalmente, só que cada
   edição fica salva apenas no navegador de quem editou (modo local).

   Obs.: as fotos (imagens em base64) NÃO são enviadas à nuvem,
   pois são grandes demais para o plano gratuito do jsonbin.io
   (limite de 100kb por bin). Elas continuam salvas normalmente,
   mas apenas no navegador/dispositivo de quem fez o upload. Todo
   o resto (jogadores, técnicos, escalação, campos, reservas,
   calendário, cores, textos) é sincronizado para todo mundo.
======================================================================= */
const CLOUD_CONFIG = {
  enabled: true,
  binId: '6a7baa96f5f4af5e29095fa0',
  apiKey: '$2a$10$EmqjWY6mZ/.OmkZDwAi1dOw/YmfZgjJGqrlcu6TC4D4hiw.lx5Fla'
};
const CLOUD_BASE = 'https://api.jsonbin.io/v3/b';
const CLOUD_POLL_MS = 25000; // intervalo para checar edições de outras pessoas

/* ==================== DEFAULT DATA ==================== */
function uid(prefix){ return prefix + '_' + Math.random().toString(36).slice(2,9); }

function defaultData(){
  return {
    theme: 'dark',
    teamSettings:{
      nome:'Os Quebradeiras',
      frase:'Juntos no campo. Imbatíveis na resenha.',
      fundacao:'2018',
      cidade:'Zona Leste',
      tecnico:'Lucas "Lupão"',
      capitao:'Sid',
      titulos:'3x Campeão da Liga da Várzea · 1x Copa Amistosa',
      historia:'Nascido em uma rodinha de pelada de domingo, Os Quebradeiras cresceu até virar um dos times mais respeitados (e temidos) da região. Entre dribles, resenhas e alguns caneladas históricas, o grupo construiu uma identidade única: joga sério dentro de campo e é só alegria fora dele.',
      corDestaque:'#D4AF37',
      corFundo:'#050505'
    },
    coaches:[
      {id:uid('co'), nome:'Lucas "Lupão"', cargo:'Técnico Principal', numero:'01', descricao:'Comanda Os Quebradeiras dentro e fora de campo.', foto:null},
      {id:uid('co'), nome:'Técnico 2 (edite aqui)', cargo:'Auxiliar Técnico', numero:'02', descricao:'Clique para editar o nome e a descrição.', foto:null},
      {id:uid('co'), nome:'Técnico 3 (edite aqui)', cargo:'Preparador Físico', numero:'03', descricao:'Clique para editar o nome e a descrição.', foto:null}
    ],
    players:[
      {id:uid('pl'), nome:'Rick', apelido:'', numero:1, posicao:'GOL', status:'Titular', foto:null, gols:0, assistencias:0, jogos:0, cartoesAmarelos:0, cartoesVermelhos:0, capitao:false, vice:false},
      {id:uid('pl'), nome:'Anderson', apelido:'', numero:2, posicao:'ZAG', status:'Titular', foto:null, gols:0, assistencias:0, jogos:0, cartoesAmarelos:0, cartoesVermelhos:0, capitao:false, vice:false},
      {id:uid('pl'), nome:'Izaquel', apelido:'', numero:3, posicao:'ZAG', status:'Titular', foto:null, gols:0, assistencias:0, jogos:0, cartoesAmarelos:0, cartoesVermelhos:0, capitao:false, vice:false},
      {id:uid('pl'), nome:'Bruno', apelido:'', numero:4, posicao:'LAT', status:'Titular', foto:null, gols:0, assistencias:0, jogos:0, cartoesAmarelos:0, cartoesVermelhos:0, capitao:false, vice:false},
      {id:uid('pl'), nome:'Devyd', apelido:'', numero:5, posicao:'LAT', status:'Titular', foto:null, gols:0, assistencias:0, jogos:0, cartoesAmarelos:0, cartoesVermelhos:0, capitao:false, vice:false},
      {id:uid('pl'), nome:'Rafinha', apelido:'', numero:6, posicao:'VOL', status:'Titular', foto:null, gols:0, assistencias:0, jogos:0, cartoesAmarelos:0, cartoesVermelhos:0, capitao:false, vice:false},
      {id:uid('pl'), nome:'Felipe', apelido:'', numero:7, posicao:'VOL', status:'Titular', foto:null, gols:0, assistencias:0, jogos:0, cartoesAmarelos:0, cartoesVermelhos:0, capitao:false, vice:false},
      {id:uid('pl'), nome:'Zico', apelido:'', numero:8, posicao:'MEI', status:'Titular', foto:null, gols:0, assistencias:0, jogos:0, cartoesAmarelos:0, cartoesVermelhos:0, capitao:false, vice:false},
      {id:uid('pl'), nome:'Max', apelido:'Gago', numero:9, posicao:'MEI', status:'Titular', foto:null, gols:0, assistencias:0, jogos:0, cartoesAmarelos:0, cartoesVermelhos:0, capitao:false, vice:false},
      {id:uid('pl'), nome:'Sid', apelido:'', numero:10, posicao:'ATA', status:'Titular', foto:null, gols:0, assistencias:0, jogos:0, cartoesAmarelos:0, cartoesVermelhos:0, capitao:true, vice:false},
      {id:uid('pl'), nome:'Adryan', apelido:'Rajadão', numero:11, posicao:'ATA', status:'Titular', foto:null, gols:0, assistencias:0, jogos:0, cartoesAmarelos:0, cartoesVermelhos:0, capitao:false, vice:false},
      {id:uid('pl'), nome:'Erieldo', apelido:'', numero:12, posicao:'ZAG', status:'Reserva', foto:null, gols:0, assistencias:0, jogos:0, cartoesAmarelos:0, cartoesVermelhos:0, capitao:false, vice:false},
      {id:uid('pl'), nome:'Rodolfo', apelido:'', numero:13, posicao:'MEI', status:'Reserva', foto:null, gols:0, assistencias:0, jogos:0, cartoesAmarelos:0, cartoesVermelhos:0, capitao:false, vice:false},
      {id:uid('pl'), nome:'Vitin', apelido:'', numero:14, posicao:'ATA', status:'Reserva', foto:null, gols:0, assistencias:0, jogos:0, cartoesAmarelos:0, cartoesVermelhos:0, capitao:false, vice:false}
    ],
    featuredPlayerId:null,
    formationKey:'4-3-3',
    lineupSlots:[],
    fields:[
      {id:uid('fd'), nome:'Campo Principal', local:'Zona Leste', tipo:'Grama Natural', capacidade:22, descricao:'Nosso campo de casa, palco das maiores batalhas do time.', foto:null},
      {id:uid('fd'), nome:'Arena do Bairro', local:'Vila Nova', tipo:'Society', capacidade:14, descricao:'Gramado sintético com boa iluminação noturna.', foto:null},
      {id:uid('fd'), nome:'Campo Society Central', local:'Centro', tipo:'Society', capacidade:14, descricao:'Ótimo para treinos rápidos durante a semana.', foto:null},
      {id:uid('fd'), nome:'Campo Sintético Norte', local:'Zona Norte', tipo:'Sintético', capacidade:16, descricao:'Piso de última geração, ideal pra jogos rápidos.', foto:null},
      {id:uid('fd'), nome:'Arena Os Quebradeiras', local:'Zona Leste', tipo:'Personalizado', capacidade:22, descricao:'Nosso campo personalizado, com as cores do time.', foto:null}
    ],
    selectedFieldId:null,
    fieldSettings:{nome:'Arena Os Quebradeiras', tipo:'Society', gramado:'#0f5d2e', linhas:'#ffffff', iluminacao:'noturna'},
    reservations:[
      {id:uid('rv'), nome:'Racha de quarta', campoId:null, data:addDaysStr(2), horario:'19:30', duracao:'1.5', responsavel:'Lucas Ferreira', qtdJogadores:14, status:'Confirmada'},
      {id:uid('rv'), nome:'Treino tático', campoId:null, data:addDaysStr(4), horario:'20:00', duracao:'1', responsavel:'Marcão', qtdJogadores:18, status:'Pendente'}
    ],
    events:[
      {id:uid('ev'), titulo:'Treino Tático', tipo:'treino', data:addDaysStr(1), horario:'20:00', local:'Arena Os Quebradeiras'},
      {id:uid('ev'), titulo:'Os Quebradeiras x Furacão FC', tipo:'jogo', data:addDaysStr(3), horario:'16:00', local:'Campo Principal'},
      {id:uid('ev'), titulo:'Confraternização do Time', tipo:'evento', data:addDaysStr(9), horario:'19:00', local:'Arena Os Quebradeiras'}
    ]
  };
}

function addDaysStr(n){
  const d = new Date();
  d.setDate(d.getDate()+n);
  return d.toISOString().slice(0,10);
}

/* ==================== STATE ==================== */
let DATA = defaultData(); // valor provisório seguro até loadData() terminar
let cloudSyncTimer = null;
let cloudPollTimer = null;
function isAnyModalOpen(){ return !!document.querySelector('.modal-overlay.open'); }

function prepFreshData(fresh){
  if(fresh.fields && fresh.fields.length && !fresh.selectedFieldId){
    fresh.selectedFieldId = fresh.fields[fresh.fields.length-1].id;
  }
  if(fresh.reservations && fresh.fields && fresh.fields.length){
    fresh.reservations.forEach(r=>{ if(!r.campoId) r.campoId = fresh.fields[0].id; });
  }
  if(fresh.players && fresh.players.length && !fresh.featuredPlayerId){
    fresh.featuredPlayerId = fresh.players.find(p=>p.numero===10)?.id || fresh.players[0].id;
  }
  return fresh;
}

async function fetchSeedData(){
  try{
    const res = await fetch(SEED_URL, {cache:'no-store'});
    if(res.ok){
      const seed = await res.json();
      if(seed && Array.isArray(seed.players)) return prepFreshData(migrateData(seed));
    }
  }catch(e){ console.warn('Não foi possível carregar data/dados.json, usando padrão embutido.', e); }
  return prepFreshData(defaultData());
}

async function loadData(){
  // 1) tenta buscar da nuvem (dados compartilhados por todo mundo)
  if(CLOUD_CONFIG.enabled && CLOUD_CONFIG.binId && CLOUD_CONFIG.apiKey){
    try{
      const cloud = await cloudGet();
      if(cloud && Array.isArray(cloud.players)){
        const merged = migrateData(mergeLocalPhotos(cloud));
        try{ localStorage.setItem(LS_KEY, JSON.stringify(merged)); }catch(e){}
        setSyncStatus('synced');
        return merged;
      }
      // bin existe mas ainda não tem os dados do site (é a primeira vez) —
      // usa os dados iniciais e já envia pra nuvem, virando a base compartilhada
      const seeded = await fetchSeedData();
      try{
        await cloudPut(stripPhotosForCloud(seeded));
        setSyncStatus('synced');
      }catch(e){
        console.warn('Não foi possível inicializar a nuvem com os dados iniciais.', e);
        setSyncStatus('error');
      }
      try{ localStorage.setItem(LS_KEY, JSON.stringify(seeded)); }catch(e){}
      return seeded;
    }catch(e){
      console.warn('Não foi possível carregar dados da nuvem, tentando cópia local.', e);
      setSyncStatus('error');
    }
  }
  // 2) cache local deste navegador
  try{
    const raw = localStorage.getItem(LS_KEY);
    if(raw) return migrateData(JSON.parse(raw));
  }catch(e){ console.warn('Falha ao carregar dados salvos localmente.', e); }
  // 3) dados iniciais incluídos no site (data/dados.json)
  return await fetchSeedData();
}
function migrateData(d){
  const def = defaultData();
  return Object.assign({}, def, d);
}

/* ---- fotos ficam sempre locais (não vão pra nuvem, são pesadas demais) ---- */
function mergeLocalPhotos(cloudData){
  try{
    const raw = localStorage.getItem(LS_KEY);
    if(!raw) return cloudData;
    const local = JSON.parse(raw);
    ['coaches','players','fields'].forEach(key=>{
      if(!Array.isArray(cloudData[key])) return;
      cloudData[key].forEach(item=>{
        if(!item.foto){
          const match = (local[key]||[]).find(l=>l.id===item.id);
          if(match && match.foto) item.foto = match.foto;
        }
      });
    });
  }catch(e){}
  return cloudData;
}
function stripPhotosForCloud(data){
  const clone = JSON.parse(JSON.stringify(data));
  ['coaches','players','fields'].forEach(key=>{
    (clone[key]||[]).forEach(item=>{ item.foto = null; });
  });
  return clone;
}

function saveData(showToast){
  try{
    localStorage.setItem(LS_KEY, JSON.stringify(DATA));
    if(showToast) toast('Alterações salvas com sucesso', 'success');
  }catch(e){
    toast('Erro ao salvar dados (armazenamento cheio?)', 'error');
  }
  queueCloudSync();
}

/* ---- nuvem: envia (com debounce) e recebe periodicamente ---- */
function queueCloudSync(){
  if(!CLOUD_CONFIG.enabled || !CLOUD_CONFIG.binId || !CLOUD_CONFIG.apiKey) return;
  setSyncStatus('saving');
  clearTimeout(cloudSyncTimer);
  cloudSyncTimer = setTimeout(async ()=>{
    try{
      await cloudPut(stripPhotosForCloud(DATA));
      setSyncStatus('synced');
    }catch(e){
      console.warn('Falha ao sincronizar com a nuvem.', e);
      setSyncStatus('error');
    }
  }, 900);
}
async function cloudGet(){
  const res = await fetch(`${CLOUD_BASE}/${CLOUD_CONFIG.binId}/latest`, {
    headers: { 'X-Master-Key': CLOUD_CONFIG.apiKey, 'X-Bin-Meta': 'false' },
    cache: 'no-store'
  });
  if(!res.ok) throw new Error('Falha ao ler dados da nuvem (' + res.status + ')');
  return await res.json();
}
async function cloudPut(data){
  const res = await fetch(`${CLOUD_BASE}/${CLOUD_CONFIG.binId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'X-Master-Key': CLOUD_CONFIG.apiKey },
    body: JSON.stringify(data)
  });
  if(!res.ok) throw new Error('Falha ao gravar dados na nuvem (' + res.status + ')');
}
function startCloudPolling(){
  if(!CLOUD_CONFIG.enabled || !CLOUD_CONFIG.binId || !CLOUD_CONFIG.apiKey) return;
  clearInterval(cloudPollTimer);
  cloudPollTimer = setInterval(async ()=>{
    if(isAnyModalOpen()) return; // não interrompe quem está editando algo agora
    try{
      const cloud = await cloudGet();
      if(!cloud || !Array.isArray(cloud.players)) return; // bin ainda sem dados válidos, ignora
      const merged = migrateData(mergeLocalPhotos(cloud));
      if(JSON.stringify(stripPhotosForCloud(merged)) !== JSON.stringify(stripPhotosForCloud(DATA))){
        DATA = merged;
        try{ localStorage.setItem(LS_KEY, JSON.stringify(DATA)); }catch(e){}
        initAll();
        toast('Site atualizado com as edições mais recentes', 'success');
      }
      setSyncStatus('synced');
    }catch(e){
      setSyncStatus('error');
    }
  }, CLOUD_POLL_MS);
}
function setSyncStatus(status){
  const dot = document.getElementById('sync-indicator');
  const infoText = document.getElementById('sync-info-text');
  const infoBox = document.getElementById('sync-info-box');
  const map = {
    off:    {icon:'fa-house-laptop', cls:'sync-off', title:'Modo local — as edições ficam salvas só neste navegador', text:'A sincronização em nuvem está desativada. As edições feitas aqui ficam salvas apenas neste navegador. Veja no topo do script.js como ativar a sincronização compartilhada (grátis).'},
    saving: {icon:'fa-arrows-rotate fa-spin', cls:'sync-saving', title:'Sincronizando alterações...', text:'Enviando suas alterações para a nuvem...'},
    synced: {icon:'fa-cloud', cls:'sync-synced', title:'Sincronizado — visível para todos que abrirem o site', text:'Sincronizado! As edições feitas aqui já estão visíveis para todos que abrirem o site.'},
    error:  {icon:'fa-triangle-exclamation', cls:'sync-error', title:'Erro de sincronização — alterações salvas só neste navegador por enquanto', text:'Não foi possível conectar à nuvem agora. Suas alterações continuam salvas neste navegador e serão reenviadas na próxima tentativa.'}
  };
  const s = map[status] || map.off;
  if(dot){ dot.className = 'sync-indicator ' + s.cls; dot.title = s.title; dot.innerHTML = `<i class="fa-solid ${s.icon}"></i>`; }
  if(infoText) infoText.textContent = s.text;
  if(infoBox) infoBox.className = 'sync-info-box ' + s.cls;
}

/* ==================== TOASTS ==================== */
function toast(msg, type){
  const c = document.getElementById('toast-container');
  const el = document.createElement('div');
  el.className = 'toast' + (type==='error' ? ' error' : '');
  el.innerHTML = `<i class="fa-solid ${type==='error' ? 'fa-circle-exclamation' : 'fa-circle-check'}"></i><span>${msg}</span>`;
  c.appendChild(el);
  setTimeout(()=> el.remove(), 3900);
}

/* ==================== MODALS ==================== */
function openModal(id){ document.getElementById(id).classList.add('open'); }
function closeModal(id){ document.getElementById(id).classList.remove('open'); }
document.querySelectorAll('[data-close]').forEach(btn=>{
  btn.addEventListener('click', ()=> btn.closest('.modal-overlay').classList.remove('open'));
});
document.querySelectorAll('.modal-overlay').forEach(ov=>{
  ov.addEventListener('click', (e)=>{ if(e.target === ov) ov.classList.remove('open'); });
});

let confirmCallback = null;
function askConfirm(message, cb){
  document.getElementById('confirm-message').textContent = message;
  confirmCallback = cb;
  openModal('modal-confirm');
}
document.getElementById('confirm-ok-btn').addEventListener('click', ()=>{
  if(confirmCallback) confirmCallback();
  closeModal('modal-confirm');
});

/* ==================== PHOTO HELPERS ==================== */
function fileToBase64(file, cb){
  const reader = new FileReader();
  reader.onload = ()=> cb(reader.result);
  reader.readAsDataURL(file);
}
function avatarHTML(foto, fallbackIcon){
  return foto ? `<img src="${foto}" alt="">` : `<i class="fa-solid ${fallbackIcon}"></i>`;
}

/* ==================== POSITION LABELS ==================== */
const POS_LABELS = {GOL:'Goleiro', ZAG:'Zagueiro', LAT:'Lateral', VOL:'Volante', MEI:'Meia', ATA:'Atacante'};

/* ==================== THEME ==================== */
function applyTheme(){
  document.documentElement.setAttribute('data-theme', DATA.theme);
  document.getElementById('theme-toggle').innerHTML = DATA.theme === 'dark'
    ? '<i class="fa-solid fa-moon"></i>' : '<i class="fa-solid fa-sun"></i>';
}
document.getElementById('theme-toggle').addEventListener('click', ()=>{
  DATA.theme = DATA.theme === 'dark' ? 'light' : 'dark';
  applyTheme();
  saveData();
});

/* ==================== HEADER / NAV ==================== */
const hamburgerBtn = document.getElementById('hamburger-btn');
const mobileNav = document.getElementById('mobile-nav');
hamburgerBtn.addEventListener('click', ()=>{
  mobileNav.classList.toggle('open');
  hamburgerBtn.innerHTML = mobileNav.classList.contains('open') ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
});
mobileNav.querySelectorAll('a').forEach(a=> a.addEventListener('click', ()=>{
  mobileNav.classList.remove('open');
  hamburgerBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
}));

window.addEventListener('scroll', ()=>{
  document.getElementById('site-header').style.boxShadow = window.scrollY > 30 ? '0 8px 24px rgba(0,0,0,.4)' : 'none';
});

document.getElementById('back-to-top').addEventListener('click', ()=> window.scrollTo({top:0, behavior:'smooth'}));

/* ==================== SCROLL REVEAL ==================== */
function initScrollReveal(){
  const els = document.querySelectorAll('.reveal-scroll');
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){ entry.target.classList.add('in-view'); io.unobserve(entry.target); }
    });
  }, {threshold:.12});
  els.forEach(el=> io.observe(el));
}

/* ==================== HERO PARTICLES ==================== */
function initParticles(){
  const canvas = document.getElementById('hero-particles');
  const ctx = canvas.getContext('2d');
  let w,h,particles;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize(){
    w = canvas.width = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
  }
  function initParts(){
    particles = Array.from({length: reduced?0:46}, ()=>({
      x:Math.random()*w, y:Math.random()*h, r:Math.random()*1.8+.4,
      vy:Math.random()*.3+.08, o:Math.random()*.5+.15
    }));
  }
  function draw(){
    ctx.clearRect(0,0,w,h);
    particles.forEach(p=>{
      ctx.beginPath();
      ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle = `rgba(212,175,55,${p.o})`;
      ctx.fill();
      p.y -= p.vy;
      if(p.y < -5){ p.y = h+5; p.x = Math.random()*w; }
    });
    requestAnimationFrame(draw);
  }
  window.addEventListener('resize', ()=>{ resize(); initParts(); });
  resize(); initParts();
  if(!reduced) draw();
}

/* ==================== COUNTDOWN ==================== */
function initCountdown(){
  function tick(){
    const nextGame = DATA.events
      .filter(e=>e.tipo==='jogo' && new Date(e.data+'T'+(e.horario||'00:00')) > new Date())
      .sort((a,b)=> new Date(a.data+'T'+a.horario) - new Date(b.data+'T'+b.horario))[0];
    const el = document.getElementById('countdown-timer');
    if(!nextGame){ el.textContent = 'Sem jogos agendados'; return; }
    const target = new Date(nextGame.data+'T'+nextGame.horario);
    const diff = target - new Date();
    if(diff <= 0){ el.textContent = 'Bola rolando!'; return; }
    const d = Math.floor(diff/86400000);
    const h = Math.floor((diff%86400000)/3600000);
    const m = Math.floor((diff%3600000)/60000);
    const s = Math.floor((diff%60000)/1000);
    el.textContent = `${d}d ${String(h).padStart(2,'0')}h ${String(m).padStart(2,'0')}m ${String(s).padStart(2,'0')}s`;
  }
  tick();
  setInterval(tick, 1000);
}

/* ==================== DASHBOARD ==================== */
function renderDashboard(){
  document.getElementById('stat-jogadores').textContent = DATA.players.length;
  document.getElementById('stat-titulares').textContent = DATA.players.filter(p=>p.status==='Titular').length;
  document.getElementById('stat-reservas').textContent = DATA.players.filter(p=>p.status==='Reserva').length;

  const nextGame = DATA.events.filter(e=>e.tipo==='jogo' && new Date(e.data) >= new Date(addDaysStr(-1))).sort((a,b)=> new Date(a.data)-new Date(b.data))[0];
  const nextTraining = DATA.events.filter(e=>e.tipo==='treino' && new Date(e.data) >= new Date(addDaysStr(-1))).sort((a,b)=> new Date(a.data)-new Date(b.data))[0];
  document.getElementById('stat-proximo-jogo').textContent = nextGame ? formatDateShort(nextGame.data)+' · '+nextGame.horario : '--';
  document.getElementById('stat-proximo-treino').textContent = nextTraining ? formatDateShort(nextTraining.data)+' · '+nextTraining.horario : '--';

  drawGoalsChart();
  drawPositionsChart();
}
function formatDateShort(dateStr){
  const d = new Date(dateStr+'T00:00:00');
  return d.toLocaleDateString('pt-BR', {day:'2-digit', month:'short'});
}

function drawGoalsChart(){
  const canvas = document.getElementById('chart-goals');
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const cw = canvas.offsetWidth, ch = canvas.offsetHeight || 180;
  canvas.width = cw*dpr; canvas.height = ch*dpr; ctx.setTransform(dpr,0,0,dpr,0,0);
  ctx.clearRect(0,0,cw,ch);

  const top = [...DATA.players].sort((a,b)=> (b.gols+b.assistencias)-(a.gols+a.assistencias)).slice(0,5);
  const max = Math.max(1, ...top.map(p=>Math.max(p.gols,p.assistencias)));
  const barW = cw/ (top.length*3);
  const baseY = ch-26;

  top.forEach((p,i)=>{
    const groupX = i*(cw/top.length) + (cw/top.length)/2;
    const gH = (p.gols/max)*(ch-50);
    const aH = (p.assistencias/max)*(ch-50);
    ctx.fillStyle = '#D4AF37';
    ctx.fillRect(groupX-barW-2, baseY-gH, barW, gH);
    ctx.fillStyle = '#FFD75A';
    ctx.globalAlpha = .55;
    ctx.fillRect(groupX+2, baseY-aH, barW, aH);
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#a8a8a8';
    ctx.font = '10px Inter';
    ctx.textAlign = 'center';
    ctx.fillText((p.apelido||p.nome).slice(0,8), groupX, ch-10);
  });
}
function drawPositionsChart(){
  const canvas = document.getElementById('chart-positions');
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const cw = canvas.offsetWidth, ch = canvas.offsetHeight || 180;
  canvas.width = cw*dpr; canvas.height = ch*dpr; ctx.setTransform(dpr,0,0,dpr,0,0);
  ctx.clearRect(0,0,cw,ch);

  const positions = ['GOL','ZAG','LAT','VOL','MEI','ATA'];
  const counts = positions.map(pos => DATA.players.filter(p=>p.posicao===pos).length);
  const max = Math.max(1, ...counts);
  const barW = (cw/positions.length) * .5;
  const baseY = ch-26;

  positions.forEach((pos,i)=>{
    const x = i*(cw/positions.length) + (cw/positions.length)/2;
    const hgt = (counts[i]/max)*(ch-50);
    const grad = ctx.createLinearGradient(0, baseY-hgt, 0, baseY);
    grad.addColorStop(0,'#FFD75A'); grad.addColorStop(1,'#D4AF37');
    ctx.fillStyle = grad;
    ctx.fillRect(x-barW/2, baseY-hgt, barW, hgt);
    ctx.fillStyle = '#fff'; ctx.font='11px Rajdhani'; ctx.textAlign='center';
    ctx.fillText(counts[i], x, baseY-hgt-6);
    ctx.fillStyle = '#a8a8a8'; ctx.font='10px Inter';
    ctx.fillText(pos, x, ch-10);
  });
}

/* ==================== COACHES ==================== */
function renderCoaches(){
  const grid = document.getElementById('coaches-grid');
  grid.innerHTML = DATA.coaches.map(c=>`
    <div class="coach-card" data-id="${c.id}">
      <div class="coach-photo">
        ${c.foto ? `<img src="${c.foto}" alt="${c.nome}">` : `<div class="coach-icon-placeholder"><i class="fa-solid fa-user-tie"></i></div>`}
        <span class="coach-badge">#${c.numero||'--'}</span>
      </div>
      <div class="coach-info">
        <h3>${c.nome}</h3>
        <p class="coach-role">${c.cargo}</p>
        <p class="coach-desc">${c.descricao||''}</p>
      </div>
    </div>
  `).join('');
  grid.querySelectorAll('.coach-card').forEach(card=>{
    card.addEventListener('click', ()=> openCoachModal(card.dataset.id));
  });
}
document.getElementById('edit-coaches-btn').addEventListener('click', ()=>{
  document.getElementById('coaches-grid').scrollIntoView({behavior:'smooth', block:'center'});
  toast('Clique em um card de técnico para editar');
});
function openCoachModal(id){
  const c = DATA.coaches.find(x=>x.id===id);
  document.getElementById('co-id').value = c.id;
  document.getElementById('co-nome').value = c.nome;
  document.getElementById('co-cargo').value = c.cargo;
  document.getElementById('co-numero').value = c.numero || '';
  document.getElementById('co-descricao').value = c.descricao || '';
  const preview = document.getElementById('co-photo-preview');
  preview.innerHTML = avatarHTML(c.foto, 'fa-user-tie');
  document.getElementById('co-photo').value = '';
  openModal('modal-coach');
}
document.getElementById('co-photo').addEventListener('change', (e)=>{
  const file = e.target.files[0];
  if(!file) return;
  fileToBase64(file, (base64)=>{
    document.getElementById('co-photo-preview').innerHTML = `<img src="${base64}" alt="">`;
    document.getElementById('co-photo').dataset.base64 = base64;
  });
});
document.getElementById('coach-form').addEventListener('submit', (e)=>{
  e.preventDefault();
  const id = document.getElementById('co-id').value;
  const c = DATA.coaches.find(x=>x.id===id);
  c.nome = document.getElementById('co-nome').value.trim();
  c.cargo = document.getElementById('co-cargo').value.trim();
  c.numero = document.getElementById('co-numero').value.trim();
  c.descricao = document.getElementById('co-descricao').value.trim();
  const b64 = document.getElementById('co-photo').dataset.base64;
  if(b64) c.foto = b64;
  document.getElementById('co-photo').dataset.base64 = '';
  saveData();
  renderCoaches();
  closeModal('modal-coach');
  toast('Técnico atualizado!');
});

/* ==================== FEATURED PLAYER ==================== */
function renderFeatured(){
  const p = DATA.players.find(x=>x.id===DATA.featuredPlayerId) || DATA.players[0];
  const card = document.getElementById('featured-player-card');
  if(!p){ card.innerHTML = '<p>Nenhum jogador cadastrado.</p>'; return; }
  card.innerHTML = `
    <div class="featured-photo">${avatarHTML(p.foto,'fa-user')}</div>
    <div class="featured-info">
      <span class="featured-number">#${p.numero}</span>
      <h3 class="featured-name">${p.nome} ${p.capitao?'<i class="fa-solid fa-star gold-text" title="Capitão"></i>':''}</h3>
      <p class="featured-pos">${POS_LABELS[p.posicao]}</p>
      <div class="featured-stats">
        <div><span class="fv">${p.gols}</span><span class="fl">Gols</span></div>
        <div><span class="fv">${p.assistencias}</span><span class="fl">Assistências</span></div>
        <div><span class="fv">${p.jogos}</span><span class="fl">Jogos</span></div>
      </div>
    </div>
  `;
}
document.getElementById('edit-featured-btn').addEventListener('click', ()=>{
  const sel = document.getElementById('featured-select');
  sel.innerHTML = DATA.players.map(p=>`<option value="${p.id}">#${p.numero} ${p.nome}</option>`).join('');
  sel.value = DATA.featuredPlayerId;
  openModal('modal-featured');
});
document.getElementById('featured-save').addEventListener('click', ()=>{
  DATA.featuredPlayerId = document.getElementById('featured-select').value;
  saveData();
  renderFeatured();
  closeModal('modal-featured');
  toast('Jogador da rodada atualizado!');
});

/* ==================== ELENCO (SQUAD) ==================== */
function populatePositionFilter(){
  const sel = document.getElementById('filter-position');
  sel.innerHTML = '<option value="">Todas as posições</option>' + Object.keys(POS_LABELS).map(k=>`<option value="${k}">${POS_LABELS[k]}</option>`).join('');
}
function renderPlayers(){
  const search = document.getElementById('player-search').value.toLowerCase();
  const posFilter = document.getElementById('filter-position').value;
  const sortBy = document.getElementById('sort-players').value;

  let list = DATA.players.filter(p=>{
    const matchesSearch = (p.nome+' '+(p.apelido||'')).toLowerCase().includes(search);
    const matchesPos = !posFilter || p.posicao === posFilter;
    return matchesSearch && matchesPos;
  });
  list.sort((a,b)=>{
    if(sortBy==='nome') return a.nome.localeCompare(b.nome);
    if(sortBy==='gols') return b.gols-a.gols;
    return a.numero-b.numero;
  });

  const grid = document.getElementById('players-grid');
  if(list.length===0){ grid.innerHTML = '<p style="color:var(--c-text-dimmer)">Nenhum jogador encontrado.</p>'; return; }
  grid.innerHTML = list.map(p=>`
    <div class="player-card" data-id="${p.id}">
      <span class="player-status ${p.status==='Titular'?'status-titular':'status-reserva'}">${p.status}</span>
      <div class="player-card-top">
        <div class="player-avatar">${avatarHTML(p.foto,'fa-user')}</div>
        <div>
          <div class="player-name">${p.nome}</div>
          <div class="player-nick">${p.apelido||''}</div>
        </div>
      </div>
      <div class="player-meta">
        <span class="player-number">#${p.numero}</span>
        <span class="player-pos-tag">${p.posicao}</span>
      </div>
      <div class="player-badges">
        ${p.capitao?'<span class="badge-tag">CAPITÃO</span>':''}
        ${p.vice?'<span class="badge-tag">VICE</span>':''}
        ${p.gols>0?`<span class="badge-tag">${p.gols} GOLS</span>`:''}
      </div>
    </div>
  `).join('');
  grid.querySelectorAll('.player-card').forEach(card=>{
    card.addEventListener('click', ()=> openPlayerModal(card.dataset.id));
  });
}
['player-search','filter-position','sort-players'].forEach(id=>{
  document.getElementById(id).addEventListener('input', renderPlayers);
  document.getElementById(id).addEventListener('change', renderPlayers);
});

document.getElementById('add-player-btn').addEventListener('click', ()=> openPlayerModal(null));

function openPlayerModal(id){
  const form = document.getElementById('player-form');
  form.reset();
  document.getElementById('pl-photo').dataset.base64 = '';
  const delBtn = document.getElementById('pl-delete');
  if(id){
    const p = DATA.players.find(x=>x.id===id);
    document.getElementById('player-modal-title').textContent = 'Editar Jogador';
    document.getElementById('pl-id').value = p.id;
    document.getElementById('pl-nome').value = p.nome;
    document.getElementById('pl-apelido').value = p.apelido || '';
    document.getElementById('pl-numero').value = p.numero;
    document.getElementById('pl-posicao').value = p.posicao;
    document.getElementById('pl-status').value = p.status;
    document.getElementById('pl-gols').value = p.gols;
    document.getElementById('pl-assist').value = p.assistencias;
    document.getElementById('pl-jogos').value = p.jogos;
    document.getElementById('pl-ca').value = p.cartoesAmarelos;
    document.getElementById('pl-cv').value = p.cartoesVermelhos;
    document.getElementById('pl-capitao').checked = !!p.capitao;
    document.getElementById('pl-vice').checked = !!p.vice;
    document.getElementById('pl-photo-preview').innerHTML = avatarHTML(p.foto, 'fa-user');
    delBtn.style.display = 'inline-flex';
  }else{
    document.getElementById('player-modal-title').textContent = 'Adicionar Jogador';
    document.getElementById('pl-id').value = '';
    document.getElementById('pl-photo-preview').innerHTML = '<i class="fa-solid fa-user"></i>';
    delBtn.style.display = 'none';
  }
  openModal('modal-player');
}
document.getElementById('pl-photo').addEventListener('change', (e)=>{
  const file = e.target.files[0];
  if(!file) return;
  fileToBase64(file, (base64)=>{
    document.getElementById('pl-photo-preview').innerHTML = `<img src="${base64}" alt="">`;
    document.getElementById('pl-photo').dataset.base64 = base64;
  });
});
document.getElementById('player-form').addEventListener('submit', (e)=>{
  e.preventDefault();
  const id = document.getElementById('pl-id').value;
  const payload = {
    nome: document.getElementById('pl-nome').value.trim(),
    apelido: document.getElementById('pl-apelido').value.trim(),
    numero: parseInt(document.getElementById('pl-numero').value,10),
    posicao: document.getElementById('pl-posicao').value,
    status: document.getElementById('pl-status').value,
    gols: parseInt(document.getElementById('pl-gols').value||0,10),
    assistencias: parseInt(document.getElementById('pl-assist').value||0,10),
    jogos: parseInt(document.getElementById('pl-jogos').value||0,10),
    cartoesAmarelos: parseInt(document.getElementById('pl-ca').value||0,10),
    cartoesVermelhos: parseInt(document.getElementById('pl-cv').value||0,10),
    capitao: document.getElementById('pl-capitao').checked,
    vice: document.getElementById('pl-vice').checked
  };
  const b64 = document.getElementById('pl-photo').dataset.base64;

  if(payload.capitao) DATA.players.forEach(p=> p.capitao=false);
  if(payload.vice) DATA.players.forEach(p=> p.vice=false);

  if(id){
    const p = DATA.players.find(x=>x.id===id);
    Object.assign(p, payload);
    if(b64) p.foto = b64;
  }else{
    const newPlayer = Object.assign({id:uid('pl'), foto: b64||null}, payload);
    DATA.players.push(newPlayer);
  }
  saveData();
  populatePositionFilter();
  renderPlayers();
  renderDashboard();
  renderFeatured();
  renderFieldAndBench();
  closeModal('modal-player');
  toast('Jogador salvo com sucesso!');
});
document.getElementById('pl-delete').addEventListener('click', ()=>{
  const id = document.getElementById('pl-id').value;
  askConfirm('Remover este jogador do elenco?', ()=>{
    DATA.players = DATA.players.filter(p=>p.id!==id);
    DATA.lineupSlots.forEach(s=>{ if(s.playerId===id) s.playerId=null; });
    if(DATA.featuredPlayerId===id) DATA.featuredPlayerId = DATA.players[0]?.id || null;
    saveData();
    renderPlayers(); renderDashboard(); renderFeatured(); renderFieldAndBench();
    closeModal('modal-player');
    toast('Jogador removido.');
  });
});

/* ==================== FORMATIONS / ESCALAÇÃO ==================== */
const FORMATIONS = {
  '4-3-3': [['LAT','ZAG','ZAG','LAT'], ['MEI','MEI','MEI'], ['ATA','ATA','ATA']],
  '4-2-3-1': [['LAT','ZAG','ZAG','LAT'], ['VOL','VOL'], ['MEI','MEI','MEI'], ['ATA']],
  '4-4-2': [['LAT','ZAG','ZAG','LAT'], ['MEI','MEI','MEI','MEI'], ['ATA','ATA']],
  '3-5-2': [['ZAG','ZAG','ZAG'], ['LAT','VOL','MEI','VOL','LAT'], ['ATA','ATA']],
  '3-4-3': [['ZAG','ZAG','ZAG'], ['LAT','MEI','MEI','LAT'], ['ATA','ATA','ATA']],
  '5-3-2': [['LAT','ZAG','ZAG','ZAG','LAT'], ['MEI','MEI','MEI'], ['ATA','ATA']],
  '5-4-1': [['LAT','ZAG','ZAG','ZAG','LAT'], ['MEI','MEI','MEI','MEI'], ['ATA']],
  '4-1-4-1': [['LAT','ZAG','ZAG','LAT'], ['VOL'], ['MEI','MEI','MEI','MEI'], ['ATA']],
  '4-3-2-1': [['LAT','ZAG','ZAG','LAT'], ['VOL','MEI','VOL'], ['MEI','MEI'], ['ATA']],
  '4-2-2': [['LAT','ZAG','ZAG','LAT'], ['VOL','VOL'], ['ATA','ATA']]
};

function buildSlotLayout(formationKey){
  const lines = FORMATIONS[formationKey];
  const L = lines.length;
  const topDefense = 76, topAttack = 12;
  const slots = [{role:'GOL', top:92, left:50}];
  lines.forEach((line, li)=>{
    const top = L>1 ? topDefense - (li*(topDefense-topAttack)/(L-1)) : 44;
    line.forEach((role, idx)=>{
      const left = (100/(line.length+1))*(idx+1);
      slots.push({role, top, left});
    });
  });
  return slots;
}

function populateFormationSelect(){
  const sel = document.getElementById('formation-select');
  sel.innerHTML = Object.keys(FORMATIONS).map(k=>`<option value="${k}">${k}</option>`).join('');
  sel.value = DATA.formationKey;
}
document.getElementById('formation-select').addEventListener('change', (e)=>{
  DATA.formationKey = e.target.value;
  autoAssignLineup();
  saveData();
  renderFieldAndBench();
  toast(`Formação ${DATA.formationKey} aplicada`);
});

function autoAssignLineup(){
  const layout = buildSlotLayout(DATA.formationKey);
  const prevAssignments = DATA.lineupSlots.filter(s=>s.playerId).map(s=>s.playerId);
  const usedIds = new Set();
  const availablePlayers = DATA.players.filter(p=>p.status==='Titular');

  const newSlots = layout.map((slot, i)=>{
    let playerId = null;
    // try to keep previously placed player of same role
    const keep = prevAssignments.find(pid=>{
      const p = DATA.players.find(x=>x.id===pid);
      return p && p.posicao===slot.role && !usedIds.has(pid);
    });
    if(keep){ playerId = keep; }
    else{
      const match = availablePlayers.find(p=> p.posicao===slot.role && !usedIds.has(p.id));
      if(match) playerId = match.id;
    }
    if(playerId) usedIds.add(playerId);
    return {index:i, role:slot.role, top:slot.top, left:slot.left, playerId};
  });
  DATA.lineupSlots = newSlots;
}

function renderFieldAndBench(){
  if(!DATA.lineupSlots || DATA.lineupSlots.length===0) autoAssignLineup();
  const layout = buildSlotLayout(DATA.formationKey);
  // sync slot geometry in case formation changed externally
  if(DATA.lineupSlots.length !== layout.length){ autoAssignLineup(); }

  const container = document.getElementById('field-slots');
  container.innerHTML = DATA.lineupSlots.map((slot)=>{
    const p = slot.playerId ? DATA.players.find(x=>x.id===slot.playerId) : null;
    return `
      <div class="field-slot ${p?'':'empty'}" style="top:${slot.top}%; left:${slot.left}%" data-slot-index="${slot.index}" draggable="${p?'true':'false'}">
        <div class="slot-circle">${p ? (p.foto?`<img src="${p.foto}" alt="">`:('#'+p.numero)) : '<i class="fa-solid fa-plus"></i>'}</div>
        <div class="slot-label">${p ? (p.apelido||p.nome) : slot.role}</div>
        <div class="slot-pos">${slot.role}</div>
      </div>
    `;
  }).join('');

  // bench = players not currently on field, sorted titular first then reserva
  const onFieldIds = new Set(DATA.lineupSlots.filter(s=>s.playerId).map(s=>s.playerId));
  const benchPlayers = DATA.players.filter(p=>!onFieldIds.has(p.id));
  const benchList = document.getElementById('bench-list');
  benchList.innerHTML = benchPlayers.length ? benchPlayers.map(p=>`
    <div class="bench-player" draggable="true" data-player-id="${p.id}">
      <div class="player-avatar">${avatarHTML(p.foto,'fa-user')}</div>
      <div>
        <div class="bench-player-name">#${p.numero} ${p.apelido||p.nome}</div>
        <div class="bench-player-pos">${POS_LABELS[p.posicao]} · ${p.status}</div>
      </div>
    </div>
  `).join('') : '<p class="bench-empty">Todos os jogadores estão em campo.</p>';

  initDragAndDrop();
}

function initDragAndDrop(){
  let draggedPlayerId = null;
  let draggedFromSlot = null;

  document.querySelectorAll('.bench-player').forEach(el=>{
    el.addEventListener('dragstart', (e)=>{
      draggedPlayerId = el.dataset.playerId;
      draggedFromSlot = null;
      e.dataTransfer.effectAllowed = 'move';
    });
  });
  document.querySelectorAll('.field-slot[draggable="true"]').forEach(el=>{
    el.addEventListener('dragstart', (e)=>{
      const idx = parseInt(el.dataset.slotIndex,10);
      const slot = DATA.lineupSlots.find(s=>s.index===idx);
      draggedPlayerId = slot.playerId;
      draggedFromSlot = idx;
      e.dataTransfer.effectAllowed = 'move';
    });
  });
  document.querySelectorAll('.field-slot').forEach(el=>{
    el.addEventListener('dragover', (e)=>{ e.preventDefault(); el.classList.add('drag-over'); });
    el.addEventListener('dragleave', ()=> el.classList.remove('drag-over'));
    el.addEventListener('drop', (e)=>{
      e.preventDefault();
      el.classList.remove('drag-over');
      if(!draggedPlayerId) return;
      const targetIdx = parseInt(el.dataset.slotIndex,10);
      const targetSlot = DATA.lineupSlots.find(s=>s.index===targetIdx);
      const previousOccupant = targetSlot.playerId;

      if(draggedFromSlot !== null){
        const fromSlot = DATA.lineupSlots.find(s=>s.index===draggedFromSlot);
        fromSlot.playerId = previousOccupant || null;
      }
      targetSlot.playerId = draggedPlayerId;
      saveData();
      renderFieldAndBench();
      el.classList.add('just-moved');
      toast('Escalação atualizada');
    });
  });
  // bench as drop target (remove from field)
  const bench = document.getElementById('bench-list');
  bench.addEventListener('dragover', (e)=> e.preventDefault());
  bench.addEventListener('drop', (e)=>{
    e.preventDefault();
    if(draggedFromSlot !== null){
      const fromSlot = DATA.lineupSlots.find(s=>s.index===draggedFromSlot);
      fromSlot.playerId = null;
      saveData();
      renderFieldAndBench();
      toast('Jogador enviado para o banco');
    }
  });
}

/* Click on empty slot opens quick-pick from bench (mobile-friendly alt to drag) */
document.getElementById('field-slots').addEventListener('click', (e)=>{
  const slotEl = e.target.closest('.field-slot');
  if(!slotEl) return;
  const idx = parseInt(slotEl.dataset.slotIndex,10);
  const slot = DATA.lineupSlots.find(s=>s.index===idx);
  if(slot.playerId) return; // occupied - drag to move
  const onFieldIds = new Set(DATA.lineupSlots.filter(s=>s.playerId).map(s=>s.playerId));
  const candidates = DATA.players.filter(p=>!onFieldIds.has(p.id));
  if(candidates.length===0){ toast('Não há jogadores disponíveis no banco'); return; }
  const preferred = candidates.find(p=>p.posicao===slot.role) || candidates[0];
  slot.playerId = preferred.id;
  saveData();
  renderFieldAndBench();
  toast(`${preferred.apelido||preferred.nome} entrou em campo`);
});

/* ==================== SHARE / DOWNLOAD LINEUP ==================== */
document.getElementById('share-lineup-btn').addEventListener('click', ()=>{
  buildSharePreview();
  openModal('modal-share');
});
document.getElementById('download-lineup-btn').addEventListener('click', ()=>{
  buildSharePreview();
  openModal('modal-share');
});
function buildSharePreview(){
  const starters = DATA.lineupSlots.filter(s=>s.playerId).map(s=>{
    const p = DATA.players.find(x=>x.id===s.playerId);
    return `#${p.numero} ${p.apelido||p.nome} (${s.role})`;
  });
  const field = DATA.fields.find(f=>f.id===DATA.selectedFieldId);
  document.getElementById('share-preview').innerHTML = `
    <h4>OS QUEBRADEIRAS</h4>
    <p>Formação: ${DATA.formationKey}</p>
    <p>Campo: ${field ? field.nome : DATA.fieldSettings.nome}</p>
    <p>Data: ${new Date().toLocaleDateString('pt-BR')}</p>
    <div style="margin-top:14px; font-size:12px; color:#fff; line-height:1.7; text-align:left; max-width:340px; margin-inline:auto;">
      ${starters.map(s=>`<div>${s}</div>`).join('')}
    </div>
  `;
}
document.getElementById('copy-lineup-btn').addEventListener('click', async ()=>{
  const text = document.getElementById('share-preview').innerText;
  try{
    await navigator.clipboard.writeText(text);
    toast('Informações copiadas!');
  }catch(e){
    toast('Não foi possível copiar automaticamente', 'error');
  }
});
document.getElementById('download-image-btn').addEventListener('click', ()=>{
  const el = document.getElementById('share-preview');
  if(typeof html2canvas === 'undefined'){ toast('Recurso de imagem indisponível offline', 'error'); return; }
  html2canvas(el, {backgroundColor:'#0a0a0a', scale:2}).then(canvas=>{
    const link = document.createElement('a');
    link.download = `escalacao-os-quebradeiras-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    toast('Imagem baixada!');
  });
});

/* ==================== CAMPOS (FIELDS) ==================== */
function renderFields(){
  const grid = document.getElementById('fields-grid');
  grid.innerHTML = DATA.fields.map(f=>`
    <div class="field-card ${f.id===DATA.selectedFieldId?'selected':''}" data-id="${f.id}">
      <div class="field-card-photo">
        ${f.foto?`<img src="${f.foto}" alt="" style="width:100%;height:100%;object-fit:cover;">`:'<i class="fa-solid fa-map-location-dot"></i>'}
        ${f.id===DATA.selectedFieldId?'<span class="selected-tag">SELECIONADO</span>':''}
      </div>
      <div class="field-card-body">
        <h3>${f.nome}</h3>
        <div class="field-card-meta">
          <span><i class="fa-solid fa-location-dot"></i> ${f.local}</span>
          <span><i class="fa-solid fa-layer-group"></i> ${f.tipo}</span>
        </div>
        <p class="field-card-desc">${f.descricao||''} · Capacidade: ${f.capacidade} jogadores</p>
        <button class="btn btn-outline btn-sm select-field-btn" data-id="${f.id}"><i class="fa-solid fa-check"></i> Selecionar Campo</button>
      </div>
    </div>
  `).join('');
  grid.querySelectorAll('.select-field-btn').forEach(btn=>{
    btn.addEventListener('click', (e)=>{
      e.stopPropagation();
      DATA.selectedFieldId = btn.dataset.id;
      const f = DATA.fields.find(x=>x.id===btn.dataset.id);
      DATA.fieldSettings.nome = f.nome;
      DATA.fieldSettings.tipo = f.tipo;
      saveData();
      renderFields();
      renderFieldEditorInputs();
      toast(`${f.nome} selecionado para a escalação`);
    });
  });
}

function renderFieldEditorInputs(){
  document.getElementById('fe-nome').value = DATA.fieldSettings.nome;
  document.getElementById('fe-tipo').value = DATA.fieldSettings.tipo;
  document.getElementById('fe-gramado').value = DATA.fieldSettings.gramado;
  document.getElementById('fe-linhas').value = DATA.fieldSettings.linhas;
  document.getElementById('fe-iluminacao').value = DATA.fieldSettings.iluminacao;
  updateFieldPreview();
  applyFieldSettingsToMainField();
}
function updateFieldPreview(){
  const preview = document.getElementById('field-preview');
  const s = DATA.fieldSettings;
  preview.style.background = `linear-gradient(180deg, ${s.gramado}, #0a0a0a)`;
  preview.style.borderColor = s.linhas;
  preview.dataset.name = s.nome;
  preview.style.filter = s.iluminacao==='noturna' ? 'brightness(.85) contrast(1.1)' : s.iluminacao==='diurna' ? 'brightness(1.1)' : 'brightness(.95)';
}
function applyFieldSettingsToMainField(){
  const field = document.getElementById('soccer-field');
  const s = DATA.fieldSettings;
  field.style.background = `repeating-linear-gradient(0deg, rgba(255,255,255,.045) 0 40px, transparent 40px 80px), linear-gradient(180deg, ${s.gramado}, ${shade(s.gramado,-10)} 50%, ${s.gramado})`;
  field.style.borderColor = s.linhas;
  document.querySelectorAll('.field-center-circle,.field-center-line,.field-penalty-box').forEach(el=> el.style.borderColor = s.linhas);
}
function shade(hex, percent){
  try{
    let f=parseInt(hex.slice(1),16),t=percent<0?0:255,p=Math.abs(percent)/100;
    let R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
    return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
  }catch(e){ return hex; }
}
['fe-nome','fe-tipo','fe-gramado','fe-linhas','fe-iluminacao'].forEach(id=>{
  document.getElementById(id).addEventListener('input', ()=>{
    DATA.fieldSettings.nome = document.getElementById('fe-nome').value;
    DATA.fieldSettings.tipo = document.getElementById('fe-tipo').value;
    DATA.fieldSettings.gramado = document.getElementById('fe-gramado').value;
    DATA.fieldSettings.linhas = document.getElementById('fe-linhas').value;
    DATA.fieldSettings.iluminacao = document.getElementById('fe-iluminacao').value;
    updateFieldPreview();
    applyFieldSettingsToMainField();
  });
});
document.getElementById('field-editor-form').addEventListener('submit', (e)=>{
  e.preventDefault();
  saveData();
  toast('Configurações do campo salvas!');
});

/* ==================== RESERVAS DE CAMPO ==================== */
function populateReservationFieldSelect(){
  const sel = document.getElementById('res-campo');
  sel.innerHTML = DATA.fields.map(f=>`<option value="${f.id}">${f.nome}</option>`).join('');
}
function renderReservations(){
  const list = document.getElementById('reservations-list');
  if(DATA.reservations.length===0){ list.innerHTML = '<p style="color:var(--c-text-dimmer)">Nenhuma reserva ainda.</p>'; return; }
  const sorted = [...DATA.reservations].sort((a,b)=> new Date(a.data+'T'+a.horario) - new Date(b.data+'T'+b.horario));
  list.innerHTML = sorted.map(r=>{
    const field = DATA.fields.find(f=>f.id===r.campoId);
    const statusClass = r.status==='Confirmada' ? 'res-confirmada' : r.status==='Pendente' ? 'res-pendente' : 'res-cancelada';
    const dot = r.status==='Confirmada' ? '🟢' : r.status==='Pendente' ? '🟡' : '🔴';
    return `
      <div class="reservation-card" data-id="${r.id}">
        <span class="reservation-status ${statusClass}">${dot} ${r.status}</span>
        <h4>${r.nome}</h4>
        <p><i class="fa-solid fa-map-location-dot"></i> ${field?field.nome:'Campo removido'}</p>
        <p><i class="fa-solid fa-calendar"></i> ${formatDateShort(r.data)} às ${r.horario} · ${r.duracao}h</p>
        <p><i class="fa-solid fa-user"></i> Responsável: ${r.responsavel} · ${r.qtdJogadores} jogadores</p>
        <div class="reservation-actions">
          ${r.status!=='Confirmada'?`<button class="btn btn-outline btn-sm confirm-res" data-id="${r.id}"><i class="fa-solid fa-check"></i> Confirmar</button>`:''}
          ${r.status!=='Cancelada'?`<button class="btn btn-outline btn-sm cancel-res" data-id="${r.id}"><i class="fa-solid fa-ban"></i> Cancelar</button>`:''}
          <button class="btn btn-outline btn-sm delete-res" data-id="${r.id}"><i class="fa-solid fa-trash"></i></button>
        </div>
      </div>
    `;
  }).join('');
  list.querySelectorAll('.confirm-res').forEach(b=> b.addEventListener('click', ()=> updateReservationStatus(b.dataset.id,'Confirmada')));
  list.querySelectorAll('.cancel-res').forEach(b=> b.addEventListener('click', ()=> updateReservationStatus(b.dataset.id,'Cancelada')));
  list.querySelectorAll('.delete-res').forEach(b=> b.addEventListener('click', ()=>{
    askConfirm('Excluir esta reserva?', ()=>{
      DATA.reservations = DATA.reservations.filter(r=>r.id!==b.dataset.id);
      saveData(); renderReservations();
      toast('Reserva excluída.');
    });
  }));
}
function updateReservationStatus(id, status){
  const r = DATA.reservations.find(x=>x.id===id);
  r.status = status;
  saveData(); renderReservations();
  toast(`Reserva ${status.toLowerCase()}!`);
}
document.getElementById('reservation-form').addEventListener('submit', (e)=>{
  e.preventDefault();
  const newRes = {
    id: uid('rv'),
    nome: document.getElementById('res-nome').value.trim(),
    campoId: document.getElementById('res-campo').value,
    data: document.getElementById('res-data').value,
    horario: document.getElementById('res-horario').value,
    duracao: document.getElementById('res-duracao').value,
    responsavel: document.getElementById('res-responsavel').value.trim(),
    qtdJogadores: parseInt(document.getElementById('res-qtd').value||10,10),
    status: 'Pendente'
  };
  DATA.reservations.push(newRes);
  saveData();
  renderReservations();
  e.target.reset();
  document.getElementById('res-qtd').value = 10;
  toast('Reserva confirmada com sucesso!');
});

/* ==================== CALENDÁRIO ==================== */
function renderCalendar(){
  const list = document.getElementById('calendar-list');
  const items = [];
  DATA.events.forEach(ev=> items.push({...ev, kind:ev.tipo, sortDate: ev.data+'T'+ev.horario}));
  DATA.reservations.filter(r=>r.status!=='Cancelada').forEach(r=>{
    const field = DATA.fields.find(f=>f.id===r.campoId);
    items.push({id:r.id, titulo:'Reserva: '+r.nome, tipo:'reserva', data:r.data, horario:r.horario, local:field?field.nome:'', sortDate:r.data+'T'+r.horario, isReservation:true});
  });
  items.sort((a,b)=> new Date(a.sortDate) - new Date(b.sortDate));
  if(items.length===0){ list.innerHTML = '<p style="color:var(--c-text-dimmer)">Nenhum evento no calendário.</p>'; return; }

  list.innerHTML = items.map(it=>{
    const d = new Date(it.data+'T00:00:00');
    const tagClass = it.tipo==='treino' ? 'tag-treino' : it.tipo==='jogo' ? 'tag-jogo' : it.tipo==='reserva' ? 'tag-treino' : 'tag-evento';
    const borderColor = it.tipo==='treino'?'var(--c-blue)': it.tipo==='jogo'?'var(--c-gold)': it.tipo==='reserva'?'var(--c-green)':'#b06fd6';
    return `
      <div class="calendar-item" style="border-left-color:${borderColor}">
        <div class="cal-date">${d.getDate()}<br><span style="font-size:11px;color:var(--c-text-dim)">${d.toLocaleDateString('pt-BR',{month:'short'})}</span></div>
        <div class="cal-info">
          <h4>${it.titulo}</h4>
          <p><i class="fa-regular fa-clock"></i> ${it.horario} ${it.local?(' · '+it.local):''}</p>
        </div>
        <span class="cal-type-tag ${tagClass}">${it.tipo}</span>
        ${it.isReservation ? '' : `<button class="cal-delete" data-id="${it.id}" title="Remover"><i class="fa-solid fa-trash"></i></button>`}
      </div>
    `;
  }).join('');
  list.querySelectorAll('.cal-delete').forEach(b=> b.addEventListener('click', ()=>{
    askConfirm('Remover este evento do calendário?', ()=>{
      DATA.events = DATA.events.filter(e=>e.id!==b.dataset.id);
      saveData(); renderCalendar(); renderDashboard();
      toast('Evento removido.');
    });
  }));
}
document.getElementById('add-event-btn').addEventListener('click', ()=> openModal('modal-event'));
document.getElementById('event-form').addEventListener('submit', (e)=>{
  e.preventDefault();
  DATA.events.push({
    id: uid('ev'),
    titulo: document.getElementById('ev-titulo').value.trim(),
    tipo: document.getElementById('ev-tipo').value,
    data: document.getElementById('ev-data').value,
    horario: document.getElementById('ev-horario').value,
    local: document.getElementById('ev-local').value.trim()
  });
  saveData();
  renderCalendar();
  renderDashboard();
  e.target.reset();
  closeModal('modal-event');
  toast('Evento adicionado ao calendário!');
});

/* ==================== SOBRE O TIME ==================== */
function renderAbout(){
  const t = DATA.teamSettings;
  document.getElementById('about-content').innerHTML = `
    <div class="about-story">
      <h3>${t.nome}</h3>
      <p>${t.historia}</p>
    </div>
    <div class="about-stats">
      <div class="about-stat"><i class="fa-solid fa-flag"></i><span class="av">${t.fundacao}</span><span class="al">Fundação</span></div>
      <div class="about-stat"><i class="fa-solid fa-city"></i><span class="av">${t.cidade}</span><span class="al">Cidade</span></div>
      <div class="about-stat"><i class="fa-solid fa-user-tie"></i><span class="av">${t.tecnico}</span><span class="al">Técnico</span></div>
      <div class="about-stat"><i class="fa-solid fa-star"></i><span class="av">${t.capitao}</span><span class="al">Capitão</span></div>
      <div class="about-stat"><i class="fa-solid fa-people-group"></i><span class="av">${DATA.players.length}</span><span class="al">Jogadores</span></div>
      <div class="about-stat"><i class="fa-solid fa-trophy"></i><span class="av" style="font-size:13px">${t.titulos}</span><span class="al">Títulos</span></div>
    </div>
  `;
}
document.getElementById('edit-team-btn').addEventListener('click', ()=>{
  const t = DATA.teamSettings;
  document.getElementById('tm-nome').value = t.nome;
  document.getElementById('tm-fundacao').value = t.fundacao;
  document.getElementById('tm-cidade').value = t.cidade;
  document.getElementById('tm-tecnico').value = t.tecnico;
  document.getElementById('tm-capitao').value = t.capitao;
  document.getElementById('tm-titulos').value = t.titulos;
  document.getElementById('tm-historia').value = t.historia;
  openModal('modal-team');
});
document.getElementById('team-form').addEventListener('submit', (e)=>{
  e.preventDefault();
  Object.assign(DATA.teamSettings, {
    nome: document.getElementById('tm-nome').value.trim(),
    fundacao: document.getElementById('tm-fundacao').value.trim(),
    cidade: document.getElementById('tm-cidade').value.trim(),
    tecnico: document.getElementById('tm-tecnico').value.trim(),
    capitao: document.getElementById('tm-capitao').value.trim(),
    titulos: document.getElementById('tm-titulos').value.trim(),
    historia: document.getElementById('tm-historia').value.trim()
  });
  saveData();
  renderAbout();
  updateBrandName();
  closeModal('modal-team');
  toast('Informações do time atualizadas!');
});
function updateBrandName(){
  document.querySelectorAll('.brand-name').forEach(el=> el.textContent = DATA.teamSettings.nome.toUpperCase());
  document.querySelector('.hero-tagline').textContent = DATA.teamSettings.frase;
}

/* ==================== ADMIN PANEL ==================== */
document.getElementById('admin-open-btn').addEventListener('click', ()=>{
  document.getElementById('adm-nome').value = DATA.teamSettings.nome;
  document.getElementById('adm-frase').value = DATA.teamSettings.frase;
  document.getElementById('adm-cor-destaque').value = DATA.teamSettings.corDestaque;
  document.getElementById('adm-cor-fundo').value = DATA.teamSettings.corFundo;
  openModal('modal-admin');
});
document.querySelectorAll('.admin-tab').forEach(tab=>{
  tab.addEventListener('click', ()=>{
    document.querySelectorAll('.admin-tab').forEach(t=>t.classList.remove('active'));
    document.querySelectorAll('.admin-pane').forEach(p=>p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('pane-'+tab.dataset.tab).classList.add('active');
  });
});
document.getElementById('adm-nome').addEventListener('input', (e)=>{ DATA.teamSettings.nome = e.target.value; updateBrandName(); });
document.getElementById('adm-frase').addEventListener('input', (e)=>{ DATA.teamSettings.frase = e.target.value; updateBrandName(); });
document.getElementById('adm-cor-destaque').addEventListener('input', (e)=>{
  DATA.teamSettings.corDestaque = e.target.value;
  document.documentElement.style.setProperty('--c-gold', e.target.value);
});
document.getElementById('adm-cor-fundo').addEventListener('input', (e)=>{
  DATA.teamSettings.corFundo = e.target.value;
  document.documentElement.style.setProperty('--c-bg-0', e.target.value);
});
document.getElementById('admin-save-btn').addEventListener('click', ()=>{ saveData(true); renderAbout(); });
document.getElementById('admin-restore-btn').addEventListener('click', ()=>{
  askConfirm('Restaurar todos os dados para o padrão de fábrica? Essa ação não pode ser desfeita.', async ()=>{
    localStorage.removeItem(LS_KEY);
    DATA = await fetchSeedData();
    saveData();
    initAll();
    closeModal('modal-admin');
    toast('Dados restaurados para o padrão.');
  });
});
document.getElementById('admin-pull-btn')?.addEventListener('click', async ()=>{
  if(!CLOUD_CONFIG.enabled || !CLOUD_CONFIG.binId || !CLOUD_CONFIG.apiKey){
    toast('A sincronização em nuvem não está ativada.', 'error');
    return;
  }
  askConfirm('Buscar a versão mais recente da nuvem? Alterações não salvas neste navegador serão substituídas.', async ()=>{
    try{
      const cloud = await cloudGet();
      if(!cloud || !Array.isArray(cloud.players)){
        toast('A nuvem ainda não tem dados válidos do site.', 'error');
        return;
      }
      DATA = migrateData(mergeLocalPhotos(cloud));
      try{ localStorage.setItem(LS_KEY, JSON.stringify(DATA)); }catch(e){}
      initAll();
      closeModal('modal-admin');
      toast('Dados atualizados com a versão mais recente da nuvem!');
      setSyncStatus('synced');
    }catch(e){
      toast('Não foi possível buscar a versão mais recente.', 'error');
      setSyncStatus('error');
    }
  });
});
document.getElementById('admin-export-btn').addEventListener('click', ()=>{
  const blob = new Blob([JSON.stringify(DATA, null, 2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'os-quebradeiras-dados.json';
  a.click();
  URL.revokeObjectURL(url);
  toast('Dados exportados!');
});
document.getElementById('admin-import-input').addEventListener('change', (e)=>{
  const file = e.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = ()=>{
    try{
      const imported = JSON.parse(reader.result);
      DATA = migrateData(imported);
      saveData();
      initAll();
      toast('Dados importados com sucesso!');
    }catch(err){
      toast('Arquivo JSON inválido', 'error');
    }
  };
  reader.readAsText(file);
});

/* ==================== INIT ==================== */
function initAll(){
  applyTheme();
  document.documentElement.style.setProperty('--c-gold', DATA.teamSettings.corDestaque || '#D4AF37');
  updateBrandName();
  populatePositionFilter();
  populateFormationSelect();
  populateReservationFieldSelect();
  renderDashboard();
  renderCoaches();
  renderFeatured();
  renderPlayers();
  if(!DATA.lineupSlots || DATA.lineupSlots.length===0) autoAssignLineup();
  renderFieldAndBench();
  renderFields();
  renderFieldEditorInputs();
  renderReservations();
  renderCalendar();
  renderAbout();
  initScrollReveal();
}

window.addEventListener('DOMContentLoaded', async ()=>{
  if(!CLOUD_CONFIG.enabled) setSyncStatus('off');
  DATA = await loadData();
  initAll();
  initParticles();
  initCountdown();
  startCloudPolling();
  setTimeout(()=> document.getElementById('loading-screen').classList.add('hidden'), 900);
});
window.addEventListener('resize', ()=>{ drawGoalsChart(); drawPositionsChart(); });
