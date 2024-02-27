import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule } from "@angular/common/http";

import { ReactiveFormsModule, FormsModule  } from "@angular/forms";
import { DatePipe } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UploadFileComponent } from './upload-file/upload-file.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ToastrModule } from 'ngx-toastr';

import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatListModule} from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import {MatDialogModule} from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSortModule} from '@angular/material/sort';


import { MenuBarComponent } from './menu-bar/menu-bar.component';
import { ProformaListComponent } from './proforma-list/proforma-list.component';
import { ProformaViewComponent } from './proforma-view/proforma-view.component';
import { ProformaReportComponent } from './proforma-report/proforma-report.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './authgaurd/authguard';
import { ProformaComponent } from './proforma/proforma.component';
import { ProformaMasterComponent } from './proforma-master/proforma-master.component';
import { DivisionMasterComponent } from './division-master/division-master.component';
import { CategoryMasterComponent } from './category-master/category-master.component';
import { RegionMasterComponent } from './region-master/region-master.component';
import { ProjectManagerMasterComponent } from './project-manager-master/project-manager-master.component';

import {EditDialog} from './proforma-view/proforma-view.component';


@NgModule({
  declarations: [
    AppComponent,
    UploadFileComponent,
    MenuBarComponent,
    ProformaListComponent,
    ProformaViewComponent,
    ProformaReportComponent,
    LoginComponent,
    HomeComponent,
    ProformaComponent,
    ProformaMasterComponent,
    DivisionMasterComponent,
    CategoryMasterComponent,
    RegionMasterComponent,
    ProjectManagerMasterComponent,
    EditDialog
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule ,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),

    MatSliderModule,
    MatButtonModule,
    MatInputModule,
    MatToolbarModule,
    MatListModule,
    MatTableModule,
    MatDialogModule,
    MatPaginatorModule,
    MatIconModule,
    MatCardModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatSidenavModule,
    MatSortModule
  ],
  entryComponents: [EditDialog],
  providers: [DatePipe, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
