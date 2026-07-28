import React from 'react';
import {
  AbsoluteFill,
  Audio,
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

const clamp = {
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
};

const fadeWindow = (frame, duration, fade = 10) =>
  interpolate(
    frame,
    [0, fade, Math.max(fade, duration - fade), duration],
    [0, 1, 1, 0],
    clamp
  );


/*
 * V33 AUDIO
 * Extrait choisi automatiquement pour obtenir un impact musical
 * au passage du hook vers la scène produit.
 */
const MUSIC_START_FRAME = 384; // 12,8 secondes dans le morceau source.

const musicVolume = (frame) => {
  if (frame < 8) {
    return interpolate(frame, [0, 8], [0, 0.34], clamp);
  }

  if (frame < HOOK_FRAMES) {
    return 0.34;
  }

  if (frame < CTA_FROM) {
    return 0.42;
  }

  return interpolate(
    frame,
    [CTA_FROM, CTA_FROM + CTA_FRAMES - 8, CTA_FROM + CTA_FRAMES],
    [0.34, 0.30, 0],
    clamp
  );
};

const BrandBackground = () => {
  const frame = useCurrentFrame();

  const streakA = interpolate(frame, [0, 270], [-320, 280], clamp);
  const streakB = interpolate(frame, [0, 270], [260, -220], clamp);

  return (
    <AbsoluteFill
      style={{
        overflow: 'hidden',
        background:
          'radial-gradient(circle at 50% 10%, #171717 0%, #090909 38%, #020202 72%, #000000 100%)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at 18% 30%, rgba(255,132,0,0.18), transparent 24%), radial-gradient(circle at 84% 74%, rgba(255,111,0,0.14), transparent 23%), radial-gradient(circle at 58% 16%, rgba(255,199,105,0.07), transparent 18%)',
        }}
      />

      <div
        style={{
          position: 'absolute',
          left: -120 + streakA,
          top: 128,
          width: 520,
          height: 7,
          borderRadius: 999,
          background: 'linear-gradient(90deg, transparent, rgba(255,132,0,0.95), transparent)',
          transform: 'rotate(-14deg)',
          boxShadow: '0 0 22px rgba(255,132,0,0.28)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: -30 + streakA * 0.84,
          top: 186,
          width: 360,
          height: 5,
          borderRadius: 999,
          background: 'linear-gradient(90deg, transparent, rgba(255,180,92,0.82), transparent)',
          transform: 'rotate(-14deg)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: -160 + streakB,
          bottom: 148,
          width: 640,
          height: 7,
          borderRadius: 999,
          background: 'linear-gradient(90deg, transparent, rgba(255,132,0,0.92), transparent)',
          transform: 'rotate(-14deg)',
          boxShadow: '0 0 22px rgba(255,132,0,0.28)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: -110 + streakB * 0.8,
          bottom: 112,
          width: 400,
          height: 5,
          borderRadius: 999,
          background: 'linear-gradient(90deg, transparent, rgba(255,180,92,0.80), transparent)',
          transform: 'rotate(-14deg)',
        }}
      />

      <div
        style={{
          position: 'absolute',
          top: 64,
          right: 56,
          width: 190,
          height: 190,
          opacity: 0.16,
          backgroundImage:
            'radial-gradient(circle, rgba(255,132,0,0.95) 1.7px, transparent 1.7px)',
          backgroundSize: '19px 19px',
          maskImage: 'linear-gradient(135deg, rgba(0,0,0,1), transparent 80%)',
        }}
      />

      <div
        style={{
          position: 'absolute',
          left: 50,
          bottom: 64,
          width: 240,
          height: 170,
          opacity: 0.10,
          backgroundImage:
            'radial-gradient(circle, rgba(255,163,64,0.95) 1.8px, transparent 1.8px)',
          backgroundSize: '18px 18px',
          maskImage: 'linear-gradient(135deg, rgba(0,0,0,1), transparent 85%)',
        }}
      />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          boxShadow: 'inset 0 0 220px rgba(0,0,0,0.92)',
        }}
      />
    </AbsoluteFill>
  );
};

const LogoBadge = ({size = 190}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: '50%',
      position: 'relative',
      background:
        'radial-gradient(circle at 50% 35%, #0f0f0f 0%, #080808 45%, #030303 78%, #010101 100%)',
      border: `${Math.max(4, size * 0.036)}px solid #ff8e00`,
      boxShadow:
        '0 18px 40px rgba(0,0,0,0.36), inset 0 0 0 6px rgba(255,255,255,0.04)',
      overflow: 'hidden',
    }}
  >
    <div
      style={{
        position: 'absolute',
        left: size * 0.14,
        top: size * 0.14,
        width: size * 0.23,
        height: size * 0.23,
        borderRadius: '50%',
        background:
          'linear-gradient(145deg, #ffd34f 0%, #ff9a00 58%, #ff6a00 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.12,
        boxShadow: '0 8px 22px rgba(255,120,0,0.24)',
      }}
    >
      🔔
    </div>

    <div
      style={{
        position: 'absolute',
        right: size * 0.20,
        top: size * 0.12,
        width: size * 0.22,
        height: size * 0.26,
        borderRadius: size * 0.04,
        background: '#0d0d0d',
        border: `${Math.max(2, size * 0.015)}px solid #f5f5f5`,
        transform: 'rotate(7deg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ffffff',
        fontWeight: 900,
        fontSize: size * 0.16,
      }}
    >
      a
    </div>

    <div
      style={{
        position: 'absolute',
        left: size * 0.06,
        right: size * 0.06,
        top: size * 0.48,
        transform: 'rotate(-6deg)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          fontSize: size * 0.18,
          lineHeight: 0.9,
          fontWeight: 950,
          color: '#ffffff',
          textTransform: 'uppercase',
          fontStyle: 'italic',
          letterSpacing: -1.2,
        }}
      >
        Alerte
      </div>
      <div
        style={{
          marginTop: size * 0.012,
          fontSize: size * 0.2,
          lineHeight: 0.9,
          fontWeight: 950,
          color: '#ff9b00',
          textTransform: 'uppercase',
          fontStyle: 'italic',
          letterSpacing: -1.4,
        }}
      >
        BonPlan
      </div>
    </div>
  </div>
);

const BrandHeader = ({compact = false}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: compact ? 18 : 24}}>
    <LogoBadge size={compact ? 92 : 122} />
    <div style={{display: 'flex', flexDirection: 'column', lineHeight: 0.9}}>
      <div
        style={{
          fontSize: compact ? 46 : 64,
          fontWeight: 950,
          color: '#ffffff',
          textTransform: 'uppercase',
          fontStyle: 'italic',
          letterSpacing: -2.2,
        }}
      >
        Alerte
      </div>
      <div
        style={{
          marginTop: compact ? 4 : 6,
          fontSize: compact ? 52 : 72,
          fontWeight: 950,
          color: '#ff9800',
          textTransform: 'uppercase',
          fontStyle: 'italic',
          letterSpacing: -2.4,
          textShadow: '0 12px 28px rgba(255,123,0,0.18)',
        }}
      >
        BonPlan
      </div>
    </div>
  </div>
);

const InfoPill = ({children, orange = false}) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      padding: '13px 18px',
      borderRadius: 999,
      border: orange
        ? '1px solid rgba(255,151,0,0.36)'
        : '1px solid rgba(255,255,255,0.12)',
      background: orange
        ? 'linear-gradient(180deg, rgba(255,145,0,0.16), rgba(255,145,0,0.08))'
        : 'linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))',
      color: orange ? '#ffd792' : 'rgba(255,255,255,0.86)',
      fontSize: 19,
      fontWeight: 850,
      letterSpacing: 1.3,
      textTransform: 'uppercase',
      boxShadow: '0 10px 24px rgba(0,0,0,0.20)',
    }}
  >
    {children}
  </div>
);

const Hook = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const intro = spring({
    frame,
    fps,
    config: {
      damping: 14,
      stiffness: 160,
      mass: 0.84,
    },
  });

  const titleGlow = 0.9 + Math.sin(frame / 6) * 0.08;

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        padding: '100px 72px',
        opacity: fadeWindow(frame, HOOK_FRAMES, 8),
      }}
    >
      <div
        style={{
          transform: `translateY(${28 - intro * 28}px)`,
          opacity: intro,
        }}
      >
        <BrandHeader />
      </div>

      <div
        style={{
          marginTop: 44,
          transform: `translateY(${24 - intro * 24}px)`,
          opacity: intro,
        }}
      >
        <InfoPill orange>Détecté à l’instant</InfoPill>
      </div>

      <div
        style={{
          marginTop: 34,
          fontSize: 116,
          lineHeight: 0.88,
          fontWeight: 950,
          letterSpacing: -5,
          color: '#ffffff',
          textTransform: 'uppercase',
          textShadow: '0 16px 42px rgba(0,0,0,0.52)',
          transform: `translateY(${34 - intro * 34}px)`,
          opacity: intro,
        }}
      >
        Prix en
        <br />
        <span
          style={{
            color: '#ff9700',
            textShadow: `0 0 ${28 * titleGlow}px rgba(255,145,0,0.30)`,
          }}
        >
          chute
        </span>
      </div>
    </AbsoluteFill>
  );
};

const DiscountBadge = ({discount, frame, fps}) => {
  const pop = spring({
    frame: Math.max(0, frame - 10),
    fps,
    config: {
      damping: 11,
      stiffness: 210,
      mass: 0.72,
    },
  });

  return (
    <div
      style={{
        position: 'absolute',
        top: 28,
        right: 28,
        minWidth: 166,
        padding: '18px 22px',
        borderRadius: 28,
        textAlign: 'center',
        color: '#1e1000',
        background:
          'linear-gradient(145deg, #ffd96f 0%, #ff9d16 48%, #ff6c00 100%)',
        boxShadow:
          '0 18px 42px rgba(255,118,0,0.30), inset 0 1px 0 rgba(255,255,255,0.55)',
        transform: `scale(${0.74 + pop * 0.26}) rotate(3deg)`,
        opacity: pop,
      }}
    >
      <div
        style={{
          fontSize: 46,
          lineHeight: 1,
          fontWeight: 950,
          letterSpacing: -2,
        }}
      >
        {clean(discount)}
      </div>
      <div
        style={{
          marginTop: 5,
          fontSize: 15,
          fontWeight: 900,
          letterSpacing: 2,
        }}
      >
        PROMO
      </div>
    </div>
  );
};

const Deal = ({title, currentPrice, originalPrice, discount}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const entrance = spring({
    frame,
    fps,
    config: {
      damping: 17,
      stiffness: 145,
      mass: 0.9,
    },
  });

  const textIn = spring({
    frame: Math.max(0, frame - 10),
    fps,
    config: {
      damping: 16,
      stiffness: 150,
      mass: 0.88,
    },
  });

  const productIn = spring({
    frame: Math.max(0, frame - 5),
    fps,
    config: {
      damping: 18,
      stiffness: 165,
      mass: 0.86,
    },
  });

  const imageFloat = Math.sin(frame / 11) * 8;
  const imageScale = interpolate(frame, [0, DEAL_FRAMES], [1.02, 1.10], clamp);
  const streakShift = interpolate(frame, [0, DEAL_FRAMES], [-140, 180], clamp);

  const hasVerifiedDiscount =
    Boolean(clean(originalPrice)) && Boolean(clean(discount));

  return (
    <AbsoluteFill
      style={{
        padding: '54px 52px 58px',
        opacity: fadeWindow(frame, DEAL_FRAMES, 10),
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          transform: `translateY(${24 - entrance * 24}px)`,
          opacity: entrance,
        }}
      >
        <BrandHeader compact />
        <InfoPill orange>Amazon Deal</InfoPill>
      </div>

      <div
        style={{
          display: 'flex',
          gap: 34,
          marginTop: 32,
          height: 924,
        }}
      >
        <div
          style={{
            flex: 0.88,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '18px 0 8px',
            transform: `translateX(${-36 + textIn * 36}px)`,
            opacity: textIn,
          }}
        >
          <div>
            <div
              style={{
                display: 'inline-flex',
                gap: 12,
                flexWrap: 'wrap',
                marginBottom: 22,
              }}
            >
              <InfoPill>Bon plan</InfoPill>
              <InfoPill orange>Offre vérifiée</InfoPill>
            </div>

            <div
              style={{
                color: '#ffffff',
                fontSize: 52,
                lineHeight: 1.03,
                fontWeight: 920,
                letterSpacing: -1.9,
                textShadow: '0 14px 30px rgba(0,0,0,0.36)',
                maxHeight: 170,
                overflow: 'hidden',
              }}
            >
              {clean(title)}
            </div>

            <div
              style={{
                marginTop: 30,
                display: 'flex',
                alignItems: 'flex-end',
                gap: 22,
              }}
            >
              <div>
                {hasVerifiedDiscount ? (
                  <div
                    style={{
                      display: 'inline-block',
                      position: 'relative',
                      color: 'rgba(255,255,255,0.42)',
                      fontSize: 30,
                      fontWeight: 760,
                    }}
                  >
                    {clean(originalPrice)}
                    <span
                      style={{
                        position: 'absolute',
                        left: -5,
                        right: -5,
                        top: '52%',
                        height: 4,
                        borderRadius: 6,
                        background: '#ff6e3a',
                        transform: 'rotate(-4deg)',
                      }}
                    />
                  </div>
                ) : (
                  <div
                    style={{
                      color: 'rgba(255,255,255,0.44)',
                      fontSize: 20,
                      fontWeight: 850,
                      letterSpacing: 1.8,
                      textTransform: 'uppercase',
                    }}
                  >
                    Prix détecté
                  </div>
                )}

                <div
                  style={{
                    marginTop: 8,
                    color: '#ff9a00',
                    fontSize: 114,
                    lineHeight: 0.9,
                    fontWeight: 950,
                    letterSpacing: -6,
                    textShadow: '0 18px 38px rgba(255,126,0,0.20)',
                  }}
                >
                  {clean(currentPrice)}
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              gap: 14,
              flexWrap: 'wrap',
            }}
          >
            <InfoPill>Prix repéré</InfoPill>
            <InfoPill>Promo flash</InfoPill>
            <InfoPill>Stock limité</InfoPill>
          </div>
        </div>

        <div
          style={{
            flex: 1.12,
            position: 'relative',
            borderRadius: 44,
            overflow: 'hidden',
            border: '1px solid rgba(255,142,26,0.22)',
            background:
              'linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))',
            boxShadow:
              '0 38px 95px rgba(0,0,0,0.50), inset 0 1px 0 rgba(255,255,255,0.10)',
            transform: `translateX(${40 - productIn * 40}px) scale(${0.95 + productIn * 0.05})`,
            opacity: productIn,
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'radial-gradient(circle at 50% 42%, rgba(255,255,255,0.15), rgba(255,255,255,0.05) 40%, transparent 75%)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: -160 + streakShift,
              top: 120,
              width: 380,
              height: 8,
              borderRadius: 999,
              background: 'linear-gradient(90deg, transparent, rgba(255,138,0,0.95), transparent)',
              transform: 'rotate(-20deg)',
              opacity: 0.7,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: -210 + streakShift * 0.9,
              top: 174,
              width: 310,
              height: 5,
              borderRadius: 999,
              background: 'linear-gradient(90deg, transparent, rgba(255,180,84,0.76), transparent)',
              transform: 'rotate(-20deg)',
              opacity: 0.65,
            }}
          />

          <div
            style={{
              position: 'absolute',
              inset: 24,
              borderRadius: 36,
              overflow: 'hidden',
              background:
                'radial-gradient(circle at 50% 44%, rgba(255,255,255,0.98) 0%, rgba(247,246,242,0.96) 48%, rgba(242,236,226,0.92) 100%)',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(135deg, rgba(255,188,92,0.14), transparent 20%, transparent 80%, rgba(255,140,0,0.10))',
              }}
            />
            <Img
              src={staticFile('product-image.jpg')}
              style={{
                position: 'absolute',
                left: '8%',
                top: '7%',
                width: '84%',
                height: '84%',
                objectFit: 'contain',
                transform: `translateY(${imageFloat}px) scale(${imageScale})`,
                filter:
                  'drop-shadow(0 34px 40px rgba(16,19,23,0.24)) drop-shadow(0 10px 14px rgba(16,19,23,0.18))',
              }}
            />
          </div>

          {hasVerifiedDiscount ? (
            <DiscountBadge discount={discount} frame={frame} fps={fps} />
          ) : null}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const TelegramIcon = ({size = 148}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background:
        'linear-gradient(145deg, #49c7ff 0%, #1e91f5 55%, #1468d6 100%)',
      boxShadow:
        '0 24px 60px rgba(17,117,220,0.36), inset 0 1px 0 rgba(255,255,255,0.42)',
    }}
  >
    <svg
      width={size * 0.52}
      height={size * 0.52}
      viewBox="0 0 240 240"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="#ffffff"
        d="M186.4 58.8L43.2 114.1C33.4 118 33.5 123.5 41.4 125.9L78.2 137.4L163.3 84.1C167.3 81.7 171 83 168 85.8L99 148.1L96.5 184.3C100.2 184.3 101.8 182.6 103.9 180.6L121.8 163.2L159 190.6C165.9 194.4 170.8 192.5 172.5 184.2L196.9 69.3C199.4 59.1 193 54.5 186.4 58.8Z"
      />
    </svg>
  </div>
);

const CTA = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const appear = spring({
    frame,
    fps,
    config: {
      damping: 15,
      stiffness: 150,
      mass: 0.84,
    },
  });

  const iconIn = spring({
    frame: Math.max(0, frame - 6),
    fps,
    config: {
      damping: 13,
      stiffness: 180,
      mass: 0.78,
    },
  });

  const arrowY = Math.sin(frame / 5) * 7;

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        padding: '86px 78px',
        textAlign: 'center',
        opacity: fadeWindow(frame, CTA_FRAMES, 8),
      }}
    >
      <div
        style={{
          transform: `translateY(${20 - appear * 20}px)`,
          opacity: appear,
        }}
      >
        <BrandHeader />
      </div>

      <div
        style={{
          marginTop: 34,
          transform: `translateY(${26 - iconIn * 26}px) scale(${0.75 + iconIn * 0.25})`,
          opacity: iconIn,
        }}
      >
        <TelegramIcon />
      </div>

      <div
        style={{
          marginTop: 34,
          fontSize: 76,
          lineHeight: 0.98,
          fontWeight: 950,
          letterSpacing: -3.2,
          color: '#ffffff',
          transform: `translateY(${22 - appear * 22}px)`,
          opacity: appear,
        }}
      >
        D’autres bons plans
      </div>

      <div
        style={{
          marginTop: 16,
          fontSize: 54,
          lineHeight: 1,
          fontWeight: 900,
          letterSpacing: -2,
          color: '#ff9b00',
          transform: `translateY(${22 - appear * 22}px)`,
          opacity: appear,
        }}
      >
        sur mon Telegram en bio
      </div>

      <div
        style={{
          marginTop: 28,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 14,
          padding: '16px 24px',
          borderRadius: 999,
          border: '1px solid rgba(255,148,33,0.30)',
          background:
            'linear-gradient(180deg, rgba(255,133,20,0.14), rgba(255,133,20,0.08))',
          color: '#ffe1af',
          fontSize: 22,
          fontWeight: 860,
          letterSpacing: 1.8,
          textTransform: 'uppercase',
          transform: `translateY(${22 - appear * 22}px)`,
          opacity: appear,
        }}
      >
        <span>Active les notifs</span>
        <span
          style={{
            fontSize: 34,
            lineHeight: 1,
            transform: `translateY(${arrowY}px)`,
            color: '#ffb545',
          }}
        >
          ↓
        </span>
      </div>

      <div
        style={{
          marginTop: 26,
          padding: '15px 24px',
          borderRadius: 999,
          color: 'rgba(255,255,255,0.80)',
          fontSize: 22,
          fontWeight: 850,
          letterSpacing: 3,
          border: '1px solid rgba(255,255,255,0.10)',
          background: 'rgba(255,255,255,0.05)',
        }}
      >
        @ALERTEBONPLAN
      </div>
    </AbsoluteFill>
  );
};

const DealVideo = (props) => {
  return (
    <AbsoluteFill
      style={{
        fontFamily:
          'Inter, Manrope, Montserrat, Arial, Helvetica, sans-serif',
      }}
    >
      <Audio
        src={staticFile('music.mp3')}
        startFrom={MUSIC_START_FRAME}
        volume={musicVolume}
      />

      <BrandBackground />

      <Sequence from={HOOK_FROM} durationInFrames={HOOK_FRAMES}>
        <Hook />
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
