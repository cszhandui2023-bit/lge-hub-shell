var http = require("http");
var fs = require("fs");
var path = require("path");

var INDEX = path.join(__dirname, "index.html");

var server = http.createServer(function (req, res) {
  var u = decodeURIComponent((req.url || "/").split("?")[0]);

  // 微信业务域名校验文件：优先返回磁盘上真实存在的文件，其次环境变量 WX_VERIFY_BODY
  if (/^\/[A-Za-z0-9_-]+\.txt$/.test(u)) {
    var file = path.join(__dirname, path.basename(u));
    if (fs.existsSync(file)) {
      res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
      return res.end(fs.readFileSync(file));
    }
    var body = process.env.WX_VERIFY_BODY || "";
    if (body) {
      res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
      return res.end(body);
    }
    // 硬编码兜底：微信业务域名校验文件（确保任何部署版本都能返回，不依赖镜像内文件或环境变量）
    var VERIFY_FILES = {
      "uHefh5KHci.txt": "8f5bebc878b2693d815d3840bb9eae81"
    };
    var bn = path.basename(u);
    if (VERIFY_FILES[bn]) {
      res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
      return res.end(VERIFY_FILES[bn]);
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
