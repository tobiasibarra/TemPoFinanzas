import { Injectable } from '@angular/core';
import { Metas } from '../clases/metas';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MetasService {

  url = "https://tempo-1.onrender.com/";

  constructor(private http: HttpClient) {

  }


  token: any = localStorage.getItem('token');

  AgregarNuevaMeta(data: any) {
    console.log(this.token);

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Autorizacion': this.token
    })

    return this.http.post(this.url+"metas", data, { headers: headers });

  }

  getAllMeta() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Autorizacion': this.token
    })
    return this.http.get(this.url+"metas", { headers: headers });
  }

 


  updateMeta(data: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Autorizacion': this.token
    })

    return this.http.put(this.url +"metas", data, { headers: headers });
  }

  deleteItem(id: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Autorizacion': this.token
    })
    return this.http.delete(this.url + "metas/" + id, { headers: headers });
  }
  
  
}
