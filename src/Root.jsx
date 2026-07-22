import React from 'react';
import {Composition} from 'remotion';
import {DealVideo} from './DealVideo';
import {
  VIDEO_DURATION_IN_FRAMES,
  VIDEO_FPS,
} from './videoDuration';

export const RemotionRoot = () => {
  return (
    <Composition
      id="DealVideo"
      component={DealVideo}
      durationInFrames={VIDEO_DURATION_IN_FRAMES}
      fps={VIDEO_FPS}
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
