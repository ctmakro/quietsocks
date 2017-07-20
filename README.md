# quietsocks

TCP relay w/ SOCKS4, using Node.js

Very few lines of code!

## 中文说明

这软件当然是为了翻墙，毕竟党是领导一切的，法律也要在党的范围内行使权力

1. 按照下面Installation的指示，在本地和VPS上都安装quietsocks
2. 本地运行`node server.js`，然后把浏览器SOCKS4代理指向`localhost:8118`，看看能否访问百度。按回车可以退出。
3. 在VPS上运行`node server.js --server`，同时VPS对外要开放8338端口
4. 在本地运行`node server.js --connect {VPS的地址}`，这个地址可以是域名或IP
5. 按个人需求修改 settings.js, 通过人民群众的无穷创造力让GFW摸不着头脑

## Explain

Your Browser(Socks4Client) -> localhost:8118(quietsocks client) -> THE WALL -> remote:8338(quietsocks server) -> remote:8228(Socks4Server) -> Internet

Tweak the `buffer_encode` and `buffer_decode` function in settings.js to implement your own byte mapping function. Please make sure decode(encode(x)) = x where x is a byte.

## Installation

Install Node.js for your OS, then run the following command:
```bash
$ git clone https://github.com/ctmakro/quietsocks
$ cd quietsocks
$ npm install
```

## Get It Running

0. install quietsocks on both client and server.
1. run `node server.js` with no options to test functionality of both client and server functionalities on current machine. Set your browser's SOCKS4 proxy to `localhost:8118`, then visit a random site.
2. run `node server.js --server` on server side.
3. run `node server.js --connect {address_of_server}` on client side. *address_of_server* may be either a domain-name or an IP address.
4. modify **settings.js** as needed.

## Copyright

removed according to regulation.
