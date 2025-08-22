import { Provider } from '@angular/core';
import { BOB_CONFIG, BobConfig } from './bob.config';

export function provideBob(
  config: BobConfig
): Provider[] {
  return [
    { provide: BOB_CONFIG, useValue: config }
  ];
}