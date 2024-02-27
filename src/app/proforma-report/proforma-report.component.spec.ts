import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProformaReportComponent } from './proforma-report.component';

describe('ProformaReportComponent', () => {
  let component: ProformaReportComponent;
  let fixture: ComponentFixture<ProformaReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProformaReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProformaReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
