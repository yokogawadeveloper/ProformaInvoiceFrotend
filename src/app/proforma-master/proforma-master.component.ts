import { Component, OnInit } from '@angular/core';
import { ApiService } from '../apihandler/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-proforma-master',
  templateUrl: './proforma-master.component.html',
  styleUrls: ['./proforma-master.component.css']
})
export class ProformaMasterComponent implements OnInit {

  divisionName: any;
  buHead: any;
  categoryName: any;
  regionName: any;
  employeeNo: any;
  employeeName: any;

  constructor(
    public api: ApiService,
    public toastr: ToastrService
    ) { }

  ngOnInit(): void {}

  divisionMaster(){

    let data = {
      DivisionName: this.divisionName,
      BUHead: this.buHead
    }

    let url = "division_master_list/"

    this.api.postData(url, data).then(res => {
      this.toastr.success("Division Master Data Saved");
    });

  }


  categoryMaster(){

    let data = {
      CategoryName: this.categoryName
    }

    let url = "category_master_list/"

    this.api.postData(url, data).then(res => {
      this.toastr.success("Category Master Data Saved");
    });

  }


  regionMaster(){

    let data = {
      RegionName: this.regionName
    }

    let url = "region_master_list/"

    this.api.postData(url, data).then(res => {
      this.toastr.success("Region Master Data Saved");
    });

  }


  employeeMaster(){

    let data = {
      EmployeeNo: this.employeeNo,
      EmployeeName: this.employeeName
    }

    let url = "projectmanager_master_list/"

    this.api.postData(url, data).then(res => {
      this.toastr.success("Project Manager Master Data Saved");
    });

  }

}
