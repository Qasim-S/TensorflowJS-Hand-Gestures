async function webcamLaunch() {
  const display = document.getElementById("display");
  const videoElement = document.createElement("video"); // Add element to display the webcam image.
  display.appendChild(videoElement);
  videoElement.width = 500;
  videoElement.height = 500;
  const webcamIterator = await tf.data.webcam(videoElement);
}
webcamLaunch();

(async function () {
  // Load the MediaPipe handpose model assets.
  const model = await handpose.load();

  // Pass in a video stream to the model to obtain
  // a prediction from the MediaPipe graph.
  const video = document.querySelector("video");
  const hands = await model.estimateHands(video);

  // Each hand object contains a `landmarks` property,
  // which is an array of 21 3-D landmarks.
  hands.forEach((hand) => console.log(hand.landmarks));
})();
