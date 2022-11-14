import {ResearchInfo} from "./research-info";
import {ProductionInfo} from "./production-info";

export class AllData {
  researchesInfo?: ResearchInfo
  resourcesInfo?: ProductionInfo

  constructor(researchesInfo?: ResearchInfo, resourcesInfo?: ProductionInfo) {
    this.researchesInfo = researchesInfo;
    this.resourcesInfo = resourcesInfo;
  }
}
