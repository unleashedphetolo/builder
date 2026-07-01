import RealEstateRenderer from "../shared/RealEstateRenderer";
import { REAL_ESTATE_PRESETS } from "../shared/realEstatePresets";
import "./theme.css";

const preset = REAL_ESTATE_PRESETS["realestate-student-accommodation-v1"];

export default function App(props) {
  return <RealEstateRenderer {...props} preset={preset} templateKey="realestate-student-accommodation-v1" />;
}
