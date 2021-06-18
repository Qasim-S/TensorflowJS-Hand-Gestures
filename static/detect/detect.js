var videoElement;
async function webcamLaunch() {
  const display = document.getElementById("display");
  videoElement = document.createElement("video"); // Add element to display the webcam image.
  display.appendChild(videoElement);
  videoElement.width = 500;
  videoElement.height = 500;
  const webcamIterator = await tf.data.webcam(videoElement);
}
webcamLaunch();

async function main() {
  // Pass in a video stream (or an image, canvas, or 3D tensor) to obtain a
  // hand prediction from the MediaPipe graph.
  videoElement.addEventListener(
    "loadeddata",
    async function () {
      // Video is loaded and can be played
      // Load the MediaPipe handpose model assets.
      const model = await handpose.load();
      console.log("model loaded...");

      // Pass in a video stream to the model to obtain
      // a prediction from the MediaPipe graph.
      //   const video = document.querySelector("video");
      const hands = await model.estimateHands(videoElement);
      console.log("hands estimated...");

      // Each hand object contains a `landmarks` property,
      // which is an array of 21 3-D landmarks.
      hands.forEach((hand) => console.log(hand.landmarks));

      //   const predictions = await model.estimateHands(
      //     document.querySelector("video")
      //   );
      //   console.log("Done with predictions....");
      //   if (predictions.length > 0) {
      //     /*
      //       `predictions` is an array of objects describing each detected hand, for example:
      //       [
      //         {
      //           handInViewConfidence: 1, // The probability of a hand being present.
      //           boundingBox: { // The bounding box surrounding the hand.
      //             topLeft: [162.91, -17.42],
      //             bottomRight: [548.56, 368.23],
      //           },
      //           landmarks: [ // The 3D coordinates of each hand landmark.
      //             [472.52, 298.59, 0.00],
      //             [412.80, 315.64, -6.18],
      //             ...
      //           ],
      //           annotations: { // Semantic groupings of the `landmarks` coordinates.
      //             thumb: [
      //               [412.80, 315.64, -6.18]
      //               [350.02, 298.38, -7.14],
      //               ...
      //             ],
      //             ...
      //           }
      //         }
      //       ]
      //       */

      //     for (let i = 0; i < predictions.length; i++) {
      //       const keypoints = predictions[i].landmarks;

      //       // Log hand keypoints.
      //       for (let i = 0; i < keypoints.length; i++) {
      //         const [x, y, z] = keypoints[i];
      //         console.log(`Keypoint ${i}: [${x}, ${y}, ${z}]`);
      //       }
      //     }
      //   }
    },
    false
  );
}
main();
