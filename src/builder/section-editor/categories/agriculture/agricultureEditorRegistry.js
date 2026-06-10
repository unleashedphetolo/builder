import FarmProfileEditor from "./FarmProfileEditor";
import CropsEditor from "./CropsEditor";
import LivestockEditor from "./LivestockEditor";
import HarvestEditor from "./HarvestEditor";
import ProduceEditor from "./ProduceEditor";

export const agricultureEditorRegistry = {
  agriculture_farm_profile: FarmProfileEditor,
  farm_profile: FarmProfileEditor,
  agriculture_crops: CropsEditor,
  crops: CropsEditor,
  agriculture_livestock: LivestockEditor,
  livestock: LivestockEditor,
  agriculture_harvest: HarvestEditor,
  harvest: HarvestEditor,
  agriculture_produce: ProduceEditor,
  produce: ProduceEditor,
};

export default agricultureEditorRegistry;
