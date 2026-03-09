export interface PassageiroBurocracia {
  nome: string;
  rg?: string;
  cpf?: string;
  contato?: string;
  assento?: string;
}

export interface ManifestoANTT {
  excursaoId: string;
  destino: string;
  dataIda: string;
  dataVolta: string;
  veiculoTipo: string;
  motorista?: string;
  passageiros: PassageiroBurocracia[];
  geradoEm: string;
}

export interface FNRH {
  excursaoId: string;
  hospedagem: string;
  dataCheckIn: string;
  dataCheckOut: string;
  passageiros: PassageiroBurocracia[];
  geradoEm: string;
}

export interface VoucherVIP {
  excursaoId: string;
  passageiroId: string;
  passageiroNome: string;
  tipo: "VIP";
  codigo: string;
  validade: string;
  beneficios: string[];
  geradoEm: string;
}

export function gerarManifestoANTT(
  excursaoId: string,
  destino: string,
  dataIda: string,
  dataVolta: string,
  veiculoTipo: string,
  passageiros: PassageiroBurocracia[]
): ManifestoANTT {
  return {
    excursaoId,
    destino,
    dataIda,
    dataVolta,
    veiculoTipo,
    passageiros,
    geradoEm: new Date().toISOString(),
  };
}

export function gerarFNRH(
  excursaoId: string,
  hospedagem: string,
  dataCheckIn: string,
  dataCheckOut: string,
  passageiros: PassageiroBurocracia[]
): FNRH {
  return {
    excursaoId,
    hospedagem,
    dataCheckIn,
    dataCheckOut,
    passageiros,
    geradoEm: new Date().toISOString(),
  };
}

export function gerarVoucherVIP(
  excursaoId: string,
  passageiroId: string,
  passageiroNome: string
): VoucherVIP {
  const codigo = `VIP-${excursaoId.slice(-4).toUpperCase()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  const validade = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
  return {
    excursaoId,
    passageiroId,
    passageiroNome,
    tipo: "VIP",
    codigo,
    validade,
    beneficios: [
      "Embarque prioritário",
      "Assento premium",
      "Desconto em opcionais",
      "Atendimento exclusivo",
    ],
    geradoEm: new Date().toISOString(),
  };
}
