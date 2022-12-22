import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { DataserviceService } from '../dataservice.service';
import { Comments } from '../models/comments';
import { HistoryObject } from '../models/history';
import { NodeData } from '../models/NodeData';
import { USERMANAGEMENT } from '../models/usermanagement';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss']
})
export class ProjectDetailsComponent implements OnInit {
  oldObj: any;
  historyArr: any = [];
  updatedDescription: any;
  previewUrl: any;
  filesArr: any[];
  paramId: any;
  submitted: boolean;
  productDialog: boolean;
  record: {};
  data: any;
  subtasks: any;
  hoursInPRMs: string[];
  checkList: any[];

  constructor(private location: Location, private dataservice: DataserviceService, private sanitizer: DomSanitizer, private activatedRoute: ActivatedRoute, private formBuilder: FormBuilder, private router: Router, private messageService: MessageService, private confirmationService: ConfirmationService) { }
  items: any[];
  dashboard: MenuItem;
  project: NodeData;
  projectTypes: any[];
  selectedProjectType: any;
  statusTypes: any[];
  priorityTypes: any[];
  editBtnClicked: boolean = false;
  disableEdit: boolean = false;
  statusBtnStyleClass: string = '';
  priorityIconClass: string = '';
  text1: string = '';
  qlLink: any;
  qlImage: any;
  enableCommentBox: boolean = false;
  comments: Comments[];
  comment: string = "";
  progressBarColoredElem: any;
  progressEvent: any;
  allUsers: any;
  userObject = {} as USERMANAGEMENT;
  uploadedFiles: any[] = [];
  form: FormGroup;
  selectedChecklist: any[];
  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.paramId = params['id']
      this.getProjectDetails(this.paramId);
      this.getSelectedProject();
      this.getUserObj();
      this.getHistory();
      this.getSubtasks();
      this.getProgress()
    })
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
    this.projectTypes = [
      'Subtask',
      'Defect',
      'Story',
      'Bug',
      'Change Request'
    ]
    this.hoursInPRMs = [
      'True',
      'False'
    ];
    this.applyStyles();
    this.statusTypes = [
      "Done", "In Progress", "In Review", "Abandoned", "Blocked", "In Test Env", "QA Passed", "In Production"
    ].sort((a, b) => {
      if (a.toLowerCase() < b.toLowerCase()) return -1
      if (a.toLowerCase() > b.toLowerCase()) return 1
      return 0
    })

    this.checkList = [
      {name: "Done", code: "Done", inactive: true},
      {name: "In Progress", code: "In Progress"},
      {name: "In Review", code: "In Review"},
      {name: "Abandoned", code: "Abandoned"},
      {name: "Blocked", code: "Blocked"},
      {name: "In Test Env", code: "In Test Env"},
      {name: "QA Passed", code: "QA Passed"},
      {name: "In Production", code: "In Production"}
    ].sort((a, b) => {
      if (a.name.toLowerCase() < b.name.toLowerCase()) return -1
      if (a.name.toLowerCase() > b.name.toLowerCase()) return 1
      return 0
    })

    this.priorityTypes = [
      "Lowest", "Low", "Medium", "High", "Highest"
    ].sort((a, b) => {
      if (a.toLowerCase() < b.toLowerCase()) return -1
      if (a.toLowerCase() > b.toLowerCase()) return 1
      return 0
    })
    this.form = this.formBuilder.group({
      PRM: [null, Validators.required],
      projectName: [null, Validators.required],
      hoursInPRM: [null, Validators.required],
      issueType: [null, Validators.required],
      priority: [null, Validators.required],
      // marketPriority: [null, Validators.required],
      region: [null, Validators.required],
      projectManager: [null, Validators.required],
      status: [null, Validators.required],
      estimatedHours: [null, Validators.required],
      startDate: [null, Validators.required],
      goLive: [null, Validators.required],
      progress: [null, Validators.required],
      parentTaskId: new FormControl({ disabled: true }, Validators.required),
    });
    this.form.get("parentTaskId").setValue(this.project.IDX);
    this.form.get("issueType").setValue('Subtask');
  }

  getSubtasks() {
    this.dataservice.getSubtasks(this.paramId).subscribe((res) => {
      this.subtasks = res;
    })
  }

  openNew() {
    this.record = {};
    this.submitted = false;
    this.productDialog = true;
    this.form.get("parentTaskId").setValue(this.project.IDX);
    this.form.get("issueType").setValue('Subtask');
  }

  closeDialog() {
    this.productDialog = false;
  }

  createProject() {
    this.dataservice.createRecord(this.form.value).subscribe((res) => {
      this.productDialog = false;
      this.form.reset();
      this.form.get("parentTaskId").setValue(this.project.IDX);
      this.form.get("issueType").setValue('Subtask');
      // this.form.get("projectManager").setValue('Subtask');
      this.subtasks = res.filter((a) => {
        return a.parentTaskId == this.project.IDX;
      });
      this.project = res.filter((a) => {
        return a.IDX == this.project.IDX;
      })[0];
    })
  }


  getProjectDetails(id) {
    this.dataservice.getProjectDetails(id).subscribe((res) => {
      this.dataservice.setselectedProject(res[0]);
      this.project = res[0]
    }, (error) => {
      console.log(error)
    })
  }

  getSubtaskDetails(id) {
    this.dataservice.getProjectDetails(id).subscribe((res) => {
      this.dataservice.setselectedProject(res[0]);
      this.router.navigate([`project-details/${id}`])
    }, (error) => {
      console.log(error)
    })
  }


  getSelectedProject() {
    // let proj = { "IDX": 206, "PRM": 4, "projectName": "Creatasasaiuuuuuuuuuu APIs for adding users", "issueType": "subtask", "priority": "Lowest", "status": "In Progress", "assignee": "Kashi", "reporter": "Pratik", "description": "Description BSL-MC-ED-01-MNTR", "attachments": null, "startDate": "1998-01-23T12:45:56.000Z", "estimatedHours": "16", "parentTaskLink": "https://www.google.com", "comments": "Comments - Philips TS Support", "history": "History", "subTasks": "subtask links", "projectManager": "Proj Manager", "health": "Health - Risky", "region": "Region - TX", "goLive": "go live dt", "checklist": "checklist", "LastModifiedUser": null, "LastModifiedDateTime": null }
    this.dataservice.selectedProject.subscribe((project) => {
      this.project = project;
    })
    this.dataservice.allUsers.subscribe((res) => {
      this.allUsers = res.map((a) => {
        return a.FirstName + ' ' + a.LastName
      });
    })
    setTimeout(() => {
      this.qlLink = document.getElementsByClassName('ql-link')[0];
      this.qlImage = document.getElementsByClassName('ql-image')[0];
      if (this.qlLink) this.qlLink.style.display = 'none';
      if (this.qlImage) this.qlImage.style.display = 'none';
      this.getComments(this.project)
    }, 0)
  }


  getComments(project) {
    this.dataservice.getComments(this.paramId).subscribe((data: Comments[]) => {
      this.comments = data.map((a) => {
        a.CommentDateTime = new Date(a.CommentDateTime).toLocaleString("en", {
          weekday: "short",
          year: "numeric",
          month: "2-digit",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
          timeZoneName: "long"
        })
        return a;
      });
    })
  }

  setStartDate(date: any) {
    if (date) {
      date.setTime(new Date(new Date(date.getTime() - (date.getTimezoneOffset() * 60 *
        1000)).toUTCString()));
    }
    this.project.startDate = date
  }

  editDetails() {
    this.editBtnClicked = true;
    this.disableEdit = true;
    window.localStorage.setItem('oldData', JSON.stringify(this.project));
  }

  saveDetails() {
    this.dataservice.updateProject(this.project).subscribe((res) => {
      this.disableEdit = false;
      this.applyStyles();
      this.oldObj = JSON.parse(window.localStorage.getItem('oldData'));
      let historyObj = {} as HistoryObject;
      for (let key in this.oldObj) {
        if (this.oldObj[key] !== this.project[key]) {
          historyObj.fieldName = key;
          historyObj.oldValue = this.oldObj[key] || "";
          historyObj.newValue = key === 'description' ? this.updatedDescription : this.project[key];
          historyObj.IDX = this.project.IDX;
          historyObj.UserID = this.userObject.UserID;
          historyObj.FirstName = this.userObject.FirstName;
          historyObj.LastName = this.userObject.LastName;
          historyObj.PRM = this.project.PRM;
          historyObj.updatedDateTime = new Date().toLocaleString("en", {
            weekday: "short",
            year: "numeric",
            month: "2-digit",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
            timeZoneName: "long"
          })
          this.historyArr.push(historyObj)
          this.dataservice.saveHistory(historyObj).subscribe((dt) => {
            this.historyArr = dt;  // performance issue; TBD. as multiple calls
          })
        }
      }
      window.localStorage.setItem('newData', JSON.stringify(this.project));

    })

  }

  applyStyles() {
    this.statusBtnStyleClass = this.project.status === 'In Progress' ? 'p-button-warning' : this.project.status === 'Done' ? 'p-button-success'
      : (this.project.status === 'Blocked' || this.project.status === 'Abandoned') ? 'p-button-danger' : 'p-button-primary';
    this.priorityIconClass = this.project.priority === 'Lowest' ? 'fa fa-angle-double-down' : this.project.priority === 'Low' ? 'fa fa-angle-down' : this.project.priority === 'Medium' ? 'fa fa-bars'
      : this.project.priority === 'High' ? 'fa fa-angle-up' : this.project.priority === 'Highest' ? 'fa fa-angle-double-up' : 'fa fa-bars';
  }

  addComment() {
    this.enableCommentBox = !this.enableCommentBox;
  }

  saveComment() {
    let comment = {} as Comments;
    comment.Comment = this.comment;
    comment.CommentDateTime = new Date()
    comment.UserID = this.userObject.UserID;
    comment.PRM = this.project.PRM;
    comment.FirstName = this.userObject.FirstName;
    comment.LastName = this.userObject.LastName;
    comment.IDX = this.project.IDX;

    this.dataservice.saveComments(comment).subscribe((res) => {
      this.comment = ""
      this.addComment();
      this.getComments(this.project)
    })
  }

  getUserObj() {
    this.dataservice.UserObj.subscribe((obj) => {
      this.userObject = obj;
    })
  }

  handleChangeDescription(val) {
    this.updatedDescription = val;
  }

  onUpload1(event) {
    event.preventDefault()
    for (let file of event.files) {
      this.uploadedFiles.push(file);
    }

    // this.messageService.add({severity: 'info', summary: 'File Uploaded', detail: ''});
  }


  onUpload(ev) {
    let formData = new FormData();
    formData.append("file", ev.files[0], ev.files[0].name);
    formData.set("file", ev.files[0], ev.files[0].name);

    var object = {};
    this.filesArr = [];
    let files = ev.files;

    this.dataservice.upload(formData)

  }

  getAttachments() {
    this.dataservice.getAttachments(this.project.IDX).subscribe((files) => {
      this.filesArr = files
    })
  }

  getHistory() {
    this.dataservice.getHistory(this.paramId).subscribe((res) => {
      this.historyArr = res;
    })
  }

  deleteRecord(record) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + record.projectName + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.dataservice.deleteRecord(record).subscribe((data) => {
          this.subtasks = this.subtasks.filter(val => val.IDX !== record.IDX);
        })
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Record Deleted', life: 3000 });
      }
    });
  }

  getProgress() {
    if (this.project && this.project.issueType !== 'Story') {
      this.project.progress = this.project.status === 'In Progress' ? 20 : this.project.status === 'In Review' ? 40 : this.project.status === 'In Test Env' ? 60 : this.project.status === 'QA Passed' ? 80 : this.project.status === 'In Production' ? 90 : this.project.status === 'Done' ? 100 : 0;
    }
  }

  statusChangeHandler(e, popup) {
    if (popup) {
      let progress = e.value.endsWith('In Progress') ? 20 : e.value.endsWith('In Review') ? 40 : e.value.endsWith('In Test Env') ? 60 : e.value.endsWith('QA Passed') ? 80 : e.value.endsWith('In Production') ? 90 : e.value.endsWith('Done') ? 100 : 0;
      this.form.get("progress").setValue(progress);
    } else {
      this.project.progress = e.value === 'In Progress' ? 20 : e.value === 'In Review' ? 40 : e.value === 'In Test Env' ? 60 : e.value === 'QA Passed' ? 80 : e.value === 'In Production' ? 90 : e.value === 'Done' ? 100 : 0;
    }
  }

  cancelHandler() {
    this.disableEdit = !this.disableEdit;
  }

  back(): void {
    this.location.back()
  }


}
