const video = document.getElementById("webcam");
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
let trackButton = document.getElementById("webcamButton");
let updateNote = document.getElementById("updatenote");
let croppedCanvas = document.getElementById("croppedImage");

let isVideo = false;
let model = null;

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

        // changing the crop from Int32 to Float32
        crop = tf.image.resizeBilinear(crop, [224, 224]).div(tf.scalar(255));
        crop = tf.cast(crop, (dtype = "float32"));

        tf.browser
          .toPixels(crop.reshape([224, 224, 3]), croppedCanvas)
          .then(() => {
            crop.dispose();
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

function toGrayScale(img) {
  // the scalars needed for conversion of each channel
  // per the formula: gray = 0.2989 * R + 0.5870 * G + 0.1140 * B
  rFactor = tf.scalar(0.2989);
  gFactor = tf.scalar(0.587);
  bFactor = tf.scalar(0.114);

  // separate out each channel. x.shape[0] and x.shape[1] will give you
  // the correct dimensions regardless of image size
  r = img.slice([0, 0, 0], [img.shape[0], img.shape[1], 1]);
  g = img.slice([0, 0, 1], [img.shape[0], img.shape[1], 1]);
  b = img.slice([0, 0, 2], [img.shape[0], img.shape[1], 1]);

  // add all the tensors together, as they should all be the same dimensions.
  gray = r.mul(rFactor).add(g.mul(gFactor)).add(b.mul(bFactor));

  return gray;
}
