/*=======================================================================//
  ______                                 _____                          
 |  ____|                               / ____|                         
 | |__  __  ___ __  _ __ ___  ___ ___  | (___   ___ _ ____   _____ _ __ 
 |  __| \ \/ / '_ \| '__/ _ \/ __/ __|  \___ \ / _ \ '__\ \ / / _ \ '__|
 | |____ >  <| |_) | | |  __/\__ \__ \  ____) |  __/ |   \ V /  __/ |   
 |______/_/\_\ .__/|_|  \___||___/___/ |_____/ \___|_|    \_/ \___|_|   
             | |                                                        
             |_|                                                        
//========================================================================*/
console.log(" *Starting Express Server");
let express = require('express');
let app = express();
let server = app.listen(3000);
console.log("  Success!");

//Will serve any file from AER_GameController
app.use(express.static('./'));
console.log("  Serving all from AER_GameController\n");

/*===========================================================//
  _____          _      _____                 _             
 |  __ \        | |    / ____|               (_)            
 | |__) |__  ___| |_  | (___   ___ _ ____   ___ _ __   __ _ 
 |  ___/ _ \/ __| __|  \___ \ / _ \ '__\ \ / / | '_ \ / _` |
 | |  | (_) \__ \ |_   ____) |  __/ |   \ V /| | | | | (_| |
 |_|   \___/|___/\__| |_____/ \___|_|    \_/ |_|_| |_|\__, |
                                                       __/ |
                                                      |___/ 
//===========================================================*/
let fs = require('fs');



//Save updated JSON
app.use(express.json({
  limit: '1mb'
}));
app.post('/updateJSON', (request, response) => {
  console.log(request.body);
  let roomFolder = request.body.roomFolder;
  console.log(' *UPDATE requested');
  let requestString = JSON.stringify(request.body, null, 2);
  fs.writeFileSync(roomFolder + '/hints.json', requestString, function (err) {
    if (err) throw err;
  });
  console.log('  Updated!\n');
  response.end();
});

//Find the names of all the images in Pictures Folder and send them to scripts.js
app.post('/getPicNames', function (req, res) {
  console.log(' *PICTURES Requested...');
  let picNames = fs.readdirSync(req.body.roomFolder + '/Assets/Pictures/');
  picNames = JSON.stringify(picNames);
  res.send(picNames);
  console.log('  Pictures Sent!\n');
})

//Find the names of all the videos in Videos Folder and send them to scripts.js
app.post('/getVideoNames', function (req, res) {
  console.log(' *VIDEOS Requested...');
  let videoNames = fs.readdirSync(req.body.roomFolder + '/Assets/Videos/');
  videoNames = JSON.stringify(videoNames);
  res.send(videoNames);
  console.log('  VIDEOS Sent!\n');
})

//Find the names of all the sounds in Audio Folder and send them to scripts.js
app.post('/getAudioNames', function (req, res) {
  console.log(' *AUDIO Requested...');
  let audioNames = fs.readdirSync(req.body.roomFolder + '/Assets/Audio/');
  audioNames = JSON.stringify(audioNames);
  res.send(audioNames);
  console.log('  Audio Sent!\n');
})











const download = require("download");
const mime = require('mime');

//SAVE PICTURES
app.post('/savePicture', (request, response) => {
  console.log(' *SAVE NEW PICTURE Requested...');
  let roomFolder = request.body.roomFolder;
  let url = request.body.newPicURL;
  let fileName = request.body.fileName;


  let mimeType = mime.lookup(url);
  let mediaType = mimeType.substring(0,5);
  console.log(mediaType);
  let mediaFolder;
  if (mediaType == "image") {
    mediaFolder = "Pictures/"
  } else if (mediaType == "video") {
    mediaFolder = "Videos/"
  } else if (mediaType == "audio") {
    mediaFolder = "Audio/"
  } else {
    console.log("Invalid media type!")
  }
  let mimeExtension = mime.extension(mimeType);
  let fileNameExtension = fileName + '.' + mimeExtension;
  let path = roomFolder + '/Assets/'+ mediaFolder;





  try {
    download(url, path, {
      filename: fileNameExtension
    }).then(() => {
      console.log('  Picture Saved! :' + path + fileNameExtension + '\n');
      response.send();
    })
  } catch (err) {
    console.error(err);
    response.end();
  }
});










//DELETE PICTURE
app.post('/deletePicture', (request, response) => {
  console.log(' *DELETE PICTURE Requested...');
  let roomFolder = request.body.roomFolder;
  let fileName = request.body.fileName;
  let path = roomFolder + '/Assets/Pictures/' + fileName;

  try {
    fs.unlinkSync(path)
    console.log('  Picture Deleted! :' + path + '\n');
    response.send();
    console.log('  Picture deleted!\n');
  } catch (err) {
    console.error(err)
    response.end();
  }
});

//DELETE VIDEO
app.post('/deleteVideo', (request, response) => {
  console.log(' *DELETE VIDEO Requested...');
  let roomFolder = request.body.roomFolder;
  let fileName = request.body.fileName;
  let path = roomFolder + '/Assets/Videos/' + fileName;

  try {
    fs.unlinkSync(path)
    console.log('  Video Deleted! :' + path + '\n');
    response.send();
    console.log('  Video deleted!\n');
  } catch (err) {
    console.error(err)
    response.end();
  }
});

//DELETE Audio
app.post('/deleteAudio', (request, response) => {
  console.log(' *DELETE AUDIO Requested...');
  let roomFolder = request.body.roomFolder;
  let fileName = request.body.fileName;
  let path = roomFolder + '/Assets/Audio/' + fileName;

  try {
    fs.unlinkSync(path)
    console.log('  Audio Deleted! :' + path + '\n');
    response.send();
    console.log('  Audio deleted!\n');
  } catch (err) {
    console.error(err)
    response.end();
  }
});