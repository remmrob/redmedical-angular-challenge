import {Component, Inject, OnInit} from '@angular/core';
import {
    FhirResourceType,
    IFhirPatient,
    IFhirPractitioner,
    IPreparedIFhirPatient,
    IPreparedIFhirPractitioner
} from "@red-probeaufgabe/types";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {FhirUtilService} from "@red-probeaufgabe/search";

@Component({
    selector: 'app-unicorn-table-detail',
    templateUrl: './unicorn-table-detail.component.html',
    styleUrls: ['./unicorn-table-detail.component.scss']
})
export class UnicornTableDetailComponent implements OnInit {

    /**
     * Holds the for the detail view prepared data
     */
    public preparedFhirData: IPreparedIFhirPatient | IPreparedIFhirPractitioner;

    /**
     * Constructor of UnicornTableDetailComponent
     *
     * @param fhirData
     * @param fhirUtilService
     */
    constructor(@Inject(MAT_DIALOG_DATA) public fhirData: IFhirPatient | IFhirPractitioner, public fhirUtilService: FhirUtilService) {}

    ngOnInit(): void {
       this.preparedFhirData = this.fhirUtilService.prepareData(this.fhirData);
    }

    /**
     * Helper function to identify if the data is of type IFhirPatient or not.
     */
    public isPatient(): boolean {
        return this.fhirData.resourceType === FhirResourceType.Patient
    }
}
