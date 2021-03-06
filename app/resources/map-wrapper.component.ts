import {Component, OnInit, OnDestroy} from "@angular/core";
import {Router, ActivatedRoute, Params} from "@angular/router";
import {ResourcesComponent} from "./resources.component";
import {ReadDatastore} from "idai-components-2/datastore";
import {PersistenceManager, ConfigLoader, WithConfiguration} from "idai-components-2/documents";
import {Document} from "idai-components-2/core";
import {IdaiFieldGeometry} from "../model/idai-field-geometry";

@Component({
    moduleId: module.id,
    templateUrl: './map-wrapper.html'
})

/**
 * @author Daniel de Oliveira
 * @author Thomas Kleinke
 * @author Sebastian Cuy
 */
export class MapWrapperComponent extends WithConfiguration implements OnInit, OnDestroy {

    private activeDoc;
    private activeType;
    private activeTypeLabel;
    private docs;
    private menuMode: string; // view | geometryEdit
    private editMode: string; // polygon | point | none

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private datastore: ReadDatastore,
        private overviewComponent: ResourcesComponent,
        private configLoader: ConfigLoader,
        private persistenceManager: PersistenceManager
    ) {
        super(configLoader);
    }

    // TODO remove duplicate code
    public selectRelatedDocument(documentToJumpTo) {

        this.router.navigate(['resources',{ id: documentToJumpTo.resource.id }])

    } public selectDocument(document: Document) {

        if (document) {
            this.router.navigate(['resources', { id: document.resource.id }]);
        } else {
            this.router.navigate(['resources']);
        }
    }

    private getRouteParams(callback) {

        this.route.params.forEach((params: Params) => {
            var type = undefined;
            var id = undefined;
            if (params['id'] && params['id'].indexOf('new') > -1) {
                type = params['id'].substring(params['id'].indexOf(":") + 1);
            } else {
                id = params['id'];
            }
            callback(params['menuMode'], params['editMode'], id, type);
        });
    }

    private setMenuMode(menuMode) {
        if (menuMode) {
            this.menuMode = menuMode;
        } else {
            this.menuMode = "view";
        }
    }

    private setEditMode(editMode) {
        if (editMode) {
            this.editMode = editMode;
            this.removeEmptyDocument();
        } else {
            this.editMode = "none";
        }
    }
    
    private setActiveDoc(id) {
        if (id) {
            this.datastore.get(id).then(document => {
                this.activeDoc = document;
                this.activeType = document.resource.type;
                this.activeTypeLabel = this.projectConfiguration.getLabelForType(this.activeType);
                this.overviewComponent.setSelected(<Document>document);
            });
        } else {
            this.activeDoc = null;
            this.overviewComponent.setSelected(null);
        }   
    }

    ngOnInit(): void {

        this.overviewComponent.getDocuments().subscribe(result => {
           this.docs = result;
        });

        this.getRouteParams(function(menuMode, editMode, id, type){

            this.setMenuMode(menuMode);
            this.setEditMode(editMode);

            if (type) {
                this.overviewComponent.createNewDocument(type);
            } else {
                this.setActiveDoc(id);
            }
        }.bind(this));
    }
    


    private selectedDocIsNew() : boolean {
        return (this.overviewComponent.getSelected().resource.id == undefined);
    }

    /**
     * @param geometry <coce>null</code> indicates geometry 
     *   should get deleted, <code>undefined</code> indicates editing operation aborted.
     */
    public quitEditing(geometry: IdaiFieldGeometry) {

        if (geometry) {
            this.overviewComponent.getSelected().resource.geometries = [ geometry ];
        } else if (geometry === null) { 
            delete this.overviewComponent.getSelected().resource.geometries;
        }

        if (this.selectedDocIsNew()) {
            
            if (geometry === undefined) {
                this.router.navigate(['resources'])
            } else {
                this.router.navigate(['resources', 'selected', 'edit']);
            }
            
        } else {
            
            if (geometry !== undefined) this.save();
            this.router.navigate(['resources', {id: this.overviewComponent.getSelected().resource.id}]);
        }
    }
    
    ngOnDestroy(): void {

        this.removeEmptyDocument();
    }

    private removeEmptyDocument() {
        
        var selectedDocument = this.overviewComponent.getSelected();
        if (selectedDocument && !selectedDocument.resource.id && !selectedDocument.resource.geometries) {
            this.overviewComponent.remove(selectedDocument);
        }
    }

    private save() {

        this.persistenceManager.setOldVersion(this.overviewComponent.getSelected());

        this.persistenceManager.persist(this.overviewComponent.getSelected()).then(
            () => {
                this.overviewComponent.getSelected()['synced'] = 0;
            },
            errors => { console.log(errors); });
    }
}
