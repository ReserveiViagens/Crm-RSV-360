# Implantação no Vercel — RSV360

## Pré-requisitos

- Conta no [Vercel](https://vercel.com)
- Repositório `ReserveiViagens/Crm-RSV-360` conectado ao Vercel
- API Express em produção (ex: Replit Deployments)

## Como importar no Vercel / V0

1. Acesse [vercel.com/new](https://vercel.com/new) e clique em **Add New → Project**
2. Selecione o repositório `ReserveiViagens/Crm-RSV-360`
3. O Vercel detecta automaticamente `vercel.json` — não altere as configurações de build
4. Em **Environment Variables**, defina:
   - `VITE_API_URL` → URL da API de produção (ex: `https://rsv360-api.replit.app`)
   - Demais variáveis de `.env.example` (banco de dados, Stripe, etc.)
5. Clique em **Deploy**

## Configuração da API (`/api/*`)

O arquivo `vercel.json` inclui um proxy que redireciona todas as chamadas `/api/*` para o servidor Express em produção:

```json
{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "https://rsv360-api.replit.app/api/$1" }
  ]
}
```

> **Atenção:** substitua `https://rsv360-api.replit.app` pela URL real do deploy Express antes de publicar.

## Build

| Campo           | Valor           |
|----------------|-----------------|
| Build Command  | `npm run build` |
| Output Dir     | `dist/public`   |
| Install Cmd    | `npm install`   |
| Node Version   | 20.x            |

## Roteamento SPA

Todas as rotas (`/parques`, `/combos`, `/hoteis`, etc.) são redirecionadas para `index.html` pelo Vercel, exceto caminhos que começam com `/api/`.

## Domínio personalizado

Após o primeiro deploy, vá em **Project → Settings → Domains** e adicione seu domínio (ex: `reservei.com.br`).
