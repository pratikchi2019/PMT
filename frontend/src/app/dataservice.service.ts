import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { retry, catchError } from 'rxjs/operators';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { Comments } from './models/comments';
@Injectable({
  providedIn: 'root'
})

export class DataserviceService {

  userRole: BehaviorSubject<any> = new BehaviorSubject(null);
  authenticated$: BehaviorSubject<any> = new BehaviorSubject(false);
  isLoggedInUser: BehaviorSubject<any> = new BehaviorSubject(false);
  loginDateTime: BehaviorSubject<any> = new BehaviorSubject("");
  logoutDateTime: BehaviorSubject<any> = new BehaviorSubject("");
  userID: BehaviorSubject<any> = new BehaviorSubject("");
  FirstName: BehaviorSubject<any> = new BehaviorSubject("");
  LastName: BehaviorSubject<any> = new BehaviorSubject("");
  IDX: BehaviorSubject<any> = new BehaviorSubject(null);
  selectedProject: BehaviorSubject<any> = new BehaviorSubject(null);
  UserObj: BehaviorSubject<any> = new BehaviorSubject(null);
  allUsers: BehaviorSubject<any> = new BehaviorSubject(null);
  constructor(private http: HttpClient) { }
  baseURL = "http://localhost:8085/api"
  //baseURL = "http://rdcquonapp001.chi.catholichealth.net:8085/api"
  //baseURL = "https://rdcquonapp001.chi.catholichealth.net/api"
  getRole() {
    this.userRole.subscribe((dt) => {
      return dt
    })
  }

  setRole(role: any) {
    this.userRole.next(role);
  }

  getSelectedProject() {
    this.selectedProject.subscribe((project) => {
      return project;
    })
  }

  setselectedProject(project) {
    this.selectedProject.next(project);
  }

  loginInfo(userID: any, LoginDateTime: string, LogoutDateTime: string) {
    return this.http.post<any>(this.baseURL + "/loginInfo", { userID, LoginDateTime, LogoutDateTime })
  }

  logout(idx: any, uid: any, loginDtTime: { toLocaleString: (arg0: string, arg1: { weekday: string; year: string; month: string; day: string; hour: string; minute: string; second: string; timeZoneName: string; }) => any; }, logoutDtTime: Date) {
    let logoutDtTm = logoutDtTime.toLocaleString("en", {
      weekday: "short",
      year: "numeric",
      month: "2-digit",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      timeZoneName: "long"
    })
    let loginDtTm = loginDtTime.toLocaleString("en", {
      weekday: "short",
      year: "numeric",
      month: "2-digit",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      timeZoneName: "long"
    })
    return this.http.post<any>(this.baseURL + "/logout", { idx, uid, loginDtTm, logoutDtTm })
  }

  getAllData() {
    return this.http.get<any>(this.baseURL + "/data")
  }

  getProjectDetails(projectId) {
    return this.http.post<any>(this.baseURL + '/projectDetails', { projectId })
  }

  getAllRegions() {
    return this.http.get<any>(this.baseURL + "/regions")
  }

  getData(Region: any) {
    return this.http.post<any>(this.baseURL + "/region", { Region })
  }
  getDataByEMR(emr: any) {
    return this.http.post<any>(this.baseURL + "/emr", emr)
  }

  getDataState(selectedRegion: any, state: any) {
    return this.http.post<any>(this.baseURL + "/state", { selectedRegion, state })
  }

  getDataHospital(selectedRegion: any, state: any, hospitalName: any) {
    return this.http.post<any>(this.baseURL + "/hospital", { selectedRegion, state, hospitalName })
  }


  getDataDept(selectedRegion: any, state: any, hospital: any, department: any) {
    return this.http.post<any>(this.baseURL + "/department", { selectedRegion, state, hospital, department })
  }

  createRecord(record: any) {
    return this.http.post<any>(this.baseURL + "/create", record).pipe(

      retry(1),

      catchError(this.handleError)

    );
  }
  updateProject(project: any) {
    return this.http.put<any>(this.baseURL + "/update", { project })
  }

  deleteRecord(record: any) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }), body: record
    };
    return this.http.delete<any>(this.baseURL + "/delete", httpOptions)
  }

  getComments(idx: any) {
    return this.http.post<any>(this.baseURL + "/comments", { idx })
  }

  saveComments(comment: Comments) {
    return this.http.post<any>(this.baseURL + "/saveComment", { comment })
  }

  isLoggedIn(userId?: string, password?: any) {
    return this.http.post<any>(this.baseURL + "/login", { userId, password })
    // return true;
  }

  handleError(error: { error: { message: any; }; status: any; message: any; }) {

    let errorMessage = '';

    if (error.error instanceof ErrorEvent) {

      // client-side error

      errorMessage = `Error: ${error.error.message}`;

    } else {

      // server-side error

      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;

    }

    //window.alert(errorMessage);

    return throwError(errorMessage);

  }

  getAllUsers() {
    return this.http.get<any>(this.baseURL + "/users")
  }

  addUser(user: any) {
    return this.http.post<any>(this.baseURL + "/createUser", user).pipe(

      retry(1),

      catchError(this.handleError)

    );
  }
  deleteUser(user: any) {
    return this.http.post<any>(this.baseURL + "/deleteUser", user).pipe(

      retry(1),

      catchError(this.handleError)

    );
  }

  updateUser(user: any) {
    return this.http.post<any>(this.baseURL + "/updateUser", user).pipe(

      retry(1),

      catchError(this.handleError)

    );
  }

  // upload(files) {
  //   const httpOptions = {
  //     headers: new HttpHeaders().delete('Content-Type')
  //   };
  //   return this.http.post<any>(this.baseURL + "/upload", { files }).pipe(

  //     retry(1),

  //     catchError(this.handleError)

  //   );
  // }

  upload(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    const req = new HttpRequest('POST', `${this.baseURL}/upload`, formData, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.http.request(req);
  }
}
