import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {imagesRouting} from "./images.routing";
import {ImagesComponent} from "./images.component";
import {ImageGridComponent} from "./image-grid.component";
import {ImageViewComponent} from "./image-view.component";
import {ImageMetadataComponent} from "./image-metadata.component";
import {ImageEditComponent} from "./image-edit.component";
import {WidgetsModule} from '../widgets/widgets.module';

@NgModule({
    imports: [
        BrowserModule,
        imagesRouting,
        WidgetsModule
    ],
    declarations: [
        ImagesComponent,
        ImageGridComponent,
        ImageViewComponent,
        ImageEditComponent,
        ImageMetadataComponent
    ]
})

export class ImagesModule {}