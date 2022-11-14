import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ResearchComponent} from "./research/research.component";
import {ProductionComponent} from "./production/production.component";

const routes: Routes = [
  { path: 'production', component: ProductionComponent },
  { path: 'technologies', component: ResearchComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
