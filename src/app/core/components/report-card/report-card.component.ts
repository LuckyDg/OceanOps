import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LucideAngularModule, FileText } from 'lucide-angular';
@Component({
  selector: 'app-report-card',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule
  ],
  templateUrl: './report-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportCardComponent {
  FileText = FileText;
}
