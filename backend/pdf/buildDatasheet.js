const fs = require("fs");
const path = require("path");

const buildDatasheetHTML = (product) => {

  const logo = fs.readFileSync(
    path.resolve(__dirname, "../assets/logo.jpg")
  ).toString("base64");

  const bg = fs.readFileSync(
    path.resolve(__dirname, "../assets/bg.png")
  ).toString("base64");

  const makeIndia = fs.readFileSync(
    path.resolve(__dirname, "../assets/MakeInIndia.png")
  ).toString("base64");

  /* FEATURES */
  const highlightsHTML = (product.highlights || [])
    .map(h => `<li>${h}</li>`)
    .join("");

  /* SPECIFICATIONS */
  const specsHTML = Object.entries(product.specifications || {})
    .map(([section, specs]) => {
      const rows = Object.entries(specs || {})
        .map(([key, value]) => `
          <tr>
            <td>${key}</td>
            <td>${value}</td>
          </tr>
        `).join("");

      return `
        <div class="spec-section">
          <h2>${section}</h2>
          <table>${rows}</table>
        </div>
      `;
    }).join("");

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <style>

    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800;900&family=Open+Sans:wght@400;600&display=swap');

    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      padding: 0;
      font-family: 'Open Sans', Arial, sans-serif;
      color: #222;
    }

    /* ============================
       PAGE 1 — COVER
    ============================ */

    .page {
      position: relative;
      width: 794px;
      height: 1123px;
      overflow: hidden;
      background: #0a1628;
    }

    /* BG — FULL PAGE */
    .bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center center;
      opacity: 0.35;
      z-index: 0;
    }

    /* Dark gradient overlay for readability */
    .cover-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        160deg,
        rgba(5,15,35,0.82) 0%,
        rgba(10,30,60,0.55) 45%,
        rgba(5,15,35,0.80) 100%
      );
      z-index: 1;
    }

    /* Green left accent bar */
    .cover-accent-bar {
      position: absolute;
      top: 0;
      left: 0;
      width: 6px;
      height: 100%;
      background: linear-gradient(180deg, #1b7f4c 0%, #25a86a 50%, #1b7f4c 100%);
      z-index: 3;
    }

    /* Top header band */
    .cover-header {
      position: absolute;
      top: 0;
      left: 6px;
      right: 0;
      height: 90px;
      background: rgba(255,255,255,0.04);
      border-bottom: 1px solid rgba(255,255,255,0.10);
      display: flex;
      align-items: center;
      padding: 0 42px;
      z-index: 4;
    }

    .logo {
      height: 52px;
      width: auto;
      object-fit: contain;
      filter: brightness(0) invert(1);
    }

    .cover-tagline {
      margin-left: auto;
      font-family: 'Montserrat', sans-serif;
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 3px;
      text-transform: uppercase;
      color: rgba(255,255,255,0.40);
    }

    /* Model + Series block */
    .model-block {
      position: absolute;
      top: 130px;
      left: 54px;
      z-index: 4;
    }

    .series-label {
      font-family: 'Montserrat', sans-serif;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 4px;
      text-transform: uppercase;
      color: #25a86a;
      margin-bottom: 8px;
    }

    .model-name {
      font-family: 'Montserrat', sans-serif;
      font-size: 34px;
      font-weight: 800;
      color: #ffffff;
      line-height: 1.15;
      letter-spacing: -0.5px;
      text-shadow: 0 2px 20px rgba(0,0,0,0.5);
    }

    .model-sub {
      font-family: 'Montserrat', sans-serif;
      font-size: 14px;
      font-weight: 400;
      color: rgba(255,255,255,0.50);
      margin-top: 6px;
      letter-spacing: 0.5px;
    }

    /* Decorative rule under model block */
    .model-rule {
      position: absolute;
      top: 278px;
      left: 54px;
      width: 60px;
      height: 3px;
      background: linear-gradient(90deg, #25a86a, transparent);
      z-index: 4;
    }

    /* Product image */
    .product {
      position: absolute;
      top: 280px;
      left: 50%;
      transform: translateX(-50%);
      width: 480px;
      filter: drop-shadow(0px 24px 48px rgba(0,0,0,0.55))
              drop-shadow(0px 4px 12px rgba(37,168,106,0.18));
      z-index: 4;
    }

    /* Description + Make In India row */
    .desc-wrap {
      position: absolute;
      bottom: 95px;
      left: 54px;
      right: 54px;
      z-index: 4;
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
    }

    .desc {
      font-family: 'Montserrat', sans-serif;
      font-size: 13px;
      font-weight: 600;
      color: rgba(255,255,255,0.78);
      letter-spacing: 0.3px;
      max-width: 380px;
      line-height: 1.65;
      border-left: 3px solid #25a86a;
      padding-left: 14px;
    }

    .india {
      width: 110px;
      object-fit: contain;
      filter: brightness(0) invert(1);
      opacity: 0.72;
    }

    /* Footer band */
    .cover-footer-band {
      position: absolute;
      bottom: 0;
      left: 6px;
      right: 0;
      height: 58px;
      background: rgba(0,0,0,0.50);
      border-top: 1px solid rgba(255,255,255,0.08);
      display: flex;
      align-items: center;
      padding: 0 42px;
      z-index: 4;
    }

    .cover-footer {
      font-size: 10px;
      color: rgba(255,255,255,0.30);
      letter-spacing: 0.4px;
    }

    .cover-footer-right {
      margin-left: auto;
      font-family: 'Montserrat', sans-serif;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 2px;
      color: rgba(37,168,106,0.65);
      text-transform: uppercase;
    }

    /* ============================
       PAGE BREAK
    ============================ */

    .page-break {
      page-break-before: always;
    }

    /* ============================
       PAGE 2+ — CONTENT
    ============================ */

    .page2 {
      padding: 80px;
    }

    .page2 h1 {
      font-family: 'Montserrat', sans-serif;
      font-size: 22px;
      font-weight: 800;
      margin-top: 0;
      margin-bottom: 18px;
      border-bottom: 3px solid #1b7f4c;
      padding-bottom: 8px;
      color: #1b7f4c;
    }

    .page2 p {
      font-size: 14px;
      line-height: 1.9;
      margin-bottom: 40px;
      color: #444;
    }

    .page2 ul {
      padding-left: 22px;
      margin-bottom: 40px;
    }

    .page2 li {
      margin-bottom: 10px;
      font-size: 14px;
      color: #444;
      line-height: 1.7;
    }

    .spec-section {
      margin-bottom: 40px;
    }

    .spec-section h2 {
      font-family: 'Montserrat', sans-serif;
      font-size: 15px;
      margin-bottom: 10px;
      color: #1b7f4c;
      font-weight: 700;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    td {
      border: 1px solid #e0e0e0;
      padding: 10px 14px;
      font-size: 13px;
      vertical-align: top;
    }

    td:first-child {
      width: 40%;
      font-weight: 600;
      color: #333;
      background: #f6f8f6;
    }

    td:last-child {
      color: #444;
    }

    tr:nth-child(even) td:first-child {
      background: #eef2ee;
    }

    /* ============================
       LAST PAGE — BACK COVER
    ============================ */

    .last-page {
      position: relative;
      width: 794px;
      height: 1123px;
      overflow: hidden;
      background: #0a1628;
    }

    .last-bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center center;
      opacity: 0.20;
      z-index: 0;
    }

    .last-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(
        180deg,
        rgba(5,15,35,0.70) 0%,
        rgba(10,22,50,0.85) 60%,
        rgba(5,12,28,0.95) 100%
      );
      z-index: 1;
    }

    .last-accent-bar {
      position: absolute;
      top: 0;
      left: 0;
      width: 6px;
      height: 100%;
      background: linear-gradient(180deg, #1b7f4c 0%, #25a86a 50%, #1b7f4c 100%);
      z-index: 3;
    }

    .last-logo-wrap {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -58%);
      text-align: center;
      z-index: 4;
    }

    .last-logo {
      width: 260px;
      filter: brightness(0) invert(1);
      opacity: 0.92;
    }

    .last-logo-tagline {
      font-family: 'Montserrat', sans-serif;
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 4px;
      text-transform: uppercase;
      color: rgba(255,255,255,0.32);
      margin-top: 14px;
    }

    /* Decorative divider under logo */
    .last-divider {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, 36px);
      display: flex;
      align-items: center;
      gap: 12px;
      z-index: 4;
    }

    .last-divider-line {
      width: 80px;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(37,168,106,0.6));
    }

    .last-divider-line.right {
      background: linear-gradient(90deg, rgba(37,168,106,0.6), transparent);
    }

    .last-divider-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #25a86a;
    }

    .address-section {
      position: absolute;
      bottom: 140px;
      left: 6px;
      right: 0;
      display: flex;
      justify-content: space-around;
      align-items: flex-start;
      padding: 32px 54px 0 54px;
      border-top: 1px solid rgba(255,255,255,0.10);
      z-index: 4;
    }

    .address-col {
      width: 44%;
      font-size: 12px;
      color: rgba(255,255,255,0.52);
      line-height: 1.9;
    }

    .address-col .company-name {
      font-family: 'Montserrat', sans-serif;
      font-size: 13px;
      font-weight: 700;
      color: rgba(255,255,255,0.88);
      margin-bottom: 2px;
    }

    .address-col .dept-name {
      font-family: 'Montserrat', sans-serif;
      font-weight: 600;
      color: #25a86a;
      margin-bottom: 8px;
      font-size: 10px;
      letter-spacing: 0.8px;
      text-transform: uppercase;
    }

    .address-col .web {
      color: rgba(37,168,106,0.80);
    }

    .address-vdivider {
      width: 1px;
      background: rgba(255,255,255,0.10);
      align-self: stretch;
      min-height: 110px;
    }

    .trademark-line {
      position: absolute;
      bottom: 78px;
      left: 6px;
      right: 0;
      text-align: center;
      font-size: 10px;
      color: rgba(255,255,255,0.22);
      letter-spacing: 0.5px;
      z-index: 4;
    }

    .last-footer-band {
      position: absolute;
      bottom: 0;
      left: 6px;
      right: 0;
      height: 56px;
      background: rgba(0,0,0,0.52);
      border-top: 1px solid rgba(255,255,255,0.07);
      display: flex;
      align-items: center;
      padding: 0 54px;
      z-index: 4;
    }

    .last-footer {
      font-size: 10px;
      color: rgba(255,255,255,0.28);
      letter-spacing: 0.4px;
    }

    .last-footer-right {
      margin-left: auto;
      font-family: 'Montserrat', sans-serif;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 2px;
      color: rgba(37,168,106,0.62);
      text-transform: uppercase;
    }

  </style>
</head>
<body>

  <!-- PAGE 1 — COVER -->
  <div class="page">
    <img class="bg" src="data:image/png;base64,${bg}" />
    <div class="cover-overlay"></div>
    <div class="cover-accent-bar"></div>
    <div class="cover-header">
      <img class="logo" src="data:image/jpeg;base64,${logo}" />
      <div class="cover-tagline">Communication Technology</div>
    </div>
    <div class="model-block">
      ${product.series ? `<div class="series-label">${product.series}</div>` : ""}
      <div class="model-name">${product.model || product.name}</div>
      ${product.description ? `<div class="model-sub">${product.description}</div>` : ""}
    </div>
    <div class="model-rule"></div>
    <img class="product" src="${product.image}" />
    <div class="desc-wrap">
      ${product.description ? `<div class="desc">${product.description}</div>` : "<div></div>"}
      <img class="india" src="data:image/png;base64,${makeIndia}" />
    </div>
    <div class="cover-footer-band">
      <div class="cover-footer">© 2024 AADONA Communication Pvt Ltd. All rights reserved</div>
      <div class="cover-footer-right">Product Datasheet</div>
    </div>
  </div>

  <div class="page-break"></div>

  <!-- PAGE 2+ — CONTENT -->
  <div class="page2">
    ${product.overview?.content ? `<h1>Product Overview</h1><p>${product.overview.content}</p>` : ""}
    ${(product.highlights || []).length ? `<h1>Key Features</h1><ul>${highlightsHTML}</ul>` : ""}
    ${Object.keys(product.specifications || {}).length ? `<h1>Technical Specifications</h1>${specsHTML}` : ""}
  </div>

  <div class="page-break"></div>

  <!-- LAST PAGE — BACK COVER -->
  <div class="last-page">
    <img class="last-bg" src="data:image/png;base64,${bg}" />
    <div class="last-overlay"></div>
    <div class="last-accent-bar"></div>
    <div class="last-logo-wrap">
      <img class="last-logo" src="data:image/jpeg;base64,${logo}" alt="AADONA Logo" />
      <div class="last-logo-tagline">Communication Technology</div>
    </div>
    <div class="last-divider">
      <div class="last-divider-line"></div>
      <div class="last-divider-dot"></div>
      <div class="last-divider-line right"></div>
    </div>
    <div class="address-section">
      <div class="address-col">
        <div class="company-name">AADONA Communication Pvt Ltd</div>
        <div class="dept-name">Corporate Headquarters</div>
        1st Floor, Phoenix Tech Tower, Plot No.14/46,<br/>
        IDA-Uppal, Hyderabad, Telangana 500039<br/>
        <span class="web">www.aadona.com</span><br/>
        Toll Free: 1800 202 6599<br/>
        contact@aadona.com
      </div>
      <div class="address-vdivider"></div>
      <div class="address-col">
        <div class="company-name">AADONA Communication Pvt Ltd</div>
        <div class="dept-name">Production, Warehousing &amp; Billing</div>
        7, SBI Colony, Mohaba Bazar, Hirapur Road,<br/>
        Raipur, Chhattisgarh — 492099<br/>
        <span class="web">www.aadona.com</span><br/>
        Toll Free: 1800 202 6599<br/>
        contact@aadona.com
      </div>
    </div>
    <div class="trademark-line">
      AADONA and AADONA logo are trademarks of AADONA Communication Pvt Ltd &nbsp;·&nbsp; Printed in India
    </div>
    <div class="last-footer-band">
      <div class="last-footer">© 2024 AADONA Communication Pvt Ltd. All rights reserved</div>
      <div class="last-footer-right">www.aadona.com</div>
    </div>
  </div>

</body>
</html>
`;

};

module.exports = buildDatasheetHTML;