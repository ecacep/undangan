const openInvitationBtn = document.getElementById('openInvitation');
const openingScreen = document.getElementById('openingScreen');
const mainContent = document.getElementById('mainContent');
const bgMusic = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');
const autoScrollToggle = document.getElementById('autoScrollToggle');
const rsvpForm = document.getElementById('rsvpForm');
const rsvpResult = document.getElementById('rsvpResult');
const copyRek = document.getElementById('copyRek');
const copyInfo = document.getElementById('copyInfo');
const galleryItems = document.querySelectorAll('.gallery-item');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const closeLightbox = document.getElementById('closeLightbox');

const targetDate = new Date('2027-03-16T08:00:00+07:00').getTime();
let autoScrollInterval = null;
let isAutoScrolling = false;
let musicPlaying = false;

document.body.classList.add('no-scroll');

function getGuestNameFromURL() {
  const params = new URLSearchParams(window.location.search);
  const to = params.get('to') || params.get('nama') || params.get('guest');
  if (to) {
    document.getElementById('guestName').textContent = decodeURIComponent(to.replace(/\+/g, ' '));
  }
}

function startCountdown() {
  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');

  setInterval(() => {
    const now = Date.now();
    const distance = targetDate - now;

    if (distance <= 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minutesEl.textContent = '00';
      secondsEl.textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((distance / (1000 * 60)) % 60);
    const seconds = Math.floor((distance / 1000) % 60);

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');
  }, 1000);
}

function setupRevealAnimation() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.18 });

  document.querySelectorAll('.reveal').forEach((item) => observer.observe(item));
}

function toggleMusic() {
  if (!bgMusic.getAttribute('src') && !bgMusic.querySelector('source')?.getAttribute('src')) {
    alert('Tambahkan file musik Anda terlebih dahulu pada elemen <audio> di index.html.');
    return;
  }

  if (musicPlaying) {
    bgMusic.pause();
    musicToggle.textContent = '♫';
  } else {
    bgMusic.play().catch(() => {
      alert('Browser menahan autoplay. Klik lagi untuk memulai musik.');
    });
    musicToggle.textContent = '❚❚';
  }

  musicPlaying = !musicPlaying;
}

function toggleAutoScroll() {
  if (isAutoScrolling) {
    clearInterval(autoScrollInterval);
    autoScrollToggle.textContent = 'Auto Scroll: Off';
  } else {
    autoScrollInterval = setInterval(() => {
      window.scrollBy({ top: 1.2, behavior: 'auto' });
      const isBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 5;
      if (isBottom) {
        clearInterval(autoScrollInterval);
        isAutoScrolling = false;
        autoScrollToggle.textContent = 'Auto Scroll: Off';
      }
    }, 16);
    autoScrollToggle.textContent = 'Auto Scroll: On';
  }

  isAutoScrolling = !isAutoScrolling;
}

function setupGallery() {
  galleryItems.forEach((item) => {
    item.addEventListener('click', () => {
      lightboxImage.src = item.src;
      lightbox.classList.add('active');
      document.body.classList.add('no-scroll');
    });
  });
}

function closeGallery() {
  lightbox.classList.remove('active');
  if (!openingScreen.classList.contains('hidden')) return;
  document.body.classList.remove('no-scroll');
}

function handleRSVP(event) {
  event.preventDefault();
  const name = document.getElementById('name').value.trim();
  const attendance = document.getElementById('attendance').value;
  const message = document.getElementById('message').value.trim();

  rsvpResult.innerHTML = `Terima kasih <strong>${name}</strong>. Status kehadiran Anda: <strong>${attendance}</strong>${message ? `<br>Ucapan: “${message}”` : ''}`;
  rsvpForm.reset();
}

function copyAccountNumber() {
  navigator.clipboard.writeText('1234567890').then(() => {
    copyInfo.textContent = 'Nomor rekening berhasil disalin.';
  }).catch(() => {
    copyInfo.textContent = 'Gagal menyalin. Silakan copy manual: 1234567890';
  });
}

openInvitationBtn.addEventListener('click', () => {
  openingScreen.classList.add('hidden');
  mainContent.classList.remove('hidden');
  document.body.classList.remove('no-scroll');
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

musicToggle.addEventListener('click', toggleMusic);
autoScrollToggle.addEventListener('click', toggleAutoScroll);
rsvpForm.addEventListener('submit', handleRSVP);
copyRek.addEventListener('click', copyAccountNumber);
closeLightbox.addEventListener('click', closeGallery);
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeGallery();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeGallery();
});

getGuestNameFromURL();
startCountdown();
setupRevealAnimation();
setupGallery();
