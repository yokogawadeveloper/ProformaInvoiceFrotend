import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';


@Injectable({
  providedIn: 'root'
})
export class StorageServiceService {

// Bearer Token

  setBearerToken(data) {
    sessionStorage.setItem('accessToken', JSON.stringify(data));
  }

  getBearerToken() {
    return JSON.parse(sessionStorage.getItem('accessToken'));
  }


// Active User

  setActiveUser(data){
    sessionStorage.setItem('active', JSON.stringify(data));
  }

  getActiveUser() {
    return JSON.parse(sessionStorage.getItem('active'));
  }


// Super User

  setSuperUser(data){
    sessionStorage.setItem('suser', JSON.stringify(data));
  }

  getSuperUser() {
    return JSON.parse(sessionStorage.getItem('suser'));
  }


// User ID

  setUserID(data){
    var decoded: any = jwt_decode(data);
    sessionStorage.setItem("user_id", JSON.stringify(decoded.user_id));
  }

  getUserID(){
    return JSON.parse(sessionStorage.getItem('user_id'));
  }


  // Username

  setUser(data){
    sessionStorage.setItem('username', JSON.stringify(data));
  }

  getUser(){
    return JSON.parse(sessionStorage.getItem('username'));
  }

  getDivision(){
    return JSON.parse(sessionStorage.getItem('division'));
  }

  setDivision(data){
    sessionStorage.setItem('division', JSON.stringify(data));
  }


  getCategory(){
    return JSON.parse(sessionStorage.getItem('category'));
  }

  setCategory(data){
    sessionStorage.setItem('category', JSON.stringify(data));
  }


  getprojectManager(){
    return JSON.parse(sessionStorage.getItem('pm'));
  }

  setprojectManager(data){
    sessionStorage.setItem('pm', JSON.stringify(data));
  }


  getRegion(){
    return JSON.parse(sessionStorage.getItem('region'));
  }

  setRegion(data){
    sessionStorage.setItem('region', JSON.stringify(data));
  }

}
