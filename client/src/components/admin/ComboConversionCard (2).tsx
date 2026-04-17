import { useQuery } from "@tanstack/react-query";
import { TrendingUp, ShoppingCart, Percent, DollarSign } from "lucide-react";

type AdminMetrics = {
  summary: {
    totalOrders: number;
    paidOrders: number;
    conversionRate: number;
    comboRate: number;
    monthlyRevenue: number;
    totalSavings: number;
    avgTicketCombo: number;
    avgTicketNoCombo: number;
    vouchersGenerated: number;
    vouchersPending: number;
  };
};

function StatTile({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 20px", background: "#fff", borderRadius: 12, border: "1px solid #E5E7EB", flex: 1 }}>
      <div style={{ width: 40, height: 40, borderRadius: 10, background: color + "20", display: "flex", alignItems: "center", justifyContent: "center", color }}>
        {icon}
      </div>
      <div>
        <p style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#111827" }} data-testid={`metric-value-${label.toLowerCase().replace(/\s/g, "-")}`}>{value}</p>
        <p style={{ margin: 0, fontSize: 12, color: "#6B7280" }}>{label}</p>
      </div>
    </div>
  );
}

export default function ComboConversionCard() {
  const { data, isLoading } = useQuery<AdminMetrics>({ queryKey: ["/api/admin/metrics"] });

  if (isLoading) {
    return (
      <div style={{ padding: 20, background: "#fff", borderRadius: 12, border: "1px solid #E5E7EB" }}>
        <div style={{ height: 80, background: "#F3F4F6", borderRadius: 8 }} />
      </div>
    );
  }

  const s = data?.summary;
  const fmt = (n: number) => `R$ ${n.toFixed(2).replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;

  return (
    <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E5E7EB", padding: 20 }}>
      <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 600, color: "#111827", display: "flex", alignItems: "center", gap: 8 }}>
        <TrendingUp size={18} color="#2563EB" /> Métricas de Conversão — Combo IA
      </h3>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <StatTile icon={<ShoppingCart size={18} />} label="Pedidos Totais" value={String(s?.totalOrders ?? 0)} color="#2563EB" />
        <StatTile icon={<Percent size={18} />} label="Taxa de Conversão" value={`${s?.conversionRate ?? 0}%`} color="#22C55E" />
        <StatTile icon={<TrendingUp size={18} />} label="Taxa de Combo" value={`${s?.comboRate ?? 0}%`} color="#F57C00" />
        <StatTile icon={<DollarSign size={18} />} label="Receita (PAID)" value={fmt(s?.monthlyRevenue ?? 0)} color="#8B5CF6" />
      </div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 12 }}>
        <StatTile icon={<DollarSign size={18} />} label="Ticket Médio (Combo)" value={fmt(s?.avgTicketCombo ?? 0)} color="#F59E0B" />
        <StatTile icon={<DollarSign size={18} />} label="Ticket Médio (Sem Combo)" value={fmt(s?.avgTicketNoCombo ?? 0)} color="#6B7280" />
        <StatTile icon={<TrendingUp size={18} />} label="Economia Gerada" value={fmt(s?.totalSavings ?? 0)} color="#10B981" />
        <StatTile icon={<ShoppingCart size={18} />} label="Vouchers Gerados" value={String(s?.vouchersGenerated ?? 0)} color="#2563EB" />
      </div>
    </div>
  );
}
