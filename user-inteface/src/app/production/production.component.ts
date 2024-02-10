import {ANIMATION_MODULE_TYPE, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ResourceDataPercentage, ResourceInfo} from "../entity/resource-info";
import {PrecisionIndex} from "../entity/precision-index";
import {ProgressBarMode} from "@angular/material/progress-bar";
import {MatSort} from "@angular/material/sort";
import {DataSource} from "@angular/cdk/collections";
import {Observable, ReplaySubject} from "rxjs";
import {ProductionInfo} from "../entity/production-info";
import {AllDataService} from "../service/all-data.service";

@Component({
  selector: 'app-research',
  templateUrl: './production.component.html',
  styleUrls: ['./production.component.scss'],
  providers: [
    {provide: ANIMATION_MODULE_TYPE, useValue: 'BrowserAnimations'},
  ],
})
export class ProductionComponent implements OnInit, OnDestroy {

  constructor(private allDataService: AllDataService) {
  }

  data?: ProductionInfo = new ProductionInfo();

  @ViewChild('empTbSort') empTbSort = new MatSort();

  precisionIndexes = Object.values(PrecisionIndex);

  resourcesIn: ResourceDataPercentage[] = [];
  dataSourceIn = new ResourceDataSource(this.resourcesIn);

  resourcesOut: ResourceDataPercentage[] = [];
  dataSourceOut = new ResourceDataSource(this.resourcesIn);

  displayedColumns: string[] = ['resource-color', 'resource', 'amount'];

  precisionIndex: PrecisionIndex = PrecisionIndex.FIVE_SECONDS

  mode: ProgressBarMode = 'determinate'

  interval: any = null;

  ngOnInit(): void {
    this.interval = setInterval(() => {
      this.updateData()
    }, 250)
    this.dataSourceIn.setData(this.resourcesIn)
  }

  updateData() {
    this.data = this.allDataService.data.resourcesInfo;
    let dataIn: any = [];
    let dataOut: any = [];

    if (!this.data) return

    if (this.precisionIndex === PrecisionIndex.FIVE_SECONDS) {
      dataIn = this.data.fiveSecondResourcesIn;
      dataOut = this.data.fiveSecondResourcesOut;
    } else if (this.precisionIndex === PrecisionIndex.ONE_MINUTE) {
      dataIn = this.data.oneMinuteResourcesIn;
      dataOut = this.data.oneMinuteResourcesOut;
    } else if (this.precisionIndex === PrecisionIndex.TEN_MINUTES) {
      dataIn = this.data.tenMinutesResourcesIn;
      dataOut = this.data.tenMinutesResourcesOut;
    } else if (this.precisionIndex === PrecisionIndex.ONE_HOUR) {
      dataIn = this.data.oneHourResourcesIn;
      dataOut = this.data.oneHourResourcesOut;
    } else if (this.precisionIndex === PrecisionIndex.TEN_HOURS) {
      dataIn = this.data.tenHourResourcesIn;
      dataOut = this.data.tenHourResourcesOut;
    } else if (this.precisionIndex === PrecisionIndex.FIFTY_HOURS) {
      dataIn = this.data.fiftyHourResourcesIn;
      dataOut = this.data.fiftyHourResourcesOut;
    } else if (this.precisionIndex === PrecisionIndex.TWO_HUNDRED_FIFTY_HOURS) {
      dataIn = this.data.twoHundredFiftyHourResourcesIn;
      dataOut = this.data.twoHundredFiftyHourResourcesOut;
    } else if (this.precisionIndex === PrecisionIndex.ONE_THOUSAND_HOURS) {
      dataIn = this.data.thousandHourResourcesIn;
      dataOut = this.data.thousandHourResourcesOut;
    }

    let dataInPercentage = this.makePercentage(dataIn);
    let dataOutPercentage = this.makePercentage(dataOut);

    this.mergeLists(dataInPercentage, true);
    this.mergeLists(dataOutPercentage, false);

    this.clearEmptyRows(dataInPercentage, true);
    this.clearEmptyRows(dataOutPercentage, false);

    if (dataInPercentage && this.resourcesIn && dataInPercentage !== [] && this.resourcesIn !== []) this.dataSourceIn.setData(this.resourcesIn.sort((a, b) => a.percentages > b.percentages ? -1 : 1)
      .filter(value => value.amount > 0));
    if (dataOutPercentage && this.resourcesOut && dataOutPercentage !== [] && this.resourcesOut !== []) this.dataSourceOut.setData(this.resourcesOut.sort((a, b) => a.percentages > b.percentages ? -1 : 1)
      .filter(value => value.amount > 0));
  }

  mergeLists(resourceStatPercentage: ResourceDataPercentage[], isInput: boolean) {
    if (resourceStatPercentage === undefined) return
    resourceStatPercentage.forEach(value => {
      this.refreshData(value, isInput);
    })
  }

  clearEmptyRows(resourceStatPercentage: ResourceDataPercentage[], isInput: boolean) {
    if (resourceStatPercentage === undefined) return
    if (isInput) {
      this.resourcesIn.forEach((value, i) => {
        if (resourceStatPercentage.find(req => req.resource === value.resource) === undefined) {
          this.resourcesIn.splice(i, 1);
        }
      })
    } else {
      this.resourcesOut.forEach((value, i) => {
        if (resourceStatPercentage.find(req => req.resource === value.resource) === undefined) {
          this.resourcesOut.splice(i, 1);
        }
      })
    }
  }

  refreshData(resourceStatPercentage: ResourceDataPercentage, isInput: boolean) {
    let updated = false;
    if (isInput) {
      this.resourcesIn.forEach((value) => {
        if (value.resource === resourceStatPercentage.resource) {
          value.amount = resourceStatPercentage.amount
          value.percentages = resourceStatPercentage.percentages
          updated = true;
          return
        }
      });
      if (!updated) {
        this.resourcesIn.push(resourceStatPercentage);
      }
    } else {
      this.resourcesOut.forEach((value) => {
        if (value.resource === resourceStatPercentage.resource) {
          value.amount = resourceStatPercentage.amount
          value.percentages = resourceStatPercentage.percentages
          updated = true;
          return
        }
      });
      if (!updated) {
        this.resourcesOut.push(resourceStatPercentage);
      }
    }
  }

  makePercentage(dataRaw: ResourceInfo[]): ResourceDataPercentage[] {
    if (dataRaw === undefined || !Array.isArray(dataRaw)) return []
    let result: ResourceDataPercentage[] = [];
    dataRaw = dataRaw.sort((a, b) => Number(a.amount) > Number(b.amount) ? -1 : 1);
    let maxAmount = Number(dataRaw[0].amount);
    dataRaw.forEach(resource => result.push(new ResourceDataPercentage(resource.resource, resource.amount, Number(resource.amount) / maxAmount * 100)))

    return result
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }
}

class ResourceDataSource extends DataSource<ResourceDataPercentage> {
  private _dataStream = new ReplaySubject<ResourceDataPercentage[]>();

  constructor(initialData: ResourceDataPercentage[]) {
    super();
    this.setData(initialData);
  }

  connect(): Observable<ResourceDataPercentage[]> {
    return this._dataStream;
  }

  disconnect() {
  }

  setData(data: ResourceDataPercentage[]) {
    this._dataStream.next(data);
  }
}
