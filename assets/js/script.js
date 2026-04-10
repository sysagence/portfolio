(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /** Web3Forms — messages go to the inbox set on web3forms.com for this key */
  var WEB3FORMS_ACCESS_KEY = "654df22c-6aa2-4ab6-b0cc-380e79c10c26";

  /* ---------- Loader ---------- */
  function initLoader() {
    var loader = document.getElementById("loader");
    if (!loader) return;

    var minMs = 900;
    var start = Date.now();

    function hide() {
      var elapsed = Date.now() - start;
      var wait = Math.max(0, minMs - elapsed);
      setTimeout(function () {
        loader.classList.add("is-hidden");
        loader.setAttribute("aria-busy", "false");
        document.body.style.overflow = "";
      }, wait);
    }

    if (document.readyState === "complete") {
      hide();
    } else {
      window.addEventListener("load", hide);
    }
  }

  /* ---------- Floating particles ---------- */
  function initParticles() {
    if (prefersReducedMotion) return;
    var container = document.getElementById("particles");
    if (!container) return;

    var count = Math.min(42, Math.floor((window.innerWidth / 80) * 5));
    var frag = document.createDocumentFragment();

    for (var i = 0; i < count; i++) {
      var p = document.createElement("div");
      p.className = "particle";
      p.style.left = Math.random() * 100 + "%";
      p.style.animationDuration = 12 + Math.random() * 18 + "s";
      p.style.animationDelay = -Math.random() * 20 + "s";
      frag.appendChild(p);
    }
    container.appendChild(frag);
  }

  /* ---------- Mobile menu ---------- */
  function initNav() {
    var toggle = document.getElementById("navToggle");
    var menu = document.getElementById("navMenu");
    var backdrop = document.getElementById("navBackdrop");
    var links = menu ? menu.querySelectorAll(".nav__link") : [];

    function closeMenu() {
      if (!toggle || !menu) return;
      toggle.classList.remove("is-active");
      menu.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
      document.body.classList.remove("menu-open");
      if (backdrop) {
        backdrop.classList.remove("is-open");
        backdrop.setAttribute("aria-hidden", "true");
      }
    }

    function openMenu() {
      if (!toggle || !menu) return;
      toggle.classList.add("is-active");
      menu.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "Close menu");
      document.body.classList.add("menu-open");
      if (backdrop) {
        backdrop.classList.add("is-open");
        backdrop.setAttribute("aria-hidden", "false");
      }
    }

    if (backdrop) {
      backdrop.addEventListener("click", closeMenu);
    }

    /* Close on any outside tap (backup if backdrop hit-testing fails) */
    document.addEventListener(
      "click",
      function (e) {
        if (window.innerWidth > 900 || !menu || !toggle || !menu.classList.contains("is-open")) return;
        var t = e.target;
        if (menu.contains(t) || toggle.contains(t)) return;
        closeMenu();
      },
      true
    );

    if (toggle && menu) {
      toggle.addEventListener("click", function () {
        if (menu.classList.contains("is-open")) {
          closeMenu();
        } else {
          openMenu();
        }
      });
    }

    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener("click", function () {
        if (window.innerWidth <= 900) closeMenu();
      });
    }

    window.addEventListener("resize", function () {
      if (window.innerWidth > 900) closeMenu();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu && menu.classList.contains("is-open")) {
        closeMenu();
        if (toggle) toggle.focus();
      }
    });
  }

  /* ---------- Navbar active link (scroll spy) ---------- */
  function initNavScrollSpy() {
    var sectionIds = ["home", "about", "skills", "services", "projects", "team", "contact"];
    var links = document.querySelectorAll("#navMenu a.nav__link");
    if (!links.length) return;

    function headerOffset() {
      var h = document.getElementById("header");
      if (!h) return 96;
      return h.getBoundingClientRect().height + 40;
    }

    function update() {
      var pos = window.scrollY + headerOffset();
      var current = "home";
      for (var i = 0; i < sectionIds.length; i++) {
        var el = document.getElementById(sectionIds[i]);
        if (!el) continue;
        var top = el.getBoundingClientRect().top + window.scrollY;
        if (pos >= top) current = sectionIds[i];
      }
      for (var j = 0; j < links.length; j++) {
        var a = links[j];
        var href = a.getAttribute("href") || "";
        var on = href === "#" + current;
        a.classList.toggle("is-active", on);
        if (on) a.setAttribute("aria-current", "location");
        else a.removeAttribute("aria-current");
      }
    }

    var ticking = false;
    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(function () {
          update();
          ticking = false;
        });
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();
  }

  /* ---------- Smooth scroll for anchor links (respects reduced motion) ---------- */
  function initSmoothScroll() {
    document.addEventListener("click", function (e) {
      var t = e.target;
      while (t && t.nodeName !== "A") t = t.parentNode;
      if (!t || t.nodeName !== "A") return;
      var href = t.getAttribute("href");
      if (!href || href.charAt(0) !== "#" || href === "#") return;
      var id = href.slice(1);
      var el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      if (prefersReducedMotion) {
        el.scrollIntoView();
      } else {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }

  /* ---------- Scroll reveal ---------- */
  function initReveal() {
    var nodes = document.querySelectorAll(".reveal");
    if (!nodes.length) return;

    if (prefersReducedMotion) {
      for (var i = 0; i < nodes.length; i++) {
        nodes[i].classList.add("is-visible");
      }
      return;
    }

    var io = new IntersectionObserver(
      function (entries) {
        for (var j = 0; j < entries.length; j++) {
          if (entries[j].isIntersecting) {
            entries[j].target.classList.add("is-visible");
            io.unobserve(entries[j].target);
          }
        }
      },
      { root: null, rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    for (var k = 0; k < nodes.length; k++) {
      io.observe(nodes[k]);
    }
  }

  /* ---------- Animated counters ---------- */
  function animateNumber(el, from, to, durationMs, format) {
    if (prefersReducedMotion) {
      el.textContent = format(to);
      return;
    }
    var start = performance.now();
    function frame(now) {
      var t = Math.min(1, (now - start) / durationMs);
      var eased = 1 - Math.pow(1 - t, 3);
      var val = from + (to - from) * eased;
      el.textContent = format(val);
      if (t < 1) requestAnimationFrame(frame);
      else el.textContent = format(to);
    }
    requestAnimationFrame(frame);
  }

  function initCounters() {
    var stats = document.querySelectorAll(".stats .stat");
    if (!stats.length) return;

    var triggered = false;

    function run() {
      if (triggered) return;
      triggered = true;
      for (var i = 0; i < stats.length; i++) {
        (function (stat) {
          var valEl = stat.querySelector(".stat__value");
          if (!valEl) return;
          var target = parseInt(valEl.getAttribute("data-target"), 10);
          if (isNaN(target)) return;
          animateNumber(valEl, 0, target, 1800, function (n) {
            return String(Math.round(n));
          });
        })(stats[i]);
      }
    }

    if (prefersReducedMotion) {
      run();
      return;
    }

    var wrap = document.querySelector(".stats");
    if (!wrap) return;
    var io = new IntersectionObserver(
      function (entries) {
        if (entries[0] && entries[0].isIntersecting) {
          run();
          io.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    io.observe(wrap);
  }

  /* ---------- Projects marquee: auto-scroll + drag, resume on release ---------- */
  function initProjectsMarquee() {
    if (prefersReducedMotion) return;

    var marquee = document.querySelector(".projects-marquee");
    var viewport = marquee && marquee.querySelector(".projects-marquee__viewport");
    var track = marquee && marquee.querySelector(".projects-marquee__track");
    if (!marquee || !viewport || !track) return;

    var CYCLE_MS = 52000;
    var segmentWidth = 0;
    var x = 0;
    var lastNow = performance.now();
    var dragging = false;
    var dragStartClientX = 0;
    var dragStartX = 0;
    var dragMoved = false;
    var blockNextClick = false;
    var rafId = 0;
    var initialized = false;

    track.classList.add("projects-marquee__track--js");
    marquee.classList.add("projects-marquee--interactive");

    function measure() {
      var sw = track.scrollWidth / 2;
      if (sw <= 0) return false;
      segmentWidth = sw;
      return true;
    }

    function normalizeX() {
      if (segmentWidth <= 0) return;
      while (x >= 0) x -= segmentWidth;
      while (x < -segmentWidth) x += segmentWidth;
    }

    function applyTransform() {
      track.style.transform = "translateX(" + x + "px)";
    }

    function onMeasure() {
      var hadSize = segmentWidth > 0;
      if (!measure()) return;
      if (!initialized) {
        x = -segmentWidth;
        initialized = true;
      } else if (hadSize) {
        normalizeX();
      }
      applyTransform();
      if (!rafId) startLoop();
    }

    function startLoop() {
      if (rafId) return;
      lastNow = performance.now();
      rafId = requestAnimationFrame(loop);
    }

    function loop(now) {
      rafId = requestAnimationFrame(loop);
      if (segmentWidth <= 0) return;
      var dt = Math.min(64, now - lastNow);
      lastNow = now;
      /* No :hover pause — after drag the cursor often stays over the strip and would block auto-scroll */
      var pause =
        dragging || (document.activeElement && marquee.contains(document.activeElement));
      if (!pause) {
        x += (segmentWidth / CYCLE_MS) * dt;
        if (x >= 0) x -= segmentWidth;
      }
      applyTransform();
    }

    var ro = new ResizeObserver(onMeasure);
    ro.observe(track);
    onMeasure();

    viewport.addEventListener(
      "pointerdown",
      function (e) {
        if (e.button !== 0 && e.button !== undefined) return;
        blockNextClick = false;
        dragging = true;
        dragMoved = false;
        marquee.classList.add("is-dragging");
        dragStartClientX = e.clientX;
        dragStartX = x;
        try {
          viewport.setPointerCapture(e.pointerId);
        } catch (ignore) {}
      },
      { passive: true }
    );

    viewport.addEventListener(
      "pointermove",
      function (e) {
        if (!dragging || segmentWidth <= 0) return;
        var dx = e.clientX - dragStartClientX;
        if (Math.abs(dx) > 6) dragMoved = true;
        x = dragStartX + dx;
      },
      { passive: true }
    );

    function endDrag(e) {
      if (!dragging) return;
      dragging = false;
      marquee.classList.remove("is-dragging");
      if (e && e.pointerId != null) {
        try {
          viewport.releasePointerCapture(e.pointerId);
        } catch (ignore) {}
      }
      normalizeX();
      applyTransform();
      if (dragMoved) blockNextClick = true;
    }

    viewport.addEventListener("pointerup", endDrag);
    viewport.addEventListener("pointercancel", endDrag);
    viewport.addEventListener("lostpointercapture", function () {
      if (!dragging) return;
      dragging = false;
      marquee.classList.remove("is-dragging");
      normalizeX();
      applyTransform();
      if (dragMoved) blockNextClick = true;
    });

    viewport.addEventListener(
      "click",
      function (e) {
        if (!blockNextClick) return;
        var t = e.target;
        while (t && t !== viewport) {
          if (t.nodeName === "A") {
            e.preventDefault();
            e.stopPropagation();
            break;
          }
          t = t.parentNode;
        }
        blockNextClick = false;
        dragMoved = false;
      },
      true
    );
  }

  /* ---------- Footer year ---------- */
  function initYear() {
    var y = document.getElementById("year");
    if (y) y.textContent = String(new Date().getFullYear());
  }

  /* ---------- Contact → sys.agence@gmail.com via Web3Forms (reliable delivery) ---------- */
  function initForm() {
    var form = document.getElementById("contactForm");
    if (!form) return;

    var feedback = document.getElementById("contactFormFeedback");

    function setFeedback(text, kind) {
      if (!feedback) return;
      feedback.textContent = text || "";
      feedback.classList.remove("is-error", "is-ok");
      if (kind === "error") feedback.classList.add("is-error");
      if (kind === "ok") feedback.classList.add("is-ok");
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      var nameEl = form.querySelector('[name="name"]');
      var emailEl = form.querySelector('[name="email"]');
      var msgEl = form.querySelector('[name="message"]');
      var name = nameEl ? nameEl.value.trim() : "";
      var email = emailEl ? emailEl.value.trim() : "";
      var message = msgEl ? msgEl.value.trim() : "";
      var btn = form.querySelector('button[type="submit"]');
      var orig = btn ? btn.textContent : "";

      function setBtn(text, disabled) {
        if (!btn) return;
        btn.textContent = text;
        btn.disabled = !!disabled;
      }

      function resetBtn() {
        setBtn(orig, false);
      }

      setFeedback("", null);

      var key =
        (WEB3FORMS_ACCESS_KEY || "").trim() ||
        (form.getAttribute("data-web3forms-key") || "").trim();

      if (!key) {
        setFeedback(
          "Paste your Web3Forms Access Key in script.js (WEB3FORMS_ACCESS_KEY) or in the form tag (data-web3forms-key). Create it free at web3forms.com with inbox sys.agence@gmail.com.",
          "error"
        );
        setBtn("Add access key first", false);
        return;
      }

      setBtn("Sending…", true);

      var formData = new FormData(form);
      formData.append("access_key", key);
      formData.append("subject", "SYS Digital — " + name);

      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      })
        .then(function (res) {
          return res.text().then(function (text) {
            var data = {};
            try {
              data = text ? JSON.parse(text) : {};
            } catch (ignore) {
              data = {};
            }
            return { ok: res.ok, data: data };
          });
        })
        .then(function (result) {
          var data = result.data;
          if (result.ok && data && data.success === true) {
            form.reset();
            setFeedback("Sent — check sys.agence@gmail.com (and Spam if needed).", "ok");
            setBtn("Message sent", true);
            setTimeout(function () {
              resetBtn();
              setFeedback("", null);
            }, 6000);
          } else {
            var errMsg =
              (data && (data.message || data.error)) ||
              "Send failed. Check the access key and try again.";
            setFeedback(String(errMsg), "error");
            setBtn("Couldn’t send", false);
            setTimeout(function () {
              resetBtn();
              setFeedback("", null);
            }, 14000);
          }
        })
        .catch(function () {
          setFeedback(
            "Network error — use http://localhost/… (not file://) or check your connection.",
            "error"
          );
          setBtn("Couldn’t send", false);
          setTimeout(function () {
            resetBtn();
            setFeedback("", null);
          }, 12000);
        });
    });
  }

  /* ---------- Boot ---------- */
  document.body.style.overflow = "hidden";
  initLoader();
  initParticles();
  initNav();
  initNavScrollSpy();
  initSmoothScroll();
  initReveal();
  initCounters();
  initProjectsMarquee();
  initYear();
  initForm();
})();
