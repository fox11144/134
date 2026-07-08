document.addEventListener("DOMContentLoaded", () => {
    // 1. Initialize Lucide Icons
    if (typeof lucide !== "undefined") {
        lucide.createIcons();
    }

    // 2. SPA Page Navigation with Loading Animation
    const pageLoader = document.getElementById("pageLoader");
    const pageSections = document.querySelectorAll(".page-content");
    const pageNavLinks = document.querySelectorAll(".page-nav-link");

    // Mapping link hashes to page section IDs
    const pageMap = {
        "#about": "about-page",
        "#persona": "persona-page",
        "#scamper": "scamper-page",
        "#gallery": "gallery-page",
        "#calculator": "calculator-page"
    };

    function switchPage(targetHash) {
        const targetPageId = pageMap[targetHash] || "about-page";
        const targetPage = document.getElementById(targetPageId);

        if (!targetPage) return;

        // Show page loader (fade in)
        pageLoader.classList.add("active");

        // Simulate loading time (400ms) for screen transition
        setTimeout(() => {
            // Hide all pages
            pageSections.forEach(page => {
                page.classList.remove("active-page");
            });

            // Show target page
            targetPage.classList.add("active-page");

            // Scroll to the top of the page instantly
            window.scrollTo(0, 0);

            // Update navigation link active states
            updateNavActiveStates(targetHash);

            // Hide page loader (fade out)
            pageLoader.classList.remove("active");
        }, 400);
    }

    function updateNavActiveStates(currentHash) {
        // Reset all links
        pageNavLinks.forEach(link => {
            link.classList.remove("active");
            // If the link has the matching hash, make it active
            if (link.getAttribute("href") === currentHash) {
                link.classList.add("active");
            }
        });
    }

    // Attach click events to all page navigation links
    pageNavLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            const href = link.getAttribute("href");
            if (href && href.startsWith("#")) {
                e.preventDefault();
                // Push hash to history without scrolling
                history.pushState(null, null, href);
                switchPage(href);
            }
        });
    });

    // Handle back/forward browser buttons
    window.addEventListener("popstate", () => {
        const hash = window.location.hash || "#about";
        switchPage(hash);
    });

    // Initial page load routing based on URL Hash
    const initialHash = window.location.hash || "#about";
    if (initialHash && pageMap[initialHash]) {
        // Direct display on initial load, no delay needed
        pageSections.forEach(page => page.classList.remove("active-page"));
        document.getElementById(pageMap[initialHash]).classList.add("active-page");
        updateNavActiveStates(initialHash);
    }

    // 3. Mobile Drawer Navigation
    const mobileNavToggle = document.getElementById("mobileNavToggle");
    const drawerClose = document.getElementById("drawerClose");
    const mobileDrawer = document.getElementById("mobileDrawer");
    const drawerOverlay = document.getElementById("drawerOverlay");
    const drawerLinks = document.querySelectorAll(".mobile-drawer .page-nav-link");

    function openDrawer() {
        mobileDrawer.classList.add("open");
        drawerOverlay.classList.add("active");
        document.body.style.overflow = "hidden";
    }

    function closeDrawer() {
        mobileDrawer.classList.remove("open");
        drawerOverlay.classList.remove("active");
        document.body.style.overflow = "";
    }

    if (mobileNavToggle) mobileNavToggle.addEventListener("click", openDrawer);
    if (drawerClose) drawerClose.addEventListener("click", closeDrawer);
    if (drawerOverlay) drawerOverlay.addEventListener("click", closeDrawer);
    drawerLinks.forEach(link => link.addEventListener("click", closeDrawer));

    // 4. Theme Toggle (Light / Dark Mode)
    const themeToggleBtn = document.getElementById("themeToggleBtn");
    const body = document.body;

    // Local storage key for theme
    const savedTheme = localStorage.getItem("eco-theme") || "light";
    body.className = savedTheme + "-mode";
    updateThemeToggleIcons(savedTheme);

    function updateThemeToggleIcons(theme) {
        const darkIcon = themeToggleBtn.querySelector(".theme-icon-dark");
        const lightIcon = themeToggleBtn.querySelector(".theme-icon-light");
        if (theme === "dark") {
            darkIcon.style.display = "none";
            lightIcon.style.display = "block";
        } else {
            darkIcon.style.display = "block";
            lightIcon.style.display = "none";
        }
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener("click", () => {
            const isDark = body.classList.contains("dark-mode");
            const newTheme = isDark ? "light" : "dark";
            body.className = newTheme + "-mode";
            localStorage.setItem("eco-theme", newTheme);
            updateThemeToggleIcons(newTheme);
        });
    }

    // 5. SCAMPER Tab Navigation
    const scamperTabs = document.querySelectorAll(".scamper-tab");
    const scamperPanels = document.querySelectorAll(".scamper-panel");

    scamperTabs.forEach(tab => {
        tab.addEventListener("click", () => {
            // Remove active from all tabs
            scamperTabs.forEach(t => t.classList.remove("active"));
            // Add active to current tab
            tab.classList.add("active");

            // Hide all panels
            scamperPanels.forEach(p => p.classList.remove("active"));

            // Show target panel
            const tabId = tab.getAttribute("data-tab");
            const targetPanel = document.getElementById(`panel-${tabId}`);
            if (targetPanel) {
                targetPanel.classList.add("active");
            }
        });
    });

    // 6. Materials Gallery Lightbox
    const galleryCards = document.querySelectorAll(".gallery-card");
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightboxImg");
    const lightboxCaption = document.getElementById("lightboxCaption");
    const lightboxClose = document.getElementById("lightboxClose");
    const lightboxPrev = document.getElementById("lightboxPrev");
    const lightboxNext = document.getElementById("lightboxNext");

    // Image sources array
    const galleryItems = [
        { src: "image/자료 1.png", alt: "자료 01 - 서비스 컨셉 & 페르소나 매칭" },
        { src: "image/자료 2.png", alt: "자료 02 - SCAMPER 분석 및 개선안 도출" },
        { src: "image/자료 3.png", alt: "자료 03 - 역물류 시스템 & ESG 선순환 구조" }
    ];
    let currentGalleryIndex = 0;

    function showLightbox(index) {
        currentGalleryIndex = index;
        const item = galleryItems[index];
        lightboxImg.src = item.src;
        lightboxCaption.textContent = item.alt;
        lightbox.classList.add("active");
        document.body.style.overflow = "hidden";
    }

    function closeLightbox() {
        lightbox.classList.remove("active");
        document.body.style.overflow = "";
    }

    function prevImage() {
        let index = currentGalleryIndex - 1;
        if (index < 0) index = galleryItems.length - 1;
        showLightbox(index);
    }

    function nextImage() {
        let index = currentGalleryIndex + 1;
        if (index >= galleryItems.length) index = 0;
        showLightbox(index);
    }

    galleryCards.forEach((card, idx) => {
        card.addEventListener("click", () => {
            showLightbox(idx);
        });
    });

    if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
    if (lightboxPrev) lightboxPrev.addEventListener("click", prevImage);
    if (lightboxNext) lightboxNext.addEventListener("click", nextImage);

    // Close lightbox on click outside the image
    if (lightbox) {
        lightbox.addEventListener("click", (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

    // Keyboard navigation for lightbox
    document.addEventListener("keydown", (e) => {
        if (!lightbox.classList.contains("active")) return;
        if (e.key === "Escape") closeLightbox();
        if (e.key === "ArrowLeft") prevImage();
        if (e.key === "ArrowRight") nextImage();
    });

    // 7. Interactive Eco Calculator
    const weeklyDeliverySlider = document.getElementById("weeklyDelivery");
    const deliveryValDisplay = document.getElementById("deliveryVal");
    const boxSizeSelect = document.getElementById("boxSize");

    const carbonVal = document.getElementById("carbonVal");
    const treeVal = document.getElementById("treeVal");
    const pointsVal = document.getElementById("pointsVal");
    const seniorTimeVal = document.getElementById("seniorTimeVal");

    // Constants per box (unit: kg, points, hours)
    const factorTable = {
        "1": { carbon: 0.12, points: 100, seniorHours: 0.05 }, // Small
        "2": { carbon: 0.25, points: 150, seniorHours: 0.08 }, // Medium
        "3": { carbon: 0.45, points: 250, seniorHours: 0.12 }  // Large
    };

    function calculateEcoImpact() {
        const weeklyCount = parseInt(weeklyDeliverySlider.value, 10);
        const selectedSize = boxSizeSelect.value;
        const factors = factorTable[selectedSize] || factorTable["2"];

        // Total boxes per year
        const annualBoxes = weeklyCount * 52;

        // Calculate values
        const totalCarbon = (annualBoxes * factors.carbon).toFixed(1);
        const totalPoints = annualBoxes * factors.points;
        const totalSeniorHours = (annualBoxes * factors.seniorHours).toFixed(1);

        // Pine trees calculation (1 tree absorbs ~6.6kg of CO2 per year)
        const treesEquivalent = (parseFloat(totalCarbon) / 6.6).toFixed(1);

        // Display results
        carbonVal.textContent = `${Number(totalCarbon).toLocaleString()} kg`;
        treeVal.textContent = treesEquivalent;
        pointsVal.textContent = `${totalPoints.toLocaleString()} P`;
        seniorTimeVal.textContent = `${Number(totalSeniorHours).toLocaleString()} 시간`;
    }

    if (weeklyDeliverySlider) {
        weeklyDeliverySlider.addEventListener("input", (e) => {
            deliveryValDisplay.textContent = `${e.target.value}회`;
            calculateEcoImpact();
        });
    }

    if (boxSizeSelect) {
        boxSizeSelect.addEventListener("change", calculateEcoImpact);
    }

    // Initial calculation
    calculateEcoImpact();
});
