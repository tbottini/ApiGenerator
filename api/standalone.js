var app = require("./index.js");
const PORT = process.argv[2] || 8080;
console.log("server listen : ", PORT);

app.listen(PORT);
