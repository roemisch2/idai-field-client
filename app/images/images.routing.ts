import {ModuleWithProviders} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";
import {ImagesComponent} from "./images.component";
import {ImagesGridComponent} from "./images-grid.component";
import {ImageViewComponent} from "./image-view.component";
import {ImageEditNavigationComponent} from "./image-edit-navigation.component";
import {ImageEditCanDeactivateGuard} from "./image-edit-can-deactivate-guard";

const routes: Routes = [
    {
        path: 'images',
        component: ImagesComponent,
        children: [
            {
                path: '',
                component: ImagesGridComponent
            },
            {
                path: ':id/show',
                component: ImageViewComponent
            },
            {
                path: ':id/edit',
                component: ImageEditNavigationComponent,
                canDeactivate: [ImageEditCanDeactivateGuard]
            }
        ]
    }
];

export const imagesRouting: ModuleWithProviders = RouterModule.forChild(routes);