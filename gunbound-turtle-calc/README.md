# Gunbound Turtle — Calculadora de Tiro

Calculadora discreta (janela pequena, "always on top") para Turtle no Gunbound.

## Como rodar

1. Ter Python 3 instalado (Tkinter já vem junto).
2. No terminal:
   ```
   python turtle_calc.py
   ```

No Windows, você também pode dar duplo-clique no arquivo `turtle_calc.py`.

## Como usar

1. **SD** — 1 SD (mesma tela / 1 delay) ou 2 SD (telas mais distantes).
2. **Posição** — onde o inimigo está no chão, dividindo a tela em 8 partes
   (1/8 é o mais próximo, 7/8 o mais distante).
3. **Fork** — qual tipo de tiro você quer usar (Fork 1 a 6, ou Conec).
4. **Vento** — a força mostrada no jogo (0–30).
5. **Dir (0-23)** — direção do vento em 24 posições do círculo, no sentido
   horário a partir do topo. 0 = topo, 6 = direita, 12 = baixo, 18 = esquerda.
6. **Vento contra** — marcar se o vento está empurrando o tiro pra longe do
   alvo; desmarcar se está empurrando na direção do alvo.

A saída mostra:
- **Âng XX°** — ângulo a colocar na mira
- **Força YY.YY** — força da barra

## Dados

Os valores foram extraídos das tabelas do **Darkcastle (Guild: Rise)**,
Turtle Base 80. Arquivo: `turtle_calc.py`, seção `SHOTS` e `WIND_FACTOR_24`.

Algumas células da tabela estão marcadas como `None` porque não consegui ler
com certeza da imagem. Edite o dicionário `SHOTS` para adicionar os valores
que faltam.

## Fórmula (provisória)

```
forca_final = forca_base + vento * fator_direcao * sinal / 10
```

**Atenção**: a divisão por 10 e o formato da fórmula são chute. Precisa ser
ajustado quando a fórmula real do chart for confirmada. A estrutura do código
(arquivo único) torna esse ajuste fácil — procure a função `_recalc`.
