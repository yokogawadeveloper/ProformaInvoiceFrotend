import { Component, OnInit } from '@angular/core';
import { ApiService } from '../apihandler/api.service';
import { ToastrService } from 'ngx-toastr';

import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-region-master',
  templateUrl: './region-master.component.html',
  styleUrls: ['./region-master.component.css']
})
export class RegionMasterComponent implements OnInit {

  public displayedColumns = ['slno', 'region_name', 'abbr', 'delete'];
  public dataSource = new MatTableDataSource<['']>();

  regionName: any = "";
  regionAbbr: any = "";

  resultsLength = 0;


  constructor(
    public api: ApiService,
    public toastr: ToastrService
  ) { }

  ngOnInit() {
    this.getRegionList();
  }

  getRegionList(){

    let url = "region_master_list/"

    this.api.getData(url).then((res: any) => {
      if(res.totalRecords != 0){
        this.dataSource = new MatTableDataSource(res.records);
        this.dataSource.data = res.records;
        this.resultsLength = res.records.length;
      }
    });
  }

  regionMaster(){

    let data = {
      RegionName: this.regionName,
      Abbr: this.regionAbbr
    }

    let url = "region_master_list/"

    if(this.regionName == "" || this.regionAbbr == ""){

      this.toastr.error("All fields are mandatory");

    } else {

      this.api.postData(url, data).then(res => {
        this.toastr.success("Region Master Data Saved");
        this.getRegionList();
      });

    }

  }

  deleteRegion(id){
    let url = "region_master_list/delete/"+id;
    this.api.getData(url).then((res: any) => {
      this.toastr.success("Deleted");
      this.getRegionList();
    });
  }

}
