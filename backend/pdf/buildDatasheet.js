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

/* FULL BACKGROUND */

.bg{
position:absolute;
bottom:0;
left:0;
width:100%;
height:450px;
object-fit:cover;
opacity:0.9;
}

/* LOGO */

.logo{
position:absolute;
top:50px;
left:60px;
width:240px;
}

/* MODEL */

.model{
position:absolute;
top:220px;
left:120px;
font-size:34px;
font-weight:700;
}

/* PRODUCT IMAGE */

.product{
position:absolute;
top:420px;
left:50%;
transform:translateX(-50%);
width:420px;
}

/* DESCRIPTION */

.desc{
position:absolute;
top:740px;
left:50%;
transform:translateX(-50%);
font-size:22px;
font-weight:600;
text-align:center;
width:650px;
}

/* MAKE IN INDIA */

.india{
position:absolute;
bottom:180px;
right:120px;
width:180px;
}

/* FOOTER */

.footer{
position:absolute;
bottom:30px;
left:60px;
font-size:12px;
color:#333;
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