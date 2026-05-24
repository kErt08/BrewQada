/**
 * Validation & Summary — image lightbox.
 */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var lightbox = document.getElementById("lightbox");
    if (!lightbox) return;

    var img = document.getElementById("lightbox-img");
    var caption = document.getElementById("lightbox-caption");
    var thumbs = document.querySelectorAll(".proof-thumb");

    function openLightbox(thumb) {
      var fullImg = thumb.querySelector("img");
      img.src = fullImg.src;
      img.alt = fullImg.alt;
      caption.textContent = thumb.dataset.caption || fullImg.alt;
      lightbox.hidden = false;
      lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      lightbox.querySelector(".lightbox__close").focus();
    }

    function closeLightbox() {
      lightbox.hidden = true;
      lightbox.setAttribute("aria-hidden", "true");
      img.src = "";
      document.body.style.overflow = "";
    }

    thumbs.forEach(function (thumb) {
      thumb.addEventListener("click", function () {
        openLightbox(thumb);
      });
    });

    lightbox.querySelector(".lightbox__backdrop").addEventListener("click", closeLightbox);
    lightbox.querySelector(".lightbox__close").addEventListener("click", closeLightbox);

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !lightbox.hidden) closeLightbox();
    });
  });
})();
