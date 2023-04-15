import { Component, OnInit } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { ModosModel } from 'src/app/models/ModosModel';
import { ModosService } from 'src/app/services/modos.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PuntosModel } from 'src/app/models/PuntosModel';
import { PuntosService } from 'src/app/services/puntos.service';

@Component({
  selector: 'app-centro-control',
  templateUrl: './centro-control.component.html',
})

export class CentroControlComponent implements OnInit {

  isChecked: boolean = false; 
  operationMode: string = 'Puntos';
  PuntosDefinidos: ModosModel[];
  MarchasDefinidas: ModosModel[];

  puntosHome: PuntosModel;

  patasForm: FormGroup;



  constructor(private fb: FormBuilder,
    private modosService: ModosService,
    private puntosService: PuntosService,
    private toastr: ToastrService
    ) {}

  ngOnInit(): void {
    this.loadData();
    this.initFilterForm();
  }

  initFilterForm() {
    this.patasForm = this.fb.group({
      P1X: [0],
      P1Y: [0],
      P2X: [0],
      P2Y: [0],
      P3X: [0],
      P3Y: [0],
      P4X: [0],
      P4Y: [0],
    });
  }

  loadData(){
    let obs: Observable<any>[] = [];
    obs.push(this.modosService.GetModoActual());
    obs.push(this.modosService.GetModos());
    obs.push(this.puntosService.GetPuntosById(1));

    forkJoin(obs).subscribe({
      next: response => {
        if(response[0] == null){
          this.isChecked = false
        }
        else{
          this.isChecked = true
        }

        this.PuntosDefinidos = response[1].filter((elemento) => elemento.seccionId === 1 || elemento.seccionId === 2);
        
        this.MarchasDefinidas = response[1].filter((elemento) => elemento.seccionId === 4);

        this.puntosHome = response[2][0];

        // this.toastr.success(this.isChecked == true ? "Robot encendido con éxtio" : "Robot apagado con éxito");
      },
      error: err => {
        console.log(err);
        this.toastr.error(err);
      }
    });

  }

  onToggle() {
    console.log('Cambio de estado del checkbox: ', this.isChecked);

    let modo: ModosModel = {
      id:1,
      activo: this.isChecked
    }

    let obs: Observable<any>[] = [];
    obs.push(this.modosService.ActualizarModo(modo));

    forkJoin(obs).subscribe({
      next: response => {
        console.log(response)
        this.toastr.success(this.isChecked == true ? "Robot encendido con éxito" : "Robot apagado con éxito");
        this.loadData();
      },
      error: err => {
        console.log(err);
        this.toastr.error(err);
      }
    });
  }

  changeModoOperacion(modo: string){
    this.operationMode = modo;
  }

  updatePunto(select: any){
    console.log(select)

    let modo: ModosModel = {
      id:select.id,
      activo: !select.activo
    }

    console.log(modo)

    let obs: Observable<any>[] = [];
    obs.push(this.modosService.ActualizarModo(modo));

    forkJoin(obs).subscribe({
      next: response => {
        console.log(response)
        this.loadData();
        this.toastr.success(this.isChecked == true ? "Modo de operación activado con éxito" : "Robot apagado con éxito");
      },
      error: err => {
        console.log(err);
        this.toastr.error(err);
      }
    });
  }

  sendData(){

    console.log(this.puntosHome.p1X)

    let puntosPata: PuntosModel ={
      id: 10,
      p1X: this.patasForm.get('P1X').value == null ? this.puntosHome.p1X : this.patasForm.get('P1X').value,
      p1Y: this.patasForm.get('P1Y').value == null ? this.puntosHome.p1Y : this.patasForm.get('P1Y').value,
      p2X: this.patasForm.get('P2X').value == null ? this.puntosHome.p2X : this.patasForm.get('P2X').value,
      p2Y: this.patasForm.get('P2Y').value == null ? this.puntosHome.p2Y : this.patasForm.get('P2Y').value,
      p3X: this.patasForm.get('P3X').value == null ? this.puntosHome.p3X : this.patasForm.get('P3X').value,
      p3Y: this.patasForm.get('P3Y').value == null ? this.puntosHome.p3Y : this.patasForm.get('P3Y').value,
      p4X: this.patasForm.get('P4X').value == null ? this.puntosHome.p4X : this.patasForm.get('P4X').value,
      p4Y: this.patasForm.get('P4Y').value == null ? this.puntosHome.p4Y : this.patasForm.get('P4Y').value
    }

    console.log(puntosPata)

    let obs: Observable<any>[] = [];
    obs.push(this.puntosService.ActualizarPunto(puntosPata));

    forkJoin(obs).subscribe({
      next: response => {
        console.log("response: ",response)
        this.loadData();

        this.toastr.success("Se han enviado correctamente los puntos en el modo manual.");
      },
      error: err => {
        console.log(err);
        this.toastr.error(err);
      }
    });
  }

}
