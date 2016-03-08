import {Component, Input, OnChanges, ElementRef} from 'angular2/core';
import {CORE_DIRECTIVES,COMMON_DIRECTIVES,FORM_DIRECTIVES} from "angular2/common";
import {Datastore} from '../datastore/datastore';
import {IdaiFieldObject} from '../model/idai-field-object';
import {Relation} from "../model/relation";


/**
 * @author Jan G. Wieners
 * @author Thomas Kleinke
 * @author Daniel M. de Oliveira
 */
@Component({

    selector: 'relation-picker',
    templateUrl: 'templates/relation-picker.html',
    directives: [CORE_DIRECTIVES, COMMON_DIRECTIVES, FORM_DIRECTIVES]
})

export class RelationPickerComponent implements OnChanges {

    private types: string[] = [
        "Part of",
        "Similar to",
        "Below",
        "Above",
        "Next to"
    ];

    @Input() relation: Relation;
    @Input() objectId: string;
    @Input() parent: any;

    suggestions: IdaiFieldObject[];
    selectedTarget: IdaiFieldObject;
    idSearchString: string;
    suggestionsVisible: boolean;

    constructor(private element: ElementRef, private datastore: Datastore) {}


    public ngOnChanges() {

        this.suggestions = [];
        this.idSearchString = "";
        this.selectedTarget = undefined;

        if (this.relation.id) {
            this.datastore.get(this.relation.id).then(
                (object) => {
                    this.selectedTarget = object;
                },
                err => {
                    // TODO
                    // Error handling
                }
            );
        }
    }

    public search() {

        this.relation.id = undefined;

        if (this.idSearchString.length > 0) {
            this.datastore.find(this.idSearchString, {})
                .then(objects => {
                    this.suggestions = [];
                    for (var i in objects) {
                        if (this.suggestions.length == 5)
                            break;
                        if (this.objectId != objects[i].id)
                            this.suggestions.push(objects[i]);
                    }
                }).catch(err =>
                console.error(err));
        } else
            this.suggestions = [];
    }

    public chooseTarget(target: IdaiFieldObject) {

        this.relation.id = target.id;
        this.selectedTarget = target;
        this.idSearchString = "";
        this.suggestions = [];
        this.parent.triggerAutosave();
    }

    public editTarget() {

        this.idSearchString = this.selectedTarget.identifier;
        this.suggestions = [ this.selectedTarget ];
        this.selectedTarget = undefined;

        setTimeout(this.focusInputField.bind(this), 100);
    }

    public showSuggestions() {

        this.suggestionsVisible = true;
    }

    public hideSuggestions() {

        this.suggestionsVisible = false;
    }

    public focusInputField() {

        this.element.nativeElement.getElementsByTagName("input").item(0).focus();
    }

}