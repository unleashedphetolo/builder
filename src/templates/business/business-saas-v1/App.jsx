import BusinessRenderer from "../shared/BusinessRenderer";
import { BUSINESS_PRESETS } from "../shared/businessPresets";
import "./theme.css";

export default function App(props) {
  return (
    <BusinessRenderer
      {...props}
      preset={BUSINESS_PRESETS["business-saas-v1"]}
    />
  );
}
