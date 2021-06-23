$.getScript("../../statichandgesture-classes.js");

let statusDiv = document.getElementById("status");
let video = document.getElementById("webcam");
let isVideo = false;
let staticGestureModel = undefined;

if (navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then(function (stream) {
      video.srcObject = stream;
      isVideo = true;
      statusDiv.innerHTML = "Webcam started!";
    })
    .catch(function (err0r) {
      statusDiv.innerHTML = "Something went wrong! Webcam didn't start!";
    });
}

function predictWebcam() {
  console.log(staticGestureModel);
}

video.onloadeddata = (event) => {
  tf.loadGraphModel(
    "http://localhost:81/tfjs-models/EfficientNetB0/english/model.json"
  ).then((model) => {
    staticGestureModel = model;
  });
  predictWebcam();
};
