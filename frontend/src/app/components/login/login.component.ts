import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LoginService } from '../../services/login.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm!: FormGroup;

  ngOnInit(): void {
    this.setForm();


  }

  constructor(private _router: Router, private _login: LoginService) {

  }

  setForm() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    })
  }

  submit() {
    if (this.loginForm.valid) {

      this._login.loginUsuario(this.loginForm.value).subscribe({
        next: (resp: any) => {

          console.log(resp);

          localStorage.setItem("usuario", resp.result.usuario);
          localStorage.setItem("email", resp.result.email);
          localStorage.setItem("id", resp.result._id);
          localStorage.setItem("token", resp.token);

          let timerInterval: any;

          


          Swal.fire({
            title: "Logueado correctamente!",
            icon: "success",
            timer: 1000,
            didOpen: () => {
              Swal.showLoading();
              const timer: any = Swal.getPopup()?.querySelector("b");
              timerInterval = setInterval(() => {
                timer.textContent = `${Swal.getTimerLeft()}`;
              }, 100);
            },
            willClose: () => {
              clearInterval(timerInterval);
            }
          }).then((result) => {
            if (result.dismiss === Swal.DismissReason.timer) {

              this._router.navigate(['inicio']).then(() => {
                window.location.reload();

              })
            }
          });

        }, error: (err) => {

          if (err.status == 500) {

            Swal.fire({
              title: "Error",
              text: err.error.msg,
              icon: "error",
            });
          }
        }
      });

    }else {
      Swal.fire({
        title: "Error",
        text: "No se admiten campos vacios.",
        icon: "error",
      });
    }
  }

}
