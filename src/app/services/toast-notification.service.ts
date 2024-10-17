import { Injectable } from '@angular/core';
import { toast } from 'ngx-sonner';

@Injectable({
  providedIn: 'root',
})
export class ToastNotificationService {
  // Toast Success
  toastSuccess(message: string, description?: string) {
    toast.success(message, {
      description,
      style: { backgroundColor: 'green', color: 'white' },
    });
  }

  // Toast Error
  toastError(message: string, description?: string) {
    toast.error(message, {
      description,
      style: { backgroundColor: 'red', color: 'white' },
    });
  }
}
