/* ベル様の物語 — トップページ試作 */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- スマホ用メニュー ---------- */
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.getElementById('global-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      toggle.querySelector('.visually-hidden').textContent = open ? 'メニューを開く' : 'メニューを閉じる';
      nav.classList.toggle('is-open', !open);
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        toggle.setAttribute('aria-expanded', 'false');
        nav.classList.remove('is-open');
      }
    });
  }

  /* ---------- スクロールで表示 ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- カーソルに追従する光（パソコンのみ・本来のカーソルは残す） ---------- */
  var finePointer = window.matchMedia('(pointer: fine)').matches;
  if (!finePointer || reduceMotion) return;

  var stalker = document.createElement('div');
  stalker.className = 'stalker';
  stalker.setAttribute('aria-hidden', 'true');
  document.body.appendChild(stalker);

  // 最初は画面の外（左上）にいて、マウスを動かすと飛んできて収まる
  var pos = { x: -80, y: -80 };
  var target = { x: -80, y: -80 };
  var lastSpark = 0;

  document.addEventListener('mousemove', function (e) {
    target.x = e.clientX;
    target.y = e.clientY;
    stalker.classList.remove('is-hidden');

    var now = performance.now();
    if (now - lastSpark > 60) {
      lastSpark = now;
      spawnSpark(e.clientX, e.clientY);
    }
  });

  document.addEventListener('mouseleave', function () { stalker.classList.add('is-hidden'); });

  document.addEventListener('mouseover', function (e) {
    stalker.classList.toggle('is-hover', !!e.target.closest('a, button'));
  });

  function spawnSpark(x, y) {
    var s = document.createElement('span');
    s.className = 'spark';
    s.setAttribute('aria-hidden', 'true');
    s.style.setProperty('--x', x + 'px');
    s.style.setProperty('--y', y + 'px');
    s.style.setProperty('--dx', (Math.random() * 30 - 15) + 'px');
    s.style.setProperty('--dy', (Math.random() * 24 + 6) + 'px');
    document.body.appendChild(s);
    s.addEventListener('animationend', function () { s.remove(); });
  }

  (function loop() {
    pos.x += (target.x - pos.x) * 0.16;
    pos.y += (target.y - pos.y) * 0.16;
    stalker.style.transform = 'translate(' + pos.x + 'px,' + pos.y + 'px)';
    requestAnimationFrame(loop);
  })();
})();
