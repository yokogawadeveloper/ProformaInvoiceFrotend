import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProformaListComponent } from './proforma-list.component';

describe('ProformaListComponent', () => {
  let component: ProformaListComponent;
  let fixture: ComponentFixture<ProformaListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProformaListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProformaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
