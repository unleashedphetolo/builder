import { ACCOMMODATION_PRESETS } from "./accommodationPresets";

export const getAccommodationFallback = (templateKey = "accommodation-luxury-hotel-v1") => {
  return ACCOMMODATION_PRESETS[templateKey] || ACCOMMODATION_PRESETS["accommodation-luxury-hotel-v1"];
};

export default getAccommodationFallback;
