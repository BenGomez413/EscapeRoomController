
let hintsJSON = null;

function preload() {
  hintsJSON = loadJSON("hints.json");
}

function setup(){
  importVideos();
}

//Import Videos
let videoNames = null;
function importVideos() {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(hintsJSON)
  };
  fetch('/getVideoNames', options).then(
      function (response) {
        if (response.status !== 200) {
          console.log('Looks like there was a problem. Status Code: ' +
            response.status);
          return;
        }
        // Examine the text in the response
        response.json().then(function (data) {
          console.log(data);
          videoNames = data;
          makeVideo();
        });
      }
    )
    .catch(function (err) {
      console.log('Fetch Error :-S', err);
    });
}

function makeVideo(){
for (let i = 0; i < videoNames.length; i++) {
  let newVideo = document.createElement("video");
  newVideo.setAttribute("id", 'live' + videoNames[i]);
  newVideo.controls = false; 
  newVideo.muted = false; 
  document.getElementById('liveVideoOverlay').appendChild(newVideo);

  let source = document.createElement('source');
  source.setAttribute("src", 'Assets/Videos/' + videoNames[i]);
  source.setAttribute("type", 'video/mp4');
  newVideo.appendChild(source);
}
}