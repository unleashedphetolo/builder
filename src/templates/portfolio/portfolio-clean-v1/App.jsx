import PortfolioRenderer from "../shared/PortfolioRenderer";
import { PORTFOLIO_PRESETS } from "../shared/portfolioPresets";
import "./theme.css";

export default function App(props) {
  return <PortfolioRenderer {...props} preset={PORTFOLIO_PRESETS["portfolio-clean-v1"]} />;
}
