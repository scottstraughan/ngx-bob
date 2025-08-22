import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'ngx-bob-loading',
  standalone: true,
  templateUrl: './loading-indicator.component.html',
  styleUrl: './loading-indicator.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadingIndicatorComponent {
  baseColor = input<string>('red');
  indicatorColor = input<string>('green');
}