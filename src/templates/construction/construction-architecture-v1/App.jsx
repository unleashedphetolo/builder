import ConstructionRenderer from "../shared/ConstructionRenderer";
import { CONSTRUCTION_PRESETS } from "../shared/constructionPresets";
import "./theme.css";

export default function App(props) {
  return (
    <ConstructionRenderer
      {...props}
      preset={CONSTRUCTION_PRESETS["construction-architecture-v1"]}
    />
  );
}
