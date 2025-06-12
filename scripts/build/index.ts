import { Glob, $ } from "bun";
import path from "node:path";

const mds = new Glob('**/*.md');

const outdir = "./out";

function markdownToHtml(file: string) {
  return file.replace(/\.md$/, '.html');
}

async function buildMarkdown(file: string, out: string) {
  const targetDir = path.dirname(out);
  await $`mkdir -p ${targetDir}`;
  const buffer = await ($`pandoc -s -t html -f commonmark_x ${file}`.bytes());
  const rewriter = new HTMLRewriter();
  rewriter.on('a', {
    element(e) {
      const href = e.getAttribute('href');
      if (!href) return;
      if (!href.startsWith('./')) return;
      if (!href.endsWith('.md')) return;
      const newRef = href.replace(/\.md$/, '.html');
      e.setAttribute('href', newRef);
    }
  })
  const html = rewriter.transform(buffer);
  Bun.write(out, html);
}

const index = path.join(outdir, 'index.html');
await buildMarkdown('README.md', index);

// set title of index
const indexContent = await Bun.file(index).text();
const update = new HTMLRewriter().on("head > title", { element(el) { el.setInnerContent("Tiny Thoughts") } }).transform(indexContent);
Bun.write(index, update);


for await (const file of mds.scan("./thoughts")) {
  const inp = path.join('./thoughts', file);
  const out = path.join(outdir, markdownToHtml(inp));
  await buildMarkdown(inp, out);
}
