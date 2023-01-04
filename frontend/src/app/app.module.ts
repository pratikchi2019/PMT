import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { CalendarModule } from 'primeng/calendar';
import { SliderModule } from 'primeng/slider';
import { MultiSelectModule } from 'primeng/multiselect';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressBarModule } from 'primeng/progressbar';
import { InputTextModule } from 'primeng/inputtext';
import { FileUploadModule } from 'primeng/fileupload';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TabViewModule } from 'primeng/tabview';
import { TooltipModule } from 'primeng/tooltip';
import { PasswordModule } from 'primeng/password';
import { DataserviceService } from './dataservice.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TreeTableModule } from 'primeng/treetable';
import { TreeModule } from 'primeng/tree';
import { AccordionModule } from 'primeng/accordion';
import { ProjectDetailsComponent } from './project-details/project-details.component';
import { SplitButtonModule } from 'primeng/splitbutton';
import { SplitterModule } from 'primeng/splitter';
import { DividerModule } from 'primeng/divider';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { BadgeModule } from 'primeng/badge';
import { EditorModule } from 'primeng/editor';
import { UserManagementComponent } from './user-management/user-management.component';
import { ImageModule } from 'primeng/image';
import { StatsComponent } from './stats/stats.component';
import { ChartModule } from 'primeng/chart';
import { AppConfigService } from './appconfigservice.service';
import { CardModule } from 'primeng/card';
import { SubtaskComponent } from './subtask/subtask.component';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { DatatableComponent } from './datatable/datatable.component';
import { ArchiveComponent } from './archive/archive.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    ProjectDetailsComponent,
    UserManagementComponent,
    StatsComponent,
    SubtaskComponent,
    DatatableComponent,
    ArchiveComponent,
  ],
  entryComponents: [
    SubtaskComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    BrowserModule,
    AppRoutingModule,
    PasswordModule,
    BrowserModule,
    BrowserAnimationsModule,
    TableModule,
    CalendarModule,
    SliderModule,
    DialogModule,
    MultiSelectModule,
    ContextMenuModule,
    DropdownModule,
    ButtonModule,
    ToastModule,
    InputTextModule,
    ProgressBarModule,
    HttpClientModule,
    FileUploadModule,
    ToolbarModule,
    RatingModule,
    FormsModule,
    RadioButtonModule,
    InputNumberModule,
    ConfirmDialogModule,
    InputTextareaModule,
    TabViewModule,
    TooltipModule,
    TreeTableModule,
    TreeModule,
    AccordionModule,
    SplitButtonModule,
    SplitterModule,
    DividerModule,
    BreadcrumbModule,
    BadgeModule,
    EditorModule,
    ImageModule,
    ChartModule,
    CardModule,
    DynamicDialogModule,
    ToolbarModule,
  ],
  providers: [DataserviceService, MessageService, ConfirmationService, FormBuilder, AppConfigService, DialogService],
  bootstrap: [AppComponent]
})
export class AppModule { }
