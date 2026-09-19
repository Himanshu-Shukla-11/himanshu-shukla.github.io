/**
 * HIMANSHU SHUKLA — PORTFOLIO JAVASCRIPT
 * Pure Vanilla JavaScript — Zero Frameworks, Zero Dependencies
 */

(function () {
  'use strict';

  // =========================================================================
  // Theme Toggle (Dark / Light Mode) with LocalStorage
  // =========================================================================
  const themeToggles = document.querySelectorAll('.theme-toggle-btn');
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  const savedTheme = localStorage.getItem('hs-portfolio-theme');

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('hs-portfolio-theme', theme);
    
    // Update SVG icons on all theme toggle buttons
    themeToggles.forEach(btn => {
      if (theme === 'light') {
        btn.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>`;
        btn.setAttribute('aria-label', 'Switch to dark theme');
      } else {
        btn.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>`;
        btn.setAttribute('aria-label', 'Switch to light theme');
      }
    });
  }

  // Initial theme determination (Default to Dark Mode as specified)
  if (savedTheme) {
    applyTheme(savedTheme);
  } else {
    applyTheme('dark');
  }

  themeToggles.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
    });
  });

  // =========================================================================
  // Mobile Navigation Hamburger Menu
  // =========================================================================
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (hamburgerBtn && mobileMenu) {
    hamburgerBtn.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      hamburgerBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('click', (e) => {
      if (!hamburgerBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
        mobileMenu.classList.remove('open');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // =========================================================================
  // Sticky Navbar & Active Section Tracking
  // =========================================================================
  const navbar = document.getElementById('mainNav');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  // Highlight active link based on scroll position
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => navObserver.observe(section));

  // =========================================================================
  // Custom Cursor (Desktop Only)
  // =========================================================================
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');

  if (cursorDot && cursorRing && window.matchMedia('(pointer: fine)').matches) {
    let mouseX = -100, mouseY = -100;
    let ringX = -100, ringY = -100;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    }, { passive: true });

    // Smooth animation loop for trailing ring
    function renderCursor() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      cursorRing.style.left = `${ringX}px`;
      cursorRing.style.top = `${ringY}px`;
      requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);

    // Expand cursor ring when hovering interactive elements
    const interactiveElements = document.querySelectorAll('a, button, input, textarea, .project-card, .filter-btn');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => cursorRing.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => cursorRing.classList.remove('cursor-hover'));
    });

    document.addEventListener('mouseleave', () => {
      cursorDot.style.opacity = '0';
      cursorRing.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
      cursorDot.style.opacity = '1';
      cursorRing.style.opacity = '1';
    });
  }

  // =========================================================================
  // Project Filtering
  // =========================================================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });

  // =========================================================================
  // Project Modal Dialog
  // =========================================================================
  const projectModal = document.getElementById('projectModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalImg = document.getElementById('modalImg');
  const modalCategory = document.getElementById('modalCategory');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalTechList = document.getElementById('modalTechList');
  const modalLiveLink = document.getElementById('modalLiveLink');

  const modalTriggers = document.querySelectorAll('.project-modal-trigger');

  function openModal(card) {
    const title = card.getAttribute('data-title');
    const category = card.getAttribute('data-category-label');
    const desc = card.getAttribute('data-full-desc') || card.querySelector('.project-desc').textContent;
    const imgSrc = card.querySelector('.project-img').getAttribute('src');
    const liveUrl = card.getAttribute('data-url');
    const btnText = card.getAttribute('data-btn-text') || 'Visit Project →';
    const techTags = card.querySelectorAll('.tech-tag');

    modalTitle.textContent = title;
    modalCategory.textContent = category;
    modalDesc.textContent = desc;
    modalImg.src = imgSrc;
    modalImg.alt = title;
    modalLiveLink.href = liveUrl;
    modalLiveLink.textContent = btnText;

    modalTechList.innerHTML = '';
    techTags.forEach(tag => {
      const span = document.createElement('span');
      span.className = 'tech-tag';
      span.textContent = tag.textContent;
      modalTechList.appendChild(span);
    });

    projectModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    projectModal.classList.remove('open');
    document.body.style.overflow = '';
  }

  modalTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = btn.closest('.project-card');
      if (card) openModal(card);
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  if (projectModal) {
    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && projectModal && projectModal.classList.contains('open')) {
      closeModal();
    }
  });

  // =========================================================================
  // Contact Form Handling (Client Validation + Mailto Fallback)
  // =========================================================================
  const contactForm = document.getElementById('contactForm');
  const formStatusMsg = document.getElementById('formStatusMsg');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('contactName').value.trim();
      const email = document.getElementById('contactEmail').value.trim();
      const subject = document.getElementById('contactSubject').value.trim();
      const message = document.getElementById('contactMessage').value.trim();

      let isValid = true;

      // Validate Name
      const nameError = document.getElementById('nameError');
      if (!name) {
        nameError.style.display = 'block';
        isValid = false;
      } else {
        nameError.style.display = 'none';
      }

      // Validate Email
      const emailError = document.getElementById('emailError');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        emailError.style.display = 'block';
        isValid = false;
      } else {
        emailError.style.display = 'none';
      }

      // Validate Message
      const messageError = document.getElementById('messageError');
      if (!message) {
        messageError.style.display = 'block';
        isValid = false;
      } else {
        messageError.style.display = 'none';
      }

      if (isValid) {
        // Construct mailto link
        const mailtoSubject = encodeURIComponent(subject ? `[Portfolio Contact] ${subject}` : `[Portfolio Contact] Message from ${name}`);
        const mailtoBody = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
        const mailtoUrl = `mailto:himanshu.it1110@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;

        formStatusMsg.textContent = 'Preparing your message... Opening your default email client to send to himanshu.it1110@gmail.com.';
        formStatusMsg.className = 'form-status-msg success';
        formStatusMsg.style.display = 'block';

        setTimeout(() => {
          window.location.href = mailtoUrl;
        }, 600);
      }
    });
  }

  // =========================================================================
  // Back to Top Button
  // =========================================================================
  const backToTopBtn = document.getElementById('backToTopBtn');

  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 450) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }, { passive: true });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // =========================================================================
  // Scroll Reveal Animations via IntersectionObserver
  // =========================================================================
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('revealed'));
  }

})();
