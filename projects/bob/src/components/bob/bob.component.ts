import { Component, input, Signal, signal, WritableSignal } from '@angular/core';
import { BobOrbComponent } from '../bob-orb/bob-orb.component';
import { BobUiComponent } from '../bob-ui/bob-ui.component';
import { DEFAULT_IMAGES } from '../../lib/bob.images';
import { BobService } from '../../lib/bob.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';

@Component({
  selector: 'ngx-bob',
  templateUrl: 'bob.template.html',
  standalone: true,
  imports: [
    BobOrbComponent,
    BobUiComponent
  ],
  styleUrls: ['./bob.component.scss'],
})
export class BobComponent {
  protected available: Signal<boolean> = signal(true);
  protected active: Signal<boolean> = signal(false);

  bobAvatar = input<string>(DEFAULT_IMAGES.BOB);
  userAvatar = input<string>(DEFAULT_IMAGES.USER);
  sendIcon = input<string>(DEFAULT_IMAGES.SEND);
  newMessagePlaceholder = input<string>('Ask Bob a question...');

  constructor(
    protected bobService: BobService,
  ) {
    this.available = toSignal(
      this.bobService.observerAvailable()
        .pipe(tap(available => !available && console.warn('Bob service is not available, not showing Bob.')))
      , { initialValue: false });

    this.active = toSignal(
      this.bobService.observeVisible(), { initialValue: false });
  }

  onBobClicked() {
    this.bobService.setVisible(true);
  }
}
