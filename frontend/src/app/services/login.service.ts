import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  url = "https://tempo-1.onrender.com/login";
  constructor(private http: HttpClient,private router: Router) { }

  isLogedIn= new BehaviorSubject<Boolean>(false);

  loginUsuario(data: any) {
    return this.http.post(this.url, data);
  }

  logout() {
    localStorage.removeItem('token'); // O el método que uses para almacenar el token
    localStorage.clear(); // Limpia todos los datos almacenados en localStorage
    this.isLogedIn.next(false);
    window.location.reload();
    this.router.navigate(['/login']);
  }
}
