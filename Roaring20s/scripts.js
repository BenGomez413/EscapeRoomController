/*==========================================================================//
   _____ _       _           _  __      __        _       _     _           
  / ____| |     | |         | | \ \    / /       (_)     | |   | |          
 | |  __| | ___ | |__   __ _| |  \ \  / /_ _ _ __ _  __ _| |__ | | ___  ___ 
 | | |_ | |/ _ \| '_ \ / _` | |   \ \/ / _` | '__| |/ _` | '_ \| |/ _ \/ __|
 | |__| | | (_) | |_) | (_| | |    \  / (_| | |  | | (_| | |_) | |  __/\__ \
  \_____|_|\___/|_.__/ \__,_|_|     \/ \__,_|_|  |_|\__,_|_.__/|_|\___||___/
                                                                            
//===========================================================================*/
let hintsJSON = null;
let roomTitle;
let roomFolder;
//---------------------------//
//       DOM Elements        //
//---------------------------//
//Sidebar
const playbtn = document.getElementById("play");
const pausebtn = document.getElementById("pause");
const underPlaybtn = document.getElementById("underPlay");
const underPausebtn = document.getElementById("underPause");
const counter = document.getElementById("time");
const endTime = document.getElementById("endTime");
const contextBtn = document.getElementById("contextBtn");
//Preview
const liveWindowBtn = document.getElementById("liveWindowBtn");
const liveWindowOverlay = document.getElementById("liveWindowOverlay");
const previewTime = document.getElementById("previewTime");
const previewHint = document.getElementById("previewHint");
const previewGMTyping = document.getElementById("GMtyping");
//Hints
const textarea = document.getElementById("textarea");
//Leaderboard Form
const leaderboardForm = document.getElementById("leaderboardFormContainer");
const leaderboardTime = document.getElementById("leaderboardTime");
const leaderboardTeam = document.getElementById("leaderboardTeam");

/*====================================//
  _____          _                 _ 
 |  __ \        | |               | |
 | |__) | __ ___| | ___   __ _  __| |
 |  ___/ '__/ _ \ |/ _ \ / _` |/ _` |
 | |   | | |  __/ | (_) | (_| | (_| |
 |_|   |_|  \___|_|\___/ \__,_|\__,_|
                                     
//====================================*/
function preload() {
  hintsJSON = loadJSON("hints.json");
}

/*============================//
   _____      _               
  / ____|    | |              
 | (___   ___| |_ _   _ _ __  
  \___ \ / _ \ __| | | | '_ \ 
  ____) |  __/ |_| |_| | |_) |
 |_____/ \___|\__|\__,_| .__/ 
                       | |    
                       |_|    
//============================*/
function setup() {
  roomTitle = hintsJSON.roomTitle;
  roomFolder = hintsJSON.roomFolder;
  document.getElementById('header').innerHTML = roomTitle;
  timerTo60();
  projectEndTime();
  importJSON();
  importPictures();
  importVideos();
  importAudio();
  //Part of Fullscreen to allow for making video elements in Live Window
}

/*=========================================================================//
  _____   ____   _____ _______   _____                            _       
 |  __ \ / __ \ / ____|__   __| |  __ \                          | |      
 | |__) | |  | | (___    | |    | |__) |___  __ _ _   _  ___  ___| |_ ___ 
 |  ___/| |  | |\___ \   | |    |  _  // _ \/ _` | | | |/ _ \/ __| __/ __|
 | |    | |__| |____) |  | |    | | \ \  __/ (_| | |_| |  __/\__ \ |_\__ \
 |_|     \____/|_____/   |_|    |_|  \_\___|\__, |\__,_|\___||___/\__|___/
                                               | |                        
                                               |_|                        
//==========================================================================*/
//    SAVE JSON
function updateJSON() {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(hintsJSON)
  };
  fetch('/updateJSON', options);
}

/*==============================================================//
  _      _            __          ___           _               
 | |    (_)           \ \        / (_)         | |              
 | |     ___   _____   \ \  /\  / / _ _ __   __| | _____      __
 | |    | \ \ / / _ \   \ \/  \/ / | | '_ \ / _` |/ _ \ \ /\ / /
 | |____| |\ V /  __/    \  /\  /  | | | | | (_| | (_) \ V  V / 
 |______|_| \_/ \___|     \/  \/   |_|_| |_|\__,_|\___/ \_/\_/  
                                                                
//===============================================================*/
LiveWindowOpen = false;
let liveWindowObject = null;

function openLiveWindow(url, windowName) {
  if (liveWindowObject == null || liveWindowObject.closed) {
    liveWindowObject = window.open("liveWindow.html", "LiveView", "resizable,width=960,height=540");
    liveWindowObject.addEventListener('beforeunload', LiveWindowClosed);
    LiveWindowOpen = true;
    liveWindowBtn.style.display = "none";
    liveWindowOverlay.style.display = "none";
    contextBtn.innerHTML = 'Start Game';
    contextBtn.setAttribute("onclick", "startGame()");
    updating();

  } else {
    liveWindowObject.focus();
    alert("Live Window is Already Open");
  };
}

//Check if Live Window is Closed
function LiveWindowClosed() {
  liveWindowBtn.style.display = "block";
  liveWindowOverlay.style.display = "flex";
  LiveWindowOpen = false;
  contextBtn.innerHTML = 'Live Window';
  contextBtn.setAttribute("onclick", "openLiveWindow()");
}

//Make Live Window Fullscreen on Double Click
function makeFullscreen() {
  if (document.fullscreenEnabled) {
    document.documentElement.requestFullscreen();
  }
}

//---------------------------//
//    Update Live Window     //
//---------------------------//
function update() {
  if (LiveWindowOpen === true) {
    liveWindowObject.document.getElementById("liveTime").innerHTML = document.getElementById("previewTime").innerHTML;
    liveWindowObject.document.getElementById("liveHint").innerHTML = document.getElementById("previewHint").innerHTML;
    liveWindowObject.document.getElementById("liveGMtyping").style.display = previewGMTyping.style.display;
  }
}

function updating() {
  if (LiveWindowOpen === true) {
    setInterval(update, 500);
    document.getElementById("controls").style.display = "block";
  }
}

/*==========================================//
  _    _ _       _     _______    _         
 | |  | (_)     | |   |__   __|  | |        
 | |__| |_ _ __ | |_     | | __ _| |__  ___ 
 |  __  | | '_ \| __|    | |/ _` | '_ \/ __|
 | |  | | | | | | |_     | | (_| | |_) \__ \
 |_|  |_|_|_| |_|\__|    |_|\__,_|_.__/|___/
                                            
//===========================================*/
function openTab(evt, tabName) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " active";
}
/*===============================//
  _______ _                     
 |__   __(_)                    
    | |   _ _ __ ___   ___ _ __ 
    | |  | | '_ ` _ \ / _ \ '__|
    | |  | | | | | | |  __/ |   
    |_|  |_|_| |_| |_|\___|_|   
                                   
//================================*/
let seconds;
let minutes;
let remseconds;
let started = false;
let paused = true;

let currentTime = new Date();
let currentHour = currentTime.getHours();
let currentMinute = currentTime.getMinutes();
let meridiem = "AM";
let endTimeHour;
let endTimeMinute;

function timerTo60() {
  seconds = 3600;
}

function pause(a) {
  paused = a;
  if (paused === true) {
    playbtn.style.display = "block";
    pausebtn.style.display = "none";
    underPlaybtn.style.display = "none";
    underPausebtn.style.display = "block";
  }
  if (paused === false) {
    playbtn.style.display = "none";
    pausebtn.style.display = "block";
    underPlaybtn.style.display = "block";
    underPausebtn.style.display = "none";
    projectEndTime();
    if (started === false) {
      started = true;
      counting();
    }
  }
}

function counting() {
  setInterval(count, 1000);
}

function count() {
  if (paused == false) {
    seconds--;
  }
  remseconds = seconds % 60;
  minutes = Math.floor(seconds / 60);

  if (remseconds < 10) {
    remseconds = "0" + remseconds;
  }
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  if (seconds <= 0) {
    pause();
    gameOver();
    alert("GAME OVER")
  }
  counter.innerHTML = minutes + ":" + remseconds;
  previewTime.innerHTML = minutes + ":" + remseconds;
}

let amount;

function addTime() {
  amount = document.getElementById("amount").value;
  if (amount >= 0 && amount <= 60) {
    amount = (document.getElementById("amount").value) * 60;
    seconds = seconds + amount;
    count();
    projectEndTime();
  } else {
    alert("Values for editing time must be between 0 and 60. Decimals work too!");
  }
}

function subTime() {
  amount = document.getElementById("amount").value;
  if (amount >= 0 && amount <= 60) {
    amount = (document.getElementById("amount").value) * 60;
    seconds = seconds - amount;
    count();
    projectEndTime();
  } else {
    alert("Values for editing time must be between 0 and 60. Decimals work too!");
  }
}

function projectEndTime() {
  currentTime = new Date();
  remseconds = seconds % 60;
  minutes = Math.floor(seconds / 60);

  endTimeMinute = (currentMinute + minutes) % 60;
  endTimeHour = currentHour + Math.floor((currentMinute + minutes) / 60);

  if (endTimeHour >= 12) {
    endTimeHour = endTimeHour - 12;
    meridiem = "PM"
  }
  if (endTimeHour == 0) {
    endTimeHour = 12;
  }
  if (endTimeMinute < 10) {
    endTimeMinute = "0" + endTimeMinute;
  }
  endTime.innerHTML = endTimeHour + ":" + endTimeMinute + meridiem;

}



/*==========================================================//
  _    _ _       _      _____                  _            
 | |  | (_)     | |    / ____|                | |           
 | |__| |_ _ __ | |_  | |     ___  _   _ _ __ | |_ ___ _ __ 
 |  __  | | '_ \| __| | |    / _ \| | | | '_ \| __/ _ \ '__|
 | |  | | | | | | |_  | |___| (_) | |_| | | | | ||  __/ |   
 |_|  |_|_|_| |_|\__|  \_____\___/ \__,_|_| |_|\__\___|_|   
                                                               
//===========================================================*/
let numOfHints = 0;

function hintSub() {
  numOfHints--
  document.getElementById("numOfHints").innerHTML = numOfHints;
}

function hintAdd() {
  numOfHints++
  document.getElementById("numOfHints").innerHTML = numOfHints;
}


/*====================================================================//
   _____                         _____            _             _     
  / ____|                       / ____|          | |           | |    
 | |  __  __ _ _ __ ___   ___  | |     ___  _ __ | |_ _ __ ___ | |___ 
 | | |_ |/ _` | '_ ` _ \ / _ \ | |    / _ \| '_ \| __| '__/ _ \| / __|
 | |__| | (_| | | | | | |  __/ | |___| (_) | | | | |_| | | (_) | \__ \
  \_____|\__,_|_| |_| |_|\___|  \_____\___/|_| |_|\__|_|  \___/|_|___/
                                                                      
//=====================================================================*/
function startGame() {
  playVid("Intro.mp4");
  videoCurrentlyPlaying.onended = function () {
    pause(false);
    videoClose();
    audioSelected('music.weba')
    contextBtn.innerHTML = 'Winner!';
    contextBtn.setAttribute("onclick", "gameWin()");
  };
}

function gameOver() {
  pause(true);
  //clear stuff
  //end music
  //play loss video
}

function gameWin() {
  pause(true);
  openLeaderboardForm();
}

/*=================================================//
  _____                        _ _   _             
 |  __ \                      (_) | | |            
 | |__) | __ _____      ___ __ _| |_| |_ ___ _ __  
 |  ___/ '__/ _ \ \ /\ / / '__| | __| __/ _ \ '_ \ 
 | |   | | |  __/\ V  V /| |  | | |_| ||  __/ | | |
 |_|   |_|  \___| \_/\_/ |_|  |_|\__|\__\___|_| |_|
                                                                                        
//=================================================*/
function importJSON() {
  //Imports data from JSON file the saved hints/picture. 
  if (hintsJSON.prewritten !== undefined) {
    for (let i = 0; i < hintsJSON.prewritten.length; i++) {
      let listItem = document.createElement("li");
      let element = document.getElementById("prewrittenList");
      element.appendChild(listItem);

      let Xicon = document.createElement("i");
      Xicon.setAttribute("id", i);
      Xicon.setAttribute("onclick", "deleteHint(id)");
      Xicon.classList.add("deleteHint", "edit", "fas", "fa-times");
      listItem.appendChild(Xicon);

      let moveIcon = document.createElement("i");
      moveIcon.classList.add("moveHint", "edit", "fas", "fa-arrows-alt");
      listItem.appendChild(moveIcon);

      let div = document.createElement("div");
      div.setAttribute("onclick", "preWrittenSelect(this)");
      let node = document.createTextNode(hintsJSON.prewritten[i]);
      div.appendChild(node);
      listItem.appendChild(div);
    }
  }
}
//Send Hint
let writtenHints;
let storedHint;

function preWrittenSelect(a) {
  textarea.value = a.textContent;
  textarea.focus();
}

// Clear Prewritten Hint Area 
function clearPrewritten() {
  let list = document.getElementById("prewrittenList");
  while (list.lastElementChild) {
    list.removeChild(list.lastElementChild);
  }
}
//Toggle Edit Options
let editToggle = false;

function toggleHintEdit() {
  let editIcons = document.querySelectorAll(".edit")
  if (editToggle === false) {
    editIcons.forEach((e) => {
      e.style.display = "block";
    });
    editToggle = true;

  } else if (editToggle === true) {
    editIcons.forEach((e) => {
      e.style.display = "none";
    });
    editToggle = false;
  }
}

function reorderHints(oldIndex, newIndex) {
  hintsJSON.prewritten.splice(newIndex, 0, hintsJSON.prewritten.splice(oldIndex, 1)[0]);
  updateJSON();
}

function deleteHint(a) {
  console.log(a);
  hintsJSON.prewritten.splice(a, 1);
  clearPrewritten();
  importJSON();
  updateJSON();
}

function addHint() {
  if (textarea.value != "") {
    hintsJSON.prewritten.push(textarea.value);
    clearPrewritten();
    importJSON();
    updateJSON();
  }
}

//---------------------------//
//   Sortable Hints(Plugin)  //
//---------------------------//
//Sortable.js
var el = document.getElementById('prewrittenList');
var sortable = Sortable.create(el, {
  draggable: "li",
  handle: ".moveHint",
  ghostClass: "ghost",
  chosenClass: "sortable-chosen",
  dragClass: "sortable-drag",
  dragClass: "sortable-drag",
  animation: 150,

  onEnd: function (evt) {
    var itemEl = evt.item;
    evt.oldIndex; // element's old index within old parent
    evt.newIndex; // element's new index within new parent
    reorderHints(evt.oldIndex, evt.newIndex);
  }
});

/*====================================//
  _____ _      _                       
 |  __ (_)    | |                      
 | |__) |  ___| |_ _   _ _ __ ___  ___ 
 |  ___/ |/ __| __| | | | '__/ _ \/ __|
 | |   | | (__| |_| |_| | | |  __/\__ \
 |_|   |_|\___|\__|\__,_|_|  \___||___/
                                                         
//====================================*/
let picNames = null;

function importPictures() {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(hintsJSON)
  };
  fetch('/getPicNames', options).then(
      function (response) {
        if (response.status !== 200) {
          console.log('Looks like there was a problem. Status Code: ' +
            response.status);
          return;
        }
        // Examine the text in the response
        response.json().then(function (data) {
          //console.log(data);
          picNames = data;
          makeImages();
        });
      }
    )
    .catch(function (err) {
      console.log('Fetch Error :-S', err);
    });
}

function makeImages() {
  for (let i = 0; i < picNames.length; i++) {
    if (roomFolder != undefined) {
      let picContainer = document.getElementById("pictureSelectionList");
      let div = document.createElement("div");
      div.classList.add("pictureSelectContainer");
      div.setAttribute("id", picNames[i]);
      div.setAttribute('onclick', 'picSelect(id)');
      picContainer.appendChild(div);

      let path = 'Assets/Pictures/' + picNames[i];
      let url = "url('" + path + "')";
      document.getElementsByClassName("pictureSelectContainer")[i].style.backgroundImage = url;

      let icon = document.createElement("i");
      icon.classList.add("deletePic", "fas", "fa-times");
      icon.setAttribute("title", picNames[i]);
      icon.setAttribute("onclick", "deletePicture(title)");
      div.appendChild(icon);
    }
  }
}

//Picture Select
function picSelect(a) {
  if (liveWindowObject != null) {
    let url = "url(Assets/Pictures/" + a + ")";
    let picTimer = 60 * 1000; //milliseconds
    document.getElementById("previewPicOverlay").style.backgroundImage = url;
    document.getElementById("previewPicOverlay").style.display = "block";
    liveWindowObject.document.getElementById("livePicOverlay").style.backgroundImage = url;
    liveWindowObject.document.getElementById("livePicOverlay").style.display = "block";
    wait(picTimer);

    //hint Log
    makeTimestamp();
    var li = document.createElement("li");
    var node = document.createTextNode(timestamp + " :\xa0\xa0 " + a);
    li.appendChild(node);
    var element = document.getElementById("hintLog");
    element.appendChild(li);
  } else {
    alert("Open Live Window");
  }
}
//Close Picture
function picClose() {
  document.getElementById("previewPicOverlay").style.display = "none";
  liveWindowObject.document.getElementById("livePicOverlay").style.display = "none";
}

//How long the picture stays on screen
function resolveAfter(ms) {
  return new Promise(resolve => {
    setTimeout(() => {
      picClose();
    }, ms);
  });
}
async function wait(ms) {
  const result = await resolveAfter(ms);
  console.log(result);
  // expected output: 'resolved'
}

//+++++++++++++++++++++//
//    Edit Pictures    //
//+++++++++++++++++++++//
let addPictureToggle = false;

function toggleAddPicture() {
  let deleteIcons = document.getElementsByClassName("deletePic");
  if (addPictureToggle == false) {
    document.getElementById('addImageOuter').style.display = "inline-flex";
    for (let i = 0; i < deleteIcons.length; i++) {
      deleteIcons[i].style.display = "inline-flex";
    }
    addPictureToggle = true;
  } else {
    document.getElementById('addImageOuter').style.display = "none";
    for (let i = 0; i < deleteIcons.length; i++) {
      deleteIcons[i].style.display = "none";
    }
    addPictureToggle = false;
  }
}

// Clear Picture Elements from Hint Area 
function clearPicturesFromList() {
  let list = document.getElementById("pictureSelectionList");
  while (list.lastElementChild) {
    list.removeChild(list.lastElementChild);
  }
}

//New Picture Preview
const newPicInput = document.getElementById('pictureURL');
let newPicURL = newPicInput.value;
newPicInput.addEventListener('input', updateNewPicturePreview);

function updateNewPicturePreview() {
  newPicURL = newPicInput.value;
  document.getElementById("newPicturePreview").style.backgroundImage = 'url(' + newPicURL + ')';
}

//DRAG AND DROP 
let pictureDropArea = document.getElementById('pictureDropArea');
pictureDropArea.addEventListener('dragenter', handleDragEnter, false);
pictureDropArea.addEventListener('dragleave', handleDragLeave, false);
pictureDropArea.addEventListener('dragover', handleDragover, false);
pictureDropArea.addEventListener('drop', handleDrop, false);

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  pictureDropArea.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
};

['dragenter', 'dragover'].forEach(eventName => {
  pictureDropArea.addEventListener(eventName, highlight, false);
});

['dragleave', 'drop'].forEach(eventName => {
  pictureDropArea.addEventListener(eventName, unhighlight, false);
});

function highlight(e) {
  pictureDropArea.classList.add('highlight');
}

function unhighlight(e) {
  pictureDropArea.classList.remove('highlight');
}

pictureDropArea.addEventListener('drop', handleDrop, false)

function handleDragEnter(e) {}

function handleDragLeave(e) {}

function handleDragover(e) {}

function handleDrop(e) {
  let imageUrl = e.dataTransfer.getData('text/html');
  let rex = /src="?([^"\s]+)"?\s*/;
  let url;
  url = rex.exec(imageUrl);
  console.log('Picture Dropped:  ' + url[1]);
  document.getElementById('pictureURL').value = url[1];
  updateNewPicturePreview();
}

function saveNewPicture() {
  if (document.getElementById('pictureFileName').value == "" ||
    document.getElementById('pictureURL').value == "") {
    alert('Please Enter Name and Image Address');
  } else if (/\s/.test(document.getElementById('pictureFileName').value)) {
    alert('Makes sure there are NO SPACES in the File Name.');
  } else {
    let fileName = document.getElementById('pictureFileName').value;
    let newPicURL = document.getElementById('pictureURL').value;
    let newPictureObject = {
      "roomFolder": roomFolder,
      "fileName": fileName,
      "newPicURL": newPicURL
    }
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newPictureObject)
    };
    fetch('/savePicture', options)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        if (response.ok) {
          document.getElementById('pictureFileName').value = "";
          document.getElementById('pictureURL').value = "";
          document.getElementById('newPicturePreview').style.backgroundImage = "none"
          clearPicturesFromList();
          importPictures();
          console.log("Picture Saved");
        }
      })
      .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
      });;
  }
}

function deletePicture(fileName) {
  let newPictureObject = {
    "roomFolder": roomFolder,
    "fileName": fileName
  }
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newPictureObject)
  };
  fetch('/deletePicture', options)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      if (response.ok) {
        clearPicturesFromList();
        importPictures();
        console.log("Picture Deleted");
      }
    })
    .catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
    });

}

/*====================================//
__      _______ _____  ______ ____  
\ \    / /_   _|  __ \|  ____/ __ \ 
 \ \  / /  | | | |  | | |__ | |  | |
  \ \/ /   | | | |  | |  __|| |  | |
   \  /   _| |_| |__| | |___| |__| |
    \/   |_____|_____/|______\____/    

//====================================*/
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
          //console.log(data);
          videoNames = data;
          makeVideo();
        });
      }
    )
    .catch(function (err) {
      console.log('Fetch Error :-S', err);
    });
}

function makeVideo() {
  for (let i = 0; i < videoNames.length; i++) {
    if (roomFolder != undefined) {
      let listItem = document.createElement("li");
      let videoContainer = document.getElementById("videoContainer");
      videoContainer.appendChild(listItem);

      let span = document.createElement("span");
      span.setAttribute("title", videoNames[i]);
      span.setAttribute("onclick", 'playVid(this.title)');
      listItem.appendChild(span);
      span.innerHTML = videoNames[i];

      let Xicon = document.createElement("i");
      Xicon.setAttribute("title", videoNames[i]);
      Xicon.setAttribute("onclick", "deleteVideo(title)");
      Xicon.classList.add("deleteHint", "deleteVideo", "edit", "fas", "fa-times");
      listItem.appendChild(Xicon);

      let slider = document.createElement("input");
      slider.setAttribute("type", 'range');
      slider.setAttribute("min", '0');
      slider.setAttribute("max", '1');
      slider.setAttribute("step", '0.025');
      slider.setAttribute("value", '.5');
      slider.setAttribute("id", videoNames[i] + 'SLIDER');
      slider.setAttribute("onchange", 'updateVolumeVideo(this.value)');
      listItem.appendChild(slider);

      let newVideo = document.createElement("video");
      newVideo.setAttribute("id", videoNames[i]);
      newVideo.controls = true;
      newVideo.muted = true;
      document.getElementById('previewVideoOverlay').appendChild(newVideo);

      let source = document.createElement('source');
      source.setAttribute("src", 'Assets/Videos/' + videoNames[i]);
      source.setAttribute("type", 'video/mp4');
      newVideo.appendChild(source);
    }
  }
}

let videoCurrentlyPlaying = null;
let liveVideoCurrentlyPlaying = null;

function playVid(id) {
  if (liveWindowObject != null) {
    if (videoCurrentlyPlaying != null) {
      videoClose();
    }
    if (videoCurrentlyPlaying == null) {
      videoCurrentlyPlaying = document.getElementById(id);
      document.getElementById("previewVideoOverlay").style.display = "block";
      document.getElementById(id).style.display = "block";
      document.getElementById(id).play();
      liveVideoCurrentlyPlaying = "live" + id;
      liveWindowObject.document.getElementById("liveVideoOverlay").style.display = "block";
      liveWindowObject.document.getElementById(liveVideoCurrentlyPlaying).style.display = "block";
      liveWindowObject.document.getElementById(liveVideoCurrentlyPlaying).play();

      videoCurrentlyPlaying.addEventListener("seeked", syncVideos);
      videoCurrentlyPlaying.addEventListener("play", syncVideosPlay);
      videoCurrentlyPlaying.addEventListener("pause", syncVideosPause);

      videoCurrentlyPlaying.onended = function () {
        videoClose();
      };
      //hint Log
      makeTimestamp();
      var li = document.createElement("li");
      var node = document.createTextNode(timestamp + " :\xa0\xa0 " + videoCurrentlyPlaying.id);
      li.appendChild(node);
      var element = document.getElementById("hintLog");
      element.appendChild(li);
    }
  } else {
    alert("Open Live Window");
  }
}

function syncVideosPlay() {
  liveWindowObject.document.getElementById(liveVideoCurrentlyPlaying).play();
};

function syncVideosPause() {
  liveWindowObject.document.getElementById(liveVideoCurrentlyPlaying).pause();
};

function syncVideos() {
  if (videoCurrentlyPlaying != null) {
    liveWindowObject.document.getElementById(liveVideoCurrentlyPlaying).currentTime = videoCurrentlyPlaying.currentTime;
  }
};

function videoClose() {
  videoCurrentlyPlaying.pause();
  videoCurrentlyPlaying.currentTime = 0;
  videoCurrentlyPlaying.style.display = "none";
  document.getElementById("previewVideoOverlay").style.display = "none";
  liveWindowObject.document.getElementById(liveVideoCurrentlyPlaying).pause();
  liveWindowObject.document.getElementById(liveVideoCurrentlyPlaying).currentTime = 0;
  liveWindowObject.document.getElementById(liveVideoCurrentlyPlaying).style.display = "none";
  liveWindowObject.document.getElementById("liveVideoOverlay").style.display = "none";
  videoCurrentlyPlaying = null;
}

//+++++++++++++++++++++//
//    Edit Videos    //
//+++++++++++++++++++++//
let addVideoToggle = false;

function toggleAddVideo() {
  let deleteVideoIcons = document.getElementsByClassName("deleteVideo");
  if (addVideoToggle == false) {
    document.getElementById('addVideoOuter').style.display = "inline-flex";
    for (let i = 0; i < deleteVideoIcons.length; i++) {
      deleteVideoIcons[i].style.display = "block";
    }
    addVideoToggle = true;
  } else {
    document.getElementById('addVideoOuter').style.display = "none";
    for (let i = 0; i < deleteVideoIcons.length; i++) {
      deleteVideoIcons[i].style.display = "none";
    }
    addVideoToggle = false;
  }
}

function deleteVideo(fileName) {
  let newVideoObject = {
    "roomFolder": roomFolder,
    "fileName": fileName
  }
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newVideoObject)
  };
  fetch('/deleteVideo', options)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      if (response.ok) {
        clearVideosFromList();
        importVideos();
        console.log("Video Deleted");
      }
    })
    .catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
    });
}

// Clear Video Elements from Hint Area 
function clearVideosFromList() {
  let list = document.getElementById("videoContainer");
  while (list.lastElementChild) {
    list.removeChild(list.lastElementChild);
  }
}



function updateVolumeVideo(value) {
  liveWindowObject.document.getElementById(liveVideoCurrentlyPlaying).volume = value;
}


















/*=============================//
                    _ _       
     /\            | (_)      
    /  \  _   _  __| |_  ___  
   / /\ \| | | |/ _` | |/ _ \ 
  / ____ \ |_| | (_| | | (_) |
 /_/    \_\__,_|\__,_|_|\___/ 
                              
//==============================*/
let audioNames = null;

function importAudio() {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(hintsJSON)
  };
  fetch('/getAudioNames', options).then(
      function (response) {
        if (response.status !== 200) {
          console.log('Looks like there was a problem. Status Code: ' +
            response.status);
          return;
        }
        // Examine the text in the response
        response.json().then(function (data) {
          //console.log(data);
          audioNames = data;
          makeAudio();
        });
      }
    )
    .catch(function (err) {
      console.log('Fetch Error :-S', err);
    });
}

function makeAudio() {
  for (let i = 0; i < audioNames.length; i++) {
    if (roomFolder != undefined) {
      let listItem = document.createElement("li");
      let audioContainer = document.getElementById("audioContainer");
      audioContainer.appendChild(listItem);

      let span = document.createElement("span");
      span.setAttribute("title", audioNames[i]);
      span.setAttribute("onclick", 'audioSelected(this.title)');
      listItem.appendChild(span);
      span.innerHTML = audioNames[i];

      let Xicon = document.createElement("i");
      Xicon.setAttribute("title", audioNames[i]);
      Xicon.setAttribute("onclick", "deleteAudio(title)");
      Xicon.classList.add("deleteHint", "deleteAudio", "edit", "fas", "fa-times");
      listItem.appendChild(Xicon);

      let slider = document.createElement("input");
      slider.setAttribute("type", 'range');
      slider.setAttribute("min", '0');
      slider.setAttribute("max", '1');
      slider.setAttribute("step", '0.025');
      slider.setAttribute("value", '.5');
      slider.setAttribute("id", audioNames[i] + 'SLIDER');
      slider.setAttribute("onchange", 'updateVolume(this.value, id)');
      listItem.appendChild(slider);

      let newAudio = document.createElement("audio");
      newAudio.setAttribute("id", audioNames[i]);
      newAudio.setAttribute("src", 'Assets/Audio/' + audioNames[i]);

      listItem.appendChild(newAudio);
    }
  }
}

function audioSelected(title) {
  let id = title;
  let audio = document.getElementById(id);
  audio.play();
}

function updateVolume(value, title) {
  audio = document.getElementById(title.substring(0, title.length - 6));
  audio.volume = value;
}

function clearAudio(name) {
  if (name != music) {
    document.getElementById("music").pause();
  }
}

//+++++++++++++++++++++//
//    Edit Audio    //
//+++++++++++++++++++++//
let addAudioToggle = false;

function toggleAddAudio() {
  let deleteAudioIcons = document.getElementsByClassName("deleteAudio");
  if (addAudioToggle == false) {
    document.getElementById('addAudioOuter').style.display = "inline-flex";
    for (let i = 0; i < deleteAudioIcons.length; i++) {
      deleteAudioIcons[i].style.display = "block";
    }
    addAudioToggle = true;
  } else {
    document.getElementById('addAudioOuter').style.display = "none";
    for (let i = 0; i < deleteAudioIcons.length; i++) {
      deleteAudioIcons[i].style.display = "none";
    }
    addAudioToggle = false;
  }
}

function deleteAudio(fileName) {
  let newAudioObject = {
    "roomFolder": roomFolder,
    "fileName": fileName
  }
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newAudioObject)
  };
  fetch('/deleteAudio', options)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      if (response.ok) {
        clearAudioFromList();
        importAudio();
        console.log("Audio Deleted");
      }
    })
    .catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
    });
}

// Clear Video Elements from Hint Area 
function clearAudioFromList() {
  let list = document.getElementById("audioContainer");
  while (list.lastElementChild) {
    list.removeChild(list.lastElementChild);
  }
}


/*========================================//
  _    _ _       _     ______    _ _ _   
 | |  | (_)     | |   |  ____|  | (_) |  
 | |__| |_ _ __ | |_  | |__   __| |_| |_ 
 |  __  | | '_ \| __| |  __| / _` | | __|
 | |  | | | | | | |_  | |___| (_| | | |_ 
 |_|  |_|_|_| |_|\__| |______\__,_|_|\__|
                                         
//========================================*/
//Ding
function ding() {
  var ding = document.getElementById("ding");
  ding.play();
}

//Clear
function clearHint() {
  textarea.value = "";
}


//Send Hint
function sendHint() {
  if (textarea.value.substring(0, 4) == "http") {
    picSelect(textarea.value, textarea.value);
  } else {
    document.getElementById("previewHint").innerHTML = textarea.value;
  }
  if (textarea.value != '') {
    //Log Hint
    makeTimestamp();
    let li = document.createElement("li");
    let node = document.createTextNode(timestamp + " :\xa0\xa0 " + textarea.value);
    li.appendChild(node);
    let element = document.getElementById("hintLog");
    element.appendChild(li);
    audioSelected('ding.wav');
  }
  clearHint();
}

//Send on Pressing Enter 
if (textarea != null) {
  textarea.addEventListener("keypress", sendOnEnter);
}

function sendOnEnter(event) {
  if (event.which === 13 && !event.shiftKey) {
    sendHint();
    event.preventDefault();
    clearHint();
  }
}

//Game Master is Typing 
if (textarea != null) {
  textarea.addEventListener("focus", GMtyping);
}

function GMtyping() {
  if (textarea.value != "") {
    document.getElementById("GMtyping").style.display = "inline-block";
  } else {
    document.getElementById("GMtyping").style.display = "none";
  }
  if (document.activeElement == textarea) {
    setTimeout(GMtyping, 250)
  } else {
    document.getElementById("GMtyping").style.display = "none";
  }
}

/*========================================//
  _    _ _       _     _                 
 | |  | (_)     | |   | |                
 | |__| |_ _ __ | |_  | |     ___   __ _ 
 |  __  | | '_ \| __| | |    / _ \ / _` |
 | |  | | | | | | |_  | |___| (_) | (_| |
 |_|  |_|_|_| |_|\__| |______\___/ \__, |
                                    __/ |
                                   |___/ 
//========================================*/
let timestamp;

function makeTimestamp() {
  currentTime = new Date();
  let timestamphours;
  let timestampminutes;
  let timestampmeridiem = "am";
  if (currentTime.getHours() > 12) {
    timestamphours = currentTime.getHours() - 12;
    timestampmeridiem = "pm";
  } else {
    timestamphours = currentTime.getHours();
  }
  if (currentTime.getMinutes() < 10) {
    timestampminutes = "0" + currentTime.getMinutes();
  } else {
    timestampminutes = currentTime.getMinutes();
  }
  timestamp = timestamphours + ":" + timestampminutes + timestampmeridiem;
}


/*=======================================================================================//
  _                    _           _                         _   ______                   
 | |                  | |         | |                       | | |  ____|                  
 | |     ___  __ _  __| | ___ _ __| |__   ___   __ _ _ __ __| | | |__ ___  _ __ _ __ ___  
 | |    / _ \/ _` |/ _` |/ _ \ '__| '_ \ / _ \ / _` | '__/ _` | |  __/ _ \| '__| '_ ` _ \ 
 | |___|  __/ (_| | (_| |  __/ |  | |_) | (_) | (_| | | | (_| | | | | (_) | |  | | | | | |
 |______\___|\__,_|\__,_|\___|_|  |_.__/ \___/ \__,_|_|  \__,_| |_|  \___/|_|  |_| |_| |_|
                                                                                          
//========================================================================================*/
function openLeaderboardForm() {
  leaderboardForm.style.display = "table";
  leaderboardTime.value = minutes + ":" + remseconds;
}

function closeLeaderboardForm() {
  leaderboardForm.style.display = "none";
}

function formContinue() {
  pause(false);
  //playmusic
}

function sendLeaderboardInfo() {

}