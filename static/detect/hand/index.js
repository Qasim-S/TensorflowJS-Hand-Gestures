const enableWebcamButton = document.getElementById("webcamButton");
const disableWebcamButton = document.getElementById("webcamButtonDisable");
const video = document.getElementById("webcam");
const liveView = document.getElementById("liveView");

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
// handTrack is an external object loaded from our index.html
const modelParams = {
  flipHorizontal: true,
  maxNumBoxes: 20,
  iouThreshold: 0.5,
  scoreThreshold: 0.66,
};

handTrack.load(modelParams).then(function (loadedModel) {
  model = loadedModel;
  console.log("Got the model...");
});

var children = [];

// Placeholder function for next step.
function predictWebcam() {
  // Estimating the hands in a frame
  console.log("Getting the hands...");
  model.detect(video).then(function (predictions) {
    console.log(predictions);

    // Remove any highlighting we did previous frame.
    for (let i = 0; i < children.length; i++) {
      liveView.removeChild(children[i]);
    }
    children.splice(0);

    predictions.forEach((prediction, i) => {
      // If we are over 66% sure we are sure we detected it right, draw the bounding box!
      //   if (prediction.score > 0.66) {
      console.log("Has a hand...");
      //  Getting the bounding box coordinates from the handTrack prediction
      let left = prediction.bbox[0];
      let top = prediction.bbox[1];
      let width = prediction.bbox[2];
      let height = prediction.bbox[3];

      // Creating the highlighter div
      const highlighter = document.createElement("div");
      highlighter.setAttribute("class", "highlighter");
      highlighter.style = `left: ${left}px; top: ${top}px; width: ${width}px; height: ${height}px;`;

      // Appending the highlighter to the 'liveView' div
      liveView.appendChild(highlighter);

      // Storing the highlighter in the 'children' list for deleting it safely
      // when processing the next frame
      children.push(highlighter);
      //   }
    });
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
