import TechnologyRenderer from "../shared/TechnologyRenderer";
import { TECHNOLOGY_PRESETS } from "../shared/technologyPresets";
import "./theme.css";

export default function App(props) {
  return <TechnologyRenderer {...props} preset={TECHNOLOGY_PRESETS["tech-ai-automation-v1"]} />;
}
