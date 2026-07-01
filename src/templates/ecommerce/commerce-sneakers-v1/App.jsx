import EcommerceRenderer from "../shared/EcommerceRenderer";
import { ECOMMERCE_PRESETS } from "../shared/ecommercePresets";
import "./theme.css";

export default function App(props) {
  return <EcommerceRenderer {...props} preset={ECOMMERCE_PRESETS["commerce-sneakers-v1"]} />;
}
