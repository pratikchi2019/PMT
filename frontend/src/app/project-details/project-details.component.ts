import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { DataserviceService } from '../dataservice.service';
import { NodeData } from '../models/NodeData';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss']
})
export class ProjectDetailsComponent implements OnInit {

  constructor(private dataservice: DataserviceService) { }
  items: any[];
  itemsBreadCrumb: MenuItem[];
  home: MenuItem;
  dashboard: MenuItem;
  project: NodeData;
  projectTypes: any[];
  selectedProjectType: any;
  statusTypes: any[];
  editBtnClicked: boolean = false;
  disableEdit: boolean = false;
  statusBtnStyleClass: string = '';
  priorityIconClass: string = '';
  text1: string = '';
  qlLink: any;
  qlImage: any;

  ngOnInit(): void {
    this.getSelectedProject();
    this.disableEdit = false;
    this.items = [
      {
        label: 'Type',
        field: this.project.issueType,
        icon: 'fa fa-bookmark'
      },

      {
        label: 'Status',
        icon: 'pi pi-external-link',
        url: 'http://angular.io',
        labelBadge: this.project.status,
        badgeColor: this.project.status === 'In Progress' ? 'p-button-warning' : this.project.status === 'Done' ? 'p-button-success'
          : (this.project.status === 'Blocked' || this.project.status === 'Abandoned') ? 'p-button-danger' : 'p-button-primary'
      },

      {
        label: 'Priority',
        icon: this.project.priority === 'Lowest' ? 'fa fa-angle-double-down' : this.project.priority === 'Low' ? 'fa fa-angle-down' : this.project.priority === 'Medium' ? 'fa fa-bars'
          : this.project.priority === 'High' ? 'fa fa-angle-up' : this.project.priority === 'Highest' ? 'fa fa-angle-double-up' : 'fa fa-bars',
        url: 'http://angular.io',
        field: this.project.priority,
      },
      {
        label: 'Parent Link',
        field: this.project.parentTaskLink,
        icon: 'pi pi-external-link'
      },
      {
        label: 'Health',
        icon: 'fa fa-bolt',
        field: this.project.health,
      },
      {
        label: 'Region',
        icon: 'fa fa-globe',
        routerLink: '/fileupload',
        field: this.project.region,
      }
    ];
    this.itemsBreadCrumb = [
      { label: 'Dashboard', routerLink: '/dashboard', icon: 'pi pi-home' },
      // { label: 'Lionel Messi', url: 'https://en.wikipedia.org/wiki/Lionel_Messi' },
      { label: this.project.projectName },
    ];
    this.projectTypes = [
      'Subtask',
      'Defect',
      'Story',
      'Bug',
      'Change Request'
    ]

    this.applyStyles();
    this.statusTypes = [
      "Done", "In Progress", "In Review", "Abandoned", "Blocked", "In Test Env", "QA Passed", "In Production"
    ].sort((a, b) => {
      if (a.toLowerCase() < b.toLowerCase()) return -1
      if (a.toLowerCase() > b.toLowerCase()) return 1
      return 0
    })
    // this.home = {icon: 'pi pi-home', routerLink: '/'};
    // this.dashboard = {icon: 'pi pi-menu', routerLink: '/dashboard'};
  }


  getSelectedProject() {
    let proj = { "IDX": 206, "PRM": 4, "projectName": "Create APIs for adding users", "issueType": "subtask", "priority": "Lowest", "status": "In Progress", "assignee": "Kashi", "reporter": "Pratik", "description": "Description BSL-MC-ED-01-MNTR", "attachments": null, "startDate": "1998-01-23T12:45:56.000Z", "estimatedHours": "16", "parentTaskLink": "https://www.google.com", "comments": "Comments - Philips TS Support", "history": "History", "subTasks": "subtask links", "projectManager": "Proj Manager", "health": "Health - Risky", "region": "Region - TX", "goLive": "go live dt", "checklist": "checklist", "LastModifiedUser": null, "LastModifiedDateTime": null }
    this.dataservice.selectedProject.subscribe((project) => {
      this.project = project || proj
    })
    setTimeout(() => {
      this.qlLink = document.getElementsByClassName('ql-link')[0];
      this.qlImage = document.getElementsByClassName('ql-image')[0];
      if (this.qlLink) this.qlLink.style.display = 'none';
      if (this.qlImage) this.qlImage.style.display = 'none';
    }, 0)

    console.log(proj)
  }

  editDetails() {
    console.log(this.project)
    this.editBtnClicked = true;
    this.disableEdit = true;
  }

  saveDetails() {
    this.disableEdit = false;
    this.applyStyles();
  }

  applyStyles() {
    this.statusBtnStyleClass = this.project.status === 'In Progress' ? 'p-button-warning' : this.project.status === 'Done' ? 'p-button-success'
      : (this.project.status === 'Blocked' || this.project.status === 'Abandoned') ? 'p-button-danger' : 'p-button-primary';
    this.priorityIconClass = this.project.priority === 'Lowest' ? 'fa fa-angle-double-down' : this.project.priority === 'Low' ? 'fa fa-angle-down' : this.project.priority === 'Medium' ? 'fa fa-bars'
      : this.project.priority === 'High' ? 'fa fa-angle-up' : this.project.priority === 'Highest' ? 'fa fa-angle-double-up' : 'fa fa-bars';
  }

}
