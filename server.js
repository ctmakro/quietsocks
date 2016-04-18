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
    var connection = net.connect(settings.server.socks4port,'127.0.0.1',()=>{
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

  //--socks4 server-- should run on VPS side
  var proxy_server = net.createServer();
  proxy_server.on('connection',(socket)=>{
    socket.once('data',(buffer)=>{
      try{
        if(buffer[0]!=4)throw 'client not socks4';
        if(buffer[1]!=1)throw 'action not CONNECT';

        var dstport = buffer[2]*256+buffer[3];
        var dstip = buffer[4].toString()+'.'+buffer[5].toString()+'.'
        +buffer[6].toString()+'.'+buffer[7].toString();
        var connection = net.createConnection(dstport,dstip);
        var socks4ready = false;

        connection.on('connect',()=>{
          console.log('Established:',dstip+':'+dstport);
          socket.write(new Buffer([0,90,0,0,1,0,0,0])) // inform client for a successful connection
          socks4ready = true;

          socket.pipe(connection); //let both sides communicate with each other
          connection.pipe(socket);
        })

        connection.on('error',(err)=>{
          console.log('connection error...');console.log(err);
        })

        socket.on('error',(err)=>{
          console.log('client error...');console.log(err);
        })

        connection.on('close',(err)=>{
          if(!socks4ready){
            socket.write(new Buffer([0,91,0,0,1,0,0,0])) //inform client the connection cant be opened
          }
          socket.end();
        })

        socket.on('close',(err)=>{
          connection.end();
        })
      }
      catch(err){
        console.log(err);
        socket.end();
        return;
      }
    })
  })
  // proxy_server.listen(settings.server.socks4port,()=>{
  //   console.log('socks4 proxy_server listening on',settings.server.socks4port);
  // })
  //--proxy server ends
}

if(workmode=='client'||workmode=='test'){

  //--relay server-- should run on client side
  var relay_server = net.createServer((socket) => {
    console.log('trying to connect to',settings.client.server_address,'port',settings.client.server_port);

    var connection = net.connect(settings.client.server_port,settings.client.server_address,()=>{

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
process.openStdin().on('data',function(d){ //press enter in console to restart
  if(d.toString().trim()=='')
  process.exit();
});
