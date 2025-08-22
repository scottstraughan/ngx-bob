import { InjectionToken } from '@angular/core';

export interface BobConfig {
  endpointUrl: string,
  bobStorageKey: string
  welcomeMessage: string
}

export const BOB_CONFIG = new InjectionToken<BobConfig>('BobConfig');