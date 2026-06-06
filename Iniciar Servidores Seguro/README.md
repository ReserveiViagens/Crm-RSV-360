# Iniciar Servidores Seguro

Pasta central para iniciar e parar as stacks RSV360 sem conflito.

## Arquivos

- `Start-One-Isolated.ps1` - inicia uma stack por vez
- `Stop-Isolated.ps1` - para a stack selecionada
- `Clean-Isolated.ps1` - libera portas temporárias e limpa o que for seguro
- `Start-Isolated.ps1` - inicia o `Crm-RSV-360` em modo isolado
- `Start-All-Isolated.ps1` - dispara os launchers isolados
- `*.bat` - atalhos de clique duplo no Windows

## Uso recomendado

1. Rode uma stack por vez.
2. Pare antes de iniciar a próxima.
3. Use `Clean-Isolated` se sobrar porta presa.

