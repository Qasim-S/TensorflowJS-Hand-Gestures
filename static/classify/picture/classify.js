$("#image-selector").change(function () {
  let reader = new FileReader();
  reader.onload = function () {
    let dataURL = reader.result;
    $("#selected-image").attr("src", dataURL);
    $("#prediction-list").empty();
  };
  let file = $("#image-selector").prop("files")[0];
  reader.readAsDataURL(file);
});

$(function () {
  console.log("Ready");
});

(async function () {
  model = await tf.loadGraphModel(
    "http://localhost:81/tfjs-models/EfficientNetB0/model.json"
  );
  $(".progress-bar").hide();
})();

$("#predict-button").click(async function () {
  let image = $("#selected-image").get(0);
  let tensor = tf.browser
    .fromPixels(image)
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
});
