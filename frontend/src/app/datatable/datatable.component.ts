import { Component, Input, OnInit, DoCheck, KeyValueDiffers, KeyValueDiffer, SimpleChanges } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { DataserviceService } from '../dataservice.service';
import { FHS } from '../models/fhs';
//import * as jsPDF from 'jspdf';
// import jsPDF = require('jspdf') // // typescript without esModuleInterop flag
// import jsPDF from 'yworks-pdf' // using yworks fork
// import jsPDF from 'jspdf/dist/jspdf.node.debug' // for nodejs
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

declare const require: any;
@Component({
  selector: 'app-datatable',
  templateUrl: './datatable.component.html',
  styles: [`
        :host ::ng-deep .p-dialog .product-image {
            width: 150px;
            margin: 0 auto 2rem auto;
            display: block;
        }
    `],
  styleUrls: ['./datatable.component.scss']
})
export class DatatableComponent implements OnInit {
  productDialog: boolean;

  @Input() headerName = '';

  @Input() parentHeaderName = '';

  fhs: FHS[] = [];

  tabledata: FHS[] = [];

  record: FHS;

  selectedProducts: FHS[];

  submitted: boolean;

  statuses: any[];

  exportColumns: any[];

  EMR: any[];

  dept: any[];

  selectedRegion;

  selectedState;

  selectedEMR;

  selectedHospital;

  selectedDept;

  disabledHospital: boolean = true;

  disabledState: boolean = true;

  disabledDept: boolean = true;

  differ: KeyValueDiffer<string, any>;

  disabledNew: boolean = true;

  hospitalList: any[] = [];

  deptList: any[] = [];

  viewDialog: boolean = false;

  cols: any[];

  globalFilter: string;

  RegionArr: any[];

  StateArr: any[];

  disableRegion: boolean = true;

  userRole: any;

  additionalComments: string = " "

  newDialog: boolean = false;
  
  constructor(private differs: KeyValueDiffers, private dataService: DataserviceService, private messageService: MessageService, private confirmationService: ConfirmationService) { }
  ngOnInit() {
    this.getData()
    this.cols = [
      { field: 'Region', header: 'Region' },
      { field: 'State', header: 'State' },
      { field: 'Hospital', header: 'Hospital' },
      { field: 'Department', header: 'Department' },
      { field: 'Room', header: 'Room' },
      { field: 'Bed', header: 'Bed' },
      { field: 'DeviceID', header: 'Device ID' },
      { field: 'DeviceName', header: 'Device Name' },
      { field: 'MPIID', header: 'MPI ID' },
      { field: 'AIP', header: 'AIP' },
      { field: 'Contacts', header: 'Contacts' },
      { field: 'ServerConDetails', header: 'Remote Desktop' },
      { field: 'DataflowDiagram', header: 'Dataflow Diagram' },
      { field: 'Workflow', header: 'Workflow' },
      { field: 'TroubleshootingDocs', header: 'Troubleshooting Docs' },
      { field: 'SNOWGroup', header: 'SNOW Group' },
      { field: 'Comments', header: 'Comments' }
    ];
    this.dataService.userRole.subscribe((data) => {
      this.userRole = data
    })
  }

  getData() {
    this.dataService.getAllRegions().subscribe((data) => {
     // this.tabledata = [];
      console.log(data)
      if (data.length > 0) {
        let result = data.map(({ Region }) => Region)
        this.RegionArr = [...new Set(result)].sort(Intl.Collator().compare)
      }
      this.selectedDept = null;
      this.selectedHospital = null;
      this.selectedEMR = null;
      this.selectedRegion = null;
      this.disabledDept = true;
      this.disabledHospital = true;
      this.disableRegion = true;
      this.additionalComments = "";
      this.disabledState = true;
    })
   // this.removeFilters("Refresh")
  }

  openNew() {
    this.record = {};
    this.submitted = false;
    this.newDialog = true;
  }

  deleteSelectedProducts() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected records?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.tabledata = this.tabledata.filter(val => !this.selectedProducts.includes(val));
        this.selectedProducts.forEach((val) => {
          this.dataService.deleteRecordInventory(val).subscribe((data) => {
            console.log(data)
            this.removeFilters("refresh")
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Record Deleted', life: 3000 });
          })
        })
        this.selectedProducts = null;
      }
    });
  }

  editRecord(fhs: FHS) {
    this.record = { ...fhs };
    this.productDialog = true;
  }

  viewRecord(fhs: FHS) {
    this.record = { ...fhs };
    this.viewDialog = true;
  }

  deleteRecord(record: FHS) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + record.Hospital + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.dataService.deleteRecord(record).subscribe((data) => {
          console.log(data)
          this.tabledata = this.tabledata.filter(val => val.IDX !== record.IDX);
          this.removeFilters("refresh")
        })
        this.record = {};
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Record Deleted', life: 3000 });
      }
    });
  }

  hideDialog() {
    this.productDialog = false;
    this.submitted = false;
    this.viewDialog = false;
    this.newDialog = false;
  }

  saveProduct() {
    this.submitted = true;
    if(this.additionalComments.trim()) {
      this.record.Comments = this.record.Comments ? this.record.Comments + " " + this.additionalComments : this.additionalComments ? this.additionalComments: "";
    }
    if (this.record.Hospital.trim()) {
     // this.record.EMR = "Epic";
     // this.record.Comments = this.record.Comments ? this.record.Comments + " " + this.additionalComments : " " + this.additionalComments
      if (this.record.IDX) {
        this.tabledata[this.findIndexById(this.record.IDX)] = this.record;
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Record Updated', life: 3000 });
        this.dataService.updateRecord(this.record).subscribe((data) => {
          console.log(data)
          this.tabledata = data;
          this.selectedDept = null;
          this.selectedHospital = null;
          this.selectedEMR = null;
          this.selectedState = null;
          this.disabledDept = true;
          this.disabledHospital = true;
          this.disabledState = true;
          this.globalFilter = null;
          this.additionalComments = ""
          this.removeFilters("refresh")
        })
      }
      else {
        console.log(this.record)
        this.additionalComments = ""
        this.dataService.createRecordInventory(this.record).subscribe((data) => {
          console.log(data)
          if (data.originalError?.info?.event === "errorMessage") {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: data.originalError.info.message, life: 3000 });
          }
          else {
            this.removeFilters("refresh")
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'New Record Created', life: 3000 });
          }
        })
      }
      // this.tabledata = [...this.tabledata];
      this.productDialog = false;
      this.newDialog = false;
      //this.tabledata.push(this.record);
      this.record = {};
    }
  }

  findIndexById(id: number): number {
    let index = -1;
    for (let i = 0; i < this.fhs.length; i++) {
      if (this.tabledata[i].IDX === id) {
        index = i;
        break;
      }
    }
    return index;
  }

  createId(): string {
    let id = '';
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }

  exportPdf() {
    import("jspdf").then((jsPDF: any) => {
      import("jspdf-autotable").then(x => {
        const doc = new jsPDF.default(0, 0);
        doc.autoTable(this.exportColumns, this.tabledata);
        doc.save('products.pdf');
      })
    })
  }

  // handleChangeEMR(e) {
  //   this.selectedRegion = null;
  //   this.selectedHospital = null;
  //   this.selectedDept = null;
  //   this.disabledNew = true;
  //   this.tabledata = []
  //   if (e.value) {
  //     this.dataService.getDataByEMR(e.value).subscribe((data) => {
  //       console.log(data)
  //       this.fhs = data
  //       this.tabledata = data
  //       if (this.tabledata.length > 0) {
  //         this.disableRegion = false;
  //         this.disabledHospital = true;
  //         let result = this.tabledata.map(({ Region }) => Region)
  //         this.RegionArr = [...new Set(result)]
  //       }
  //     })

  //   }
  //   if (!this.selectedHospital) {
  //     this.disabledDept = true
  //   }
  // }

  handleChangeRegion(e) {
    this.selectedState = null;
    this.selectedHospital = null;
    this.selectedDept = null;
    this.disabledNew = true;
    this.tabledata = []
    if (e.value) {
      this.dataService.getData(e.value).subscribe((data) => {
        console.log(data)
        this.fhs = data
        this.tabledata = data
        if (this.tabledata.length > 0) {
          this.disabledState = false;
          let result = this.tabledata.map(({ State }) => State)
          this.StateArr = [...new Set(result)].sort(Intl.Collator().compare)
        }
      })

    }
    if (!this.selectedState) {
      this.disabledHospital = true
    }
  }

  handleChangeState(e) {
    this.selectedHospital = null;
    this.selectedDept = null;
    this.disabledNew = true;
    this.tabledata = []
    if (e.value) {
      this.dataService.getDataState(this.selectedRegion, this.selectedState).subscribe((data) => {
        console.log(data)
        this.fhs = data
        this.tabledata = data
        if (this.tabledata.length > 0) {
          this.disabledHospital = false;
          let result = this.tabledata.map(({ Hospital }) => Hospital)
          this.hospitalList = [...new Set(result)].sort(Intl.Collator().compare)
        }
      })

    }
    if (!this.selectedHospital) {
      this.disabledDept = true
    }
  }

  handleChangeHospital(e) {
    this.selectedDept = null;
    if (this.selectedHospital) {
      //this.tabledata = []
      this.dataService.getDataHospital(this.selectedRegion, this.selectedState, this.selectedHospital)
        .subscribe(data => {
          console.log(data)
          this.tabledata = data
          if (this.tabledata.length > 0) {
            let result = this.tabledata.map(({ Department }) => Department)
            this.deptList = [...new Set(result)].sort(Intl.Collator().compare)
          }
        })
      this.disabledDept = false
    }
  }

  handleChangeDept(e) {
    if (this.selectedHospital) {
      this.disabledDept = false
      this.disabledNew = false;
      this.dataService.getDataDept(this.selectedRegion, this.selectedState, this.selectedHospital, this.selectedDept)
        .subscribe(data => {
          console.log(data)
          this.tabledata = data
        })
    }
  }

  removeFilters(e) {
    this.dataService.getAllDataInventory().subscribe((data) => {
      this.tabledata = data;
      console.log(data)
      if (data.length > 0) {
        let result = this.tabledata.map(({ Region }) => Region)
        this.RegionArr = [...new Set(result)].sort(Intl.Collator().compare);
      }
      this.selectedState = null;
      this.selectedDept = null;
      this.selectedHospital = null;
      this.selectedEMR = null;
      this.selectedRegion = null;
      this.disabledDept = true;
      this.disabledHospital = true;
      this.disableRegion = true;
      this.disabledState = true
      this.additionalComments = ""
    })
  }

  // changeAddComments(e) {
  //  console.log(this.record)
  //  this.record.Comments = this.record.Comments + this.additionalComments
  // }

}
