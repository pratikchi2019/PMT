import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { DataserviceService } from './dataservice.service';

@Injectable({
  providedIn: 'root'
})
export class UserGuard implements CanActivate {
  constructor(private dataservice: DataserviceService, private router: Router) { }
  userRole: any;
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    this.dataservice.userRole.subscribe((data) => {
      this.userRole = data
    })
    if (this.userRole === "Admin") {
      return true;
    }
    else {
      alert("You are not authorized");
    }
  }
  
}
