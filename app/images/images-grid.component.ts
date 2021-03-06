import {Component, OnChanges, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {IdaiFieldDocument} from "../model/idai-field-document";
import {IndexeddbDatastore} from "../datastore/indexeddb-datastore";
import {Messages} from 'idai-components-2/messages';
import {M} from "../m";
import {Query,Filter} from "idai-components-2/datastore";
import {Mediastore} from "../datastore/mediastore";
import {DomSanitizer} from '@angular/platform-browser';
import {ImageTool,ImageContainer} from './image-tool';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
    moduleId: module.id,
    templateUrl: './images-grid.html'
})

/**
 * Displays images as a grid of tiles.
 *
 * @author Daniel de Oliveira
 * @author Sebastian Cuy
 */
export class ImagesGridComponent implements OnChanges, OnInit {

    private imageTool : ImageTool;
    
    private query : Query = { q: '' };
    private documents;
    protected defaultFilters: Array<Filter>;

    private nrOfColumns = 4;
    private rows = [];
    private selected = [];

    public constructor(
        private router: Router,
        private datastore: IndexeddbDatastore,
        private modalService: NgbModal,
        mediastore: Mediastore,
        sanitizer: DomSanitizer,
        messages: Messages
    ) {
        this.imageTool = new ImageTool(mediastore,sanitizer,messages);
        this.defaultFilters = [ { field: 'type', value: 'image', invert: false } ];
        this.query = { q: '', filters: this.defaultFilters };
    }

    public refreshGrid() {
        this.fetchDocuments(this.query);
    }

    public ngOnInit() {
        this.fetchDocuments(this.query);
    }

    public ngOnChanges() {
        this.fetchDocuments(this.query);
    }

    /**
     * Populates the document list with all documents from
     * the datastore which match a <code>query</code>
     * @param query
     */
    public fetchDocuments(query: Query) {

        this.datastore.find(query).then(documents => {

            this.documents = documents;

            // insert stub document for first cell that will act as drop area for uploading images
            this.documents.unshift({
                id: 'droparea',
                resource: { width: 1, height: 1 }
            });

            this.calcGrid();
            
        }).catch(err => console.error(err));
    }
    
    protected setUpDefaultFilters() {
        this.defaultFilters = [ { field: 'type', value: 'image', invert: false } ];
    }

    public queryChanged(query: Query) {

        this.query = query;
        // this.fetchDocuments(query);
    }

    public onResize() {
        this.calcGrid();
    }

    /*
     * Generate a row of images scaled to height 1 and sum up widths.
     */
    private calcNaturalRowWidth(documents,nrOfColumns,rowIndex) {

        var naturalRowWidth = 0;
        
        for (var columnIndex = 0; columnIndex < nrOfColumns; columnIndex++) {
            var document = documents[rowIndex * nrOfColumns + columnIndex];
            if (!document) {
                naturalRowWidth += naturalRowWidth * (nrOfColumns - columnIndex) / columnIndex;
                break;
            }
            naturalRowWidth += document.resource.width / parseFloat(document.resource.height);
        }
        
        return naturalRowWidth;
    }
    
    public calcGrid() {

        var rowWidth = Math.ceil((window.innerWidth - 57) );

        this.rows = [];
        var nrOfRows = Math.ceil(this.documents.length / this.nrOfColumns);

        for (var rowIndex = 0; rowIndex < nrOfRows; rowIndex++) {
            
            this.rows[rowIndex] = [];

            var calculatedHeight = rowWidth / this.calcNaturalRowWidth(this.documents,this.nrOfColumns,rowIndex);

            for (var columnIndex = 0; columnIndex < this.nrOfColumns; columnIndex++) {

                var document = this.documents[rowIndex * this.nrOfColumns + columnIndex];
                if (!document) break;

                var cell : ImageContainer = {};
                cell.document = document;
                cell.calculatedWidth = document.resource.width * calculatedHeight / document.resource.height;
                cell.calculatedHeight = calculatedHeight;
                if (document.resource.filename) this.imageTool.setImgSrc(cell);
                this.rows[rowIndex][columnIndex] = cell;
            }

        }

    }

    /**
     * @param documentToSelect the object that should be selected
     */
    public select(document: IdaiFieldDocument) {
        if (this.selected.indexOf(document) == -1) this.selected.push(document);
        else this.selected.splice(this.selected.indexOf(document), 1);
    }

    /**
     * @param documentToSelect the object that should be navigated to if the preconditions
     *   to change the selection are met.
     */
    public navigateTo(documentToSelect: IdaiFieldDocument) {
        this.router.navigate(['images', documentToSelect.resource.id, 'show']);
    }

    public clearSelection() {
        this.selected = [];
    }

    public openDeleteModal(modal) {
        this.modalService.open(modal).result.then(result => {
            if (result == 'delete') {
                var results = this.selected.map(document => this.delete(document));
                Promise.all(results).then(() => {
                    this.clearSelection();
                    this.fetchDocuments(this.query);
                });
            }
        });
    }

    private delete(document): Promise<any> {
        return new Promise((resolve) => {
            this.mediastore.remove(document.resource.filename).then(() => {
                this.datastore.remove(document.id).then(() => resolve()).catch(err => {
                    this.messages.add(M.IMAGES_ERROR_DELETE, [document.resource.filename]);
                    console.log(err);
                });
            }).catch(err => {
                this.messages.add(M.IMAGES_ERROR_DELETE, [document.resource.filename]);
                console.log(err);
            });
        });
    }
}
