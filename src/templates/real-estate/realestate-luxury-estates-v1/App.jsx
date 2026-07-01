import RealEstateRenderer from "../shared/RealEstateRenderer";
import { REAL_ESTATE_PRESETS } from "../shared/realEstatePresets";
import "./theme.css";

const preset = REAL_ESTATE_PRESETS["realestate-luxury-estates-v1"];

export default function App(props) {
  return <RealEstateRenderer {...props} preset={preset} templateKey="realestate-luxury-estates-v1" />;
}
