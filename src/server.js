import http from  "http";
import SocketIO from "socket.io";
import express from "express";
import mediasoup from 'mediasoup';

import path from "path";
import cors from 'cors';
import fs from "fs";
import { rejects } from 'assert';

const app = express();



const port = 2000;

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));



app.get("/", (_, res) => {
  res.render("home");
});


app.get("/*", (_, res) => res.redirect("/"));



const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer, {
  pingTimeout: 2000,
  pingInterval: 2000,
});

/**
 * Worker --- CPU
 * |-> Router(s) ---- ROOM
 *     |-> Producer Transport(s) 
 *         |-> Producer
 *     |-> Consumer Transport(s)
 *         |-> Consumer 
 **/

/**
 * ROOM {
 *   router : { router object },
 *   user : {user1, user2, user3} ,
 *   producerTransport {
 *                      user1 : producerTransport,
 *                      user2 : producerTransport,  
 *                      user3 : producerTransport  
 *                     },
 * 
 *   producer {
 *              user1 : producer, 
 *              user2 : producer, 
 *              user3 : producer 
 *            },
 *   consumerTransport {
 *      user1 : [ { user2 : consumer }, { user3 : consumer} ], 
 *      user2 : [ { user1 : consumer }, { user3 : consumer} ],
 *      user3 : [ { user1 : consumer }, { user2 : consumer} ]
 *   }
 *  
 * }
 * 
 */




 let worker
 let router
 let producerTransport
 let consumerTransport
 let producer
 let consumer

const createWorker = async () => {
  worker = await mediasoup.createWorker({
    rtcMinPort: 2000,
    rtcMaxPort: 2020,
  })
  console.log(`worker pid ${worker.pid}`)

  worker.on('died', error => {
    // This implies something serious happened, so kill the application
    console.error('mediasoup worker has died')
    setTimeout(() => process.exit(1), 2000) // exit in 2 seconds
  })

  return worker
}



worker = createWorker;

const handleListen = () => console.log(`Listening on http://localhost:${port}`);
httpServer.listen(port, handleListen);
