# ObraCalc Dev Tools (Extensão Chrome)

Extensão simples que abre GitHub, Supabase e Vercel em novas abas com um clique.

## Instalação (modo desenvolvedor)

1. Abra `chrome://extensions` no Chrome.
2. Ative **Modo do desenvolvedor** (canto superior direito).
3. Clique em **Carregar sem compactação**.
4. Selecione a pasta `dev-tools-extension/`.
5. Fixe a extensão na barra de ferramentas (ícone de quebra-cabeça → pin).

## Uso

Clique no ícone da extensão e depois no botão **Abrir GitHub + Supabase + Vercel**.
As três páginas abrem em novas abas usando a conta do Chrome atualmente logada no navegador.

> Dica: para abrir na conta `oescolhidoneo9@gmail.com`, primeiro troque de perfil no
> Chrome (avatar no topo direito) e depois clique no botão da extensão.

## URLs abertas

- https://github.com/
- https://supabase.com/dashboard
- https://vercel.com/dashboard

Edite `background.js` para alterar a lista `DEV_URLS`.
