import { Location, LocationStrategy } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import {DynamicDialogRef} from 'primeng/dynamicdialog';
import {DynamicDialogConfig} from 'primeng/dynamicdialog';
import { DataserviceService } from '../dataservice.service';
import { NodeData } from '../models/NodeData';
@Component({
  selector: 'app-subtask',
  templateUrl: './subtask.component.html',
  styleUrls: ['./subtask.component.scss']
})
export class SubtaskComponent implements OnInit {
  productDialog?: boolean = false;

  record?: NodeData;

  selectedProducts?: NodeData[] = [];

  submitted?: boolean = false;

  statuses?: any[] = [];

  data?: any[] = [];

  form: FormGroup;

  priorityTypes: string[];

  projectTypes: string[];

  statusTypes: string[];

  progress: any;
  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig, private dataservice: DataserviceService, private router: Router, private location: Location, private locationStrategy: LocationStrategy, private messageService: MessageService, private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    console.log(this.config)
    this.getData()
    console.log(this.location.path());
    console.log(this.location.prepareExternalUrl('/'));
    console.log(this.locationStrategy.getBaseHref());
    console.log(location.origin)
  }

  getData() {
    this.dataservice.getSubtasks(this.config.data.id).subscribe((res) => {
      this.data = res;
    })
  }

  getProjectDetails(id) {
    this.dataservice.getProjectDetails(id).subscribe((res) => {
      this.dataservice.setselectedProject(res[0]);
      this.router.navigate([`project-details/${id}`])
      this.ref.close();
    }, (error) => {
      console.log(error)
    })
  }

  deleteRecord(record) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + record.projectName + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.dataservice.deleteRecord(record).subscribe((data) => {
          console.log(data)
          this.data = this.data.filter(val => val.IDX !== record.IDX);
        })
        this.record = {};
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Record Deleted', life: 3000 });
      }
    });
  }

}
