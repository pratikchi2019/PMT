import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { DataserviceService } from '../dataservice.service';
import { USERMANAGEMENT } from '../models/usermanagement';
import * as CryptoJS from 'crypto-js';
import { Location } from '@angular/common';
@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
  encrypted: string;

  constructor(private dataservice: DataserviceService, private messageService: MessageService, private confirmationService: ConfirmationService, private location: Location) { }
  productDialog: boolean;

  tabledata: USERMANAGEMENT[] = [];

  record: USERMANAGEMENT;

  selectedRecords: USERMANAGEMENT[];

  submitted: boolean;

  viewDialog: boolean = false;

  cols: any[];

  globalFilter: string;

  userRole: any;

  itemsBreadCrumb: MenuItem[];
  home: MenuItem;

  userID: any;

  currState: any;
  ngOnInit(): void {
    this.getAllUsers()
    this.cols = [
      { field: 'FirstName', header: 'Firstname' },
      { field: 'LastName', header: 'Lastname' },
      { field: 'Role', header: 'Role' },
      { field: 'UserID', header: 'User ID' },
      { field: 'Password', header: 'Password' }
    ];
    this.dataservice.userID.subscribe((userID) => {
      this.userID = userID
    })
  }


  openNew() {
    this.record = {};
    this.submitted = false;
    this.productDialog = true;
  }

  viewRecord(data: USERMANAGEMENT) {
    this.record = { ...data };
    this.viewDialog = true;
  }

  hideDialog() {
    this.productDialog = false;
    this.submitted = false;
    this.viewDialog = false;
  }

  getAllUsers() {
    this.dataservice.getAllUsers().subscribe((res) => {
      this.tabledata = res;
      console.log(res)
    })
  }

  editRecord(data: USERMANAGEMENT) {
    this.record = { ...data };
    this.productDialog = true;
  }

  findIndexById(id: number): number {
    let index = -1;
    for (let i = 0; i < this.tabledata.length; i++) {
      if (this.tabledata[i].IDX === id) {
        index = i;
        break;
      }
    }
    return index;
  }

  saveUser() {
    this.submitted = true;
    this.productDialog = false;

    if (this.record.FirstName && this.record.LastName && this.record.UserID &&
      this.record.Password && this.record.Role) {
      this.record.Password = this.set('123456$#@$^@1ERF', this.record.Password);
      if (this.record.IDX) {
        this.tabledata[this.findIndexById(this.record.IDX)] = this.record;
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'User Details Updated', life: 3000 });
        this.dataservice.updateUser(this.record).subscribe((data) => {
          console.log(data)
          this.tabledata = data;
          this.getAllUsers();
        })
      }
      else {
        this.dataservice.addUser(this.record).subscribe((res) => {
          console.log(res)
          this.tabledata = res;
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'New User Added', life: 3000 });
          this.getAllUsers();
        })
      }

    }
    else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Missing Fields", life: 3000 });
    }
    //console.log(this.record.FirstName.trim())
  }

  deleteRecord(user) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to remove ' + user.FirstName + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.dataservice.deleteUser(user).subscribe((data) => {
          console.log(data)
          this.tabledata = data;
        })
        this.tabledata = this.tabledata.filter(val => val.IDX !== user.IDX);
        this.record = {};
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'User Removed', life: 3000 });
      }
    });
  }

  deleteSelectedRecords() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected records?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.tabledata = this.tabledata.filter(val => !this.selectedRecords.includes(val));
        this.selectedRecords.forEach((val) => {
          this.dataservice.deleteUser(val).subscribe((data) => {
            console.log(data)
            this.tabledata = data
          })
        })
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Records Deleted', life: 3000 });
        this.selectedRecords = null;
      }
    });
  }

  set(keys, value) {
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

}
