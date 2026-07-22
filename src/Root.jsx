import React from 'react';
import {Composition} from 'remotion';
import {DealVideo} from './DealVideo';
import {FPS, TOTAL_FRAMES} from './timings';

export const RemotionRoot = () => {
  return (
    <Composition
      id="DealVideo"
      component={DealVideo}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={1080}
      height={1920}
      defaultProps={{
        title: 'Bon plan Amazon',
        shortTitle: '',
        currentPrice: '',
        originalPrice: '',
        discount: '',
        imageUrl: '',
        affiliateUrl: '',
      }}
    />
  );
};
