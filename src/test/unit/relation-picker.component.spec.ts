import {describe, expect, fit, it, xit, beforeEach} from 'angular2/testing';
import {Datastore} from "../../main/app/datastore/datastore";
import {RelationPickerComponent} from "../../main/app/components/relation-picker.component";

/**
 * @author Thomas Kleinke
 */
export function main() {
    describe('RelationPickerComponent', () => {

        var object1: any;
        var object2: any;

        var relationPickerComponent: RelationPickerComponent;
        var mockDatastore: any;
        var mockParent: any;

        var element: any = {
            nativeElement: {
                getElementsByTagName: function(str) {
                    return [ { focus: function() {} }]
                }
            }
        };

        var get = function() {
            return {
                then: function(suc) {
                    suc(object2);
                    return {
                        catch: function() {}
                    }
                }
            };
        };

        var find = function() {
            return {
                then: function(suc) {
                    suc([object1, object2]);
                    return {
                        catch: function() {}
                    }
                }
            };
        };

        beforeEach(() => {
            object1 = { "id": "id1", "identifier": "ob1", "title": "Object 1", "synced": 0, "valid": true,
                "changed": false, "type": "Object", "Above": [] };

            object2 = { "id": "id2", "identifier": "ob2", "title": "Object 2", "synced": 0, "valid": true,
                "changed": false, "type": "Object", "Below": [] };

            mockDatastore = jasmine.createSpyObj('mockDatastore', [ 'get', 'find' ]);
            mockDatastore.get.and.callFake(get);
            mockDatastore.find.and.callFake(find);

            mockParent = jasmine.createSpyObj('mockParent', [ 'save' ]);

            relationPickerComponent = new RelationPickerComponent(element, mockDatastore);
            relationPickerComponent.object = object1;
            relationPickerComponent.field = { "field": "Above", "inverse": "Below" };
            relationPickerComponent.relationIndex = 0;
            relationPickerComponent.parent = { parent: mockParent };
        });

        it('should create a relation and the corresponding inverse relation if a target object is chosen',
            function() {
                relationPickerComponent.chooseTarget(object2);

                expect(object1["Above"].length).toBe(1);
                expect(object1["Above"][0]).toBe(object2.id);
                expect(object1.changed).toBe(true);

                expect(object2["Below"].length).toBe(1);
                expect(object2["Below"][0]).toBe(object1.id);
                expect(object2.changed).toBe(true);

                expect(mockParent.save).toHaveBeenCalled();
            }
        );

        it('should delete a relation and its corresponding inverse relation',
            function(done) {
                object1["Above"] = [ "id2" ];
                object2["Below"] = [ "id1" ];

                relationPickerComponent.deleteRelation().then(
                    () => {
                        expect(object1["Above"].length).toBe(0);
                        expect(object1.changed).toBe(true);

                        expect(object2["Below"].length).toBe(0);
                        expect(object2.changed).toBe(true);

                        expect(mockParent.save).toHaveBeenCalled();

                        done();
                    },
                    err => {
                        fail(err);
                        done();
                    }
                );
            }
        );

        it('should delete an empty relation without saving',
            function(done) {
                object1["Above"] = [ "" ];

                relationPickerComponent.deleteRelation().then(
                    () => {
                        expect(object1["Above"].length).toBe(0);
                        expect(object1.changed).toBe(false);

                        expect(mockParent.save).not.toHaveBeenCalled();

                        done();
                    },
                    err => {
                        fail(err);
                        done();
                    }
                );
            }
        );

    });
}