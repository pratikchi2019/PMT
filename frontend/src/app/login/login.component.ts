import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataserviceService } from '../dataservice.service';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  uname: string = '';
  psw: any;
  submitted: boolean = false;
  loginFailed: boolean = false;
  userRole: any;
  encrypted: any;
  decrypted: string = '';
  loginDtTime: any;
  uid: any;
  idx: any;
  constructor(private dataservice: DataserviceService, private router: Router) { }

  ngOnInit(): void {
    this.dataservice.setRole(null);
    this.dataservice.authenticated$.next(false);
    this.logout();
  }

  set(keys: string, value: string) {
    var key = CryptoJS.enc.Utf8.parse(keys);
    var iv = CryptoJS.enc.Utf8.parse(keys);
    var encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(value.toString()), key,
      {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });

    return encrypted.toString();
  }

  login(e: any) {
    this.encrypted = this.set('123456$#@$^@1ERF', this.psw);
    this.submitted = true;
    this.dataservice.isLoggedIn(this.uname, this.encrypted).subscribe((data) => {
      console.log(data)
      var date = new Date();
      this.userRole = data.Role;
      this.dataservice.setRole(this.userRole);
      this.dataservice.authenticated$.next(true);
      this.dataservice.userID.next(data.UserID);
      this.dataservice.loginDateTime.next(date);
      this.dataservice.loginInfo(data.UserID, date.toLocaleString("en", {
        weekday: "short",
        year: "numeric",
        month: "2-digit",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        timeZoneName: "long"
      }), "").subscribe((dt) => {
        this.dataservice.IDX.next(dt.IDX);
        console.log(dt)
      })
      this.router.navigate(['dashboard'])
    }, (err) => {
      console.error(err)
      this.router.navigate(['dashboard'])
      this.loginFailed = true
    })
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
    if(this.loginDtTime && this.uid && this.idx) {
      this.dataservice.logout(this.idx, this.uid, this.loginDtTime, logoutDtTime).subscribe((res) => {
        console.log(res)
        //this.router.navigate(['login'])
      });
    }
  }
}
