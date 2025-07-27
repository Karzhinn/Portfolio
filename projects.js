// IntersectionObserver for updating active bubble
const sections = document.querySelectorAll('.project-screen');
const bubbles = document.querySelectorAll('.scroll-bubble');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const index = [...sections].indexOf(entry.target);
        bubbles.forEach((bubble) => bubble.classList.remove('active'));
        if (bubbles[index]) bubbles[index].classList.add('active');
      }
    });
  },
  {
    threshold: 0.6 // triggers when 60% of the section is visible
  }
);

sections.forEach((section) => observer.observe(section));
