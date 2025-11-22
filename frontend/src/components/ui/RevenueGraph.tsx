import { cn } from "../../utils/cn";
import { formatCurrency } from "../../utils/formatters";

export interface RevenueGraphPoint {
    label: string;
    value: number;
}

interface RevenueGraphProps {
    data: RevenueGraphPoint[];
    className?: string;
    caption?: string;
}

export function RevenueGraph({ data, className, caption }: RevenueGraphProps) {
    if (!data || data.length === 0) {
        return (
            <div className={cn("space-y-3", className)}>
                {caption && (
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        {caption}
                    </p>
                )}
                <div className="flex items-center justify-center h-64 border-2 border-dashed border-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">No revenue data available</p>
                </div>
            </div>
        );
    }

    const maxValue = Math.max(...data.map((point) => point.value), 0) || 1;
    const minValue = Math.min(...data.map((point) => point.value), 0);

    // SVG dimensions
    const width = 700;
    const height = 300;
    const padding = { top: 40, right: 40, bottom: 60, left: 80 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    // Calculate points for the line
    const points = data.map((point, index) => {
        const x = padding.left + (index / (data.length - 1)) * chartWidth;
        const y = padding.top + chartHeight - ((point.value - minValue) / (maxValue - minValue)) * chartHeight;
        return { x, y, ...point };
    });

    // Create path for the line
    const linePath = points.map((point, index) => {
        if (index === 0) return `M ${point.x} ${point.y}`;
        return `L ${point.x} ${point.y}`;
    }).join(' ');

    // Create path for the area under the line
    const areaPath = `${linePath} L ${points[points.length - 1].x} ${padding.top + chartHeight} L ${points[0].x} ${padding.top + chartHeight} Z`;

    return (
        <div className={cn("space-y-4", className)}>
            {caption && (
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {caption}
                </p>
            )}

            {/* SVG Line Graph */}
            <div className="relative bg-white rounded-lg p-4">
                <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
                    {/* Grid lines */}
                    {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
                        const y = padding.top + chartHeight * (1 - ratio);
                        return (
                            <g key={index}>
                                <line
                                    x1={padding.left}
                                    y1={y}
                                    x2={padding.left + chartWidth}
                                    y2={y}
                                    stroke="#e5e7eb"
                                    strokeWidth="1"
                                    strokeDasharray="4 4"
                                />
                                <text
                                    x={padding.left - 10}
                                    y={y + 4}
                                    textAnchor="end"
                                    fontSize="12"
                                    fill="#6b7280"
                                >
                                    {formatCurrency(minValue + (maxValue - minValue) * ratio)}
                                </text>
                            </g>
                        );
                    })}

                    {/* Area under the line */}
                    <path
                        d={areaPath}
                        fill="url(#gradient)"
                        opacity="0.2"
                    />

                    {/* Gradient definition */}
                    <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
                        </linearGradient>
                    </defs>

                    {/* The line */}
                    <path
                        d={linePath}
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    {/* Data points */}
                    {points.map((point, index) => (
                        <g key={index}>
                            {/* Point circle */}
                            <circle
                                cx={point.x}
                                cy={point.y}
                                r="6"
                                fill="white"
                                stroke="#3b82f6"
                                strokeWidth="3"
                                className="cursor-pointer hover:r-8 transition-all"
                            />

                            {/* Hover circle (larger) */}
                            <circle
                                cx={point.x}
                                cy={point.y}
                                r="12"
                                fill="transparent"
                                className="cursor-pointer"
                            >
                                <title>{`${point.label}: ${formatCurrency(point.value)}`}</title>
                            </circle>

                            {/* Value label above point */}
                            {point.value > 0 && (
                                <text
                                    x={point.x}
                                    y={point.y - 15}
                                    textAnchor="middle"
                                    fontSize="11"
                                    fontWeight="600"
                                    fill="#1f2937"
                                >
                                    {formatCurrency(point.value)}
                                </text>
                            )}

                            {/* X-axis label */}
                            <text
                                x={point.x}
                                y={padding.top + chartHeight + 20}
                                textAnchor="middle"
                                fontSize="11"
                                fontWeight="500"
                                fill="#6b7280"
                            >
                                {point.label}
                            </text>
                        </g>
                    ))}

                    {/* X-axis line */}
                    <line
                        x1={padding.left}
                        y1={padding.top + chartHeight}
                        x2={padding.left + chartWidth}
                        y2={padding.top + chartHeight}
                        stroke="#9ca3af"
                        strokeWidth="2"
                    />

                    {/* Y-axis line */}
                    <line
                        x1={padding.left}
                        y1={padding.top}
                        x2={padding.left}
                        y2={padding.top + chartHeight}
                        stroke="#9ca3af"
                        strokeWidth="2"
                    />
                </svg>
            </div>

            {/* Summary */}
            <div className="flex justify-between items-center pt-3 border-t border-muted">
                <div className="text-sm">
                    <span className="text-muted-foreground">Total Revenue: </span>
                    <span className="font-bold text-green-600">
                        {formatCurrency(data.reduce((sum, point) => sum + point.value, 0))}
                    </span>
                </div>
                <div className="text-sm">
                    <span className="text-muted-foreground">Average: </span>
                    <span className="font-semibold">
                        {formatCurrency(data.reduce((sum, point) => sum + point.value, 0) / data.length)}
                    </span>
                </div>
            </div>
        </div>
    );
}
