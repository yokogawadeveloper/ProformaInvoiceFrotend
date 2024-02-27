import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { StorageServiceService } from '../storageService/storage.service';
import { Router } from '@angular/router';

import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

import { map } from "rxjs/operators"; 

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  apiUrl = environment.apiUrl;

  constructor(    
    public http: HttpClient,
    public storage: StorageServiceService,
    public router: Router
    ) { }

  getData(url) {

    let bearer = this.storage.getBearerToken();
    let headers =  {
      headers: new HttpHeaders({ 
        'Content-Type': 'application/json', 
        'Authorization': 'Bearer'+' '+bearer
      })};
  
    return new Promise((resolve, reject) => {
      this.http.get(this.apiUrl + url, headers)
        .subscribe(res => { 
          resolve(res);
        }, (err) => {
          this.logout(err);
          // reject(err);
        });
    });
  }

  filterData(url, queryParams?: Object) {

    let params = queryParams['params'];
    let bearer = this.storage.getBearerToken();
    let headers =  {
      headers: new HttpHeaders({ 
        'Content-Type': 'application/json', 
        'Authorization': 'Bearer'+' '+bearer
      }), params};

    return new Promise((resolve, reject) => {
      this.http.get(this.apiUrl + url, headers)
        .subscribe(res => { 
          resolve(res);
        }, (err) => {
          this.logout(err);
          // reject(err);
        });
    });
  }

  putData(url, data) {

    let bearer = this.storage.getBearerToken();
    let headers =  {
      headers: new HttpHeaders({ 
        'Content-Type': 'application/json', 
        'Authorization': 'Bearer'+' '+bearer
      })};
  
    return new Promise((resolve, reject) => {
      this.http.put(this.apiUrl + url, JSON.stringify(data), headers)
        .subscribe((res: any) => {
          resolve(res);
        }, (err) => {
          this.logout(err);
          // reject(err);
        });
    });
  }

  postData(url, data) {

    let bearer = this.storage.getBearerToken();
    let headers =  {
      headers: new HttpHeaders({ 
        'Content-Type': 'application/json', 
        'Authorization': 'Bearer'+' '+bearer
      })};
  
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + url, JSON.stringify(data), headers)
        .subscribe((res: any) => {
          resolve(res);
        }, (err) => {
          this.logout(err);
          // reject(err);
        });
    });
  }

  postLoginData(url, data: any) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + url, data)
        .subscribe((res: any) => {
          resolve(res);
        }, (err) => {
          this.logout(err);
          // reject(err);
        });
    });
  }


  public downloadPDF(url): any {
    let bearer = this.storage.getBearerToken();
    let headers =  {
      responseType: 'blob' as 'json',
      headers: new HttpHeaders({ 
        'Content-Type': 'application/json', 
        'Authorization': 'Bearer'+' '+bearer,
      })};
      
      return new Promise((resolve, reject) => {
        this.http.get(this.apiUrl + url, headers).subscribe(
        (res) => {
          resolve(res);
        },  (err) => {
          this.logout(err);
        });
      });
  }



  public download(url): Observable<any> {
    let bearer = this.storage.getBearerToken();
    let headers =  {
      responseType: 'blob' as 'json',
      headers: new HttpHeaders({ 
        'Content-Type': 'application/vnd.openxmlformats-ficedocument.spreadsheetml.sheet', 
        'Authorization': 'Bearer'+' '+bearer,
      })};
    return this.http.get(this.apiUrl + url, headers)
  }


  logout(err: any){
    if(err.status == 401){
      sessionStorage.removeItem("accessToken");
      sessionStorage.removeItem("active");
      sessionStorage.removeItem("suser");
      sessionStorage.removeItem("user_id");
      console.clear();
      this.router.navigateByUrl('/proforma/login');
    }
  }

}




