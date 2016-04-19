# quietsocks

TCP relay, using Node.js

Very few lines of code!

## Explain

relay your TCP connection from `settings.client.port` on client machine, to `settings.server.socksport`, thru port 8228 (the one you should let thru OS firewall on both sides).

For example, if you start a socks5 server on `settings.server.socksport`, it will then be accessible on the client side with `settings.client.port`.

Tweak the `buffer_encode` and `buffer_decode` function in settings.js to implement your own style of byte mapping function. Please make sure decode(encode(x)) = x where x is a byte.

!!It is theoretically possible for GFW to summarize your byte mapping if a large amount of user uses the same mapping function.

## Howto

0. (Optional) On your linux server, start an SSH connection to itself w/ socks5 proxy enabled on port 8228. `ssh -f -N -D 0.0.0.0:8228 127.0.0.1` will start one in background.
1. run with no options to test functionality of both sides on current machine. For example if you have httpd listening on 8228, try browse `127.0.0.1:8118`.
2. run with `--server` on server side.
3. run with `--connect {address-of-server}` on client side. *address-of-server* may be a domain-name.
4. modify **settings.js** as you wish.

## Copyright

removed according to regulation.
