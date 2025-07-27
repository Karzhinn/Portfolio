// =========================
// Theme Toggle
// =========================
function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const newTheme = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme); 
}

document.addEventListener('DOMContentLoaded', () => {
  // Load saved theme if available
  const savedTheme = localStorage.getItem('theme');
  document.documentElement.setAttribute('data-theme', savedTheme || 'light');

  // Run initialization
  updateTitleOnScroll();
  handleFixedTitleStickiness();
  revealFadeUps();
  animateOnScroll();
  parallaxProjectColumns();
  loadRepos();
  revealProjectCards();
  toggleNavbarOnNavOverlay();

  // Add scroll listeners
  window.addEventListener('scroll', () => {
    updateTitleOnScroll();
    handleFixedTitleStickiness();
  });
});

// =========================
// Fixed Title Text on Scroll
// =========================
const fixedTitle = document.getElementById('fixed-title');

const texts = [
  "Karzhin Kamal",           // Landing screen
  "Education",
  "Languages and tools i have worked with",
  "Familiar Software",
  "Interests",
  "Open to Opportunities",
  "Explore More" // 👈 Title when reaching full-screen nav
];

const sectionIds = [
  'landing',    // Make sure this exists in your HTML
  'education',
  'skills',
  'software',
  'interests',
  'open',
  'final' // 👈 Add this line
];

let currentIndex = -1;
let isAnimating = false;
let sectionOffsets = [];

// Calculate vertical offsets of each section
function calculateOffsets() {
  sectionOffsets = sectionIds.map(id => {
    const el = document.getElementById(id);
    return el ? el.offsetTop : Infinity; // Use Infinity if missing to avoid bugs
  });
}
calculateOffsets();
window.addEventListener('resize', calculateOffsets);

function updateTitleOnScroll() {
  if (!fixedTitle || isAnimating) return;

  const scrollY = window.scrollY;

  // Find index of current section by comparing scrollY with sectionOffsets
  let newIndex = 0;
  for (let i = sectionOffsets.length - 1; i >= 0; i--) {
    if (scrollY >= sectionOffsets[i]) {
      newIndex = i;
      break;
    }
  }

  if (newIndex !== currentIndex && texts[newIndex]) {
    isAnimating = true;

    fixedTitle.style.opacity = 0;

    setTimeout(() => {
      fixedTitle.textContent = texts[newIndex];
      fixedTitle.style.opacity = 1;

      currentIndex = newIndex;
      isAnimating = false;
    }, 300); // match CSS transition
  }
}

// Single scroll listener for efficiency
window.addEventListener('scroll', () => {
  updateTitleOnScroll();
  handleFixedTitleStickiness();
});

// Initial setup
fixedTitle.textContent = texts[0];
fixedTitle.style.opacity = 1;
currentIndex = 0;

// =========================
// Fade-Up Animation
// =========================
function revealFadeUps() {
  const fadeUps = document.querySelectorAll('.fade-up');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  fadeUps.forEach(el => observer.observe(el));
}

// =========================
// Parallax Project Columns
// =========================
function parallaxProjectColumns() {
  const sections = document.querySelectorAll('.project-fullscreen');

  window.addEventListener('scroll', () => {
    const windowHeight = window.innerHeight;

    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top < windowHeight && rect.bottom > 0) {
        const offset = (windowHeight - rect.top) / windowHeight;

        const logo = section.querySelector('.logo');
        const description = section.querySelector('.description');
        const tech = section.querySelector('.tech');

        if (logo) logo.style.transform = `translateY(${offset * -20}px)`;
        if (description) description.style.transform = `translateY(${offset * -10}px)`;
        if (tech) tech.style.transform = `translateY(${offset * -5}px)`;
      }
    });
  });
}

// =========================
// Animate Nav and Landing Titles
// =========================
function animateOnScroll() {
  const navTitle = document.querySelector('.nav-title');
  const landingTitle = document.querySelector('.landing-title');

  function isVisible(el) {
    const rect = el.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom >= 0;
  }

  function runAnimation() {
    if (navTitle && isVisible(navTitle)) navTitle.classList.add('visible');
    if (landingTitle && isVisible(landingTitle)) landingTitle.classList.add('visible');
  }

  window.addEventListener('scroll', runAnimation);
  window.addEventListener('load', runAnimation);
}

// =========================
// Reveal Project Cards (Optional)
// =========================
function revealProjectCards() {
  const cards = document.querySelectorAll('.project-card');
  const triggerBottom = window.innerHeight * 0.85;

  cards.forEach((card, index) => {
    const rect = card.getBoundingClientRect();
    if (rect.top < triggerBottom) {
      setTimeout(() => {
        card.classList.add('visible');
      }, index * 150);
    }
  });
}

// =========================
// GitHub Repos (Optional)
// =========================
async function loadRepos() {
  const username = "your-github-username"; // Replace
  const res = await fetch(`https://api.github.com/users/${username}/repos?sort=updated`);
  const repos = await res.json();
  const container = document.getElementById("repo-widgets");

  if (!container) return;

  repos.slice(0, 3).forEach(repo => {
    const card = document.createElement("a");
    card.className = "repo-card";
    card.href = repo.html_url;
    card.target = "_blank";
    card.innerHTML = `
      <h3>${repo.name}</h3>
      <p>${repo.description || "No description provided."}</p>
      <p><strong>Language:</strong> ${repo.language || "N/A"}</p>
      <p>⭐ ${repo.stargazers_count} | 🍴 ${repo.forks_count}</p>
    `;
    container.appendChild(card);
  });
}

// =========================
// Mobile Menu Toggle (Optional)
// =========================
function toggleMenu() {
  const navLinks = document.querySelector('.nav-links');
  navLinks.classList.toggle('open');
}

function toggleNavbarOnNavOverlay() {
  const navOverlay = document.getElementById('nav-overlay');
  const navbar = document.querySelector('.navbar');

  const observer = new IntersectionObserver(
    ([entry]) => {
          console.log('nav-overlay intersecting?', entry.isIntersecting);

      if (entry.isIntersecting) {
        navbar.style.opacity = '0';
        navbar.style.pointerEvents = 'none';
      } else {
        navbar.style.opacity = '1';
        navbar.style.pointerEvents = 'auto';
      }
    },
    { threshold: 0.5 }
  );

  if (navOverlay) {
    observer.observe(navOverlay);
  }
}
