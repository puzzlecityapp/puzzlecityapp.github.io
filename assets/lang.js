// Picks the page language: ?lang=tr|en, then the last choice, then the
// browser (Turkish → tr, anything else → en, like the app).
(function () {
  var root = document.documentElement;

  function stored() {
    try { return localStorage.getItem("lang"); } catch (e) { return null; }
  }

  function remember(lang) {
    try { localStorage.setItem("lang", lang); } catch (e) { /* private mode */ }
  }

  function apply(lang) {
    root.setAttribute("data-lang", lang);
    root.setAttribute("lang", lang);
    var buttons = document.querySelectorAll("[data-set-lang]");
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].setAttribute(
        "aria-pressed",
        String(buttons[i].getAttribute("data-set-lang") === lang)
      );
    }
    var title = root.getAttribute("data-title-" + lang);
    if (title) document.title = title;
  }

  var asked = new URLSearchParams(location.search).get("lang");
  var browser = (navigator.language || "").toLowerCase().indexOf("tr") === 0 ? "tr" : "en";
  var lang = asked === "tr" || asked === "en" ? asked : stored() || browser;
  apply(lang);

  document.addEventListener("DOMContentLoaded", function () {
    apply(root.getAttribute("data-lang"));
    var buttons = document.querySelectorAll("[data-set-lang]");
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener("click", function (event) {
        var chosen = event.currentTarget.getAttribute("data-set-lang");
        remember(chosen);
        apply(chosen);
      });
    }
  });
})();
