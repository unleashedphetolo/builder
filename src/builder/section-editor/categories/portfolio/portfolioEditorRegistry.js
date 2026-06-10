import PersonalProfileEditor from "./PersonalProfileEditor";
import SkillsEditor from "./SkillsEditor";
import ProjectsEditor from "./ProjectsEditor";
import ExperienceEditor from "./ExperienceEditor";

export const portfolioEditorRegistry = {
  portfolio_personal_profile: PersonalProfileEditor,
  personal_profile: PersonalProfileEditor,
  portfolio_skills: SkillsEditor,
  skills: SkillsEditor,
  portfolio_projects: ProjectsEditor,
  projects: ProjectsEditor,
  portfolio_experience: ExperienceEditor,
  experience: ExperienceEditor,
};

export default portfolioEditorRegistry;
