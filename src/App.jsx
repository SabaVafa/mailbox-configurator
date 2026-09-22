import { useState, useEffect } from "react";
const P="#1a6b47",PL="#e8f5ee",TX="#1a1a1a",MU="#6b7280",BD="#e5e7eb",WH="#ffffff",BASE=100,BOX_COLOR="#5a6f80";
const MODULE_META={
  none:{label:"Ohne Türstation",price:0,color:"#6b7280"},
  SDM10:{label:"SDM10",price:290,color:"#2563eb"},
  XDM10:{label:"XDM10",price:290,color:"#7c3aed"},
  VDM10:{label:"VDM10",price:600,color:"#b45309"},
  VDM10S:{label:"VDM10 S",price:480,color:"#b45309"},
};
function drawModule(x,y,CW,CH,modType,fp,licht,beleuchtet,showKlingel){
  if(modType==="SDM10"){
    const dw=CW*0.54,dh=CH*0.9,dx=x+(CW-dw)/2,dy=y+(CH-dh)/2;
    return(<g key="mod"><rect x={x} y={y} width={CW} height={CH} fill="#3c3c3c"/>
      <rect x={dx} y={dy} width={dw} height={dh} fill="#2a2a2a" stroke="#444" strokeWidth={CW*0.016}/>
      <rect x={dx+CW*0.05} y={dy+CW*0.05} width={dw-CW*0.1} height={dh-CW*0.1} fill="#0a0a0a"/>
      <circle cx={dx+dw/2} cy={dy+CH*0.18} r={CH*0.045} fill="#1e1e1e" stroke="#333" strokeWidth={CW*0.013}/>
      <circle cx={dx+dw/2} cy={dy+CH*0.18} r={CH*0.02} fill="#111"/></g>);
  }
  const blackH=CH*0.38,midY=y+CH*0.025+blackH/2;
  const camCx=x+CW*0.80,camR=blackH*0.19;
  const ltCx=x+CW*0.13,ltR=blackH*0.15;
  const fpW=blackH*0.225,fpH=blackH*0.275,fpX=x+CW*0.47-fpW/2,fpY=midY-fpH/2;
  const ltColor=beleuchtet?"#fbbf24":"#fff";
  const bottomY=y+CH*0.025+blackH,bottomH=CH-CH*0.025-blackH;
  const bCols=3,bRows=5,bW=(CW-4-(bCols-1)*1.5)/bCols,bH=(bottomH-4-(bRows-1)*1.5)/bRows;
  return(<g key="mod">
    <rect x={x} y={y} width={CW} height={CH} fill="#3a3a3a"/>
    <rect x={x} y={y} width={CW} height={CH*0.025} fill="#444"/>
    <rect x={x} y={y+CH*0.025} width={CW} height={blackH} fill="#0a0a0a"/>
    <circle cx={camCx} cy={midY} r={camR} fill="#111" stroke="#333" strokeWidth={camR*0.12}/>
    <circle cx={camCx} cy={midY} r={camR*0.65} fill="#0a0a0a" stroke="#444" strokeWidth={camR*0.08}/>
    <circle cx={camCx} cy={midY} r={camR*0.32} fill="#151515"/>
    <circle cx={camCx-camR*0.25} cy={midY-camR*0.25} r={camR*0.12} fill="rgba(255,255,255,0.18)"/>
    {fp&&(<g>
      <rect x={fpX} y={fpY} width={fpW} height={fpH} rx={fpW*0.14} fill="#2a2a2a" stroke="#666" strokeWidth={fpW*0.07}/>
      <rect x={fpX+fpW*0.13} y={fpY+fpH*0.13} width={fpW*0.74} height={fpH*0.74} rx={fpW*0.09} fill="#1a1a1a"/>
      {[0,1,2,3].map(li=><rect key={li} x={fpX+fpW*0.2} y={fpY+fpH*0.18+li*(fpH*0.155)} width={fpW*0.6} height={fpH*0.07} rx={fpW*0.04} fill="#666"/>)}
    </g>)}
    {licht&&(<g>
      <circle cx={ltCx} cy={midY} r={ltR} fill="none" stroke={ltColor} strokeWidth={ltR*0.13} opacity={0.85}/>
      <circle cx={ltCx} cy={midY-ltR*0.18} r={ltR*0.36} fill={beleuchtet?"#fbbf24":"none"} stroke={ltColor} strokeWidth={ltR*0.11} opacity={0.85}/>
      <line x1={ltCx-ltR*0.2} y1={midY+ltR*0.32} x2={ltCx+ltR*0.2} y2={midY+ltR*0.32} stroke={ltColor} strokeWidth={ltR*0.11} opacity={0.85}/>
      <line x1={ltCx} y1={midY-ltR*0.58} x2={ltCx} y2={midY-ltR*0.76} stroke={ltColor} strokeWidth={ltR*0.11} opacity={0.85}/>
    </g>)}
    {showKlingel&&Array.from({length:15},(_,i)=>{
      const bc=i%bCols,br=Math.floor(i/bCols);
      const bx=x+2+bc*(bW+1.5),by=bottomY+2+br*(bH+1.5);
      return(<g key={`kb${i}`}>
        <rect x={bx} y={by} width={bW} height={bH} rx={1} fill="#3a3a3a" stroke="#00bcd4" strokeWidth={0.8}/>
        <text x={bx+bW/2} y={by+bH/2+bH*0.15} textAnchor="middle" fontSize={bH*0.45} fill="#fff" fontWeight="300">+</text>
      </g>);
    })}
  </g>);
}
function Preview({count,rows,modType,fp,licht,beleuchtet,showKlingel,selectedEl,placement,onCellClick,showMeasure}){
  const hasMod=modType!=="none",slots=hasMod?count+1:count;
  const cols=Math.min(5,Math.ceil(slots/rows));
  const CW=62,CH=54,GAP=4,W=cols*(CW+GAP)+GAP,H=rows*(CH+GAP)+GAP;
  const MPAD=showMeasure?34:0;
  const VW=W+MPAD,VH=H+MPAD;
  const CELL_W=370,CELL_H=310;
  const totalW=cols*CELL_W,totalH=rows*CELL_H;
  const fmtMm=mm=>mm>=1000?`${(mm/1000).toFixed(2).replace('.',',')} m`:`${mm} mm`;
  const cells=[];let mIdx=0;
  for(let r=0;r<rows;r++) for(let c=0;c<cols;c++){
    const n=r*cols+c,placed=placement?.[n]??null;
    const isMod=placed==="module",isLeer=placed?.startsWith("empty")??false;
    const mbIdx=(isMod||isLeer)?-1:mIdx++;
    const isEmpty=!isMod&&!isLeer&&mbIdx>=count;
    cells.push({n,isMod,isLeer,isEmpty,placed});
  }
  const dimColor="#374151";
  return(<svg viewBox={`0 0 ${VW} ${VH}`} preserveAspectRatio="xMidYMid meet"
    style={{display:"block",width:"100%",height:"100%",maxHeight:"calc(100vh - 52px)",cursor:selectedEl?"crosshair":"default"}}>
    <rect x={0} y={0} width={W} height={H} fill="#232323"/>
    {cells.map(({n,isMod,isLeer,isEmpty,placed})=>{
      const r=Math.floor(n/cols),c=n%cols,x=c*(CW+GAP)+GAP,y=r*(CH+GAP)+GAP;
      const isActive=placed&&placed===selectedEl,canTarget=!!selectedEl&&!isMod&&!isLeer&&!isEmpty;
      if(isMod) return(<g key={n} onClick={()=>onCellClick?.(n)}>
        {drawModule(x,y,CW,CH,modType,fp,licht,beleuchtet,showKlingel)}
        {isActive&&<rect x={x} y={y} width={CW} height={CH} fill="none" stroke="#3b82f6" strokeWidth={2} strokeDasharray="4,2"/>}
      </g>);
      if(isLeer||isEmpty) return(<g key={n} onClick={()=>onCellClick?.(n)}>
        <rect x={x} y={y} width={CW} height={CH} fill={BOX_COLOR}/>
        {isActive&&<rect x={x} y={y} width={CW} height={CH} fill="none" stroke="#3b82f6" strokeWidth={2} strokeDasharray="4,2"/>}
        {canTarget&&!isActive&&<rect x={x} y={y} width={CW} height={CH} fill="rgba(59,130,246,0.08)" stroke="#3b82f6" strokeWidth={1.5} strokeDasharray="4,2"/>}
      </g>);
      return(<g key={n} onClick={()=>onCellClick?.(n)}>
        <rect x={x} y={y} width={CW} height={CH} fill={BOX_COLOR}/>
        <rect x={x} y={y} width={CW} height={2} fill="#6d8191"/>
        <rect x={x+6} y={y+7} width={CW-12} height={4} fill="#3a4f5c"/>
        <rect x={x+7} y={y+7.5} width={CW-14} height={2} fill="#2e3f4a"/>
        <circle cx={x+CW/2} cy={y+CH*0.3} r={3} fill="#3a4f5c" stroke="#6d8191" strokeWidth={0.8}/>
        <circle cx={x+CW/2} cy={y+CH*0.3} r={1.5} fill="#2e3f4a"/>
        {canTarget&&<rect x={x} y={y} width={CW} height={CH} fill="rgba(59,130,246,0.08)" stroke="#3b82f6" strokeWidth={1.5} strokeDasharray="4,2"/>}
      </g>);
    })}
    {showMeasure&&<>
      {/* width dimension – bottom */}
      <line x1={GAP} y1={H+2} x2={GAP} y2={H+14} stroke={dimColor} strokeWidth={0.7}/>
      <line x1={W-GAP} y1={H+2} x2={W-GAP} y2={H+14} stroke={dimColor} strokeWidth={0.7}/>
      <line x1={GAP} y1={H+8} x2={W-GAP} y2={H+8} stroke={dimColor} strokeWidth={0.7}/>
      <polygon points={`${GAP},${H+8} ${GAP+5},${H+5.5} ${GAP+5},${H+10.5}`} fill={dimColor}/>
      <polygon points={`${W-GAP},${H+8} ${W-GAP-5},${H+5.5} ${W-GAP-5},${H+10.5}`} fill={dimColor}/>
      <text x={W/2} y={H+24} fill={dimColor} fontSize={9} textAnchor="middle" fontFamily="system-ui,sans-serif" fontWeight="500">{fmtMm(totalW)}</text>
      {/* height dimension – right */}
      <line x1={W+2} y1={GAP} x2={W+14} y2={GAP} stroke={dimColor} strokeWidth={0.7}/>
      <line x1={W+2} y1={H-GAP} x2={W+14} y2={H-GAP} stroke={dimColor} strokeWidth={0.7}/>
      <line x1={W+8} y1={GAP} x2={W+8} y2={H-GAP} stroke={dimColor} strokeWidth={0.7}/>
      <polygon points={`${W+8},${GAP} ${W+5.5},${GAP+5} ${W+10.5},${GAP+5}`} fill={dimColor}/>
      <polygon points={`${W+8},${H-GAP} ${W+5.5},${H-GAP-5} ${W+10.5},${H-GAP-5}`} fill={dimColor}/>
      <text x={W+24} y={H/2} fill={dimColor} fontSize={9} textAnchor="middle" fontFamily="system-ui,sans-serif" fontWeight="500" transform={`rotate(-90,${W+24},${H/2})`}>{fmtMm(totalH)}</text>
    </>}
  </svg>);
}
function CompareModal({onClose}){
  const cols=[{key:"SDM10",label:"SDM10"},{key:"XDM10",label:"XDM10"},{key:"VDM10",label:"VDM10"}];
  const rows=[
    {feature:"Verbindungstyp",SDM10:"LAN + 12V DC",XDM10:"2-Draht BUS",VDM10:"LAN/PoE"},
    {feature:"Auflösung",SDM10:"FullHD 1080p",XDM10:"FullHD 1080p",VDM10:"FullHD 1080p"},
    {feature:"Display",SDM10:"HD 1280 x 800p",XDM10:false,VDM10:"Option 480 x 480"},
    {feature:"Gesichtserkennung",SDM10:true,XDM10:false,VDM10:false},
    {feature:"RFID / PIN",SDM10:true,XDM10:"Option",VDM10:"Option"},
    {feature:"Fingerprint",SDM10:false,XDM10:"Option",VDM10:"Option"},
    {feature:"Zwei-Wege Audio",SDM10:true,XDM10:true,VDM10:true},
    {feature:"App-Steuerung",sub:"über Innenstation",SDM10:"app",XDM10:"app",VDM10:"app"},
    {feature:"Preis",SDM10:"+290 €",XDM10:"+290 €",VDM10:"+600 €"},
  ];
  const rv=v=>{
    if(v===true) return <span style={{color:"#16a34a",fontSize:22}}>✓</span>;
    if(v===false) return <span style={{color:"#d1d5db"}}>–</span>;
    if(v==="app") return <span style={{color:"#16a34a",fontSize:22}}>✓</span>;
    if(typeof v==="string"&&v.startsWith("Option")){
      const s=v.replace("Option","").trim();
      return <span style={{display:"inline-flex",flexDirection:"column",alignItems:"center",gap:2}}>
        <span style={{fontSize:13,padding:"2px 8px",background:"#fef3c7",color:"#92400e",borderRadius:10,fontWeight:500}}>Option</span>
        {s&&<span style={{fontSize:11,color:MU}}>{s}</span>}
      </span>;
    }
    return <span style={{fontSize:13,color:TX}}>{v}</span>;
  };
  return(<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
    <div style={{background:WH,borderRadius:16,maxWidth:"95vw",maxHeight:"90vh",display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"20px 24px 16px",borderBottom:`1px solid ${BD}`,flexShrink:0}}>
        <span style={{fontWeight:700,fontSize:17,color:TX}}>Türstationsmodule vergleichen</span>
        <button onClick={onClose} style={{border:"none",background:"none",fontSize:24,cursor:"pointer",color:MU,lineHeight:1}}>×</button>
      </div>
      <div style={{overflowY:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:14}}>
          <thead><tr>
            <th style={{padding:"14px 20px",textAlign:"left",color:TX,fontWeight:600,borderBottom:`1px solid ${BD}`}}>Feature</th>
            {cols.map(c=><th key={c.key} style={{padding:"14px 20px",textAlign:"center",borderBottom:`1px solid ${BD}`}}>
              <span style={{fontWeight:700,fontSize:20,color:TX}}>{c.label}</span>
            </th>)}
          </tr></thead>
          <tbody>{rows.map((row,i)=>(
            <tr key={i} style={{background:i%2===0?WH:"#fafafa"}}>
              <td style={{padding:"14px 20px",whiteSpace:"nowrap",fontWeight:600,fontSize:14,color:TX}}>
                {row.feature}
                {row.sub&&<div style={{fontWeight:400,fontSize:12,color:MU,marginTop:2}}>{row.sub}</div>}
              </td>
              {cols.map(c=><td key={c.key} style={{padding:"14px 20px",textAlign:"center",borderLeft:`1px solid ${BD}`}}>{rv(row[c.key])}</td>)}
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  </div>);
}
function Dot({on}){
  return(<span style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:18,height:18,borderRadius:"50%",border:`2px solid ${on?P:"#9ca3af"}`,background:on?P:"transparent",flexShrink:0}}>
    {on&&<span style={{width:6,height:6,borderRadius:"50%",background:"#fff",display:"block"}}/>}
  </span>);
}
function Check({checked,onChange,children,price,noBorder}){
  return(<label onClick={onChange} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"10px 14px",border:noBorder?"none":`1.5px solid ${checked?P:BD}`,borderRadius:10,cursor:"pointer",background:checked&&!noBorder?PL:WH,marginBottom:8}}>
    <span style={{width:18,height:18,borderRadius:4,border:`2px solid ${checked?P:"#9ca3af"}`,background:checked?P:"transparent",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
      {checked&&<svg width="10" height="8" viewBox="0 0 10 8"><polyline points="1,4 4,7 9,1" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round"/></svg>}
    </span>
    <span style={{flex:1,fontSize:14,color:TX,display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>{children}{price>0&&<span style={{fontSize:13,color:P,fontWeight:600,flexShrink:0}}>+{price} €</span>}</span>
  </label>);
}
function Accordion({step,title,badge,active,done,locked,onToggle,children}){
  return(<div style={{borderRadius:12,border:`1.5px solid ${active?"#2d8a5e":BD}`,marginBottom:10,overflow:"hidden",background:locked?"#fafafa":WH,opacity:locked?0.5:1}}>
    <div onClick={locked?undefined:onToggle} style={{display:"flex",alignItems:"center",gap:12,padding:"14px 16px",cursor:locked?"not-allowed":"pointer",background:active?PL:WH}}>
      <span style={{width:28,height:28,borderRadius:8,background:done||active?P:"#e5e7eb",color:done||active?"#fff":MU,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:600,flexShrink:0}}>{step}</span>
      <span style={{flex:1}}>
        <span style={{fontWeight:600,fontSize:15,color:TX,display:"block"}}>{title}</span>
        {badge&&<span style={{fontSize:12,color:P,display:"block",marginTop:1}}>{badge}</span>}
      </span>
      <span style={{fontSize:14,color:MU}}>{active?"▲":"▼"}</span>
    </div>
    {active&&<div style={{padding:"12px 16px 16px",borderTop:`1px solid ${BD}`}}>{children}</div>}
  </div>);
}
function MobileBlock(){
  return(
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",fontFamily:"system-ui,sans-serif",background:"#fff"}}>
      {/* Header */}
      <div style={{padding:"14px 20px",borderBottom:"1px solid #e5e7eb",display:"flex",alignItems:"center"}}>
        <svg height="26" viewBox="0 0 180 40" fill="none">
          <rect x="0" y="0" width="36" height="36" rx="3" fill="#c0392b"/>
          <text x="18" y="26" textAnchor="middle" fill="white" fontSize="22" fontWeight="900" fontFamily="system-ui,sans-serif">M</text>
          <text x="46" y="27" fill="#1a1a1a" fontSize="22" fontWeight="700" fontFamily="system-ui,sans-serif" letterSpacing="-0.5">METZLER</text>
        </svg>
      </div>
      {/* Image */}
      <div style={{width:"100%",height:220,overflow:"hidden"}}>
        <img src={import.meta.env.BASE_URL + "image621.png"} alt="Briefkastenanlage" style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center"}}/>
      </div>
      {/* Content */}
      <div style={{padding:"28px 24px",flex:1,display:"flex",flexDirection:"column"}}>
<div style={{fontSize:22,fontWeight:700,color:"#1a1a1a",lineHeight:1.3,marginBottom:16}}>Gestalten Sie Ihre Briefkastenanlage individuell nach Ihren Wünschen!</div>
        <div style={{borderRadius:10,border:"1px solid #e5e7eb",background:"#f9fafb",padding:"16px 18px",fontSize:14,color:"#374151",lineHeight:1.7}}>
          <strong style={{display:"block",marginBottom:6,color:"#1a1a1a"}}>Konfigurator für Briefkastenanlagen – optimiert für Desktop und Laptop</strong>
          Der Konfigurator für Briefkastenanlagen ist ausschließlich auf Desktop-Computern und Laptops optimiert. Eine Nutzung auf mobilen Geräten ist leider nicht möglich.
        </div>
      </div>
    </div>
  );
}

function parseUrlState(){
  const p=new URLSearchParams(window.location.search);
  if(!p.has('count'))return null;
  const int=(k,d)=>Math.max(1,parseInt(p.get(k))||d);
  const pick=(k,opts,d)=>opts.includes(p.get(k))?p.get(k):d;
  return{
    count:Math.min(15,int('count',1)),
    mount:pick('mount',['none','stand','standb'],'none'),
    mod:pick('mod',['none','SDM10','XDM10','VDM10','VDM10S'],'none'),
    rows:Math.min(3,int('rows',1)),
    modPos:pick('modPos',['left','right'],'left'),
    zugang:pick('zugang',['none','fingerprint','touchDisplay'],'none'),
    licht:p.get('licht')==='1',
    beleuchtet:p.get('beleuchtet')==='1',
    klingel:p.get('klingel')==='1',
  };
}
const _INIT=parseUrlState();

export default function App(){
  const [step,setStep]=useState(_INIT?4:1);
  const [maxStep,setMaxStep]=useState(_INIT?4:1);
  const [count,setCount]=useState(_INIT?.count??1);
  const [mount,setMount]=useState(_INIT?.mount??"none");
  const [mod,setMod]=useState(_INIT?.mod??"none");
  const [rows,setRows]=useState(_INIT?.rows??1);
  const [modPos,setModPos]=useState(_INIT?.modPos??"left");
  const [zugang,setZugang]=useState(_INIT?.zugang??"none");
  const [licht,setLicht]=useState(_INIT?.licht??false);
  const [beleuchtet,setBeleuchtet]=useState(_INIT?.beleuchtet??false);
  const [klingel,setKlingel]=useState(_INIT?.klingel??false);
  const [klingelCount]=useState(1);
  const [showComp,setShowComp]=useState(false);
  const [countAdjusted,setCountAdjusted]=useState(false);
  const [selectedEl,setSelectedEl]=useState(null);
  const [placement,setPlacement]=useState({});
  const [showMeasure,setShowMeasure]=useState(false);
  const [copied,setCopied]=useState(false);
  const [showLogoConfirm,setShowLogoConfirm]=useState(false);
  const [panelBtn,setPanelBtn]=useState({camera:false,fullscreen:false});
  const fp=zugang==="fingerprint";
  const hasMod=mod!=="none";
  const maxCount=hasMod?14:15;
  const slots=hasMod?count+1:count;
  const rMin=Math.ceil(slots/5),rMax=Math.min(3,slots);
  const rowOptions=[1,2,3].filter(r=>r>=rMin&&r<=rMax);
  const effectiveRows=Math.max(rows,rMin);
  const canExtras=mod!=="none"&&mod!=="SDM10";
  const hasStand=mount!=="none";
  const cols4=Math.min(5,Math.ceil(slots/effectiveRows));
  const totalCells=effectiveRows*cols4;
  const emptyCount=totalCells-slots;
  const toggle=s=>setStep(p=>p===s?0:s);
  const goNext=s=>{setStep(s);setMaxStep(p=>Math.max(p,s));};
  useEffect(()=>{if(count>maxCount){setCount(maxCount);setCountAdjusted(true);}},[mod]);
  useEffect(()=>{if(rows<rMin)setRows(rMin);else if(rows>rMax)setRows(rMax);},[count,mod]);
  useEffect(()=>{
    if(mount!=="none"){
      setModPos("left");
      const newP={...placement};
      Object.keys(newP).forEach(k=>{if(newP[k]==="module")delete newP[k];});
      if(hasMod)newP[0]="module";
      setPlacement(newP);
    }
  },[mount]);
  useEffect(()=>{
    const r=Math.max(rows,rMin),c=Math.min(5,Math.ceil(slots/r));
    const total=r*c,empties=total-slots;
    setPlacement(()=>{
      const next={};
      if(hasMod)next[0]="module";
      let ei=0;
      for(let ci=total-1;ci>=0&&ei<empties;ci--){if(!next[ci]){next[ci]=`empty-${ei}`;ei++;}}
      return next;
    });
  },[count,effectiveRows,mod,hasMod]);
  const mountPrice={none:0,stand:110,standb:190}[mount]||0;
  const modPrice=MODULE_META[mod]?.price||0;
  const fpPrice=zugang==="fingerprint"&&canExtras?195:0;
  const tdPrice=zugang==="touchDisplay"&&(mod==="VDM10"||mod==="VDM10S")?285:0;
  const lichtPrice=canExtras&&licht?45:0;
  const klingelActive=canExtras&&(zugang!=="touchDisplay"||klingel);
  const klingelPrice=klingelActive?(klingelCount-1)*10:0;
  const beleuchtetPrice=klingelActive&&beleuchtet?78:0;
  const total=BASE+mountPrice+modPrice+fpPrice+tdPrice+lichtPrice+klingelPrice+beleuchtetPrice;
  const fmt=n=>n.toLocaleString("de-DE",{minimumFractionDigits:2,maximumFractionDigits:2});
  const mountBadge=mount==="none"?"Wandmontage":mount==="stand"?"Standfuß (+110 €)":"Standfuß + Bodenblenden (+190 €)";
  const modBadge=mod==="none"?"Keine":`${MODULE_META[mod].label} (+${modPrice} €)`;
  const handleCellClick=n=>{
    if(!selectedEl)return;
    const newP={...placement};
    const fromKey=Object.keys(newP).find(k=>newP[k]===selectedEl);
    const toContent=newP[n];
    newP[n]=selectedEl;
    if(fromKey!==undefined){if(toContent)newP[+fromKey]=toContent;else delete newP[+fromKey];}
    setPlacement(newP);setSelectedEl(null);
    if(selectedEl==="module"){const col=n%cols4;setModPos(col===0?"left":col===cols4-1?"right":"center");}
  };
  const KlingelBlock=({required,mandatory})=>{
    const [showHint,setShowHint]=useState(false);
    return(<div style={{marginTop:10}}>
      {required?(
        <div style={{border:`1.5px solid ${P}`,borderRadius:10,overflow:"hidden",background:WH}}>
          <div style={{display:"flex",alignItems:"flex-start",gap:10,padding:"10px 14px"}}>
            <span style={{flex:1,fontSize:14,color:TX}}>
              <span style={{display:"flex",alignItems:"center",gap:7,flexWrap:"wrap"}}>
                Klingeltaster-System
                {mandatory&&<span style={{fontSize:11,fontWeight:600,color:"#9a3412",background:"#fff7ed",border:"1px solid #fdba74",borderRadius:5,padding:"1px 7px",letterSpacing:0.2}}>Pflichtfeld</span>}
              </span>
              <span style={{color:MU,fontWeight:400,fontSize:12}}>{mandatory?"Für dieses Modul ist mindestens ein Klingeltaster erforderlich.":"Türklingel mit konfigurierbaren Tastern (inklusive)"}</span>
            </span>
          </div>
          <div style={{padding:"0 14px 12px",borderTop:`1px solid ${BD}`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0"}}>
              <span style={{fontSize:13,color:TX,fontWeight:500}}>Klingeltaster-Anzahl: {klingelCount}</span>
              <span style={{fontSize:12,color:P,fontWeight:600}}>+{(klingelCount-1)*10} €</span>
            </div>
            <button onClick={()=>setShowHint(v=>!v)} style={{display:"flex",alignItems:"center",gap:5,background:"none",border:"none",padding:"0 0 6px",cursor:"pointer",color:"#0369a1",fontSize:12}}>
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="#0369a1" strokeWidth="1.5"/><line x1="8" y1="7" x2="8" y2="11" stroke="#0369a1" strokeWidth="1.5" strokeLinecap="round"/><circle cx="8" cy="5" r="0.8" fill="#0369a1"/></svg>
              Wie füge ich Klingeltaster hinzu?
              <span style={{fontSize:10}}>{showHint?"▲":"▼"}</span>
            </button>
            {showHint&&<div style={{background:"#e0f2fe",borderRadius:8,padding:"10px 12px",marginBottom:8,display:"flex",flexDirection:"column",gap:7}}>
              <div style={{display:"flex",alignItems:"flex-start",gap:7}}>
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none" style={{flexShrink:0,marginTop:1}}><path d="M6 2L6 11L8.5 8.5L10 12L11.5 11.3L10 7.8L13 7.8Z" fill="#0369a1"/></svg>
                <span style={{fontSize:12,color:"#0c4a6e",lineHeight:1.4}}>Drücken Sie <strong style={{color:"#0369a1"}}>+</strong> direkt am 3D-Modell, um einen Klingeltaster hinzuzufügen.</span>
              </div>
              <div style={{display:"flex",alignItems:"flex-start",gap:7}}>
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none" style={{flexShrink:0,marginTop:1}}><line x1="8" y1="2" x2="8" y2="14" stroke="#0369a1" strokeWidth="1.5" strokeLinecap="round"/><line x1="2" y1="8" x2="14" y2="8" stroke="#0369a1" strokeWidth="1.5" strokeLinecap="round"/><polygon points="8,1 6,4 10,4" fill="#0369a1"/><polygon points="8,15 6,12 10,12" fill="#0369a1"/><polygon points="1,8 4,6 4,10" fill="#0369a1"/><polygon points="15,8 12,6 12,10" fill="#0369a1"/></svg>
                <span style={{fontSize:12,color:"#0c4a6e",lineHeight:1.4}}><strong style={{color:"#0369a1"}}>Sie entscheiden</strong>, wo die Taster auf der Oberfläche sitzen.</span>
              </div>
            </div>}
            <Check checked={beleuchtet} onChange={()=>setBeleuchtet(v=>!v)} price={78}>Beleuchteter Öffnungstaster</Check>
          </div>
        </div>
      ):(
        <div style={{border:`1.5px solid ${P}`,borderRadius:10,overflow:"hidden",background:WH}}>
          <label onClick={()=>{setKlingel(v=>!v);if(klingel)setBeleuchtet(false);}} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"10px 14px",cursor:"pointer"}}>
            <span style={{width:18,height:18,borderRadius:4,border:`2px solid ${klingel?P:"#9ca3af"}`,background:klingel?P:"transparent",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",marginTop:1}}>
              {klingel&&<svg width="10" height="8" viewBox="0 0 10 8"><polyline points="1,4 4,7 9,1" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round"/></svg>}
            </span>
            <span style={{flex:1,fontSize:14,color:TX}}>Klingeltaster-System<br/><span style={{color:MU,fontWeight:400,fontSize:12}}>Türklingel mit konfigurierbaren Tastern</span></span>
          </label>
          {klingel&&(
            <div style={{padding:"0 14px 12px",borderTop:`1px solid ${BD}`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0"}}>
                <span style={{fontSize:13,color:P,fontWeight:500}}>Klingeltaster-Anzahl: {klingelCount}</span>
                <span style={{fontSize:12,color:P,fontWeight:600}}>+{(klingelCount-1)*10} €</span>
              </div>
              <Check checked={beleuchtet} onChange={()=>setBeleuchtet(v=>!v)} price={78}>Beleuchteter Öffnungstaster</Check>
            </div>
          )}
        </div>
      )}
    </div>);
  };
  const buildPreviewSvg=(CW,CH,GAP)=>{
    const svgW=cols4*(CW+GAP)+GAP,svgH=effectiveRows*(CH+GAP)+GAP;
    let cells=`<rect x="0" y="0" width="${svgW}" height="${svgH}" fill="#232323" rx="4"/>`;
    let mi=0;
    for(let r=0;r<effectiveRows;r++) for(let c=0;c<cols4;c++){
      const n=r*cols4+c,placed=placement?.[n]??null;
      const isMod=placed==="module",isLeer=placed?.startsWith("empty")??false;
      const mbIdx=(isMod||isLeer)?-1:mi++;
      const isEmpty=!isMod&&!isLeer&&mbIdx>=count;
      const x=c*(CW+GAP)+GAP,y=r*(CH+GAP)+GAP;
      if(isMod){
        const blackH=CH*0.38,midY=y+CH*0.025+blackH/2,camCx=x+CW*0.80,camR=blackH*0.19;
        const ltCx=x+CW*0.13,ltR=blackH*0.15;
        const bottomY=y+CH*0.025+blackH,bottomH=CH-CH*0.025-blackH;
        const bCols=3,bRows=5,bW=(CW-4-(bCols-1)*1.5)/bCols,bH=(bottomH-4-(bRows-1)*1.5)/bRows;
        cells+=`<rect x="${x}" y="${y}" width="${CW}" height="${CH}" fill="#3a3a3a"/>`;
        cells+=`<rect x="${x}" y="${y}" width="${CW}" height="${CH*0.025}" fill="#555"/>`;
        cells+=`<rect x="${x}" y="${y+CH*0.025}" width="${CW}" height="${blackH}" fill="#0a0a0a"/>`;
        cells+=`<circle cx="${camCx}" cy="${midY}" r="${camR}" fill="#111" stroke="#333" stroke-width="${camR*0.12}"/>`;
        cells+=`<circle cx="${camCx}" cy="${midY}" r="${camR*0.5}" fill="#0a0a0a"/>`;
        if(licht) cells+=`<circle cx="${ltCx}" cy="${midY}" r="${ltR}" fill="none" stroke="${beleuchtet?"#fbbf24":"#fff"}" stroke-width="${ltR*0.2}" opacity="0.85"/>`;
        if(klingelActive) for(let i=0;i<15;i++){
          const bc=i%bCols,br=Math.floor(i/bCols);
          const bx=x+2+bc*(bW+1.5),by=bottomY+2+br*(bH+1.5);
          cells+=`<rect x="${bx}" y="${by}" width="${bW}" height="${bH}" rx="1" fill="#3a3a3a" stroke="#00bcd4" stroke-width="0.8"/>`;
          cells+=`<text x="${bx+bW/2}" y="${by+bH*0.65}" text-anchor="middle" font-size="${bH*0.5}" fill="#fff" font-family="system-ui,sans-serif">+</text>`;
        }
      } else if(isLeer||isEmpty){
        cells+=`<rect x="${x}" y="${y}" width="${CW}" height="${CH}" fill="#4a5568"/>`;
      } else {
        cells+=`<rect x="${x}" y="${y}" width="${CW}" height="${CH}" fill="#5a6f80"/>`;
        cells+=`<rect x="${x}" y="${y}" width="${CW}" height="${CW*0.032}" fill="#6d8191"/>`;
        cells+=`<rect x="${x+CW*0.09}" y="${y+CW*0.11}" width="${CW*0.82}" height="${CW*0.065}" fill="#3a4f5c" rx="1"/>`;
        cells+=`<circle cx="${x+CW/2}" cy="${y+CH*0.45}" r="${CW*0.052}" fill="#3a4f5c" stroke="#6d8191" stroke-width="${CW*0.013}"/>`;
        cells+=`<circle cx="${x+CW/2}" cy="${y+CH*0.45}" r="${CW*0.026}" fill="#2e3f4a"/>`;
      }
    }
    return{svg:cells,w:svgW,h:svgH};
  };
  const buildModuleSvgStr=(W,H)=>{
    if(mod==="SDM10"){
      const dw=W*0.54,dh=H*0.9,dx=(W-dw)/2,dy=(H-dh)/2;
      return `<rect width="${W}" height="${H}" fill="#3c3c3c"/>
        <rect x="${dx}" y="${dy}" width="${dw}" height="${dh}" fill="#2a2a2a" stroke="#555" stroke-width="2"/>
        <rect x="${dx+W*0.05}" y="${dy+W*0.05}" width="${dw-W*0.1}" height="${dh-W*0.1}" fill="#0a0a0a"/>
        <circle cx="${dx+dw/2}" cy="${dy+H*0.18}" r="${H*0.045}" fill="#1e1e1e" stroke="#444" stroke-width="2"/>`;
    }
    const blackH=H*0.38,midY=H*0.025+blackH/2,camCx=W*0.80,camR=blackH*0.19;
    const ltCx=W*0.13,ltR=blackH*0.15,ltColor=beleuchtet?"#fbbf24":"#fff";
    const fpW=blackH*0.225,fpH=blackH*0.275,fpX=W*0.47-fpW/2,fpY=midY-fpH/2;
    const bottomY=H*0.025+blackH,bottomH=H-H*0.025-blackH;
    const bCols=3,bRows=5,bW=(W-4-(bCols-1)*1.5)/bCols,bH=(bottomH-4-(bRows-1)*1.5)/bRows;
    let s=`<rect width="${W}" height="${H}" fill="#3a3a3a"/>
      <rect width="${W}" height="${H*0.025}" fill="#444"/>
      <rect y="${H*0.025}" width="${W}" height="${blackH}" fill="#0a0a0a"/>
      <circle cx="${camCx}" cy="${midY}" r="${camR}" fill="#111" stroke="#333" stroke-width="${camR*0.12}"/>
      <circle cx="${camCx}" cy="${midY}" r="${camR*0.65}" fill="#0a0a0a" stroke="#444" stroke-width="${camR*0.08}"/>
      <circle cx="${camCx}" cy="${midY}" r="${camR*0.32}" fill="#151515"/>
      <circle cx="${camCx-camR*0.25}" cy="${midY-camR*0.25}" r="${camR*0.12}" fill="rgba(255,255,255,0.18)"/>`;
    if(fp) s+=`<rect x="${fpX}" y="${fpY}" width="${fpW}" height="${fpH}" rx="${fpW*0.14}" fill="#2a2a2a" stroke="#666" stroke-width="${fpW*0.07}"/>
      <rect x="${fpX+fpW*0.13}" y="${fpY+fpH*0.13}" width="${fpW*0.74}" height="${fpH*0.74}" rx="${fpW*0.09}" fill="#1a1a1a"/>
      ${[0,1,2,3].map(li=>`<rect x="${fpX+fpW*0.2}" y="${fpY+fpH*0.18+li*(fpH*0.155)}" width="${fpW*0.6}" height="${fpH*0.07}" rx="${fpW*0.04}" fill="#666"/>`).join("")}`;
    if(licht) s+=`<circle cx="${ltCx}" cy="${midY}" r="${ltR}" fill="none" stroke="${ltColor}" stroke-width="${ltR*0.13}" opacity="0.85"/>
      <circle cx="${ltCx}" cy="${midY-ltR*0.18}" r="${ltR*0.36}" fill="${beleuchtet?"#fbbf24":"none"}" stroke="${ltColor}" stroke-width="${ltR*0.11}" opacity="0.85"/>
      <line x1="${ltCx-ltR*0.2}" y1="${midY+ltR*0.32}" x2="${ltCx+ltR*0.2}" y2="${midY+ltR*0.32}" stroke="${ltColor}" stroke-width="${ltR*0.11}" opacity="0.85"/>
      <line x1="${ltCx}" y1="${midY-ltR*0.58}" x2="${ltCx}" y2="${midY-ltR*0.76}" stroke="${ltColor}" stroke-width="${ltR*0.11}" opacity="0.85"/>`;
    if(klingelActive) for(let i=0;i<15;i++){
      const bc=i%bCols,br=Math.floor(i/bCols),bx=2+bc*(bW+1.5),by=bottomY+2+br*(bH+1.5);
      s+=`<rect x="${bx}" y="${by}" width="${bW}" height="${bH}" rx="1" fill="#3a3a3a" stroke="#00bcd4" stroke-width="0.8"/>
        <text x="${bx+bW/2}" y="${by+bH*0.65}" text-anchor="middle" font-size="${bH*0.45}" fill="#fff" font-family="system-ui,sans-serif">+</text>`;
    }
    return s;
  };
  const handleReset=()=>{
    setStep(1);setMaxStep(1);setCount(1);setMount("none");setMod("none");
    setRows(1);setModPos("left");setZugang("none");setLicht(false);
    setBeleuchtet(false);setKlingel(false);setSelectedEl(null);setPlacement({});
    setShowMeasure(false);setCountAdjusted(false);
    window.history.replaceState({},'',window.location.pathname);
  };
  const handlePdfExport=()=>{
    const today=new Date().toLocaleDateString("de-DE",{day:"2-digit",month:"2-digit",year:"numeric"});
    const configUrl="https://metzler-briefkasten.de/konfigurator";
    const DOT="\u00B7",UE="\u00FC",SS="\u00DF";
    const subLine=`${count} Postboxen ${DOT} ${effectiveRows} Reihe${effectiveRows>1?"n":""} ${DOT} ${mod!=="none"?MODULE_META[mod].label+" T"+UE+"rstation":"Ohne T"+UE+"rstation"}`;
    const mountLabel=mount==="none"?"Wandmontage":mount==="stand"?`Standf${UE}${SS}`:`Standf${UE}${SS} + Bodenblenden`;
    const articles=[];
    articles.push({name:`Postboxen Stahlblau (${count} St${UE}ck, ${effectiveRows} Reihe${effectiveRows>1?"n":""})`,nr:"BK-"+count+"x"+effectiveRows,unit:BASE,qty:count,total:BASE});
    if(mount==="stand") articles.push({name:`Standf${UE}${SS}`,nr:"SF-100",unit:110,qty:1,total:110});
    if(mount==="standb") articles.push({name:`Standf${UE}${SS} + Bodenblenden`,nr:"SF-190",unit:190,qty:1,total:190});
    if(mod!=="none") articles.push({name:`T${UE}rstation ${MODULE_META[mod].label}`,nr:`TS-${mod}`,unit:modPrice,qty:1,total:modPrice});
    if(fpPrice>0) articles.push({name:"Fingerprint + RFID Modul",nr:"FP-195",unit:195,qty:1,total:195});
    if(tdPrice>0) articles.push({name:"Touch-Display + RFID + PIN",nr:"TD-285",unit:285,qty:1,total:285});
    if(lichtPrice>0) articles.push({name:"Lichttaster",nr:"LT-045",unit:45,qty:1,total:45});
    if(klingelPrice>0) articles.push({name:"Klingeltaster-System",nr:"KL-010",unit:10,qty:klingelCount,total:klingelPrice});
    if(beleuchtetPrice>0) articles.push({name:`Beleuchteter \u00D6ffnungstaster`,nr:"BO-078",unit:78,qty:1,total:78});
    const CW=130,CH=114,GAP=7;
    const {svg:previewCells,w:pvW,h:pvH}=buildPreviewSvg(CW,CH,GAP);
    const MW=700,MH=610,modSvgContent=hasMod?buildModuleSvgStr(MW,MH):"";
    const articleRows=articles.map((a,i)=>`
      <tr style="background:${i%2===0?"#f9fafb":"#fff"}">
        <td style="padding:16px 20px;font-size:17px;color:#111;font-weight:600;border-bottom:1px solid #e5e7eb">${a.name}</td>
        <td style="padding:16px 20px;font-size:15px;color:#9ca3af;border-bottom:1px solid #e5e7eb;text-align:center">${a.nr}</td>
        <td style="padding:16px 20px;font-size:16px;color:#374151;border-bottom:1px solid #e5e7eb;text-align:right">${fmt(a.unit)}</td>
        <td style="padding:16px 20px;font-size:16px;color:#374151;border-bottom:1px solid #e5e7eb;text-align:center">${a.qty}</td>
        <td style="padding:16px 20px;font-size:17px;color:#111;font-weight:700;border-bottom:1px solid #e5e7eb;text-align:right">${fmt(a.total)}</td>
      </tr>`).join("");
    const hdr=(t,s)=>`
      <div style="display:flex;justify-content:space-between;align-items:center;padding-bottom:20px;border-bottom:3px solid #1a1a1a;margin-bottom:40px">
        <div style="display:flex;align-items:center;gap:16px">
          <div style="width:52px;height:52px;background:#c0392b;color:#fff;font-size:28px;font-weight:900;display:flex;align-items:center;justify-content:center;border-radius:7px;flex-shrink:0">M</div>
          <span style="font-size:32px;font-weight:800;letter-spacing:-0.5px">METZLER</span>
        </div>
        <div style="text-align:right">
          <div style="font-size:15px;color:#9ca3af">Briefkasten Konfigurator</div>
          <div style="font-size:14px;color:#6b7280;margin-top:4px">Erstellt am ${today}</div>
        </div>
      </div>
      ${t?`<div style="font-size:34px;font-weight:800;text-align:center;margin-bottom:10px">${t}</div>`:""}
      ${s?`<div style="font-size:18px;color:#6b7280;text-align:center;margin-bottom:36px">${s}</div>`:""}`;
    const foot=`<div style="margin-top:auto;padding-top:18px;border-top:1px solid #e5e7eb;font-size:13px;color:#9ca3af;text-align:center;line-height:2">
      <div>Konfiguration online aufrufen: <strong style="color:#1a6b47">${configUrl}</strong></div>
      <div>\u00A9 ${new Date().getFullYear()} Metzler \u00B7 Alle Preise inkl. 19% MwSt. \u00B7 Unverbindliche Preisauskunft</div>
    </div>`;
    const html=`<!DOCTYPE html><html lang="de"><head><meta charset="UTF-8"><title>Metzler Konfiguration</title>
    <style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:system-ui,-apple-system,sans-serif;background:#fff}
    .page{width:210mm;min-height:297mm;padding:14mm 14mm;margin:0 auto;display:flex;flex-direction:column;page-break-after:always}
    @media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}.page{page-break-after:always;margin:0}}
    @media screen{body{background:#e5e5e5}.page{margin:20px auto;box-shadow:0 4px 32px rgba(0,0,0,0.12)}}</style>
    </head><body>
    <div class="page">
      ${hdr("Ihre Konfiguration",subLine)}
      <div style="display:flex;align-items:stretch;width:100%">
        <div style="display:flex;flex-direction:column;align-items:center;margin-right:10px;justify-content:center;align-self:stretch">
          <div style="width:2px;flex:1;background:#9ca3af;position:relative"><div style="position:absolute;top:-1px;left:-4px;border-left:5px solid transparent;border-right:5px solid transparent;border-bottom:9px solid #9ca3af"></div></div>
          <div style="writing-mode:vertical-rl;transform:rotate(180deg);font-size:14px;font-weight:700;color:#374151;padding:8px 0;white-space:nowrap">ca. ${effectiveRows*40} cm</div>
          <div style="width:2px;flex:1;background:#9ca3af;position:relative"><div style="position:absolute;bottom:-1px;left:-4px;border-left:5px solid transparent;border-right:5px solid transparent;border-top:9px solid #9ca3af"></div></div>
        </div>
        <div style="flex:1;min-width:0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${pvW} ${pvH}" style="display:block;width:100%;border-radius:6px">${previewCells}</svg>
          <div style="display:flex;align-items:center;margin-top:8px">
            <div style="height:2px;flex:1;background:#9ca3af;position:relative"><div style="position:absolute;left:-1px;top:-4px;border-top:5px solid transparent;border-bottom:5px solid transparent;border-right:9px solid #9ca3af"></div></div>
            <div style="padding:0 12px;font-size:14px;font-weight:700;color:#374151;white-space:nowrap">ca. ${cols4*37} cm</div>
            <div style="height:2px;flex:1;background:#9ca3af;position:relative"><div style="position:absolute;right:-1px;top:-4px;border-top:5px solid transparent;border-bottom:5px solid transparent;border-left:9px solid #9ca3af"></div></div>
          </div>
        </div>
      </div>
      <div style="text-align:center;margin-top:10px;font-size:16px;color:#6b7280">Tiefe: <strong style="color:#374151">ca. 35 cm</strong></div>
      ${foot}
    </div>
    ${hasMod?`<div class="page">
      ${hdr("T"+UE+"rstation: "+MODULE_META[mod].label,"Detailansicht mit allen konfigurierten Optionen")}
      <div style="display:flex;justify-content:center;margin:0 auto 28px;width:80%">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${MW} ${MH}" style="display:block;width:100%;border-radius:8px">${modSvgContent}</svg>
      </div>
      <div style="display:flex;justify-content:center;gap:12px;flex-wrap:wrap;margin-bottom:28px">
        <span style="background:#1a1a1a;color:#fff;padding:10px 24px;border-radius:28px;font-size:16px;font-weight:700">${MODULE_META[mod].label}</span>
        ${fp?`<span style="background:#e8f5ee;color:#1a6b47;padding:10px 24px;border-radius:28px;font-size:16px;font-weight:600;border:1.5px solid #1a6b47">Fingerprint + RFID</span>`:""}
        ${licht?`<span style="background:#e8f5ee;color:#1a6b47;padding:10px 24px;border-radius:28px;font-size:16px;font-weight:600;border:1.5px solid #1a6b47">Lichttaster</span>`:""}
        ${klingelActive?`<span style="background:#e8f5ee;color:#1a6b47;padding:10px 24px;border-radius:28px;font-size:16px;font-weight:600;border:1.5px solid #1a6b47">Klingeltaster-System</span>`:""}
        ${beleuchtet?`<span style="background:#e8f5ee;color:#1a6b47;padding:10px 24px;border-radius:28px;font-size:16px;font-weight:600;border:1.5px solid #1a6b47">Beleuchteter \u00D6ffnungstaster</span>`:""}
        ${zugang==="touchDisplay"?`<span style="background:#e8f5ee;color:#1a6b47;padding:10px 24px;border-radius:28px;font-size:16px;font-weight:600;border:1.5px solid #1a6b47">Touch-Display + RFID + PIN</span>`:""}
      </div>
      ${foot}
    </div>`:""}
    <div class="page">
      ${hdr("Zusammenfassung","")}
      <table style="width:100%;border-collapse:collapse">
        <thead><tr style="border-bottom:2px solid #1a6b47">
          <th style="padding:14px 20px;text-align:left;font-size:15px;color:#1a6b47;font-weight:700">Komponente</th>
          <th style="padding:14px 20px;text-align:center;font-size:15px;color:#1a6b47;font-weight:700">Artikelnummer</th>
          <th style="padding:14px 20px;text-align:right;font-size:15px;color:#1a6b47;font-weight:700">St\u00FCckpreis (\u20AC)</th>
          <th style="padding:14px 20px;text-align:center;font-size:15px;color:#1a6b47;font-weight:700">Anzahl</th>
          <th style="padding:14px 20px;text-align:right;font-size:15px;color:#1a6b47;font-weight:700">Gesamtpreis (\u20AC)</th>
        </tr></thead>
        <tbody>${articleRows}</tbody>
        <tfoot>
          <tr><td colspan="3" style="padding:16px 20px;border-top:2px solid #e5e7eb"></td>
            <td style="padding:16px 20px;font-size:16px;color:#9ca3af;font-weight:600;border-top:2px solid #e5e7eb;text-align:center">Gesamt</td>
            <td style="padding:16px 20px;font-size:22px;font-weight:800;color:#111;border-top:2px solid #e5e7eb;text-align:right">${fmt(total)}</td></tr>
          <tr><td colspan="3"></td>
            <td style="padding:4px 20px 16px;font-size:13px;color:#9ca3af;text-align:center">inkl. 19% MwSt.</td>
            <td style="padding:4px 20px 16px;font-size:13px;color:#9ca3af;text-align:right">${fmt(total)} EUR</td></tr>
        </tfoot>
      </table>
      <div style="margin-top:28px;padding:20px 24px;background:#f9fafb;border-radius:10px;border:1px solid #e5e7eb">
        <div style="font-size:13px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:14px">Konfigurationsdetails</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px 40px;font-size:16px">
          <div><span style="color:#9ca3af">Postboxen:</span> <strong>${count} St\u00FCck</strong></div>
          <div><span style="color:#9ca3af">Reihen:</span> <strong>${effectiveRows}</strong></div>
          <div><span style="color:#9ca3af">Montage:</span> <strong>${mountLabel}</strong></div>
          <div><span style="color:#9ca3af">T\u00FCrstation:</span> <strong>${mod==="none"?"Keine":MODULE_META[mod].label}</strong></div>
          <div><span style="color:#9ca3af">Breite:</span> <strong>ca. ${cols4*37} cm</strong></div>
          <div><span style="color:#9ca3af">H\u00F6he:</span> <strong>ca. ${effectiveRows*40} cm</strong></div>
        </div>
      </div>
      ${foot}
    </div>
    <script>window.onload=()=>window.print()<\/script>
    </body></html>`;
    const blob=new Blob([html],{type:"text/html"});
    window.open(URL.createObjectURL(blob),"_blank");
  };
  const MODULES=[
    {key:"none",label:"Ohne Türstation",sub:"Nur Postboxen, kein Türmodul",price:0,conn:null,features:[]},
    {key:"SDM10",label:"SDM10",sub:"Touch-Display mit Gesichtserkennung",price:290,
      conn:{type:"LAN + 12V DC",desc:"Anschluss",color:"#e0f2fe",tc:"#0369a1"},
      features:[{t:"Smartphone App"},{t:"Türöffnung per Gesichtserkennung"},{t:"SIP & FRITZ! Integration"},{t:"RFID & PIN"},{t:"IPS Touch-Display"},{t:"HD-Kamera 1080p"}]},
    {key:"XDM10",label:"XDM10",sub:"Flach Kamera Modul",price:290,
      conn:{type:"2-Draht BUS",desc:"Anschluss",color:"#fef3c7",tc:"#92400e"},
      features:[{t:"Plug & Play mit 2-Draht-Technik"},{t:"Smartphone App"},{t:"Integrierte Türöffner Stromversorgung"}]},
    {key:"VDM10",label:"VDM10",sub:"Hervorgehoben Kamera Modul",price:600,
      conn:{type:"LAN/PoE",desc:"Anschluss",color:"#e0f2fe",tc:"#0369a1"},
      features:[{t:"SIP & FRITZ! Integration"},{t:"Smartphone App"},{t:"Innenstationen kabellos verbinden"},{t:"Integrierte Türöffner Stromversorgung"}]},
    ...(count<=2?[{key:"VDM10S",label:"VDM10 S",sub:"Kompaktvariante (1–2 Boxen)",price:480,
      conn:{type:"LAN/PoE",desc:"Anschluss",color:"#e0f2fe",tc:"#0369a1"},
      features:[{t:"SIP & FRITZ! Integration"},{t:"Smartphone App"},{t:"Innenstationen kabellos verbinden"}]}]:[])
  ];
  const isMobile=window.innerWidth<768;
  if(isMobile) return <MobileBlock/>;
  return(
    <div style={{display:"flex",flexDirection:"column",height:"100vh",fontFamily:"system-ui,sans-serif",overflow:"hidden"}}>
      {showLogoConfirm&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <div style={{background:WH,borderRadius:12,padding:"28px 28px 24px",maxWidth:400,width:"90%",boxShadow:"0 8px 32px rgba(0,0,0,0.18)"}}>
            <div style={{fontSize:16,fontWeight:700,color:TX,marginBottom:8}}>Konfiguration verlassen?</div>
            <div style={{fontSize:14,color:TX,marginBottom:24,lineHeight:1.6}}>Wenn Sie die Seite verlassen, geht Ihre aktuelle Konfiguration verloren.</div>
            <div style={{display:"flex",gap:12,justifyContent:"center"}}>
              <button onClick={()=>window.location.href="/"} style={{flex:1,padding:"8px 0",borderRadius:6,border:`1.5px solid #005253`,background:"none",fontSize:13,color:"#005253",cursor:"pointer",fontWeight:600}}>Verlassen</button>
              <button onClick={()=>setShowLogoConfirm(false)} style={{flex:1,padding:"8px 0",borderRadius:6,border:"none",background:"#005253",fontSize:13,color:WH,cursor:"pointer",fontWeight:600}}>Abbrechen</button>
            </div>
          </div>
        </div>
      )}
      <div style={{height:52,background:WH,borderBottom:`1px solid ${BD}`,display:"flex",alignItems:"center",paddingLeft:16,paddingRight:16,flexShrink:0,zIndex:10}}>
        <div style={{display:"flex",alignItems:"center",gap:10,flex:1,minWidth:0}}>
          <button onClick={()=>setShowLogoConfirm(true)} style={{background:"none",border:"none",padding:0,cursor:"pointer",flexShrink:0,display:"flex"}}>
            <svg height="26" viewBox="0 0 180 40" fill="none">
              <rect x="0" y="0" width="36" height="36" rx="3" fill="#c0392b"/>
              <text x="18" y="26" textAnchor="middle" fill="white" fontSize="22" fontWeight="900" fontFamily="system-ui,sans-serif">M</text>
              <text x="46" y="27" fill="#1a1a1a" fontSize="22" fontWeight="700" fontFamily="system-ui,sans-serif" letterSpacing="-0.5">METZLER</text>
            </svg>
          </button>
          <span style={{color:BD,fontSize:14}}>|</span>
          <span style={{fontSize:13,color:MU,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>Briefkasten Konfigurator</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
          <button onClick={handleReset} style={{display:"flex",alignItems:"center",justifyContent:"center",gap:5,background:"none",border:`1.5px solid #6b7280`,borderRadius:6,padding:"5px 0",width:120,fontSize:12,color:TX,cursor:"pointer",fontWeight:600}}>
            <svg width="12" height="12" viewBox="2 2 17 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.578 6.48708C4.55072 4.80829 6.1004 3.54022 7.93848 2.91898C9.77657 2.29773 11.7778 2.36566 13.5695 3.11011C15.3613 3.85456 16.8214 5.22479 17.678 6.96568C18.5347 8.70656 18.7294 10.6994 18.2261 12.5732C17.7227 14.447 16.5556 16.0741 14.9419 17.1514C13.3282 18.2286 11.378 18.6828 9.45441 18.4292C7.53082 18.1756 5.76494 17.2316 4.48557 15.7729C3.20621 14.3142 2.50055 12.4403 2.5 10.5001" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M7.5 6.5H3.5V2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Zurücksetzen
          </button>
          <span style={{width:1,height:20,background:"#e5e7eb",flexShrink:0}}/>
          <button onClick={()=>{const p=new URLSearchParams({count,mount,mod,rows,modPos,zugang,licht:licht?'1':'0',beleuchtet:beleuchtet?'1':'0',klingel:klingel?'1':'0'});navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}?${p}`);setCopied(true);setTimeout(()=>setCopied(false),2000);}} style={{display:"flex",alignItems:"center",justifyContent:"center",gap:5,background:"none",border:copied?`1.5px solid #16a34a`:`1.5px solid #6b7280`,borderRadius:6,padding:"5px 0",width:90,fontSize:12,color:copied?"#16a34a":TX,cursor:"pointer",fontWeight:600,transition:"color 0.2s,border-color 0.2s"}}>
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M10 2H14V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M14 2L7 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M7 3H3C2.45 3 2 3.45 2 4V13C2 13.55 2.45 14 3 14H12C12.55 14 13 13.55 13 13V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            {copied?"Kopiert!":"Teilen"}
          </button>
          <button onClick={handlePdfExport} style={{display:"flex",alignItems:"center",justifyContent:"center",background:"none",border:`1.5px solid #6b7280`,borderRadius:6,padding:"5px 0",width:100,fontSize:12,color:TX,cursor:"pointer",fontWeight:600}}>PDF Export</button>
        </div>
      </div>
      {showComp&&<CompareModal onClose={()=>setShowComp(false)}/>}
      <div style={{flex:1,display:"flex",overflow:"hidden",minHeight:0}}>
        <div style={{flex:1,background:"#ebebeb",display:"flex",alignItems:"center",justifyContent:"center",padding:24,overflow:"hidden",minHeight:0,position:"relative"}}>
          <div style={{position:"absolute",bottom:"50%",transform:"translateY(50%)",right:16,display:"flex",flexDirection:"column",gap:12,zIndex:2}}>
            {[
              {key:"measure",label:"Maße anzeigen",icon:<><line x1="2" y1="12" x2="22" y2="12"/><polyline points="5 9 2 12 5 15"/><polyline points="19 9 22 12 19 15"/><line x1="12" y1="2" x2="12" y2="22"/><polyline points="9 5 12 2 15 5"/><polyline points="9 19 12 22 15 19"/></>,active:showMeasure,onClick:()=>setShowMeasure(v=>!v)},
              {key:"camera",label:"Vorderansicht",icon:<><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></>},
              {key:"fullscreen",label:"Vollbild",icon:<><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></>}
            ].map(({key,label,icon,active:activeOverride,onClick:onClickOverride})=>{
              const active=activeOverride!==undefined?activeOverride:panelBtn[key];
              const handleClick=onClickOverride||(()=>setPanelBtn(s=>({...s,[key]:!s[key]})));
              return(
                <button key={key} aria-label={label} aria-pressed={active} onClick={handleClick}
                  style={{width:44,height:44,borderRadius:10,border:`1.5px solid ${active?P:BD}`,background:active?P:WH,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 1px 4px rgba(0,0,0,0.1)",transition:"background 0.2s,border-color 0.2s"}}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active?WH:"#374151"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{transition:"stroke 0.2s"}}>
                    {icon}
                  </svg>
                </button>
              );
            })}
          </div>
{step===3&&mod!=="none"?(
            <svg viewBox="0 0 310 270" preserveAspectRatio="xMidYMid meet" style={{display:"block",height:"60%",width:"auto"}}>
              {drawModule(0,0,310,270,mod,fp,licht,beleuchtet,klingelActive)}
            </svg>
          ):(
            <Preview count={count} rows={effectiveRows} modType={mod} modPos={modPos}
              fp={fp} licht={licht} beleuchtet={beleuchtet} showKlingel={klingelActive}
              selectedEl={step===4?selectedEl:null} placement={placement}
              onCellClick={step===4?handleCellClick:null} showMeasure={showMeasure}/>
          )}
        </div>
        <div style={{width:494,background:WH,borderLeft:`1px solid ${BD}`,display:"flex",flexDirection:"column",overflow:"hidden",flexShrink:0}}>
          <div style={{padding:"14px 16px 0",flexShrink:0}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <span style={{fontSize:13,fontWeight:500,color:TX}}>Konfiguration</span>
              <span style={{fontSize:12,background:"#f3f4f6",border:`1px solid ${BD}`,color:TX,padding:"2px 8px",borderRadius:6,fontWeight:500}}>{Math.max(1,step)}/4</span>
            </div>
            <div style={{display:"flex",gap:4,marginBottom:14}}>
              {[1,2,3,4].map(s=><div key={s} style={{flex:1,height:5,borderRadius:3,background:s<=Math.max(1,step)?P:"#e5e7eb",transition:"background 0.2s"}}/>)}
            </div>
          </div>
          <div style={{flex:1,overflowY:"auto",padding:"0 16px"}}>
            <Accordion step={1} title="Postboxen" badge={`${count} Postboxen · Stahlblau · ${effectiveRows} Reihe${effectiveRows>1?"n":""}`} active={step===1} done={step>1} locked={false} onToggle={()=>toggle(1)}>
              <div style={{marginBottom:14}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                  <span style={{fontSize:14,color:MU}}>Anzahl Postboxen</span>
                  <span style={{fontWeight:700,fontSize:16}}>{count}</span>
                </div>
                <input type="range" min={1} max={maxCount} step={1} value={count} onChange={e=>setCount(+e.target.value)} style={{width:"100%",accentColor:P}}/>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:MU,marginTop:2}}><span>1</span><span>{maxCount}</span></div>
                {hasMod&&<div style={{fontSize:12,color:"#92400e",marginTop:6,padding:"6px 10px",background:"#fffbeb",borderRadius:6}}>Maximal 14 Briefkästen, wenn Sie das Gegensprechmodul gewählt haben</div>}
              </div>
              {rowOptions.length>1&&(<>
                <div style={{fontSize:11,fontWeight:600,color:MU,marginBottom:8,textTransform:"uppercase",letterSpacing:0.5}}>Mailbox Reihen</div>
                <div style={{display:"flex",gap:10,marginBottom:14}}>
                  {rowOptions.map(r=>(
                    <button key={r} onClick={()=>setRows(r)} style={{flex:1,padding:"10px 0",borderRadius:10,border:`2px solid ${effectiveRows===r?P:BD}`,background:effectiveRows===r?PL:WH,fontWeight:effectiveRows===r?700:400,cursor:"pointer",color:TX,fontSize:14}}>
                      {r} Reihe{r>1?"n":""}
                    </button>
                  ))}
                </div>
              </>)}
              <div style={{display:"flex",justifyContent:"flex-end"}}>
                <button onClick={()=>goNext(2)} style={{background:P,color:"#fff",border:"none",borderRadius:8,padding:"9px 20px",fontWeight:600,cursor:"pointer",fontSize:14}}>Weiter →</button>
              </div>
            </Accordion>
            <Accordion step={2} title="Montagetyp" badge={mountBadge} active={step===2} done={step>2} locked={maxStep<2} onToggle={()=>toggle(2)}>
              <div style={{fontSize:11,fontWeight:600,color:MU,marginBottom:8,textTransform:"uppercase",letterSpacing:0.5}}>Montagetyp</div>
              {[{k:"none",l:"Kein Standfuß",s:"Wandmontage oder freistehend in eine Nische",p:0},{k:"stand",l:"Standfuß",s:"Eigenständige Montage auf festem Untergrund",p:110},{k:"standb",l:"Standfuß + Bodenblenden",s:"Standfuß mit seitlichen Bodenblenden",p:190}].map(({k,l,s,p})=>(
                <label key={k} onClick={()=>setMount(k)} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"10px 14px",border:`1.5px solid ${mount===k?P:BD}`,borderRadius:10,cursor:"pointer",background:mount===k?PL:WH,marginBottom:8}}>
                  <Dot on={mount===k}/>
                  <span style={{flex:1,fontSize:14,color:TX}}>{l}<br/><span style={{color:MU,fontWeight:400,fontSize:12}}>{s}</span></span>
                  {p>0&&<span style={{fontSize:13,color:P,fontWeight:600,flexShrink:0}}>+{p} €</span>}
                </label>
              ))}
              <div style={{display:"flex",justifyContent:"flex-end"}}>
                <button onClick={()=>goNext(3)} style={{background:P,color:"#fff",border:"none",borderRadius:8,padding:"9px 20px",fontWeight:600,cursor:"pointer",fontSize:14,marginTop:8}}>Weiter →</button>
              </div>
            </Accordion>
            <Accordion step={3} title="Türstation Modul" badge={modBadge} active={step===3} done={step>3} locked={maxStep<3} onToggle={()=>toggle(3)}>
              {countAdjusted&&<div style={{display:"flex",alignItems:"flex-start",gap:10,padding:"10px 14px",background:"#fffbeb",border:"1px solid #f59e0b",borderRadius:10,marginBottom:12,fontSize:13,color:"#92400e"}}>
                <span style={{fontSize:16,flexShrink:0}}>⚠️</span>
                <span>Die Anzahl der Postboxen wurde automatisch auf <strong>14</strong> reduziert.</span>
              </div>}
              {MODULES.map(({key,label,sub,price,conn,features})=>{
                const checked=mod===key,mc=MODULE_META[key]?.color||MU;
                return(<label key={key} onClick={()=>{setMod(key);if(key==="none"||key==="SDM10"){setZugang("none");setLicht(false);setKlingel(false);setBeleuchtet(false);}if(key!=="VDM10"&&key!=="VDM10S")setZugang(v=>v==="touchDisplay"?"none":v);}}
                  style={{display:"block",padding:"12px 14px",border:`1.5px solid ${checked?mc:BD}`,borderRadius:10,cursor:"pointer",background:checked?"#fafafa":WH,marginBottom:8}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <Dot on={checked}/>
                    <span style={{flex:1,fontWeight:500,fontSize:14,color:TX}}>{label}</span>
                    {price>0&&<span style={{fontSize:13,color:P,fontWeight:600}}>+{price} €</span>}
                  </div>
                  <div style={{marginLeft:28,marginTop:2,fontSize:12,color:MU}}>{sub}</div>
                  {checked&&features.length>0&&<div style={{marginLeft:28,marginTop:10}}>
                    {conn&&<div style={{display:"inline-flex",alignItems:"center",gap:5,padding:"5px 12px",background:conn.color,color:conn.tc,borderRadius:20,fontSize:13,fontWeight:600,marginBottom:8}}>
                      <span>{conn.type}</span><span style={{fontWeight:400,opacity:0.8}}>— {conn.desc}</span>
                    </div>}
                    <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                      {features.map((f,i)=><div key={i} style={{padding:"4px 10px",background:"#f3f4f6",borderRadius:20,fontSize:12,color:TX}}>{f.t}</div>)}
                    </div>
                  </div>}
                </label>);
              })}
              <button onClick={()=>setShowComp(true)} style={{display:"flex",alignItems:"center",gap:7,fontSize:13,padding:"9px 16px",border:`1.5px solid ${P}`,borderRadius:8,background:PL,color:P,cursor:"pointer",marginBottom:10,fontWeight:600}}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={P} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="8" height="18" rx="1.5"/>
                  <rect x="14" y="3" width="8" height="18" rx="1.5"/>
                  <line x1="5" y1="8" x2="7" y2="8"/>
                  <line x1="5" y1="11" x2="7" y2="11"/>
                  <line x1="17" y1="8" x2="19" y2="8"/>
                  <line x1="17" y1="11" x2="19" y2="11"/>
                </svg>
                Türstationsmodule vergleichen
              </button>
              {canExtras&&<div style={{paddingTop:12,borderTop:`1px solid ${BD}`}}>
                <div style={{fontSize:11,fontWeight:600,color:MU,marginBottom:8,textTransform:"uppercase",letterSpacing:0.5}}>Zugang</div>
                <div style={{border:`1.5px solid ${zugang==="none"?P:BD}`,borderRadius:10,marginBottom:8,overflow:"hidden",background:zugang==="none"?PL:WH}}>
                  <label onClick={()=>setZugang("none")} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",cursor:"pointer"}}>
                    <Dot on={zugang==="none"}/><span style={{fontSize:14,color:TX}}>Ohne Zugangsmodul</span>
                  </label>
                  {zugang==="none"&&<div style={{padding:"0 14px 12px",borderTop:`1px solid ${BD}`}}><KlingelBlock required={true}/></div>}
                </div>
                <div style={{border:`1.5px solid ${zugang==="fingerprint"?P:BD}`,borderRadius:10,marginBottom:8,overflow:"hidden",background:zugang==="fingerprint"?PL:WH}}>
                  <label onClick={()=>setZugang("fingerprint")} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",cursor:"pointer"}}>
                    <Dot on={zugang==="fingerprint"}/><span style={{flex:1,fontSize:14,color:TX}}>Fingerprint + RFID</span>
                    <span style={{fontSize:13,color:P,fontWeight:600}}>+195 €</span>
                  </label>
                  {zugang==="fingerprint"&&<div style={{padding:"0 14px 12px",borderTop:`1px solid ${BD}`}}><KlingelBlock required={true} mandatory={true}/></div>}
                </div>
                {(mod==="VDM10"||mod==="VDM10S")&&(
                  <div style={{border:`1.5px solid ${zugang==="touchDisplay"?P:BD}`,borderRadius:10,marginBottom:8,overflow:"hidden",background:zugang==="touchDisplay"?PL:WH}}>
                    <label onClick={()=>{setZugang("touchDisplay");setKlingel(false);setBeleuchtet(false);}} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",cursor:"pointer"}}>
                      <Dot on={zugang==="touchDisplay"}/><span style={{flex:1,fontSize:14,color:TX}}>Touch-Display + RFID + PIN</span>
                      <span style={{fontSize:13,color:P,fontWeight:600}}>+285 €</span>
                    </label>
                    {zugang==="touchDisplay"&&<div style={{padding:"0 14px 12px",borderTop:`1px solid ${BD}`}}><KlingelBlock required={false}/></div>}
                  </div>
                )}
                <div style={{fontSize:11,fontWeight:600,color:MU,margin:"12px 0 8px",textTransform:"uppercase",letterSpacing:0.5}}>Optionen</div>
                <Check checked={licht} onChange={()=>setLicht(v=>!v)} price={45}>Lichttaster</Check>
              </div>}
              <div style={{display:"flex",justifyContent:"flex-end"}}>
                <button onClick={()=>goNext(4)} style={{background:P,color:"#fff",border:"none",borderRadius:8,padding:"9px 20px",fontWeight:600,cursor:"pointer",fontSize:14,marginTop:14}}>Weiter →</button>
              </div>
            </Accordion>
            <Accordion step={4} title="Elemente positionieren" badge={hasMod?`Modul: ${modPos==="left"?"Links":"Rechts"}`:emptyCount>0?`${emptyCount} Leerfeld${emptyCount>1?"er":""}`:"-"} active={step===4} done={false} locked={maxStep<4} onToggle={()=>toggle(4)}>
              {!hasMod&&emptyCount===0&&<div style={{color:MU,fontSize:13}}>Keine Elemente zum Positionieren.</div>}
              {(hasMod||emptyCount>0)&&<div>
                <div style={{fontSize:13,color:"#0369a1",background:"#e0f2fe",border:"1px solid #bae6fd",borderRadius:8,padding:"10px 14px",marginBottom:16,display:"flex",gap:8,alignItems:"flex-start"}}>
                  <span>ℹ</span><span>Wähle ein Element aus und klicke dann auf eine freie Zelle im Vorschaubild links, um es zu verschieben.</span>
                </div>
                {hasMod&&<div style={{marginBottom:16}}>
                  <div style={{fontSize:11,fontWeight:600,color:MU,marginBottom:8,textTransform:"uppercase",letterSpacing:0.5}}>Modul Position</div>
                  {hasStand?(
                    <div style={{display:"flex",gap:10}}>
                      {["left","right"].map(pos=>(
                        <label key={pos} onClick={()=>{setModPos(pos);const newP={...placement};Object.keys(newP).forEach(k=>{if(newP[k]==="module")delete newP[k];});newP[pos==="left"?0:cols4-1]="module";setPlacement(newP);}}
                          style={{flex:1,display:"flex",alignItems:"center",gap:10,padding:"10px 14px",border:`1.5px solid ${modPos===pos?P:BD}`,borderRadius:10,cursor:"pointer",background:modPos===pos?PL:WH}}>
                          <Dot on={modPos===pos}/><span style={{fontSize:14,fontWeight:modPos===pos?600:400,color:TX}}>{pos==="left"?"Links":"Rechts"}</span>
                        </label>
                      ))}
                    </div>
                  ):(
                    <button onClick={()=>setSelectedEl(selectedEl==="module"?null:"module")} style={{padding:"10px 20px",borderRadius:10,fontSize:14,cursor:"pointer",fontWeight:500,border:`2px solid ${selectedEl==="module"?P:BD}`,background:selectedEl==="module"?PL:WH,color:TX}}>
                      Türstation-Modul
                    </button>
                  )}
                </div>}
                {emptyCount>0&&<div>
                  <div style={{fontSize:11,fontWeight:600,color:MU,marginBottom:8,textTransform:"uppercase",letterSpacing:0.5}}>Leerfelder Position</div>
                  <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                    {Array.from({length:emptyCount},(_,i)=>{
                      const id=`empty-${i}`;
                      return(<button key={id} onClick={()=>setSelectedEl(selectedEl===id?null:id)} style={{padding:"10px 20px",borderRadius:10,fontSize:14,cursor:"pointer",fontWeight:500,border:`2px solid ${selectedEl===id?P:BD}`,background:selectedEl===id?PL:WH,color:TX}}>
                        Leerfeld {String.fromCharCode(65+i)}
                      </button>);
                    })}
                  </div>
                </div>}
              </div>}
            </Accordion>
            <div style={{height:16}}/>
          </div>
          <div style={{borderTop:`1px solid ${BD}`,padding:"14px 16px",background:WH,flexShrink:0}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{fontSize:11,fontWeight:600,color:MU,textTransform:"uppercase",letterSpacing:0.5}}>Gesamtsumme</div>
                <div style={{fontSize:24,fontWeight:700,color:TX,lineHeight:1.1}}>{fmt(total)} €</div>
                <div style={{fontSize:11,color:MU}}>Inkl. 19% MwSt.</div>
              </div>
              <button style={{background:P,color:"#fff",border:"none",borderRadius:10,padding:"13px 22px",fontWeight:700,cursor:"pointer",fontSize:15}}>In den Warenkorb</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
