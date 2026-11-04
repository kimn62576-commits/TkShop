async function test() {
  const r = await fetch("http://localhost:3000");
  const html = await r.text();
  console.log("HTML length:", html.length);
  const cssMatches = html.match(/href="([^"]+\.css)"/g);
  console.log("CSS Matches:", cssMatches);
  if (cssMatches) {
    for (const m of cssMatches) {
      const href = m.replace('href="', '').replace('"', '');
      const res = await fetch("http://localhost:3000" + href);
      console.log(href, "Status:", res.status);
    }
  }
}
test();
