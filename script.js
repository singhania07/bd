let score = 0;
const targetScore = 34; // Secret target age (34)
let spawnerInterval;
let basketX = window.innerWidth / 2;
const basket = document.getElementById('basket');

function startGame() {
  document.getElementById('start-screen').classList.add('hidden');
  document.getElementById('game-container').classList.remove('hidden');

  window.addEventListener('mousemove', (e) => moveBasket(e.clientX));
  window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) moveBasket(e.touches[0].clientX);
  });

  spawnerInterval = setInterval(spawnCake, 500);
}

function moveBasket(x) {
  basketX = x;
  if (basketX < 40) basketX = 40;
  if (basketX > window.innerWidth - 40) basketX = window.innerWidth - 40;
  basket.style.left = basketX + 'px';
}

function spawnCake() {
  const playArea = document.getElementById('play-area');
  const cake = document.createElement('div');
  cake.classList.add('falling-item');
  cake.innerHTML = '🎂';

  const randomX = Math.random() * (window.innerWidth - 80) + 20;
  cake.style.left = randomX + 'px';

  const duration = Math.random() * 1.5 + 2;
  cake.style.animationDuration = duration + 's';

  playArea.appendChild(cake);

  const checkInterval = setInterval(() => {
    const cakeRect = cake.getBoundingClientRect();
    const basketRect = basket.getBoundingClientRect();

    if (
      cakeRect.bottom >= basketRect.top + 10 &&
      cakeRect.top <= basketRect.bottom &&
      cakeRect.left >= basketRect.left - 25 &&
      cakeRect.right <= basketRect.right + 25
    ) {
      score++;
      document.getElementById('score').innerText = score;
      
      showFeedback(cakeRect.left, cakeRect.top, '+1 🎂', '#ffa502');

      cake.remove();
      clearInterval(checkInterval);

      if (score >= targetScore) {
        endGame();
      }
    }

    if (cakeRect.top > window.innerHeight) {
      cake.remove();
      clearInterval(checkInterval);
    }
  }, 40);
}

function showFeedback(x, y, text, color) {
  const popup = document.createElement('div');
  popup.className = 'popup-text';
  popup.innerText = text;
  popup.style.left = x + 'px';
  popup.style.top = y + 'px';
  popup.style.color = color;

  document.body.appendChild(popup);
  setTimeout(() => popup.remove(), 800);
}

function endGame() {
  clearInterval(spawnerInterval);
  document.querySelectorAll('.falling-item').forEach(el => el.remove());

  // Hide Game Screen
  document.getElementById('game-container').classList.add('hidden');

  // Reveal Growing Side Trees & Poppers!
  document.getElementById('celebration-fx').classList.remove('hidden');

  // Reveal Main Celebration Screen
  document.getElementById('final-screen').classList.remove('hidden');

  // Play Music
  const music = document.getElementById('bg-music');
  music.play().catch(e => console.log("Audio play blocked:", e));

  // Continuous Confetti Cannon Blasts from Side Trees
  const duration = 6 * 1000;
  const end = Date.now() + duration;

  (function frame() {
    // Left Tree Popper Blast
    confetti({
      particleCount: 10,
      angle: 60,
      spread: 75,
      origin: { x: 0.1, y: 0.85 }
    });
    // Right Tree Popper Blast
    confetti({
      particleCount: 10,
      angle: 120,
      spread: 75,
      origin: { x: 0.9, y: 0.85 }
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}