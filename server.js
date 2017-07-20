var net = require('net')
var settings = require('./settings.js');
var socks4 = require('socks4')

var print = console.log

function determine_workmode(){
  var workmode = 'test'
  print('arguments:',process.argv);

  var j = process.argv.indexOf('--server');
  if(j>=2){
    workmode = 'server'
  }

  var k = process.argv.indexOf('--connect');
  if(k>=2){
    settings.client.server_address = process.argv[k+1];
    workmode = 'client'
  }

  print('working in',workmode,'mode');
  return workmode
}

var workmode = determine_workmode()

var counter = 0
function get_id(){return counter++}
function time_string(){return new Date().toUTCString()}

if(workmode=='server'||workmode=='test'){

  //--socks4 server-- to simplify things
  var s4 = socks4.createServer()
  s4.on('connect',req=>{
    req.accept();
    var remote = s4.proxyRequest(req); // 'true' to pipe error to client.
    remote.on('error',err=>{
      print(`[socks4] socket error`)
      print(err)
    })
    print(`[socks4] accept and proxy request to ${req.host}:${req.port}`)
  })
  s4.on('error',err=>{
    print(`[socks4] (FATAL) server error`)
    print(err)
  })
  s4.listen(settings.server.socksport,()=>{
    print(`[socks4] proxy created on port ${settings.server.socksport}`)
  });

  //--relay server-- should run on VPS side
  var relay_server = net.createServer((socket) => {
    // 'socket' is incoming
    // 'connection' is outgoing

    var socketid = get_id()
    print(`[${socketid}] ${time_string()} incoming connection at (self):${settings.server.port}`);

    var connection = net.connect(settings.server.socksport,'127.0.0.1',()=>{
      print(`[${socketid}] outgoing established`);

      connection.on('data',(data)=>{
        socket.write(settings.buffer_encode(data));
      })

      socket.on('data',(data)=>{
        connection.write(settings.buffer_decode(data));
      })

      connection.on('end',()=>{
        print(`[${socketid}] outgoing ended`)
        socket.end()
      })

      socket.on('end',()=>{
        print(`[${socketid}] incoming ended`)
        connection.end()
      })
    })
    connection.on('error',(err)=>{
      print(`[${socketid}] outgoing error`)
      print(err);
      connection.end();
      socket.end();
    })
    socket.on('error',(err)=>{
      print(`[${socketid}] incoming error`)
      print(err);
      connection.end();
      socket.end();
    })
  }).listen(settings.server.port,()=>{
    print(`relay_server listening on port ${settings.server.port}`);
  })
}

if(workmode=='client'||workmode=='test'){

  //--relay server-- should run on client side
  var relay_server = net.createServer((socket) => {
    var socketid = get_id()
    print(`[${socketid}] ${time_string()} outgoing connection to ${settings.client.server_address}:${settings.client.server_port}`);

    var connection = net.connect(settings.client.server_port,settings.client.server_address,()=>{
      print(`[${socketid}] outgoing established`);

      connection.on('data',(data)=>{
        socket.write(settings.buffer_decode(data));
      })

      socket.on('data',(data)=>{
        connection.write(settings.buffer_encode(data));
      })

      connection.on('end',()=>{
        print(`[${socketid}] outgoing ended`)
        socket.end()
      })

      socket.on('end',()=>{
        print(`[${socketid}] incoming ended`)
        connection.end()
      })
    })

    connection.on('error',(err)=>{
      print(`[${socketid}] outgoing error`)
      print(err);
      connection.end();
      socket.end();
    })

    socket.on('error',(err)=>{
      print(`[${socketid}] incoming error`)
      print(err);
      connection.end();
      socket.end();
    })
  }).listen(settings.client.port,()=>{
    print(`relay_server(client side) listening on port ${settings.client.port}`);
    print(`will connect to ${settings.client.server_address}:${settings.client.server_port} on demand`)
  })

}
process.openStdin().on('data',function(d){ //press enter in console to end current process
  if(d.toString().trim()=='')
  process.exit();
});
