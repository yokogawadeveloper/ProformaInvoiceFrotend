import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProformaMasterComponent } from './proforma-master.component';

describe('ProformaMasterComponent', () => {
  let component: ProformaMasterComponent;
  let fixture: ComponentFixture<ProformaMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProformaMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProformaMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
