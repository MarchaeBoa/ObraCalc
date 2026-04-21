"""
Gunbound Turtle — Calculadora de Tiro (discreta, always-on-top).

Uso:
    python turtle_calc.py

Requer apenas Python 3 (Tkinter já vem incluso).

Dados baseados nas tabelas do Darkcastle (Guild: Rise), Turtle Base 80.
"""

import math
import tkinter as tk
from tkinter import ttk

# ---------------------------------------------------------------------------
# DADOS DAS TABELAS
# ---------------------------------------------------------------------------
# SHOTS[sd][fork][posicao] = (angulo, forca_base)
# Posições: "1/8", "1/4", "3/8", "1/2", "5/8", "3/4", "7/8"
# Dados extraídos da tabela do Darkcastle. Onde não consegui ler com certeza,
# deixei `None` — edite abaixo para completar.

POSICOES = ["1/8", "1/4", "3/8", "1/2", "5/8", "3/4", "7/8"]
FORKS = ["Fork 1", "Fork 2", "Fork 3", "Fork 4", "Fork 5", "Fork 6", "Conec"]
SDS = ["1 SD", "2 SD"]

SHOTS = {
    "1 SD": {
        "Fork 1": {
            "1/8": (24, 0.99),
            "1/4": (13, 1.85),
            "3/8": (9,  2.73),
            "1/2": (6,  3.63),
            "5/8": None,
            "3/4": None,
            "7/8": None,
        },
        "Fork 2": {
            "1/8": (43, 0.85),
            "1/4": (25, 1.38),
            "3/8": (17, 1.97),
            "1/2": (11, 2.57),
            "5/8": (9,  3.19),
            "3/4": (8,  3.81),
            "7/8": None,
        },
        "Fork 3": {
            "1/8": (58, 0.93),
            "1/4": (39, 1.22),
            "3/8": (28, 1.70),
            "1/2": (22, 2.05),
            "5/8": (18, 2.50),
            "3/4": (15, 2.95),
            "7/8": (13, 3.42),
        },
        "Fork 4": {
            "1/8": (69, 1.05),
            "1/4": (53, 1.23),
            "3/8": (41, 1.48),
            "1/2": (33, 1.78),
            "5/8": (28, 2.10),
            "3/4": (24, 2.43),
            "7/8": (21, 2.78),
        },
        "Fork 5": {
            "1/8": (76, 1.18),
            "1/4": (64, 1.36),
            "3/8": (55, 1.55),
            "1/2": (47, 1.77),
            "5/8": (40, 1.93),
            "3/4": (35, 2.16),
            "7/8": (30, 2.46),
        },
        "Fork 6": {
            "1/8": (81, 1.58),
            "1/4": (73, 1.65),
            "3/8": (66, 1.71),
            "1/2": (60, 1.82),
            "5/8": (53, 1.95),
            "3/4": (48, 2.10),
            "7/8": (44, 2.26),
        },
        "Conec": {
            "1/8": (85, 2.13),
            "1/4": (81, 2.15),
            "3/8": (76, 2.19),
            "1/2": (72, 2.29),
            "5/8": (68, 2.36),
            "3/4": (64, 2.44),
            "7/8": (60, 2.53),
        },
    },
    "2 SD": {
        "Fork 1": {
            "1/8": (16, 3.48),
            "1/4": (15, 3.84),
            "3/8": None, "1/2": None, "5/8": None, "3/4": None, "7/8": None,
        },
        "Fork 4": {
            "1/8": (26, 2.77),
            "1/4": (23, 3.20),
            "3/8": (21, 3.50),
            "1/2": (19, 3.75),
            "5/8": None, "3/4": None, "7/8": None,
        },
        "Fork 5": {
            "1/8": (37, 2.62),
            "1/4": (34, 2.81),
            "3/8": (31, 3.01),
            "1/2": (29, 3.23),
            "5/8": (27, 3.40),
            "3/4": (25, 3.63),
            "7/8": (23, 3.82),
        },
        "Fork 6": {
            "1/8": None, "1/4": None, "3/8": None, "1/2": None,
            "5/8": None, "3/4": None, "7/8": None,
        },
        "Conec": {
            "1/8": (56, 2.63),
            "1/4": (51, 2.73),
            "3/8": (47, 2.84),
            "1/2": (44, 2.96),
            "5/8": (40, 3.06),
            "3/4": None, "7/8": None,
        },
    },
}

# ---------------------------------------------------------------------------
# FATORES DE VENTO
# ---------------------------------------------------------------------------
# 24 segmentos (a cada 15°), no sentido horário a partir do TOPO.
# Índice 0 = vento para cima (sul → norte).
# Índice 6 = vento para direita. Índice 12 = pra baixo. Índice 18 = pra esquerda.
# Valor = fator aplicado por unidade de força de vento.
# Aproximação do círculo do Darkcastle — ajuste fino pode ser feito aqui.

WIND_FACTOR_24 = [
    0.04, 0.11, 0.17, 0.24, 0.31, 0.39,
    0.47, 0.53, 0.57, 0.60, 0.61, 0.59,
    0.56, 0.52, 0.46, 0.39, 0.31, 0.24,
    0.17, 0.11, 0.05, 0.02, 0.01, 0.02,
]

# ---------------------------------------------------------------------------
# APP
# ---------------------------------------------------------------------------
BG      = "#141414"
PANEL   = "#1e1e1e"
INK     = "#eaeaea"
DIM     = "#666666"
ACCENT  = "#ffcc00"
GREEN   = "#4ade80"
RED     = "#f87171"


class TurtleCalc:
    def __init__(self):
        self.root = tk.Tk()
        self.root.title("Turtle Calc")
        self.root.configure(bg=BG)
        self.root.geometry("340x480")
        self.root.resizable(False, False)
        self.root.attributes("-topmost", True)

        style = ttk.Style()
        try:
            style.theme_use("clam")
        except tk.TclError:
            pass
        style.configure("TLabel", background=BG, foreground=INK, font=("Segoe UI", 9))
        style.configure("Dim.TLabel", background=BG, foreground=DIM, font=("Segoe UI", 8))
        style.configure("TCombobox", fieldbackground=PANEL, background=PANEL, foreground=INK)
        style.map("TCombobox", fieldbackground=[("readonly", PANEL)])

        self.sd      = tk.StringVar(value="1 SD")
        self.pos_idx = tk.IntVar(value=3)          # índice em POSICOES (1/2)
        self.fork    = tk.StringVar(value="Fork 3")
        self.vento   = tk.IntVar(value=0)
        self.dir_idx = tk.IntVar(value=6)          # direção do vento (0..23)
        self.lado    = tk.StringVar(value="direita")  # inimigo à direita/esquerda
        self.topmost = tk.BooleanVar(value=True)

        self._build()
        self._recalc()

    # -----------------------------------------------------------------------
    def _build(self):
        # Cabeçalho
        top = tk.Frame(self.root, bg=BG)
        top.pack(fill="x", padx=10, pady=(10, 4))
        tk.Label(top, text="TURTLE", bg=BG, fg=ACCENT,
                 font=("Segoe UI", 11, "bold")).pack(side="left")
        tk.Checkbutton(top, text="📌 topo", variable=self.topmost,
                       bg=BG, fg=DIM, selectcolor=PANEL,
                       activebackground=BG, activeforeground=INK,
                       font=("Segoe UI", 8), bd=0,
                       command=self._toggle_topmost).pack(side="right")

        # Linha 1: SD + Fork
        row1 = tk.Frame(self.root, bg=BG)
        row1.pack(fill="x", padx=10, pady=3)
        tk.Label(row1, text="SD", bg=BG, fg=DIM, font=("Segoe UI", 8)).grid(row=0, column=0, sticky="w")
        ttk.Combobox(row1, textvariable=self.sd, values=SDS,
                     state="readonly", width=6).grid(row=1, column=0, sticky="w")
        tk.Label(row1, text="Tiro", bg=BG, fg=DIM, font=("Segoe UI", 8)).grid(row=0, column=1, padx=(12,0), sticky="w")
        ttk.Combobox(row1, textvariable=self.fork, values=FORKS,
                     state="readonly", width=10).grid(row=1, column=1, padx=(12,0), sticky="w")
        tk.Label(row1, text="Lado inimigo", bg=BG, fg=DIM, font=("Segoe UI", 8)).grid(row=0, column=2, padx=(12,0), sticky="w")
        ttk.Combobox(row1, textvariable=self.lado, values=["direita", "esquerda"],
                     state="readonly", width=9).grid(row=1, column=2, padx=(12,0), sticky="w")

        # Barra de posição (7 dots clicáveis)
        tk.Label(self.root, text="Posição do inimigo", bg=BG, fg=DIM,
                 font=("Segoe UI", 8)).pack(anchor="w", padx=10, pady=(8,2))
        self.pos_canvas = tk.Canvas(self.root, height=46, bg=PANEL, highlightthickness=0)
        self.pos_canvas.pack(fill="x", padx=10)
        self.pos_canvas.bind("<Button-1>", self._on_pos_click)
        self._draw_positions()

        # Bússola de vento
        tk.Label(self.root, text="Direção do vento (clique)", bg=BG, fg=DIM,
                 font=("Segoe UI", 8)).pack(anchor="w", padx=10, pady=(8,2))
        self.wind_canvas = tk.Canvas(self.root, height=130, bg=PANEL, highlightthickness=0)
        self.wind_canvas.pack(fill="x", padx=10)
        self.wind_canvas.bind("<Button-1>", self._on_wind_click)
        self._draw_wind()

        # Força do vento
        row3 = tk.Frame(self.root, bg=BG)
        row3.pack(fill="x", padx=10, pady=(6, 0))
        tk.Label(row3, text="Força do vento", bg=BG, fg=DIM,
                 font=("Segoe UI", 8)).pack(side="left")
        tk.Spinbox(row3, from_=0, to=30, textvariable=self.vento, width=5,
                   bg=PANEL, fg=INK, insertbackground=INK,
                   buttonbackground=PANEL, bd=0).pack(side="right")

        # Resultado
        self.result_frame = tk.Frame(self.root, bg=PANEL, bd=0)
        self.result_frame.pack(fill="x", padx=10, pady=(12, 8))
        self.result = tk.Label(self.result_frame, text="—",
                               bg=PANEL, fg=ACCENT,
                               font=("Consolas", 16, "bold"), pady=8)
        self.result.pack()
        self.detail = tk.Label(self.result_frame, text="",
                               bg=PANEL, fg=DIM,
                               font=("Segoe UI", 8), pady=0)
        self.detail.pack(pady=(0, 8))

        for var in (self.sd, self.pos_idx, self.fork, self.vento, self.dir_idx, self.lado):
            var.trace_add("write", lambda *_: self._recalc())

    # -----------------------------------------------------------------------
    def _toggle_topmost(self):
        self.root.attributes("-topmost", self.topmost.get())

    # -----------------------------------------------------------------------
    def _draw_positions(self):
        c = self.pos_canvas
        c.delete("all")
        w = int(c.winfo_reqwidth()) or 320
        # usa tamanho efetivo depois do layout
        self.root.update_idletasks()
        w = c.winfo_width() or w
        n = len(POSICOES)
        margin = 22
        step = (w - 2 * margin) / (n - 1)
        sel = self.pos_idx.get()
        for i, name in enumerate(POSICOES):
            x = margin + i * step
            r = 9 if i == sel else 6
            fill = ACCENT if i == sel else "#333"
            c.create_oval(x - r, 20 - r, x + r, 20 + r, fill=fill, outline="")
            c.create_text(x, 36, text=name,
                          fill=ACCENT if i == sel else DIM,
                          font=("Segoe UI", 8, "bold" if i == sel else "normal"))

    def _on_pos_click(self, event):
        c = self.pos_canvas
        w = c.winfo_width()
        n = len(POSICOES)
        margin = 22
        step = (w - 2 * margin) / (n - 1)
        i = round((event.x - margin) / step)
        i = max(0, min(n - 1, i))
        self.pos_idx.set(i)
        self._draw_positions()

    # -----------------------------------------------------------------------
    def _draw_wind(self):
        c = self.wind_canvas
        c.delete("all")
        self.root.update_idletasks()
        w = c.winfo_width() or 320
        h = 130
        cx, cy = w // 2, h // 2
        R = 52
        # círculo base
        c.create_oval(cx - R, cy - R, cx + R, cy + R,
                      outline="#2a2a2a", width=1)
        # seta do vento
        sel = self.dir_idx.get()
        for i in range(24):
            ang = math.radians(i * 15 - 90)   # 0 no topo, horário
            x = cx + R * math.cos(ang)
            y = cy + R * math.sin(ang)
            is_sel = (i == sel)
            r = 5 if is_sel else 3
            fill = ACCENT if is_sel else ("#555" if i % 6 else "#888")
            c.create_oval(x - r, y - r, x + r, y + r, fill=fill, outline="")

        # seta do centro até o ponto selecionado
        ang_sel = math.radians(sel * 15 - 90)
        tx = cx + (R - 8) * math.cos(ang_sel)
        ty = cy + (R - 8) * math.sin(ang_sel)
        c.create_line(cx, cy, tx, ty, fill=ACCENT, width=2, arrow="last")

        # texto central: fator
        fator = WIND_FACTOR_24[sel]
        c.create_text(cx, cy - 4, text=f"{fator:.2f}", fill=INK, font=("Consolas", 10, "bold"))
        c.create_text(cx, cy + 10, text=f"{sel*15}°", fill=DIM, font=("Segoe UI", 8))

    def _on_wind_click(self, event):
        c = self.wind_canvas
        w = c.winfo_width()
        cx, cy = w // 2, 65
        dx, dy = event.x - cx, event.y - cy
        if dx == 0 and dy == 0:
            return
        ang = math.degrees(math.atan2(dy, dx)) + 90  # 0 = topo
        ang %= 360
        i = int(round(ang / 15)) % 24
        self.dir_idx.set(i)
        self._draw_wind()

    # -----------------------------------------------------------------------
    def _recalc(self):
        self._draw_positions()
        self._draw_wind()
        shot = SHOTS.get(self.sd.get(), {}).get(self.fork.get(), {}).get(POSICOES[self.pos_idx.get()])
        if not shot:
            self.result.config(text="— sem dados —", fg=RED)
            self.detail.config(text="Combinação SD/Tiro/Posição sem valor na tabela")
            return

        angulo, forca_base = shot
        fator = WIND_FACTOR_24[self.dir_idx.get() % 24]

        # Componente horizontal do vento: +1 se vento pra direita, −1 se pra esquerda
        # índice 0..5   = vento com componente direita (topo→direita)
        # índice 6..11  = direita→baixo (ainda tem componente direita)
        # índice 12..17 = baixo→esquerda (componente esquerda)
        # índice 18..23 = esquerda→topo (componente esquerda)
        d = self.dir_idx.get()
        vento_pra_direita = d < 12

        # Se inimigo à direita e vento pra direita => vento a favor (subtrai)
        # Se inimigo à direita e vento pra esquerda => contra (soma)
        inimigo_direita = (self.lado.get() == "direita")
        contra = (inimigo_direita and not vento_pra_direita) or \
                 (not inimigo_direita and vento_pra_direita)
        sinal = +1 if contra else -1

        # Fórmula provisória — ajustar conforme fórmula oficial do chart
        ajuste = self.vento.get() * fator * sinal / 10.0
        forca_final = forca_base + ajuste

        self.result.config(text=f"Âng {angulo}°    Força {forca_final:.2f}", fg=ACCENT)
        marca = "↑ contra" if contra else "↓ a favor"
        self.detail.config(
            text=f"base {forca_base:.2f}  {'+' if sinal>0 else '−'}  {abs(ajuste):.2f}   ({marca})"
        )

    # -----------------------------------------------------------------------
    def run(self):
        self.root.after(50, self._recalc)  # redesenha após medir widgets
        self.root.mainloop()


if __name__ == "__main__":
    TurtleCalc().run()
