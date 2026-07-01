import { RESTAURANT_PRESETS } from "./restaurantPresets";

export const DEFAULT_RESTAURANT_TEMPLATE = "restaurant-fine-dining-v1";

export const getRestaurantFallback = (templateKey) => {
  return RESTAURANT_PRESETS[templateKey] || RESTAURANT_PRESETS[DEFAULT_RESTAURANT_TEMPLATE];
};

export default getRestaurantFallback;
