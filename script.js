/* =========================================================
   PAPAFIT 4.0 — interactions
   ========================================================= */
(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Année du footer ---------- */
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  /* ---------- Nav : état au scroll ---------- */
  var nav = document.getElementById("nav");
  var totop = document.getElementById("totop");
  var onScroll = function () {
    var y = window.scrollY || window.pageYOffset;
    if (nav) nav.classList.toggle("is-stuck", y > 24);
    if (totop) totop.classList.toggle("is-on", y > 700);
    activeLink();
  };
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Lien actif ---------- */
  var sections = Array.prototype.slice.call(
    document.querySelectorAll("main section[id]")
  );
  var navLinks = Array.prototype.slice.call(
    document.querySelectorAll(".nav__links a")
  );
  function activeLink() {
    if (!sections.length) return;
    var mid = (window.scrollY || 0) + window.innerHeight * 0.34;
    var current = "";
    sections.forEach(function (s) {
      if (s.offsetTop <= mid) current = s.id;
    });
    navLinks.forEach(function (a) {
      a.classList.toggle("is-active", a.getAttribute("href") === "#" + current);
    });
  }

  /* ---------- Menu mobile ---------- */
  var burger = document.getElementById("burger");
  var menu = document.getElementById("menu");
  var closeTimer = null;
  function setMenu(open) {
    if (!burger || !menu) return;
    if (closeTimer) {
      window.clearTimeout(closeTimer);
      closeTimer = null;
    }
    burger.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", open ? "true" : "false");
    burger.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
    document.body.style.overflow = open ? "hidden" : "";
    if (open) {
      menu.hidden = false;
      requestAnimationFrame(function () {
        menu.classList.add("is-open");
        Array.prototype.forEach.call(menu.querySelectorAll("a"), function (a, i) {
          a.style.transitionDelay = i * 55 + "ms";
        });
      });
    } else {
      menu.classList.remove("is-open");
      closeTimer = window.setTimeout(function () {
        menu.hidden = true;
        closeTimer = null;
      }, 320);
    }
  }
  if (burger && menu) {
    burger.addEventListener("click", function () {
      setMenu(!menu.classList.contains("is-open"));
    });
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) setMenu(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu.classList.contains("is-open")) setMenu(false);
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 1080 && menu.classList.contains("is-open")) setMenu(false);
    });
  }

  /* ---------- Reveal au scroll ---------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  if (reduce || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ---------- FAQ : une seule réponse ouverte à la fois ---------- */
  var qas = Array.prototype.slice.call(document.querySelectorAll(".qa"));
  qas.forEach(function (d) {
    d.addEventListener("toggle", function () {
      if (d.open) {
        qas.forEach(function (o) {
          if (o !== d) o.open = false;
        });
      }
    });
  });

  onScroll();
})();
