import CompanyProfileEditor from "./CompanyProfileEditor";
import ServicesEditor from "./ServicesEditor";
import TeamEditor from "./TeamEditor";
import ClientsEditor from "./ClientsEditor";
import ContactBusinessEditor from "./ContactBusinessEditor";

export const businessEditorRegistry = {
  business_company_profile: CompanyProfileEditor,
  company_profile: CompanyProfileEditor,
  business_services: ServicesEditor,
  services: ServicesEditor,
  business_team: TeamEditor,
  team: TeamEditor,
  business_clients: ClientsEditor,
  clients: ClientsEditor,
  business_contact: ContactBusinessEditor,
  contact: ContactBusinessEditor,
};

export default businessEditorRegistry;
