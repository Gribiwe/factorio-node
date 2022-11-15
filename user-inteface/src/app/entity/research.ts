export enum ResearchStatus {
  RESEARCHED= "researched",
  CANT_RESEARCH= "cant-research",
  CAN_RESEARCH= "can-research",
  CAN_RESEARCH_QUEUE= "can-research-queue",
}

export class Research {
  index: number = 0
  canBeResearched: boolean = false
  prerequisites: string[] = []
  researched: boolean = false
  researchStatus: ResearchStatus = ResearchStatus.CAN_RESEARCH
  alias: string = ""
  level: number = 0
  researchUnitCount: number = 0
  scienceList: string[] = []

  constructor(index: number, canBeResearched: boolean, researchStatus: ResearchStatus, prerequisites: string[], researched: boolean, alias: string, level: number, researchUnitCount: number, scienceList: string[]) {
    this.index = index;
    this.canBeResearched = canBeResearched;
    this.researchStatus = researchStatus;
    this.researched = researched;
    this.prerequisites = prerequisites;
    this.alias = alias;
    this.level = level;
    this.researchUnitCount = researchUnitCount;
    this.scienceList = scienceList;
  }
}
