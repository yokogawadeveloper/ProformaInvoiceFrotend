import { Component, OnInit } from '@angular/core';
import { ApiService } from '../apihandler/api.service';
import { ToastrService } from 'ngx-toastr';

import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-project-manager-master',
  templateUrl: './project-manager-master.component.html',
  styleUrls: ['./project-manager-master.component.css']
})
export class ProjectManagerMasterComponent implements OnInit {

  public displayedColumns = ['slno', 'emp_no', 'emp_name', 'bu_head', 'delete'];
  public dataSource = new MatTableDataSource<['']>();

  employeeNo: any = "";
  employeeName: any = "";

  resultsLength = 0;

  buHead: any = ""

  constructor(
    public api: ApiService,
    public toastr: ToastrService
  ) { }

  ngOnInit() {
    this.getProjectmanagerList();
  }


  getProjectmanagerList(){

    let url = "projectmanager_master_list/"

    this.api.getData(url).then((res: any) => {
      if(res.totalRecords != 0){
        this.dataSource = new MatTableDataSource(res.records);
        this.dataSource.data = res.records;
        this.resultsLength = res.records.length;
      }
    });
  }

  projectmanagerMaster(){

    let data = {
      EmployeeNo: this.employeeNo,
      EmployeeName: this.employeeName
    }

    let url = "projectmanager_master_list/"

    if(this.employeeNo == "" || this.employeeName == ""){

      this.toastr.error("All fields are mandatory");

    } else {

      this.api.postData(url, data).then(res => {
        this.toastr.success("Project Manager Master Data Saved");
        this.getProjectmanagerList();
      });

    }

  }


  deletePM(id){
    let url = "projectmanager_master_list/delete/"+id;
    this.api.getData(url).then((res: any) => {
      this.toastr.success("Deleted");
      this.getProjectmanagerList();
    });
  }

}
