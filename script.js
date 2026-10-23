const body = document.body;
const sceneButtons = [...document.querySelectorAll('.scene-btn')];
const hangers = [...document.querySelectorAll('.hanger')];
const bubble = document.querySelector('.product-bubble');
const bubbleName = document.querySelector('.bubble-name');
const bubblePrice = document.querySelector('.bubble-price');

function setScene(name) {
  body.dataset.scene = name;
  sceneButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.scene === name);
  });
}

sceneButtons.forEach((button) => {
  button.addEventListener('click', () => setScene(button.dataset.scene));
});

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

hangers.forEach((hanger) => {
  let angle = 0;
  let velocity = 0;
  let dragging = false;
  let startX = 0;
  let startAngle = 0;
  let clickTimer = 0;

  function updateTransform() {
    hanger.style.transform = `rotateZ(${angle}deg)`;
  }

  function showBubble() {
    const rect = hanger.getBoundingClientRect();
    bubbleName.textContent = hanger.dataset.product;
    bubblePrice.textContent = hanger.dataset.price;
    bubble.style.left = `${rect.left + rect.width / 2}px`;
    bubble.style.top = `${rect.top - 10}px`;
    bubble.classList.add('visible');
    clearTimeout(clickTimer);
    clickTimer = setTimeout(() => bubble.classList.remove('visible'), 1200);
  }

  hanger.addEventListener('pointerdown', (event) => {
    dragging = true;
    startX = event.clientX;
    startAngle = angle;
    hanger.setPointerCapture(event.pointerId);
  });

  hanger.addEventListener('pointermove', (event) => {
    if (!dragging) return;
    const delta = event.clientX - startX;
    angle = clamp(startAngle + delta * 0.45, -28, 28);
    velocity = (angle - startAngle) * 0.18;
    updateTransform();
  });

  hanger.addEventListener('pointerup', () => {
    dragging = false;
    velocity = 0;
  });

  hanger.addEventListener('pointerleave', () => {
    if (!dragging) {
      angle += velocity;
      velocity *= 0.86;
      if (Math.abs(velocity) < 0.05) velocity = 0;
      angle = clamp(angle, -28, 28);
      updateTransform();
    }
  });

  hanger.addEventListener('click', (event) => {
    if (Math.abs(event.clientX - startX) < 6) {
      showBubble();
    }
  });

  function tick() {
    if (!dragging) {
      angle += velocity;
      velocity *= 0.84;
      if (Math.abs(velocity) < 0.02) velocity = 0;
      angle = clamp(angle, -28, 28);
      updateTransform();
    }
    requestAnimationFrame(tick);
  }

  updateTransform();
  requestAnimationFrame(tick);
});

setScene('boutique');
