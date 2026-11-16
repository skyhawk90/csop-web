
// Mobilní menu
const toggle = document.querySelector(".nav__toggle");
const menu = document.getElementById("menu");
const iconUse = toggle.querySelector("use");

function setMenu(open) {
  menu.classList.toggle("is-open", open);
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-label", open ? "Zavřít menu" : "Otevřít menu");
  iconUse.setAttribute("href", `/icons.svg#i-${open ? "x" : "list"}`);
}
toggle.addEventListener("click", () => setMenu(!menu.classList.contains("is-open")));
menu.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

// Linka pod navigací po odscrollování (sentinel místo scroll listeneru)
const nav = document.querySelector(".nav");
const sentinel = document.createElement("div");
sentinel.style.cssText = "position:absolute;top:0;height:8px;width:1px;";
document.body.prepend(sentinel);
new IntersectionObserver(([entry]) => nav.classList.toggle("is-scrolled", !entry.isIntersecting)).observe(sentinel);

// Postupné odhalení obsahu
const reveals = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-in");
      io.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
  reveals.forEach((el, i) => {
    // jemné zpoždění pro sourozence ve stejné mřížce
    const siblings = el.parentElement.querySelectorAll(":scope > .reveal");
    const idx = Array.prototype.indexOf.call(siblings, el);
    if (siblings.length > 1) el.style.transitionDelay = `${Math.min(idx, 5) * 70}ms`;
    io.observe(el);
  });
} else {
  reveals.forEach((el) => el.classList.add("is-in"));
}
