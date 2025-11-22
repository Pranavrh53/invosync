import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Calendar } from "lucide-react";

interface PaymentTrendsProps {
    className?: string;
}

export function PaymentTrendsHeatmap({ className }: PaymentTrendsProps) {
    // Generate mock data for the last 12 weeks
    const weeks = 12;
    const daysPerWeek = 7;
    const today = new Date();

    const heatmapData = Array.from({ length: weeks }, (_, weekIndex) => {
        return Array.from({ length: daysPerWeek }, (_, dayIndex) => {
            const date = new Date(today);
            date.setDate(date.getDate() - (weeks - weekIndex - 1) * 7 - (daysPerWeek - dayIndex - 1));

            // Mock payment activity (0-4 scale)
            const activity = Math.floor(Math.random() * 5);

            return {
                date,
                activity,
                payments: activity * Math.floor(Math.random() * 3 + 1),
            };
        });
    });

    const getColor = (activity: number) => {
        const colors = [
            "#ebedf0", // 0 - no activity
            "#9be9a8", // 1 - low
            "#40c463", // 2 - medium
            "#30a14e", // 3 - high
            "#216e39", // 4 - very high
        ];
        return colors[activity] || colors[0];
    };

    const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Payment Activity Heatmap
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {/* Heatmap Grid */}
                    <div className="overflow-x-auto">
                        <div className="inline-flex gap-1">
                            {/* Day labels */}
                            <div className="flex flex-col gap-1 justify-around pr-2">
                                {dayLabels.map((day, index) => (
                                    <div key={index} className="h-3 text-[10px] text-muted-foreground flex items-center">
                                        {index % 2 === 1 ? day : ""}
                                    </div>
                                ))}
                            </div>

                            {/* Heatmap cells */}
                            <div className="flex gap-1">
                                {heatmapData.map((week, weekIndex) => (
                                    <div key={weekIndex} className="flex flex-col gap-1">
                                        {week.map((day, dayIndex) => (
                                            <div
                                                key={dayIndex}
                                                className="w-3 h-3 rounded-sm cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                                                style={{ backgroundColor: getColor(day.activity) }}
                                                title={`${day.date.toLocaleDateString()}: ${day.payments} payment${day.payments !== 1 ? "s" : ""}`}
                                            />
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Less</span>
                        <div className="flex gap-1">
                            {[0, 1, 2, 3, 4].map((level) => (
                                <div
                                    key={level}
                                    className="w-3 h-3 rounded-sm"
                                    style={{ backgroundColor: getColor(level) }}
                                />
                            ))}
                        </div>
                        <span className="text-muted-foreground">More</span>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-green-600">
                                {heatmapData.flat().reduce((sum, day) => sum + day.payments, 0)}
                            </p>
                            <p className="text-xs text-muted-foreground">Total Payments</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-blue-600">
                                {heatmapData.flat().filter(day => day.activity > 0).length}
                            </p>
                            <p className="text-xs text-muted-foreground">Active Days</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-purple-600">
                                {Math.round(
                                    heatmapData.flat().reduce((sum, day) => sum + day.payments, 0) /
                                    heatmapData.flat().filter(day => day.activity > 0).length
                                ) || 0}
                            </p>
                            <p className="text-xs text-muted-foreground">Avg per Day</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
