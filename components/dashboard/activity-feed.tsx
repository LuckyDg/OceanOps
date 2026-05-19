'use client';

import { Ship, Package, AlertTriangle, Anchor } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDateTime } from '@/lib/utils';

interface Activity {
  id: string;
  type: 'vessel' | 'container' | 'cargo' | 'port';
  title: string;
  description: string;
  timestamp: string;
  severity?: 'normal' | 'warning' | 'danger';
}

const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'vessel',
    title: 'MV Pacific Star departed',
    description: 'Departed from Port of Shanghai, next stop: Los Angeles',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    severity: 'normal',
  },
  {
    id: '2',
    type: 'cargo',
    title: 'Illegal cargo flagged',
    description: 'Container MSCU1234567 flagged for inspection at Rotterdam',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    severity: 'danger',
  },
  {
    id: '3',
    type: 'port',
    title: 'Port of Singapore operational',
    description: 'Maintenance completed, all berths now available',
    timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    severity: 'normal',
  },
  {
    id: '4',
    type: 'container',
    title: 'Refrigerated container alert',
    description: 'Temperature deviation detected in RFCU9876543',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    severity: 'warning',
  },
  {
    id: '5',
    type: 'vessel',
    title: 'MV Atlantic Queen arrived',
    description: 'Arrived at Port of Hamburg, offloading commenced',
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    severity: 'normal',
  },
];

const typeIcon = {
  vessel: Ship,
  container: Package,
  cargo: AlertTriangle,
  port: Anchor,
};

const severityColor = {
  normal: 'text-[#6B7280]',
  warning: 'text-[#F59E0B]',
  danger: 'text-[#EF4444]',
};

const severityBg = {
  normal: 'bg-[#1F2937]',
  warning: 'bg-[#F59E0B]/10',
  danger: 'bg-[#EF4444]/10',
};

export function ActivityFeed() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {mockActivities.map((activity) => {
            const Icon = typeIcon[activity.type];
            const severity = activity.severity ?? 'normal';
            return (
              <div
                key={activity.id}
                className={`flex gap-3 rounded-lg p-3 ${severityBg[severity]}`}
              >
                <div
                  className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1F2937] ${severityColor[severity]}`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-[#F9FAFB]">{activity.title}</p>
                  <p className="mt-0.5 text-xs text-[#6B7280]">{activity.description}</p>
                  <p className="mt-1 text-xs text-[#374151]">
                    {formatDateTime(activity.timestamp)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
