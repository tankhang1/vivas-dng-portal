import { Card, CardContent, CardHeader, CardTitle } from "../../../shared/components/ui";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type StaffByFieldChartProps = {
  data: { name: string; soLuong: number }[];
};

export function StaffByFieldChart({ data }: StaffByFieldChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Nhân sự theo lĩnh vực</CardTitle>
      </CardHeader>
      <CardContent className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11 }}
              interval={0}
              angle={-15}
              textAnchor="end"
              height={60}
            />
            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar
              dataKey="soLuong"
              name="Số cán bộ"
              fill="#7c3aed"
              radius={[4, 4, 0, 0]}
              isAnimationActive={false}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
