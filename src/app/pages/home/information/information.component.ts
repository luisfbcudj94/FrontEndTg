import { Component } from '@angular/core';

@Component({
  selector: 'app-information',
  templateUrl: './information.component.html'
})
export class InformationComponent {

  showResumen: boolean = true;
  showObjetivos: boolean = false;
  showMetodologia: boolean = false;
  showResultados: boolean = false;

  changeSection(selection:string){
    switch (selection) {
      case 'resumen':

        this.showResumen = true;
        this.showMetodologia = false;
        this.showObjetivos = false;
        this.showResultados = false;
        break;
      case 'objetivos':

        this.showResumen = false;
        this.showMetodologia = false;
        this.showObjetivos = true;
        this.showResultados = false;
        break;
      case 'metodologia':
        
        this.showResumen = false;
        this.showMetodologia = true;
        this.showObjetivos = false;
        this.showResultados = false;
        break;
      case 'resultados':
        
        this.showResumen = false;
        this.showMetodologia = false;
        this.showObjetivos = false;
        this.showResultados = true;
        break;
    
      
    }
  }

}
