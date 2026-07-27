import React from 'react';
import {
  AbsoluteFill,
  Html5Audio,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {CTA_FRAMES, CTA_FROM, DEAL_FRAMES, DEAL_FROM, HOOK_FRAMES, HOOK_FROM} from './timings';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'};
const clean = (value) => String(value || '').replace(/\s+/g, ' ').trim();
const imageSrc = (value) => staticFile(clean(value) || 'product-image.svg');

const Background = () => {
  const frame = useCurrentFrame();
  const drift = interpolate(frame, [0, 285], [0, 120], clamp);
  return (
    <AbsoluteFill style={{background: 'linear-gradient(160deg,#08111f 0%,#111a2d 55%,#06101b 100%)'}}>
      <div style={{position:'absolute',width:900,height:900,borderRadius:'50%',top:-300,left:-250,background:'radial-gradient(circle,rgba(255,153,0,.28),transparent 68%)',transform:`translate(${drift}px,${drift/2}px)`}}/>
      <div style={{position:'absolute',width:1050,height:1050,borderRadius:'50%',right:-520,bottom:-450,background:'radial-gradient(circle,rgba(35,124,255,.25),transparent 70%)'}}/>
      <div style={{position:'absolute',inset:0,opacity:.12,backgroundImage:'linear-gradient(rgba(255,255,255,.08) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.08) 1px,transparent 1px)',backgroundSize:'70px 70px'}}/>
    </AbsoluteFill>
  );
};

const Brand = () => (
  <div style={{position:'absolute',top:74,left:72,zIndex:20,display:'flex',alignItems:'center',gap:14,fontFamily:'Arial',fontWeight:900,color:'#fff',fontSize:30,letterSpacing:1.5}}>
    <div style={{width:18,height:18,borderRadius:'50%',background:'#ff9900',boxShadow:'0 0 28px rgba(255,153,0,.8)'}}/>
    ALERTEBONPLAN
  </div>
);

const Hook = ({format,currentPrice,discount}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame,fps,config:{damping:12,stiffness:170,mass:.7}});
  const verified = format === 'verified_drop';
  const line1 = verified ? 'LE PRIX VIENT' : 'PRIX REPÉRÉ';
  const line2 = verified ? 'DE CHUTER' : 'À L’INSTANT';
  return (
    <AbsoluteFill style={{fontFamily:'Arial',justifyContent:'center',padding:'0 78px'}}>
      <Brand/>
      <div style={{transform:`translateY(${interpolate(enter,[0,1],[140,0])}px) scale(${interpolate(enter,[0,1],[.82,1])})`,opacity:enter}}>
        <div style={{color:'#fff',fontWeight:1000,fontSize:116,lineHeight:.95,letterSpacing:-5}}>{line1}<br/><span style={{color:'#ff9900'}}>{line2}</span></div>
        <div style={{marginTop:46,display:'inline-flex',padding:'18px 34px',borderRadius:999,background:'rgba(255,255,255,.09)',border:'2px solid rgba(255,255,255,.18)',color:'#fff',fontWeight:900,fontSize:42}}>{verified && discount ? `${discount} • ` : ''}{currentPrice}</div>
      </div>
    </AbsoluteFill>
  );
};

const Deal = ({title,shortTitle,currentPrice,originalPrice,discount,imageUrl,format}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const card = spring({frame,fps,config:{damping:14,stiffness:130,mass:.75}});
  const zoom = interpolate(frame,[0,DEAL_FRAMES],[1.02,1.16],clamp);
  const pricePop = spring({frame:frame-35,fps,config:{damping:9,stiffness:190,mass:.6}});
  const verified = format === 'verified_drop';
  return (
    <AbsoluteFill style={{fontFamily:'Arial'}}>
      <Brand/>
      <div style={{position:'absolute',top:190,left:62,right:62,height:1040,borderRadius:58,overflow:'hidden',background:'#fff',boxShadow:'0 42px 120px rgba(0,0,0,.52)',opacity:card,transform:`translateY(${interpolate(card,[0,1],[180,0])}px)`}}>
        <Img src={imageSrc(imageUrl)} style={{width:'100%',height:'100%',objectFit:'contain',padding:72,transform:`scale(${zoom})`,filter:'drop-shadow(0 28px 28px rgba(0,0,0,.24))'}}/>
        {verified && discount ? <div style={{position:'absolute',top:30,right:30,padding:'17px 27px',borderRadius:999,background:'#ff3b30',color:'#fff',fontWeight:1000,fontSize:43}}>{discount}</div> : null}
      </div>
      <div style={{position:'absolute',left:72,right:72,top:1285,color:'#fff',textAlign:'center'}}>
        <div style={{fontSize:54,lineHeight:1.08,fontWeight:1000}}>{shortTitle || title}</div>
        <div style={{marginTop:34,fontSize:132,lineHeight:1,fontWeight:1000,color:'#ffb11b',letterSpacing:-6,transform:`scale(${pricePop})`,opacity:pricePop}}>{currentPrice}</div>
        {verified && originalPrice ? <div style={{marginTop:23,fontSize:39,color:'#b9c3d5',fontWeight:800}}>au lieu de <span style={{textDecoration:'line-through'}}>{originalPrice}</span></div> : <div style={{marginTop:23,fontSize:34,color:'#b9c3d5',fontWeight:800}}>prix constaté au moment de la publication</div>}
      </div>
    </AbsoluteFill>
  );
};

const CTA = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame,fps,config:{damping:11,stiffness:150}});
  return (
    <AbsoluteFill style={{fontFamily:'Arial',alignItems:'center',justifyContent:'center',textAlign:'center',padding:80}}>
      <Brand/>
      <div style={{opacity:enter,transform:`scale(${interpolate(enter,[0,1],[.82,1])})`}}>
        <div style={{fontSize:86,lineHeight:1.02,fontWeight:1000,color:'#fff'}}>D’AUTRES BONS PLANS<br/><span style={{color:'#ff9900'}}>ARRIVENT CHAQUE JOUR</span></div>
        <div style={{marginTop:55,padding:'22px 42px',borderRadius:999,background:'rgba(255,255,255,.1)',border:'2px solid rgba(255,255,255,.18)',color:'#fff',fontSize:39,fontWeight:900}}>AlerteBonPlan • lien dans la bio</div>
      </div>
    </AbsoluteFill>
  );
};

export const DealVideo = (props) => (
  <AbsoluteFill>
    <Background/>
    <Sequence from={HOOK_FROM} durationInFrames={HOOK_FRAMES}>
      <Html5Audio src={staticFile('voice_hook.mp3')} volume={1}/>
      <Hook {...props}/>
    </Sequence>
    <Sequence from={DEAL_FROM} durationInFrames={DEAL_FRAMES}>
      <Html5Audio src={staticFile('voice_detail.mp3')} volume={1}/>
      <Deal {...props}/>
    </Sequence>
    <Sequence from={CTA_FROM} durationInFrames={CTA_FRAMES}>
      <Html5Audio src={staticFile('voice_cta.mp3')} volume={1}/>
      <CTA/>
    </Sequence>
  </AbsoluteFill>
);
