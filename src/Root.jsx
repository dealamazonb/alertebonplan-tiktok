import React from 'react';
import {Composition} from 'remotion';
import {DealVideo} from './DealVideo';

export const RemotionRoot = () => {
  return (
    <Composition
      id="DealVideo"
      component={DealVideo}
      durationInFrames={400}
      fps={60}
      width={1080}
      height={1920}
      defaultProps={{
        title: 'Bon plan Amazon',
        currentPrice: '',
        originalPrice: '',
        discount: '',
        imageUrl: '',
        affiliateUrl: '',
      }}
    />
  );
};
