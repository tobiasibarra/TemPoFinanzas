import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.scss'
})
export class InicioComponent {
 
  constructor(private router: Router) {

  }

  goTo() {
    this.router.navigate(['/registros']);
  }

}
