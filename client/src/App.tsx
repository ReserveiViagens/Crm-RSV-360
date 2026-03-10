import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Hoteis from "@/pages/hoteis";
import Promocoes from "@/pages/promocoes";
import FlashDeals from "@/pages/flash-deals";
import Leiloes from "@/pages/leiloes";
import Ingressos from "@/pages/ingressos";
import Atracoes from "@/pages/atracoes";
import Contato from "@/pages/contato";
import CaldasAI from "@/pages/caldas-ai";
import MapaCaldas from "@/pages/mapa-caldas-novas";
import Perfil from "@/pages/perfil";
import ViagensGrupo from "@/pages/viagens-grupo";
import CriarExcursao from "@/pages/criar-excursao";
import QuemSomos from "@/pages/quem-somos";
import PoliticaPrivacidade from "@/pages/politica-de-privacidade";
import AdminDashboard from "@/pages/admin-dashboard";
import AdminFnrh from "@/pages/admin/fnrh";
import AssinaturaDigital from "@/pages/admin/assinatura-digital";
import Financeiro from "@/pages/admin/financeiro";
import Integracoes from "@/pages/admin/integracoes";
import CadasturPage from "@/pages/admin/cadastur";
import LGPDDashboard from "@/pages/admin/lgpd";
import RelatoriosAds from "@/pages/admin/relatorios-ads";
import SeguroViagem from "@/pages/admin/seguro-viagem";
import SegurancaEmbarque from "@/pages/admin/seguranca-embarque";
import ContratosExcursao from "@/pages/admin/contratos";
import FrotaANTT from "@/pages/admin/frota-antt";
import Excursoes from "@/pages/excursoes";
import CircularNav from "@/components/circular-nav";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/hoteis" component={Hoteis} />
      <Route path="/hoteis/:id" component={Hoteis} />
      <Route path="/excursoes" component={Excursoes} />
      <Route path="/promocoes" component={Promocoes} />
      <Route path="/flash-deals" component={FlashDeals} />
      <Route path="/leiloes" component={Leiloes} />
      <Route path="/ingressos" component={Ingressos} />
      <Route path="/atracoes" component={Atracoes} />
      <Route path="/contato" component={Contato} />
      <Route path="/caldas-ai" component={CaldasAI} />
      <Route path="/mapa-caldas-novas" component={MapaCaldas} />
      <Route path="/mapa" component={MapaCaldas} />
      <Route path="/perfil" component={Perfil} />
      <Route path="/viagens-grupo" component={ViagensGrupo} />
      <Route path="/viagens-grupo/:id" component={ViagensGrupo} />
      <Route path="/criar-excursao" component={CriarExcursao} />
      <Route path="/criar-excursao/:id" component={CriarExcursao} />
      <Route path="/quem-somos" component={QuemSomos} />
      <Route path="/politica-de-privacidade" component={PoliticaPrivacidade} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/admin/fnrh" component={AdminFnrh} />
      <Route path="/admin/assinatura-digital" component={AssinaturaDigital} />
      <Route path="/admin/financeiro" component={Financeiro} />
      <Route path="/admin/integracoes" component={Integracoes} />
      <Route path="/admin/cadastur" component={CadasturPage} />
      <Route path="/admin/lgpd" component={LGPDDashboard} />
      <Route path="/admin/relatorios-ads" component={RelatoriosAds} />
      <Route path="/admin/seguro-viagem" component={SeguroViagem} />
      <Route path="/admin/seguranca-embarque" component={SegurancaEmbarque} />
      <Route path="/admin/contratos" component={ContratosExcursao} />
      <Route path="/admin/frota-antt" component={FrotaANTT} />
      <Route path="/admin/frota" component={FrotaANTT} />
      <Route path="/admin/excursoes" component={ViagensGrupo} />
      <Route path="/admin/passageiros" component={ViagensGrupo} />
      <Route path="/dashboard" component={AdminDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
        <CircularNav />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
