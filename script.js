/* =========================================
1. INIT AOS
========================================= */
document.addEventListener('DOMContentLoaded', function() {
  AOS.init({
    duration: 800,
    easing: 'ease-out-cubic',
    once: true,
    offset: 60
  });
});

/* =========================================
2. NAVBAR SCROLL
========================================= */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 30) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');
}, { passive: true });

/* =========================================
3. HAMBURGER MENU
========================================= */
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

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

document.addEventListener('click', (e) => {
  if (!navMenu.contains(e.target) && !hamburger.contains(e.target) && navMenu.classList.contains('active')) {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navMenu.classList.contains('active')) {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
});

/* =========================================
4. COUNTER ANIMATION
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
    const isFloat = target % 1 !== 0;
    const displayValue = isFloat ? current.toFixed(1) : Math.floor(current);
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
5. PRICING TOGGLE
========================================= */
const billingToggle = document.getElementById('billingToggle');
const monthlyTexts = document.querySelectorAll('.monthly-text');
const yearlyTexts = document.querySelectorAll('.yearly-text');
const monthlyPrices = document.querySelectorAll('.price-monthly');
const yearlyPrices = document.querySelectorAll('.price-yearly');

if (billingToggle) {
  const updatePricing = (isYearly) => {
    monthlyTexts.forEach(t => t.classList.toggle('active', !isYearly));
    yearlyTexts.forEach(t => t.classList.toggle('active', isYearly));

    const activePrices = isYearly ? yearlyPrices : monthlyPrices;
    const inactivePrices = isYearly ? monthlyPrices : yearlyPrices;

    inactivePrices.forEach(price => {
      price.style.opacity = '0';
      price.style.transform = 'translateY(-5px)';
    });

    setTimeout(() => {
      inactivePrices.forEach(price => price.style.display = 'none');
      activePrices.forEach(price => {
        price.style.display = 'inline-block';
        void price.offsetWidth;
        price.style.opacity = '1';
        price.style.transform = 'translateY(0)';
      });
    }, 300);
  };

  billingToggle.addEventListener('change', (e) => updatePricing(e.target.checked));

  monthlyTexts.forEach(text => {
    text.addEventListener('click', () => {
      if (billingToggle.checked) {
        billingToggle.checked = false;
        updatePricing(false);
      }
    });
  });

  yearlyTexts.forEach(text => {
    text.addEventListener('click', () => {
      if (!billingToggle.checked) {
        billingToggle.checked = true;
        updatePricing(true);
      }
    });
  });
}

/* =========================================
6. FAQ ACCORDION
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
7. SCHEDULER CALENDAR
========================================= */
const calendarDays = document.getElementById('calendarDays');
const calendarMonthYear = document.querySelector('.calendar-month-year');
const prevMonthBtn = document.querySelector('.prev-month');
const nextMonthBtn = document.querySelector('.next-month');
const selectedDateDisplay = document.getElementById('selectedDateDisplay');
const timeSlotsGrid = document.getElementById('timeSlotsGrid');
const confirmBookingBtn = document.getElementById('confirmBooking');

let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();
let selectedDate = null;
let selectedTime = null;

const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const availableTimes = ['9:00 AM','9:30 AM','10:00 AM','10:30 AM','11:00 AM','11:30 AM','12:00 PM','12:30 PM','2:00 PM','2:30 PM','3:00 PM','3:30 PM','4:00 PM','4:30 PM','5:00 PM','5:30 PM'];

function renderCalendar() {
  calendarDays.innerHTML = '';
  calendarMonthYear.textContent = `${monthNames[currentMonth]} ${currentYear}`;

  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const today = new Date();

  for (let i = 0; i < firstDay; i++) {
    const emptyDay = document.createElement('div');
    emptyDay.className = 'calendar-day empty';
    calendarDays.appendChild(emptyDay);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dayElement = document.createElement('div');
    dayElement.className = 'calendar-day';
    dayElement.textContent = day;

    const dateToCheck = new Date(currentYear, currentMonth, day);
    const isPast = dateToCheck < new Date(today.setHours(0, 0, 0, 0));
    const isWeekend = dateToCheck.getDay() === 0 || dateToCheck.getDay() === 6;
    const isToday = dateToCheck.toDateString() === new Date().toDateString();

    if (isPast || isWeekend) {
      dayElement.classList.add('disabled');
    } else {
      dayElement.classList.add('available');
      if (isToday) dayElement.classList.add('today');

      if (selectedDate &&
          selectedDate.getDate() === day &&
          selectedDate.getMonth() === currentMonth &&
          selectedDate.getFullYear() === currentYear) {
        dayElement.classList.add('selected');
      }

      dayElement.addEventListener('click', () => selectDate(day));
    }

    calendarDays.appendChild(dayElement);
  }
}

function selectDate(day) {
  selectedDate = new Date(currentYear, currentMonth, day);
  selectedTime = null;

  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  selectedDateDisplay.textContent = selectedDate.toLocaleDateString('en-US', options);

  renderCalendar();
  generateTimeSlots();
  confirmBookingBtn.disabled = true;
}

function generateTimeSlots() {
  timeSlotsGrid.innerHTML = '';
  availableTimes.forEach(time => {
    const slot = document.createElement('button');
    slot.className = 'time-slot';
    slot.textContent = time;
    slot.addEventListener('click', () => selectTime(time, slot));
    timeSlotsGrid.appendChild(slot);
  });
}

function selectTime(time, slotElement) {
  selectedTime = time;
  document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
  slotElement.classList.add('selected');
  confirmBookingBtn.disabled = false;
}

prevMonthBtn.addEventListener('click', () => {
  currentMonth--;
  if (currentMonth < 0) { currentMonth = 11; currentYear--; }
  renderCalendar();
});

nextMonthBtn.addEventListener('click', () => {
  currentMonth++;
  if (currentMonth > 11) { currentMonth = 0; currentYear++; }
  renderCalendar();
});

confirmBookingBtn.addEventListener('click', () => {
  if (selectedDate && selectedTime) {
    const dateStr = selectedDate.toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
    alert(`Booking Confirmed!\n\nDate: ${dateStr}\nTime: ${selectedTime}\n\nWe'll send you a confirmation email with the Google Meet link.`);

    selectedDate = null;
    selectedTime = null;
    selectedDateDisplay.textContent = 'Select a date from the calendar';
    timeSlotsGrid.innerHTML = '';
    confirmBookingBtn.disabled = true;
    renderCalendar();
  }
});

renderCalendar();

/* =========================================
8. EXPLORE SERVICES NAVIGATION
========================================= */
const explorePrev = document.querySelector('.explore-nav.prev');
const exploreNext = document.querySelector('.explore-nav.next');

if (explorePrev && exploreNext) {
  exploreNext.addEventListener('click', () => {
    const cards = document.querySelectorAll('.service-card-custom');
    if (cards.length > 0) cards[0].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
  });

  explorePrev.addEventListener('click', () => {
    const cards = document.querySelectorAll('.service-card-custom');
    if (cards.length > 0) cards[cards.length - 1].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'end' });
  });
}

/* =========================================
9. SWIPER INITIALIZATIONS
========================================= */
// Testimonials Swiper
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

// Team Swiper
new Swiper('.team-swiper', {
  slidesPerView: 1,
  spaceBetween: 20,
  loop: true,
  autoplay: { delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true },
  pagination: { el: '.team-pagination', clickable: true },
  breakpoints: {
    640: { slidesPerView: 2, spaceBetween: 20 },
    1024: { slidesPerView: 4, spaceBetween: 32 }
  }
});

/* =========================================
10. SMOOTH SCROLL
========================================= */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;

    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const offset = navbar.offsetHeight + 20;
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* =========================================
11. CONTACT FORM VALIDATION & SUBMISSION
========================================= */
const contactForm = document.getElementById('contactForm');
const charCount = document.getElementById('charCount');
const messageField = document.getElementById('message');
const submitBtn = document.getElementById('submitBtn');
const formSuccess = document.getElementById('formSuccess');

// Character counter
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

// Validation helper
function validateField(field, errorId, validator) {
  const errorEl = document.getElementById(errorId);
  if (!errorEl) return true;

  field.addEventListener('input', function() {
    const error = validator(this.value);
    if (error) {
      errorEl.textContent = error;
      this.style.borderColor = '#e74c3c';
      return false;
    } else {
      errorEl.textContent = '';
      this.style.borderColor = '';
      return true;
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

// Validation rules
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

// Attach validators
if (document.getElementById('fullName')) {
  validateField(document.getElementById('fullName'), 'fullNameError', validators.name);
  validateField(document.getElementById('email'), 'emailError', validators.email);
  validateField(document.getElementById('channelUrl'), 'channelUrlError', validators.channel);
  validateField(document.getElementById('service'), 'serviceError', validators.service);
  validateField(document.getElementById('message'), 'messageError', validators.message);
}

// Form submission
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

    // Show loading
    submitBtn.disabled = true;
    submitBtn.querySelector('.btn-text').style.display = 'none';
    submitBtn.querySelector('.btn-loader').style.display = 'flex';

    // Collect data
    const formData = {
      name: document.getElementById('fullName').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
      channel: document.getElementById('channelUrl').value,
      service: document.getElementById('service').value,
      budget: document.getElementById('budget').value,
      message: document.getElementById('message').value,
      newsletter: document.getElementById('newsletter').checked
    };

    // Simulate API call
    setTimeout(() => {
      console.log('Form submitted:', formData);
      contactForm.style.display = 'none';
      formSuccess.style.display = 'block';

      setTimeout(() => {
        contactForm.reset();
        contactForm.style.display = 'block';
        formSuccess.style.display = 'none';
        submitBtn.disabled = false;
        submitBtn.querySelector('.btn-text').style.display = 'flex';
        submitBtn.querySelector('.btn-loader').style.display = 'none';
        charCount.textContent = '0';
      }, 5000);
    }, 1500);
  });
}

/* =========================================
12. BACK TO TOP
========================================= */
const backToTop = document.querySelector('.back-to-top');
if (backToTop) {
  backToTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}