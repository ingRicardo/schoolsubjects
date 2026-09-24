import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Multiplication } from './components/multiplication/multiplication';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Multiplication],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('schoolsubjects');
}
