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

const BrandBackground = () => {
  const frame = useCurrentFrame();

  const streakA = interpolate(frame, [0, 270], [-260, 250], clamp);
  const streakB = interpolate(frame, [0, 270], [200, -160], clamp);
  const glowPulse = 0.82 + Math.sin(frame / 10) * 0.08;

  return (
    <AbsoluteFill
      style={{
        overflow: 'hidden',
        background:
          'radial-gradient(circle at 50% 0%, #141414 0%, #070707 38%, #020202 75%, #000000 100%)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at 18% 26%, rgba(255,144,0,0.20), transparent 28%), radial-gradient(circle at 86% 78%, rgba(255,108,0,0.14), transparent 25%), radial-gradient(circle at 65% 32%, rgba(255,198,77,0.08), transparent 23%)',
          opacity: glowPulse,
        }}
      />

      <div
        style={{
          position: 'absolute',
          left: -180 + streakA,
          top: 130,
          width: 620,
          height: 6,
          borderRadius: 999,
          background: 'linear-gradient(90deg, transparent, rgba(255,124,0,0.95), transparent)',
          transform: 'rotate(-13deg)',
          boxShadow: '0 0 25px rgba(255,124,0,0.38)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: -120 + streakA * 0.9,
          top: 178,
          width: 450,
          height: 4,
          borderRadius: 999,
          background: 'linear-gradient(90deg, transparent, rgba(255,163,59,0.80), transparent)',
          transform: 'rotate(-13deg)',
          opacity: 0.8,
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: -180 + streakB,
          bottom: 160,
          width: 690,
          height: 6,
          borderRadius: 999,
          background: 'linear-gradient(90deg, transparent, rgba(255,124,0,0.90), transparent)',
          transform: 'rotate(-13deg)',
          boxShadow: '0 0 25px rgba(255,124,0,0.30)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: -80 + streakB * 0.84,
          bottom: 118,
          width: 420,
          height: 4,
          borderRadius: 999,
          background: 'linear-gradient(90deg, transparent, rgba(255,173,70,0.75), transparent)',
          transform: 'rotate(-13deg)',
          opacity: 0.7,
        }}
      />

      <div
        style={{
          position: 'absolute',
          top: 70,
          right: 56,
          width: 180,
          height: 180,
          opacity: 0.18,
          backgroundImage:
            'radial-gradient(circle, rgba(255,124,0,0.9) 1.7px, transparent 1.7px)',
          backgroundSize: '18px 18px',
          maskImage: 'linear-gradient(135deg, rgba(0,0,0,1), transparent 80%)',
        }}
      />

      <div
        style={{
          position: 'absolute',
          left: 54,
          bottom: 76,
          width: 240,
          height: 170,
          opacity: 0.11,
          backgroundImage:
            'radial-gradient(circle, rgba(255,158,53,0.95) 1.8px, transparent 1.8px)',
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

const BellTagIcon = ({size = 74}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background:
        'linear-gradient(145deg, #ffcf47 0%, #ff9600 52%, #ff6a00 100%)',
      boxShadow:
        '0 12px 30px rgba(255,122,0,0.28), inset 0 1px 0 rgba(255,255,255,0.40)',
      color: '#111',
      fontSize: size * 0.42,
      fontWeight: 900,
    }}
  >
    🔔
  </div>
);

const BrandTitle = ({compact = false}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: compact ? 16 : 20}}>
    <BellTagIcon size={compact ? 60 : 74} />
    <div style={{display: 'flex', flexDirection: 'column', lineHeight: 0.9}}>
      <div
        style={{
          fontSize: compact ? 44 : 58,
          fontWeight: 950,
          letterSpacing: -2.4,
          color: '#ffffff',
          fontStyle: 'italic',
          textTransform: 'uppercase',
        }}
      >
        Alerte
      </div>
      <div
        style={{
          marginTop: compact ? 4 : 6,
          fontSize: compact ? 48 : 62,
          fontWeight: 950,
          letterSpacing: -2.6,
          color: '#ff9b00',
          fontStyle: 'italic',
          textTransform: 'uppercase',
          textShadow: '0 10px 28px rgba(255,126,0,0.20)',
        }}
      >
        BonPlan
      </div>
    </div>
  </div>
);

const TopSocialPill = () => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 12,
      borderRadius: 999,
      padding: '13px 22px',
      border: '1px solid rgba(255,146,29,0.35)',
      background:
        'linear-gradient(180deg, rgba(255,130,16,0.16), rgba(255,130,16,0.08))',
      color: '#ffe3b3',
      fontSize: 20,
      fontWeight: 850,
      letterSpacing: 1.8,
      textTransform: 'uppercase',
      boxShadow: '0 12px 28px rgba(0,0,0,0.26)',
    }}
  >
    <span
      style={{
        width: 10,
        height: 10,
        borderRadius: '50%',
        background: '#ffad28',
        boxShadow: '0 0 16px rgba(255,173,40,0.95)',
      }}
    />
    Détecté à l’instant
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
      stiffness: 165,
      mass: 0.82,
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
          transform: `translateY(${36 - intro * 36}px)`,
          opacity: intro,
        }}
      >
        <BrandTitle />
      </div>

      <div
        style={{
          marginTop: 52,
          transform: `translateY(${28 - intro * 28}px)`,
          opacity: intro,
        }}
      >
        <TopSocialPill />
      </div>

      <div
        style={{
          marginTop: 36,
          fontSize: 118,
          lineHeight: 0.88,
          fontWeight: 950,
          letterSpacing: -5,
          color: '#ffffff',
          textTransform: 'uppercase',
          textShadow: '0 16px 44px rgba(0,0,0,0.52)',
          transform: `translateY(${48 - intro * 48}px)`,
          opacity: intro,
        }}
      >
        Prix en
        <br />
        <span
          style={{
            color: '#ff9b00',
            textShadow: `0 0 ${30 * titleGlow}px rgba(255,145,0,0.28)`,
          }}
        >
          chute
        </span>
      </div>
    </AbsoluteFill>
  );
};

const LabelChip = ({children, orange = false}) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '14px 18px',
      borderRadius: 18,
      border: orange
        ? '1px solid rgba(255,155,0,0.30)'
        : '1px solid rgba(255,255,255,0.12)',
      background: orange
        ? 'linear-gradient(180deg, rgba(255,145,0,0.18), rgba(255,145,0,0.10))'
        : 'linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.04))',
      color: orange ? '#ffd485' : 'rgba(255,255,255,0.88)',
      fontSize: 18,
      fontWeight: 850,
      letterSpacing: 1.3,
      textTransform: 'uppercase',
    }}
  >
    {children}
  </div>
);

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
        top: 34,
        right: 34,
        minWidth: 164,
        padding: '18px 22px',
        borderRadius: 28,
        textAlign: 'center',
        color: '#1e1000',
        background:
          'linear-gradient(145deg, #ffd86d 0%, #ffa013 48%, #ff6d00 100%)',
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
          transform: `translateY(${30 - entrance * 30}px)`,
          opacity: entrance,
        }}
      >
        <BrandTitle compact />
        <LabelChip orange>Amazon Deal</LabelChip>
      </div>

      <div
        style={{
          display: 'flex',
          gap: 34,
          marginTop: 34,
          height: 920,
        }}
      >
        <div
          style={{
            flex: 0.9,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '20px 0 8px',
            transform: `translateX(${-42 + textIn * 42}px)`,
            opacity: textIn,
          }}
        >
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                marginBottom: 22,
              }}
            >
              <LabelChip>Bon plan</LabelChip>
              <LabelChip orange>Offre vérifiée</LabelChip>
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
                marginTop: 32,
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
                    color: '#ff9b00',
                    fontSize: 112,
                    lineHeight: 0.9,
                    fontWeight: 950,
                    letterSpacing: -5.8,
                    textShadow: '0 18px 38px rgba(255,126,0,0.18)',
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
              gap: 16,
              flexWrap: 'wrap',
            }}
          >
            <LabelChip>Prix repéré</LabelChip>
            <LabelChip>Promo flash</LabelChip>
            <LabelChip>Stock limité</LabelChip>
          </div>
        </div>

        <div
          style={{
            flex: 1.08,
            position: 'relative',
            borderRadius: 44,
            overflow: 'hidden',
            border: '1px solid rgba(255,142,26,0.22)',
            background:
              'linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))',
            boxShadow:
              '0 38px 95px rgba(0,0,0,0.50), inset 0 1px 0 rgba(255,255,255,0.10)',
            transform: `translateX(${44 - productIn * 44}px) scale(${0.95 + productIn * 0.05})`,
            opacity: productIn,
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'radial-gradient(circle at 50% 42%, rgba(255,255,255,0.16), rgba(255,255,255,0.05) 40%, transparent 75%)',
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
              inset: 26,
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

const TelegramIcon = ({size = 120}) => (
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
          transform: `translateY(${24 - appear * 24}px)`,
          opacity: appear,
        }}
      >
        <BrandTitle />
      </div>

      <div
        style={{
          marginTop: 40,
          transform: `translateY(${28 - iconIn * 28}px) scale(${0.75 + iconIn * 0.25})`,
          opacity: iconIn,
        }}
      >
        <TelegramIcon size={154} />
      </div>

      <div
        style={{
          marginTop: 38,
          fontSize: 76,
          lineHeight: 0.98,
          fontWeight: 950,
          letterSpacing: -3.2,
          color: '#ffffff',
          transform: `translateY(${28 - appear * 28}px)`,
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
          transform: `translateY(${28 - appear * 28}px)`,
          opacity: appear,
        }}
      >
        sur mon Telegram en bio
      </div>

      <div
        style={{
          marginTop: 32,
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
          transform: `translateY(${28 - appear * 28}px)`,
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
          marginTop: 30,
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
