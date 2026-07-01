import BeautyRenderer from "../shared/BeautyRenderer";
import templateConfig from "./template.config";
import "./theme.css";

export default function App(props) {
  return <BeautyRenderer {...props} templateKey={templateConfig.template_key} />;
}
