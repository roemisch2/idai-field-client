import {describe, expect, fit, it, xit, beforeEach} from '@angular/core/testing';
import {IdaiFieldObject} from "../app/model/idai-field-object";
import {RelationPickerGroupComponent} from "../app/components/relation-picker-group.component";

/**
 * @author Thomas Kleinke
 */
export function main() {
    describe('RelationPickerGroupComponent', () => {

        var object: IdaiFieldObject;
        var relationPickerGroupComponent: RelationPickerGroupComponent;

        beforeEach(() => {
            object = { "id": "id1", "identifier": "ob1", "title": "Object 1", "synced": 0, 
                "type": "Object" };

            relationPickerGroupComponent = new RelationPickerGroupComponent();
            relationPickerGroupComponent.object = object;
            relationPickerGroupComponent.field = { "field": "Above", "inverse": "Below" };
        });

        it('should create an empty relation array if no relation array exists and a new relation is created',
            function() {
                relationPickerGroupComponent.createRelation();

                expect(object["Above"].length).toBe(1);
                expect(object["Above"][0]).toBe("");
            }
        );
    });

}