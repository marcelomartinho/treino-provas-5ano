# Como publicar o site

Site no ar (GitHub Pages): https://marcelomartinho.github.io/treino-provas-5ano/
Repositório: `marcelomartinho/treino-provas-5ano` (branch `main`). Cada push atualiza o site em ~1 minuto.

## Nova rodada de provas

1. Mova os bancos antigos para `arquivo/<rodada>/`.
2. Crie `data/<slug>.js` (formato abaixo) — meta 70 fáceis + 70 médias + 70 difíceis.
3. Valide: `node tools/validar.js` (ou `node tools/validar.js historia` para um só).
4. No `index.html`, ajuste `RODADA`, as datas em `SUBJECTS` (`dia`, `seg`) e marque `pronto:true`
   nas matérias que já podem aparecer (as outras ficam com cadeado "em breve").
5. Mude `BUILD` a cada publicação, para o celular baixar os bancos novos.
6. Publique: `git add index.html data/<slug>.js && git commit -m "..." && git push`.

## Formato de cada questão

```js
window.BANCO.historia = [
  {n:"f", t:"Tópico", q:"Enunciado?", a:["A","B","C","D"], c:0, e:"Explicação para a criança."},
];
```

`n` = nível (f/m/d), `c` = índice da correta. O app embaralha questões e alternativas.

## Testar localmente

```bash
python -m http.server 8123 --directory C:/Dev/Gustavo/treino-provas-5ano
```

Abra `http://localhost:8123` (modo celular do navegador, 360×740).
