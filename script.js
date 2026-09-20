/* =========================================
   1. INIT AOS & SCROLL EFFECTS
   ========================================= */
document.addEventListener('DOMContentLoaded', function() {
  AOS.init({ duration: 800, easing: 'ease-out-cubic', once: true, offset: 60 });
  
  // Navbar scroll effect
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  }, { passive: true });

  // Back to top functionality
  const backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    backToTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});

/* =========================================
   2. HAMBURGER MENU
   ========================================= */
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
if (hamburger && navMenu) {
  hamburger.addEventListener('click', () => {
    const isActive = hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', isActive);
    document.body.style.overflow = isActive ? 'hidden' : '';
  });
  
  document.querySelectorAll('.nav-link, .nav-cta').forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('active')) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  });
}

/* =========================================
   3. COUNTER ANIMATION
   ========================================= */
const counters = document.querySelectorAll('.counter');
const animateCounter = (el) => {
  const target = parseFloat(el.getAttribute('data-target'));
  const duration = 1500;
  const startTime = performance.now();
  const updateCounter = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeOut = 1 - Math.pow(1 - progress, 4);
    const current = easeOut * target;
    const displayValue = target % 1 !== 0 ? current.toFixed(1) : Math.floor(current);
    el.textContent = Number(displayValue).toLocaleString();
    if (progress < 1) requestAnimationFrame(updateCounter);
    else el.textContent = Number(target).toLocaleString();
  };
  requestAnimationFrame(updateCounter);
};
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });
counters.forEach(c => counterObserver.observe(c));

/* =========================================
   4. FAQ ACCORDION
   ========================================= */
document.querySelectorAll('.accordion-trigger').forEach(trigger => {
  trigger.addEventListener('click', () => {
    const item = trigger.parentElement;
    const isActive = item.classList.contains('active');
    document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('active'));
    if (!isActive) item.classList.add('active');
  });
});

/* =========================================
   5. SWIPER INITIALIZATIONS
   ========================================= */
// Testimonials Swiper
if (document.querySelector('.testimonials-swiper')) {
  new Swiper('.testimonials-swiper', {
    slidesPerView: 1,
    spaceBetween: 24,
    loop: true,
    autoplay: { delay: 5000, disableOnInteraction: false },
    pagination: { el: '.swiper-pagination', clickable: true },
    breakpoints: {
      768: { slidesPerView: 2 },
      1024: { slidesPerView: 3 }
    }
  });
}

// Team Swiper (Responsive: 1 col mobile, 2 col tablet, 4 col desktop)
if (document.querySelector('.team-swiper')) {
  new Swiper('.team-swiper', {
    slidesPerView: 1,
    spaceBetween: 24,
    loop: true,
    autoplay: { delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true },
    pagination: { el: '.team-pagination', clickable: true },
    breakpoints: {
      640: { slidesPerView: 2, spaceBetween: 24 },
      1024: { slidesPerView: 4, spaceBetween: 32 }
    }
  });
}

/* =========================================
   6. SMOOTH SCROLL
   ========================================= */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const offset = navbar ? navbar.offsetHeight + 20 : 80;
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* =========================================
   7. CONTACT FORM VALIDATION
   ========================================= */
const contactForm = document.getElementById('contactForm');
const charCount = document.getElementById('charCount');
const messageField = document.getElementById('message');
const submitBtn = document.getElementById('submitBtn');
const formSuccess = document.getElementById('formSuccess');

if (messageField && charCount) {
  messageField.addEventListener('input', function() {
    const len = this.value.length;
    charCount.textContent = len;
    if (len > 500) {
      this.value = this.value.substring(0, 500);
      charCount.textContent = 500;
    }
    charCount.style.color = len > 450 ? '#e74c3c' : 'var(--text-muted)';
  });
}

function validateField(field, errorId, validator) {
  const errorEl = document.getElementById(errorId);
  if (!errorEl) return true;
  field.addEventListener('input', function() {
    const error = validator(this.value);
    if (error) {
      errorEl.textContent = error;
      this.style.borderColor = '#e74c3c';
    } else {
      errorEl.textContent = '';
      this.style.borderColor = '';
    }
  });
  field.addEventListener('blur', function() {
    const error = validator(this.value);
    if (error) {
      errorEl.textContent = error;
      this.style.borderColor = '#e74c3c';
    }
  });
}

const validators = {
  name: (v) => v.trim().length < 2 ? 'Please enter your full name' : '',
  email: (v) => {
    if (!v.trim()) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Please enter a valid email';
    return '';
  },
  channel: (v) => {
    if (!v.trim()) return 'YouTube channel URL is required';
    if (!v.includes('youtube.com') && !v.includes('youtu.be')) return 'Please enter a valid YouTube URL';
    return '';
  },
  service: (v) => !v ? 'Please select a service' : '',
  message: (v) => v.trim().length < 10 ? 'Message must be at least 10 characters' : ''
};

if (document.getElementById('fullName')) {
  validateField(document.getElementById('fullName'), 'fullNameError', validators.name);
  validateField(document.getElementById('email'), 'emailError', validators.email);
  validateField(document.getElementById('channelUrl'), 'channelUrlError', validators.channel);
  validateField(document.getElementById('service'), 'serviceError', validators.service);
  validateField(document.getElementById('message'), 'messageError', validators.message);
}

if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const fields = [
      { el: document.getElementById('fullName'), err: 'fullNameError', val: validators.name },
      { el: document.getElementById('email'), err: 'emailError', val: validators.email },
      { el: document.getElementById('channelUrl'), err: 'channelUrlError', val: validators.channel },
      { el: document.getElementById('service'), err: 'serviceError', val: validators.service },
      { el: document.getElementById('message'), err: 'messageError', val: validators.message }
    ];
    
    let isValid = true;
    fields.forEach(f => {
      if (!f.el) return;
      const error = f.val(f.el.value);
      const errorEl = document.getElementById(f.err);
      if (error) {
        errorEl.textContent = error;
        f.el.style.borderColor = '#e74c3c';
        isValid = false;
      } else {
        errorEl.textContent = '';
        f.el.style.borderColor = '';
      }
    });
    
    if (!isValid) {
      const firstError = contactForm.querySelector('[style*="border-color: rgb(231, 76, 60)"]');
      if (firstError) firstError.focus();
      return;
    }
    
    submitBtn.disabled = true;
    submitBtn.querySelector('.btn-text').style.display = 'none';
    submitBtn.querySelector('.btn-loader').style.display = 'flex';
    
    setTimeout(() => {
      contactForm.style.display = 'none';
      formSuccess.style.display = 'block';
      setTimeout(() => {
        contactForm.reset();
        contactForm.style.display = 'block';
        formSuccess.style.display = 'none';
        submitBtn.disabled = false;
        submitBtn.querySelector('.btn-text').style.display = 'flex';
        submitBtn.querySelector('.btn-loader').style.display = 'none';
        if (charCount) charCount.textContent = '0';
      }, 4000);
    }, 1500);
  });
}