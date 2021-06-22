// /**
//  * @license
//  * Copyright 2018 Google LLC. All Rights Reserved.
//  * Licensed under the Apache License, Version 2.0 (the "License");
//  * you may not use this file except in compliance with the License.
//  * You may obtain a copy of the License at
//  *
//  * http://www.apache.org/licenses/LICENSE-2.0
//  *
//  * Unless required by applicable law or agreed to in writing, software
//  * distributed under the License is distributed on an "AS IS" BASIS,
//  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  * See the License for the specific language governing permissions and
//  * limitations under the License.
//  * =============================================================================
//  */

// const video = document.getElementById("webcam");
// const liveView = document.getElementById("liveView");
// const demosSection = document.getElementById("demos");
// const enableWebcamButton = document.getElementById("webcamButton");

// // Check if webcam access is supported.
// function getUserMediaSupported() {
//   return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
// }

// // If webcam supported, add event listener to button for when user
// // wants to activate it to call enableCam function which we will
// // define in the next step.
// if (getUserMediaSupported()) {
//   enableWebcamButton.addEventListener("click", enableCam);
// } else {
//   console.warn("getUserMedia() is not supported by your browser");
// }

// // Enable the live webcam view and start classification.
// function enableCam(event) {
//   // Only continue if the COCO-SSD has finished loading.
//   if (!model) {
//     return;
//   }

//   // Hide the button once clicked.
//   event.target.classList.add("removed");

//   // getUsermedia parameters to force video but not audio.
//   const constraints = {
//     video: true,
//   };

//   // Activate the webcam stream.
//   navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
//     video.srcObject = stream;
//     video.addEventListener("loadeddata", predictWebcam);
//   });
// }

// var children = [];
// var img;

// function predictWebcam() {
//   // Now let's start classifying a frame in the stream.
//   //   tf.data.webcam(video).then((webcamIterator) => {
//   //     webcamIterator.capture().then((image) => {
//   //       img = image;
//   //     });
//   //   });

//   let tensor = tf.browser
//     .fromPixels(video)
//     .resizeNearestNeighbor([224, 224])
//     .toFloat()
//     .expandDims();

//   console.log("Prediction time...");
//   model.predict(tensor).then(function (predictionTensor) {
//     console.log("Getting predictions...");
//     let predictions = predictionTensor.data();
//     console.log("Got predictions...");
//     let top5 = Array.from(predictions)
//       .map(function (p, i) {
//         return {
//           probability: p,
//           className: STATICHANDGESTURE_ENGLISH_CLASSES[i],
//         };
//       })
//       .sort(function (a, b) {
//         return b.probability - a.probability;
//       })
//       .slice(0, 5);

//     $("#prediction-list").empty();
//     top5.forEach(function (p) {
//       $("#prediction-list").append(
//         `<li>${p.className}: ${p.probability.toFixed(6)}</li>`
//       );
//     });

//     // Call this function again to keep predicting when the browser is ready.
//     window.requestAnimationFrame(predictWebcam);
//   });
// }

// // Store the resulting model in the global scope of our app.
// var model = undefined;

// // Before we can use COCO-SSD class we must wait for it to finish
// // loading. Machine Learning models can be large and take a moment
// // to get everything needed to run.
// // Note: cocoSsd is an external object loaded from our index.html
// // script tag import so ignore any warning in Glitch.
(async function () {
  model = await tf.loadGraphModel(
    "http://localhost:81/tfjs-models/EfficientNetB0/english/model.json"
  );
  //   demosSection.classList.remove("invisible");
})();

const camPredict = async (webcamIterator) => {
  const img = await webcamIterator.capture();

  //   let tensor = tf.browser
  //     .fromPixels(img)
  //     .resizeNearestNeighbor([224, 224])
  //     .toFloat()
  //     .expandDims();

  //   // More pre-processing to be added here later

  //   console.log("Getting predictions...");
  //   let predictions = await model.predict(tensor).data();
  //   console.log("Got predictions...");
  //   let top5 = Array.from(predictions)
  //     .map(function (p, i) {
  //       return {
  //         probability: p,
  //         className: STATICHANDGESTURE_ENGLISH_CLASSES[i],
  //       };
  //     })
  //     .sort(function (a, b) {
  //       return b.probability - a.probability;
  //     })
  //     .slice(0, 5);

  //   $("#prediction-list").empty();
  //   top5.forEach(function (p) {
  //     $("#prediction-list").append(
  //       `<li>${p.className}: ${p.probability.toFixed(6)}</li>`
  //     );

  camPredict(webcamIterator);
};

async function webcamLaunch() {
  const display = document.getElementById("display");
  const videoElement = document.createElement("video"); // Add element to display the webcam image.
  display.appendChild(videoElement);
  videoElement.width = 500;
  videoElement.height = 500;
  const webcamIterator = await tf.data.webcam(videoElement); // img is a tensor showing the input webcam image.

  while (true) {
    // const img = await webcamIterator.capture();

    let tensor = tf.browser
      .fromPixels(videoElement)
      .resizeNearestNeighbor([224, 224])
      .toFloat()
      .expandDims();

    // More pre-processing to be added here later

    console.log("Getting predictions...");
    let predictions = await model.predict(tensor).data();
    console.log("Got predictions...");
    let top5 = Array.from(predictions)
      .map(function (p, i) {
        return {
          probability: p,
          className: STATICHANDGESTURE_ENGLISH_CLASSES[i],
        };
      })
      .sort(function (a, b) {
        return b.probability - a.probability;
      })
      .slice(0, 5);

    $("#prediction-list").empty();
    top5.forEach(function (p) {
      $("#prediction-list").append(
        `<li>${p.className}: ${p.probability.toFixed(6)}</li>`
      );
    });
  }
}
webcamLaunch();
