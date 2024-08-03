import { Component, OnInit, OnDestroy } from '@angular/core';
import { RegistrosService } from '../../services/registros.service';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-registros',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterOutlet, FormsModule, CurrencyPipe, DatePipe],
  templateUrl: './registros.component.html',
  styleUrl: './registros.component.scss',
})
export class RegistrosComponent implements OnInit, OnDestroy {

  filteredRegistroList: any[] = [];
  searchTerm: string = '';
  index: any;
  registroList: any = [];
  registroForm!: FormGroup;

  constructor(private _registro: RegistrosService, private _router: Router) { }

  ngOnInit(): void {
    this.setForm();
    this.getRegistro();
    window.addEventListener('storage', this.handleStorageChange.bind(this));
  }

  ngOnDestroy(): void {
    window.removeEventListener('storage', this.handleStorageChange.bind(this));
  }

  handleStorageChange(event: StorageEvent) {
    if (event.key === 'token') {
      this.getRegistro(); // Actualiza los registros cuando cambie el token
    }
  }

  setForm() {
    this.registroForm = new FormGroup({
      registroMotivo: new FormControl('', Validators.required),
      registroIngreso: new FormControl('', Validators.required),
      registroGasto: new FormControl('', Validators.required),
      registroMedioPago: new FormControl('', Validators.required),
      registroFecha: new FormControl('', Validators.required),
    });
  }

  submit() {
    if (this.registroForm.invalid) {
      Swal.fire({
        title: "Campos Vacíos",
        text: "No se admiten campos vacios.",
        icon: "error"
      });
      return; // Salir de la función si hay campos vacíos
    }

    const ingreso = this.registroForm.value.registroIngreso;
    const gasto = this.registroForm.value.registroGasto;

    if (ingreso < 0) {
      Swal.fire({
        title: "Monto inválido",
        text: "El ingreso debe ser mayor a 0.",
        icon: "error"
      });
      return;
    }

    if (gasto < 0) {
      Swal.fire({
        title: "Monto inválido",
        text: "El gasto debe ser mayor a 0.",
        icon: "error"
      });
      return;
    }

    this._registro.AgregarNuevoRegistro(this.registroForm.value).subscribe({
      next: (resp) => {
        console.log(resp);
        this.getRegistro(); // Recargar la lista después de agregar un nuevo registro
        this.closeModal('addRegistroModal');
        this.registroForm.reset();
      }, error: (err) => {
        console.log(err);
        if (err.status == 401) {
          this.closeModal('addRegistroModal');
          Swal.fire({
            title: "No autorizado.",
            text: "Login requerido!",
            icon: "error"
          }).then(() => {
            this._router.navigate(['/login']);
          });
        } else {
          Swal.fire({
            title: "Error",
            text: 'Contacta a un administrador de la web!',
            icon: "error"
          });
        }
      }
    });

    console.log(this.registroForm.value);
  }

  openModal(modalId: any, index: any) {
    this.registroForm.reset();

    if (modalId === 'updateRegistroModal') {
      const item = this.registroList.find((item: { _id: any; }) => item._id == index);
      if (item) {
        this.registroForm.setValue({
          registroMotivo: item.registroMotivo,
          registroIngreso: item.registroIngreso,
          registroGasto: item.registroGasto,
          registroMedioPago: item.registroMedioPago || '',
          registroFecha: item.registroFecha,
        });
      }
    }

    this.index = index;
    const modalElement: any = document.getElementById(modalId);
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
  }

  closeModal(modalId: any) {
    const modalElement: any = document.getElementById(modalId);
    const modal = bootstrap.Modal.getInstance(modalElement);
    if (modal) {
      modal.hide();
    }
  }

  delete() {
    this._registro.deleteItem(this.index).subscribe({
      next: (resp: any) => {
        console.log(resp);
        this.getRegistro(); // Recargar la lista después de eliminar un registro
        Swal.fire({
          title: "Eliminado.",
          text: "Item eliminado correctamente",
          icon: "success"
        });
      }, error: (err) => {
        console.log(err);
      }
    });
    this.closeModal('deleteModal');
  }

  update() {
    if (this.registroForm.invalid) {
      Swal.fire({
        title: "Campos Vacíos",
        text: "No se admiten campos vacíos.",
        icon: "error"
      });
      return;
    }

    const ingreso = this.registroForm.value.registroIngreso;
    const gasto = this.registroForm.value.registroGasto;

    if (ingreso < 0) {
      Swal.fire({
        title: "Monto inválido",
        text: "El ingreso debe ser mayor a 0.",
        icon: "error"
      });
      return;
    }

    if (gasto < 0) {
      Swal.fire({
        title: "Monto inválido",
        text: "El gasto debe ser mayor a 0.",
        icon: "error"
      });
      return;
    }

    this.registroForm.value._id = this.index;

    this._registro.updateRegistro(this.registroForm.value).subscribe({
      next: (resp) => {
        console.log(resp);
        this.getRegistro(); // Recargar la lista después de actualizar un registro
        Swal.fire({
          title: "Editado",
          text: "Registro editado correctamente",
          icon: "success"
        });
        this.closeModal('updateRegistroModal');
      }, error: (err) => {
        console.log(err);
      }
    });
  }

  getRegistro() {
    this._registro.getAllRegistro().subscribe({
      next: (resp) => {
        console.log(resp);
        this.registroList = resp;
        this.filterRegistros();
      }, error: (err) => {
        console.log(err);
        if (err.status == 401) {
          Swal.fire({
            title: "No autorizado.",
            text: "Login requerido!",
            icon: "error"
          }).then(() => {
            this._router.navigate(['/login']);
          });
        } else {
          Swal.fire({
            title: "Error",
            text: 'Contacta a un administrador de la web!',
            icon: "error"
          });
        }
      }
    });
  }

  filterRegistros() {
    const term = this.searchTerm.toLowerCase();
    this.filteredRegistroList = this.registroList.filter((item: any) =>
      item.registroMotivo.toLowerCase().includes(term) ||
      item.registroIngreso.toString().includes(term) ||
      item.registroGasto.toString().includes(term) ||
      item.registroMedioPago.toLowerCase().includes(term) ||
      new Date(item.registroFecha).toLocaleDateString().includes(term)
    );
  }
}
