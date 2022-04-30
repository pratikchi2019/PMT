import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TreeNode } from 'primeng/api';
import { DataserviceService } from '../dataservice.service';
import { Basenode } from '../models/basenode';
import { NodeData } from '../models/NodeData';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
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

  constructor(private dataservice: DataserviceService, private router: Router, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    // this.files = [];
    this.getData()
    this.form = this.formBuilder.group({
      PRM: [null, Validators.required],
      projectName: [null, Validators.required],
      issueType: [null, Validators.required],
      priority: [null, Validators.required],
      region: [null, Validators.required],
      projectManager: [null, Validators.required],
      status: [null, Validators.required],
      estimatedHours: [null, Validators.required],
      startDate: [null, Validators.required],
      goLive: [null, Validators.required],
      progress: [null, Validators.required],
    });
    this.projectTypes = [
      'Subtask',
      'Defect',
      'Story',
      'Bug',
      'Change Request'
    ]
    this.statusTypes = [
      "Done", "In Progress", "In Review", "Abandoned", "Blocked", "In Test Env", "QA Passed", "In Production"
    ].sort((a, b) => {
      if (a.toLowerCase() < b.toLowerCase()) return -1
      if (a.toLowerCase() > b.toLowerCase()) return 1
      return 0
    })
    this.priorityTypes = [
      "Lowest", "Low", "Medium", "High", "Highest"
    ].sort((a, b) => {
      if (a.toLowerCase() < b.toLowerCase()) return -1
      if (a.toLowerCase() > b.toLowerCase()) return 1
      return 0
    })
  }

  getData() {
    this.dataservice.getAllData().subscribe((res) => {
      this.data = res;
      this.getAllUsers();
    })
  }

  nodeCreator(node: Basenode) {

  }

  openNew() {
    this.record = {};
    this.submitted = false;
    this.productDialog = true;
  }

  getProjectDetails(id) {
    this.dataservice.getProjectDetails(id).subscribe((res) => {
      this.dataservice.setselectedProject(res[0]);
      this.router.navigate(['project-details'])
    }, (error) => {
      console.log(error)
    })
  }

  closeDialog() {
    this.productDialog = false;
  }

  createProject() {
    this.dataservice.createRecord(this.form.value).subscribe((res)=>{
      console.log(res)
      this.productDialog = false;
      this.form.reset();
      this.data = res;
    })
    console.log(this.form)
  }

  getAllUsers() {
    this.dataservice.getAllUsers().subscribe((res) => {
      this.dataservice.allUsers.next(res);
      console.log(res)
    })
  }

}
