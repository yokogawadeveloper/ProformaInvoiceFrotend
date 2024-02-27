import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MAT_DATE_FORMATS } from '@angular/material/core';

import { ApiService } from '../apihandler/api.service';
import { FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';


@Component({
  selector: 'app-proforma-list',
  templateUrl: './proforma-list.component.html',
  styleUrls: ['./proforma-list.component.scss']
})
export class ProformaListComponent implements OnInit {

  public displayedColumns = ['slno','doc_no', 'doc_date', 'soldtoaddress', 'soldtocode', 'shiptoaddress',
                              'po_no', 'po_date', 'indentno', 'uploaddate'];
  public dataSource = new MatTableDataSource<['']>();

  resultsLength = 0;
  isLoadingResults = true;

  searchText: any;

  data: any = '';

  salesOrderNo: any = '';
  startDocDate = new FormControl(moment());
  endDocDate = new FormControl(moment());
  startdate: any = '';
  enddate: any = '';

  salesOrderId: any = [];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  dataElement: any;

  constructor(
    public router: Router,
    public dialog: MatDialog,
    public apiService: ApiService,
    private datePipe: DatePipe,
    private toastr: ToastrService,
    public datepipe: DatePipe
  ) { }

  ngOnInit() {
    this.proformaMasterList();
  }


  proformaMasterList(){
    // let url = 'get_proforma_master/';
    let url = "proforma_master_list/"
    this.apiService.getData(url).then((result: any) => {
      if(result.totalRecords != 0){
      this.dataSource = new MatTableDataSource(result.records);
      this.dataSource.data = result.records;
      // this.dataSource.paginator = this.paginator;
      this.resultsLength = result.records.length;
      this.dataElement = result.records;

      this.dataElement.forEach(element => {
        this.salesOrderId.push(element.DocNo);
      });

      this.searchFilter();

    } else {
      this.resultsLength = 0;
    }
    });
  }


  searchFilter(){
    return this.salesOrderId.filter((option:any) => option.toString().indexOf(this.salesOrderNo) === 0) || this.salesOrderId;
  }

  clearFilterData() {
    this.salesOrderNo = '';
    this.startdate = '';
    this.enddate = '';
    this.proformaMasterList();
  }

  datePickerChange(){
    this.startdate = this.datePipe.transform(this.startDocDate.value, 'yyyy-MM-dd');
    this.enddate = this.datePipe.transform(this.endDocDate.value, 'yyyy-MM-dd');
  }

  filterData() {

    if (this.salesOrderNo != '' || this.startdate != '' || this.enddate != ''){
      if(this.startdate == '' || this.enddate == ''){
        this.startdate = moment();
        this.enddate = moment();
        this.startdate = this.datePipe.transform(this.startdate, 'yyyy-MM-dd');
        this.enddate = this.datePipe.transform(this.enddate, 'yyyy-MM-dd');
      }
      let data = {so_no: this.salesOrderNo == ''? 0 : this.salesOrderNo, startDate: this.startdate, endDate: this.enddate};
      let url = 'get_proforma_master/';
      this.apiService.filterData(url, {params: data}).then((result: any) => {
        if(result.totalRecords != 0){
          this.dataSource = new MatTableDataSource(result.records);
          this.dataSource.data = result.records;
          // this.dataSource.paginator = this.paginator;
          this.resultsLength = result.records.length;
          this.dataElement = result.records;
        } else {
          this.resultsLength = 0;
        }
      });
    } else{
      this.toastr.error("Please enter some values");
    }
  }

  redirectToDetails(id) {
    let viewUrl: any = `proforma/ProformaView/`+id;
    this.router.navigate([viewUrl]);
    // debugger;
    // this.router.navigateByUrl(viewUrl, { state: { title: 'ProformaView' } });
    // this.router.navigate([viewUrl], {skipLocationChange: true, replaceUrl: false});
  }


  address(element, type){

    let data: any;
    if(type == "soldtoaddress"){

      data = element.SoldToAddress.replace(/[\u000b]/g, " ");

    } else if(type == "shiptoaddress"){

      data = element.Shiptoaddress.replace(/[\u000b]/g, " ");

    }

    return data
  }



  generatePDF(element, index){

    let url = "proforma_master_list/print_aoitem/"+element.ProformaID;
    this.apiService.downloadPDF(url).then((data) => {
      var downloadURL = window.URL.createObjectURL(data);
      let tab = window.open();
      tab.location.href = downloadURL;

    });
  }

}

