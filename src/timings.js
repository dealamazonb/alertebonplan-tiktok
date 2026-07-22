export const FPS = 30;

export const INTRO_FRAMES = 90;
export const PRODUCT_FRAMES = 120;
export const PRICE_FRAMES = 120;
export const FINAL_FRAMES = 90;

export const INTRO_FROM = 0;
export const PRODUCT_FROM = INTRO_FROM + INTRO_FRAMES;
export const PRICE_FROM = PRODUCT_FROM + PRODUCT_FRAMES;
export const FINAL_FROM = PRICE_FROM + PRICE_FRAMES;

export const TOTAL_FRAMES = FINAL_FROM + FINAL_FRAMES;
