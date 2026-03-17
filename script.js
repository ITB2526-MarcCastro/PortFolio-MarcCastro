/* ============================================================
   BARRA ARRASTRABLE – VOLVER ARRIBA
   ============================================================ */
(function () {
  const dragBar = document.createElement("div");
  dragBar.id = "dragBar";
  dragBar.textContent = "⬆";
  document.body.appendChild(dragBar);

  let isDragging = false;
  let offsetX = 0, offsetY = 0;

  dragBar.addEventListener("mousedown", (e) => {
    isDragging = true;
    offsetX = e.clientX - dragBar.offsetLeft;
    offsetY = e.clientY - dragBar.offsetTop;
    dragBar.style.cursor = "grabbing";
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    dragBar.style.left = `${e.clientX - offsetX}px`;
    dragBar.style.top = `${e.clientY - offsetY}px`;
    dragBar.style.right = "auto";
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
    dragBar.style.cursor = "grab";
  });

  dragBar.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
})();


/* ============================================================
   VALIDACIÓN FORMULARIO
   ============================================================ */
(function () {
  document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    if (!form) return;

    form.addEventListener("submit", (e) => {
      const email = form.querySelector("input[type='email']");
      const name = form.querySelector("input[name='name']");
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (name && !name.value.trim()) {
        alert("Por favor, introduce tu nombre.");
        e.preventDefault();
      } else if (email && !emailRegex.test(email.value)) {
        alert("Introduce un correo válido.");
        e.preventDefault();
      }
    });
  });
})();


/* ============================================================
   PARTÍCULAS – VERSIÓ AMB BRILLO (GROC VISIBLE I LLUM)
   ============================================================ */
(function () {
  const canvas = document.getElementById("particles");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  const particles = [];
  const NUM = 20; // una mica més de partícules
  const mouse = { x: null, y: null, radius: 150 };

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.radius = 3.5; // més gran per ser més visible
      this.dx = (Math.random() - 0.5) * 1.5;
      this.dy = (Math.random() - 0.5) * 1.5;
    }

    draw() {
      ctx.save();
      // efecte de glow: ombra amb color groc
      ctx.shadowBlur = 14;
      ctx.shadowColor = "rgba(255,209,0,0.95)";
      ctx.fillStyle = "#ffd100"; // groc idèntic al de la llista
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    update() {
      this.x += this.dx;
      this.y += this.dy;

      if (this.x < -10) this.x = canvas.width + 10;
      if (this.x > canvas.width + 10) this.x = -10;
      if (this.y < -10) this.y = canvas.height + 10;
      if (this.y > canvas.height + 10) this.y = -10;

      if (mouse.x && mouse.y) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          this.x += dx / 50;
          this.y += dy / 50;
        }
      }

      this.draw();
    }
  }

  // Crear partícules
  for (let i = 0; i < NUM; i++) particles.push(new Particle());

  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibuixar i actualitzar partícules
    particles.forEach(p => p.update());

    // Dibuixar línies entre partícules amb efecte lluminós groc
    ctx.save();
    ctx.globalCompositeOperation = "lighter"; // sumar colors per intensificar llum
    ctx.lineWidth = 1.2;
    for (let i = 0; i < NUM; i++) {
      for (let j = i + 1; j < NUM; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 140) {
          // la transparència depèn de la distància (més a prop -> més brillant)
          const alpha = Math.max(0.12, 1 - dist / 140) * 0.95;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(255,209,0,${alpha})`; // groc amb alpha variable
          // lleu glow per a les línies
          ctx.shadowBlur = 10;
          ctx.shadowColor = "rgba(255,209,0,0.85)";
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    ctx.restore();

    requestAnimationFrame(animate);
  }
  animate();
})();


/* ============================================================
   CONTADOR DE TIEMPO EN PÁGINA (UNIFICADO)
   ============================================================ */
(function () {
  const timerSpan = document.querySelector("#pageTimer .pt-time");
  if (!timerSpan) return;

  const key = "pageTimerMs";
  const saved = sessionStorage.getItem(key);
  let baseMs = saved ? parseInt(saved) : 0;
  let start = performance.now();

  function update() {
    const elapsed = baseMs + (performance.now() - start);
    const total = Math.floor(elapsed / 1000);
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;

    timerSpan.textContent =
      h > 0
        ? `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
        : `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;

    requestAnimationFrame(update);
  }
  update();

  window.addEventListener("beforeunload", () => {
    const current = baseMs + (performance.now() - start);
    sessionStorage.setItem(key, String(current));
  });
})();

/* ============================================================
   FORÇAR THEME OSCUR PER DEFECTE
   ============================================================ */
document.documentElement.classList.add('dark-mode');
