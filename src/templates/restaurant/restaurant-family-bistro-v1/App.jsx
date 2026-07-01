import RestaurantRenderer from "../shared/RestaurantRenderer";
import templateConfig from "./template.config";
import "./theme.css";

export default function App(props) {
  return <RestaurantRenderer {...props} templateKey={templateConfig.template_key} />;
}
