const fs = require("fs");
const path = require("path");
const { fromPath } = require("pdf2pic");
const os = require("os");

// ─── Static PDF path ───────────────────────────────────────────────────────
const STATIC_PDF_PATH = path.resolve(__dirname, "../assets/Datasheet background.pdf");

// ─── In-memory cache ────────────────────────────────────────────────────────
let cachedCoverBase64 = null;
let cachedBackBase64  = null;

const getStaticPages = async () => {
  if (cachedCoverBase64 && cachedBackBase64) {
    console.log("✅ Cache hit — returning cached pages");
    return { cover: cachedCoverBase64, back: cachedBackBase64 };
  }

  const tmpDir = os.tmpdir();

  console.log("📄 PDF Path:", STATIC_PDF_PATH);
  console.log("📁 PDF exists:", fs.existsSync(STATIC_PDF_PATH));
  console.log("📂 TmpDir:", tmpDir);

  const converter = fromPath(STATIC_PDF_PATH, {
    density: 150,
    saveFilename: "aadona_ds_bg",
    savePath: tmpDir,
    format: "png",
    width: 794,
    height: 1123,
  });

  const [page1, page2] = await Promise.all([
    converter(1, { responseType: "base64" }),
    converter(2, { responseType: "base64" }),
  ]);

  console.log("🖼️ Page1 base64 length:", page1?.base64?.length ?? "UNDEFINED/NULL");
  console.log("🖼️ Page2 base64 length:", page2?.base64?.length ?? "UNDEFINED/NULL");
  console.log("📦 Page1 keys:", Object.keys(page1 || {}));
  console.log("📦 Page2 keys:", Object.keys(page2 || {}));

  cachedCoverBase64 = page1.base64;
  cachedBackBase64  = page2.base64;

  console.log("✅ Static PDF pages converted and cached");

  return { cover: cachedCoverBase64, back: cachedBackBase64 };
};

// ──────────────────────────────────────────────────────────────────────────
const buildDatasheetHTML = async (product) => {

  const { cover: coverBase64, back: backBase64 } = await getStaticPages();

  const logo = fs.readFileSync(
    path.resolve(__dirname, "../assets/logo.png")
  ).toString("base64");

  const fetchImageAsBase64 = async (imageUrl) => {
    try {
      const response = await fetch(imageUrl);
      const buffer   = await response.arrayBuffer();
      const base64   = Buffer.from(buffer).toString("base64");
      const mimeType = response.headers.get("content-type") || "image/jpeg";
      return `data:${mimeType};base64,${base64}`;
    } catch (err) {
      console.error("Product image fetch failed:", err);
      return "";
    }
  };

  const productImageBase64 = product.image
    ? await fetchImageAsBase64(product.image)
    : "";

  // ─── Reusable page header HTML ─────────────────────────────────────────
  // border-top = green bar (5px), no separate div needed — zero gap guaranteed
  const pageHeaderHTML = `
    <div style="width:794px;background:#f4f9f4;border-bottom:1px solid #d8ead8;
      border-top:5px solid #25a86a;display:flex;align-items:center;
      padding:12px 64px;box-sizing:border-box;">
      <div style="flex:1;">
        <img src="data:image/png;base64,${logo}" style="height:28px;width:auto;opacity:0.85;" />
      </div>
      <div style="font-size:9px;font-weight:700;letter-spacing:2px;
        color:#1b7f4c;text-transform:uppercase;">
        ${product.model || product.name}
      </div>
    </div>`;

  // ─── Highlights HTML ───────────────────────────────────────────────────
  const highlightsHTML = (product.features || [])
    .map(h => `
      <div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:10px;">
        <div style="width:7px;height:7px;min-width:7px;background:#25a86a;border-radius:50%;margin-top:5px;flex-shrink:0;"></div>
        <div style="font-size:13px;color:#444;line-height:1.7;text-align:justify;">${h}</div>
      </div>`)
    .join("");

  // ─── Features Detail HTML ──────────────────────────────────────────────
  const featuresDetailHTML = (product.featuresDetail || [])
    .map(item => {
      if (item._type === "subheading" || item.title) {
        return `
          <div style="margin-bottom:10px;">
            <div style="font-size:13px;font-weight:700;color:#1b7f4c;border-left:3px solid #25a86a;padding-left:10px;margin-bottom:4px;text-transform:uppercase;letter-spacing:0.5px;">${item.title}</div>
            ${item.description ? `<div style="font-size:13px;color:#444;line-height:1.7;padding-left:13px;text-align:justify;">${item.description}</div>` : ""}
          </div>`;
      }
      return `
        <div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:8px;">
          <div style="width:7px;height:7px;min-width:7px;background:#25a86a;border-radius:50%;margin-top:5px;flex-shrink:0;"></div>
          <div style="font-size:13px;color:#444;line-height:1.7;text-align:justify;">${item.description || ""}</div>
        </div>`;
    }).join("");

  // ─── Specs HTML ────────────────────────────────────────────────────────
  const specsHTML = Object.entries(product.specifications || {})
    .map(([section, specs]) => {
      const rows = Object.entries(specs || {})
        .map(([key, value], i) => {
          const values = Array.isArray(value)
            ? value.filter(Boolean)
            : value ? [value] : [];
          const isMultiple = values.length > 1;

          const valueCell = isMultiple
            ? `<ul style="margin:0;padding:0;list-style:none;">${
                values.map(point =>
                  `<li style="display:flex;align-items:flex-start;gap:7px;margin-bottom:4px;">
                    <span style="color:#25a86a;font-size:11px;margin-top:2px;flex-shrink:0;">•</span>
                    <span>${point}</span>
                  </li>`
                ).join("")
              }</ul>`
            : `${values[0] ?? ""}`;

          return `
          <tr>
            <td style="padding:9px 14px;font-size:12px;font-weight:600;color:#2d4a2d;background:${i % 2 === 0 ? "#f3f8f3" : "#eaf2ea"};border:0.5px solid #dde8dd;width:38%;vertical-align:middle;text-align:center;">${key}</td>
            <td style="padding:9px 14px;font-size:12px;color:#444;background:${i % 2 === 0 ? "#fff" : "#fafffe"};border:0.5px solid #dde8dd;vertical-align:middle;">${valueCell}</td>
          </tr>`;
        })
        .join("");

      return `
        <div style="margin-bottom:24px;padding-top:2px;">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;padding-top:10px;">
            <div style="width:4px;height:16px;min-width:4px;background:#25a86a;border-radius:2px;"></div>
            <div style="font-size:12px;font-weight:700;color:#1b7f4c;letter-spacing:0.8px;text-transform:uppercase;">${section}</div>
          </div>
          <table style="width:100%;border-collapse:collapse;">${rows}</table>
        </div>`;
    }).join("");

  // ══════════════════════════════════════════════════════════════════════
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<style>
  /* @page margin: 0 for cover/back, aur content pages ke liye top margin = header height */
  @page        { size: 794px 1123px; margin: 0; }
  @page cover  { margin: 0; }
  @page back   { margin: 0; }

  * { box-sizing: border-box; margin: 0; padding: 0;
      -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  html, body { width: 794px; margin: 0; padding: 0;
               font-family: Arial, sans-serif; background: #fff; }

  /* Fixed header — har page ke top pe automatically repeat hoga */
  .page-header-fixed {
    position: fixed;
    top: 0;
    left: 0;
    width: 794px;
    z-index: 100;
  }

  /* Cover aur back pe header nahi dikhna chahiye */
  .page-fixed .page-header-fixed { display: none; }

  .page-fixed {
    display: block;
    width: 794px;
    height: 1123px;
    page-break-after: always;
    break-after: page;
    position: relative;
    overflow: hidden;
  }
  .cover-page { page: cover; }
  .back-cover {
    page: back;
    page-break-before: always;
    break-before: page;
    page-break-after: avoid;
    break-after: avoid;
  }

  /* Content page — top padding = header height (5px green + 52px header = 57px) */
  .page-content {
    display: block;
    width: 794px;
    height: auto;
    position: relative;
    overflow: visible;
    background: #ffffff;
    /* First page ke liye padding — baaki pages pe browser automatically handle karta hai fixed header se */
    padding-top: 57px;
  }

  .page-bg {
    position: absolute;
    top: 0; left: 0;
    width: 794px;
    height: 1123px;
    object-fit: cover;
    display: block;
  }
</style>
</head>
<body>


<!-- ═══ FIXED HEADER — har content page pe dikhega ═══ -->
<div class="page-header-fixed">
  <div style="width:794px;background:#f4f9f4;border-bottom:1px solid #d8ead8;
    border-top:5px solid #25a86a;display:flex;align-items:center;
    padding:12px 64px;box-sizing:border-box;">
    <div style="flex:1;">
      <img src="data:image/png;base64,${logo}" style="height:28px;width:auto;opacity:0.85;" />
    </div>
    <div style="font-size:9px;font-weight:700;letter-spacing:2px;
      color:#1b7f4c;text-transform:uppercase;">
      ${product.model || product.name}
    </div>
  </div>
</div>


<!-- ═══════════════════════════════════════
     PAGE 1 — COVER (Static PDF background)
═══════════════════════════════════════ -->
<div class="page-fixed cover-page">

  <img class="page-bg" src="data:image/png;base64,${coverBase64}" />

  ${product.series ? `
  <div style="position:absolute;top:155px;left:58px;right:60px;">
    <div style="font-size:11px;font-weight:700;letter-spacing:4px;
      text-transform:uppercase;color:#1b7f4c;">
      ${product.series}
    </div>
  </div>` : ""}

  <div style="position:absolute;top:${product.series ? "178px" : "155px"};left:58px;right:60px;">
    <div style="font-size:38px;font-weight:900;color:#1a3a2a;
      line-height:1.05;letter-spacing:-1px;">
      ${product.model || product.name}
    </div>

    ${product.description ? `
    <div style="font-size:13px;color:#444;margin-top:10px;
      line-height:1.6;max-width:520px;">
      ${product.description}
    </div>` : ""}

    <div style="display:flex;align-items:center;gap:10px;margin-top:16px;">
      <div style="width:40px;height:2.5px;background:#25a86a;border-radius:2px;"></div>
      <div style="width:10px;height:2.5px;background:rgba(37,168,106,0.4);border-radius:2px;"></div>
      <div style="width:5px;height:2.5px;background:rgba(37,168,106,0.2);border-radius:2px;"></div>
    </div>
  </div>

  <div style="position:absolute;top:320px;left:0;right:0;bottom:140px;
    display:flex;align-items:center;justify-content:center;">
    <img src="${productImageBase64}"
      style="max-width:480px;max-height:380px;width:auto;height:auto;object-fit:contain;" />
  </div>

</div>


<!-- ═══════════════════════════════════════
     CONTENT PAGE
═══════════════════════════════════════ -->
<div class="page-content">

  <div style="padding:32px 64px 60px 64px;">

    ${product.overview?.content ? `
    <div style="margin-bottom:32px;">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">
        <div style="width:4px;height:20px;min-width:4px;background:#25a86a;border-radius:2px;"></div>
        <div style="font-size:16px;font-weight:800;color:#1b7f4c;">Product Overview</div>
      </div>
      <div style="font-size:13.5px;line-height:1.9;color:#444;padding-left:14px;
        border-left:2px solid #d8ead8;text-align:justify;">
        ${product.overview.content}
      </div>
    </div>` : ""}

    ${(product.features || []).length ? `
    <div style="margin-bottom:32px;">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">
        <div style="width:4px;height:20px;min-width:4px;background:#25a86a;border-radius:2px;"></div>
        <div style="font-size:16px;font-weight:800;color:#1b7f4c;">Key Features</div>
      </div>
      <div style="padding-left:14px;">${highlightsHTML}</div>
    </div>` : ""}

    ${(product.featuresDetail || []).length ? `
    <div style="margin-bottom:32px;">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">
        <div style="width:4px;height:20px;min-width:4px;background:#25a86a;border-radius:2px;"></div>
        <div style="font-size:16px;font-weight:800;color:#1b7f4c;">Features</div>
      </div>
      <div style="padding-left:14px;">${featuresDetailHTML}</div>
    </div>` : ""}

    ${Object.keys(product.specifications || {}).length ? `
    <div>
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px;">
        <div style="width:4px;height:20px;min-width:4px;background:#25a86a;border-radius:2px;"></div>
        <div style="font-size:16px;font-weight:800;color:#1b7f4c;">Technical Specifications</div>
      </div>
      ${specsHTML}
    </div>` : ""}

  </div>

  <div style="height:40px;"></div>

</div>


<!-- ═══════════════════════════════════════
     LAST PAGE — BACK COVER (Static PDF background)
═══════════════════════════════════════ -->
<div class="page-fixed back-cover">
  <img class="page-bg" src="data:image/png;base64,${backBase64}" />
</div>


</body>
</html>`;
};

module.exports = buildDatasheetHTML;