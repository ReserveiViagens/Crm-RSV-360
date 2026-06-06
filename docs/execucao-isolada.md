# Execução Isolada RSV360

Este guia sobe apenas uma stack por vez, com o mínimo risco de conflito.

## Stacks disponíveis

- `pms`
- `ecosystem`
- `crm`

## Ordem recomendada

1. Suba `pms`
2. Valide a interface
3. Pare `pms`
4. Suba `ecosystem`
5. Valide a interface
6. Pare `ecosystem`
7. Suba `crm`
8. Valide a interface
9. Pare `crm`

## Subir uma stack

Na raiz `Crm-RSV-360`, rode:

```powershell
.\Start-One-Isolated.ps1 -Stack pms
.\Start-One-Isolated.ps1 -Stack ecosystem
.\Start-One-Isolated.ps1 -Stack crm
```

## Parar uma stack

Na raiz `Crm-RSV-360`, rode:

```powershell
.\Stop-Isolated.ps1 -Stack pms
.\Stop-Isolated.ps1 -Stack ecosystem
.\Stop-Isolated.ps1 -Stack crm
```

## Limpar tudo

```powershell
.\Clean-Isolated.ps1
```

Isso tenta liberar as portas temporárias usadas pelos launchers sem mexer nos outros projetos.

## Portas usadas

### `pms`

- backend: `3302`
- site: `3300`
- admin: `3304`
- guest: `3306`
- turismo: `3305`
- postgres: `6432`
- redis: `7379`

### `ecosystem`

- guest: `3200`
- admin: `3201`
- api: `3210`

### `crm`

- app: `3200`
- banco: configurado via `DATABASE_URL`

## Observações

- `jobs` no `ecosystem` ficou manual de propósito.
- Não use a mesma porta em duas stacks ao mesmo tempo.
- Se algum serviço já estiver em uso, pare a stack correspondente antes de iniciar outra.
