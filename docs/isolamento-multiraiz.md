# Isolamento seguro de múltiplas raízes RSV360

Este guia serve para subir mais de uma base RSV360 ao mesmo tempo, sem conflito de:

- portas
- containers Docker
- volumes
- banco de dados
- caminhos locais

## Raízes identificadas

1. `D:\Backup rsv36-servidor-oficial 22_11_2025as_08_36\RSV360 Versao Oficial definitivo\PMS-CRM-RSV360-Versao-Oficial-definitivo\PMS-CRM-RSV360-Versao-Oficial-definitivo`
2. `D:\Backup rsv36-servidor-oficial 22_11_2025as_08_36\rsv360-servidor-oficial`
3. `C:\Users\RSV 360\Documents\GitHub\Crm-RSV-360`

## Regra de ouro

Nunca suba duas raízes usando:

- o mesmo `docker compose` sem `-p`
- as mesmas portas externas
- o mesmo `DATABASE_URL`
- o mesmo volume nomeado

## Nomes de projeto Docker sugeridos

- raiz 1: `rsv360_pms`
- raiz 2: `rsv360_ecosystem`
- raiz 3: `rsv360_crm`

## Portas sugeridas

### Raiz 1

- frontend/site: `3000`
- backend: `3002`
- admin: `3004`
- turismo: `3005`
- guest: `3006`
- grafana: `3007`
- prometheus: `9090`
- alertmanager: `9093`
- postgres: `5432`
- redis: `6379`

### Raiz 2

Use portas deslocadas para não colidir com a raiz 1:

- frontend/site: `3100`
- backend: `3102`
- admin: `3104`
- turismo: `3105`
- guest: `3106`
- api: `3107`
- jobs: `3108`
- postgres: `5433`

### Raiz 3

Esse projeto é monolítico e normalmente roda com uma porta única:

- app: `3200`
- banco: usar outro `DATABASE_URL`

## Início recomendado

### Opção mais segura

Suba apenas uma raiz por vez. Isso é o melhor cenário para comparar layout, porque:

- não mistura sessão
- não mistura seed
- não mistura cache
- não precisa renomear tudo

### Se precisar das 3 ao mesmo tempo

Use uma sessão por raiz e um nome de projeto diferente:

```powershell
cd "D:\Backup rsv36-servidor-oficial 22_11_2025as_08_36\RSV360 Versao Oficial definitivo\PMS-CRM-RSV360-Versao-Oficial-definitivo\PMS-CRM-RSV360-Versao-Oficial-definitivo"
docker compose -p rsv360_pms up -d
```

```powershell
cd "D:\Backup rsv36-servidor-oficial 22_11_2025as_08_36\rsv360-servidor-oficial"
docker compose -p rsv360_ecosystem up -d
```

```powershell
cd "C:\Users\RSV 360\Documents\GitHub\Crm-RSV-360"
npm run dev
```

## Banco de dados

Use um banco por raiz.

Exemplo seguro:

- raiz 1: `rsv_360_ecosystem`
- raiz 2: `rsv360_ecosystem_dev_2`
- raiz 3: `test_db_rsv360_crm`

Se você insistir em compartilhar um único PostgreSQL local, pelo menos use databases diferentes. Não use o mesmo schema para comparação.

## Checklist anti-conflito

Antes de iniciar uma raiz:

- verifique se a porta está livre
- confirme que o `DATABASE_URL` aponta para o banco certo
- confirme que `docker compose` está sendo chamado com `-p`
- confirme que o `.env` pertence à pasta atual
- confirme que não existe outro container usando a mesma porta

## Verificação rápida de portas no Windows

```powershell
Get-NetTCPConnection -State Listen | Sort-Object LocalPort | Select-Object LocalPort, LocalAddress, OwningProcess
```

## Verificação rápida de containers

```powershell
docker ps --format "table {{.Names}}\t{{.Ports}}\t{{.Status}}"
```

## Fluxo recomendado para comparação de layout

1. Suba a raiz 1.
2. Registre o layout.
3. Derrube a raiz 1.
4. Suba a raiz 2.
5. Registre o layout.
6. Derrube a raiz 2.
7. Suba a raiz 3.
8. Registre o layout.

Esse fluxo reduz bastante o risco de conflito e é o mais confiável para validação visual.
