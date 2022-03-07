import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TreeNode } from 'primeng/api';
import { DataserviceService } from '../dataservice.service';
import { Basenode } from '../models/basenode';
import { NodeData } from '../models/NodeData';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  productDialog?: boolean = false;

  product?: NodeData;

  selectedProducts?: NodeData[] = [];

  submitted?: boolean = false;

  statuses?: any[] = [];

  data?: any[] = [];

  constructor(private dataservice: DataserviceService, private router: Router) { }

  ngOnInit(): void {
    // this.files = [];
    this.getData()
  }

  getData() {
    this.dataservice.getAllData().subscribe((res) => {
      this.data = res;
    })
  }

  nodeCreator(node: Basenode) {

  }

  openNew() {
    this.product = {};
    this.submitted = false;
    this.productDialog = true;
  }

  getProjectDetails(id) {
    this.dataservice.getProjectDetails(id).subscribe((res)=>{
      this.dataservice.setselectedProject(res[0]);
      this.router.navigate(['project-details'])
    }, (error)=>{
      console.log(error)
    })
  }

}
