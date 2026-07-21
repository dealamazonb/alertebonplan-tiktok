import React from 'react';
import {
  AbsoluteFill, Html5Audio, Img, Sequence, interpolate, spring,
  staticFile, useCurrentFrame, useVideoConfig
} from 'remotion';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'};

const themes = {
  FLASH: {bg:'#090A12', bg2:'#300713', a:'#FF3045', b:'#FF8A00', price:'#FFD43B', label:'VENTE FLASH'},
  PREMIUM: {bg:'#090B12', bg2:'#1B1E28', a:'#E8C878', b:'#9D7A32', price:'#F7E6AA', label:'OFFRE PREMIUM'},
  TECH: {bg:'#050B17', bg2:'#07263A', a:'#00D4FF', b:'#7C4DFF', price:'#65F3C2', label:'BON PLAN TECH'}
};

const clean = (v='') => String(v).replace(/\s+/g,' ').trim();

const pct = (v='') => {
  const m = String(v).match(/(\d{1,3})/);
  return m ? Number(m[1]) : 0;
};

const selectTheme = (title, discount) => {
  const t = clean(title).toLowerCase();
  if (pct(discount) >= 35) return 'FLASH';
  if (/(ssd|gpu|ryzen|intel|gaming|pc|écran|smartphone|iphone|samsung|casque|tv|oled|console)/.test(t)) return 'TECH';
  if (/(parfum|montre|bijou|luxe|cuir|premium|cafetière|robot|aspirateur)/.test(t)) return 'PREMIUM';
  return 'FLASH';
};

const hookFor = ({title, discount, currentPrice, originalPrice}) => {
  if (pct(discount) >= 50) return 'LE PRIX VIENT DE S’EFFONDRER';
  if (pct(discount) >= 30) return 'GROSSE BAISSE DE PRIX';
  if (currentPrice && originalPrice) return 'AMAZON BAISSE ENFIN LE PRIX';
  if (/(ssd|gpu|ryzen|gaming|écran|smartphone)/i.test(title || '')) return 'LE BON PLAN TECH DU MOMENT';
  return 'CETTE PROMO RISQUE DE PARTIR VITE';
};

const shortTitle = (v) => {
  const t = clean(v || 'Bon plan Amazon');
  return t.length > 88 ? t.slice(0,85).trim() + '…' : t;
};

const Background = ({theme}) => {
  const f = useCurrentFrame();
  const c = themes[theme];
  const x = interpolate(Math.sin(f/35),[-1,1],[-120,140]);
  const y = interpolate(Math.cos(f/48),[-1,1],[-90,120]);
  return <AbsoluteFill style={{overflow:'hidden',background:`linear-gradient(150deg,${c.bg},${c.bg2})`}}>
    <div style={{position:'absolute',width:900,height:900,left:-380+x,top:-330+y,borderRadius:'50%',background:`radial-gradient(circle,${c.a}66,transparent 68%)`,filter:'blur(22px)'}}/>
    <div style={{position:'absolute',width:850,height:850,right:-370-x,bottom:-320-y,borderRadius:'50%',background:`radial-gradient(circle,${c.b}55,transparent 70%)`,filter:'blur(28px)'}}/>
    <div style={{position:'absolute',inset:0,opacity:theme==='TECH'?0.14:0.06,backgroundImage:'linear-gradient(rgba(255,255,255,.12) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.12) 1px,transparent 1px)',backgroundSize:'64px 64px',transform:`translateY(${f*.18}px)`}}/>
  </AbsoluteFill>;
};

const Brand = ({theme}) => {
  const c = themes[theme];
  return <div style={{position:'absolute',top:55,left:68,right:68,display:'flex',justifyContent:'space-between',alignItems:'center',fontFamily:'Arial'}}>
    <div style={{display:'flex',gap:16,alignItems:'center'}}>
      <div style={{width:62,height:62,borderRadius:20,display:'flex',alignItems:'center',justifyContent:'center',fontSize:31,background:`linear-gradient(135deg,${c.a},${c.b})`}}>🔥</div>
      <div><div style={{fontSize:35,fontWeight:1000,color:'#fff'}}>AlerteBonPlan</div><div style={{fontSize:19,fontWeight:700,color:'#AAB4C9'}}>Les meilleures promos Amazon</div></div>
    </div>
    <div style={{padding:'13px 22px',borderRadius:999,color:c.price,border:`2px solid ${c.a}66`,background:`${c.a}15`,fontWeight:1000,fontSize:21}}>{c.label}</div>
  </div>;
};

const Intro = ({theme, hook, discount}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig(); const c = themes[theme];
  const e = spring({frame:f,fps,config:{damping:11,stiffness:175,mass:.7}});
  const flash = interpolate(f,[0,3,12],[.85,.35,0],clamp);
  return <AbsoluteFill style={{alignItems:'center',justifyContent:'center',textAlign:'center',fontFamily:'Arial'}}>
    <div style={{position:'absolute',inset:0,background:'#fff',opacity:flash}}/>
    <div style={{width:950,opacity:e,transform:`scale(${e}) rotate(${interpolate(e,[0,1],[-6,0])}deg)`}}>
      <div style={{color:c.price,fontSize:47,fontWeight:1000,letterSpacing:3,marginBottom:25}}>{hook}</div>
      <div style={{color:'#fff',fontWeight:1000,fontSize:116,lineHeight:.96,textShadow:`0 18px 55px ${c.a}77`}}>ALERTE<br/>BON PLAN</div>
      {discount && <div style={{display:'inline-flex',marginTop:50,padding:'20px 50px',borderRadius:999,color:'#fff',fontSize:72,fontWeight:1000,background:`linear-gradient(135deg,${c.a},${c.b})`}}>{discount}</div>}
    </div>
  </AbsoluteFill>;
};

const Product = ({theme,title,imageUrl,discount}) => {
  const f=useCurrentFrame(); const {fps}=useVideoConfig(); const c=themes[theme];
  const e=spring({frame:f,fps,config:{damping:13,stiffness:115,mass:.75}});
  const te=spring({frame:f-18,fps,config:{damping:14,stiffness:130}});
  const zoom=interpolate(f,[0,120],[.95,1.07],clamp);
  return <AbsoluteFill style={{fontFamily:'Arial'}}>
    <Brand theme={theme}/>
    <div style={{position:'absolute',top:200,left:72,right:72,height:1050,borderRadius:66,overflow:'hidden',background:'linear-gradient(145deg,#fff,#EAF0FA)',boxShadow:'0 40px 120px rgba(0,0,0,.52)',opacity:e,transform:`translateY(${interpolate(e,[0,1],[220,0])}px) scale(${e})`}}>
      <div style={{position:'absolute',inset:0,background:`radial-gradient(circle at 50% 45%,#fff,${c.a}12)`}}/>
      <Img src={imageUrl} style={{position:'absolute',width:'84%',height:'78%',left:'8%',top:'10%',objectFit:'contain',transform:`scale(${zoom})`,filter:'drop-shadow(0 35px 38px rgba(8,15,35,.28))'}}/>
      {discount && <div style={{position:'absolute',right:30,top:28,padding:'18px 30px',borderRadius:999,color:'#fff',fontWeight:1000,fontSize:46,background:`linear-gradient(135deg,${c.a},${c.b})`}}>{discount}</div>}
    </div>
    <div style={{position:'absolute',left:76,right:76,top:1320,color:'#fff',fontWeight:1000,fontSize:55,lineHeight:1.12,textAlign:'center',opacity:te,transform:`translateY(${interpolate(te,[0,1],[75,0])}px)`}}>{shortTitle(title)}</div>
  </AbsoluteFill>;
};

const Price = ({theme,currentPrice,originalPrice,discount}) => {
  const f=useCurrentFrame(); const {fps}=useVideoConfig(); const c=themes[theme];
  const pe=spring({frame:f,fps,config:{damping:10,stiffness:180,mass:.65}});
  const oe=spring({frame:f-18,fps,config:{damping:14,stiffness:125}});
  const be=spring({frame:f-34,fps,config:{damping:8,stiffness:190,mass:.6}});
  return <AbsoluteFill style={{alignItems:'center',justifyContent:'center',fontFamily:'Arial'}}>
    <Brand theme={theme}/>
    <div style={{width:930,padding:'100px 54px',borderRadius:72,textAlign:'center',background:'linear-gradient(150deg,rgba(20,31,60,.98),rgba(5,9,22,.99))',border:`2px solid ${c.a}35`,boxShadow:'0 45px 130px rgba(0,0,0,.6)'}}>
      <div style={{color:'#AAB4C9',fontSize:34,fontWeight:900,letterSpacing:4,marginBottom:36}}>PRIX ACTUEL</div>
      <div style={{color:c.price,fontSize:String(currentPrice||'').length>10?115:156,lineHeight:1,fontWeight:1000,letterSpacing:-7,opacity:pe,transform:`scale(${pe})`}}>{currentPrice||'PROMO'}</div>
      {originalPrice && <div style={{display:'inline-block',position:'relative',marginTop:48,color:'#AAB4C9',fontSize:52,fontWeight:800,opacity:oe}}>Au lieu de {originalPrice}<div style={{position:'absolute',left:-12,right:-12,top:'52%',height:8,borderRadius:999,background:c.a,transformOrigin:'left',transform:`scaleX(${oe}) rotate(-3deg)`}}/></div>}
      {discount && <div style={{width:520,margin:'65px auto 0',padding:'25px 20px',borderRadius:999,color:'#fff',fontSize:82,fontWeight:1000,background:`linear-gradient(135deg,${c.a},${c.b})`,opacity:be,transform:`scale(${be})`}}>🔥 {discount}</div>}
    </div>
  </AbsoluteFill>;
};

const Final = ({theme}) => {
  const f=useCurrentFrame(); const {fps}=useVideoConfig(); const c=themes[theme];
  const e=spring({frame:f,fps,config:{damping:12,stiffness:140}});
  const y=interpolate(Math.sin(f/6),[-1,1],[-14,14]);
  return <AbsoluteFill style={{alignItems:'center',justifyContent:'center',textAlign:'center',padding:70,fontFamily:'Arial'}}>
    <div style={{opacity:e,transform:`scale(${e})`}}>
      <div style={{color:c.price,fontSize:44,fontWeight:1000,letterSpacing:4}}>PROFITE-EN AVANT RUPTURE</div>
      <div style={{marginTop:38,color:'#fff',fontSize:89,lineHeight:1.04,fontWeight:1000}}>LIEN DU PRODUIT<br/>DANS LA DESCRIPTION</div>
      <div style={{fontSize:118,marginTop:55,transform:`translateY(${y}px)`}}>👇</div>
      <div style={{display:'inline-flex',marginTop:42,padding:'24px 44px',borderRadius:999,color:'#fff',fontWeight:1000,fontSize:47,background:`linear-gradient(135deg,${c.a},${c.b})`}}>🔥 @AlerteBonPlan</div>
      <div style={{color:'#AAB4C9',fontSize:27,fontWeight:700,marginTop:38}}>Prix susceptible d’évoluer rapidement</div>
    </div>
  </AbsoluteFill>;
};

export const DealVideo = ({title,currentPrice,originalPrice,discount,imageUrl}) => {
  const theme=selectTheme(title,discount);
  const hook=hookFor({title,discount,currentPrice,originalPrice});
  return <AbsoluteFill>
    <Sequence from={8}>
      <Html5Audio src={staticFile('voice.mp3')} volume={0.96} />
    </Sequence>
    <Background theme={theme}/>
    <Sequence from={0} durationInFrames={64}>
      <Intro theme={theme} hook={hook} discount={discount}/>
    </Sequence>

    <Sequence from={54} durationInFrames={150}>
      <Product
        theme={theme}
        title={title}
        imageUrl={imageUrl}
        discount={discount}
      />
    </Sequence>

    <Sequence from={194} durationInFrames={106}>
      <Price
        theme={theme}
        currentPrice={currentPrice}
        originalPrice={originalPrice}
        discount={discount}
      />
    </Sequence>

    <Sequence from={292} durationInFrames={108}>
      <Final theme={theme}/>
    </Sequence>
  </AbsoluteFill>;
};
