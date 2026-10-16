(function () {
  "use strict";

  document.documentElement.classList.add("js");

  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  var toggle = document.getElementById("navToggle");
  var links = document.getElementById("navLinks");
  var navAnchors = links ? Array.prototype.slice.call(links.querySelectorAll("a")) : [];
  var inertTargets = [
    document.querySelector(".hero"),
    document.getElementById("hovedinnhold"),
    document.querySelector("footer")
  ].filter(Boolean);

  function menuOpen() {
    return toggle && toggle.getAttribute("aria-expanded") === "true";
  }

  function setOpen(open) {
    if (!toggle || !links) return;
    links.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Lukk meny" : "Åpne meny");
    document.body.classList.toggle("nav-open", open);
    inertTargets.forEach(function (el) {
      el.inert = open;
    });
  }

  if (toggle) {
    toggle.addEventListener("click", function () {
      setOpen(!menuOpen());
    });
  }

  var backdrop = document.getElementById("navBackdrop");
  if (backdrop) {
    backdrop.addEventListener("click", function () {
      setOpen(false);
      if (toggle) toggle.focus();
    });
  }

  navAnchors.forEach(function (anchor) {
    anchor.addEventListener("click", function () {
      setOpen(false);
    });
  });

  document.addEventListener("keydown", function (event) {
    if (!menuOpen()) return;
    if (event.key === "Escape") {
      setOpen(false);
      toggle.focus();
      return;
    }
    if (event.key !== "Tab") return;
    var focusable = [toggle].concat(navAnchors);
    var index = focusable.indexOf(document.activeElement);
    if (index === -1) return;
    event.preventDefault();
    var next = event.shiftKey ? index - 1 : index + 1;
    if (next < 0) next = focusable.length - 1;
    if (next >= focusable.length) next = 0;
    focusable[next].focus();
  });

  document.addEventListener("click", function (event) {
    if (!menuOpen()) return;
    if (toggle.contains(event.target) || links.contains(event.target)) return;
    setOpen(false);
  });

  var navBreakpoint = parseInt(document.body.getAttribute("data-nav-breakpoint") || "769", 10);
  var desktop = window.matchMedia("(min-width: " + navBreakpoint + "px)");
  function closeIfDesktop() {
    if (desktop.matches) setOpen(false);
  }
  if (desktop.addEventListener) desktop.addEventListener("change", closeIfDesktop);
  else if (desktop.addListener) desktop.addListener(closeIfDesktop);

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealEls = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function (el) { observer.observe(el); });
  }

  var sectionIds = ["tjenester", "priser", "galleri", "om", "kontakt"];
  function updateCurrent() {
    var marker = window.scrollY + 96;
    var current = "";
    var best = -1;
    sectionIds.forEach(function (id) {
      var section = document.getElementById(id);
      if (!section || section.offsetTop > marker || section.offsetTop < best) return;
      best = section.offsetTop;
      current = id;
    });
  navAnchors.forEach(function (anchor) {
    var href = anchor.getAttribute("href") || "";
    if (href.charAt(0) !== "#") return;
    var id = href.slice(1);
    if (id && id === current) anchor.setAttribute("aria-current", "true");
    else anchor.removeAttribute("aria-current");
  });
  }

  var ticking = false;
  window.addEventListener("scroll", function () {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      updateCurrent();
      ticking = false;
    });
  }, { passive: true });
  updateCurrent();

  var marqueeBtn = document.getElementById("marqueeToggle");
  var track = document.getElementById("marqueeTrack");
  if (marqueeBtn && track) {
    marqueeBtn.addEventListener("click", function () {
      var paused = track.classList.toggle("is-paused");
      marqueeBtn.setAttribute("aria-pressed", paused ? "true" : "false");
      marqueeBtn.setAttribute("aria-label", paused ? "Spill av bildeløpet" : "Pause bildeløpet");
    });
  }
})();
