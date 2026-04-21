"""
Gunbound Turtle — Calculadora de Tiro (discreta, always-on-top).

Uso:
    python turtle_calc.py

Requer apenas Python 3 (Tkinter vem incluso).

Dados baseados nas tabelas do Darkcastle (Guild: Rise), Turtle Base 80.
"""

import tkinter as tk
from tkinter import ttk

# ---------------------------------------------------------------------------
# DADOS DAS TABELAS
# ---------------------------------------------------------------------------
# Leitura da tabela "1 SD" e "2 SD" (imagem 1).
# Formato: SHOTS[sd][fork][posicao] = (angulo, forca_base)
# Posições: "1/8", "1/4", "3/8", "1/2", "5/8", "3/4", "7/8"
#
# Onde não consegui ler com certeza coloquei None — ajuste depois.

POSICOES = ["1/8", "1/4", "3/8", "1/2", "5/8", "3/4", "7/8"]
FORKS = ["Fork 1", "Fork 2", "Fork 3", "Fork 4", "Fork 5", "Fork 6", "Conec"]

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
            "5/8": (28, 2.1),
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
            "3/4": (48, 2.1),
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
        # Tabela 2 SD só tem Fork 1, 4, 5, 6 e Conec — valores estimados
        # a partir da imagem, revise antes de usar em partida séria.
        "Fork 1": {
            "1/8": (16, 3.48),
            "1/4": (15, 3.84),
            "3/8": None, "1/2": None, "5/8": None, "3/4": None, "7/8": None,
        },
        "Fork 4": {
            "1/8": (26, 2.77),
            "1/4": (23, 3.2),
            "3/8": (21, 3.5),
            "1/2": (19, 3.75),
            "5/8": None, "3/4": None, "7/8": None,
        },
        "Fork 5": {
            "1/8": (37, 2.62),
            "1/4": (34, 2.81),
            "3/8": (31, 3.01),
            "1/2": (29, 3.23),
            "5/8": (27, 3.4),
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
# FATOR DE VENTO
# ---------------------------------------------------------------------------
# Leitura aproximada do círculo (imagem 3). 24 direções, em sentido horário
# a partir de 0° (topo = vento contra, ângulo aumenta no sentido horário).
# Valor = fator aplicado por unidade de força de vento.
#
# Fórmula (assumida, sujeita a confirmação):
#     forca_final = forca_base + vento * fator_direcao * sinal
# onde `sinal` é +1 se o vento atrapalha (contra) e −1 se ajuda (a favor).
# No círculo, vermelho = pontos de referência (múltiplos de 15°).

WIND_FACTOR_24 = [
    0.05, 0.11, 0.15, 0.20, 0.25, 0.30,  # 0-90 (topo à direita)
    0.37, 0.46, 0.52, 0.56, 0.57, 0.57,  # 90-180 (direita pra baixo)
    0.55, 0.50, 0.45, 0.41, 0.36, 0.31,  # 180-270 (baixo pra esquerda)
    0.25, 0.19, 0.15, 0.11, 0.05, 0.02,  # 270-360 (esquerda pro topo)
]

# ---------------------------------------------------------------------------
# APP
# ---------------------------------------------------------------------------
class TurtleCalc:
    def __init__(self):
        self.root = tk.Tk()
        self.root.title("Turtle Calc")
        self.root.attributes("-topmost", True)
        self.root.geometry("260x260")
        self.root.resizable(False, False)
        self.root.configure(bg="#1e1e1e")

        style = ttk.Style()
        try:
            style.theme_use("clam")
        except tk.TclError:
            pass
        style.configure("TLabel", background="#1e1e1e", foreground="#eaeaea", font=("Segoe UI", 9))
        style.configure("TCombobox", fieldbackground="#2a2a2a", background="#2a2a2a", foreground="#eaeaea")
        style.configure("Result.TLabel", font=("Consolas", 14, "bold"), foreground="#ffcc00", background="#1e1e1e")

        self.sd = tk.StringVar(value="1 SD")
        self.pos = tk.StringVar(value="1/2")
        self.fork = tk.StringVar(value="Fork 3")
        self.vento = tk.IntVar(value=0)
        self.direcao = tk.IntVar(value=0)  # 0..23 (15° cada)
        self.contra = tk.BooleanVar(value=True)

        self._build()
        self._recalc()

    def _build(self):
        pad = {"padx": 6, "pady": 3}

        ttk.Label(self.root, text="SD").grid(row=0, column=0, sticky="w", **pad)
        ttk.Combobox(self.root, textvariable=self.sd, values=list(SHOTS.keys()),
                     state="readonly", width=7).grid(row=0, column=1, **pad)

        ttk.Label(self.root, text="Posição").grid(row=0, column=2, sticky="w", **pad)
        ttk.Combobox(self.root, textvariable=self.pos, values=POSICOES,
                     state="readonly", width=6).grid(row=0, column=3, **pad)

        ttk.Label(self.root, text="Fork").grid(row=1, column=0, sticky="w", **pad)
        ttk.Combobox(self.root, textvariable=self.fork, values=FORKS,
                     state="readonly", width=7).grid(row=1, column=1, **pad)

        ttk.Label(self.root, text="Vento").grid(row=2, column=0, sticky="w", **pad)
        tk.Spinbox(self.root, from_=0, to=30, textvariable=self.vento, width=5,
                   bg="#2a2a2a", fg="#eaeaea", insertbackground="#eaeaea",
                   buttonbackground="#2a2a2a").grid(row=2, column=1, **pad)

        ttk.Label(self.root, text="Dir (0-23)").grid(row=2, column=2, sticky="w", **pad)
        tk.Spinbox(self.root, from_=0, to=23, textvariable=self.direcao, width=5,
                   bg="#2a2a2a", fg="#eaeaea", insertbackground="#eaeaea",
                   buttonbackground="#2a2a2a").grid(row=2, column=3, **pad)

        tk.Checkbutton(self.root, text="Vento contra", variable=self.contra,
                       bg="#1e1e1e", fg="#eaeaea", selectcolor="#2a2a2a",
                       activebackground="#1e1e1e", activeforeground="#eaeaea",
                       font=("Segoe UI", 9)).grid(row=3, column=0, columnspan=2, sticky="w", **pad)

        self.result = ttk.Label(self.root, text="—", style="Result.TLabel")
        self.result.grid(row=4, column=0, columnspan=4, pady=(12, 4))

        self.detail = ttk.Label(self.root, text="", foreground="#888")
        self.detail.grid(row=5, column=0, columnspan=4)

        for var in (self.sd, self.pos, self.fork, self.vento, self.direcao, self.contra):
            var.trace_add("write", lambda *_: self._recalc())

    def _recalc(self):
        shot = SHOTS.get(self.sd.get(), {}).get(self.fork.get(), {}).get(self.pos.get())
        if not shot:
            self.result.config(text="— sem dados —")
            self.detail.config(text="Tire/fork/posição sem valor cadastrado")
            return

        angulo, forca_base = shot
        fator = WIND_FACTOR_24[self.direcao.get() % 24]
        sinal = 1 if self.contra.get() else -1
        forca_final = forca_base + self.vento.get() * fator * sinal / 10.0
        # divisão por 10 é palpite — ajuste quando confirmar fórmula real

        self.result.config(text=f"Âng {angulo}°   Força {forca_final:.2f}")
        self.detail.config(
            text=f"base {forca_base:.2f}  +  vento {self.vento.get()}×{fator:.2f}  ({'contra' if sinal>0 else 'a favor'})"
        )

    def run(self):
        self.root.mainloop()


if __name__ == "__main__":
    TurtleCalc().run()
