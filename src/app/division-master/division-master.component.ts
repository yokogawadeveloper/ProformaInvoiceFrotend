import { Component, OnInit } from '@angular/core';
import { ApiService } from '../apihandler/api.service';
import { ToastrService } from 'ngx-toastr';

import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-division-master',
  templateUrl: './division-master.component.html',
  styleUrls: ['./division-master.component.css']
})
export class DivisionMasterComponent implements OnInit {

  public displayedColumns = ['slno', 'division_name', 'abbr', 'delete'];
  public dataSource = new MatTableDataSource<['']>();

  divisionName: any = "";
  buHead: any = "";
  divisionAbbr: any = "";

  resultsLength = 0;

  constructor(
    public api: ApiService,
    public toastr: ToastrService
  ) { }

  ngOnInit() {
    this.getDivisionList();
  }


  getDivisionList(){

    let url = "division_master_list/"

    this.api.getData(url).then((res: any) => {
      if(res.totalRecords != 0){
        this.dataSource = new MatTableDataSource(res.records);
        this.dataSource.data = res.records;
        this.resultsLength = res.records.length;
      }
    });
  }


  divisionMaster(){

    let data = {
      DivisionName: this.divisionName,
      Abbr: this.divisionAbbr,
    }

    let url = "division_master_list/"

    if(this.divisionName == "" ||  this.divisionAbbr == ""){

      this.toastr.error("All fields are mandatory");

    } else {

      this.api.postData(url, data).then(res => {
        this.toastr.success("Division Master Data Saved");
        this.getDivisionList();
      });

    }



  }

  deleteDiv(id){
    let url = "division_master_list/delete/"+id;
    this.api.getData(url).then((res: any) => {
      this.toastr.success("Deleted");
      this.getDivisionList();
    });
  }

}
