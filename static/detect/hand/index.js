const enableWebcamButton = document.getElementById("webcamButton");
const disableWebcamButton = document.getElementById("webcamButtonDisable");
const video = document.getElementById("webcam");

// Check if webcam access is supported.
function getUserMediaSupported() {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}

// If webcam supported, add event listener to button for when user
// wants to activate it to call enableCam function which we will
// define in the next step.
if (getUserMediaSupported()) {
  enableWebcamButton.addEventListener("click", enableCam);
  disableWebcamButton.addEventListener("click", disableCam);
} else {
  console.warn("getUserMedia() is not supported by your browser");
}

// Enable the live webcam view and start classification.
function enableCam(event) {
  // Only continue if the COCO-SSD has finished loading.
  if (!model) {
    return;
  }

  // getUsermedia parameters to force video but not audio.
  const constraints = {
    video: true,
  };

  // Activate the webcam stream.
  navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
    window.localStream = stream;
    video.srcObject = stream;
    video.style.visibility = "visible";
    video.addEventListener("loadeddata", predictWebcam);
  });
}

// Placeholder function for next step.
function predictWebcam() {}

// Pretend model has loaded so we can try out the webcam code.
var model = true;

// Disable the webcam
function disableCam() {
  localStream.getVideoTracks()[0].stop();
  video.src = "";
  video.style.visibility = "hidden";
}
