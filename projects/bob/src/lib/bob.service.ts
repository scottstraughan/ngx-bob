import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, take, tap, timeout } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { BOB_CONFIG, BobConfig } from './bob.config';
import { marked } from 'marked';

@Injectable({
  providedIn: 'root'
})
export class BobService {
  /**
   * Observable containing all the sent and received messages.
   * @private
   */
  private messages$: BehaviorSubject<Message[]> = new BehaviorSubject<any>([]);

  /**
   * Observable determining if Bob is available or not.
   * @private
   */
  private available$: BehaviorSubject<boolean> = new BehaviorSubject<any>(false);

  /**
   * Observable to check if we are visible or not.
   * @private
   */
  private visible$: BehaviorSubject<boolean> = new BehaviorSubject<any>(false);

  /**
   * Observable to check if we are sending a message or not.
   * @private
   */
  private sending$: BehaviorSubject<boolean> = new BehaviorSubject<any>(false);

  /**
   * Messages sent and received.
   * @private
   */
  private messages: Message[] = [];

  /**
   * Constructor.
   */
  constructor(
    private httpClient: HttpClient,
    @Inject(LOCAL_STORAGE) private storageService: StorageService,
    @Inject(BOB_CONFIG) private bobConfig: BobConfig,
  ) {
    this.loadMessagesFromStorage();

    this.isServiceAvailable()
      .pipe(tap(available =>
        this.available$.next(available)))
      .subscribe();
  }

  /**
   * Observe if Bob is available or not.
   */
  observerAvailable(): Observable<boolean> {
    return this.available$.asObservable();
  }

  /**
   * Observe all the sent and received messages to Bob.
   */
  observeMessages(): Observable<Message[]> {
    return this.messages$.asObservable();
  }

  /**
   * Observe the visible state.
   */
  observeVisible() {
    return this.visible$.asObservable();
  }

  /**
   * Observe the sending state.
   */
  observeSending() {
    return this.sending$.asObservable();
  }

  /**
   * Set if Bob should be visible or not.
   */
  setVisible(
    visible: boolean,
  ) {
    this.visible$.next(visible);
  }

  /**
   * Send a message to Bob.
   * @param body string to send.
   */
  send(
    body: string
  ): Observable<any> {
    if (body == 'clear') {
      this.clearHistory();
      return of();
    }

    const message: Message = {
      body: marked.parse(body).toString(),
      sent: true,
      date: new Date(),
      loading: true,
      isError: false
    }

    this.messages.push(message);
    this.notify();

    this.sending$.next(true);

    return this.httpClient.post<Response>(`${this.bobConfig.endpointUrl}/speak`, {
      body: message.body,
      history: this.messages
    })
      .pipe(
        map(responseMessage =>
          marked.parse(responseMessage.message.toString()).toString()),
        tap(html =>
          this.messages.push({
            body: html,
            date: new Date(),
            sent: false,
            loading: false,
            isError: false
          })
        ),
        catchError(error => {
          console.error(error);
          message.isError = true;

          this.notify();
          return error;
        }),
        tap(() => message.loading = false),
        tap(() => this.sending$.next(false)),
        tap(() => this.notify()),
        take(1)
      );
  }

  /**
   * Clear the chat history.
   */
  clearHistory() {
    this.storageService.remove(this.bobConfig.bobStorageKey);
    this.messages = [];
    this.loadMessagesFromStorage();

    this.notify();
  }

  /**
   * Check if the service is available or not by calling the "/status" endpoint.
   * @private
   */
  private isServiceAvailable(): Observable<boolean> {
    return this.httpClient.get<Status>(`${this.bobConfig.endpointUrl}/status`)
      .pipe(
        map(status =>
          status.status == 'available'),
        timeout(2000),
        catchError(() => {
          return of(false)
        }),
        take(1)
      );
  }

  /**
   * Notify observers of new messages and also update the cache.
   * @private
   */
  private notify(
    saveToStorage: boolean = true
  ) {
    this.messages$.next(this.messages);

    if (saveToStorage) {
      this.storageService.set(this.bobConfig.bobStorageKey, this.messages);
    }
  }

  /**
   * Load any previous messages from cache.
   * @private
   */
  private loadMessagesFromStorage() {
    const storedMessages: Message[] = this.storageService.get(this.bobConfig.bobStorageKey);

    if (Array.isArray(storedMessages) && storedMessages.length > 0) {
      this.messages = storedMessages;

      // Temp fix to prevent never ending messages
      this.messages.map(message => message.loading = false);
    }

    const welcomeMessage = marked.parse(this.bobConfig.welcomeMessage).toString();

    if (this.messages.length == 0) {
      this.messages.push({
        body: welcomeMessage,
        sent: false,
        date: new Date(),
        loading: false,
        isError: false
      })
    }

    this.notify(false);
  }
}

/**
 * Type for a message.
 */
export type Message = {
  body: string
  sent?: boolean
  date: Date
  loading: boolean
  isError: boolean
}

/**
 * Response from backend.
 */
export type Response = {
  message: string
}


/**
 * Response from backend.
 */
export type Status = {
  status: string
}