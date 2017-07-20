var settings = {};

var client_port = 8118; // 浏览器socks4代理指向这个端口
var relay_port = 8338; // 客户端和服务器上这个端口要开放

settings.client = {
  port : client_port,
  server_address : '127.0.0.1',
  server_port : relay_port,
}

settings.server = {
  port : relay_port,
  socksport : 8228, // 服务器上这个端口不要占用
}

settings.buffer_encode = function(buffer){
  for(i in buffer)
  {
    buffer[i] = 255-buffer[i];
  }
  return buffer;
}

settings.buffer_decode = function(buffer){
  for(i in buffer)
  {
    buffer[i] = 255-buffer[i];
  }
  return buffer;
}

settings.request_header =
`GET /css/images/doc-jumbotron-bg.jpg HTTP/1.1
Host: breakwa11.github.io
Connection: keep-alive
Pragma: no-cache
Cache-Control: no-cache
User-Agent: Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36
Accept: image/webp,image/apng,image/*,*/*;q=0.8
Referer: https://breakwa11.github.io/css/project.min.css
Accept-Encoding: gzip, deflate, br
Accept-Language: zh-CN,zh;q=0.8,en-US;q=0.6,en;q=0.4,ja;q=0.2,zh-TW;q=0.2`

settings.response_header =
`HTTP/1.1 200 OK
Server: GitHub.com
Content-Type: image/jpeg
Last-Modified: Fri, 14 Jul 2017 16:08:16 GMT
Access-Control-Allow-Origin: *
Expires: Tue, 18 Jul 2017 20:59:19 GMT
Cache-Control: max-age=600
X-GitHub-Request-Id: A642:6626:218A00E:2DAA163:596E744E
Content-Length: 178993
Accept-Ranges: bytes
Date: Thu, 20 Jul 2017 05:07:59 GMT
Via: 1.1 varnish
Age: 476
Connection: keep-alive
X-Served-By: cache-hkg6820-HKG
X-Cache: HIT
X-Cache-Hits: 1
X-Timer: S1500527280.936596,VS0,VE5
Vary: Accept-Encoding
X-Fastly-Request-ID: 4c288fc118fdcc5ad64ab4978833d716072a348e`

module.exports = settings;
