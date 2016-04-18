var settings = {};

settings.client = {
  port : 8118,
  server_address : '127.0.0.1',
  server_port : 8338,
}

settings.server = {
  port : 8338,
  socks4port : 8228, //occupy a port...
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

module.exports = settings;
