import {Component, OnInit, Inject, Input, OnChanges, Output, EventEmitter, ChangeDetectorRef, ViewChild} from '@angular/core';
import {IdaiFieldDocument} from '../model/idai-field-document';
import {DocumentEditComponent} from "idai-components-2/idai-components-2";
import {AppComponent} from "../app.component";
import {ObjectList} from "./objectList";
import {Messages} from "idai-components-2/idai-components-2";
import {M} from "../m";
import {ConfigLoader} from "idai-components-2/idai-components-2";
import {DocumentEditChangeMonitor} from "idai-components-2/idai-components-2";
import {PersistenceManager} from "idai-components-2/idai-components-2";
import {Validator} from "../model/validator";
import {MODAL_DIRECTIVES, ModalComponent} from 'ng2-bs3-modal/ng2-bs3-modal';

@Component({
    templateUrl: 'templates/overview.html',
    directives: [DocumentEditComponent, MODAL_DIRECTIVES],
})

/**
 * @author Sebastian Cuy
 * @author Daniel de Oliveira
 * @author Jan G. Wieners
 * @author Thomas Kleinke
 */
export class OverviewComponent implements OnInit {

    @ViewChild('modal')
    modal: ModalComponent;

    /**     
     * The object currently selected in the list and shown in the edit component.
     */
    private selectedDocument: IdaiFieldDocument;

    constructor(@Inject('app.config') private config,
        private objectList: ObjectList,
        private configLoader: ConfigLoader,
        private messages: Messages,
        private documentEditChangeMonitor:DocumentEditChangeMonitor,
        private validator:Validator,
        private persistenceManager:PersistenceManager) {
    }

    /**
     * Function to call if preconditions to change are met.
     */
    private changeSelectionAllowedCallback;

    /**
     * Checks if the preconditions are given to change the focus from
     * <code>currentlySelectedDocument</code> to another object.
     *
     * @param currentlySelectedDocument the document which is still selected,
     *   but will be unselected if a change of selection is allowed
     * @returns {any}
     */
    private checkChangeSelectionAllowed(currentlySelectedDocument) {

        this.messages.clear();
        if (!this.documentEditChangeMonitor.isChanged())
            return this.discardChanges(currentlySelectedDocument);
        this.modal.open();
    }

    public save(doc:IdaiFieldDocument,withCallback:boolean=true) {

        var errors=this.validator.validate(doc);
        if (errors!=undefined) {
            return this.messages.add(errors);
        }

        doc['synced'] = 0;

        this.persistenceManager.persist(doc).then(
            ()=>{
                this.documentEditChangeMonitor.reset();
                this.messages.add(M.OBJLIST_SAVE_SUCCESS);
                if (withCallback) this.changeSelectionAllowedCallback();
            },
            errors=>{
                for (var err of errors) {
                    this.messages.add(err);
                }
            });
    }

    /**
     * Discards changes of the document. Depending on whether it is a new or existing
     * object, it will either restore it or remove it from the list.
     *
     * @param document
     */
    public discardChanges(document) {

        this.objectList.restore(document).then(() => {
            this.documentEditChangeMonitor.reset();
            this.changeSelectionAllowedCallback();
        }, (err) => {
            this.messages.add(err);
        });
    }

    private setConfigs() {
        this.configLoader.setProjectConfiguration(AppComponent.PROJECT_CONFIGURATION_PATH);
        this.configLoader.setRelationsConfiguration(AppComponent.RELATIONS_CONFIGURATION_PATH);
    }

    private registerSelectionCallbackForExisting(documentToSelect) {
        return function() {
            this.selectedDocument=documentToSelect;
        }.bind(this);
    }

    private registerSelectionCallbackForNew() {
        return function() {
            this.selectedDocument = this.objectList.createNewDocument();
        }.bind(this);
    }

    /**
     * @param documentToSelect the object that should get selected if the precondtions
     *   to change the selection are met.
     *   undefined if a new object is to be created if the preconditions
     *   to change the selection are met.
     */
    public select(documentToSelect: IdaiFieldDocument) {

        if (documentToSelect) {
            if (documentToSelect == this.selectedDocument) return;
            this.changeSelectionAllowedCallback=this.registerSelectionCallbackForExisting(documentToSelect);
        }
        else this.changeSelectionAllowedCallback=this.registerSelectionCallbackForNew();

        this.checkChangeSelectionAllowed(this.selectedDocument);
    }

    public ngOnInit() {
        this.setConfigs();
        if (this.config.environment == "test") {
            setTimeout(() => this.objectList.fetchAllDocuments(), 500);
        } else {
            this.objectList.fetchAllDocuments();
        }
    }

    onKey(event:any) {
        this.objectList.fetchSomeDocuments(event.target.value);
    }
}