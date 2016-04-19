var net = require('net')
var settings = require('./settings.js');

var workmode = 'test'
console.log('arguments:',process.argv);

var j = process.argv.indexOf('--server');
if(j>=2){
  workmode = 'server'
}

var k = process.argv.indexOf('--connect');
if(k>=2){
  settings.client.server_address = process.argv[k+1];
  workmode = 'client'
}

console.log('working in',workmode,'mode');

if(workmode=='server'||workmode=='test'){

  //--relay server-- should run on VPS side
  var relay_server = net.createServer((socket) => {
    var socketid = Date.now().toString();
    console.log(socketid,'trying to connect to localhost',settings.server.socksport);

    var connection = net.connect(settings.server.socksport,'127.0.0.1',()=>{
      console.log(socketid, 'Established');
      connection.on('data',(data)=>{
        socket.write(settings.buffer_encode(data));
      })

      socket.on('data',(data)=>{
        connection.write(settings.buffer_decode(data));
      })

      connection.on('end',()=>{
        socket.end()
      })

      socket.on('end',()=>{
        connection.end()
      })
    })
    connection.on('error',(err)=>{
      console.log(err);
      connection.end();
      socket.end();
    })
    socket.on('error',(err)=>{
      console.log(err);
      connection.end();
      socket.end();
    })
  }).listen(settings.server.port,()=>{
    console.log('relay_server listening on',settings.server.port);
  })
}

if(workmode=='client'||workmode=='test'){

  //--relay server-- should run on client side
  var relay_server = net.createServer((socket) => {
    var socketid = Date.now().toString();
    console.log(socketid,'trying to connect to',settings.client.server_address,'port',settings.client.server_port);

    var connection = net.connect(settings.client.server_port,settings.client.server_address,()=>{
      console.log(socketid, 'Established');
      connection.on('data',(data)=>{
        socket.write(settings.buffer_decode(data));
      })

      socket.on('data',(data)=>{
        connection.write(settings.buffer_encode(data));
      })

      connection.on('end',()=>{
        socket.end()
      })

      socket.on('end',()=>{
        connection.end()
      })
    })

    connection.on('error',(err)=>{
      console.log(err);
      connection.end();
      socket.end();
    })

    socket.on('error',(err)=>{
      console.log(err);
      connection.end();
      socket.end();
    })
  }).listen(settings.client.port,()=>{
    console.log('relay_server(client side) listening on',settings.client.port);
  })

}
process.openStdin().on('data',function(d){ //press enter in console to end current process
  if(d.toString().trim()=='')
  process.exit();
});
