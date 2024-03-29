import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  form: FormGroup;

  constructor(private http:HttpClient, private router: Router)
  {
    this.form = new FormGroup({
      username : new FormControl('',Validators.required),
      password : new FormControl('',Validators.required),
    })
  }
  
  submit()
  {
    if( this.form.valid)
    {
      this.http.post<{token:string}>(environment.backendUrl+'/login',this.form.getRawValue()).subscribe({
        next: r  => {
          localStorage.setItem('token', r.token);
          this.router.navigate(['/'])
        }
      })
    }
  }
}
