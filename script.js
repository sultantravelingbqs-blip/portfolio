// M. Asad portfolio interactions — vanilla JavaScript

const header = document.querySelector('.site-header');
const scrollProgress = document.getElementById('scrollProgress');
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const navItems = [...document.querySelectorAll('.nav-link')];
const typedText = document.getElementById('typedText');

// Update the sticky header and reading progress as the page scrolls.
function updateScrollUI() {
  const scrollTop = window.scrollY;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? (scrollTop / scrollable) * 100 : 0;

  header.classList.toggle('scrolled', scrollTop > 24);
  scrollProgress.style.width = `${progress}%`;
}
window.addEventListener('scroll', updateScrollUI, { passive: true });
updateScrollUI();

// Mobile navigation menu.
menuToggle.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Open navigation menu' : 'Close navigation menu');
  navLinks.classList.toggle('open', !isOpen);
});

navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation menu');
  });
});

// Reveal sections gently when they enter the viewport.
const revealElements = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });

  revealElements.forEach((element, index) => {
    element.style.transitionDelay = `${Math.min(index % 4, 3) * 80}ms`;
    revealObserver.observe(element);
  });
} else {
  revealElements.forEach((element) => element.classList.add('visible'));
}

// Small typing animation in the hero headline.
const phrases = ['web look beautiful', 'ideas come alive', 'design feel simple'];
let phraseIndex = 0;
let characterIndex = phrases[0].length;
let deleting = true;
let typingTimer;

function typePhrase() {
  if (!typedText || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const currentPhrase = phrases[phraseIndex];
  if (deleting) {
    characterIndex -= 1;
    typedText.textContent = currentPhrase.slice(0, Math.max(characterIndex, 0));
    if (characterIndex <= 0) {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingTimer = window.setTimeout(typePhrase, 350);
      return;
    }
  } else {
    const nextPhrase = phrases[phraseIndex];
    characterIndex += 1;
    typedText.textContent = nextPhrase.slice(0, characterIndex);
    if (characterIndex >= nextPhrase.length) {
      deleting = true;
      typingTimer = window.setTimeout(typePhrase, 1800);
      return;
    }
  }
  typingTimer = window.setTimeout(typePhrase, deleting ? 42 : 75);
}

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  typingTimer = window.setTimeout(typePhrase, 1900);
}

// Highlight the navigation item for the section currently on screen.
const sections = [...document.querySelectorAll('main section[id]')];
if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navItems.forEach((item) => {
          item.classList.toggle('active', item.getAttribute('href') === `#${entry.target.id}`);
        });
      }
    });
  }, { rootMargin: '-35% 0px -55% 0px' });
  sections.forEach((section) => sectionObserver.observe(section));
}

// Keep the footer year current.
document.getElementById('year').textContent = new Date().getFullYear();
