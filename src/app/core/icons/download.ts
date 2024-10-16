import { Component } from '@angular/core';

@Component({
    selector: 'app-icon-download',
    template: `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round" class="lucide lucide-arrow-down-to-line">
                                    <path d="M12 17V3" />
                                    <path d="m6 11 6 6 6-6" />
                                    <path d="M19 21H5" />
                                </svg>
  `,
    standalone: true,
})
export class IconDownload { }