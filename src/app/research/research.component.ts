import {ANIMATION_MODULE_TYPE, Component, OnDestroy, OnInit} from '@angular/core';
import {ResearchService} from "../service/research.service";
import {ResearchInfo} from "../entity/research-info";
import {Research, ResearchStatus} from "../entity/research";
import {ProgressBarMode} from "@angular/material/progress-bar";
import {AllDataService} from "../service/all-data.service";

@Component({
  selector: 'app-research',
  templateUrl: './research.component.html',
  styleUrls: ['./research.component.scss'],
  providers: [
    {provide: ANIMATION_MODULE_TYPE, useValue: 'BrowserAnimations'},
  ],
})
export class ResearchComponent implements OnInit, OnDestroy {

  constructor(
    private researchService: ResearchService,
    private allDataService: AllDataService) {
  }


  mode: ProgressBarMode = 'determinate'
  interval: any = null;
  data?: ResearchInfo = this.allDataService.data.researchesInfo;
  technologiesMap: any = {}
  queueMap: any = {}

  currentResearch: any;
  currentResearchPre: any[] = [];

  scienceOrder: any = {
  "automation-science-pack": 0,
  "chemical-science-pack": 2,
  "logistic-science-pack": 8,
  "military-science-pack": 32,
  "production-science-pack": 64,
  "space-science-pack": 128,
  "utility-science-pack": 256
}

  ngOnInit(): void {
    setTimeout(() => {
      this.updateData()

      setTimeout(() => {
        if (this.data) {
          this.selectTechnology(this.data.technologies[0].index)
        }
      }, 500)
    }, 250)
    this.interval = setInterval(() => {
      this.updateData()
    }, 250)
  }

  startResearch() {
    let researchName = this.currentResearch.alias;
    if (this.currentResearch.researchStatus === 'cant-research'
    || this.currentResearch.researchStatus === 'researched'
    || this.queueMap[researchName]? 'disabled': 'enabled') {
      this.researchService.startResearch(researchName)
        .subscribe(res => console.log("started research of " + researchName));

    }

  }

  removeResearch(researchName: string) {
    this.researchService.removeResearch(researchName).subscribe(res => console.log("removed research of " + researchName));
  }

  private updateData() {
    this.data = this.allDataService.data.researchesInfo;
    if (this.researchService.researchData.queue === undefined) {
      this.researchService.researchData.queue = []
    }

    this.updateTechnologies();
  }

  selectTechnology(index: number) {
    if (this.data && this.data.technologies) {
      this.currentResearch = this.data.technologies.find(value => value.index === index)
      this.currentResearchPre = [];
      if (this.currentResearch.prerequisites) {
        this.currentResearch.prerequisites.forEach((name: string) => {
          let foundResearch = this.technologiesMap[name]
          if (foundResearch) {
            this.currentResearchPre.push(foundResearch)
          }
        })
      }
    }
  }

  updateTechnologies() {
    if (!this.data) return
    this.data.technologies.forEach(value => {
      // @ts-ignore
      this.technologiesMap[value.alias] = value
    })
    this.queueMap = {}

    if (!this.data.queue) this.data.queue = []
    this.data.queue.forEach(value => {
      // @ts-ignore

      this.queueMap[value.alias] = value
    })

    this.data.technologies.forEach(tech => {

      if (tech.researched) {
        tech.researchStatus = ResearchStatus.RESEARCHED;
      } else {
        let researchStatus = ResearchStatus.CAN_RESEARCH;

        tech.prerequisites.forEach(preTech => {
          if (!this.technologiesMap[preTech].researched && researchStatus !== ResearchStatus.CANT_RESEARCH) {
            researchStatus = ResearchStatus.CAN_RESEARCH_QUEUE;
            if (!this.queueMap[preTech]) {
              researchStatus = ResearchStatus.CANT_RESEARCH;
            }
          }
        })
        tech.researchStatus = researchStatus;
      }
    })

    let researchStatusComparingMap = {
      "researched": 3,
      "cant-research": 2,
      "can-research": 0,
      "can-research-queue": 1
    }
    this.data.technologies.sort((a, b) => {
      // add sorting by name and science
      let result = -1;
      if (researchStatusComparingMap[a.researchStatus] > researchStatusComparingMap[b.researchStatus]) {
        result = 1
      } else if (researchStatusComparingMap[a.researchStatus] == researchStatusComparingMap[b.researchStatus]) {
        if (a.scienceList.length > b.scienceList.length) {
          result = 1
        } else if (a.scienceList.length == b.scienceList.length) {
          let aScienceSum:any = 0;
          a.scienceList.forEach(aScience => {
            aScienceSum= aScienceSum + this.scienceOrder[aScience]
          })

          let bScienceSum:any = 0;
          b.scienceList.forEach(bScience => {
            bScienceSum= bScienceSum + this.scienceOrder[bScience]
          })

          if (aScienceSum > bScienceSum) {
            result = 1;
          } else if (aScienceSum == bScienceSum && a.alias > b.alias) {
            result = 1
          }
        }
      }


      return result
      // researchStatusComparingMap[a.researchStatus] > researchStatusComparingMap[b.researchStatus] ? 1 : -1)
    })

  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }

  tackTech(index: any, item: Research){
    return item.index;
  }
}
