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

// Store the resulting model in the global scope of our app.
var model = undefined;

// Before we can use Handpose class we must wait for it to finish
// loading. Machine Learning models can be large and take a moment
// to get everything needed to run.
// handpose is an external object loaded from our index.html
handpose.load().then(function (loadedModel) {
  model = loadedModel;
  console.log("Got the model...");
});

// Placeholder function for next step.
function predictWebcam() {
  // Estimating the hands in a frame
  console.log("Getting the hands...");
  model.estimateHands(video).then(function (hands) {
    console.log("Got the hands...");

    hands.forEach((hand, i) => console.log(hand.landmarks));
  });

  // Call this function again to keep predicting when the browser is ready.
  window.requestAnimationFrame(predictWebcam);
}

// Disable the webcam
function disableCam() {
  localStream.getVideoTracks()[0].stop();
  video.src = "";
  video.style.visibility = "hidden";
}
