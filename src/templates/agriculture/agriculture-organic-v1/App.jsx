import AgricultureRenderer from "../shared/AgricultureRenderer";
import { AGRICULTURE_PRESETS } from "../shared/agriculturePresets";
import "./theme.css";

const PRESET = AGRICULTURE_PRESETS["agriculture-organic-v1"];

export default function App({ settings = {}, page }) {
  return <AgricultureRenderer settings={settings} page={page} preset={PRESET} />;
}
