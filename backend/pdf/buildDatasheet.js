const fs = require("fs");
const path = require("path");

const buildDatasheetHTML = (product) => {

const logo = fs.readFileSync(path.resolve(__dirname,"../assets/logo.jpg")).toString("base64");
const bg = fs.readFileSync(path.resolve(__dirname,"../assets/bg.png")).toString("base64");
const makeIndia = fs.readFileSync(path.resolve(__dirname,"../assets/MakeInIndia.png")).toString("base64");

return `

<!DOCTYPE html>
<html>

<head>

<meta charset="utf-8"/>

<style>

body{
margin:0;
padding:0;
font-family:Arial, Helvetica, sans-serif;
background:#ffffff;
}

.page{
position:relative;
width:794px;
height:1123px;
overflow:hidden;
}

/* Background */

.bg{
position:absolute;
bottom:0;
left:0;
width:100%;
opacity:0.9;
}

/* Logo */

.logo{
position:absolute;
top:40px;
left:40px;
width:220px;
}

/* Model */

.model{
position:absolute;
top:200px;
left:100px;
font-size:28px;
font-weight:bold;
color:#000;
}

/* Product Image */

.product{
position:absolute;
top:360px;
left:50%;
transform:translateX(-50%);
width:360px;
object-fit:contain;
}

/* Description */

.desc{
position:absolute;
top:720px;
left:50%;
transform:translateX(-50%);
font-size:18px;
font-weight:600;
text-align:center;
width:620px;
color:#000;
}

/* Make in India */

.india{
position:absolute;
bottom:140px;
right:80px;
width:150px;
}

/* Footer */

.footer{
position:absolute;
bottom:20px;
left:40px;
font-size:12px;
color:#444;
}

</style>

</head>

<body>

<div class="page">

<img class="bg" src="data:image/png;base64,${bg}"/>

<img class="logo" src="data:image/jpeg;base64,${logo}"/>

<div class="model">
Model: ${product.model || product.name}
</div>

<img class="product" src="${product.image}" />

<div class="desc">
${product.description || ""}
</div>

<img class="india" src="data:image/png;base64,${makeIndia}" />

<div class="footer">
© 2024 AADONA Communication Pvt Ltd. All rights reserved
</div>

</div>

</body>

</html>

`;
};

module.exports = buildDatasheetHTML;