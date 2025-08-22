import { Component } from '@angular/core';
import { BobComponent } from '../../../bob/src/components/bob/bob.component';

@Component({
  selector: 'app-root',
  imports: [
    BobComponent
  ],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'bob-test';

  onTest() {
    alert()
  }
}
