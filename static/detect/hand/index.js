async function webcamLaunch() {
  const display = document.getElementById("display");
  const videoElement = document.createElement("video"); // Add element to display the webcam image.
  display.appendChild(videoElement);
  videoElement.width = 500;
  videoElement.height = 500;
  const webcamIterator = await tf.data.webcam(videoElement);
}
webcamLaunch();
