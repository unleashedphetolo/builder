import { BEAUTY_PRESETS } from "./beautyPresets";

export const DEFAULT_BEAUTY_TEMPLATE = "beauty-luxury-salon-v1";

export const getBeautyFallback = (templateKey) => {
  return BEAUTY_PRESETS[templateKey] || BEAUTY_PRESETS[DEFAULT_BEAUTY_TEMPLATE];
};

export default getBeautyFallback;
