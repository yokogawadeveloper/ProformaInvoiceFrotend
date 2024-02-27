import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {


    constructor(private router: Router) { }

        canActivate() {
            let session = sessionStorage.getItem("active")
            if (session == null || session == undefined) {
                this.router.navigateByUrl('proforma/login')
            }
            return true;
        }
}
