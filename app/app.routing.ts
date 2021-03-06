import {Routes,RouterModule} from '@angular/router';

import {ImportComponent} from './import/import.component';
import {ResourceEditCanDeactivateGuard}  from './resources/resource-edit-can-deactivate-guard';
import {ImageEditCanDeactivateGuard}  from './images/image-edit-can-deactivate-guard';

const routes: Routes = [
    { path: '', redirectTo: 'resources', pathMatch: 'full' },
    { path: 'import', component: ImportComponent }
];

export const appRoutingProviders: any[] = [
    ResourceEditCanDeactivateGuard,
    ImageEditCanDeactivateGuard
];

export const routing = RouterModule.forRoot(routes);