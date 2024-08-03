import { Component, OnInit } from '@angular/core';
import { Registro } from '../../clases/registro.model';
import { RegistrosService } from '../../services/registros.service';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { FormControl, FormGroup } from '@angular/forms';
import { NgxEchartsDirective, provideEcharts } from 'ngx-echarts';
import { EChartsOption } from 'echarts';

@Component({
  selector: 'app-presupuesto',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, NgxEchartsDirective],
  templateUrl: './presupuesto.component.html',
  styleUrl: './presupuesto.component.scss',
  providers: [
    provideEcharts(),
  ]
})
export class PresupuestoComponent {

 

 

  ngOnInit(): void {
    this.setForm();
    this.getRegistro();
  }

  constructor(private _registro: RegistrosService) {

  }

  registroForm!: FormGroup;
  registroList: any = [];
  ingresosList: any = [];
  gastosList: any = [];
  totalIngresos: number = 0;
  totalGastos: number = 0;

  setForm() {
    this.registroForm = new FormGroup({
      registroMotivo: new FormControl(''),
      registroIngreso: new FormControl(''),
      registroGasto: new FormControl(''),
      registroMedioPago: new FormControl(''),
      registroFecha: new FormControl(''),

    })


  }


  getRegistro() {

    this._registro.getAllRegistroP().subscribe({
      next: (resp) => {
        console.log(resp);
        this.registroList = resp;
        this.calculateTotals();

      }, error: (err) => {
        console.log(err);
      }
    })
  }

  calculateTotals() {
    this.ingresosList = this.registroList.filter((item: any) => item.registroIngreso > 0);
    this.gastosList = this.registroList.filter((item: any) => item.registroGasto > 0);

    this.totalIngresos = this.ingresosList.reduce((acc: number, item: any) => acc + (item.registroIngreso || 0), 0);
    this.totalGastos = this.gastosList.reduce((acc: number, item: any) => acc + (item.registroGasto || 0), 0);

    this.updateChart();
   }

   chartOption: EChartsOption = {};

   updateChart() {
    const total = this.totalIngresos + this.totalGastos;
    const ingresoPercentage = this.totalIngresos / total * 100;
    const gastoPercentage = this.totalGastos / total * 100;

    this.chartOption = {
      series: [
        {
          name: 'Distribución de Presupuesto',
          type: 'pie',
          data: [
            { value: ingresoPercentage, name: 'Ingresos', itemStyle: { color: 'green' } },
            { value: gastoPercentage, name: 'Gastos', itemStyle: { color: 'red' } }
          ],
          label: {
            show: true,
            formatter: '{b}: {d}%',
          }
        }
      ]
    };
  }


  
}
