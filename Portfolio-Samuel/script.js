/* ===== THEME ===== */
let currentTheme='dark';
function setTheme(t,e){
  if(e){e.stopPropagation()}
  currentTheme=t;
  document.body.setAttribute('data-theme',t==='dark'?'':t);
  document.querySelectorAll('.topt').forEach(el=>el.classList.toggle('active',el.dataset.t===t));
  document.querySelectorAll('.tdot').forEach(el=>el.classList.toggle('active',el.dataset.theme===t));
}
function toggleThemePanel(){document.getElementById('theme-panel').classList.toggle('open')}
document.addEventListener('click',e=>{
  if(!document.getElementById('theme-switcher').contains(e.target))
    document.getElementById('theme-panel').classList.remove('open');
});

/* ===== NAV ===== */
function toggleMenu(){document.getElementById('mobileMenu').classList.toggle('open')}

/* ===== CLOCK ===== */
function updateClock(){
  const now=new Date();
  const pad=n=>String(n).padStart(2,'0');
  const el=document.getElementById('clock');
  if(el) el.textContent=pad(now.getHours())+':'+pad(now.getMinutes())+':'+pad(now.getSeconds());
  const tz=document.getElementById('tz-label');
  if(tz) tz.textContent=Intl.DateTimeFormat().resolvedOptions().timeZone.replace(/_/g,' ');
  const dl=document.getElementById('date-label');
  if(dl){
    const days=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    const months=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    dl.textContent=days[now.getDay()]+', '+months[now.getMonth()]+' '+now.getDate()+' '+now.getFullYear();
  }
}
setInterval(updateClock,1000);updateClock();

/* ===== GLOBE ===== */
(function(){
  const canvas=document.getElementById('globe-canvas');
  if(!canvas)return;
  const ctx=canvas.getContext('2d');
  const W=canvas.width,H=canvas.height,cx=W/2,cy=H/2,r=Math.min(W,H)*0.44;
  let angle=0;
  const dots=[
    [51,0],[48,2],[53,-2],[52,13],[48,16],[45,9],[40,-3],[38,23],[59,18],[55,37],[46,8],[43,17],[50,14],[50,4],
    [15,17],[5,20],[-5,23],[-25,25],[-30,30],[0,10],[10,5],[20,30],[30,31],[-33,26],[0,25],[-20,44],
    [40,-75],[35,-85],[30,-90],[45,-73],[55,-120],[48,-122],[37,-122],[34,-118],[29,-95],[25,-80],[19,-99],
    [5,-52],[-5,-35],[-15,-47],[-23,-43],[-33,-70],[-20,-65],[-10,-75],[0,-78],[-40,-63],[-50,-70],
    [35,103],[25,82],[28,77],[10,78],[0,107],[5,115],[20,110],[30,120],[37,127],[35,136],[55,82],[60,60],[65,40],[55,37],[40,45],[35,35],[25,55],[35,58],[40,65],[55,68],[58,125],[48,135],[35,137],[15,100],[5,101],
    [-25,130],[-33,151],[-37,144],[-20,118],[-32,115],[-27,153],[-35,138]
  ];
  function p2xy(lat,lon,rot){
    const phi=(90-lat)*Math.PI/180,theta=(lon+rot)*Math.PI/180;
    const x=r*Math.sin(phi)*Math.cos(theta),y=r*Math.cos(phi),z=r*Math.sin(phi)*Math.sin(theta);
    return{x:cx+x,y:cy-y,z,v:z>-5};
  }
  function draw(){
    ctx.clearRect(0,0,W,H);
    ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);
    const g=ctx.createRadialGradient(cx-r*.3,cy-r*.3,5,cx,cy,r);
    g.addColorStop(0,'rgba(25,25,45,0.95)');g.addColorStop(1,'rgba(8,8,18,0.98)');
    ctx.fillStyle=g;ctx.fill();
    ctx.strokeStyle='rgba(99,211,178,0.12)';ctx.lineWidth=0.5;ctx.stroke();
    ctx.strokeStyle='rgba(99,211,178,0.05)';ctx.lineWidth=0.5;
    for(let la=-60;la<=60;la+=30){
      ctx.beginPath();let f=true;
      for(let lo=0;lo<=360;lo+=3){const p=p2xy(la,lo,angle);if(p.v){if(f){ctx.moveTo(p.x,p.y);f=false}else ctx.lineTo(p.x,p.y)}else f=true}ctx.stroke();
    }
    for(let lo=0;lo<360;lo+=30){
      ctx.beginPath();let f=true;
      for(let la=-85;la<=85;la+=3){const p=p2xy(la,lo,angle);if(p.v){if(f){ctx.moveTo(p.x,p.y);f=false}else ctx.lineTo(p.x,p.y)}else f=true}ctx.stroke();
    }
    dots.forEach(([la,lo])=>{
      const p=p2xy(la,lo,angle);if(!p.v)return;
      const b=Math.max(0,(p.z+r)/(2*r));
      ctx.beginPath();ctx.arc(p.x,p.y,1.6,0,Math.PI*2);
      ctx.fillStyle=`rgba(99,211,178,${0.1+b*0.7})`;ctx.fill();
    });
    const dk=p2xy(14.7,-17.4,angle);
    if(dk.v){
      ctx.beginPath();ctx.arc(dk.x,dk.y,4,0,Math.PI*2);ctx.fillStyle='rgba(99,211,178,0.95)';ctx.fill();
      ctx.beginPath();ctx.arc(dk.x,dk.y,9,0,Math.PI*2);ctx.strokeStyle='rgba(99,211,178,0.3)';ctx.lineWidth=1;ctx.stroke();
      ctx.font='bold 9px sans-serif';ctx.fillStyle='rgba(99,211,178,0.9)';ctx.fillText('Dakar',dk.x+12,dk.y+4);
    }
    angle+=0.12;requestAnimationFrame(draw);
  }
  draw();
})();

/* ===== NOCODE CANVAS ===== */
(function(){
  const canvas=document.getElementById('nocode-canvas');
  if(!canvas)return;
  const ctx=canvas.getContext('2d');
  function resize(){canvas.width=canvas.offsetWidth;canvas.height=Math.round(canvas.offsetWidth*0.65)}
  resize();window.addEventListener('resize',resize);
  const nodes=[
    {x:.12,y:.5,l:'Typeform',icon:'📋',c:'#7c6dfa'},
    {x:.34,y:.22,l:'Filter',icon:'⚡',c:'#f0a500'},
    {x:.34,y:.78,l:'Gmail',icon:'✉',c:'#63d3b2'},
    {x:.58,y:.22,l:'Airtable',icon:'🗄️',c:'#7c6dfa'},
    {x:.58,y:.78,l:'Notion',icon:'📄',c:'#63d3b2'},
    {x:.88,y:.5,l:'Slack',icon:'💬',c:'#f0a500'},
  ];
  const edges=[[0,1],[0,2],[1,3],[2,4],[3,5],[4,5]];
  const pkts=edges.map((_,i)=>({ei:i,t:(i*0.18)%1,spd:0.005+Math.random()*0.003}));
  let fr=0;
  function draw(){
    const W=canvas.width,H=canvas.height;
    ctx.clearRect(0,0,W,H);
    edges.forEach(([a,b])=>{
      const na=nodes[a],nb=nodes[b];
      ctx.beginPath();ctx.moveTo(na.x*W,na.y*H);ctx.lineTo(nb.x*W,nb.y*H);
      ctx.strokeStyle='rgba(255,255,255,0.06)';ctx.lineWidth=1.5;ctx.stroke();
    });
    pkts.forEach(pk=>{
      const [a,b]=edges[pk.ei];
      const na=nodes[a],nb=nodes[b];
      const px=na.x*W+(nb.x*W-na.x*W)*pk.t;
      const py=na.y*H+(nb.y*H-na.y*H)*pk.t;
      ctx.beginPath();ctx.arc(px,py,4,0,Math.PI*2);ctx.fillStyle='rgba(99,211,178,0.9)';ctx.fill();
      ctx.beginPath();ctx.arc(px,py,9,0,Math.PI*2);ctx.fillStyle='rgba(99,211,178,0.18)';ctx.fill();
      pk.t+=pk.spd;if(pk.t>1)pk.t=0;
    });
    nodes.forEach(n=>{
      const nx=n.x*W,ny=n.y*H;
      const pulse=1+Math.sin(fr*0.04)*0.05;
      ctx.beginPath();ctx.arc(nx,ny,20*pulse,0,Math.PI*2);ctx.fillStyle=n.c+'18';ctx.fill();
      ctx.beginPath();ctx.arc(nx,ny,16,0,Math.PI*2);ctx.fillStyle='#12121e';ctx.fill();
      ctx.strokeStyle=n.c+'66';ctx.lineWidth=1;ctx.stroke();
      ctx.font='12px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(n.icon,nx,ny);
      ctx.font='bold 8px sans-serif';ctx.fillStyle='rgba(255,255,255,0.5)';ctx.fillText(n.l,nx,ny+26);
    });
    fr++;requestAnimationFrame(draw);
  }
  draw();
})();

/* ===== SCROLL FI ===== */
const io=new IntersectionObserver(es=>{es.forEach((e,i)=>{if(e.isIntersecting)setTimeout(()=>e.target.classList.add('show'),i*60)})},{threshold:0.08});
document.querySelectorAll('.fi').forEach(el=>io.observe(el));

/* ===== FORM ===== */
function handleSubmit(e){
  e.preventDefault();const btn=e.target;
  btn.textContent='Sent ✓';btn.style.background='#22c55e';
  setTimeout(()=>{btn.textContent='Send message →';btn.style.background=''},3000);
}

/* ---- CURSOR ---- */
const cur = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;cur.style.left=mx+'px';cur.style.top=my+'px'});
(function animRing(){rx+=(mx-rx)*0.12;ry+=(my-ry)*0.12;ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(animRing)})();
