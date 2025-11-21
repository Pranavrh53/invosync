import { cn } from "../../utils/cn";

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
    const maxValue = Math.max(...data.map((point) => point.value), 0) || 1;

    return (
        <div className={cn("space-y-3", className)}>
            {caption && (
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {caption}
                </p>
            )}
            <div className="flex items-end gap-3 h-28">
                {data.map((point) => {
                    const heightPercent = (point.value / maxValue) * 100;
                    return (
                        <div key={point.label} className="flex flex-1 flex-col items-center gap-2">
                            <div className="relative flex h-full w-full items-end">
                                <span
                                    className="block w-full rounded-full bg-gradient-to-t from-primary to-primary/40"
                                    style={{ height: `${heightPercent}%` }}
                                />
                            </div>
                            <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                                {point.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
