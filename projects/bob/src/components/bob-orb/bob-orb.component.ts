import { Component, input } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { BobService } from '../../lib/bob.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'ngx-bob-orb',
  templateUrl: './bob-orb.component.html',
  standalone: true,
  styleUrl: './bob-orb.component.scss',
  animations: [
    trigger('openClose', [
      transition(':enter', [
        style({ opacity: '0' }),
        animate('.2s 1s ease-in', style({ opacity: '1' }))
      ]),
      transition(':leave', [
        style({ opacity: '1' }),
        animate('.2s', style({ opacity: '0' }))
      ]),
    ]),
  ],
  imports: [
    AsyncPipe
  ]
})
export class BobOrbComponent {
  readonly bobAvatar = input.required<string>();

  constructor(
    public bobService: BobService,
  ) {
  }
}
