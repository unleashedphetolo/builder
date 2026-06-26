import EngineeringRenderer from "../shared/EngineeringRenderer";
import { ENGINEERING_PRESETS } from "../shared/engineeringPresets";
import "./theme.css";

const PRESET = ENGINEERING_PRESETS["engineering-industrial-v1"];

export default function App({ settings = {}, page, ...rest }) {
  return <EngineeringRenderer {...rest} settings={settings} page={page} preset={PRESET} />;
}
