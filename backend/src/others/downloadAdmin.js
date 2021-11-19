var fs = require('fs');
var crypto = require('crypto');
var path = require('path');
// Path where we store the download sessions
const DL_SESSION_FOLDER = __dirname + '/var/download_sessions';

/* Creates a download session */
function createDownload(filePath, callback) {
  // Check the existence of DL_SESSION_FOLDER
  if (!fs.existsSync(DL_SESSION_FOLDER)) return callback(new Error('Session directory does not exist'));

  // Check the existence of the file
  if (!fs.existsSync(filePath)) return callback(new Error('File doest not exist'));

  // Generate the download sid (session id)
  var downloadSid = crypto.createHash('md5').update(Math.random().toString()).digest('hex');

  // Generate the download session filename
  var dlSessionFileName = path.join(DL_SESSION_FOLDER, downloadSid + '.download');

  // Write the link of the file to the download session file
  fs.writeFile(dlSessionFileName, filePath, function (err) {
    if (err) return callback(err);

    // If succeeded, return the new download sid
    callback(null, downloadSid);
  });
}

/* Gets the download file path related to a download sid */
function getDownloadFilePath(downloadSid, callback) {
  // Get the download session file name
  //console.log("PASO 1");
  var dlSessionFileName = path.join(DL_SESSION_FOLDER, downloadSid + '.download');
  //console.log(dlSessionFileName);
  //console.log("PASO 2");
  // Check if the download session exists
  if (!fs.existsSync(dlSessionFileName)) return callback(new Error('Download does not exist'));
  //console.log("PASO 3");
  // Get the file path
  fs.readFile(dlSessionFileName, function (err, data) {
    //console.log("AHHHHHHHHHHHHHHHHHHH",data)
    if (err) return callback(err);
    //console.log(data.toString());
    // Return the file path
    callback(null, data.toString());
  });
}

/* Deletes a download session */
function deleteDownload(downloadSid, callback) {
  // Get the download session file name
  var dlSessionFileName = path.join(DL_SESSION_FOLDER, downloadSid + '.download');

  // Check if the download session exists
  if (!fs.existsSync(dlSessionFileName)) return callback(new Error('Download does not exist'));

  // Delete the download session
  fs.unlink(dlSessionFileName, function (err) {
    if (err) return callback(err);

    // Return success (no error)
    callback();
  });
}

module.exports = { createDownload, getDownloadFilePath, deleteDownload }