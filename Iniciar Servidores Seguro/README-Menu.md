# Menu de Servidores RSV360

Este diretório centraliza o fluxo seguro para iniciar, parar e limpar as stacks sem conflito.

## Ordem de uso recomendada

1. Abra `Abrir_Menu_Rapido.bat` se quiser o fluxo enxuto.
2. Abra `Abrir_Menu_Completo.bat` se quiser o menu principal.
3. Selecione `1` para iniciar uma stack.
4. Escolha a stack desejada:
   - `pms`
   - `ecosystem`
   - `crm`
5. Aguarde o startup terminar.
6. Use `4` para ver portas abertas.
7. Use `5` para ver healthchecks.
8. Use `2` para parar a stack quando terminar.
9. Use `3` para limpar portas temporárias se sobrar algo preso.

## Arquivos principais

- `Menu-Servidores.ps1` - menu mestre
- `Menu-Servidores-Minimo.ps1` - menu rápido
- `Start-Stack.ps1` - menu de início rápido
- `Stop-Stack.ps1` - menu de parada rápida
- `Start-One-Isolated.ps1` - inicia uma stack isolada
- `Stop-Isolated.ps1` - para uma stack isolada
- `Clean-Isolated.ps1` - limpeza segura
- `Status-Servidores.ps1` - portas e containers
- `Health-Servidores.ps1` - healthchecks básicos

## Dica

Se uma stack não responder, rode primeiro `4` e `5` no menu para confirmar:

- quais portas estão ocupadas
- quais serviços realmente subiram
