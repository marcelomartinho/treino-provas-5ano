# Como publicar o site

O site está pronto em `C:\Dev\Gustavo\treino-provas-5ano`. Falta só autorizar a Vercel.

## Opção 1 — login pelo navegador (mais simples)

Abra um terminal nesta pasta e rode:

```bash
vercel login
```

A CLI mostra um link tipo `https://vercel.com/oauth/device?user_code=XXXX-XXXX`.
Abra o link, clique em **Confirm** e volte ao terminal. Depois:

```bash
vercel deploy --prod --yes
```

A URL pública aparece no final (algo como `https://treino-provas-5ano.vercel.app`).

## Opção 2 — token (não expira)

1. Crie um token em https://vercel.com/account/tokens
2. Rode:

```bash
vercel deploy --prod --yes --token SEU_TOKEN_AQUI --scope mmartinhobr-7084s-projects
```

> O `--scope` é necessário porque a conta tem time próprio e o modo não-interativo
> não assume um padrão. Foi assim nos deploys dos sites de revisão de junho.

## Republicar depois de atualizar as questões

Mesmo comando, mesma URL:

```bash
vercel deploy --prod --yes
```

## Testar localmente antes

```bash
python -m http.server 8123 --directory C:/Dev/Gustavo/treino-provas-5ano
```

Depois abra `http://localhost:8123` no navegador.

## Estrutura

- `index.html` — o app do quiz (tudo embutido: layout, lógica, placar, revisão de erros)
- `data/portugues.js` — 210 questões (prova 17/8)
- `data/historia.js` — 211 questões (prova 18/8)
- `data/matematica.js` — prova 19/8
- `data/ingles.js` — 210 questões (prova 20/8)
- `data/ciencias.js` — prova 21/8
- `data/geografia.js` — prova 24/8

Cada arquivo de matéria é carregado só quando Gustavo escolhe aquela matéria, para
economizar dados no celular.
