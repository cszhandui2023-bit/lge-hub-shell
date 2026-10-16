var http = require("http");
var fs = require("fs");
var path = require("path");

var INDEX = path.join(__dirname, "index.html");

var server = http.createServer(function (req, res) {
  var u = decodeURIComponent((req.url || "/").split("?")[0]);

  // 微信业务域名校验文件：任意 /xxxx.txt，内容来自环境变量 WX_VERIFY_BODY
  if (/^\/[A-Za-z0-9_-]+\.txt$/.test(u)) {
    var body = process.env.WX_VERIFY_BODY || "";
    if (body) {
      res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
      return res.end(body);
    }
  }

  if (u === "/" || u === "/index.html") {
    fs.readFile(INDEX, function (err, buf) {
      if (err) {
        res.writeHead(500);
        return res.end("index.html missing");
      }
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-cache" });
      res.end(buf);
    });
    return;
  }

  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("not found");
});

var port = process.env.PORT || 8080;
server.listen(port, function () {
  console.log("hub shell listening on :" + port);
});
