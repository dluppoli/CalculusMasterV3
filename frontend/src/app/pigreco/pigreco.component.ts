import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-pigreco',
  standalone: true,
  imports: [ReactiveFormsModule,HttpClientModule],
  templateUrl: './pigreco.component.html',
  styleUrl: './pigreco.component.css'
})
export class PigrecoComponent {
  form:FormGroup;
  error:string = "";
  result?:{risultato:number};

  constructor(private http:HttpClient)
  {
    this.form = new FormGroup({
      numero : new FormControl<number | null>(null,Validators.required),
    })
  }

  calcola()
  {
    let n = this.form.get('numero')?.value;
    if( isNaN( n ) || n <= 0 )
      this.error = "Inserire un numero valido"
    else
    {
      this.http.get<{risultato:number}>(environment.backendUrl+'/pigreco/'+n).subscribe({
        next: r => this.result = r
      })
    }
  }
}
