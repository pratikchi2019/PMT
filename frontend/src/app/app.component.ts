import { Component, HostListener, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { DataserviceService } from './dataservice.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(public  dataservice: DataserviceService, private router: Router) {}
  title = 'inventoryApp';
  uid: any;
  loginDtTime: any;
  idx: any;
  @HostListener('window:unload', [ '$event' ])
  unloadHandler(event: any) {
    // ...
    console.log(event)
  }

  @HostListener('window:beforeunload', [ '$event' ])
  beforeUnloadHandler(event: any) {
    // ...
     this.logout()
    console.log(event)
  }
  ngOnChanges(changes: SimpleChanges) {
    console.log(this.dataservice.getRole())
    console.log(changes)
  }

  

  logout(){
    var logoutDtTime = new Date();
    this.dataservice.loginDateTime.subscribe((loginDateTime) => {
      this.loginDtTime = loginDateTime;
    })
    this.dataservice.userID.subscribe((uid) => {
      this.uid = uid;
    })
    this.dataservice.IDX.subscribe((idx) => {
      this.idx = idx;
    })
    this.dataservice.logout(this.idx, this.uid, this.loginDtTime, logoutDtTime).subscribe((res) => {
      console.log(res)
      this.router.navigate(['login'])
    });
  }
}
