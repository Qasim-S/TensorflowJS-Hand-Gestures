$(document).ready(function () {
  $("a").on("click", function (event) {
    if (this.hash !== "") {
      event.preventDefault();
      var hash = this.hash;
      $("html, body").animate(
        {
          scrollTop: $(hash).offset().top,
        },
        350,
        function () {
          window.location.hash = hash;
        }
      );
    }
  });
});

function englishModel() {
  $("#section2").css("background-color", "green");
}

function urduModel() {
  $("#section2").css("background-color", "purple");
}

function numberModel() {
  $("#section2").css("background-color", "blue");
}
