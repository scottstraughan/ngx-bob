import {
  Component,
  ElementRef,
  HostListener, input, OnDestroy,
  Signal,
  signal,
  ViewChild, WritableSignal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BobService, Message } from '../../lib/bob.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Subject, takeUntil, tap } from 'rxjs';
import { NgIf } from '@angular/common';
import { LoadingIndicatorComponent } from './lib/loading-indicator/loading-indicator.component';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'ngx-bob-ui',
  templateUrl: './bob-ui.component.html',
  standalone: true,
  imports: [
    FormsModule,
    LoadingIndicatorComponent,
    NgIf,
  ],
  animations: [
    trigger('openClose', [
      transition(':enter', [
        style({ right: 'calc(var(--ngx-bob-ui-width) * -1)' }),
        animate('.2s', style({ right: '0px' }))
      ]),
      transition(':leave', [
        style({ right: '0px' }),
        animate('.2s', style({ right: 'calc(var(--ngx-bob-ui-width) * -1)' }))
      ]),
    ]),
  ],
  styleUrl: './bob-ui.component.scss'
})
export class BobUiComponent implements OnDestroy {
  /**
   * Placeholder text for the textarea for a new message.
   */
  readonly newMessagePlaceholder = input<string>('Ask Bob a question...');

  /**
   * Image src used for Bob.
   */
  readonly bobAvatarSrc = input.required<string>();

  /**
   * Image src used for User.
   */
  readonly userAvatarSrc = input.required<string>();

  /**
   * Image src used for send icon.
   */
  readonly sendIconSrc = input.required<string>();

  /**
   * Signal with all the messages.
   * @protected
   */
  protected readonly messages: Signal<Message[]> = signal([]);

  /**
   * Signal to track if we are sending.
   * @protected
   */
  protected readonly isSending: Signal<boolean> = signal(false);

  /**
   * Signal to track if the container is visible or not.
   * @protected
   */
  protected readonly containerVisible: WritableSignal<boolean> = signal(false);

  /**
   * Signal to track if the panel is visible.
   * @protected
   */
  protected readonly panelVisible: WritableSignal<boolean> = signal(false);

  /**
   * New send message
   * @protected
   */
  protected newMessage: string = ''

  /**
   * Textarea reference.
   * @protected
   */
  @ViewChild('newMessageTextarea')
  protected newMessageTextarea!: ElementRef<HTMLTextAreaElement>;

  /**
   * Message listed reference.
   * @protected
   */
  @ViewChild('messagesList')
  protected messageList!: ElementRef;

  /**
   * Subject to track onDestroy events.
   * @private
   */
  private onDestroy$: Subject<void> = new Subject();

  /**
   * Constructor.
   */
  constructor(
    protected bobService: BobService
  ) {
    this.messages = toSignal(
      this.bobService.observeMessages(), { initialValue: [] });

    this.isSending = toSignal(
      this.bobService.observeSending(), { initialValue: false });

    this.bobService.observeVisible()
      .pipe(
        tap(visible => this.show(visible)),
        takeUntil(this.onDestroy$)
      )
      .subscribe()
  }

  /**
   * @inheritdoc
   */
  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  /**
   * Detect clicks to the component, we will use this to close the ui.
   */
  @HostListener('click', ['$event'])
  onClick(
    $event: any
  ) {
    const target = $event.target as HTMLElement;

    if (!target.classList.contains('container')) {
      return ;
    }

    this.bobService.setVisible(false);
  }

  /**
   * Called when the user presses the escape key and closes the popup.
   * @private
   */
  @HostListener('document:keydown.escape')
  onEscapeKeyPressed() {
    this.bobService.setVisible(false);
  }

  /**
   * Called when we should send a message.
   */
  onSendMessage(
    event: any
  ) {
    event.preventDefault();

    if (this.newMessage.length == 0) {
      return ;
    }

    this.scrollToBottom();

    this.bobService.send(this.newMessage)
      .pipe(
        tap(() =>
          this.scrollToBottom()),
        tap(() =>
          this.focusNewMessageTextarea())
      )
      .subscribe();

    this.newMessage = '';
  }

  /**
   * Called when any loading animation has completed and we are ready!
   */
  onPanelOpened() {
    this.scrollToBottom();
    this.focusNewMessageTextarea();
  }

  /**
   * Called when the panel close animation has completed.
   */
  onPanelClosed() {
    // We only want to deal with close events
    if (this.panelVisible()) {
      return ;
    }

    this.containerVisible.set(false);
  }

  getTitle(
    message: Message
  ) {
    if (message.loading) {
      return "Message is sending";
    } else if (message.isError) {
      return "There was an error sending this message.";
    } else if (message.sent) {
      return "The message was sent successfully.";
    }

    return "The message was received successfully.";
  }

  isReadyToSend(): boolean {
    return this.newMessage.length > 0;
  }

  /**
   * Show or hide the UI.
   */
  private show(
    show: boolean
  ) {
    if (show) {
      this.containerVisible.set(true);
      this.panelVisible.set(true);
    } else {
      this.panelVisible.set(false);
    }
  }

  /**
   * Focus the new message textarea.
   * @private
   */
  private focusNewMessageTextarea() {
    if (!this.newMessageTextarea) {
      return ;
    }

    this.newMessageTextarea.nativeElement.focus();
  }

  /**
   * Scroll to the bottom of the message list.
   * @private
   */
  private scrollToBottom(): void {
    setTimeout(() => {
      try {
        const el = this.messageList.nativeElement;
        el.scrollTop = el.scrollHeight;
      } catch (err) { }
    }, 200);
  }
}