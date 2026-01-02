
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
import React, { useMemo, useState } from "react";
import { Select, Spin } from "antd";
// Mocking the API hook since we don't have access to the redux store structure referenced
const useGetUserGrowthByYearQuery = (year: number) => {
    // Simulate API response
    const [isLoading, setIsLoading] = useState(false);
    const data = useMemo(() => ({
        data: {
            monthlyStats: Array.from({ length: 12 }, (_, i) => ({
                month: i + 1,
                count: Math.floor(Math.random() * 100) + 10
            }))
        }
    }), [year]);

    return { data, isLoading };
};

const UserGrowthChart = () => {
    const currentYear = new Date().getFullYear();
    const [year, setYear] = useState(currentYear);
    const [years] = useState(
        Array.from({ length: 5 }, (_, i) => currentYear - i).reverse()
    );

    const { data, isLoading } = useGetUserGrowthByYearQuery(year);

    const monthMap: Record<number, string> = {
        1: "Jan", 2: "Feb", 3: "Mar", 4: "Apr", 5: "May", 6: "Jun",
        7: "Jul", 8: "Aug", 9: "Sep", 10: "Oct", 11: "Nov", 12: "Dec",
    };

    const { monthlyData, maxUsers } = useMemo(() => {
        if (!data?.data?.monthlyStats) return { monthlyData: [], maxUsers: 0 };

        const stats = data.data.monthlyStats;

        const monthlyData = stats.map((item) => ({
            name: monthMap[item.month],
            totalUser: item.count,
        }));

        const maxUsers =
            Math.max(...stats.map((item) => item.count), 0) + 5;

        return { monthlyData, maxUsers };
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
                    options={years.map((item) => ({ value: item, label: item }))}
                />
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center h-[350px]">
                    <Spin size="large" />
                </div>
            ) : (
                <ResponsiveContainer width="100%" height="85%">
                    <BarChart
                        data={monthlyData}
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
