import HealthRenderer from "../shared/HealthRenderer";
import { HEALTH_PRESETS } from "../shared/healthPresets";
import "./theme.css";

const PRESET = HEALTH_PRESETS["health-physio-v1"];

export default function App({ settings = {}, page }) {
  return <HealthRenderer settings={settings} page={page} preset={PRESET} />;
}
