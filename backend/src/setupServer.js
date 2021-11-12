const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const schema = require("./graphql/schema")
const { authenticate } = require("./middleware/auth")
const http = require('http');
const https = require('https');
const cookieParser = require("cookie-parser")
const cors = require("cors");
const { Server: socketServer } = require("socket.io");
const morgan = require('morgan');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { createDownload, getDownloadFilePath, deleteDownload } = require('./others/downloadAdmin')

const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};

const serverSetUp = async () => {
  const server = express()
  middleWares(server);
  setupImageUp(server);
  await startServer(server);

}

const middleWares = async (server) => {
  server.use(cors());
  server.use(cookieParser())
  //server.use(morgan('dev'));
  server.use(authenticate)
  server.use('/graphql', (req, res) => {
    return graphqlHTTP({
      schema,
      graphiql: true, // or whatever you want
      context: { req, res },
    })(req, res)
  }
  );
}

const setupImageUp = async (server) => {
  const UploadUserImage = multer({
    dest: '../images/user',
  });
  const UploadPostImage = multer({
    dest: '../images/post',
  });
  server.post('/user', (req, res, next) => {
    if (!req.verifiedUser) {
      res.json({ error: 'Unauthorized' });
      throw new Error("Unauthorized")
    }
    next();
  }, UploadUserImage.single('image'), (req, res, next) => {
    const { filename, mimetype, size } = req.file;
    const filepath = req.file.path;
    res.json({ success: filepath, name: filename });
  });

  server.post('/post', (req, res, next) => {
    if (!req.verifiedUser) {
      res.json({ error: 'Unauthorized' });
      throw new Error("Unauthorized")
    }
    next();
  }, UploadPostImage.single('image'), (req, res) => {
    const { filename, mimetype, size } = req.file;
    const filepath = req.file.path;
    res.json({ success: filepath, name: filename });
  });

  server.get('/cdn/user/:filename', function (req, res, next) {
    /*  if (!req.verifiedUser) {
       throw new Error("Unauthorized")
     } */
    var downloadSid;
    createDownload("../../images/user/" + req.params.filename, function (err, ssid) {
      downloadSid = ssid;
      getDownloadFilePath(downloadSid, function (err, data) {
        if (err) return res.end(err);
        const dirname = path.resolve();
        const fullfilepath = path.join(dirname, data)
        res.download(fullfilepath, 'image', function (err) {
          if (err) {
            console.log("AWA DE UWU", err);
          } else { }
        })
        deleteDownload(downloadSid, function (err) { });
      });
    });
  });
  server.get('/cdn/post/:filename', function (req, res, next) {
    var downloadSid;
    createDownload("../../images/post/" + req.params.filename, function (err, ssid) {
      downloadSid = ssid;
      getDownloadFilePath(downloadSid, function (err, data) {
        if (err) return res.end(err);
        const dirname = path.resolve();
        const fullfilepath = path.join(dirname, data)
        res.download(fullfilepath, 'image', function (err) {
          if (err) {
            console.log("AWA DE UWU", err);
          } else { }
        })
        deleteDownload(downloadSid, function (err) { });
      });
    });
  });
}

const startServer = async (server) => {
  try {
    const httpsServer = new https.createServer(options,server);
    const io = new socketServer(httpsServer, {
      cors: {
        origin: [process.env.FRONTEND],
      },
    });

    io.on("connection", (socket) => {
      const handshake = socket.id;
      let { chatcode } = socket.handshake.query;
      console.log('client connected', handshake, ' joint to chat: ', chatcode);
      socket.join(chatcode)
      socket.on('disconnect', () => {
        console.log('client disconnected', handshake, ' left the chat: ', chatcode);
      });
      socket.on('onLoadNewMessage', (data) => {
        socket.to(chatcode).emit('onDownloadMessage', data);
      });
    });

    httpsServer.listen(process.env.PORT || 4000, () => {
      console.log(`Server running on port ${process.env.BACKEND}:${process.env.PORT || 4000}/graphql`);
      console.log(`Socket waiting for ${process.env.FRONTEND}`);
    });
  } catch (error) {
    console.log(error);
    return error;
  }
}
module.exports = { serverSetUp }
