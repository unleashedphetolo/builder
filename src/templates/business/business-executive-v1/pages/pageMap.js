import Home from "./Home";
import About from "./About";
import Services from "./Services";
import Portfolio from "./Portfolio";
import Insights from "./Insights";
import Contact from "./Contact";
import NotFound from "./NotFound";

export const businessPageMap = {
  "/": Home,
  "/about": About,
  "/services": Services,
  "/portfolio": Portfolio,
  "/insights": Insights,
  "/contact": Contact,
};

export { Home, About, Services, Portfolio, Insights, Contact, NotFound };
