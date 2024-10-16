import { Component } from '@angular/core';
import { ToastNotificationService } from '../../../service/toast-notification.service';
import { NgxSonnerToaster } from 'ngx-sonner';

@Component({
  selector: 'app-toast-sonner',
  standalone: true,
  imports: [NgxSonnerToaster],
  templateUrl: './toast-sonner.component.html'
})
export class ToastSonnerComponent {
  constructor(private readonly toastService: ToastNotificationService) { }

  showSuccessToast() {
    this.toastService.toastSuccess('Operation completed successfully!');
  }

  showErrorToast() {
    this.toastService.toastError('An error occurred while processing.');
  }

  // showDescriptionToast() {
  //   this.toastService.toastDescription('Event Created', 'Scheduled for Monday, January 3rd at 6:00pm');
  // }

  // showPromiseToast() {
  //   this.toastService.triggerToastForPromise();
  // }
}
