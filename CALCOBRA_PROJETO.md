# CalcObra Pro — Resumo Completo do Projeto

## Arquivos Entregues

| Arquivo | Tamanho | Descrição |
|---|---|---|
| `calcobra-ultra.html` | 1.3 MB | **Landing page final** — ultra-premium, standalone HTML |
| `calcobra_dashboard.jsx` | 54 KB | **Dashboard SaaS** — React, paleta black/gold |
| `calcobra.jsx` | 80 KB | Dashboard original (versão anterior, sem paleta da landing) |
| `calcobra-landing.html` | 75 KB | Landing page versão anterior (creme/dourado) |
| `calcobra-premium.html` | 74 KB | Landing page versão intermediária |

---

## Landing Page — calcobra-ultra.html

### Stack de Design
- **Tipografia:** `Unbounded` (900, títulos) + `Cormorant Garamond` (destaques itálicos) + `DM Mono` (corpo/labels)
- **Paleta CSS Variables:**
  ```
  --bg: #040404   --bg2: #080808   --bg3: #0e0e0e   --bg4: #141414   --bg5: #1a1a1a
  --gold: #C9982A  --gold2: #DDB040  --gold3: #EEC85A  --gold4: #F8DC82
  --gold-dim: rgba(201,152,42,0.10)   --gold-mid: rgba(201,152,42,0.22)
  --border: rgba(255,255,255,0.06)    --border2: rgba(255,255,255,0.10)
  --text: #F2EDE4   --text2: #8A8070   --text3: #3A3530
  --g: linear-gradient(135deg,#C9982A 0%,#EEC85A 50%,#C9982A 100%)
  ```
- **Efeitos:** canvas 220 partículas douradas, spotlight bento cards, shimmer text, custom cursor, marquee ticker, scroll reveal, contador animado

### 12 Seções
1. Nav sticky com blur
2. Hero split 50/50 — texto esquerdo + mármore foto direita
3. Marquee ticker dourado
4. Numbers — 4 métricas com contador animado
5. Marble Break — foto cinematic full-width
6. How It Works — painel sticky esquerdo + steps direita
7. Features Bento — grid 12 colunas assimétrico com spotlight
8. Comparison — tabela CalcObra vs planilha vs concorrente
9. Testimonials — 3 depoimentos
10. Pricing — 3 planos (Gratuito / Pro R$79 / Enterprise R$197)
11. CTA Final — fundo com foto de obra noturna
12. Footer

### 6 Fotos Integradas (base64 embedded)
- `Novo_Layout-25.jpg` → Seção "Como Funciona" (painel sticky esquerdo)
- `marmorecolorido00.jpeg` → Hero right pane + Seção break cinematic
- `capa-1.png` → Seção Comparativo
- `trabalhadores-que-examinam-o-trabalho...jpg` → Seção Métricas (fundo)
- `trabalhador-da-construcao-coloca-tijolos...avif` → Seção "Como Funciona" (card lateral)
- `trabalhador-de-construcao-vestindo...avif` → Seção Pricing (fundo)

### Sistema de Autenticação (dentro do HTML)
- Modal com 6 views: Login → Register → Sending → Code OTP → Success → Demo
- Verificação 6 dígitos com timer 60s reenvio
- Chama Anthropic API para gerar texto personalizado do email
- Usuários salvos em `localStorage('co_users')`
- Todos os botões da landing wireados (`openAuth('login' | 'register' | 'demo')`)

---

## Dashboard — calcobra_dashboard.jsx

### Identidade Visual
100% idêntica à landing page:
- Mesmas CSS variables / tokens
- Mesmas fontes: Unbounded + DM Mono + Cormorant Garamond
- Gradiente dourado shimmer nos botões CTA e valores
- Linha dourada no topo dos cards em destaque
- Labels com traço dourado lateral (estilo seções da landing)
- Toggle com fundo `#C9982A` quando ativo

### Estrutura (8 páginas no menu)
1. **Dashboard** — 4 KPI cards + atalhos rápidos + tabela orçamentos recentes
2. **Novo Orçamento** — placeholder
3. **Simulador m²** — calculadora principal (veja abaixo)
4. **Calculadoras** — 4 abas especializadas
5. **Clientes** — placeholder
6. **Materiais** — placeholder
7. **Relatórios** — placeholder
8. **Configurações** — placeholder

### Simulador de Preço por m² (PRINCIPAL)
Campos: tipo de serviço, material, comprimento × largura, espessura, perda %, valor material/m², mão de obra/m², custos extras, toggle instalação, margem de lucro

Cálculos em tempo real:
- Área total, Área com perda, Custo material, Perda em R$, Mão de obra, Custos extras
- Subtotal, Lucro (%), Total final, Valor por m²
- Barra visual custo × lucro
- Botões: Salvar simulação / Gerar orçamento / Exportar PDF

### Calculadoras (4 abas)

#### Mármore
- **5 tipos de pedra** com preços reais: Granito São Gabriel (R$320/m²), Andorinha (R$290), Branco Itaúnas (R$380), Mármore Carrara (R$680), Granito Preto (R$360)
- Campos: comprimento, largura, espessura, quantidade de peças
- Acabamentos: frontão (ml), saia (ml), recorte de cuba (R$180), furação (R$60), instalação
- Resultados: área, perímetro, custo pedra, acabamentos, cortes, instalação, **total + R$/m²**

#### Piso
- Campos: dimensão do ambiente, tamanho da peça, perda %, preços (piso, argamassa saco 20kg, rejunte kg, mão de obra)
- Cálculos: área com perda, **quantidade de peças**, sacos de argamassa (6kg/m²), kg de rejunte (0.5kg/m²)
- Resultados: total + R$/m²

#### Alvenaria
- **4 tipos de bloco**: 9×19×39 padrão, 14×19×39 estrutural, 19×19×39 vedação, Tijolo 9 furos
- Campos: altura, comprimento, aberturas (descontadas), preço bloco, mão de obra
- Cálculos: blocos com 5% folga, volume argamassa em m³ e sacos (1600kg/m³, sacos 20kg)
- Resultados: total + R$/m²

#### Reboco
- **4 tipos**: Reboco Paulista (3.5m²/sc), Massa Corrida PVA (10m²/sc), Gesso (1.5m²/sc), Argamassa ACII (2.8m²/sc)
- Campos: área parede, área teto, espessura (fator proporcional), preço saco, mão de obra
- Resultados: total + R$/m²

---

## Próximas Etapas Sugeridas

### Dashboard (implementar as páginas placeholder)
- [ ] **Gerenciamento de Orçamentos** — listagem, filtros, status, CRUD
- [ ] **Clientes** — cadastro, histórico de orçamentos por cliente
- [ ] **Materiais** — tabela de preços atualizable, categorias
- [ ] **Relatórios** — gráficos de faturamento, por serviço, por período
- [ ] **Configurações** — perfil, logo da empresa, tabela de preços padrão

### Funcionalidades a adicionar
- [ ] Geração de PDF real do orçamento com logo e dados da empresa
- [ ] Salvar simulações no localStorage / backend
- [ ] Histórico de simulações por cliente
- [ ] Modo de impressão do orçamento
- [ ] Integração com a landing page (auth → redirecionar para dashboard)

### Integração Landing ↔ Dashboard
- Conectar o sistema de auth da landing (`co_users` localStorage) com o dashboard
- Ao fazer login na landing, redirecionar para o dashboard
- Mostrar nome/plano do usuário logado no sidebar

---

## Como Usar os Arquivos

### Landing Page
Abrir `calcobra-ultra.html` diretamente no browser — arquivo standalone, sem dependências externas exceto Google Fonts.

### Dashboard (React)
Cole o conteúdo de `calcobra_dashboard.jsx` em qualquer ambiente React:
- Claude.ai artifact (funciona diretamente)
- CodeSandbox / StackBlitz
- Projeto Next.js/Vite: renomear para `.tsx` e ajustar imports se necessário

Dependências necessárias: apenas React 18+ (usa somente `useState` e `useMemo`)
Google Fonts necessárias: Unbounded, DM Mono, Cormorant Garamond
