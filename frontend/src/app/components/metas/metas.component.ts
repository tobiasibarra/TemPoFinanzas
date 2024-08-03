import { Component, OnInit } from '@angular/core';
import { MetasService } from '../../services/metas.service';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-metas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterOutlet, FormsModule, CurrencyPipe, DatePipe],
  templateUrl: './metas.component.html',
  styleUrl: './metas.component.scss'
})
export class MetasComponent {
 
  metaForm!: FormGroup;
  addMoneyForm!: FormGroup;

  constructor(private _meta: MetasService, private _router: Router) { }

  ngOnInit(): void {
    this.setForm();
    this.getMeta();
    window.addEventListener('storage', this.handleStorageChange.bind(this));
  }

  ngOnDestroy(): void {
    window.removeEventListener('storage', this.handleStorageChange.bind(this));
  }

  handleStorageChange(event: StorageEvent) {
    if (event.key === 'token') {
      this.getMeta(); 
    }
  }
  
  setForm() {
    this.metaForm = new FormGroup({
      metaMotivo: new FormControl('', Validators.required),
      metaObjetivo: new FormControl('', Validators.required),
      metaAhorrado: new FormControl('', Validators.required),
      metaFecha: new FormControl('', Validators.required),

    })
    this.addMoneyForm = new FormGroup({
      amount: new FormControl(''),
    });

  }

  metaList: any = [

  ]


  submit() {

    if(this.metaForm.invalid){
      Swal.fire({
        title: "Campos Vacíos",
        text: "No se admiten campos vacíos.",
        icon: "error"
      });
      return;
    }else {
    
    
    this._meta.AgregarNuevaMeta(this.metaForm.value).subscribe({
      next: (resp) => {
        console.log(resp);
        this.closeModal('addMetaModal');
        this.metaForm.reset();
      }, error: (err) => {
        console.log(err);
        if (err.status == 401) {
          this.closeModal('addMetaModal');
          Swal.fire({
            title: "No autorizado.",
            text: "Login requerido!",
            icon: "error"
          }).then(() => {
            this._router.navigate(['/login'])

          })
        } else {
          Swal.fire({
            title: "Error",
            text: 'Contacta a un administrador de la web!',
            icon: "error"
          })
        }
      }
    })
    console.log(this.metaForm.value);
    this.metaList.push(this.metaForm.value);
  }
  }


  index: any;

  openModal(modalId: any, index: any) {

    if (modalId == 'updateMetaModal') {



      const item = this.metaList.find((item: { _id: any; }) => item._id == index);

      if (item) {
        this.metaForm = new FormGroup({
          metaMotivo: new FormControl(item.metaMotivo),
          metaObjetivo: new FormControl(item.metaObjetivo),
          metaAhorrado: new FormControl(item.metaAhorrado),
          metaFecha: new FormControl(item.metaFecha),
        })
      }

    } else if (modalId === 'addMetaModal') {
      this.resetMetaForm();
    } else if (modalId === 'addMoneyModal') {
      this.index = index; // Guardar el índice del elemento seleccionado
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

  addMoney() {
    const amount = this.addMoneyForm.value.amount;
    if (amount === '' || amount <= 0) {
      Swal.fire({
          title: "Error",
          text: "Por favor, ingresa una cantidad válida.",
          icon: "error"
      });
      return; // Salir de la función si la cantidad es inválida
  }
  
    const item = this.metaList.find((item: { _id: any; }) => item._id == this.index);
    if (item) {
      item.metaAhorrado += amount; // Sumar la cantidad a lo ahorrado
      this._meta.updateMeta(item).subscribe({
        next: (resp) => {
          console.log(resp);
          this.closeModal('addMoneyModal');
          this.addMoneyForm.reset();
          Swal.fire({
            title: "Agregado",
            text: "Dinero agregado exitosamente",
            icon: "success"
          });
        }
      });
    }
  }

  delete() {
    this._meta.deleteItem(this.index).subscribe({
      next: (resp: any) => {
        console.log(resp)
        const updatedData = this.metaList.filter((item: { _id: any; }) => item._id != resp.result._id)


        this.metaList = [];
        this.metaList = updatedData
        console.log(updatedData)

        Swal.fire({
          title:"Eliminado.",
          text: "Item eliminado correctamente",
          icon: "error"
        })

      }, error: (err) => {
        console.log(err)

      }
    })
    this.closeModal('deleteModal');
  }

  update() {
    const { metaMotivo, metaObjetivo, metaAhorrado, metaFecha } = this.metaForm.value;

    // Validar que no haya campos vacíos
    if (!metaMotivo || !metaObjetivo || metaAhorrado === '' || !metaFecha) {
        Swal.fire({
            title: "Error",
            text: "Por favor, completa todos los campos.",
            icon: "error"
        });
        return; // Salir de la función si hay campos vacíos
    }

    console.log(this.metaForm.value);
    this.metaForm.value._id = this.index;

    this._meta.updateMeta(this.metaForm.value).subscribe({
      next: (resp) => {
        console.log(resp);
        this.closeModal('updateMetaModal');

        let indexNo = this.metaList.findIndex((item: { _id: any; }) => item._id == this.index);
        console.log(indexNo);

        if (indexNo !== -1) {
          this.metaList[indexNo].metaMotivo = this.metaForm.value.metaMotivo;
          this.metaList[indexNo].metaObjetivo = this.metaForm.value.metaObjetivo;
          this.metaList[indexNo].metaAhorrado = this.metaForm.value.metaAhorrado;
          this.metaList[indexNo].metaFecha = this.metaForm.value.metaFecha;
        }
        Swal.fire({
          title: "Editado",
          text: "Editado",
          icon: "success"
        })

      }, error: (err) => {
        console.log(err)

      }
    })


  }

  

  getMeta() {
    this._meta.getAllMeta().subscribe({
      next: (resp) => {
        console.log(resp);
        this.metaList = resp;

      }, error: (err) => {
        console.log(err);

        if (err.status == 401) {
          this.closeModal('addMetaModal');
          Swal.fire({
            title: "No autorizado.",
            text: "Login requerido!",
            icon: "error"
          }).then(() => {
            this._router.navigate(['/login'])

          })
        } else {
          Swal.fire({
            title: "Error",
            text: 'Contacta a un administrador de la web!',
            icon: "error"
          })
        }

      }
    })
  }

  getPercentage(item: any): number {
    const porcentaje = (item.metaAhorrado / item.metaObjetivo) * 100;
    return Math.min(porcentaje, 100); // Para asegurarse de que no supere el 100%
  }

  resetMetaForm() {
    this.metaForm.reset({
      metaMotivo: '',
      metaObjetivo: '',
      metaAhorrado: '',
      metaFecha: ''
    });
}
}
