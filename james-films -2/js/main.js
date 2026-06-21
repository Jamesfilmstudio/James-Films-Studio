/**
 * JAMES FILMS — MAIN SCRIPT
 * Handles: loader, nav, scroll reveals, portfolio render + filter + modal,
 * testimonials slider, before/after reveal slider, FAQ accordion,
 * stat counters, mouse-reactive glow, contact form, social icons.
 */

(function () {
  "use strict";

  /* ============================================================
     LOADER
     ============================================================ */
  window.addEventListener("load", () => {
    const loader = document.getElementById("loader");
    setTimeout(() => {
      loader.classList.add("is-hidden");
      document.body.style.overflow = "";
    }, 1700);
  });

  /* ============================================================
     SCROLL PROGRESS — "tension line"
     ============================================================ */
  const tensionLine = document.getElementById("tensionLine");
  function updateTensionLine() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    tensionLine.style.width = pct + "%";
  }
  window.addEventListener("scroll", updateTensionLine, { passive: true });
  updateTensionLine();

  /* ============================================================
     NAV — scrolled state + mobile menu
     ============================================================ */
  const nav = document.getElementById("nav");
  function updateNavState() {
    nav.classList.toggle("is-scrolled", window.scrollY > 40);
  }
  window.addEventListener("scroll", updateNavState, { passive: true });
  updateNavState();

  const navBurger = document.getElementById("navBurger");
  const navMobile = document.getElementById("navMobile");
  navBurger.addEventListener("click", () => {
    const isOpen = navBurger.classList.toggle("is-open");
    navMobile.classList.toggle("is-open", isOpen);
    navBurger.setAttribute("aria-expanded", String(isOpen));
  });
  navMobile.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navBurger.classList.remove("is-open");
      navMobile.classList.remove("is-open");
      navBurger.setAttribute("aria-expanded", "false");
    });
  });

  /* ============================================================
     SCROLL REVEALS — IntersectionObserver on [data-reveal]
     ============================================================ */
  const revealTargets = document.querySelectorAll("[data-reveal]");
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
  );
  revealTargets.forEach((el) => revealObserver.observe(el));

  /* ============================================================
     STAT COUNTERS
     ============================================================ */
  const statEls = document.querySelectorAll(".stat");
  const statObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.getAttribute("data-count"), 10);
        const valueEl = el.querySelector(".stat__value");
        const duration = 1600;
        const start = performance.now();
        function tick(now) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          valueEl.textContent = Math.round(eased * target);
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        statObserver.unobserve(el);
      });
    },
    { threshold: 0.4 }
  );
  statEls.forEach((el) => statObserver.observe(el));

  /* ============================================================
     PORTFOLIO — render from data/projects.js, filters, modal
     ============================================================ */
  const workGrid = document.getElementById("workGrid");
  const workFilters = document.getElementById("workFilters");
  const projectModal = document.getElementById("projectModal");

  function playIconSVG() {
    return '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';
  }

  function renderFilters(categories) {
    const all = ["All", ...categories];
    workFilters.innerHTML = all
      .map(
        (cat, i) =>
          `<button class="work__filter${i === 0 ? " is-active" : ""}" data-filter="${cat}">${cat}</button>`
      )
      .join("");
  }

  function renderCards(list) {
    workGrid.innerHTML = list
      .map(
        (p, i) => `
        <div class="project-card" data-index="${i}" tabindex="0" role="button" aria-label="View ${p.title}">
          <img class="project-card__img" src="${p.thumbnail}" alt="${p.title} poster" loading="lazy" />
          ${p.previewVideo ? `<video class="project-card__video" src="${p.previewVideo}" muted loop playsinline preload="none"></video>` : ""}
          <div class="project-card__play">${playIconSVG()}</div>
          <div class="project-card__overlay">
            <div class="project-card__category">${p.category}</div>
            <div class="project-card__title">${p.title}</div>
          </div>
        </div>`
      )
      .join("");

    // Animate cards in as they're added (mirrors the reveal pattern)
    requestAnimationFrame(() => {
      const cards = workGrid.querySelectorAll(".project-card");
      cards.forEach((card, i) => {
        setTimeout(() => card.classList.add("is-visible"), i * 70);
      });
    });

    // Hover-preview video playback
    workGrid.querySelectorAll(".project-card").forEach((card) => {
      const video = card.querySelector(".project-card__video");
      if (video) {
        card.addEventListener("mouseenter", () => video.play().catch(() => {}));
        card.addEventListener("mouseleave", () => {
          video.pause();
          video.currentTime = 0;
        });
      }
      const openModal = () => openProjectModal(list[parseInt(card.getAttribute("data-index"), 10)]);
      card.addEventListener("click", openModal);
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openModal();
        }
      });
    });
  }

  function initPortfolio() {
    if (typeof PROJECTS === "undefined" || !PROJECTS.length) {
      workGrid.innerHTML = '<p style="color:var(--gray); text-align:center; grid-column: 1/-1;">No projects yet — add some in data/projects.js</p>';
      return;
    }
    const categories = [...new Set(PROJECTS.map((p) => p.category))];
    renderFilters(categories);
    renderCards(PROJECTS);

    workFilters.addEventListener("click", (e) => {
      const btn = e.target.closest(".work__filter");
      if (!btn) return;
      workFilters.querySelectorAll(".work__filter").forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      const filter = btn.getAttribute("data-filter");
      const filtered = filter === "All" ? PROJECTS : PROJECTS.filter((p) => p.category === filter);
      renderCards(filtered);
    });
  }

  function openProjectModal(project) {
    if (!project) return;
    document.getElementById("modalImage").src = project.thumbnail;
    document.getElementById("modalImage").alt = project.title + " poster";
    document.getElementById("modalCategory").textContent = project.category;
    document.getElementById("modalTitle").textContent = project.title;
    const metaParts = [project.client, project.year].filter(Boolean);
    document.getElementById("modalMeta").textContent = metaParts.join(" · ");
    document.getElementById("modalDesc").textContent = project.description;
    document.getElementById("modalLink").href = project.videoUrl || "#";
    projectModal.classList.add("is-open");
    projectModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeProjectModal() {
    projectModal.classList.remove("is-open");
    projectModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  document.getElementById("modalClose").addEventListener("click", closeProjectModal);
  document.getElementById("modalBackdrop").addEventListener("click", closeProjectModal);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && projectModal.classList.contains("is-open")) closeProjectModal();
  });

  initPortfolio();

  /* ============================================================
     BEFORE / AFTER REVEAL SLIDER
     ============================================================ */
  const revealSliderEl = document.getElementById("revealSlider");
  const revealBefore = document.getElementById("revealBefore");
  const revealHandle = document.getElementById("revealHandle");
  const revealInput = document.getElementById("revealInput");

  function setRevealPosition(pct) {
    pct = Math.max(0, Math.min(100, pct));
    revealBefore.style.width = pct + "%";
    revealHandle.style.left = pct + "%";
  }
  revealInput.addEventListener("input", (e) => setRevealPosition(parseFloat(e.target.value)));
  setRevealPosition(50);

  // Allow dragging anywhere on the slider, not just the native input thumb
  let isDraggingReveal = false;
  function revealPosFromEvent(e) {
    const rect = revealSliderEl.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    return (x / rect.width) * 100;
  }
  revealSliderEl.addEventListener("mousedown", (e) => {
    isDraggingReveal = true;
    const pct = revealPosFromEvent(e);
    setRevealPosition(pct);
    revealInput.value = pct;
  });
  window.addEventListener("mousemove", (e) => {
    if (!isDraggingReveal) return;
    const pct = revealPosFromEvent(e);
    setRevealPosition(pct);
    revealInput.value = pct;
  });
  window.addEventListener("mouseup", () => (isDraggingReveal = false));
  revealSliderEl.addEventListener(
    "touchmove",
    (e) => {
      const pct = revealPosFromEvent(e);
      setRevealPosition(pct);
      revealInput.value = pct;
    },
    { passive: true }
  );

  /* ============================================================
     TESTIMONIALS SLIDER
     ============================================================ */
  const TESTIMONIALS = [
    {
      text: "James turned three hours of raw concert footage into something that felt like a studio music video. The pacing alone got us double the usual engagement.",
      name: "Maya Chen",
      role: "Recording Artist, Echo Park",
    },
    {
      text: "We've worked with three other editors before. None of them understood pacing for retention the way this edit does. Our completion rate jumped immediately.",
      name: "Daniel Osei",
      role: "Founder, Forge Athletics",
    },
    {
      text: "The turnaround was fast, but it never felt rushed. Every cut had a reason. That's rare.",
      name: "Priya Nair",
      role: "Marketing Lead, Vantage Tech",
    },
    {
      text: "Professional, fast, and the final product looked like it belonged on a streaming platform, not a social feed.",
      name: "Marcus Reed",
      role: "Independent Filmmaker",
    },
  ];

  const testimonialsTrack = document.getElementById("testimonialsTrack");
  const testimonialsDots = document.getElementById("testimonialsDots");
  let currentTestimonial = 0;
  let testimonialInterval;

  function renderTestimonials() {
    testimonialsTrack.innerHTML = TESTIMONIALS.map(
      (t) => `
      <div class="testimonial">
        <div class="testimonial__quote-mark">&ldquo;</div>
        <p class="testimonial__text">${t.text}</p>
        <div class="testimonial__name">${t.name}</div>
        <div class="testimonial__role">${t.role}</div>
      </div>`
    ).join("");

    testimonialsDots.innerHTML = TESTIMONIALS.map(
      (_, i) => `<button class="testimonials__dot${i === 0 ? " is-active" : ""}" data-index="${i}" aria-label="Go to testimonial ${i + 1}"></button>`
    ).join("");

    testimonialsDots.querySelectorAll(".testimonials__dot").forEach((dot) => {
      dot.addEventListener("click", () => {
        goToTestimonial(parseInt(dot.getAttribute("data-index"), 10));
        resetTestimonialInterval();
      });
    });
  }

  function goToTestimonial(index) {
    currentTestimonial = index;
    testimonialsTrack.style.transform = `translateX(-${index * 100}%)`;
    testimonialsDots.querySelectorAll(".testimonials__dot").forEach((dot, i) => {
      dot.classList.toggle("is-active", i === index);
    });
  }

  function resetTestimonialInterval() {
    clearInterval(testimonialInterval);
    testimonialInterval = setInterval(() => {
      goToTestimonial((currentTestimonial + 1) % TESTIMONIALS.length);
    }, 6000);
  }

  renderTestimonials();
  resetTestimonialInterval();

  /* ============================================================
     FAQ ACCORDION
     ============================================================ */
  const FAQS = [
    {
      q: "What footage do you need from me?",
      a: "Send your raw clips through any file-sharing link — Google Drive, Dropbox, WeTransfer, or similar. If you're unsure what to capture before filming, I'll walk you through a simple shot list during the discovery call.",
    },
    {
      q: "How long does a typical edit take?",
      a: "Turnaround depends on the tier: Essential projects ship in 5 business days, Signature in 3, and Studio clients get priority scheduling. Rush delivery is available on request.",
    },
    {
      q: "How many revisions are included?",
      a: "Every tier includes structured revision rounds — 2 for Essential, 3 for Signature, and unlimited minor revisions for Studio partners. Major scope changes outside the original brief are quoted separately.",
    },
    {
      q: "Do you handle color grading and sound design?",
      a: "Yes — every package includes color correction at minimum, with full cinematic grading and sound design included from the Signature tier up.",
    },
    {
      q: "What formats and aspect ratios do you deliver?",
      a: "Final files are delivered in whatever combination you need: 16:9 for YouTube and web, 9:16 for Reels and TikTok, and 1:1 for feed posts — all from a single project.",
    },
    {
      q: "Can we work together on an ongoing basis?",
      a: "That's exactly what the Studio tier is built for — a dedicated monthly retainer with a consistent editor, priority turnaround, and planning calls to keep your content calendar moving.",
    },
  ];

  const faqList = document.getElementById("faqList");
  faqList.innerHTML = FAQS.map(
    (f, i) => `
    <div class="faq-item" data-reveal>
      <button class="faq-item__question" data-index="${i}" aria-expanded="false">
        <span>${f.q}</span>
        <span class="faq-item__icon"></span>
      </button>
      <div class="faq-item__answer">
        <p>${f.a}</p>
      </div>
    </div>`
  ).join("");

  faqList.querySelectorAll(".faq-item__question").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".faq-item");
      const answer = item.querySelector(".faq-item__answer");
      const isOpen = item.classList.contains("is-open");

      // Close all others (accordion behavior)
      faqList.querySelectorAll(".faq-item").forEach((other) => {
        other.classList.remove("is-open");
        other.querySelector(".faq-item__answer").style.maxHeight = null;
        other.querySelector(".faq-item__question").setAttribute("aria-expanded", "false");
      });

      if (!isOpen) {
        item.classList.add("is-open");
        answer.style.maxHeight = answer.scrollHeight + "px";
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });

  // Recalculate open answer height on resize, so text reflow never clips
  window.addEventListener("resize", () => {
    const openItem = faqList.querySelector(".faq-item.is-open");
    if (openItem) {
      const answer = openItem.querySelector(".faq-item__answer");
      answer.style.maxHeight = answer.scrollHeight + "px";
    }
  });

  // Re-observe newly injected FAQ reveal items
  faqList.querySelectorAll("[data-reveal]").forEach((el) => revealObserver.observe(el));

  /* ============================================================
     SOCIAL LINKS — footer icons
     ============================================================ */
  const ICONS = {
    instagram:
      '<svg viewBox="0 0 24 24"><path d="M12 2.2c3.2 0 3.6 0 4.85.07 1.17.06 1.97.24 2.43.4a4.92 4.92 0 0 1 1.77 1.15 4.92 4.92 0 0 1 1.15 1.77c.16.46.34 1.26.4 2.43.06 1.25.07 1.65.07 4.85s0 3.6-.07 4.85c-.06 1.17-.24 1.97-.4 2.43a4.92 4.92 0 0 1-1.15 1.77 4.92 4.92 0 0 1-1.77 1.15c-.46.16-1.26.34-2.43.4-1.25.06-1.65.07-4.85.07s-3.6 0-4.85-.07c-1.17-.06-1.97-.24-2.43-.4a4.92 4.92 0 0 1-1.77-1.15 4.92 4.92 0 0 1-1.15-1.77c-.16-.46-.34-1.26-.4-2.43C2.2 15.6 2.2 15.2 2.2 12s0-3.6.07-4.85c.06-1.17.24-1.97.4-2.43A4.92 4.92 0 0 1 3.82 3a4.92 4.92 0 0 1 1.77-1.15c.46-.16 1.26-.34 2.43-.4C9.27 2.2 9.67 2.2 12 2.2zm0 1.8c-3.15 0-3.52 0-4.76.07-.96.04-1.48.2-1.82.34-.46.18-.78.39-1.13.73-.34.35-.55.67-.73 1.13-.14.34-.3.86-.34 1.82C3.2 8.84 3.2 9.21 3.2 12s0 3.16.07 4.4c.04.96.2 1.48.34 1.82.18.46.39.78.73 1.13.35.34.67.55 1.13.73.34.14.86.3 1.82.34 1.24.06 1.6.07 4.76.07s3.52 0 4.76-.07c.96-.04 1.48-.2 1.82-.34.46-.18.78-.39 1.13-.73.34-.35.55-.67.73-1.13.14-.34.3-.86.34-1.82.06-1.24.07-1.6.07-4.4s0-3.16-.07-4.4c-.04-.96-.2-1.48-.34-1.82a2.99 2.99 0 0 0-.73-1.13 2.99 2.99 0 0 0-1.13-.73c-.34-.14-.86-.3-1.82-.34C15.52 4 15.16 4 12 4zm0 3.05a4.95 4.95 0 1 1 0 9.9 4.95 4.95 0 0 1 0-9.9zm0 1.8a3.15 3.15 0 1 0 0 6.3 3.15 3.15 0 0 0 0-6.3zm5.6-2.95a1.16 1.16 0 1 1-2.32 0 1.16 1.16 0 0 1 2.32 0z"/></svg>',
    youtube:
      '<svg viewBox="0 0 24 24"><path d="M21.6 7.2s-.21-1.5-.87-2.17c-.83-.87-1.76-.87-2.18-.92C15.6 4 12 4 12 4h-.01s-3.6 0-6.55.11c-.42.05-1.35.05-2.18.92-.66.67-.87 2.17-.87 2.17S2.18 9 2.18 10.78v1.42c0 1.78.21 3.58.21 3.58s.21 1.5.87 2.17c.83.87 1.92.84 2.4.93 1.74.17 7.34.21 7.34.21s3.6 0 6.55-.11c.42-.05 1.35-.05 2.18-.92.66-.67.87-2.17.87-2.17s.21-1.8.21-3.58v-1.42c0-1.78-.21-3.58-.21-3.58zM9.96 14.98V8.98l5.75 3-5.75 3z"/></svg>',
    tiktok:
      '<svg viewBox="0 0 24 24"><path d="M16.6 5.82a4.55 4.55 0 0 1-3.77-4V1.5h-3.4v14.6a2.6 2.6 0 1 1-1.84-2.49V10.4a5.9 5.9 0 1 0 5.24 5.86V9.1a7.9 7.9 0 0 0 4.6 1.48V7.16a4.55 4.55 0 0 1-.83-1.34z"/></svg>',
    twitter:
      '<svg viewBox="0 0 24 24"><path d="M18.9 3h2.7l-5.9 6.74L22.6 21h-5.5l-4.3-5.62L7.8 21H5.1l6.3-7.2L4.4 3h5.6l3.9 5.13L18.9 3zm-1.9 16.2h1.5L8.1 4.7H6.5l10.5 14.5z"/></svg>',
    linkedin:
      '<svg viewBox="0 0 24 24"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.03-1.85-3.03-1.85 0-2.14 1.45-2.14 2.94v5.66H9.36V9h3.41v1.56h.05c.47-.9 1.64-1.85 3.38-1.85 3.61 0 4.28 2.38 4.28 5.47v6.27zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM3.56 20.45h3.56V9H3.56v11.45z"/></svg>',
  };

  const footerSocial = document.getElementById("footerSocial");
  if (typeof SOCIAL_LINKS !== "undefined") {
    const links = Object.entries(SOCIAL_LINKS).filter(([, url]) => url && url.trim().length > 0);
    footerSocial.innerHTML = links
      .map(
        ([platform, url]) => `
        <a href="${url}" target="_blank" rel="noopener noreferrer" class="footer__social-link" aria-label="${platform}">
          ${ICONS[platform] || ""}
        </a>`
      )
      .join("");
  }

  document.getElementById("footerYear").textContent = new Date().getFullYear();

  /* ============================================================
     CONTACT FORM — client-side handling
     ============================================================ */
  const contactForm = document.getElementById("contactForm");
  const contactStatus = document.getElementById("contactStatus");
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("cf-name").value.trim();
    contactStatus.textContent = `Thanks${name ? ", " + name : ""} — your inquiry has been noted. (Connect this form to your email or CRM to receive submissions.)`;
    contactForm.reset();
  });

  /* ============================================================
     MOUSE-REACTIVE GLOW — hero
     ============================================================ */
  const heroGlow = document.querySelector(".hero__glow");
  const heroSection = document.getElementById("hero");
  if (heroGlow && heroSection && window.matchMedia("(pointer: fine)").matches) {
    heroSection.addEventListener("mousemove", (e) => {
      const rect = heroSection.getBoundingClientRect();
      const xPct = (e.clientX - rect.left) / rect.width;
      const yPct = (e.clientY - rect.top) / rect.height;
      const shiftX = (xPct - 0.5) * 60;
      const shiftY = (yPct - 0.5) * 40;
      heroGlow.style.transform = `translate(calc(-50% + ${shiftX}px), ${shiftY}px)`;
    });
  }
})();
