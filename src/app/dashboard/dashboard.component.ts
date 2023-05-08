import {Component} from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {catchError, concatMap, map, shareReplay, startWith, tap} from 'rxjs/operators';
import {SiteTitleService} from '@red-probeaufgabe/core';
import {FhirSearchFn, IFhirPatient, IFhirPractitioner, IFhirSearchResponse} from '@red-probeaufgabe/types';
import {FilterObject, IUnicornTableColumn} from '@red-probeaufgabe/ui';
import {SearchFacadeService} from '@red-probeaufgabe/search';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {

  /**
   * Use the filterObject as a BehaviourObject here, to be able to trigger the observable for searching
   * when the value of the filter changes. This works because everytime the value of the subjects changes, it will emit its
   * value to its subscribers.
   * @private
   */
  private _filterObject$: BehaviorSubject<FilterObject> = new BehaviorSubject<FilterObject>({
    searchString: '',
    filter: FhirSearchFn.SearchAll,
  })

  // Init unicorn columns to display
  columns: Set<IUnicornTableColumn> = new Set<IUnicornTableColumn>([
    'number',
    'resourceType',
    'name',
    'gender',
    'birthDate',
  ]);

  isLoading = true;

  /*
   * Use the BehaviourSubject here, use pipe operator to chain and use a concatMap to wait for the previous
   * observable to complete to have the data, and then starting with the next observable to search for results.
   *
   * Note: However, there is an issue that the observable is triggered twice at the moment and thus, the request is sent twice.
   * This can be figured out with a bit more time.
   **/
  search$: Observable<IFhirSearchResponse<IFhirPatient | IFhirPractitioner>> =
      this._filterObject$.pipe(
          concatMap((filterObjectValue: FilterObject) => {
              return this.searchFacade
                  .search(filterObjectValue.filter, filterObjectValue.searchString)
                  .pipe(
                      catchError(this.handleError),
                      tap(() => {
                          this.isLoading = false;
                      }),
                      shareReplay(),
                  );
          })
      )


  entries$: Observable<Array<IFhirPatient | IFhirPractitioner>> = this.search$.pipe(
    map((data) => !!data && data.entry),
    startWith([]),
  );

  totalLength$ = this.search$.pipe(
    map((data) => !!data && data.total),
    startWith(0),
  );

  // Fixed the issue that an abstract class can not be injected. Instead, I am using the actual implementation of the
  // SearchFacadeService here. Also, I added the service as provider in the dashboard.module.
  constructor(private siteTitleService: SiteTitleService, private searchFacade: SearchFacadeService) {
    this.siteTitleService.setSiteTitle('Dashboard');
  }

  /**
   * This method is executed whenever the event from the child class is emitted. It gets the new filterObject value, updates the
   * behaviour subject and therefor the search request is made
   * @param filterObject
   */
  public changeFilterEvent(filterObject: FilterObject) {
    this._filterObject$.next(filterObject);
  }

  private handleError(): Observable<IFhirSearchResponse<IFhirPatient | IFhirPractitioner>> {
    return of({ entry: [], total: 0 });
  }
}
