
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [ReactiveFormsModule, ],
  templateUrl: './contacto.component.html',
  styleUrl: './contacto.component.scss'
})
export class ContactoComponent {

  datos: FormGroup;

  constructor(private httpClient: HttpClient) {
    this.datos = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      asunto: new FormControl('', Validators.required),
      mensaje: new FormControl('', Validators.required)
    });
  }

  envioEmail() {
    if (this.datos.invalid) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se admiten campos vacios"
      });
    }else {



    const params = {
        email: this.datos.value.email,
        asunto: this.datos.value.asunto,
        mensaje: this.datos.value.mensaje
    };

    this.httpClient.post('https://tempo-1.onrender.com/contacto', params).subscribe(
        (response: any) => {
            
            Swal.fire({
              icon: "success",
              title: "Correo enviado correctamente!",
              showConfirmButton: false,
              timer: 1500
            });
            
        },
        (error) => {

            Swal.fire({
              icon: "error",
              title: "Error enviando el correo",
              showConfirmButton: false,
              timer: 1500
            });
        }
    );
  }
}
}
