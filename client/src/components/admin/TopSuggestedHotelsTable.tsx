import { useQuery } from "@tanstack/react-query";
import { Hotel } from "lucide-react";

type HotelGroup = {
  group: string;
  suggested: number;
  accepted: number;
  acceptanceRate: number;
};

type AdminMetrics = {
  topHotelGroups: HotelGroup[];
};

const GROUP_LABELS: Record<string, string> = {
  DIROMA: "DiRoma Hotels",
  PRIVE: "Privê Caldas",
  GOLDEN_DOLPHIN: "Golden Dolphin",
  RIO_QUENTE: "Rio Quente Resorts",
  INDEPENDENTE: "Independente",
};

export default function TopSuggestedHotelsTable() {
  const { data, isLoading } = useQuery<AdminMetrics>({ queryKey: ["/api/admin/metrics"] });

  return (
    <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E5E7EB", padding: 20 }}>
      <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 600, color: "#111827", display: "flex", alignItems: "center", gap: 8 }}>
        <Hotel size={18} color="#2563EB" /> Top Grupos Hoteleiros — Taxa de Aceite
      </h3>
      {isLoading ? (
        <div style={{ height: 120, background: "#F3F4F6", borderRadius: 8 }} />
      ) : (data?.topHotelGroups ?? []).length === 0 ? (
        <p style={{ color: "#9CA3AF", fontSize: 14, textAlign: "center", padding: "24px 0" }}>
          Nenhum pedido registrado ainda.
        </p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #E5E7EB" }}>
              <th style={{ textAlign: "left", padding: "8px 0", color: "#6B7280", fontWeight: 500 }}>Grupo</th>
              <th style={{ textAlign: "right", padding: "8px 0", color: "#6B7280", fontWeight: 500 }}>Sugerido</th>
              <th style={{ textAlign: "right", padding: "8px 0", color: "#6B7280", fontWeight: 500 }}>Aceite</th>
              <th style={{ textAlign: "right", padding: "8px 0", color: "#6B7280", fontWeight: 500 }}>Taxa</th>
            </tr>
          </thead>
          <tbody>
            {(data?.topHotelGroups ?? []).map((row) => (
              <tr key={row.group} style={{ borderBottom: "1px solid #F3F4F6" }} data-testid={`row-hotel-group-${row.group}`}>
                <td style={{ padding: "10px 0", fontWeight: 500, color: "#111827" }}>
                  {GROUP_LABELS[row.group] ?? row.group}
                </td>
                <td style={{ padding: "10px 0", textAlign: "right", color: "#6B7280" }}>{row.suggested}</td>
                <td style={{ padding: "10px 0", textAlign: "right", color: "#22C55E", fontWeight: 600 }}>{row.accepted}</td>
                <td style={{ padding: "10px 0", textAlign: "right" }}>
                  <span style={{
                    background: row.acceptanceRate >= 50 ? "#DCFCE7" : row.acceptanceRate >= 25 ? "#FEF3C7" : "#FEE2E2",
                    color: row.acceptanceRate >= 50 ? "#16A34A" : row.acceptanceRate >= 25 ? "#D97706" : "#DC2626",
                    padding: "2px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600,
                  }}>
                    {row.acceptanceRate}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
