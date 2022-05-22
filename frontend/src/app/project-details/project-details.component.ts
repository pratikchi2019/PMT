import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MenuItem } from 'primeng/api';
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

  constructor(private dataservice: DataserviceService, private sanitizer:DomSanitizer) { }
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
  ngOnInit(): void {
    this.getSelectedProject();
    this.getUserObj();
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

    this.applyStyles();
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
    // this.getAttachments();
  }


  getSelectedProject() {
    let proj = { "IDX": 206, "PRM": 4, "projectName": "Creatiuuuuuuuuuu APIs for adding users", "issueType": "subtask", "priority": "Lowest", "status": "In Progress", "assignee": "Kashi", "reporter": "Pratik", "description": "Description BSL-MC-ED-01-MNTR", "attachments": null, "startDate": "1998-01-23T12:45:56.000Z", "estimatedHours": "16", "parentTaskLink": "https://www.google.com", "comments": "Comments - Philips TS Support", "history": "History", "subTasks": "subtask links", "projectManager": "Proj Manager", "health": "Health - Risky", "region": "Region - TX", "goLive": "go live dt", "checklist": "checklist", "LastModifiedUser": null, "LastModifiedDateTime": null }
    this.dataservice.selectedProject.subscribe((project) => {
      this.project = project || proj
    })
    this.dataservice.allUsers.subscribe((res) => {
      console.log(res)
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
    this.dataservice.getComments(project.IDX).subscribe((data: Comments[]) => {
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
    this.project.attachments = null;
    this.dataservice.updateProject(this.project).subscribe((res) => {
      console.log(res)
      this.disableEdit = false;
      this.applyStyles();
      this.oldObj = JSON.parse(window.localStorage.getItem('oldData'));
      for (let key in this.oldObj) {
        let historyObj = {} as HistoryObject;
        if (this.oldObj[key] !== this.project[key]) {
          historyObj.fieldName = key;
          historyObj.oldValue = this.oldObj[key];
          historyObj.newValue = key === 'description' ? this.updatedDescription : this.project[key];
          historyObj.IDX = this.project.IDX;
          historyObj.UserID = this.userObject.UserID;
          historyObj.FirstName = this.userObject.FirstName;
          historyObj.LastName = this.userObject.LastName;
          historyObj.PRM = this.project.PRM;
          this.historyArr.push(historyObj)
        }
      }
      console.log(this.historyArr)
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
    formData.append("fileRect", ev.files[0]);
    var object = {};
    formData.forEach((value, key) => object[key] = value);
    this.filesArr = [];
    let files = ev.files;
    for (let i = 0; i < files.length; i++) {
      let file = {};
      file['url'] = files[i].objectURL.changingThisBreaksApplicationSecurity;
      file['name'] = files[i].name;
      file['IDX'] = this.project.IDX;
      file['UserID'] = this.userObject?.UserID || "";
      file['FirstName'] = this.userObject?.FirstName || "";
      file['LastName'] = this.userObject?.LastName || "";
      file['PRM'] = this.project.PRM;
      file['FileSize'] = files[i].size;
      file['UploadDateTime'] =  new Date().toLocaleString("en", {
        weekday: "short",
        year: "numeric",
        month: "2-digit",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        timeZoneName: "long"
      })
     
      this.dataservice.upload(file).subscribe((dt) => {
        console.log(dt)
        // dt.map((a)=>{
        //   a.Url = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(new Blob(a.Url, {type: "application/zip"})));
        // });
        this.filesArr = dt;
        // let url = JSON.parse(dt[1].attachments).file.url
        // this.previewUrl = this.sanitizer.bypassSecurityTrustUrl(url);
        // var link = document.createElement("a");
        // link.download = "name";
        // link.href = url;
        // document.body.appendChild(link);
        // // link.click();
        // document.body.removeChild(link);
        // // delete link;
        // let sanitizedUrl = this.sanitizer.bypassSecurityTrustUrl(url)
      })
    }
    
  }

  getAttachments() {
    this.dataservice.getAttachments(this.project.IDX).subscribe((files) => {
      this.filesArr = files
    })
  }


}
