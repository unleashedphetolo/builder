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
  who_we_are: WhoWeAreEditor,
  school_vision_mission: VisionMissionEditor,
  vision_mission: VisionMissionEditor,
  about_section: VisionMissionEditor,
  school_principal_message: PrincipalMessageEditor,
  principal_message: PrincipalMessageEditor,
  school_admissions_landing: AdmissionsLandingEditor,
  admissions: AdmissionsLandingEditor,
  school_how_to_apply: HowToApplyEditor,
  how_to_apply: HowToApplyEditor,
  school_entry_requirements: EntryRequirementsEditor,
  entry_requirements: EntryRequirementsEditor,
  school_apply_online: ApplyOnlineEditor,
  apply_online: ApplyOnlineEditor,
  school_calendar: SchoolCalendarEditor,
  calendar: SchoolCalendarEditor,
  digital_library: DigitalLibraryEditor,
  school_digital_library: DigitalLibraryEditor,
  school_staff: StaffEditor,
  staff: StaffEditor,
  school_sgb: SgbEditor,
  sgb: SgbEditor,
};

export default schoolEditorRegistry;
