import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-numeriprimi',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule,CommonModule],
  templateUrl: './numeriprimi.component.html',
  styleUrl: './numeriprimi.component.css'
})
export class NumeriprimiComponent {
  form:FormGroup;
  error:string = "";
  results: {numero:number,primo:boolean}[] = [];


  constructor(private http:HttpClient)
  {
    this.form = new FormGroup({
      numero : new FormControl<number | null>(null,Validators.required),
      soloPrimi: new FormControl<boolean>(false)
    })
  }

  calcola()
  {
    let n = this.form.get('numero')?.value;
    if( isNaN( n ) || n <= 0 )
      this.error = "Inserire un numero valido"
    else
    {
      this.http.get<{numero:number,primo:boolean}[]>(environment.backendUrl+'/eratostene/'+n+'/'+ (this.form.get('soloPrimi')?.value == true ? 1 : 0)).subscribe({
        next: r => this.results = r
      })
    }
  }
}
