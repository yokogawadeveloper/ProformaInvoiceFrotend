import { AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../apihandler/api.service';
import { StorageServiceService } from '../storageService/storage.service';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { DomSanitizer } from '@angular/platform-browser';
import {ElementRef} from '@angular/core';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  ipAddress: any;

  username: any = "";
  password: any = "";

  systemUser: any;

  valueInsert: any;
  getValue: any;

  el:ElementRef;

  @ViewChild('iframe') input: ElementRef;

  constructor(
    private router: Router,
    public apiService: ApiService,
    public storage: StorageServiceService,
    private toastr: ToastrService,
    public http: HttpClient,
    public sanitizer: DomSanitizer,
    private _elementRef : ElementRef

  ) {

    this.valueInsert = this.sanitizer.bypassSecurityTrustResourceUrl("http://10.29.15.212:45/username/");
    
   }

  ngOnInit() {
    let session = sessionStorage.getItem("accessToken");
    if (session == null || session == undefined) {
      this.router.navigateByUrl("/proforma/login");
    } else {
      this.router.navigateByUrl("/proforma/FileUpload");
    }


    this.getClientSystemUsername();
  }

  getClientSystemUsername(){
    let url = "http://10.29.15.212:45/username/";
    this.http.get<any>(url, { withCredentials: true }).subscribe((result: any) => {
      let username = result[0].username;
      this.systemUser = username.split("\\");
    });
  }


  loginuser(){
    let url = 'user/login/';

    let data = {
      // username: this.systemUser[1]
      // print this.systemUser[1] in console to see the username


      username: '464_0521',
    }

    this.apiService.postLoginData(url, data).then((result: any) => {
      if(result.value == true){
        let data: any = result.data;
        this.storage.setBearerToken(data.access);
        this.storage.setActiveUser(data.is_active);
        this.storage.setSuperUser(data.is_superuser);
        this.storage.setUserID(data.access);
        // this.storage.setUser(data.username);

        this.storage.setDivision(data.division);
        this.storage.setCategory(data.category);
        this.storage.setprojectManager(data.pm);
        this.storage.setRegion(data.region);


        this.router.navigateByUrl("/proforma/FileUpload");
      }
      else{
        this.toastr.error(result.data);
      }
  });
}

//   loginuser(){
//     let url = 'user/login/';

//     if(this.username == "464_0521" || this.password == "project123"){

//       this.toastr.error("Username/Password field is required");

//     } else {

//     let data = {
//       username: this.username,
//       password: this.password
//     }

//     this.apiService.postLoginData(url, data).then((result: any) => {
//       if(result.value == true){
//         let data: any = result.data;
//         this.storage.setBearerToken(data.access);
//         this.storage.setActiveUser(data.is_active);
//         this.storage.setSuperUser(data.is_superuser);
//         this.storage.setUserID(data.access);
//         // this.storage.setUser(data.username);

//         this.router.navigateByUrl("/proforma/FileUpload");
//       }
//       else{
//         this.toastr.error(result.data);
//       }
//     });
//   }
// }

}
