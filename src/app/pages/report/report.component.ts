import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { ShippingStatusComponent } from '@core/components/shipping-status/shipping-status.component';
import { ShippingService } from '@services/shipping.service';
import { Container, Vessel } from '@models/buques.model';
import { ActivatedRoute } from '@angular/router';
import { ToastNotificationService } from '@services/toast-notification.service';
import {
  ContainerIconComponent,
  ReportIconComponent,
  IconDownloadComponent,
  IconPdfComponent,
} from '@core/index';

interface Capitan {
  id?: string;
  name: string;
  matricula: string;
  email: string;
  address: string;
}

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [
    CommonModule,
    ShippingStatusComponent,
    ContainerIconComponent,
    ReportIconComponent,
    IconDownloadComponent,
    IconPdfComponent,
  ],
  templateUrl: './report.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportComponent implements OnInit {
  containers: Container[] = [];
  selectedContainer: Container | null = null;
  isAdmin: boolean = true;
  vesselId: string | null = null;
  invoiceNumber: string = '';
  currentStepValue: number = 1;

  capitans: Capitan[] = [
    {
      id: '0232954',
      name: 'Diana Ramirez',
      matricula: 'XX-23111-BM',
      email: '',
      address: '',
    },
    {
      id: '0232955',
      name: 'María Gómez',
      matricula: 'XX-23112-BM',
      email: '',
      address: '',
    },
  ];

  constructor(
    private readonly shippingService: ShippingService,
    private readonly route: ActivatedRoute,
    private readonly cd: ChangeDetectorRef,
    private readonly toastService: ToastNotificationService
  ) {}

  ngOnInit(): void {
    this.vesselId = this.route.snapshot.paramMap.get('id');
    this.getContainers();
    this.generateInvoiceNumber();
  }

  getContainers(): void {
    this.shippingService.getVessels().subscribe((vessels: Vessel[]) => {
      const selectedVessel = vessels.find(
        vessel => vessel.id === this.vesselId
      );
      if (selectedVessel) {
        this.containers = selectedVessel.containers;
        this.cd.markForCheck();
      }
    });
  }

  selectContainer(container: Container): void {
    this.selectedContainer = container;
  }

  generateInvoiceNumber(): void {
    const randomNumber = Math.floor(Math.random() * 9000) + 1000;
    const randomSuffix = Math.floor(Math.random() * 90) + 10;
    this.invoiceNumber = `INV${randomNumber}-08-${randomSuffix}`;
  }

  async generatePDF(): Promise<void> {
    try {
      const previewElement = document.getElementById('preview');
      if (!previewElement) {
        throw new Error('Preview element not found');
      }

      const canvas = await html2canvas(previewElement, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const pdfWidth = pdf.internal.pageSize.width;
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${this.invoiceNumber}.pdf`);

      this.toastService.toastSuccess('PDF generated successfully!');
    } catch (error) {
      this.toastService.toastError('Failed to generate the PDF.');
    }
  }
}
