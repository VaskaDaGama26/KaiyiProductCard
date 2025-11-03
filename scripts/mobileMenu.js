const burgerBtn = document.querySelector(".mobile__buttons .burger__button");
const mobileNav = document.getElementById("mobileNav");
const mainNav = document.querySelector(".nav");
const mobileNavContainer = mobileNav.querySelector(".nav--mobile");

if (mainNav && mobileNavContainer) {
  const clonedNav = mainNav.cloneNode(true);
  clonedNav.classList.add("nav--cloned");
  clonedNav.removeAttribute("aria-label");
  mobileNavContainer.appendChild(clonedNav);
}

burgerBtn.addEventListener("click", (e) => {
  e.preventDefault();
  mobileNav.classList.toggle("active");
  document.body.classList.toggle("no-scroll");
});
mobileNav.addEventListener("click", (e) => {
  const navPanel = mobileNav.querySelector(".nav--mobile");
  if (!navPanel.contains(e.target)) {
    mobileNav.classList.remove("active");
    document.body.classList.remove("no-scroll");
  }
});
