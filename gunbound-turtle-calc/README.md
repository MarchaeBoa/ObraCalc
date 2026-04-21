# Gunbound Turtle — Calculadora de Tiro

Calculadora discreta (janela pequena, "always on top") para Turtle no Gunbound.

## Como rodar

1. Ter **Python 3** instalado (Tkinter já vem junto).
2. No terminal, dentro desta pasta:
   ```
   python turtle_calc.py
   ```

No Windows você pode dar duplo-clique em `turtle_calc.py`.

## Como usar

Todos os controles são **clicáveis** — não precisa digitar nada.

1. **SD** — 1 SD (mesma tela) ou 2 SD (mais distante).
2. **Tiro** — qual Fork/Conec você vai usar.
3. **Lado inimigo** — direita ou esquerda (a calculadora usa pra saber se o
   vento está contra ou a favor automaticamente).
4. **Posição do inimigo** — clique em um dos 7 pontos (1/8 a 7/8).
5. **Bússola de vento** — clique na direção do vento como aparece no jogo
   (24 pontos, a cada 15°). 0° = topo, 90° = direita, 180° = baixo, 270° = esquerda.
6. **Força do vento** — o número que aparece no jogo (0–30).

No centro da bússola aparece o fator daquela direção. A saída grande mostra:
- **Âng XX°** — ângulo pra colocar
- **Força Y.YY** — força pra colocar
- Embaixo: quanto o vento somou/subtraiu, e se está **contra** ou **a favor**

O botão **📌 topo** no canto superior direito liga/desliga o "always on top".

## Dados

Tabela de tiros extraída do **Darkcastle (Guild: Rise)**, Turtle Base 80.

Edite o dicionário `SHOTS` no topo de `turtle_calc.py` para:
- Corrigir valores que leram errado dos prints
- Preencher células marcadas como `None` (algumas posições de Fork 1 em 5/8–7/8
  e todo o Fork 6 em 2 SD estão faltando)

Edite `WIND_FACTOR_24` (lista de 24 valores) para ajustar os fatores do vento
conforme o círculo real do Darkcastle.

## Fórmula (provisória)

```
forca_final = forca_base + (vento × fator_direção × sinal) / 10
```

- `sinal = +1` se o vento está **contra** o inimigo
- `sinal = −1` se o vento está **a favor**

A divisão por 10 e o formato da soma são uma aproximação. Assim que a fórmula
oficial for confirmada, ajuste no método `_recalc` em `turtle_calc.py` (poucas
linhas, bem isolado).

## Estrutura do código

Um único arquivo `turtle_calc.py`:
- Bloco `SHOTS`: tabelas 1 SD e 2 SD
- Bloco `WIND_FACTOR_24`: fatores do círculo
- Classe `TurtleCalc`: UI e cálculo
  - `_draw_positions` / `_on_pos_click` — barra de posição
  - `_draw_wind` / `_on_wind_click` — bússola
  - `_recalc` — cálculo final (aqui mora a fórmula)
