import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FileUploader } from "ng2-file-upload";
import { environment } from 'src/environments/environment';

import { StorageServiceService } from '../storageService/storage.service';


import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from "@angular/forms";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";

import { ApiService } from '../apihandler/api.service';
import { ToastrService } from 'ngx-toastr';

import swal from 'sweetalert2';



@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.css']
})

export class UploadFileComponent implements OnInit {
  
  public uploader: FileUploader = new FileUploader({});
  url = environment.apiUrl;

  uploadForm: FormGroup;
  dataElement: any;
  salesOrderId: any = [];

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    public apiService: ApiService,
    public storage: StorageServiceService,
    private toastr: ToastrService

  ) { }

  @ViewChild('takeInput', {static: false})
  InputVar: ElementRef;

  ngOnInit(): void {
    this.proformaMasterList();
    this.uploadForm = this.formBuilder.group({
      prod_line_item: new FormControl("", Validators.required),
    });
  }

  proformaMasterList(){
    let url = 'get_proforma_master/';
    this.apiService.getData(url).then((result: any) => {
      if(result.totalRecords != 0){

      this.dataElement = result.records;
      this.dataElement.forEach(element => {
        this.salesOrderId.push(element.DocNo);
      });
    }
    });
  }

  onSubmit() {

    let bearer = this.storage.getBearerToken();
    let headers = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer'+' '+bearer
      })
    };

    const formData: FormData  = new FormData();
    if (this.uploadForm.status == "INVALID"){
      this.toastr.error("Please upload file")
    }
    else{
      formData.append("prod_line_item", this.uploadForm.get("prod_line_item").value);
      this.http.post<any>(this.url + "data/", formData, headers).subscribe(
        (res: any) => {
          this.toastr.success(res.message);
          let viewUrl: any = `proforma/ProformaView/`+res.id;
          this.router.navigate([viewUrl])
        },
      );
    }
  }

  OnFileSelect(event, name) {
    let file = event.target.files[0];

    const myArray = file['name'].split("_");
    let val = myArray[2];

    let url = 'proforma_master_list/doc_no/'
    this.apiService.postData(url, val).then((result: any) => {
      if(result.value == true){

        const option = {
          title: "Are you sure?",
          text: "Already this file exists, Are you sure want to delete exist one and save new ?",
          type: 'warning',
          showConfirmButton: true,
          showCancelButton: true,
          confirmButtonColor: '#3085d6',     
        }
        
        swal.fire(option).then((willDelete) => {

            if(willDelete.value){
              this.uploadForm.get(name).setValue(file);
            } else{
              this.InputVar.nativeElement.value = "";
            }

        });
      } else {
        this.uploadForm.get(name).setValue(file);
      }
    });
  }


}


