import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RegistroService } from '../../services/registro.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.scss'
})
export class RegistroComponent {


  constructor(private _registro: RegistroService, private router: Router) {

  }

  userRegForm!: FormGroup;

  ngOnInit(): void {
    this.setForm();
  }

  setForm() {
    this.userRegForm = new FormGroup({

      usuario: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      confirmPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),

    })
  }

  registro() {


    console.log(this.userRegForm.value);
    console.log(this.userRegForm.valid);


    if (this.userRegForm.valid) {
      console.log(this.userRegForm.value);
      this._registro.registrarUsuario(this.userRegForm.value).subscribe((data: any) => {
        console.log(data);

        const nombreUsuario = this.userRegForm.get('usuario')?.value;

        this.userRegForm.reset();

        Swal.fire({
          title: `Bienvenido ${nombreUsuario}`,
          text: "Usuario creado correctamente",
          icon: "success",
          showConfirmButton: false,
          timer: 1500
        });

        this.router.navigate(['/login'])
      });
    } else {
      Swal.fire({
        title: "Error",
        text: "No se admiten campos vacios!",
        icon: "error"
      });
    }
  }
}
