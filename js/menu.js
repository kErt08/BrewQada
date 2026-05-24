/**
 * Menu page — search is handled by brewqada-shared.js (highlight + filter).
 * Marks best-seller cards on load.
 */
(function () {
  "use strict";

  var BEST = ["brown", "wintermelon", "matcha", "bubble"];

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".menu-card h4, .flavor-item").forEach(function (el) {
      var name = el.textContent.toLowerCase();
      if (BEST.some(function (b) { return name.indexOf(b) !== -1; })) {
        var card = el.closest(".menu-card") || el;
        if (!card.querySelector(".best-badge")) {
          var badge = document.createElement("span");
          badge.className = "best-badge";
          badge.textContent = "Best Seller";
          badge.setAttribute("aria-label", "Best seller");
          if (el.classList.contains("flavor-item")) {
            el.appendChild(document.createTextNode(" "));
            el.appendChild(badge);
          } else {
            card.insertBefore(badge, card.querySelector(".price"));
          }
        }
      }
    });
  });
})();
