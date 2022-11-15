import {ResourceInfo} from "./resource-info";

export class ProductionInfo {
  fiveSecondResourcesIn?: ResourceInfo[] = [];
  oneMinuteResourcesIn?: ResourceInfo[] = [];
  tenMinutesResourcesIn?: ResourceInfo[] = [];
  oneHourResourcesIn?: ResourceInfo[] = [];
  tenHourResourcesIn?: ResourceInfo[] = [];
  fiftyHourResourcesIn?: ResourceInfo[] = [];
  twoHundredFiftyHourResourcesIn?: ResourceInfo[] = [];
  thousandHourResourcesIn?: ResourceInfo[] = [];

  fiveSecondResourcesOut?: ResourceInfo[] = [];
  oneMinuteResourcesOut?: ResourceInfo[] = [];
  tenMinutesResourcesOut?: ResourceInfo[] = [];
  oneHourResourcesOut?: ResourceInfo[] = [];
  tenHourResourcesOut?: ResourceInfo[] = [];
  fiftyHourResourcesOut?: ResourceInfo[] = [];
  twoHundredFiftyHourResourcesOut?: ResourceInfo[] = [];
  thousandHourResourcesOut?: ResourceInfo[] = [];
}
