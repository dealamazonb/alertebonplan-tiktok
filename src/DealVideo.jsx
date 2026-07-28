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

const PremiumBackground = () => {
  const frame = useCurrentFrame();

  const driftA = interpolate(frame, [0, 270], [-80, 120], clamp);
  const driftB = interpolate(frame, [0, 270], [90, -100], clamp);
  const grainShift = frame % 8;

  return (
    <AbsoluteFill
      style={{
        overflow: 'hidden',
        background:
          'radial-gradient(circle at 50% -10%, #1b3756 0%, #08131f 34%, #03070d 72%, #010204 100%)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          width: 980,
          height: 980,
          borderRadius: '50%',
          top: -530 + driftA,
          left: -360,
          background:
            'radial-gradient(circle, rgba(44,175,255,0.22) 0%, rgba(15,94,153,0.08) 42%, transparent 72%)',
          filter: 'blur(12px)',
        }}
      />

      <div
        style={{
          position: 'absolute',
          width: 900,
          height: 900,
          borderRadius: '50%',
          right: -460,
          bottom: -430 + driftB,
          background:
            'radial-gradient(circle, rgba(255,183,70,0.19) 0%, rgba(255,109,0,0.07) 42%, transparent 72%)',
          filter: 'blur(16px)',
        }}
      />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.18,
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)',
          backgroundSize: '74px 74px',
          transform: `translate(${driftA * 0.08}px, ${driftB * 0.05}px)`,
          maskImage:
            'linear-gradient(to bottom, rgba(0,0,0,0.8), transparent 75%)',
        }}
      />

      <div
        style={{
          position: 'absolute',
          inset: -20,
          opacity: 0.055,
          transform: `translate(${grainShift}px, ${-grainShift}px)`,
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=%270 0 160 160%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter id=%27n%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.85%27 numOctaves=%274%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23n)%27 opacity=%271%27/%3E%3C/svg%3E")',
          backgroundSize: '260px 260px',
          mixBlendMode: 'soft-light',
        }}
      />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          boxShadow: 'inset 0 0 220px rgba(0,0,0,0.88)',
        }}
      />
    </AbsoluteFill>
  );
};

const BrandPill = ({label = 'ALERTEBONPLAN'}) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 12,
      borderRadius: 999,
      padding: '13px 20px 12px',
      border: '1px solid rgba(255,255,255,0.14)',
      background:
        'linear-gradient(180deg, rgba(255,255,255,0.10), rgba(255,255,255,0.035))',
      boxShadow:
        '0 14px 36px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.12)',
      backdropFilter: 'blur(18px)',
      color: 'rgba(255,255,255,0.88)',
      fontSize: 22,
      fontWeight: 800,
      letterSpacing: 2.8,
    }}
  >
    <span
      style={{
        width: 11,
        height: 11,
        borderRadius: '50%',
        background: '#ffbd4a',
        boxShadow: '0 0 22px rgba(255,189,74,0.9)',
      }}
    />
    {label}
  </div>
);

const Hook = ({title, currentPrice}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const entrance = spring({
    frame,
    fps,
    config: {
      damping: 15,
      stiffness: 180,
      mass: 0.8,
    },
  });

  const priceEntrance = spring({
    frame: Math.max(0, frame - 6),
    fps,
    config: {
      damping: 12,
      stiffness: 210,
      mass: 0.7,
    },
  });

  const glow = interpolate(frame, [0, HOOK_FRAMES], [0.65, 1.05], clamp);

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        padding: '110px 76px',
        opacity: fadeWindow(frame, HOOK_FRAMES, 8),
      }}
    >
      <div
        style={{
          transform: `translateY(${34 - entrance * 34}px)`,
          opacity: entrance,
        }}
      >
        <BrandPill label="DÉTECTÉ À L’INSTANT" />
      </div>

      <div
        style={{
          marginTop: 38,
          fontSize: 92,
          lineHeight: 0.92,
          fontWeight: 950,
          letterSpacing: -4.2,
          color: '#ffffff',
          textTransform: 'uppercase',
          transform: `translateY(${58 - entrance * 58}px)`,
          opacity: entrance,
          textShadow: '0 18px 50px rgba(0,0,0,0.45)',
        }}
      >
        Prix en
        <br />
        <span
          style={{
            color: '#ffbd4a',
            textShadow: `0 0 ${30 * glow}px rgba(255,189,74,0.38)`,
          }}
        >
          chute.
        </span>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          marginTop: 42,
          transform: `scale(${0.82 + priceEntrance * 0.18})`,
          transformOrigin: 'left center',
          opacity: priceEntrance,
        }}
      >
        <span
          style={{
            fontSize: 142,
            lineHeight: 0.9,
            fontWeight: 950,
            letterSpacing: -6,
            color: '#ffffff',
          }}
        >
          {clean(currentPrice) || 'Prix très bas'}
        </span>
      </div>

      <div
        style={{
          marginTop: 38,
          maxWidth: 880,
          fontSize: 31,
          lineHeight: 1.25,
          fontWeight: 650,
          color: 'rgba(255,255,255,0.68)',
          transform: `translateY(${34 - entrance * 34}px)`,
          opacity: entrance,
        }}
      >
        {clean(title)}
      </div>
    </AbsoluteFill>
  );
};

const DiscountBadge = ({discount, frame, fps}) => {
  const appear = spring({
    frame: Math.max(0, frame - 16),
    fps,
    config: {
      damping: 10,
      stiffness: 210,
      mass: 0.7,
    },
  });

  return (
    <div
      style={{
        position: 'absolute',
        top: 42,
        right: 42,
        minWidth: 164,
        padding: '19px 24px',
        borderRadius: 28,
        textAlign: 'center',
        color: '#171006',
        background:
          'linear-gradient(135deg, #ffe08a 0%, #ffbd4a 48%, #ff8a1f 100%)',
        boxShadow:
          '0 22px 50px rgba(255,147,37,0.30), inset 0 1px 0 rgba(255,255,255,0.60)',
        transform: `rotate(3deg) scale(${0.72 + appear * 0.28})`,
        opacity: appear,
      }}
    >
      <div
        style={{
          fontSize: 48,
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
          fontSize: 16,
          fontWeight: 900,
          letterSpacing: 2,
        }}
      >
        ÉCONOMISEZ
      </div>
    </div>
  );
};

const Deal = ({title, currentPrice, originalPrice, discount}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const cardEntrance = spring({
    frame,
    fps,
    config: {
      damping: 16,
      stiffness: 150,
      mass: 0.85,
    },
  });

  const infoEntrance = spring({
    frame: Math.max(0, frame - 20),
    fps,
    config: {
      damping: 17,
      stiffness: 145,
      mass: 0.9,
    },
  });

  const imageScale = interpolate(frame, [0, DEAL_FRAMES], [1.04, 1.13], clamp);
  const imageFloat = Math.sin(frame / 14) * 10;
  const shine = interpolate(frame, [10, 95], [-420, 800], clamp);

  const hasVerifiedDiscount =
    Boolean(clean(originalPrice)) && Boolean(clean(discount));

  return (
    <AbsoluteFill
      style={{
        padding: '80px 58px 84px',
        opacity: fadeWindow(frame, DEAL_FRAMES, 10),
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <BrandPill />
        <div
          style={{
            color: 'rgba(255,255,255,0.46)',
            fontSize: 18,
            fontWeight: 750,
            letterSpacing: 2.2,
          }}
        >
          AMAZON DEAL
        </div>
      </div>

      <div
        style={{
          position: 'relative',
          marginTop: 48,
          height: 870,
          borderRadius: 52,
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.14)',
          background:
            'linear-gradient(145deg, rgba(255,255,255,0.13), rgba(255,255,255,0.055) 48%, rgba(255,255,255,0.025))',
          boxShadow:
            '0 48px 120px rgba(0,0,0,0.52), inset 0 1px 0 rgba(255,255,255,0.16)',
          backdropFilter: 'blur(24px)',
          transform: `translateY(${70 - cardEntrance * 70}px) scale(${0.94 + cardEntrance * 0.06})`,
          opacity: cardEntrance,
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: 780,
            height: 780,
            borderRadius: '50%',
            left: 90,
            top: 32,
            background:
              'radial-gradient(circle, rgba(255,255,255,0.18), rgba(91,177,238,0.08) 42%, transparent 72%)',
            filter: 'blur(4px)',
          }}
        />

        <div
          style={{
            position: 'absolute',
            inset: 34,
            borderRadius: 38,
            background:
              'linear-gradient(145deg, rgba(255,255,255,0.98), rgba(241,245,249,0.93))',
            boxShadow:
              'inset 0 1px 0 rgba(255,255,255,1), 0 20px 70px rgba(0,0,0,0.18)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'radial-gradient(circle at 50% 42%, rgba(255,255,255,1) 0%, rgba(246,248,251,0.96) 50%, rgba(224,231,239,0.90) 100%)',
            }}
          />

          <div
            style={{
              position: 'absolute',
              top: -220,
              left: shine,
              width: 210,
              height: 1400,
              transform: 'rotate(17deg)',
              background:
                'linear-gradient(90deg, transparent, rgba(255,255,255,0.74), transparent)',
              filter: 'blur(10px)',
              opacity: 0.72,
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
                'drop-shadow(0 34px 34px rgba(14,24,38,0.22)) drop-shadow(0 8px 12px rgba(14,24,38,0.16))',
            }}
          />
        </div>

        {hasVerifiedDiscount ? (
          <DiscountBadge discount={discount} frame={frame} fps={fps} />
        ) : null}
      </div>

      <div
        style={{
          marginTop: 42,
          transform: `translateY(${52 - infoEntrance * 52}px)`,
          opacity: infoEntrance,
        }}
      >
        <div
          style={{
            color: '#ffffff',
            fontSize: 46,
            lineHeight: 1.06,
            fontWeight: 880,
            letterSpacing: -1.6,
            maxHeight: 104,
            overflow: 'hidden',
            textShadow: '0 14px 34px rgba(0,0,0,0.36)',
          }}
        >
          {clean(title)}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            marginTop: 28,
            gap: 24,
          }}
        >
          <div>
            {hasVerifiedDiscount ? (
              <div
                style={{
                  display: 'inline-block',
                  position: 'relative',
                  color: 'rgba(255,255,255,0.43)',
                  fontSize: 30,
                  fontWeight: 750,
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
                    borderRadius: 4,
                    background: '#ff7058',
                    transform: 'rotate(-4deg)',
                  }}
                />
              </div>
            ) : (
              <div
                style={{
                  color: 'rgba(255,255,255,0.48)',
                  fontSize: 21,
                  fontWeight: 800,
                  letterSpacing: 2.2,
                }}
              >
                PRIX DÉTECTÉ
              </div>
            )}

            <div
              style={{
                marginTop: 6,
                color: '#ffcf65',
                fontSize: 102,
                lineHeight: 0.94,
                fontWeight: 950,
                letterSpacing: -5,
                textShadow: '0 16px 42px rgba(255,174,53,0.18)',
              }}
            >
              {clean(currentPrice)}
            </div>
          </div>

          <div
            style={{
              marginBottom: 7,
              padding: '15px 20px',
              borderRadius: 18,
              border: '1px solid rgba(121,217,255,0.24)',
              background: 'rgba(48,158,221,0.10)',
              color: '#91ddff',
              fontSize: 18,
              fontWeight: 850,
              letterSpacing: 1.6,
              textTransform: 'uppercase',
            }}
          >
            Offre Amazon
          </div>
        </div>
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
      stiffness: 145,
      mass: 0.85,
    },
  });

  const telegramAppear = spring({
    frame: Math.max(0, frame - 8),
    fps,
    config: {
      damping: 12,
      stiffness: 180,
      mass: 0.75,
    },
  });

  const arrowY = Math.sin(frame / 5) * 7;

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        padding: 76,
        textAlign: 'center',
        opacity: fadeWindow(frame, CTA_FRAMES, 8),
      }}
    >
      <div
        style={{
          position: 'absolute',
          width: 720,
          height: 720,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(47,177,255,0.20), transparent 68%)',
          filter: 'blur(12px)',
          transform: `scale(${0.86 + appear * 0.14})`,
        }}
      />

      <div
        style={{
          position: 'relative',
          width: 190,
          height: 190,
          borderRadius: 52,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          fontSize: 98,
          background:
            'linear-gradient(145deg, #42c8ff 0%, #1686e8 58%, #0758bf 100%)',
          boxShadow:
            '0 34px 80px rgba(13,123,218,0.38), inset 0 1px 0 rgba(255,255,255,0.42)',
          transform: `translateY(${38 - telegramAppear * 38}px) scale(${0.72 + telegramAppear * 0.28}) rotate(${-7 + telegramAppear * 7}deg)`,
          opacity: telegramAppear,
        }}
      >
        ✈
      </div>

      <div
        style={{
          position: 'relative',
          marginTop: 52,
          fontSize: 78,
          lineHeight: 0.98,
          fontWeight: 950,
          letterSpacing: -3.4,
          color: '#ffffff',
          transform: `translateY(${42 - appear * 42}px)`,
          opacity: appear,
        }}
      >
        D’autres bons plans
      </div>

      <div
        style={{
          position: 'relative',
          marginTop: 18,
          fontSize: 56,
          lineHeight: 1,
          fontWeight: 900,
          letterSpacing: -2,
          color: '#ffca5b',
          transform: `translateY(${42 - appear * 42}px)`,
          opacity: appear,
        }}
      >
        sur mon Telegram en bio
      </div>

      <div
        style={{
          position: 'relative',
          marginTop: 42,
          transform: `translateY(${arrowY}px)`,
          color: 'rgba(255,255,255,0.72)',
          fontSize: 42,
          fontWeight: 800,
        }}
      >
        ↓
      </div>

      <div
        style={{
          position: 'relative',
          marginTop: 30,
          padding: '15px 23px',
          borderRadius: 999,
          color: 'rgba(255,255,255,0.76)',
          fontSize: 22,
          fontWeight: 850,
          letterSpacing: 3,
          border: '1px solid rgba(255,255,255,0.12)',
          background: 'rgba(255,255,255,0.055)',
        }}
      >
        ALERTEBONPLAN
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
      <PremiumBackground />

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
