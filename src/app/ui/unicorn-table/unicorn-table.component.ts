import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { IUnicornTableColumn } from '../models';
import { IFhirPatient, IFhirPractitioner } from '@red-probeaufgabe/types';
import {MatDialog} from "@angular/material/dialog";
import {UnicornTableDetailComponent} from "../unicorn-table-detail/unicorn-table-detail.component";

@Component({
  selector: 'app-unicorn-table',
  templateUrl: './unicorn-table.component.html',
  styleUrls: ['./unicorn-table.component.scss'],
})
export class UnicornTableComponent implements OnInit {
  dataSource: MatTableDataSource<IFhirPatient | IFhirPractitioner> = new MatTableDataSource([]);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  @Input() columns: Set<IUnicornTableColumn> = new Set<IUnicornTableColumn>();
  @Input() totalLength = 0;
  @Input() isLoading = false;

  @Input()
  set entries(value: Array<IFhirPatient | IFhirPractitioner>) {
    this.dataSource.data = value;
  }

  /**
   * Use a constructor here to inject MatDialog
   * @param dialog
   */
  constructor(public dialog: MatDialog) {
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
  }

  /**
   * Opens a panel in a dialog with detailed information about the selected Patient or Practitioner
   * @param selectedRow
   */
  public openDetailPanel(selectedRow: IFhirPatient | IFhirPractitioner) {
    this.dialog.open(UnicornTableDetailComponent, {
      data: selectedRow,
    });
  }
}
