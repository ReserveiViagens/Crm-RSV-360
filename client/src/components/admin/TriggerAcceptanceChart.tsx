import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { BarChart3 } from "lucide-react";

type HotelGroup = {
  group: string;
  suggested: number;
  accepted: number;
  acceptanceRate: number;
};

type AdminMetrics = {
  topHotelGroups: HotelGroup[];
};

const GROUP_SHORT: Record<string, string> = {
  DIROMA: "DiRoma",
  PRIVE: "Privê",
  GOLDEN_DOLPHIN: "Golden D.",
  RIO_QUENTE: "Rio Quente",
  INDEPENDENTE: "Outros",
};

const COLORS = ["#2563EB", "#F57C00", "#22C55E", "#8B5CF6", "#EC4899"];

export default function TriggerAcceptanceChart() {
  const { data, isLoading } = useQuery<AdminMetrics>({ queryKey: ["/api/admin/metrics"] });

  const chartData = (data?.topHotelGroups ?? []).map((g) => ({
    name: GROUP_SHORT[g.group] ?? g.group,
    aceite: g.acceptanceRate,
    pedidos: g.suggested,
  }));

  return (
    <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E5E7EB", padding: 20 }}>
      <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 600, color: "#111827", display: "flex", alignItems: "center", gap: 8 }}>
        <BarChart3 size={18} color="#2563EB" /> Taxa de Aceite por Grupo Hoteleiro (%)
      </h3>
      {isLoading ? (
        <div style={{ height: 180, background: "#F3F4F6", borderRadius: 8 }} />
      ) : chartData.length === 0 ? (
        <p style={{ color: "#9CA3AF", fontSize: 14, textAlign: "center", padding: "40px 0" }}>
          Sem dados ainda — realize pedidos para ver métricas.
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#6B7280" }} />
            <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} unit="%" />
            <Tooltip
              formatter={(value: number) => [`${value}%`, "Taxa de Aceite"]}
              contentStyle={{ borderRadius: 8, border: "1px solid #E5E7EB", fontSize: 13 }}
            />
            <Bar dataKey="aceite" radius={[4, 4, 0, 0]} maxBarSize={50}>
              {chartData.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
