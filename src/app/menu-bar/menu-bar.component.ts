import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.css']
})
export class MenuBarComponent implements OnInit {

  public menuShow = false;

  suser: any;

  constructor(public router: Router) {
   }

  ngOnInit(): void {
    this.suser = sessionStorage.getItem("suser");
  }

  logoutuser(){
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("active");
    sessionStorage.removeItem("suser");
    sessionStorage.removeItem("user_id");
    this.router.navigateByUrl('/proforma/login');
  }

}
