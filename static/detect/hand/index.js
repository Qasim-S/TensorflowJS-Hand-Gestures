const enableWebcamButton = document.getElementById("webcamButton");
const disableWebcamButton = document.getElementById("webcamButtonDisable");
const video = document.getElementById("webcam");
const liveView = document.getElementById("liveView");
const display = document.getElementById("display");
const topLeft = document.getElementById("topLeft");
const bottomRight = document.getElementById("bottomRight");

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

var children = [];

// Placeholder function for next step.
function predictWebcam() {
  // Estimating the hands in a frame
  console.log("Getting the hands...");
  model.estimateHands(video).then(function (hands) {
    console.log("Got the hands...");

    // Remove any highlighting we did previous frame.
    for (let i = 0; i < children.length; i++) {
      liveView.removeChild(children[i]);
    }
    children.splice(0);

    hands.forEach((hand, i) => {
      // If we are over 66% sure we are sure we detected it right, draw the bounding box!
      if (hand.handInViewConfidence > 0.66) {
        /*
            tL = boundingBox.topLeft
            bR = boundingBox.bottomRight
            tR = [bR[0] - tL[0], tL[1]]
            bL = [tL[0], bR[1]]
        */

        let left = Math.abs(hand.boundingBox.topLeft[0]);
        let top = Math.abs(hand.boundingBox.topLeft[1]);
        let width = Math.abs(
          hand.boundingBox.bottomRight[0] - hand.boundingBox.topLeft[0]
        );
        let height = Math.abs(
          hand.boundingBox.topLeft[1] - hand.boundingBox.bottomRight[1]
        );

        // Creating the highlighter div
        const highlighter = document.createElement("div");
        highlighter.setAttribute("class", "highlighter");
        highlighter.style = `left: ${left}px; top: ${top}px; width: ${width}px; height: ${height}px;`;

        // Appending the highlighter to the 'liveView' div
        liveView.appendChild(highlighter);

        topLeft.innerHTML = `(${hand.boundingBox.topLeft[0]}, ${hand.boundingBox.topLeft[1]})`;
        bottomRight.innerHTML = `(${hand.boundingBox.bottomRight[0]}, ${hand.boundingBox.bottomRight[1]})`;

        // Storing the highlighter in the 'children' list for deleting it safely
        // when processing the next frame
        children.push(highlighter);
      }
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
