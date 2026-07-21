/* ==========================================================================
   AI Agent 課程 — 共用腳本
   零外部相依。所有 DOM 建構一律用 createElement + textContent，
   不使用 innerHTML，避免任何注入風險。
   ========================================================================== */
(function () {
  "use strict";

  /* ---------- 頂部導覽：標記目前頁面 ---------- */
  var here = location.pathname.split("/").pop() || "index.html";
  Array.prototype.forEach.call(document.querySelectorAll(".sitebar a"), function (a) {
    var target = a.getAttribute("href");
    if (target === here) a.classList.add("here");
  });

  /* ---------- 程式碼複製鈕 ---------- */
  Array.prototype.forEach.call(document.querySelectorAll(".code button.copy"), function (btn) {
    btn.addEventListener("click", function () {
      var pre = btn.closest(".code").querySelector("code");
      var text = pre ? pre.innerText : "";
      var done = function () {
        var old = btn.textContent;
        btn.textContent = "已複製 ✓";
        setTimeout(function () { btn.textContent = old; }, 1400);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, done);
      } else {
        var ta = document.createElement("textarea");
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand("copy"); } catch (e) { /* 忽略：僅為舊瀏覽器備援 */ }
        document.body.removeChild(ta);
        done();
      }
    });
  });

  /* ---------- 共用小工具，供各頁腳本使用 ---------- */
  window.Lab = {
    /** 建立元素：el("div", "cls", "文字") */
    el: function (tag, cls, text) {
      var n = document.createElement(tag);
      if (cls) n.className = cls;
      if (text != null) n.textContent = text;
      return n;
    },
    /** 清空一個容器 */
    clear: function (node) {
      while (node.firstChild) node.removeChild(node.firstChild);
    },
    /** 步進器：綁定「下一步 / 重來」到一組 .step */
    stepper: function (opts) {
      var steps = Array.prototype.slice.call(document.querySelectorAll(opts.steps));
      var next = document.querySelector(opts.next);
      var reset = document.querySelector(opts.reset);
      var i = 0;
      function render() {
        steps.forEach(function (s, k) { s.classList.toggle("on", k < i); });
        next.disabled = i >= steps.length;
        next.textContent = i >= steps.length ? "完成 ✓" : "下一步 ▸";
        if (typeof opts.onStep === "function") opts.onStep(i);
      }
      next.addEventListener("click", function () {
        if (i < steps.length) { i++; render(); }
      });
      if (reset) reset.addEventListener("click", function () { i = 0; render(); });
      render();
    },
    /** 兩選一切換器 */
    toggler: function (rootSel, onChange) {
      var root = document.querySelector(rootSel);
      if (!root) return;
      root.addEventListener("click", function (e) {
        var b = e.target.closest("button");
        if (!b) return;
        Array.prototype.forEach.call(root.children, function (x) {
          x.classList.toggle("active", x === b);
        });
        onChange(b.getAttribute("data-c"));
      });
      var first = root.querySelector("button.active") || root.querySelector("button");
      if (first) onChange(first.getAttribute("data-c"));
    }
  };
})();
