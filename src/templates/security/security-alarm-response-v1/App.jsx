import SecurityRenderer from "../shared/SecurityRenderer";
import { SECURITY_PRESETS } from "../shared/securityPresets";
import "./theme.css";

export default function App(props) {
  return <SecurityRenderer {...props} preset={SECURITY_PRESETS["security-alarm-response-v1"]} />;
}
