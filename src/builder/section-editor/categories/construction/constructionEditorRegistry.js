import CompanyProfileEditor from "./CompanyProfileEditor";
import ProjectsEditor from "./ProjectsEditor";
import EquipmentEditor from "./EquipmentEditor";
import CertificationsEditor from "./CertificationsEditor";
import SafetyEditor from "./SafetyEditor";

export const constructionEditorRegistry = {
  construction_company_profile: CompanyProfileEditor,
  company_profile: CompanyProfileEditor,
  construction_projects: ProjectsEditor,
  projects: ProjectsEditor,
  construction_equipment: EquipmentEditor,
  equipment: EquipmentEditor,
  construction_certifications: CertificationsEditor,
  certifications: CertificationsEditor,
  construction_safety: SafetyEditor,
  safety: SafetyEditor,
};

export default constructionEditorRegistry;
