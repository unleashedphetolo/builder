import SolutionsEditor from "./SolutionsEditor";
import ProductsEditor from "./ProductsEditor";
import CaseStudiesEditor from "./CaseStudiesEditor";
import IntegrationsEditor from "./IntegrationsEditor";

export const technologyEditorRegistry = {
  technology_solutions: SolutionsEditor,
  solutions: SolutionsEditor,
  technology_products: ProductsEditor,
  products: ProductsEditor,
  technology_case_studies: CaseStudiesEditor,
  case_studies: CaseStudiesEditor,
  technology_integrations: IntegrationsEditor,
  integrations: IntegrationsEditor,
};

export default technologyEditorRegistry;
