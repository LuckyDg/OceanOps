import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './core/components/footer/footer.component';
import { HeaderComponent } from './core/components/header/header.component';
import { ToastSonnerComponent } from './core/components/toast-sonner/toast-sonner.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, ToastSonnerComponent],

  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent { }
