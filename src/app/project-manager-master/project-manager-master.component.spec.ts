import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectManagerMasterComponent } from './project-manager-master.component';

describe('ProjectManagerMasterComponent', () => {
  let component: ProjectManagerMasterComponent;
  let fixture: ComponentFixture<ProjectManagerMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectManagerMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectManagerMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
