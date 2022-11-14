import {Injectable} from '@angular/core';
import {ProductionInfo} from "../entity/production-info";

@Injectable({
  providedIn: 'root'
})
export class ProductionService {

  public data: ProductionInfo = new ProductionInfo();

  constructor() {
  }
}
