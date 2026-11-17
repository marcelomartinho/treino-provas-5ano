// Valida os bancos de questoes.
// Uso: node tools/validar.js            -> valida todos os data/*.js
//      node tools/validar.js historia   -> valida so data/historia.js
// Sai com codigo 1 se houver qualquer erro.
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const DATA = path.join(__dirname, "..", "data");
const META = { f: 70, m: 70, d: 70 };
const PROIBIDAS = /(todas as (anteriores|alternativas)|nenhuma das (anteriores|alternativas)|all of the above|none of the above)/i;

const norm = s => String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, " ").trim();

function carregar(arquivo) {
  const ctx = { window: {} };
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(arquivo, "utf8"), ctx, { filename: arquivo });
  const chaves = Object.keys(ctx.window.BANCO || {});
  if (chaves.length !== 1) throw new Error(`${arquivo}: esperado 1 banco em window.BANCO, achei ${chaves.length}`);
  return { slug: chaves[0], banco: ctx.window.BANCO[chaves[0]] };
}

function validar(arquivo) {
  const { slug, banco } = carregar(arquivo);
  const esperado = path.basename(arquivo, ".js");
  const erros = [];
  if (slug !== esperado) erros.push(`slug "${slug}" difere do nome do arquivo "${esperado}"`);
  const cont = { f: 0, m: 0, d: 0 };
  const topicos = {};
  const vistos = new Map();
  let maisLonga = 0;
  banco.forEach((q, i) => {
    const id = `#${i + 1}`;
    if (!["f", "m", "d"].includes(q.n)) erros.push(`${id}: nivel invalido "${q.n}"`); else cont[q.n]++;
    if (!q.t || typeof q.t !== "string") erros.push(`${id}: sem topico`); else topicos[q.t] = (topicos[q.t] || 0) + 1;
    if (!q.q || typeof q.q !== "string" || q.q.trim().length < 8) erros.push(`${id}: enunciado vazio/curto`);
    if (!q.e || typeof q.e !== "string" || q.e.trim().length < 15) erros.push(`${id}: explicacao vazia/curta`);
    if (!Array.isArray(q.a) || q.a.length !== 4) { erros.push(`${id}: precisa de 4 alternativas`); return; }
    if (q.a.some(x => typeof x !== "string" || !x.trim())) erros.push(`${id}: alternativa vazia`);
    if (new Set(q.a.map(norm)).size !== 4) erros.push(`${id}: alternativas repetidas`);
    if (!Number.isInteger(q.c) || q.c < 0 || q.c > 3) erros.push(`${id}: indice da correta invalido (${q.c})`);
    if (q.a.some(x => PROIBIDAS.test(x))) erros.push(`${id}: usa "todas/nenhuma das anteriores" (proibido: as alternativas sao embaralhadas)`);
    const k = norm(q.q);
    if (vistos.has(k)) erros.push(`${id}: enunciado duplicado de #${vistos.get(k)}`); else vistos.set(k, i + 1);
    if (Number.isInteger(q.c)) {
      const lens = q.a.map(x => String(x).length);
      if (lens[q.c] === Math.max(...lens) && lens.filter(l => l === lens[q.c]).length === 1) maisLonga++;
    }
  });
  const falta = Object.keys(META).filter(n => cont[n] < META[n]).map(n => `${n}:${cont[n]}/${META[n]}`);
  const pctLonga = banco.length ? Math.round((maisLonga / banco.length) * 100) : 0;
  console.log(`\n== ${slug}: ${banco.length} questoes (f ${cont.f} / m ${cont.m} / d ${cont.d})`);
  console.log(`   topicos: ${Object.entries(topicos).map(([t, n]) => `${t} (${n})`).join(", ")}`);
  console.log(`   correta e a alternativa mais longa em ${pctLonga}% (ideal < 40%)`);
  if (falta.length) console.log(`   AVISO meta 70/70/70 nao atingida: ${falta.join(", ")}`);
  if (erros.length) { console.log(`   ${erros.length} ERRO(S):`); erros.slice(0, 40).forEach(e => console.log("   - " + e)); }
  else console.log("   OK: estrutura valida, sem duplicatas");
  return erros.length;
}

const alvo = process.argv[2];
const arquivos = alvo
  ? [path.join(DATA, alvo.replace(/\.js$/, "") + ".js")]
  : fs.readdirSync(DATA).filter(f => f.endsWith(".js")).map(f => path.join(DATA, f));
let total = 0;
for (const a of arquivos) {
  try { total += validar(a); } catch (e) { console.log(`\n== ${a}\n   ERRO ao carregar: ${e.message}`); total++; }
}
process.exit(total ? 1 : 0);
