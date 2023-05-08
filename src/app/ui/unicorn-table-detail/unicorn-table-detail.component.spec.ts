import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnicornTableDetailComponent } from './unicorn-table-detail.component';

describe('UnicornTableDetailComponent', () => {
  let component: UnicornTableDetailComponent;
  let fixture: ComponentFixture<UnicornTableDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnicornTableDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnicornTableDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
