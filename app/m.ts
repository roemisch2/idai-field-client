import {Injectable} from "@angular/core";
import {MD,Message} from "idai-components-2/messages"

/**
 * @author Daniel de Oliveira
 * @author Jan G. Wieners
 */
@Injectable()
export class M extends MD { // = Messages Dictionary. For reasons of brevity of calls to it just "M".

    public static IMPORTER_START : string = 'importer/start';
    public static IMPORTER_GENERIC_START_ERROR: string = 'importer/genericstarterror';
    public static IMPORTER_SUCCESS_SINGLE : string = 'importer/success/single';
    public static IMPORTER_SUCCESS_MULTIPLE : string = 'importer/success/multiple';
    public static IMPORTER_FAILURE_FILEUNREADABLE : string = 'importer/failure/fileunreadable';
    public static IMPORTER_FAILURE_INVALIDJSON : string = 'importer/failure/invalidjson';
    public static IMPORTER_FAILURE_INVALIDCSV: string = 'importer/failure/invalidcsv';
    public static IMPORTER_FAILURE_GENERICCSVERROR: string = 'importer/failure/genericcsverror';
    public static IMPORTER_FAILURE_MANDATORYCSVFIELDMISSING: string = 'importer/failure/mandatorycsvfieldmissing';
    public static IMPORTER_FAILURE_IDEXISTS: string = 'importer/failure/idexists';
    public static IMPORTER_FAILURE_IDMISSING: string = 'importer/failure/idmissing';
    public static IMPORTER_FAILURE_GENERICDATASTOREERROR: string = 'importer/failure/genericdatastoreerrror';
    public static IMPORTER_FAILURE_INVALIDTYPE: string = 'importer/failure/invalidtype';
    public static IMPORTER_FAILURE_INVALIDFIELD: string = 'importer/failure/invalidfield';
    public static IMPORTER_FAILURE_INVALIDFIELDS: string = 'importer/failure/invalidfields';
    public static OVERVIEW_SAVE_SUCCESS : string = 'overview/savesuccess';
    public static DATASTORE_IDEXISTS : string = 'datastore/idexists';
    public static DATASTORE_GENERIC_SAVE_ERROR : string = 'datastore/genericsaveerror';
    public static MESSAGES_NOBODY : string = 'messages/nobody';
    public static PC_GENERIC_ERROR : string = 'pmc/generic';
    public static PARSE_GENERIC_ERROR : string = 'parse/generic';
    public static VALIDATION_ERROR_IDMISSING : string = 'validation/error/idmissing';
    public static VALIDATION_ERROR_INVALIDTYPE: string = 'validation/error/invalidtype';
    public static VALIDATION_ERROR_INVALIDFIELD: string = 'validation/error/invalidfield';
    public static VALIDATION_ERROR_INVALIDFIELDS: string = 'validation/error/invalidfields';
    public static CONFIG_VALIDATION_IMAGE_MISSING: string = 'config/validation/error/imagemissing';
    public static IMAGES_ERROR_FILEREADER: string = 'images/error/filereader';
    public static IMAGES_ERROR_MEDIASTORE_READ: string = 'images/error/mediastore/read';
    public static IMAGES_ERROR_MEDIASTORE_WRITE: string = 'images/error/mediastore/write';
    public static IMAGES_ERROR_DELETE: string = 'images/error/delete';

    public msgs : { [id: string]: Message } = {};

    constructor() {
        super();
        this.msgs[M.IMPORTER_START]={
            content: 'Starte Import...',
            level: 'info',
            params: []
        };
        this.msgs[M.IMPORTER_GENERIC_START_ERROR]={
            content: 'Import kann nicht gestartet werden.',
            level: 'danger',
            params: []
        };
        this.msgs[M.IMPORTER_SUCCESS_SINGLE]={
            content: 'Eine Ressource wurde erfolgreich importiert.',
            level: 'success',
            params: []
        };
        this.msgs[M.IMPORTER_SUCCESS_MULTIPLE]={
            content: '{0} Ressourcen wurden erfolgreich importiert.',
            level: 'success',
            params: [ "Mehrere"]
        };
        this.msgs[M.IMPORTER_FAILURE_FILEUNREADABLE]={
            content: 'Beim Import ist ein Fehler aufgetreten: Die Datei {0} konnte nicht gelesen werden.',
            level: 'danger',
            params: [ "" ]
        };
        this.msgs[M.IMPORTER_FAILURE_INVALIDJSON]={
            content: 'Beim Import ist ein Fehler aufgetreten: Das JSON in Zeile {0} ist nicht valide.',
            level: 'danger',
            params: [ "?" ]
        };
        this.msgs[M.IMPORTER_FAILURE_INVALIDCSV]={
            content: 'Beim Import ist ein Fehler aufgetreten: Das CSV in Zeile {0} konnte nicht gelesen werden.',
            level: 'danger',
            params: [ "?" ]
        };
        this.msgs[M.IMPORTER_FAILURE_GENERICCSVERROR]={
            content: 'Beim Import ist ein Fehler aufgetreten: Die CSV-Daten konnten nicht gelesen werden.',
            level: 'danger',
            params: []
        };
        this.msgs[M.IMPORTER_FAILURE_MANDATORYCSVFIELDMISSING]={
            content: 'Beim Import ist ein Fehler aufgetreten: In Zeile {0} fehlt das Pflichtfeld \"{1}\".',
            level: 'danger',
            params: [ "?", "?" ]
        };
        this.msgs[M.IMPORTER_FAILURE_IDEXISTS]={
            content: 'Beim Import ist ein Fehler aufgetreten: Ressourcen-Identifier {0} existiert bereits.',
            level: 'danger',
            params: [ "" ]
        };
        this.msgs[M.IMPORTER_FAILURE_GENERICDATASTOREERROR]={
            content: 'Beim Import ist ein Fehler aufgetreten: Die Ressource {0} konnte nicht ' +
                     'gespeichert werden.',
            level: 'danger',
            params: [ "?" ]
        };
        this.msgs[M.IMPORTER_FAILURE_IDMISSING]={
            content: 'Beim Import ist ein Fehler aufgetreten: Ein Ressourcen-Identifier fehlt.',
            level: 'danger',
            params: []
        };
        this.msgs[M.IMPORTER_FAILURE_INVALIDTYPE]={
            content: "Beim Import ist ein Fehler aufgetreten: Fehlende Typendefinition für den Typ {1} der " +
                     "Ressource {0}.",
            level: 'danger',
            params: ["", ""]
        };
        this.msgs[M.IMPORTER_FAILURE_INVALIDFIELD]={
            content: "Beim Import ist ein Fehler aufgetreten: Fehlende Felddefinition für das Feld {1} der " +
                     "Ressource {0}.",
            level: 'danger',
            params: ["?", ""]
        };
        this.msgs[M.IMPORTER_FAILURE_INVALIDFIELDS]={
            content: "Beim Import ist ein Fehler aufgetreten: Fehlende Felddefinitionen für die Felder {1} der " +
            "Ressource des Typs \"{0}\".",
            level: 'danger',
            params: ["?", ""]
        };
        this.msgs[M.VALIDATION_ERROR_IDMISSING]={
            content: 'Objekt-Identifier fehlt.',
            level: 'danger',
            params: []
        };
        this.msgs[M.OVERVIEW_SAVE_SUCCESS]={
            content: 'Das Objekt wurde erfolgreich gespeichert.',
            level: 'success',
            params: []
        };
        this.msgs[M.DATASTORE_IDEXISTS]={
            content: 'Objekt-Identifier existiert bereits.',
            level: 'danger',
            params: []
        };
        this.msgs[M.DATASTORE_GENERIC_SAVE_ERROR]={
            content: 'Beim Speichern des Objekts ist ein Fehler aufgetreten.',
            level: 'danger',
            params: []
        };
        this.msgs[M.VALIDATION_ERROR_INVALIDTYPE]={
            content: "Der Typ der Ressource wird nicht unterstützt.",
            level: 'danger',
            params: []
        };
        this.msgs[M.VALIDATION_ERROR_INVALIDFIELD]={
            content: "Fehlende Felddefinition für ein Feld der Ressource.",
            level: 'danger',
            params: []
        };
        this.msgs[M.VALIDATION_ERROR_INVALIDFIELDS]={
            content: "Fehlende Felddefinitionen für mehrere Felder der Ressource.",
            level: 'danger',
            params: []
        };
        this.msgs[M.CONFIG_VALIDATION_IMAGE_MISSING]={
            content: "Typ-Definition für Bilder fehlt.",
            level: 'danger',
            params: []
        };
        this.msgs[M.IMAGES_ERROR_FILEREADER]={
            content: "Datei '{0}' konnte nicht vom lokalen Dateisystem gelesen werden.",
            level: 'danger',
            params: []
        };
        this.msgs[M.IMAGES_ERROR_MEDIASTORE_READ]={
            content: "Datei '{0}' konnte nicht aus dem MediaStore gelesen werden.",
            level: 'danger',
            params: []
        };
        this.msgs[M.IMAGES_ERROR_MEDIASTORE_WRITE]={
            content: "Datei '{0}' konnte nicht im MediaStore gespeichert werden.",
            level: 'danger',
            params: []
        };
        this.msgs[M.IMAGES_ERROR_DELETE]={
            content: "Fehler beim Löschen des Bilds '{0}'.",
            level: 'danger',
            params: []
        };
    }
}