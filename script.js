/* ==========================================================
   GỬI NHƯ Ý - ROMANTIC APOLOGY JAVASCRIPT LOGIC
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initPetalCanvas();
  initEnvelopeFlow();
  initAudioSynthesizer();
  initHeartbeatWidget();
  initRunawayButton();
  initCelebrationFlow();
  initCardFlipAccessibility();
});

/* ==========================================================
   1. SAKURA PETALS & PARTICLES CANVAS ENGINE
   ========================================================== */
function initPetalCanvas() {
  const canvas = document.getElementById('petal-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const petals = [];
  const petalCount = Math.min(38, Math.floor(window.innerWidth / 30));

  class Petal {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = -20 - Math.random() * 50;
      this.size = 10 + Math.random() * 14;
      this.speedY = 1 + Math.random() * 1.8;
      this.speedX = (Math.random() - 0.5) * 1.2;
      this.angle = Math.random() * 360;
      this.spinSpeed = (Math.random() - 0.5) * 2;
      this.opacity = 0.5 + Math.random() * 0.45;
      this.color = Math.random() > 0.3 ? '#ffb3c6' : '#ffccd5';
      this.flutter = Math.random() * Math.PI;
    }

    update() {
      this.flutter += 0.025;
      this.x += this.speedX + Math.sin(this.flutter) * 1.2;
      this.y += this.speedY;
      this.angle += this.spinSpeed;

      if (this.y > height + 20 || this.x < -30 || this.x > width + 30) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.angle * Math.PI) / 180);
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.color;

      // Draw delicate petal shape
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(this.size / 2, -this.size / 2, this.size, 0, 0, this.size * 1.4);
      ctx.bezierCurveTo(-this.size, 0, -this.size / 2, -this.size / 2, 0, 0);
      ctx.fill();

      ctx.restore();
    }
  }

  for (let i = 0; i < petalCount; i++) {
    const p = new Petal();
    p.y = Math.random() * height; // Spread across screen initially
    petals.push(p);
  }

  // Interactive mouse sparkles
  const sparkles = [];
  window.addEventListener('mousemove', (e) => {
    if (Math.random() > 0.6) {
      sparkles.push({
        x: e.clientX,
        y: e.clientY,
        size: 3 + Math.random() * 5,
        speedX: (Math.random() - 0.5) * 2,
        speedY: (Math.random() - 0.5) * 2 - 1,
        life: 1,
        color: Math.random() > 0.5 ? '#ff477e' : '#ffd166',
        isHeart: Math.random() > 0.6
      });
    }
  });

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Draw petals
    for (let i = 0; i < petals.length; i++) {
      petals[i].update();
      petals[i].draw();
    }

    // Draw mouse sparkles
    for (let i = sparkles.length - 1; i >= 0; i--) {
      const s = sparkles[i];
      s.x += s.speedX;
      s.y += s.speedY;
      s.life -= 0.02;

      if (s.life <= 0) {
        sparkles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = s.life;
      ctx.fillStyle = s.color;

      if (s.isHeart) {
        ctx.font = `${Math.floor(s.size * 2)}px sans-serif`;
        ctx.fillText('💖', s.x, s.y);
      } else {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================
   2. ENVELOPE OPENING WORKFLOW
   ========================================================== */
function initEnvelopeFlow() {
  const envelopeScreen = document.getElementById('envelope-screen');
  const letterContent = document.getElementById('letter-content');
  const openBtn = document.getElementById('open-envelope-btn');
  const waxSeal = document.getElementById('wax-seal');
  const envelopeBox = document.getElementById('envelope-box');

  function openEnvelope() {
    // Envelope opening animation
    const flap = document.querySelector('.envelope-flap');
    if (flap) {
      flap.style.transform = 'rotateX(180deg)';
      flap.style.zIndex = '1';
    }

    // Start ambient music gently if user clicked open
    if (!musicPlaying) {
      toggleMusic();
    }

    // Particle burst effect at seal
    createConfettiBurst(window.innerWidth / 2, window.innerHeight / 2, ['#ff477e', '#ffd166', '#ffccd5']);

    setTimeout(() => {
      envelopeScreen.style.opacity = '0';
      envelopeScreen.style.transform = 'translateY(-40px)';
      
      setTimeout(() => {
        envelopeScreen.style.display = 'none';
        letterContent.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 600);
    }, 700);
  }

  if (openBtn) openBtn.addEventListener('click', openEnvelope);
  if (waxSeal) waxSeal.addEventListener('click', openEnvelope);
  if (envelopeBox) envelopeBox.addEventListener('click', openEnvelope);
}

/* ==========================================================
   3. WEB AUDIO ROMANTIC PIANO SYNTHESIZER
   ========================================================== */
let audioCtx = null;
let musicPlaying = false;
let musicInterval = null;

function initAudioSynthesizer() {
  const musicBtn = document.getElementById('music-btn');
  const musicText = document.getElementById('music-text');
  const soundWave = document.getElementById('sound-wave');

  if (musicBtn) {
    musicBtn.addEventListener('click', () => {
      toggleMusic();
    });
  }
}

function toggleMusic() {
  const musicText = document.getElementById('music-text');
  const soundWave = document.getElementById('sound-wave');

  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();
  }

  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  if (musicPlaying) {
    // Stop music
    musicPlaying = false;
    clearInterval(musicInterval);
    if (musicText) musicText.textContent = 'Bật giai điệu ấm áp';
    if (soundWave) soundWave.classList.add('paused');
  } else {
    // Start music
    musicPlaying = true;
    if (musicText) musicText.textContent = 'Đang phát nhạc êm dịu 🎶';
    if (soundWave) soundWave.classList.remove('paused');
    playRomanticMelodySequence();
  }
}

function playTone(freq, type = 'sine', duration = 1.2, gainPeak = 0.08) {
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

  gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(gainPeak, audioCtx.currentTime + 0.08);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start();
  osc.stop(audioCtx.currentTime + duration);
}

function playRomanticMelodySequence() {
  // Soothing lullaby arpeggios (Cmaj7 - Am9 - Fmaj7 - Gsus4)
  const notes = [
    261.63, 329.63, 392.00, 493.88, // C, E, G, B
    220.00, 261.63, 329.63, 392.00, // A, C, E, G
    174.61, 261.63, 329.63, 349.23, // F, C, E, F
    196.00, 293.66, 392.00, 440.00  // G, D, G, A
  ];

  let step = 0;
  playStep();
  
  function playStep() {
    if (!musicPlaying) return;
    const note = notes[step % notes.length];
    
    // Play main bell-piano note
    playTone(note, 'sine', 1.8, 0.07);
    // Soft octave lower for warm resonance
    if (step % 4 === 0) {
      playTone(note / 2, 'triangle', 2.5, 0.06);
    }

    step++;
    musicInterval = setTimeout(playStep, 680);
  }
}

/* ==========================================================
   4. HEARTBEAT WIDGET INTERACTION
   ========================================================== */
function initHeartbeatWidget() {
  const widget = document.getElementById('heartbeat-widget');
  const bpmVal = document.getElementById('bpm-val');
  if (!widget || !bpmVal) return;

  let currentBpm = 128;
  const cuteBpmNotes = [
    "Nhịp tim anh đập rộn ràng vì nhớ Như Ý!",
    "Mỗi lần nhìn thấy tên em là tim anh lại loạn nhịp 💓",
    "Tim anh chỉ hướng về một mình Như Ý thôi!",
    "Anh thề tim anh đang hối lỗi và yêu em thật lòng 🥺"
  ];

  widget.addEventListener('click', (e) => {
    currentBpm = Math.min(185, currentBpm + 4);
    bpmVal.textContent = currentBpm;

    // Heartbeat audio effect
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
    playTone(70, 'sine', 0.2, 0.2);
    setTimeout(() => playTone(60, 'sine', 0.25, 0.18), 120);

    // Floating heart from click
    spawnFloatingHeart(e.clientX || window.innerWidth / 2, e.clientY || 300);

    // Show temporary toast message
    const caption = widget.querySelector('.heartbeat-caption');
    if (caption) {
      const randomNote = cuteBpmNotes[Math.floor(Math.random() * cuteBpmNotes.length)];
      caption.textContent = randomNote;
    }
  });
}

function spawnFloatingHeart(x, y) {
  const heart = document.createElement('div');
  heart.textContent = '💖';
  heart.style.position = 'fixed';
  heart.style.left = `${x}px`;
  heart.style.top = `${y}px`;
  heart.style.fontSize = `${20 + Math.random() * 20}px`;
  heart.style.pointerEvents = 'none';
  heart.style.zIndex = '9999';
  heart.style.transition = 'all 1s cubic-bezier(0.2, 0.8, 0.2, 1)';
  document.body.appendChild(heart);

  requestAnimationFrame(() => {
    heart.style.transform = `translate(${(Math.random() - 0.5) * 80}px, -100px) scale(1.4)`;
    heart.style.opacity = '0';
  });

  setTimeout(() => heart.remove(), 1000);
}

/* ==========================================================
   5. VOUCHER REDEEM FUNCTIONALITY
   ========================================================== */
window.redeemCoupon = function(button, type) {
  if (button.classList.contains('redeemed')) return;

  button.classList.add('redeemed');
  button.innerHTML = 'Đã Đóng Dấu! 💖';

  // Small audio feedback
  playTone(523.25, 'triangle', 0.5, 0.1);
  setTimeout(() => playTone(659.25, 'triangle', 0.6, 0.1), 100);

  // Confetti burst on the button
  const rect = button.getBoundingClientRect();
  createConfettiBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, ['#ff477e', '#10b981', '#fbbf24']);
};

/* ==========================================================
   6. PLAYFUL RUNAWAY "HÔNG THÈM THA" BUTTON
   ========================================================== */
function initRunawayButton() {
  const noBtn = document.getElementById('forgive-no-btn');
  const yesBtn = document.getElementById('forgive-yes-btn');
  const funnyPlea = document.getElementById('funny-plea');
  if (!noBtn || !yesBtn) return;

  const playfulPleas = [
    "Ơ kìa Như Ý ơi... Anh không dám so sánh nữa đâu mừ 🥺",
    "Anh biết lỗi thật rồi... Vào game anh hứa nhường hết mạng cho em! 😭",
    "Công chúa Như Ý chơi hay nhất trần đời, tha thứ cho 'chatGPT của em' đi nha 🌸",
    "Anh hứa từ nay chỉ biết gánh và cưng chiều em thôi! 👉👈",
    "Nút này chịu thua rồi... Em bấm nút tha lỗi cho anh đi nha! ❤️"
  ];

  let dodgeCount = 0;
  let yesScale = 1;

  function dodgeButton(e) {
    if (e) e.preventDefault();
    dodgeCount++;

    // Grow the YES button to make it irresistible
    yesScale += 0.07;
    yesBtn.style.transform = `scale(${yesScale})`;

    // Pick random text for funny plea
    if (funnyPlea) {
      funnyPlea.classList.remove('hidden');
      funnyPlea.textContent = playfulPleas[(dodgeCount - 1) % playfulPleas.length];
    }

    // Move NO button away within reasonable bounds
    const maxOffset = Math.min(160, window.innerWidth / 3);
    const randomX = (Math.random() - 0.5) * maxOffset * 2;
    const randomY = (Math.random() - 0.5) * 80;

    noBtn.style.position = 'relative';
    noBtn.style.transform = `translate(${randomX}px, ${randomY}px)`;

    // Change button text playfully after a couple attempts
    if (dodgeCount === 2) {
      noBtn.querySelector('span').textContent = "Vẫn còn dỗi xíu... 🥺";
    } else if (dodgeCount >= 4) {
      noBtn.querySelector('span').textContent = "Không bấm được đâu nè! 😝";
    }
  }

  noBtn.addEventListener('mouseenter', dodgeButton);
  noBtn.addEventListener('touchstart', dodgeButton, { passive: false });
  noBtn.addEventListener('click', dodgeButton);
}

/* ==========================================================
   7. CELEBRATION MODAL & FORGIVENESS EXPERIENCE
   ========================================================== */
function initCelebrationFlow() {
  const yesBtn = document.getElementById('forgive-yes-btn');
  const modal = document.getElementById('celebration-modal');
  const replayBtn = document.getElementById('replay-btn');
  const shareZaloBtn = document.getElementById('share-zalo-btn');

  if (yesBtn && modal) {
    yesBtn.addEventListener('click', () => {
      // Play celebratory fanfare with Web Audio
      playCelebrationFanfare();

      // Launch full-screen fireworks & confetti
      launchCelebrationFireworks();

      // Show modal
      modal.classList.remove('hidden');
    });
  }

  if (replayBtn && modal) {
    replayBtn.addEventListener('click', () => {
      modal.classList.add('hidden');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  if (shareZaloBtn) {
    // When Như Ý clicks to tell him on message
    shareZaloBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const messageText = "Em Như Ý đã xem bức thư và tha lỗi cho 'chatGPT của em' rồi nha! Lần sau chơi game mà còn so sánh là biết tay em đó! Giờ dắt em đi ăn chuộc lỗi đi! 🥰💖";
      
      // Try to copy to clipboard so she can paste anywhere, and give prompt
      if (navigator.clipboard) {
        navigator.clipboard.writeText(messageText)
          .then(() => {
            alert("Đã sao chép lời nhắn dễ thương! Như Ý hãy gửi ngay cho 'chatGPT của em' qua Zalo/Messenger nha! 💕");
          })
          .catch(() => {
            window.location.href = `https://zalo.me/`;
          });
      }
    });
  }
}

function playCelebrationFanfare() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();

  const fanfare = [
    { f: 523.25, t: 0 },    // C5
    { f: 659.25, t: 150 },  // E5
    { f: 783.99, t: 300 },  // G5
    { f: 1046.50, t: 480 }  // C6
  ];

  fanfare.forEach(n => {
    setTimeout(() => {
      playTone(n.f, 'triangle', 1.0, 0.15);
    }, n.t);
  });
}

function launchCelebrationFireworks() {
  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * (window.innerHeight * 0.6);
      createConfettiBurst(x, y, ['#ff477e', '#ffd166', '#ff007f', '#4ade80', '#60a5fa']);
    }, i * 350);
  }
}

function createConfettiBurst(originX, originY, colors) {
  const count = 35;
  for (let i = 0; i < count; i++) {
    const confetti = document.createElement('div');
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = 8 + Math.random() * 10;
    const isHeart = Math.random() > 0.4;

    confetti.style.position = 'fixed';
    confetti.style.left = `${originX}px`;
    confetti.style.top = `${originY}px`;
    confetti.style.zIndex = '10000';
    confetti.style.pointerEvents = 'none';

    if (isHeart) {
      confetti.textContent = '💖';
      confetti.style.fontSize = `${size * 1.5}px`;
    } else {
      confetti.style.width = `${size}px`;
      confetti.style.height = `${size * 0.6}px`;
      confetti.style.backgroundColor = color;
      confetti.style.borderRadius = '2px';
    }

    document.body.appendChild(confetti);

    const angle = Math.random() * Math.PI * 2;
    const velocity = 80 + Math.random() * 180;
    const destX = Math.cos(angle) * velocity;
    const destY = Math.sin(angle) * velocity;
    const rotate = Math.random() * 720;

    confetti.animate([
      { transform: 'translate(0, 0) scale(1) rotate(0deg)', opacity: 1 },
      { transform: `translate(${destX}px, ${destY + 140}px) scale(0.6) rotate(${rotate}deg)`, opacity: 0 }
    ], {
      duration: 1200 + Math.random() * 600,
      easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
      fill: 'forwards'
    });

    setTimeout(() => confetti.remove(), 1800);
  }
}

/* ==========================================================
   8. PROMISE CARDS ACCESSIBILITY & MOBILE TAP SUPPORT
   ========================================================== */
function initCardFlipAccessibility() {
  const cards = document.querySelectorAll('.promise-card');
  cards.forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('flipped');
    });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.classList.toggle('flipped');
      }
    });
  });
}
