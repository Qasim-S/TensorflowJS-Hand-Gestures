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

        let crop = tf.image.cropAndResize(
          imgTensor.expandDims(),
          tf.tensor(prediction.bbox).reshape([1, 4]),
          [0],
          [224, 224]
        );

        tf.browser.toPixels(imgTensor.reverse(1), croppedCanvas).then(() => {
          crop.dispose();
        });
      }
    });
    if (isVideo) {
      //requestAnimationFrame(runDetection);
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

function imgTransform(img) {
  img = tf.image.resizeBilinear(img, [224, 224]).div(tf.scalar(255));
  img = tf.cast(img, (dtype = "float32"));

  /*mean of natural image*/
  let meanRgb = { red: 0.485, green: 0.456, blue: 0.406 };

  /* standard deviation of natural image*/
  let stdRgb = { red: 0.229, green: 0.224, blue: 0.225 };

  let indices = [
    tf.tensor1d([0], "int32"),
    tf.tensor1d([1], "int32"),
    tf.tensor1d([2], "int32"),
  ];

  /* sperating tensor channelwise and applyin normalization to each chanel seperately */
  let centeredRgb = {
    red: tf
      .gather(img, indices[0], 2)
      .sub(tf.scalar(meanRgb.red))
      .div(tf.scalar(stdRgb.red))
      .reshape([224, 224]),

    green: tf
      .gather(img, indices[1], 2)
      .sub(tf.scalar(meanRgb.green))
      .div(tf.scalar(stdRgb.green))
      .reshape([224, 224]),

    blue: tf
      .gather(img, indices[2], 2)
      .sub(tf.scalar(meanRgb.blue))
      .div(tf.scalar(stdRgb.blue))
      .reshape([224, 224]),
  };

  /* combining seperate normalized channels*/
  let processedImg = tf
    .stack([centeredRgb.red, centeredRgb.green, centeredRgb.blue])
    .expandDims();
  return processedImg;
}
