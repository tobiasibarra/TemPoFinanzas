import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  isMenuOpen = false;

  constructor(private router: Router) {}

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  salir() {
    Swal.fire({
      title: "¿Seguro que queres desloguearte?",
      showDenyButton: true,
      confirmButtonText: "Si.",
      denyButtonText: `No.`
    }).then((result) => {
      if (result.isConfirmed) {
        let timerInterval: any;
        Swal.fire({
          title: "Adios!",
          icon: "success",
          timer: 1000,
          didOpen: () => {
            Swal.showLoading();
            timerInterval = setInterval(() => {
              Swal.getTimerLeft();
            }, 100);
          },
          willClose: () => {
            clearInterval(timerInterval);
          }
        }).then((result) => {
          if (result.dismiss === Swal.DismissReason.timer) {
            localStorage.removeItem('token');
            this.router.navigate(['login']);
          }
        });
      }
    });
  }
}
