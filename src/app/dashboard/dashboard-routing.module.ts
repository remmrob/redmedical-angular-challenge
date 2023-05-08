import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DashboardComponent} from './dashboard.component';
import {SearchFacadeService} from "@red-probeaufgabe/search";

const routes: Routes = [
    {
        path: '',
        component: DashboardComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    // Added the SearchFacadeService as provider here
    providers: [SearchFacadeService],
    exports: [RouterModule],
})
export class DashboardRoutingModule {
}
