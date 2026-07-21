import React from 'react';
import {
  AbsoluteFill,
  Img,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

const COLORS = {
  background: '#070B18',
  backgroundLight: '#111C38',
  red: '#FF303C',
  orange: '#FF7A00',
  yellow: '#FFD43B',
  white: '#FFFFFF',
  muted: '#AEB8D0',
  green: '#42E58A',
};

const clamp = {
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
};

const fitTitle = (title) => {
  const clean = String(title || 'Bon plan Amazon')
    .replace(/\s+/g, ' ')
    .trim();

  if (clean.length <= 75) {
    return clean;
  }

  return `${clean.slice(0, 72).trim()}…`;
};

const Background = () => {
  const frame = useCurrentFrame();

  const glowX = interpolate(
    Math.sin(frame / 32),
    [-1, 1],
    [-120, 140]
  );

  const glowY = interpolate(
    Math.cos(frame / 45),
    [-1, 1],
    [-80, 120]
  );

  return (
    <AbsoluteFill
      style={{
        background:
          'linear-gradient(155deg, #050714 0%, #101A35 55%, #071020 100%)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          width: 850,
          height: 850,
          left: -320 + glowX,
          top: -260 + glowY,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(255,48,60,0.35) 0%, rgba(255,48,60,0) 68%)',
          filter: 'blur(20px)',
        }}
      />

      <div
        style={{
          position: 'absolute',
          width: 900,
          height: 900,
          right: -380 - glowX,
          bottom: -320 - glowY,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(255,122,0,0.25) 0%, rgba(255,122,0,0) 70%)',
          filter: 'blur(25px)',
        }}
      />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.14,
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)',
          backgroundSize: '65px 65px',
          transform: `translateY(${frame * 0.25}px)`,
        }}
      />
    </AbsoluteFill>
  );
};

const Brand = () => {
  return (
    <div
      style={{
        position: 'absolute',
        top: 58,
        left: 70,
        right: 70,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 18,
        }}
      >
        <div
          style={{
            width: 62,
            height: 62,
            borderRadius: 20,
            background:
              'linear-gradient(145deg, #FF303C, #FF7A00)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 32,
            boxShadow: '0 12px 35px rgba(255,48,60,0.35)',
          }}
        >
          🔥
        </div>

        <div>
          <div
            style={{
              color: COLORS.white,
              fontWeight: 900,
              fontSize: 34,
              letterSpacing: -1,
            }}
          >
            AlerteBonPlan
          </div>

          <div
            style={{
              color: COLORS.muted,
              fontWeight: 600,
              fontSize: 19,
              marginTop: 2,
            }}
          >
            Les meilleures promos Amazon
          </div>
        </div>
      </div>

      <div
        style={{
          color: COLORS.yellow,
          fontWeight: 900,
          fontSize: 22,
          padding: '13px 22px',
          borderRadius: 999,
          border: '2px solid rgba(255,212,59,0.45)',
          background: 'rgba(255,212,59,0.09)',
        }}
      >
        BON PLAN
      </div>
    </div>
  );
};

const Intro = ({discount}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const entrance = spring({
    frame,
    fps,
    config: {
      damping: 12,
      stiffness: 170,
      mass: 0.7,
    },
  });

  const flash = interpolate(
    frame,
    [0, 3, 10],
    [0.9, 0.45, 0],
    clamp
  );

  const rotation = interpolate(
    entrance,
    [0, 1],
    [-7, 0]
  );

  return (
    <AbsoluteFill
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: COLORS.white,
          opacity: flash,
        }}
      />

      <div
        style={{
          transform: `scale(${entrance}) rotate(${rotation}deg)`,
          opacity: entrance,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontSize: 58,
            fontWeight: 900,
            color: COLORS.yellow,
            letterSpacing: 5,
            marginBottom: 20,
          }}
        >
          ÇA VIENT DE TOMBER
        </div>

        <div
          style={{
            fontSize: 112,
            lineHeight: 0.98,
            fontWeight: 1000,
            color: COLORS.white,
            textTransform: 'uppercase',
            textShadow:
              '0 10px 40px rgba(255,48,60,0.55)',
          }}
        >
          ALERTE
          <br />
          BON PLAN
        </div>

        {discount ? (
          <div
            style={{
              display: 'inline-flex',
              marginTop: 48,
              padding: '20px 48px',
              borderRadius: 999,
              background:
                'linear-gradient(135deg, #FF303C, #FF7A00)',
              color: COLORS.white,
              fontWeight: 1000,
              fontSize: 68,
              boxShadow:
                '0 20px 60px rgba(255,48,60,0.45)',
            }}
          >
            {discount}
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

const ProductScene = ({title, imageUrl, discount}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const imageEntrance = spring({
    frame,
    fps,
    config: {
      damping: 13,
      stiffness: 115,
      mass: 0.75,
    },
  });

  const titleEntrance = spring({
    frame: frame - 15,
    fps,
    config: {
      damping: 14,
      stiffness: 130,
    },
  });

  const imageY = interpolate(
    imageEntrance,
    [0, 1],
    [220, 0]
  );

  const productZoom = interpolate(
    frame,
    [0, 125],
    [0.96, 1.07],
    clamp
  );

  return (
    <AbsoluteFill
      style={{
        padding: '175px 64px 120px',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <Brand />

      <div
        style={{
          position: 'absolute',
          top: 220,
          left: 70,
          right: 70,
          height: 1040,
          borderRadius: 65,
          background:
            'linear-gradient(145deg, rgba(255,255,255,0.98), rgba(235,240,252,0.95))',
          boxShadow:
            '0 35px 100px rgba(0,0,0,0.48)',
          overflow: 'hidden',
          transform: `translateY(${imageY}px) scale(${imageEntrance})`,
          opacity: imageEntrance,
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(circle at 50% 45%, rgba(255,255,255,1), rgba(220,228,245,0.7))',
          }}
        />

        {imageUrl ? (
          <Img
            src={imageUrl}
            style={{
              position: 'absolute',
              width: '82%',
              height: '78%',
              left: '9%',
              top: '9%',
              objectFit: 'contain',
              transform: `scale(${productZoom})`,
              filter:
                'drop-shadow(0 28px 32px rgba(8,15,35,0.28))',
            }}
          />
        ) : (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#18213A',
              fontWeight: 900,
              fontSize: 52,
            }}
          >
            Image produit indisponible
          </div>
        )}

        {discount ? (
          <div
            style={{
              position: 'absolute',
              right: 28,
              top: 28,
              padding: '18px 28px',
              borderRadius: 999,
              color: COLORS.white,
              fontWeight: 1000,
              fontSize: 45,
              background:
                'linear-gradient(135deg, #FF303C, #FF7A00)',
              boxShadow:
                '0 14px 35px rgba(255,48,60,0.4)',
            }}
          >
            {discount}
          </div>
        ) : null}
      </div>

      <div
        style={{
          position: 'absolute',
          left: 75,
          right: 75,
          top: 1320,
          color: COLORS.white,
          fontWeight: 900,
          fontSize: 54,
          lineHeight: 1.12,
          textAlign: 'center',
          opacity: titleEntrance,
          transform: `translateY(${interpolate(
            titleEntrance,
            [0, 1],
            [70, 0]
          )}px)`,
          textShadow: '0 8px 30px rgba(0,0,0,0.45)',
        }}
      >
        {fitTitle(title)}
      </div>
    </AbsoluteFill>
  );
};

const PriceScene = ({
  currentPrice,
  originalPrice,
  discount,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const priceEntrance = spring({
    frame,
    fps,
    config: {
      damping: 11,
      stiffness: 170,
      mass: 0.65,
    },
  });

  const oldPriceEntrance = spring({
    frame: frame - 18,
    fps,
    config: {
      damping: 14,
      stiffness: 125,
    },
  });

  const discountEntrance = spring({
    frame: frame - 34,
    fps,
    config: {
      damping: 9,
      stiffness: 185,
      mass: 0.6,
    },
  });

  return (
    <AbsoluteFill
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        padding: 70,
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <Brand />

      <div
        style={{
          width: 930,
          padding: '95px 50px',
          borderRadius: 70,
          background:
            'linear-gradient(150deg, rgba(20,31,60,0.97), rgba(5,9,22,0.98))',
          border: '2px solid rgba(255,255,255,0.12)',
          boxShadow:
            '0 40px 120px rgba(0,0,0,0.55)',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            color: COLORS.muted,
            fontSize: 34,
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: 4,
            marginBottom: 35,
          }}
        >
          Prix actuel
        </div>

        <div
          style={{
            color: COLORS.yellow,
            fontSize:
              String(currentPrice || '').length > 10
                ? 118
                : 155,
            lineHeight: 1,
            fontWeight: 1000,
            letterSpacing: -7,
            transform: `scale(${priceEntrance})`,
            opacity: priceEntrance,
            textShadow:
              '0 12px 45px rgba(255,212,59,0.25)',
          }}
        >
          {currentPrice || 'PROMO'}
        </div>

        {originalPrice ? (
          <div
            style={{
              display: 'inline-block',
              position: 'relative',
              color: COLORS.muted,
              fontSize: 52,
              fontWeight: 700,
              marginTop: 45,
              opacity: oldPriceEntrance,
              transform: `translateY(${interpolate(
                oldPriceEntrance,
                [0, 1],
                [40, 0]
              )}px)`,
            }}
          >
            Au lieu de {originalPrice}

            <div
              style={{
                position: 'absolute',
                left: -8,
                right: -8,
                top: '50%',
                height: 8,
                borderRadius: 999,
                background: COLORS.red,
                transformOrigin: 'left center',
                transform: `scaleX(${oldPriceEntrance}) rotate(-3deg)`,
              }}
            />
          </div>
        ) : null}

        {discount ? (
          <div
            style={{
              margin: '60px auto 0',
              width: 500,
              padding: '25px 20px',
              borderRadius: 999,
              background:
                'linear-gradient(135deg, #FF303C, #FF7A00)',
              color: COLORS.white,
              fontSize: 82,
              fontWeight: 1000,
              transform: `scale(${discountEntrance})`,
              opacity: discountEntrance,
              boxShadow:
                '0 25px 60px rgba(255,48,60,0.42)',
            }}
          >
            {discount}
          </div>
        ) : null}

        <div
          style={{
            marginTop: 55,
            color: COLORS.green,
            fontSize: 34,
            fontWeight: 900,
          }}
        >
          ✓ Offre détectée sur Amazon
        </div>
      </div>
    </AbsoluteFill>
  );
};

const FinalScene = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const entrance = spring({
    frame,
    fps,
    config: {
      damping: 12,
      stiffness: 135,
    },
  });

  const arrowY = interpolate(
    Math.sin(frame / 6),
    [-1, 1],
    [-12, 12]
  );

  return (
    <AbsoluteFill
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: 70,
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <div
        style={{
          transform: `scale(${entrance})`,
          opacity: entrance,
        }}
      >
        <div
          style={{
            color: COLORS.yellow,
            fontSize: 42,
            fontWeight: 900,
            letterSpacing: 4,
          }}
        >
          NE RATE PAS L’OFFRE
        </div>

        <div
          style={{
            color: COLORS.white,
            fontSize: 90,
            lineHeight: 1.04,
            fontWeight: 1000,
            marginTop: 35,
          }}
        >
          LIEN DU PRODUIT
          <br />
          DANS LA DESCRIPTION
        </div>

        <div
          style={{
            fontSize: 115,
            marginTop: 55,
            transform: `translateY(${arrowY}px)`,
          }}
        >
          👇
        </div>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 18,
            marginTop: 45,
            padding: '23px 42px',
            borderRadius: 999,
            color: COLORS.white,
            background:
              'linear-gradient(135deg, #FF303C, #FF7A00)',
            fontWeight: 1000,
            fontSize: 46,
            boxShadow:
              '0 25px 65px rgba(255,48,60,0.4)',
          }}
        >
          🔥 AlerteBonPlan
        </div>

        <div
          style={{
            color: COLORS.muted,
            fontSize: 27,
            fontWeight: 600,
            marginTop: 38,
          }}
        >
          Prix susceptible d’évoluer rapidement
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const DealVideo = ({
  title,
  currentPrice,
  originalPrice,
  discount,
  imageUrl,
}) => {
  return (
    <AbsoluteFill>
      <Background />

      <Sequence from={0} durationInFrames={48}>
        <Intro discount={discount} />
      </Sequence>

      <Sequence from={42} durationInFrames={132}>
        <ProductScene
          title={title}
          imageUrl={imageUrl}
          discount={discount}
        />
      </Sequence>

      <Sequence from={166} durationInFrames={82}>
        <PriceScene
          currentPrice={currentPrice}
          originalPrice={originalPrice}
          discount={discount}
        />
      </Sequence>

      <Sequence from={240} durationInFrames={60}>
        <FinalScene />
      </Sequence>
    </AbsoluteFill>
  );
};
