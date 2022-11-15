import {Injectable} from "@angular/core";

import { webSocket } from "rxjs/webSocket";
import {AllData} from "../entity/all-data";

var loc = window.location, new_uri;
if (loc.protocol === "https:") {
  new_uri = "wss:";
} else {
  new_uri = "ws:";
}
var host = loc.host

var doubleDotPos = host.indexOf(":");
new_uri += "//" + (doubleDotPos !== -1 ? host.substring(0, doubleDotPos): host) + ":7071";
const subject = webSocket(new_uri);

@Injectable({
  providedIn: 'root'
})
export class AllDataService {

  public data: AllData = new AllData()

  constructor() {
    subject.asObservable().subscribe(
      (msg: any) => {
        if (msg.resourcesStat) {
          this.data.resourcesInfo = msg.resourcesStat
        }
        if (msg.researchesInfo) {
          this.data.researchesInfo = msg.researchesInfo
        }
      },
      err => console.log(err),
      () => console.log('complete')
    );
  }
}
