import {Injectable} from '@angular/core';
import {ResearchInfo} from "../entity/research-info";
import {Observable} from "rxjs";
import {HttpClient, HttpResponse} from "@angular/common/http";

export class Message {
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ResearchService{


  public researchData: ResearchInfo = new ResearchInfo();
  private baseUrl = '/research';

  constructor(private http:HttpClient) {
  }

  startResearch(researchName: string): Observable<HttpResponse<Message>> {
    return this.http.post<HttpResponse<Message>>(`${this.baseUrl}`+'/start', researchName);
  }

  removeResearch(researchName: string): Observable<HttpResponse<Message>> {
    return this.http.post<HttpResponse<Message>>(`${this.baseUrl}`+'/remove', researchName);
  }
}
