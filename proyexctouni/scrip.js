document.addEventListener("DOMContentLoaded", () => {

  /* =========================================
     HERO SCROLL (index)
  ========================================== */
  const heroBtn = document.querySelector(".btn-primary");
  const sectionResenas = document.querySelector("#resenas");
  if (heroBtn && sectionResenas) {
    heroBtn.addEventListener("click", () => {
      sectionResenas.scrollIntoView({ behavior: "smooth" });
    });
  }

  /* =========================================
     HERO CARRUSEL (index)
  ========================================== */
  const heroCard = document.querySelector(".hero-image-card[data-hero-images]");
  const heroImg = document.getElementById("hero-img");
  const heroDots = document.getElementById("hero-dots");
  const heroPrev = document.querySelector(".hero-car-btn.prev");
  const heroNext = document.querySelector(".hero-car-btn.next");

  if (heroCard && heroImg) {
    const images = (heroCard.dataset.heroImages || "")
      .split(",")
      .map(s => s.trim())
      .filter(Boolean);

    let current = 0;
    let timer = null;

    const renderDots = () => {
      if (!heroDots) return;
      heroDots.innerHTML = "";

      images.forEach((_, idx) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "dot-btn" + (idx === current ? " active" : "");
        b.setAttribute("aria-label", `Ir a foto ${idx + 1}`);
        b.addEventListener("click", () => {
          current = idx;
          render();
          restartAuto();
        });
        heroDots.appendChild(b);
      });
    };

    const render = () => {
      if (!images.length) return;
      heroImg.src = images[current];
      heroImg.alt = `Portada del restaurante - foto ${current + 1}`;
      renderDots();
    };

    const next = () => {
      if (!images.length) return;
      current = (current + 1) % images.length;
      render();
    };

    const prev = () => {
      if (!images.length) return;
      current = (current - 1 + images.length) % images.length;
      render();
    };

    const startAuto = () => {
      if (images.length <= 1) return;
      timer = setInterval(next, 3500);
    };

    const stopAuto = () => {
      if (timer) clearInterval(timer);
      timer = null;
    };

    const restartAuto = () => {
      stopAuto();
      startAuto();
    };

    heroNext?.addEventListener("click", () => {
      next();
      restartAuto();
    });

    heroPrev?.addEventListener("click", () => {
      prev();
      restartAuto();
    });

    // Pausa al pasar mouse
    heroCard.addEventListener("mouseenter", stopAuto);
    heroCard.addEventListener("mouseleave", startAuto);

    // Flechas del teclado
    document.addEventListener("keydown", (e) => {
      const tag = document.activeElement?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea") return;

      if (e.key === "ArrowRight") { next(); restartAuto(); }
      if (e.key === "ArrowLeft") { prev(); restartAuto(); }
    });

    // Swipe móvil
    let startX = 0;
    let swiping = false;

    heroImg.addEventListener("pointerdown", (e) => {
      swiping = true;
      startX = e.clientX;
      heroImg.setPointerCapture(e.pointerId);
    });

    heroImg.addEventListener("pointerup", (e) => {
      if (!swiping) return;
      swiping = false;

      const dx = e.clientX - startX;
      if (Math.abs(dx) > 50) {
        dx < 0 ? next() : prev();
        restartAuto();
      }
    });

    render();
    startAuto();
  }

  /* =========================================
     FILTROS DE RESEÑAS (resenas.html)
  ========================================== */
  const filterButtons = document.querySelectorAll(".filter-btn");
  const cards = document.querySelectorAll(".review-card");

  if (filterButtons.length && cards.length) {
    filterButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const filter = btn.dataset.filter;

        filterButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        cards.forEach((card) => {
          const tipo = card.dataset.tipo;
          if (filter === "todos" || tipo === filter) {
            card.style.display = "grid";
          } else {
            card.style.display = "none";
          }
        });
      });
    });
  }

  /* =========================================
     LEER MÁS (resenas.html)
  ========================================== */
  const leerMasBtns = document.querySelectorAll(".btn-leer-mas");
  if (leerMasBtns.length) {
    leerMasBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const card = btn.closest(".review-card");
        if (!card) return;

        const extra = card.querySelector(".review-extra");
        if (!extra) return;

        extra.classList.toggle("show");
        btn.textContent = extra.classList.contains("show") ? "Leer menos" : "Leer más";
      });
    });
  }

  /* =========================================
     BOTÓN SUBIR (todas)
  ========================================== */
  const btnSubir = document.getElementById("btn-subir");
  if (btnSubir) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 350) btnSubir.classList.add("show");
      else btnSubir.classList.remove("show");
    });

    btnSubir.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* =========================================
     VALIDACIÓN EMAIL (contacto.html)
  ========================================== */
  const contactForm = document.querySelector(".contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      const emailInput = contactForm.querySelector("#email");
      if (!emailInput) return;

      const email = emailInput.value.trim();
      const emailRegex =
        /^[^\s@]+@[^\s@]+\.(com(\.bo)?|bo|net|org|edu|gov|info|biz|co|es|ar|cl)$/i;

      if (!emailRegex.test(email)) {
        e.preventDefault();
        alert("Ingresa un correo con un dominio válido (.com, .bo, .net, .org, etc.).");
        emailInput.focus();
      }
    });
  }
});
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault(); // evita POST y el 405

    // fuerza validación HTML (required + pattern)
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    // Mensaje demo (bonito para presentación)
    const ok = document.createElement("div");
    ok.className = "card";
    ok.style.marginTop = "12px";
    ok.innerHTML = `
      <h3 style="margin:0 0 6px 0;">✅ Mensaje enviado (modo demostración)</h3>
      <p style="margin:0; font-size:.95rem;">
        Esto es una simulación académica: no se guardan ni envían datos reales.
      </p>
    `;

    // Evita duplicar mensaje si envían varias veces
    const existente = document.getElementById("demoMsg");
    if (existente) existente.remove();
    ok.id = "demoMsg";

    form.reset();
    form.parentNode.insertBefore(ok, form.nextSibling);
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  if (!form) return;

  // Si había algún handler viejo haciendo POST/fetch, esto lo pisa.
  form.addEventListener("submit", (e) => {
    e.preventDefault(); // <- mata el envío real (adiós 405)

    // Validación nativa (required + pattern)
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    // "Guardar" modo demo (localStorage)
    const data = {
      nombre: form.nombre?.value ?? "",
      email: form.email?.value ?? "",
      tipo: form["tipo-visita"]?.value ?? "",
      mensaje: form.mensaje?.value ?? "",
      fecha: new Date().toISOString()
    };

    localStorage.setItem("contacto_demo_guardado", JSON.stringify(data));

    // Recarga la misma página (lo que tú pediste)
    location.reload();
  });

  // Opcional: al volver a cargar, mostrar que "se guardó"
  const saved = localStorage.getItem("contacto_demo_guardado");
  if (saved) {
    const box = document.createElement("div");
    box.className = "card";
    box.style.marginTop = "12px";
    box.innerHTML = `
      <h3 style="margin:0 0 6px 0;">✅ Guardado (demo)</h3>
      <p style="margin:0; font-size:.95rem;">
        Se guardó localmente en este navegador (no se envía a ningún servidor).
      </p>
    `;
    form.parentNode.insertBefore(box, form.nextSibling);

    // Si no quieres que aparezca siempre, descomenta esta línea:
    // localStorage.removeItem("contacto_demo_guardado");
  }
});