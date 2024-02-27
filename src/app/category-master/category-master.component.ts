import { Component, OnInit } from '@angular/core';
import { ApiService } from '../apihandler/api.service';
import { ToastrService } from 'ngx-toastr';

import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-category-master',
  templateUrl: './category-master.component.html',
  styleUrls: ['./category-master.component.css']
})
export class CategoryMasterComponent implements OnInit {

  public displayedColumns = ['slno', 'category_name', 'delete'];
  public dataSource = new MatTableDataSource<['']>();

  categoryName: any = "";
  resultsLength = 0;

  constructor(
    public api: ApiService,
    public toastr: ToastrService
  ) { }

  ngOnInit() {
    this.getCategoryList();
  }

  getCategoryList(){

    let url = "category_master_list/"

    this.api.getData(url).then((res: any) => {
      if(res.totalRecords != 0){
        this.dataSource = new MatTableDataSource(res.records);
        this.dataSource.data = res.records;
        this.resultsLength = res.records.length;
      }
    });
  }

  categoryMaster(){

    let data = {
      CategoryName: this.categoryName
    }

    let url = "category_master_list/"

    if(this.categoryName == ""){

      this.toastr.error("Category name field is mandatory");

    } else {

      this.api.postData(url, data).then(res => {
        this.toastr.success("Category Master Data Saved");
        this.getCategoryList();
      });

    }

  }

  deleteCategory(id){
    let url = "category_master_list/delete/"+id;
    this.api.getData(url).then((res: any) => {
      this.toastr.success("Deleted");
      this.getCategoryList();
    });
  }

}
