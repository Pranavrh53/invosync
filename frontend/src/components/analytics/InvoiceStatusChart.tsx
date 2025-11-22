import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";

interface InvoiceStatusChartProps {
    stats: {
        byStatus: {
            draft: number;
            sent: number;
            paid: number;
            overdue: number;
            cancelled: number;
        };
    };
}

export function InvoiceStatusChart({ stats }: InvoiceStatusChartProps) {
    const total = Object.values(stats.byStatus).reduce((sum, val) => sum + val, 0);

    const statusData = useMemo(() => [
        { label: "Paid", value: stats.byStatus.paid, color: "#10b981", percentage: total > 0 ? (stats.byStatus.paid / total) * 100 : 0 },
        { label: "Sent", value: stats.byStatus.sent, color: "#3b82f6", percentage: total > 0 ? (stats.byStatus.sent / total) * 100 : 0 },
        { label: "Draft", value: stats.byStatus.draft, color: "#6b7280", percentage: total > 0 ? (stats.byStatus.draft / total) * 100 : 0 },
        { label: "Overdue", value: stats.byStatus.overdue, color: "#ef4444", percentage: total > 0 ? (stats.byStatus.overdue / total) * 100 : 0 },
        { label: "Cancelled", value: stats.byStatus.cancelled, color: "#9ca3af", percentage: total > 0 ? (stats.byStatus.cancelled / total) * 100 : 0 },
    ], [stats, total]);

    // Calculate donut chart segments
    let currentAngle = -90; // Start from top
    const segments = statusData.map((item) => {
        const angle = (item.percentage / 100) * 360;
        const startAngle = currentAngle;
        const endAngle = currentAngle + angle;
        currentAngle = endAngle;

        // Calculate arc path
        const radius = 80;
        const innerRadius = 50;
        const centerX = 100;
        const centerY = 100;

        const startRad = (startAngle * Math.PI) / 180;
        const endRad = (endAngle * Math.PI) / 180;

        const x1 = centerX + radius * Math.cos(startRad);
        const y1 = centerY + radius * Math.sin(startRad);
        const x2 = centerX + radius * Math.cos(endRad);
        const y2 = centerY + radius * Math.sin(endRad);
        const x3 = centerX + innerRadius * Math.cos(endRad);
        const y3 = centerY + innerRadius * Math.sin(endRad);
        const x4 = centerX + innerRadius * Math.cos(startRad);
        const y4 = centerY + innerRadius * Math.sin(startRad);

        const largeArc = angle > 180 ? 1 : 0;

        const path = `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4} Z`;

        return { ...item, path };
    });

    return (
        <Card>
            <CardHeader>
                <CardTitle>Invoice Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between gap-8">
                    {/* Donut Chart */}
                    <div className="relative">
                        <svg width="200" height="200" viewBox="0 0 200 200">
                            {segments.map((segment, index) => (
                                <g key={index}>
                                    <path
                                        d={segment.path}
                                        fill={segment.color}
                                        className="hover:opacity-80 transition-opacity cursor-pointer"
                                    >
                                        <title>{`${segment.label}: ${segment.value} (${segment.percentage.toFixed(1)}%)`}</title>
                                    </path>
                                </g>
                            ))}
                            {/* Center text */}
                            <text x="100" y="95" textAnchor="middle" fontSize="24" fontWeight="bold" fill="#1f2937">
                                {total}
                            </text>
                            <text x="100" y="115" textAnchor="middle" fontSize="12" fill="#6b7280">
                                Total
                            </text>
                        </svg>
                    </div>

                    {/* Legend */}
                    <div className="flex-1 space-y-3">
                        {statusData.map((item, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: item.color }}
                                    />
                                    <span className="text-sm font-medium">{item.label}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-semibold">{item.value}</span>
                                    <span className="text-xs text-muted-foreground w-12 text-right">
                                        {item.percentage.toFixed(1)}%
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
