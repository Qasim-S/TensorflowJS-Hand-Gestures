$.getScript("../../../statichandgesture-classes.js");

const video = document.getElementById("webcam");
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
let trackButton = document.getElementById("webcamButton");
let updateNote = document.getElementById("updatenote");
let croppedCanvas = document.getElementById("croppedImage");

let isVideo = false;
let model = null;

(async function () {
  staticGestureModel = await tf.loadGraphModel(
    "http://localhost:81/tfjs-models/EfficientNetB0/numbers/model.json"
  );
})();

const modelParams = {
  flipHorizontal: true, // flip e.g for video
  maxNumBoxes: 20, // maximum number of boxes to detect
  iouThreshold: 0.5, // ioU threshold for non-max suppression
  scoreThreshold: 0.6, // confidence threshold for predictions.
};

function startVideo() {
  handTrack.startVideo(video).then(function (status) {
    console.log("Webcam started...", status);
    if (status) {
      updateNote.innerText = "Video started... Now tracking!";
      trackButton.innerHTML = "Stop";
      isVideo = true;
      runDetection();
    } else {
      updateNote.innerText = "Please enable video!";
    }
  });
}

function toggleVideo() {
  if (!isVideo) {
    trackButton.innerHTML = "Capture";
    startVideo();
  } else {
    handTrack.stopVideo(video);
    isVideo = false;
    updateNote.innerText = "Video stopped";
    trackButton.innerHTML = "Capture";
  }
}

function runDetection() {
  model.detect(video).then((predictions) => {
    console.log("Predictions: ", predictions);
    model.renderPredictions(predictions, canvas, context, video);
    predictions.forEach((prediction, i) => {
      if (prediction.label != "face") {
        let imgTensor = tf.browser.fromPixels(video);

        boxes = [];
        box = [
          prediction.bbox[1] / imgTensor.shape[0],
          prediction.bbox[0] / imgTensor.shape[1],
          (prediction.bbox[1] + prediction.bbox[3]) / imgTensor.shape[0],
          (prediction.bbox[0] + prediction.bbox[2]) / imgTensor.shape[1],
        ];
        boxes.push(box);

        let crop = tf.image.cropAndResize(
          imgTensor.reverse(1).expandDims(),
          tf.tensor(boxes).reshape([1, 4]),
          [0],
          [224, 224]
        );

        crop = crop.resizeNearestNeighbor([224, 224]).toFloat();

        // More pre-processing to be added here later
        // tf.browser
        //   .toPixels(crop.reshape([224, 224, 3]), croppedCanvas)
        //   .then(() => {
        //     crop.dispose();
        //   });

        console.log("Getting predictions...");
        staticGestureModel
          .predict(crop)
          .data()
          .then((predictions) => {
            console.log("Got predictions...", predictions);
            let top5 = Array.from(predictions)
              .map(function (p, i) {
                return {
                  probability: p,
                  className: NUMBER_CLASSES[i],
                };
              })
              .sort(function (a, b) {
                return b.probability - a.probability;
              })
              .slice(0, 5);

            $("#prediction-list").empty();
            top5.forEach(function (p) {
              $("#prediction-list").append(
                `<li class="list-group-item">${
                  p.className
                }<span class="badge" style="color:#000000">${
                  p.probability.toFixed(3) * 100
                } %</span></li>`
              );
            });
          });
      }
    });
    if (isVideo) {
      requestAnimationFrame(runDetection);
    }
  });
}

// Load the model.
handTrack.load(modelParams).then((lmodel) => {
  // detect objects in the image.
  model = lmodel;
  updateNote.innerText = "Loaded Model!";
  trackButton.disabled = false;
});
