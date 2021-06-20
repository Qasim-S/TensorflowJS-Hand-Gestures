const display = document.getElementById("display");
const video = document.getElementById("webcam");

// Check if webcam access is supported.
function getUserMediaSupported() {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}

if (getUserMediaSupported()) {
  enableCam();
} else {
  console.warn("getUserMedia() is not supported by your browser");
}

function enableCam() {
  // getUsermedia parameters to force video but not audio.
  const constraints = {
    video: true,
  };
  // Activate the webcam stream.
  navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
    video.srcObject = stream;
  });
}

var children = [];

randomDivGenerator = () => {
  for (let i = 0; i < children.length; i++) {
    display.removeChild(children[i]);
  }
  children.splice(0);

  let left = Math.floor(Math.random() * 700);
  let top = Math.floor(Math.random() * 700);
  let width = Math.floor(Math.random() * 700);
  let height = Math.floor(Math.random() * 700);

  const newDiv = document.createElement("div");
  newDiv.setAttribute("class", "highlighter");
  newDiv.style = `left: ${left}; top: ${top}px; width: ${width}px; height: ${height}px;`;

  display.appendChild(newDiv);
  children.push(newDiv);
};

setInterval(randomDivGenerator, 3000);
