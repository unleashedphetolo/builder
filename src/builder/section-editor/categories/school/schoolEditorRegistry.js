import WhoWeAreEditor from "./WhoWeAreEditor";
import VisionMissionEditor from "./VisionMissionEditor";
import PrincipalMessageEditor from "./PrincipalMessageEditor";
import AdmissionsLandingEditor from "./AdmissionsLandingEditor";
import HowToApplyEditor from "./HowToApplyEditor";
import EntryRequirementsEditor from "./EntryRequirementsEditor";
import ApplyOnlineEditor from "./ApplyOnlineEditor";
import SchoolCalendarEditor from "./SchoolCalendarEditor";
import DigitalLibraryEditor from "./DigitalLibraryEditor";
import StaffEditor from "./StaffEditor";
import SgbEditor from "./SgbEditor";

export const schoolEditorRegistry = {
  school_who_we_are: WhoWeAreEditor,
  school_about_landing: WhoWeAreEditor,
  school_about_who_we_are: WhoWeAreEditor,
  who_we_are: WhoWeAreEditor,

  school_vision_mission: VisionMissionEditor,
  school_about_values: VisionMissionEditor,
  vision_mission: VisionMissionEditor,
  vision_mission_values: VisionMissionEditor,

  school_principal_message: PrincipalMessageEditor,
  principal_message: PrincipalMessageEditor,

  school_admissions_landing: AdmissionsLandingEditor,
  school_admissions: AdmissionsLandingEditor,
  admissions_landing: AdmissionsLandingEditor,

  school_how_to_apply: HowToApplyEditor,
  how_to_apply: HowToApplyEditor,
  howtoapply: HowToApplyEditor,
  admissions_how_to_apply: HowToApplyEditor,

  school_entry_requirements: EntryRequirementsEditor,
  entry_requirements: EntryRequirementsEditor,
  admission_requirements: EntryRequirementsEditor,
  admissions_requirements: EntryRequirementsEditor,

  school_apply_online: ApplyOnlineEditor,
  school_apply: ApplyOnlineEditor,
  school_admissions_apply: ApplyOnlineEditor,
  apply_online: ApplyOnlineEditor,
  admissions_apply: ApplyOnlineEditor,

  school_calendar: SchoolCalendarEditor,
  school_events: SchoolCalendarEditor,
  school_all_events: SchoolCalendarEditor,
  school_term_plan: SchoolCalendarEditor,

  digital_library: DigitalLibraryEditor,
  school_digital_library: DigitalLibraryEditor,
  library_resources: DigitalLibraryEditor,

  school_staff: StaffEditor,
  staff: StaffEditor,

  school_sgb: SgbEditor,
  school_governing_body: SgbEditor,
  governance_sgb: SgbEditor,
  sgb: SgbEditor,
};

export default schoolEditorRegistry;
