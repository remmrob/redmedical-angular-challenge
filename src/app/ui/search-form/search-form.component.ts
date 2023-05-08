import {Component, EventEmitter, Output} from '@angular/core';
import {AbstractControl, FormControl, ValidationErrors, ValidatorFn} from "@angular/forms";
import {FhirSearchFn} from "@red-probeaufgabe/types";

/**
 * An interface which defines a filter object
 */
export interface FilterObject {
    searchString: string,
    filter: FhirSearchFn,
}

/**
 * An interface which defines the options the dropdown filter has
 */
export interface DropdownOptions {
    key: FhirSearchFn,
    value: string
}

@Component({
    selector: 'app-search',
    templateUrl: './search-form.component.html',
    styleUrls: ['./search-form.component.scss'],
})
export class SearchFormComponent {

    /**
     * Defining a list of all options the user should have for the dropdown menu.
     * These options are a combination of the fhir-search-fn.enums and the actual text value for the dropdown.
     */
    public listOfFilterOptions: DropdownOptions[] = [
        {key: FhirSearchFn.SearchAll, value: 'Patients + Practitioners (Patient/Ärzte)'},
        {key: FhirSearchFn.SearchPatients, value: 'Patients (Patient)'},
        {key: FhirSearchFn.SearchPractitioners, value: 'Practitioners (Ärzte)'},
    ];

    /**
     * Use an output decorator here to be able to let the data flow from the child component to the parent component.
     * This will let the parent component know if there are any changes and which changes to the filter were made.
     */
    @Output()
    public changeFilterEvent = new EventEmitter<FilterObject>();

    /**
     * Initialize a new FormControl with custom validators for checking if there are any whitespaces or mutual vowels.
     * This gives me the opportunity to have separate validation error messages.
     *
     * Of course there is also the option to have a single regex pattern which would fit all needs. But then it is a lot
     * more effort to get the correct error message for a specific error case.
     */
    public searchQueryForm = new FormControl('', [
        this.hasWhitespaces(),
        this.hasMutualVowels(),
        this.hasSpecialCharacters()
    ])

    /**
     * Initializes the FormControl for the dropdown menu with an initial value from the option list.
     */
    public filterForm = new FormControl(this.listOfFilterOptions[0].key)

    /**
     * This object is used to hold the current selected filters which then can be propagated to the parent class
     *
     * @private
     */
    private _filterObject: FilterObject = {
        searchString: '',
        filter: this.listOfFilterOptions[0].key,
    }

    /**
     * Returns an error message based on the error the searchNameForm has
     */
    public getErrorMessage(): string {
        if (this.searchQueryForm.hasError('hasSpecialCharacters')) {
            return 'Please do not use any special characters.';
        }
        if (this.searchQueryForm.hasError('hasMutualVowels')) {
            return 'Please do not use any mutual vowels (ä,ü,ö)';
        }
        return this.searchQueryForm.hasError('hasWhitespaces') ? 'Please remove whitespaces' : '';
    }

    /**
     * Adapts the filter objects with the new name from the search field and emits the event with the new information
     */
    public changeSearchQuery() {
        if (this.searchQueryForm.valid) {
            this._filterObject.searchString = this.searchQueryForm.value ?? "";
            this.changeFilterEvent.emit(this._filterObject);
        }
    }

    /**
     * Adapts the filter objects with the selected dropdown option and emits the event with the new information
     */
    changeFilter(value: FhirSearchFn) {
        this._filterObject.filter = value;
        this.changeFilterEvent.emit(this._filterObject);
    }

    /**
     * A custom validation function which returns an error for the control if the value contains whitespaces
     * @private
     */
    private hasWhitespaces(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const isInvalid = /\s/.test(control.value);
            return isInvalid ? {hasWhitespaces: {value: control.value}} : null;
        }
    }

    /**
     * A custom validation function which returns an error for the control if the value contains mutual vowels
     * @private
     */
    private hasMutualVowels(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const inInvalid = /[äöü]/g.test(control.value) || /[ÄÖÜ]/g.test(control.value);
            return inInvalid ? {hasMutualVowels: {value: control.value}} : null;
        }
    }

    /**
     * A custom validation function which returns an error for the control if the value contains any special characters
     * @private
     */
    private hasSpecialCharacters(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const inInvalid = /[$&+,:;=?@#|'<>.^*()%!-]/g.test(control.value);
            return inInvalid ? {hasSpecialCharacters: {value: control.value}} : null;
        }
    }

}
