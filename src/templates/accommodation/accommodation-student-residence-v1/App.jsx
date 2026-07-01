import AccommodationRenderer from "../shared/AccommodationRenderer";
import templateConfig from "./template.config";
import "./theme.css";

export default function App(props) {
  return <AccommodationRenderer {...props} templateKey={templateConfig.template_key} />;
}
