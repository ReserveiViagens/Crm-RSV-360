import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DollarSign, TrendingUp, Users, Wallet, Download, ArrowLeft, BarChart3, Activity
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend
} from "recharts";

const MONTHLY_DATA = [
  { name: "Jan", GMV: 45000, Lucro: 12000, Passageiros: 48 },
  { name: "Fev", GMV: 62000, Lucro: 18500, Passageiros: 67 },
  { name: "Mar", GMV: 89000, Lucro: 26700, Passageiros: 94 },
  { name: "Abr", GMV: 71000, Lucro: 21300, Passageiros: 78 },
  { name: "Mai", GMV: 95000, Lucro: 28500, Passageiros: 103 },
  { name: "Jun", GMV: 112000, Lucro: 33600, Passageiros: 124 },
];

const CONVERSION_DATA = [
  { name: "Jan", taxa: 12 }, { name: "Fev", taxa: 15 }, { name: "Mar", taxa: 18 },
  { name: "Abr", taxa: 14 }, { name: "Mai", taxa: 22 }, { name: "Jun", taxa: 27 },
];

const EXCURSOES_TABLE = [
  { nome: "Caldas Novas — Março", bruto: 89000, plataforma: 26700, organizador: 14500, passageiros: 94, status: "CONCLUIDA" },
  { nome: "Rio Quente — Feriado Abril", bruto: 71000, plataforma: 21300, organizador: 11360, passageiros: 78, status: "CONCLUIDA" },
  { nome: "Caldas Novas — Maio", bruto: 95000, plataforma: 28500, organizador: 15200, passageiros: 103, status: "EM ANDAMENTO" },
  { nome: "Rio Quente — Junho", bruto: 55000, plataforma: 16500, organizador: 8800, passageiros: 61, status: "VENDENDO" },
];

const fmtCurrency = (v: number) => `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;

function exportCSV() {
  const header = "Excursão,Bruto,Plataforma,Organizador,Passageiros,Status\n";
  const rows = EXCURSOES_TABLE.map(e => `${e.nome},${e.bruto},${e.plataforma},${e.organizador},${e.passageiros},${e.status}`).join("\n");
  const blob = new Blob([header + rows], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = "relatorio-financeiro.csv"; a.click();
}

export default function FinancialDashboard() {
  const [, setLocation] = useLocation();
  const currentMonth = MONTHLY_DATA[MONTHLY_DATA.length - 1];

  return (
    <div className="min-h-screen bg-background pb-20" data-testid="financial-dashboard">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setLocation("/admin")} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-extrabold text-foreground flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-primary" /> Centro de Comando Financeiro
            </h1>
            <p className="text-sm text-muted-foreground">Visão global de faturamento e comissionamento — Fuso: America/Cuiaba</p>
          </div>
          <Button onClick={exportCSV} variant="outline" size="sm" className="rounded-xl gap-2" data-testid="btn-export-csv">
            <Download className="w-4 h-4" /> Exportar CSV
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Lucro Líquido (Mês)", value: fmtCurrency(currentMonth.Lucro), sub: "+44% vs mês anterior", icon: DollarSign, color: "border-emerald-400", subColor: "text-emerald-600" },
            { label: "Volume Transacionado (GMV)", value: fmtCurrency(currentMonth.GMV), sub: "Total pago por passageiros", icon: Wallet, color: "border-primary", subColor: "text-muted-foreground" },
            { label: "Repasses Pagos (Split)", value: fmtCurrency(currentMonth.GMV - currentMonth.Lucro), sub: "Comissões de Organizadores", icon: TrendingUp, color: "border-amber-400", subColor: "text-muted-foreground" },
            { label: "Passageiros Pagantes", value: String(currentMonth.Passageiros), sub: "No mês atual", icon: Users, color: "border-blue-400", subColor: "text-muted-foreground" },
          ].map(({ label, value, sub, icon: Icon, color, subColor }) => (
            <Card key={label} className={`border-l-4 ${color} shadow-sm`} data-testid={`kpi-${label.substring(0, 10).toLowerCase().replace(/ /g, "-")}`}>
              <CardHeader className="flex flex-row items-center justify-between pb-1 pt-4 px-4">
                <CardTitle className="text-xs font-medium text-muted-foreground leading-tight">{label}</CardTitle>
                <Icon className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <p className="text-xl font-extrabold text-foreground">{value}</p>
                <p className={`text-xs mt-1 flex items-center gap-1 ${subColor}`}>
                  {subColor === "text-emerald-600" && <TrendingUp className="w-3 h-3" />}
                  {sub}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2"><BarChart3 className="w-4 h-4 text-primary" /> GMV vs Lucro Mensal</CardTitle>
              <CardDescription className="text-xs">Comparativo de volume bruto e lucro líquido da plataforma</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={MONTHLY_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v: number) => fmtCurrency(v)} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="GMV" name="GMV" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Lucro" name="Lucro Líquido" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2"><Activity className="w-4 h-4 text-primary" /> Tendência de Conversão</CardTitle>
              <CardDescription className="text-xs">Taxa de conversão de visitantes da landing page em pagamentos</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={CONVERSION_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
                  <Tooltip formatter={(v: number) => `${v}%`} />
                  <Line type="monotone" dataKey="taxa" name="Taxa de conversão" stroke="#8b5cf6" strokeWidth={2.5} dot={{ fill: "#8b5cf6", r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Excursões table */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Detalhamento por Excursão</CardTitle>
            <CardDescription className="text-xs">Breakdown de split financeiro por grupo de viagem</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    {["Excursão", "Bruto (GMV)", "Plataforma", "Organizador", "Passageiros", "Status"].map((h) => (
                      <th key={h} className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {EXCURSOES_TABLE.map((e, i) => (
                    <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/20" data-testid={`financial-row-${i}`}>
                      <td className="px-4 py-3 font-medium text-foreground">{e.nome}</td>
                      <td className="px-4 py-3 font-bold text-foreground">{fmtCurrency(e.bruto)}</td>
                      <td className="px-4 py-3 text-emerald-700 font-semibold">{fmtCurrency(e.plataforma)}</td>
                      <td className="px-4 py-3 text-amber-700 font-semibold">{fmtCurrency(e.organizador)}</td>
                      <td className="px-4 py-3">{e.passageiros}</td>
                      <td className="px-4 py-3">
                        <Badge className={`text-xs ${e.status === "CONCLUIDA" ? "bg-slate-100 text-slate-700" : e.status === "VENDENDO" ? "bg-blue-100 text-blue-700" : "bg-emerald-100 text-emerald-700"}`}>
                          {e.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
