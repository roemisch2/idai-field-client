import {Injectable} from "angular2/core";
import {IdaiFieldObject} from "../model/idai-field-object";
import {Datastore} from "./datastore";
import {Messages} from "./messages";

/**
 * @author Thomas Kleinke
 * @author Daniel M. de Oliveira
 * @author Jan G. Wieners
 */
@Injectable()

export class ObjectList {

    constructor(private datastore: Datastore,
                private messages: Messages) {}

    /**
     * The Object currently selected in the list and shown in the edit component.
     */
    private selectedObject: IdaiFieldObject;

    /**
     * Indicates that the current instance of the selectedObject differs from the one
     * saved in the local datastore.
     */
    private changed: boolean;

    /**
     * The object under creation which has not been yet put to the list permanently.
     * As soon as it is validated successfully newObject is set to "undefined" again.
     */
    private newObject: any;

    private objects: IdaiFieldObject[];

    public validateAndSave(object: IdaiFieldObject, restoreIfInvalid: boolean) {

        if (!object) return;

        if (this.changed) {
            this.save(object).then(
                () => {
                    this.messages.deleteMessages();
                },
                err => {
                    this.messages.addMessage('danger', 'Object Identifier already exists.');
                    object.valid = false;
                    // TODO restore old object
                    if (restoreIfInvalid) {
                        this.restoreObject(object);
                    }
                }
            )
        } else if (!object.valid && restoreIfInvalid) {
            this.restoreObject(object);
        }
    }

    /**
     * Saves the object to the local datastore.
     * @param object
     */
    private save(object: IdaiFieldObject): any {

        // Replace with proper validation
        if (!object.identifier || object.identifier.length == 0)
            return;

        this.changed = false;
        object.synced = 0;

        object.valid=true;
        if (object.id) {
            return this.update(object);
        } else {
            return this.create(object);
        }
    }

    /**
     * Updates an existing object in the local datastore.
     * @param object
     */
    private update(object: IdaiFieldObject) : any {
        return this.datastore.update(object);
    }

    /**
     * Saves the given object as a new object in the local datastore.
     * @param object
     */
    private create(object: IdaiFieldObject) : any {
        return this.datastore.create(object);
    }

    private restoreObject(object:IdaiFieldObject) {

        this.datastore.refresh(object.id).then(
            restoredObject => {
                var index = this.objects.indexOf(object);
                this.objects[index] = restoredObject;
            },
            err => {
                // TODO
            }
        );
    }

    public getObjects() {
        return this.objects;
    }

    public setObjects(objects: IdaiFieldObject[]) {
        this.objects = objects;
    }

    public getNewObject() {
        return this.newObject;
    }

    public setNewObject(object: any) {
        this.newObject = object;
    }

    public getSelectedObject() {
        return this.selectedObject;
    }

    public setSelectedObject(object: IdaiFieldObject) {

        this.validateAndSave(this.selectedObject, true);
        this.selectedObject = object;
    }

    public setChanged() {
        this.changed = true;
    }
}