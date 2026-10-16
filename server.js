var http = require("http");
var fs = require("fs");
var path = require("path");

var INDEX = path.join(__dirname, "index.html");
// 微信业务域名校验内容（账号级，任何随机文件名都返回同一内容）
var VERIFY_BODY = process.env.WX_VERIFY_BODY || "8f5bebc878b2693d815d3840bb9eae81";

var server = http.createServer(function (req, res) {
  var u = decodeURIComponent((req.url || "/").split("?")[0]);

  // 微信业务域名校验文件：任意 *.txt 路径都返回校验内容
  // （微信每次打开"配置业务域名"弹窗会生成新的随机校验文件名，因此不能只认某一个文件名）
  if (/^\/[A-Za-z0-9_-]+\.txt$/.test(u)) {
    var file = path.join(__dirname, path.basename(u));
    if (fs.existsSync(file)) {
      res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
      return res.end(fs.readFileSync(file));
    }
    res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
    return res.end(VERIFY_BODY);
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
