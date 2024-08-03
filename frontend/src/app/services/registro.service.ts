import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RegistroService {

  url="https://tempo-1.onrender.com/";
  constructor(private http:HttpClient) { }

  registrarUsuario(data: any) {
    return this.http.post(this.url, data);
  }
}
