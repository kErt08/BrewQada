/**
 * BrewQada — shared UI: search highlight, AI bot, exit, page animations.
 */
(function () {
  "use strict";

  function initPageAnimations() {
    document.body.classList.add("page-ready");
    var main = document.querySelector(".main");
    if (!main) return;
    var target =
      main.querySelector(".dashboard") ||
      main.querySelector(".dash-page") ||
      main.querySelector(".menu-page") ||
      main.querySelector(".owner-page") ||
      main.querySelector(".val-page");
    if (target) target.classList.add("main-content-animate");
  }

  function escapeRegex(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function highlightTextInNode(node, query) {
    if (node.nodeType === Node.TEXT_NODE) {
      var text = node.textContent;
      var re = new RegExp("(" + escapeRegex(query) + ")", "gi");
      if (!re.test(text)) return false;
      re.lastIndex = 0;
      var frag = document.createDocumentFragment();
      var parts = text.split(re);
      parts.forEach(function (part, i) {
        if (i % 2 === 1) {
          var mark = document.createElement("mark");
          mark.className = "search-hit";
          mark.textContent = part;
          frag.appendChild(mark);
        } else if (part) {
          frag.appendChild(document.createTextNode(part));
        }
      });
      node.parentNode.replaceChild(frag, node);
      return true;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return false;
    if (node.tagName === "SCRIPT" || node.tagName === "STYLE" || node.tagName === "MARK") return false;
    var children = Array.prototype.slice.call(node.childNodes);
    var hit = false;
    children.forEach(function (child) {
      if (highlightTextInNode(child, query)) hit = true;
    });
    return hit;
  }

  function clearHighlights(root) {
    root.querySelectorAll("mark.search-hit").forEach(function (mark) {
      var parent = mark.parentNode;
      parent.replaceChild(document.createTextNode(mark.textContent), mark);
      parent.normalize();
    });
  }

  function getSearchableRoot() {
    var main = document.querySelector(".main");
    if (!main) return null;
    return (
      main.querySelector(".dashboard") ||
      main.querySelector(".dash-page") ||
      main.querySelector(".menu-page") ||
      main.querySelector(".owner-page") ||
      main.querySelector(".val-page") ||
      main
    );
  }

  function initSearch() {
    var input = document.querySelector(".search-input");
    if (!input) return;

    var noResultsEl = null;
    var debounce;

    function runSearch() {
      var q = input.value.trim();
      var root = getSearchableRoot();
      if (!root) return;

      clearHighlights(root);
      if (noResultsEl && noResultsEl.parentNode) noResultsEl.remove();
      noResultsEl = null;

      document.querySelectorAll(".flavor-item, .menu-card").forEach(function (el) {
        el.style.display = "";
      });
      document.querySelectorAll(".menu-category").forEach(function (cat) {
        cat.style.display = "";
      });

      if (!q) return;

      var lower = q.toLowerCase();
      var anyHit = false;

      if (root.classList.contains("menu-page")) {
        document.querySelectorAll(".flavor-item, .menu-card").forEach(function (el) {
          var match = el.textContent.toLowerCase().indexOf(lower) !== -1;
          el.style.display = match ? "" : "none";
          if (match) anyHit = true;
        });
        document.querySelectorAll(".menu-category").forEach(function (cat) {
          var visible = cat.querySelectorAll('.flavor-item:not([style*="none"])').length;
          cat.style.display = visible ? "" : "none";
        });
      } else {
        var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
        var textNodes = [];
        while (walker.nextNode()) textNodes.push(walker.currentNode);
        textNodes.forEach(function (node) {
          if (node.textContent.toLowerCase().indexOf(lower) !== -1) {
            highlightTextInNode(node, q);
            anyHit = true;
          }
        });
      }

      if (!anyHit) {
        noResultsEl = document.createElement("p");
        noResultsEl.className = "search-no-results";
        noResultsEl.textContent = 'No matches for "' + q + '" on this page.';
        root.prepend(noResultsEl);
      }
    }

    input.addEventListener("input", function () {
      clearTimeout(debounce);
      debounce = setTimeout(runSearch, 200);
    });
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        runSearch();
      }
    });
  }

  function normalize(s) {
    return s.toLowerCase().replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();
  }

  function botReply(question) {
    var q = normalize(question);
    var d = typeof BrewQadaData !== "undefined" ? BrewQadaData : {};

    if (!q) return "Ask me about BrewQada — menu, best sellers, owners, location, or the proposed system.";

    if (/best.?seller|popular|top|bestseller/.test(q)) {
      var list = (d.bestSellers || [])
        .map(function (b, i) {
          return i + 1 + ". **" + b.name + "** — " + b.reason;
        })
        .join("\n");
      return "Our best sellers:\n" + list;
    }

    if (/recommend|suggest|what should|try/.test(q)) {
      return (d.recommendations || [])
        .map(function (r) {
          return "• **" + r.for + ":** " + r.drink;
        })
        .join("\n");
    }

    if (/promo|b1t1|buy.?one|2.?for|two.?drink/.test(q)) {
      var pr = d.pricing || {};
      return (
        "**Promo (2 drinks):** Add **₱" + (pr.promoAdd || 30) + "** to your chosen size — same flavor, **2 drinks**.\n" +
        "• Small: ₱" + (pr.small || 39) + " + ₱" + (pr.promoAdd || 30) + " = **₱" + (pr.promoSmall || 69) + "**\n" +
        "• Medium: ₱" + (pr.medium || 59) + " + ₱" + (pr.promoAdd || 30) + " = **₱" + (pr.promoMedium || 89) + "**\n" +
        "• Large: ₱" + (pr.large || 69) + " + ₱" + (pr.promoAdd || 30) + " = **₱" + (pr.promoLarge || 99) + "**"
      );
    }

    if (/menu|price|flavor|milktea|coffee|frappe|yogurt|drink|size|small|medium|large/.test(q)) {
      var p = d.pricing || {};
      return (
        "**Pricing (all standard drinks):**\n" +
        "• **Small:** ₱" + (p.small || 39) + " (base)\n" +
        "• **Medium:** ₱" + (p.medium || 59) + " (base + ₱" + (p.mediumAdd || 20) + ")\n" +
        "• **Large:** ₱" + (p.large || 69) + " (base + ₱" + (p.largeAdd || 30) + ")\n" +
        "• **Promo (2 drinks):** +₱" + (p.promoAdd || 30) + " on size → S **₱" + (p.promoSmall || 69) + "**, M **₱" + (p.promoMedium || 89) + "**, L **₱" + (p.promoLarge || 99) + "**\n\n" +
        (p.summary || "") + "\n\nCategories: Milktea, Yogurt, Ice Latte, Fruit Tea, Fruit Soda, Frappe, Iced Coffee."
      );
    }

    if (/owner|jayson|anna|quintanar|pacis|employee|personnel/.test(q)) {
      return (
        "**Owners & daily staff:** Jayson D. Quintanar and Anna Janella H. Pacis — they manage and run operations. " +
        "Contact: iorijhayquintanar@gmail.com (primary representative)."
      );
    }

    if (/location|address|marikina|where/.test(q)) {
      return "**Location:** 35 Gen. B. G. Molina, Marikina, Metro Manila.";
    }

    if (/mission|vision|about|brewqada|what is/.test(q)) {
      return (
        "**BrewQada** is a budget-friendly milk tea and coffee shop (est. March 2026). " +
        "Mission: " + (d.business && d.business.mission) + " Vision: " + (d.business && d.business.vision)
      );
    }

    if (/system|manual|excel|paper|problem|transaction|70|pay.first|process/.test(q)) {
      var s = d.system || {};
      return (
        "**Current system:** " + s.current + ". Tools: " + (s.tools || []).join(", ") + ". " +
        "**Volume:** ~" + s.volume + " transactions/day (manual). **Main problem:** " + s.problem + " " +
        "**Beneficiaries:** Owners get less manual work with pay-first; customers get faster service."
      );
    }

    if (/privacy|data|customer info/.test(q)) {
      return "The system collects **no customer personal data** — admin-only, in-store use.";
    }

    if (/validation|endorsement|proof/.test(q)) {
      return "See **Validation & Summary** for the client endorsement letter and on-site interview documentation.";
    }

    if (/earn|revenue|income/.test(q)) {
      return "**Average earnings:** " + (d.business && d.business.earnings) + ".";
    }

    return (
      "I can only answer about **BrewQada** — try: best sellers, menu prices, recommendations, owners, location, or manual system problems."
    );
  }

  function formatBotText(text) {
    return text
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\n/g, "<br>");
  }

  function initAiBot() {
    var toggle = document.querySelector(".ai-bot-toggle");
    var panel = document.getElementById("ai-bot-panel");
    if (!toggle || !panel) return;

    var messages = panel.querySelector(".ai-bot-messages");
    var form = panel.querySelector(".ai-bot-form");
    var input = panel.querySelector(".ai-bot-input");

    function addMsg(text, who) {
      var div = document.createElement("div");
      div.className = "ai-bot-msg ai-bot-msg--" + who;
      if (who === "bot") div.innerHTML = formatBotText(text);
      else div.textContent = text;
      messages.appendChild(div);
      messages.scrollTop = messages.scrollHeight;
    }

    function ask(q) {
      addMsg(q, "user");
      setTimeout(function () {
        addMsg(botReply(q), "bot");
      }, 280);
    }

    toggle.addEventListener("click", function () {
      panel.classList.toggle("is-open");
      if (panel.classList.contains("is-open") && messages.children.length === 0) {
        addMsg(
          "Hi! I'm the BrewQada assistant. Ask about our drinks, best sellers, owners, location, or the manual-to-digital system.",
          "bot"
        );
      }
    });

    panel.querySelector(".ai-bot-panel__close").addEventListener("click", function () {
      panel.classList.remove("is-open");
    });

    panel.querySelectorAll(".ai-bot-chip").forEach(function (chip) {
      chip.addEventListener("click", function () {
        ask(chip.textContent);
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var val = input.value.trim();
      if (!val) return;
      input.value = "";
      ask(val);
    });
  }

  function initExit() {
    document.querySelectorAll(".footer-link--exit").forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (confirm("Exit BrewQada admin? You will return to the welcome screen.")) {
          window.location.href = "index.html";
        }
      });
    });
  }

  function injectAiBotMarkup() {
    if (document.getElementById("ai-bot-panel")) return;

    var panel = document.createElement("aside");
    panel.id = "ai-bot-panel";
    panel.className = "ai-bot-panel";
    panel.setAttribute("aria-label", "BrewQada AI assistant");
    panel.innerHTML =
      '<div class="ai-bot-panel__head">' +
      '<h2><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7v1h-2l2 5H5l2-5H5v-1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"/></svg> BrewQada AI</h2>' +
      '<button type="button" class="ai-bot-panel__close" aria-label="Close assistant"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg></button>' +
      "</div>" +
      '<div class="ai-bot-messages"></div>' +
      '<div class="ai-bot-chips">' +
      '<button type="button" class="ai-bot-chip">Best sellers</button>' +
      '<button type="button" class="ai-bot-chip">Recommend a drink</button>' +
      '<button type="button" class="ai-bot-chip">Menu prices</button>' +
      '<button type="button" class="ai-bot-chip">Promo (2 drinks)</button>' +
      '<button type="button" class="ai-bot-chip">System problems</button>' +
      "</div>" +
      '<form class="ai-bot-form">' +
      '<input type="text" class="ai-bot-input" placeholder="Ask about BrewQada..." autocomplete="off" />' +
      "<button type=\"submit\">Send</button>" +
      "</form>";
    document.body.appendChild(panel);
  }

  function initMobileNav() {
    var app = document.querySelector(".app");
    var sidebar = document.querySelector(".sidebar");
    var header = document.querySelector(".top-header");
    if (!app || !sidebar || !header || document.querySelector(".mobile-nav-toggle")) return;

    var backdrop = document.createElement("button");
    backdrop.type = "button";
    backdrop.className = "sidebar-backdrop";
    backdrop.setAttribute("aria-label", "Close menu");
    app.insertBefore(backdrop, app.firstChild);

    var toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "mobile-nav-toggle";
    toggle.setAttribute("aria-label", "Open menu");
    toggle.setAttribute("aria-expanded", "false");
    toggle.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">' +
      '<path d="M4 6h16M4 12h16M4 18h16"/>' +
      "</svg>";
    header.insertBefore(toggle, header.firstChild);

    function setOpen(open) {
      document.body.classList.toggle("nav-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    }

    function closeNav() {
      setOpen(false);
    }

    toggle.addEventListener("click", function () {
      setOpen(!document.body.classList.contains("nav-open"));
    });

    backdrop.addEventListener("click", closeNav);

    sidebar.querySelectorAll(".nav-item--link").forEach(function (link) {
      link.addEventListener("click", closeNav);
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 900) closeNav();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && document.body.classList.contains("nav-open")) {
        closeNav();
        toggle.focus();
      }
    });
  }

  function patchFooterButtons() {
    document.querySelectorAll(".footer-link").forEach(function (btn) {
      var text = btn.textContent.trim().toLowerCase();
      if (text.indexOf("log out") !== -1 || text.indexOf("logout") !== -1) {
        btn.innerHTML =
          btn.innerHTML.replace(/Log\s*Out/i, "Exit") ||
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg> Exit';
        btn.classList.add("footer-link--exit");
      }
      if (text.indexOf("help") !== -1) {
        btn.classList.remove("footer-link");
        btn.classList.add("footer-link", "ai-bot-toggle");
        btn.innerHTML =
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7v1h-2l2 5H5l2-5H5v-1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"/></svg> AI Assistant';
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    injectAiBotMarkup();
    patchFooterButtons();
    initMobileNav();
    initPageAnimations();
    initSearch();
    initAiBot();
    initExit();
  });
})();
