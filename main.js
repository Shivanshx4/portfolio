/*
 * Shivansh's Premium Developer Portfolio Orchestration
 * Core JS Scroll Engine & Timelines
 */

document.addEventListener("DOMContentLoaded", () => {
  
  // Register GSAP ScrollTrigger plugin
  gsap.registerPlugin(ScrollTrigger);

  // Core Variables
  const preloaderNum = document.getElementById("preloader-num");
  const preloader = document.querySelector(".preloader");
  const curtainBars = document.querySelectorAll(".curtain-bar");
  
  // 1. Grid-Curtain Preloader Logic
  let count = 0;
  const counterInterval = setInterval(() => {
    count += Math.floor(Math.random() * 8) + 2; // Random increment to feel dynamic
    if (count >= 100) {
      count = 100;
      clearInterval(counterInterval);
      playCurtainReveal();
    }
    // Format counter with leading zeros
    preloaderNum.innerHTML = `${count < 10 ? '0' : ''}${count}<span>%</span>`;
  }, 60);

  function playCurtainReveal() {
    const revealTimeline = gsap.timeline({
      onComplete: () => {
        // Remove preloader container elements from DOM to free memory & enable interactions
        preloader.style.display = "none";
        preloaderNum.style.display = "none";
        // Initialize dynamic scroll triggers once preloader is gone
        initLenisAndScrollTriggers();
      }
    });

    // Stagger count out
    revealTimeline.to(preloaderNum, {
      opacity: 0,
      y: -50,
      duration: 0.6,
      ease: "power2.in"
    });

    // Curtain bars lift stagger
    revealTimeline.to(curtainBars, {
      yPercent: -100,
      duration: 1.2,
      stagger: {
        amount: 0.5,
        from: "random"
      },
      ease: "power4.inOut"
    }, "-=0.3");

    // Hero content entrance
    revealTimeline.from(".hero-title", {
      y: 100,
      opacity: 0,
      duration: 1.2,
      ease: "power4.out"
    }, "-=0.6");

    revealTimeline.from(".hero-subtitle", {
      opacity: 0,
      letterSpacing: "0.05em",
      duration: 0.8,
      ease: "power2.out"
    }, "-=0.8");

    revealTimeline.from(".hero-meta-summary, .hero-explore-btn", {
      opacity: 0,
      y: 20,
      duration: 0.8,
      stagger: 0.2,
      ease: "power2.out"
    }, "-=0.6");
  }

  // Interactive mouse glow inside Hero
  const heroSection = document.getElementById("hero");
  const glowSphere = document.querySelector(".hero-glow-sphere");
  const bgGrid = document.querySelector(".hero-bg-grid");

  if (heroSection && glowSphere && bgGrid) {
    heroSection.addEventListener("mousemove", (e) => {
      const rect = heroSection.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      // Smooth lag animation using GSAP
      gsap.to(glowSphere, {
        x: x * 0.4,
        y: y * 0.4,
        duration: 0.6,
        ease: "power2.out"
      });

      gsap.to(bgGrid, {
        x: x * 0.05,
        y: y * 0.05,
        duration: 0.8,
        ease: "power2.out"
      });
    });
  }

  // 2. Initialize Lenis Momentum Scroll and GSAP ScrollTriggers
  function initLenisAndScrollTriggers() {
    
    // Smooth Scrolling reset
    window.scrollTo(0, 0);
    history.scrollRestoration = "manual";

    // Setup Lenis Scroll loop
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      infinite: false
    });

    lenis.on("scroll", ScrollTrigger.update);

    // Sync GSAP frame ticker
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    
    gsap.ticker.lagSmoothing(0);

    // Initializing custom sections based on viewport width
    initAboutGalleryTimeline();
    initProjectsHorizontalTimeline();
    initCapabilitiesTimeline();
    initMLSandbox();
  }

  // 3. About Section: Pinned overlay cards & floating cards parallax
  function initAboutGalleryTimeline() {
    const aboutSection = document.getElementById("about");
    const pinnedTrigger = document.getElementById("about-pinned-trigger");
    const cards = [
      document.getElementById("about-card-1"),
      document.getElementById("about-card-2"),
      document.getElementById("about-card-3"),
      document.getElementById("about-card-4")
    ];

    if (!aboutSection || !pinnedTrigger) return;

    // A. Pin Text Cards (Only on Desktop/Larger screens)
    if (window.innerWidth > 1024) {
      // Create a unified smooth timeline with 1.5s scrub inertia!
      const aboutTL = gsap.timeline({
        scrollTrigger: {
          trigger: aboutSection,
          pin: pinnedTrigger,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.5,
          invalidateOnRefresh: true
        }
      });

      // Synchronize Card Cross-Fades (Snappy, overlapping and fully tracked)
      aboutTL.to(cards[0], { opacity: 0, yPercent: -15, duration: 0.8 })
             .fromTo(cards[1], { opacity: 0, yPercent: 15 }, { opacity: 1, yPercent: 0, pointerEvents: "auto", duration: 0.8 }, "-=0.2")
             .to(cards[1], { opacity: 0, yPercent: -15, pointerEvents: "none", duration: 0.8 }, "+=0.3")
             .fromTo(cards[2], { opacity: 0, yPercent: 15 }, { opacity: 1, yPercent: 0, pointerEvents: "auto", duration: 0.8 }, "-=0.2")
             .to(cards[2], { opacity: 0, yPercent: -15, pointerEvents: "none", duration: 0.8 }, "+=0.3")
             .fromTo(cards[3], { opacity: 0, yPercent: 15 }, { opacity: 1, yPercent: 0, pointerEvents: "auto", duration: 0.8 }, "-=0.2");

      // Floating desaturated SVG images glide inside the SAME synchronized timeline!
      // This prevents racing conditions or disjointed speeds.
      aboutTL.to("#gi-1", { yPercent: -35 }, 0)
             .to("#gi-2", { yPercent: 25 }, 0)
             .to("#gi-3", { yPercent: -20 }, 0)
             .to("#gi-4", { yPercent: 30 }, 0)
             .to("#gi-5", { yPercent: -40 }, 0)
             .to("#gi-6", { yPercent: 15 }, 0)
             .to("#gi-7", { yPercent: -25 }, 0);
    }
  }

  // 4. Projects Section: Horizontal translation & dual parallax panels
  function initProjectsHorizontalTimeline() {
    const trigger = document.getElementById("projects-horizontal-trigger");
    const track = document.getElementById("projects-horizontal-track");
    const panels = document.querySelectorAll(".project-panel");

    if (!trigger || !track || panels.length === 0) return;

    if (window.innerWidth > 1024) {
      // DESKTOP: Horizontal Scroll with Pinned Track
      const scrollLength = track.scrollWidth - window.innerWidth;

      // Pin track and translate on X axis
      const horizontalTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: trigger,
          pin: true,
          start: "top top",
          end: () => `+=${scrollLength}`,
          scrub: 1,
          invalidateOnRefresh: true
        }
      });

      horizontalTimeline.to(track, {
        x: -scrollLength,
        ease: "none"
      });

      // Synchronize parallax elements using containerAnimation
      panels.forEach((panel) => {
        const details = panel.querySelector(".project-details");
        const img = panel.querySelector(".project-media-wrap img");

        if (details) {
          gsap.fromTo(details, 
            { xPercent: 15, opacity: 0.85 },
            {
              xPercent: -15,
              opacity: 1,
              ease: "none",
              scrollTrigger: {
                trigger: panel,
                containerAnimation: horizontalTimeline,
                start: "left right",
                end: "right left",
                scrub: true
              }
            }
          );
        }

        if (img) {
          gsap.fromTo(img, 
            { xPercent: -10, scale: 1.06 },
            {
              xPercent: 10,
              scale: 1,
              ease: "none",
              scrollTrigger: {
                trigger: panel,
                containerAnimation: horizontalTimeline,
                start: "left right",
                end: "right left",
                scrub: true
              }
            }
          );
        }
      });

    } else {
      // MOBILE & TABLET: Vertical Stack Scroll Animations
      // Reset track x translation
      gsap.set(track, { x: 0 });

      panels.forEach((panel) => {
        const details = panel.querySelector(".project-details");
        const img = panel.querySelector(".project-media-wrap img");

        // Set default states for clean animation triggers
        if (details) gsap.set(details, { y: 30, opacity: 0, xPercent: 0 });
        if (img) gsap.set(img, { scale: 0.96, opacity: 0, xPercent: 0 });

        // Create elegant fade in / slide up as they enter screen vertically
        if (details) {
          gsap.to(details, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: panel,
              start: "top+=10% bottom",
              toggleActions: "play none none none"
            }
          });
        }

        if (img) {
          gsap.to(img, {
            scale: 1,
            opacity: 1,
            duration: 1.0,
            ease: "power2.out",
            scrollTrigger: {
              trigger: panel,
              start: "top+=15% bottom",
              toggleActions: "play none none none"
            }
          });
        }
      });
    }
  }

  // 5. Technical Skills Cards stagger fade up
  function initCapabilitiesTimeline() {
    const cards = document.querySelectorAll(".skill-card");
    if (cards.length === 0) return;

    gsap.from(cards, {
      opacity: 0,
      y: 40,
      duration: 0.8,
      stagger: 0.15,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".skills-section",
        start: "top+=10% bottom",
        toggleActions: "play none none none"
      }
    });
  }

  // 6. Interactive ML Prediction Sandbox Logic
  function initMLSandbox() {
    const tabAthlete = document.getElementById("tab-athlete");
    const tabCrime = document.getElementById("tab-crime");
    const labelSlider1 = document.getElementById("label-slider-1");
    const labelSlider2 = document.getElementById("label-slider-2");
    const valSlider1 = document.getElementById("val-slider-1");
    const valSlider2 = document.getElementById("val-slider-2");
    const slider1 = document.getElementById("slider-1");
    const slider2 = document.getElementById("slider-2");
    const btnRunInference = document.getElementById("btn-run-inference");
    const valConfidence = document.getElementById("val-confidence");
    const barConfidence = document.getElementById("bar-confidence");
    const badgeOutcome = document.getElementById("badge-outcome");
    const consoleLogs = document.getElementById("console-logs");
    const sandboxStatus = document.getElementById("sandbox-status");

    if (!slider1 || !slider2 || !btnRunInference) return;

    let currentModel = "athlete";

    function printLog(message, isHighlight = false) {
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];
      const logDiv = document.createElement("div");
      logDiv.className = `console-line${isHighlight ? ' highlight' : ''}`;
      logDiv.textContent = `[${timeStr}] ${message}`;
      consoleLogs.appendChild(logDiv);
      
      while (consoleLogs.children.length > 3) {
        consoleLogs.removeChild(consoleLogs.firstChild);
      }
    }

    const modelConfigs = {
      athlete: {
        slider1: { label: "Biometric Load (Strain)", min: 10, max: 100, step: 1, val: 50, suffix: "%" },
        slider2: { label: "Sleep Recovery (Hours)", min: 2, max: 12, step: 0.5, val: 7.0, suffix: "h" }
      },
      crime: {
        slider1: { label: "Patrol Core Density", min: 5, max: 50, step: 1, val: 20, suffix: " units" },
        slider2: { label: "Population Vector Flow", min: 100, max: 2000, step: 50, val: 800, suffix: " /hr" }
      }
    };

    function switchModel(model) {
      if (currentModel === model) return;
      currentModel = model;

      printLog(`Switching tensors to model pipeline: [${model.toUpperCase()}].`);
      
      if (model === "athlete") {
        tabAthlete.classList.add("active");
        tabCrime.classList.remove("active");
      } else {
        tabAthlete.classList.remove("active");
        tabCrime.classList.add("active");
      }

      const config = modelConfigs[model];
      
      labelSlider1.textContent = config.slider1.label;
      slider1.min = config.slider1.min;
      slider1.max = config.slider1.max;
      slider1.step = config.slider1.step;
      slider1.value = config.slider1.val;
      valSlider1.textContent = `${config.slider1.val}${config.slider1.suffix}`;

      labelSlider2.textContent = config.slider2.label;
      slider2.min = config.slider2.min;
      slider2.max = config.slider2.max;
      slider2.step = config.slider2.step;
      slider2.value = config.slider2.val;
      valSlider2.textContent = `${config.slider2.val}${config.slider2.suffix}`;

      valConfidence.textContent = "0.0%";
      barConfidence.style.width = "0%";
      badgeOutcome.textContent = "AWAITING TRIGGER";
      badgeOutcome.className = "result-badge";

      document.querySelectorAll(".net-node").forEach(node => {
        node.classList.remove("active-cyan", "active-teal");
      });
      document.querySelectorAll(".net-line").forEach(line => {
        line.classList.remove("pulse-active", "pulse-active-teal");
      });

      printLog(`Tensors loaded. Pipe state stabilized.`);
    }

    slider1.addEventListener("input", (e) => {
      const suffix = modelConfigs[currentModel].slider1.suffix;
      valSlider1.textContent = `${e.target.value}${suffix}`;
    });

    slider2.addEventListener("input", (e) => {
      const suffix = modelConfigs[currentModel].slider2.suffix;
      valSlider2.textContent = `${Number(e.target.value).toFixed(currentModel === "athlete" ? 1 : 0)}${suffix}`;
    });

    tabAthlete.addEventListener("click", () => switchModel("athlete"));
    tabCrime.addEventListener("click", () => switchModel("crime"));

    btnRunInference.addEventListener("click", () => {
      btnRunInference.disabled = true;
      slider1.disabled = true;
      slider2.disabled = true;
      tabAthlete.disabled = true;
      tabCrime.disabled = true;
      
      sandboxStatus.textContent = "MODEL STATE: COMPUTING";
      sandboxStatus.style.color = "var(--color-accent-cyan)";
      sandboxStatus.style.background = "rgba(0, 229, 255, 0.08)";
      sandboxStatus.style.borderColor = "rgba(0, 229, 255, 0.15)";

      document.querySelectorAll(".net-node").forEach(node => node.classList.remove("active-cyan", "active-teal"));
      document.querySelectorAll(".net-line").forEach(line => line.classList.remove("pulse-active", "pulse-active-teal"));
      valConfidence.textContent = "0.0%";
      barConfidence.style.width = "0%";
      badgeOutcome.textContent = "FORWARD RUNNING...";
      badgeOutcome.className = "result-badge";

      printLog(`[STEP 1/3] Ingesting parameter vector...`);
      
      setTimeout(() => {
        const n1 = document.getElementById("node-in-1");
        const n2 = document.getElementById("node-in-2");
        if (n1) n1.classList.add("active-cyan");
        if (n2) n2.classList.add("active-cyan");
        
        document.querySelectorAll(".net-line.l1, .net-line.l2, .net-line.l3, .net-line.l4").forEach(line => {
          line.classList.add("pulse-active");
        });

        printLog(`[STEP 2/3] Layer weights product scaling...`);
      }, 250);

      setTimeout(() => {
        const nh1 = document.getElementById("node-hid-1");
        const nh2 = document.getElementById("node-hid-2");
        const nh3 = document.getElementById("node-hid-3");
        if (nh1) nh1.classList.add("active-cyan");
        if (nh2) nh2.classList.add("active-cyan");
        if (nh3) nh3.classList.add("active-cyan");

        document.querySelectorAll(".net-line.l5, .net-line.l6, .net-line.l7").forEach(line => {
          line.classList.add("pulse-active");
        });

        printLog(`[STEP 3/3] Running Softmax probability mapping...`);
      }, 550);

      setTimeout(() => {
        const val1 = Number(slider1.value);
        const val2 = Number(slider2.value);
        
        let confidenceScore = 0;
        let isStable = true;
        let resultString = "";

        if (currentModel === "athlete") {
          const recoveryIndex = (val2 * 8) - (val1 * 0.4);
          if (recoveryIndex > 25) {
            isStable = true;
            resultString = "OPTIMAL RECOVERY";
            confidenceScore = 80 + Math.min(19.9, recoveryIndex * 0.4);
          } else {
            isStable = false;
            resultString = "ELEVATED FATIGUE";
            confidenceScore = 85 + Math.min(14.9, Math.abs(25 - recoveryIndex) * 0.6);
          }
        } else {
          const safetyFactor = (val1 * 30) - (val2 * 0.45);
          if (safetyFactor > 200) {
            isStable = true;
            resultString = "LOW CRIME RISK";
            confidenceScore = 78 + Math.min(21.9, safetyFactor * 0.02);
          } else {
            isStable = false;
            resultString = "CRITICAL HOTSPOT";
            confidenceScore = 82 + Math.min(17.9, Math.abs(200 - safetyFactor) * 0.045);
          }
        }

        confidenceScore = Math.max(72.5, Math.min(99.8, confidenceScore)).toFixed(1);

        const outputNode = document.getElementById("node-out");
        if (isStable) {
          if (outputNode) outputNode.classList.add("active-teal");
          badgeOutcome.textContent = resultString;
          badgeOutcome.className = "result-badge success-glow";
          
          document.querySelectorAll(".net-line").forEach(line => {
            line.classList.remove("pulse-active");
            line.classList.add("pulse-active-teal");
          });
        } else {
          if (outputNode) outputNode.classList.add("active-cyan");
          badgeOutcome.textContent = resultString;
          badgeOutcome.className = "result-badge warning-glow";
        }

        valConfidence.textContent = `${confidenceScore}%`;
        barConfidence.style.width = `${confidenceScore}%`;

        printLog(`[SYS] Tensor result: ${resultString} (${confidenceScore}%)`, true);
        
        sandboxStatus.textContent = "MODEL STATE: ACTIVE";
        sandboxStatus.style.color = "var(--color-accent-teal)";
        sandboxStatus.style.background = "rgba(0, 255, 163, 0.08)";
        sandboxStatus.style.borderColor = "rgba(0, 255, 163, 0.15)";

        btnRunInference.disabled = false;
        slider1.disabled = false;
        slider2.disabled = false;
        tabAthlete.disabled = false;
        tabCrime.disabled = false;
      }, 950);
    });
  }

  // 7. Kill and Re-init ScrollTrigger timelines on layout window resize
  let windowWidth = window.innerWidth;
  window.addEventListener("resize", () => {
    // Only re-init if viewport passes mobile/desktop threshold to avoid lag
    if ((window.innerWidth <= 1024 && windowWidth > 1024) || (window.innerWidth > 1024 && windowWidth <= 1024)) {
      windowWidth = window.innerWidth;
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      
      // Re-trigger bindings
      initAboutGalleryTimeline();
      initProjectsHorizontalTimeline();
      initCapabilitiesTimeline();
      ScrollTrigger.refresh();
    }
  });

});
