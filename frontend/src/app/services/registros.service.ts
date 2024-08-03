import { Injectable } from '@angular/core';
import { Registro } from '../clases/registro.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RegistrosService {

  url = "https://tempo-1.onrender.com/";

  constructor(private http: HttpClient) {

  }


  token: any = localStorage.getItem('token');

  AgregarNuevoRegistro(data: any) {
    console.log(this.token);

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Autorizacion': this.token
    })

    return this.http.post(this.url+"registros", data, { headers: headers });

  }

  getAllRegistro() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Autorizacion': this.token
    })
    return this.http.get(this.url+"registros", { headers: headers });
  }

  getAllRegistroP() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Autorizacion': this.token
    })
    return this.http.get(this.url+"presupuesto", { headers: headers });
  }
 


  updateRegistro(data: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Autorizacion': this.token
    })

    return this.http.put(this.url +"registros", data, { headers: headers });
  }

  deleteItem(id: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Autorizacion': this.token
    })
    return this.http.delete(this.url + "registros/" + id, { headers: headers });
  }
  
  





  // private registros: Registro[] = [];
  // sumaImportes: number = 0;
  // restaImportes: number = 0;

  // constructor(private http: HttpClient) {
  //   // Obtener registros almacenados en localStorage al inicializar el servicio
  //   const registrosString = localStorage.getItem('registros');
  //   if (registrosString) {
  //     this.registros = JSON.parse(registrosString);
  //     this.actualizarSumaImportes();
  //     this.actualizarRestaImportes();
  //   }
  // }

  // agregarRegistro(registro: Registro): void {
  //   // Guardar registros en localStorage
  //   this.registros.push(registro);
  //   localStorage.setItem('registros', JSON.stringify(this.registros));
  //   this.actualizarSumaImportes();
  //   this.actualizarRestaImportes();
  // }



  // obtenerRegistros(): Registro[] {

  //   return this.registros;
  // }

  // eliminarRegistro(index: number): void {
  //   this.registros.splice(index, 1);
  //   this.actualizarLocalStorage();
  // }

  // editarRegistro(index: number, nuevoRegistro: Registro): void {
  //   this.registros[index] = nuevoRegistro;
  //   this.actualizarLocalStorage();
  // }

  // private actualizarLocalStorage(): void {
  //   localStorage.setItem('registros', JSON.stringify(this.registros));
  // }

  // private actualizarSumaImportes(): void {
  //   this.sumaImportes = this.registros.reduce((total, registro) => total + registro.ingreso, 0);
  // }

  // private actualizarRestaImportes(): void {
  //   this.restaImportes = this.registros.reduce((total, registro) => total + registro.gasto, 0);
  // }
}
