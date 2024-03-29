import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-backend',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './backend.component.html',
  styleUrl: './backend.component.css'
})
export class BackendComponent {
  constructor(private router:Router){}

  logout()
  {
    localStorage.clear();
    this.router.navigate(['/login'])
  }
}
