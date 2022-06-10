import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppConfigService } from '../appconfigservice.service';
import { DataserviceService } from '../dataservice.service';
import { AppConfig } from '../models/appconfig';
@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit {
  data: any;

  chartOptions: any;

  subscription: Subscription;

  config: AppConfig;
  allData: any;
  constructor(private configService: AppConfigService, private dataservice: DataserviceService) { }

  ngOnInit(): void {
    this.getData();


    this.config = this.configService.config;
    this.updateChartOptions();
    this.subscription = this.configService.configUpdate$.subscribe(config => {
      this.config = config;
      this.updateChartOptions();
    });
  }

  updateChartOptions() {
    this.chartOptions = this.config && this.config.dark ? this.getDarkTheme() : this.getLightTheme();
  }

  getLightTheme() {
    return {
      plugins: {
        legend: {
          labels: {
            color: '#495057'
          }
        }
      }
    }
  }

  getDarkTheme() {
    return {
      plugins: {
        legend: {
          labels: {
            color: '#ebedef'
          }
        }
      }
    }
  }

  getData() {
    this.dataservice.getAllData().subscribe((res) => {
      this.allData = res;
      let labels = ['In Progress', 'In Test Env', 'Done', 'Blocked'];

      let data = [this.allData.filter((x) => x.status == 'In Progress').length, 
      this.allData.filter((x) => x.status == 'In Test Env').length, 
      this.allData.filter((x) => x.status == 'Done').length,
      this.allData.filter((x) => x.status == 'Blocked').length]

      this.data = {
        labels: labels,
        datasets: [
          {
            data: data,
            backgroundColor: [
              "#FFA726",
              "#42A5F5",
              "#66BB6A",
              "#cf1208"
            ],
            hoverBackgroundColor: [
              "#FFB74D",
              "#64B5F6",
              "#81C784",
              "#e3665f"
            ]
          }
        ]
      };
    })
  }

}
