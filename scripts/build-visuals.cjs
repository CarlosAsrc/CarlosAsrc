// Rebuild the repository-owned SVGs and the local README preview.
// Dependencies: lucide and marked. CODEX_NODE_MODULES may point to a bundled runtime.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const dep = name => require(process.env.CODEX_NODE_MODULES ? path.join(process.env.CODEX_NODE_MODULES, name) : name);
const lucide = dep('lucide');
const { marked } = dep('marked');
const esc = s => String(s).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const icon = (name, x, y, size = 22, color = 'currentColor') => {
  const nodes = lucide[name];
  if (!nodes) throw new Error(`Unknown Lucide icon: ${name}`);
  return `<svg x="${x}" y="${y}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${nodes.map(([tag, attrs]) => `<${tag} ${Object.entries(attrs).map(([k,v]) => `${k}="${esc(v)}"`).join(' ')}/>`).join('')}</svg>`;
};
const sectionIcons = { career:'BriefcaseBusiness', learning:'BookOpen', projects:'FolderGit2', connect:'MessagesSquare', archive:'GraduationCap', ai:'BrainCircuit', cloud:'Cloud', design:'Workflow', code:'CodeXml', link:'Link', terminal:'SquareTerminal', stream:'Radio', location:'MapPin', linkedin:'ContactRound', mail:'Mail' };
for (const [file, name] of Object.entries(sectionIcons)) {
  fs.writeFileSync(path.join(root, 'assets/icons', `${file}.svg`), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><style>svg{color:#57606a}@media(prefers-color-scheme:dark){svg{color:#9da7b3}}</style>${icon(name,0,0,24)}</svg>\n`);
}
let serial = 0;
function brand(name, x, y, size = 20) {
  if (name.startsWith('lucide:')) return icon(name.slice(7), x, y, size, 'var(--accent)');
  const raw = fs.readFileSync(path.join(root, 'assets/brands', `${name}.svg`), 'utf8');
  const viewBox = raw.match(/viewBox="([^"]+)"/)?.[1] || '0 0 128 128';
  let body = raw.slice(raw.indexOf('>') + 1, raw.lastIndexOf('</svg>'));
  const prefix = `${name}-${serial++}-`;
  body = body.replace(/\bid="([^"]+)"/g, (_, id) => `id="${prefix}${id}"`).replace(/url\(#([^)]+)\)/g, (_, id) => `url(#${prefix}${id})`).replace(/href="#([^"]+)"/g, (_, id) => `href="#${prefix}${id}"`);
  if(name==='kafka') body=body.replace(/#231f20/gi,'var(--text)');
  // Kafka's source uses an implicit black fill; a neutral icon stays readable in both themes.
  const fill = name === 'kafka' ? 'var(--text)' : '#111827';
  return `<svg x="${x}" y="${y}" width="${size}" height="${size}" viewBox="${viewBox}" fill="${fill}">${body}</svg>`;
}
fs.mkdirSync(path.join(root,'assets/badges'),{recursive:true});
for(const [name,label] of [['java','Java'],['spring','Spring Boot'],['clojure','Clojure'],['python','Python'],['go','Go']]) {
  const width=Math.ceil(label.length*7.5+48);
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="32" viewBox="0 0 ${width} 32" role="img" aria-label="${esc(label)}"><style>.surface{fill:#f6f8fa;stroke:#d8dee4}.label{fill:#1f2328}@media(prefers-color-scheme:dark){.surface{fill:#151b23;stroke:#303945}.label{fill:#e6edf3}}</style><rect class="surface" x=".5" y=".5" width="${width-1}" height="31" rx="7"/>${brand(name,10,6,20)}<text class="label" x="36" y="21" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif" font-size="14" font-weight="500">${esc(label)}</text></svg>\n`;
  fs.writeFileSync(path.join(root,'assets/badges',`${name}.svg`),svg);
}
const stages = [
  { company:'ilegra / Agibank', start:'2019', end:'2022', date:'MAR 2019 — JUL 2022', role:'Cloud training → Backend engineer', focus:['Event-driven banking','40+ applications supported'], tone:'#15847b', darkTone:'#59c9b5', tech:[['java','Java'],['spring','Spring Boot'],['kafka','Kafka'],['rabbitmq','RabbitMQ']] },
  { company:'Mercado Livre', start:'2022', end:'2025', date:'JUL 2022 — FEB 2025', role:'Software engineer → Senior engineer', focus:['Logistics & S&OP','Async data science integrations'], tone:'#2468c0', darkTone:'#79b8ff', tech:[['java','Java'],['spring','Spring Boot'],['go','Go'],['postgresql','PostgreSQL']] },
  { company:'Nubank', start:'2025', end:'NOW', date:'FEB 2025 — PRESENT', role:'Senior software engineer', focus:['Support AI → Agentic Platform','SDKs · LLM gateways · MCP servers'], tone:'#8250df', darkTone:'#bc9cff', tech:[['lucide:Package','SDKs'],['lucide:Network','LLM gateways'],['lucide:Server','MCP servers'],['lucide:Blocks','Components']] },
];
const text = (x,y,value,cls,extra='') => `<text x="${x}" y="${y}" class="${cls}" ${extra}>${esc(value)}</text>`;
function timeline(mobile, theme, animate = true) {
  const dark = theme === 'dark';
  const W = mobile ? 420 : 920, H = mobile ? 884 : 628;
  const ys = mobile ? [110,366,622] : [116,286,456];
  const spineX = mobile ? 28 : 116;
  const nodeYs = ys.map(y => y + (mobile ? 26 : 32));
  const palette = dark ? {bg:'#0d1117',surface:'#151b23',border:'#303945',text:'#e6edf3',muted:'#a3adbb',chip:'#1c2530',line:'#354252'} : {bg:'#ffffff',surface:'#f6f8fa',border:'#d8dee4',text:'#1f2328',muted:'#57606a',chip:'#ffffff',line:'#c6d0db'};
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="title desc"><title id="title">Carlos's engineering career: ilegra and Agibank, Mercado Livre, Nubank</title><desc id="desc">2019 to 2022: cloud training and banking backend development at ilegra, serving Agibank. 2022 to 2025: logistics systems at Mercado Livre. Since February 2025: senior software engineering at Nubank, first in customer-support AI and now on the Agentic Platform team, building SDKs, LLM gateways, MCP servers, and reusable components. Technology and platform capability labels are shown beside each role.</desc><style>
    :root{${Object.entries(palette).map(([k,v])=>`--${k}:${v}`).join(';')}}
    text{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;fill:var(--text)}
    .heading{font-size:${mobile?24:27}px;font-weight:650;letter-spacing:-.5px}.caption{font-size:${mobile?14:16}px;fill:var(--muted)}
    .company{font-size:${mobile?22:22}px;font-weight:650;letter-spacing:-.4px}.role{font-size:14px;fill:var(--muted)}.focus{font-size:16px}
    .date{font-size:22px;font-weight:650}.date-end{font-size:13px;fill:var(--muted);letter-spacing:.7px}.date-mobile{font-size:12px;font-weight:650;letter-spacing:.7px;fill:var(--accent)}.tech{font-size:14px;font-weight:500}
    .card{fill:var(--surface);stroke:var(--border)}.chip{fill:var(--chip);stroke:var(--border)}.trace{stroke-dasharray:100;stroke-dashoffset:0}.halo{opacity:0}
    ${animate ? `@media(prefers-reduced-motion:no-preference){.trace{animation:trace 3.6s ease-in-out both}.halo{animation:halo .9s ease-out both}.h0{animation-delay:.1s}.h1{animation-delay:1.5s}.h2{animation-delay:3s}}
    @keyframes trace{from{stroke-dashoffset:100}to{stroke-dashoffset:0}}@keyframes halo{0%{opacity:0;stroke-width:1}35%{opacity:.7;stroke-width:6}100%{opacity:0;stroke-width:1}}` : ''}
  </style><rect width="${W}" height="${H}" rx="16" fill="var(--bg)"/>
  ${text(mobile?20:32,45,mobile?'Backend → cloud → AI':'A career built on backend systems','heading')}
  ${text(mobile?20:32,74,'Digital banking · Logistics · AI platforms','caption')}
  <path d="M${spineX} ${nodeYs[0]} V${nodeYs[2]}" fill="none" stroke="var(--line)" stroke-width="2"/>
  <path class="trace" pathLength="100" d="M${spineX} ${nodeYs[0]} V${nodeYs[2]}" fill="none" stroke="${dark?'#a995e8':'#8250df'}" stroke-width="2"/>`;
  stages.forEach((stage,i)=>{
    const groupStart=svg.length;
    const y=ys[i], accent=dark?stage.darkTone:stage.tone;
    const cx=mobile?52:150, cw=mobile?348:738, ch=mobile?238:146, tx=cx+(mobile?16:24);
    svg+=`<g style="--accent:${accent}"><circle class="halo h${i}" cx="${spineX}" cy="${nodeYs[i]}" r="12" fill="none" stroke="${accent}"/><circle cx="${spineX}" cy="${nodeYs[i]}" r="6" fill="${accent}" stroke="var(--bg)" stroke-width="3"/>
    <rect class="card" x="${cx}" y="${y}" width="${cw}" height="${ch}" rx="12"/>
    <rect x="${cx}" y="${y+18}" width="3" height="${ch-36}" rx="1.5" fill="${accent}"/>`;
    if(mobile){
      svg+=text(tx,y+25,stage.date,'date-mobile')+text(tx,y+56,stage.company,'company')+text(tx,y+81,stage.role,'role')+text(tx,y+110,stage.focus[0],'focus')+text(tx,y+132,stage.focus[1],'focus');
    }else{
      svg+=text(32,y+36,stage.start,'date')+text(32,y+59,stage.end,'date-end')+text(tx,y+32,stage.company,'company')+text(tx,y+57,stage.role,'role')+text(tx,y+84,stage.focus.join(' · '),'focus');
    }
    let chipX=tx, chipY=y+(mobile?150:100);
    stage.tech.forEach(([name,label],k)=>{
      const width=Math.ceil(label.length*7.5+43);
      if(mobile&&k===2){chipX=tx;chipY+=38;}
      svg+=`<rect class="chip" x="${chipX}" y="${chipY}" width="${width}" height="30" rx="7"/>${brand(name,chipX+9,chipY+5,20)}${text(chipX+35,chipY+20,label,'tech')}`;
      chipX+=width+8;
    });
    svg+='</g>';
    svg=svg.slice(0,groupStart)+svg.slice(groupStart).replaceAll('var(--accent)',accent);
  });
  for(const [key,value] of Object.entries(palette)) svg=svg.replaceAll(`var(--${key})`,value);
  return (svg+'</svg>\n').replace(/[ \t]+$/gm, '');
}
for(const theme of ['light','dark']) for(const mobile of [false,true]) {
  const name=`experience-${theme}${mobile?'-mobile':''}.svg`;
  fs.writeFileSync(path.join(root,'assets',name),timeline(mobile,theme));
}
fs.writeFileSync(path.join(root,'assets/experience-static.svg'),timeline(false,'light',false));

// Local preview renders the actual README and uses its repository-relative assets.
const body=marked.parse(fs.readFileSync(path.join(root,'README.md'),'utf8'));
const preview=`<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Carlos · GitHub README preview</title><style>
  :root{color-scheme:light dark;--bg:light-dark(#fff,#0d1117);--fg:light-dark(#1f2328,#e6edf3);--muted:light-dark(#57606a,#919ba8);--line:light-dark(#d1d9e0,#30363d);--soft:light-dark(#f6f8fa,#151b23);--link:light-dark(#0969da,#79b8ff)}*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--fg);font:16px/1.6 -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}main{max-width:984px;margin:36px auto;padding:32px;border:1px solid var(--line);border-radius:8px}h1{font-size:32px;line-height:1.25;padding-bottom:12px;border-bottom:1px solid var(--line)}h2{font-size:24px;line-height:1.35;margin-top:32px;padding-bottom:8px;border-bottom:1px solid var(--line)}h1,h2,h3{letter-spacing:-.3px}h2 img{vertical-align:-3px}a{color:var(--link);text-decoration:none}a:hover{text-decoration:underline}p,ul,table,details{margin:0 0 16px}img{max-width:100%;height:auto}p>img,p>a>img{vertical-align:middle}picture{display:block}picture>img{display:block;width:100%;height:auto}table{border-collapse:collapse;width:100%;display:block;overflow:auto}th,td{padding:10px 14px;text-align:left;border:1px solid var(--line)}th{background:var(--soft)}td img{vertical-align:middle}code{font-size:85%;padding:.2em .4em;background:var(--soft);border-radius:6px}summary{cursor:pointer;color:var(--muted)}details[open]>summary{margin-bottom:16px}sub{color:var(--muted)}@media(max-width:600px){main{margin:0;border:0;padding:18px}h1{font-size:28px}h2{font-size:22px}td,th{padding:8px}body{font-size:15px}}
  </style></head><body><main>${body}</main></body></html>`;
fs.writeFileSync(path.join(root,'README-preview.html'),preview);
console.log('Generated 5 timelines, section icons, and README-preview.html.');
