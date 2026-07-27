import React from 'react';
import {
  AbsoluteFill,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

import {
  HOOK_FROM,
  HOOK_FRAMES,
  DEAL_FROM,
  DEAL_FRAMES,
  CTA_FROM,
  CTA_FRAMES,
} from './timings';

const clean = (value) => String(value || '').trim();

const Background = () => {
  const frame = useCurrentFrame();

  const shift = interpolate(frame, [0, 270], [0, 80], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        background:
          'linear-gradient(160deg, #08111f 0%, #10243c 45%, #142f4c 100%)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          width: 850,
          height: 850,
          borderRadius: '50%',
          background: 'rgba(46, 194, 255, 0.12)',
          top: -280 + shift,
          right: -260,
          filter: 'blur(20px)',
        }}
      />

      <div
        style={{
          position: 'absolute',
          width: 700,
          height: 700,
          borderRadius: '50%',
          background: 'rgba(255, 196, 61, 0.10)',
          bottom: -260,
          left: -280 + shift * 0.4,
          filter: 'blur(30px)',
        }}
      />
    </AbsoluteFill>
  );
};

const Hook = ({title, currentPrice}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const scale = spring({
    frame,
    fps,
    config: {
      damping: 12,
      stiffness: 140,
    },
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        padding: 90,
        textAlign: 'center',
      }}
    >
      <div
        style={{
          fontSize: 56,
          fontWeight: 800,
          color: '#ffffff',
          lineHeight: 1.08,
          transform: `scale(${0.75 + scale * 0.25})`,
        }}
      >
        Ce produit vient de passer à
      </div>

      <div
        style={{
          marginTop: 34,
          fontSize: 108,
          fontWeight: 900,
          color: '#ffd34e',
          transform: `scale(${0.8 + scale * 0.2})`,
        }}
      >
        {clean(currentPrice) || 'un prix très bas'}
      </div>

      <div
        style={{
          marginTop: 34,
          fontSize: 34,
          fontWeight: 600,
          color: 'rgba(255,255,255,0.82)',
          maxWidth: 850,
        }}
      >
        {clean(title)}
      </div>
    </AbsoluteFill>
  );
};

const Deal = ({title, currentPrice, originalPrice, discount}) => {
  const frame = useCurrentFrame();

  const imageScale = interpolate(frame, [0, DEAL_FRAMES], [0.92, 1.08], {
    extrapolateRight: 'clamp',
  });

  const hasVerifiedDiscount =
    Boolean(clean(originalPrice)) && Boolean(clean(discount));

  return (
    <AbsoluteFill
      style={{
        padding: '150px 70px 110px',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          width: 780,
          height: 780,
          borderRadius: 44,
          background: '#ffffff',
          padding: 45,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 30px 80px rgba(0,0,0,0.35)',
          overflow: 'hidden',
        }}
      >
        <Img
          src={staticFile('product-image.jpg')}
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            transform: `scale(${imageScale})`,
          }}
        />
      </div>

      <div
        style={{
          marginTop: 58,
          width: '100%',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontSize: 50,
            lineHeight: 1.08,
            fontWeight: 800,
            color: '#ffffff',
          }}
        >
          {clean(title)}
        </div>

        <div
          style={{
            marginTop: 32,
            fontSize: 92,
            lineHeight: 1,
            fontWeight: 900,
            color: '#ffd34e',
          }}
        >
          {clean(currentPrice)}
        </div>

        {hasVerifiedDiscount ? (
          <div
            style={{
              marginTop: 22,
              fontSize: 38,
              fontWeight: 700,
              color: 'rgba(255,255,255,0.9)',
            }}
          >
            au lieu de {clean(originalPrice)} · {clean(discount)}
          </div>
        ) : (
          <div
            style={{
              marginTop: 22,
              fontSize: 38,
              fontWeight: 700,
              color: 'rgba(255,255,255,0.9)',
            }}
          >
            Baisse considérable du prix
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

const CTA = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const appear = spring({
    frame,
    fps,
    config: {
      damping: 15,
      stiffness: 120,
    },
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: 100,
      }}
    >
      <div
        style={{
          fontSize: 70,
          fontWeight: 900,
          color: '#ffffff',
          transform: `translateY(${40 - appear * 40}px)`,
          opacity: appear,
        }}
      >
        D’autres bons plans
      </div>

      <div
        style={{
          marginTop: 22,
          fontSize: 54,
          fontWeight: 800,
          color: '#ffd34e',
          transform: `translateY(${40 - appear * 40}px)`,
          opacity: appear,
        }}
      >
        sur mon Telegram en bio
      </div>

      <div
        style={{
          marginTop: 44,
          fontSize: 30,
          fontWeight: 600,
          color: 'rgba(255,255,255,0.72)',
        }}
      >
        AlerteBonPlan
      </div>
    </AbsoluteFill>
  );
};

const DealVideo = (props) => {
  return (
    <AbsoluteFill>
      <Background />

      <Sequence from={HOOK_FROM} durationInFrames={HOOK_FRAMES}>
        <Hook {...props} />
      </Sequence>

      <Sequence from={DEAL_FROM} durationInFrames={DEAL_FRAMES}>
        <Deal {...props} />
      </Sequence>

      <Sequence from={CTA_FROM} durationInFrames={CTA_FRAMES}>
        <CTA />
      </Sequence>
    </AbsoluteFill>
  );
};

export default DealVideo;
