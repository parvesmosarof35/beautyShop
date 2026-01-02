
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import React, { useMemo } from "react";
import { Select, Spin } from "antd";
import { UserGrowthData } from "@/app/store/api/dashboardStatsApi";

interface UserGrowthChartProps {
    data: UserGrowthData | undefined;
    year: number;
    setYear: (year: number) => void;
    isLoading: boolean;
}

const UserGrowthChart = ({ data, year, setYear, isLoading }: UserGrowthChartProps) => {
    const currentYear = new Date().getFullYear();
    // Generate last 5 years
    const years = useMemo(() => 
        Array.from({ length: 5 }, (_, i) => currentYear - i), 
    [currentYear]);

    // Format data for Recharts
    const { chartData, maxUsers } = useMemo(() => {
        if (!data?.monthlyData) return { chartData: [], maxUsers: 0 };

        const monthlyData = data.monthlyData.map((item) => ({
            name: item.month,
            totalUser: item.totalUsers,
        }));

        const maxUsers =
            Math.max(...data.monthlyData.map((item) => item.totalUsers), 0) + 5;

        return { chartData: monthlyData, maxUsers };
    }, [data]);

    return (
        <div
            className="bg-neutral-900 rounded-xl p-5 shadow-lg border border-neutral-800"
            style={{
                width: "100%",
                height: "450px",
            }}
        >
            <div className="flex justify-between items-center mb-4">
                <h3
                    className="text-lg font-bold text-neutral-200"
                    style={{ textAlign: "left" }}
                >
                    📈 User Growth
                </h3>
                <Select
                    className="min-w-32 custom-select-dark"
                    value={year}
                    placeholder="Select year"
                    onChange={setYear}
                    style={{ width: "150px" }}
                    options={years.map((item) => ({ value: item, label: String(item) }))}
                />
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center h-[350px]">
                    <Spin size="large" />
                </div>
            ) : (
                <ResponsiveContainer width="100%" height="85%">
                    <BarChart
                        data={chartData}
                        margin={{ top: 20, right: 20, left: 0, bottom: 10 }}
                    >
                        <defs>
                            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#D4A574" stopOpacity={1} />
                                <stop offset="95%" stopColor="#D4A574" stopOpacity={0.6} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                        <XAxis
                            dataKey="name"
                            stroke="#999"
                            tick={{ fontSize: 12, fill: "#999" }}
                            axisLine={{ stroke: "#333" }}
                            tickLine={false}
                        />
                        <YAxis
                            stroke="#999"
                            domain={[0, maxUsers]}
                            tick={{ fontSize: 12, fill: "#999" }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "#171717",
                                border: "1px solid #333",
                                borderRadius: "8px",
                                color: "#fff"
                            }}
                            cursor={{ fill: "rgba(255, 255, 255, 0.05)" }}
                        />
                        <Legend wrapperStyle={{ color: "#fff" }} />
                        <Bar
                            dataKey="totalUser"
                            fill="url(#colorUv)"
                            barSize={50}
                            radius={[4, 4, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            )}
            <style jsx global>{`
        .custom-select-dark .ant-select-selector {
          background-color: #262626 !important;
          border-color: #404040 !important;
          color: #fff !important;
        }
        .custom-select-dark .ant-select-arrow {
          color: #fff !important;
        }
      `}</style>
        </div>
    );
};

export default UserGrowthChart;
