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
        "#home": "home-page",
        "#about": "about-page",
        "#persona": "persona-page",
        "#calculator": "calculator-page",
        "#qa": "qa-page",
        "#recruit": "recruit-page",
        "#news": "news-page"
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
        const hash = window.location.hash || "#home";
        switchPage(hash);
    });

    // Initial page load routing based on URL Hash
    const initialHash = window.location.hash || "#home";
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



    // 7. Interactive Eco Calculator
        const weeklyDeliverySlider = document.getElementById("weeklyDelivery");
        const deliveryValDisplay = document.getElementById("deliveryVal");

        const carbonVal = document.getElementById("carbonVal");
        const treeVal = document.getElementById("treeVal");
        const pointsVal = document.getElementById("pointsVal");
        const seniorTimeVal = document.getElementById("seniorTimeVal");

        // Standard factors per box (unit: kg, points, hours)
        const standardFactors = { carbon: 0.25, points: 150, seniorHours: 0.08 };

        function calculateEcoImpact() {
            const weeklyCount = parseInt(weeklyDeliverySlider.value, 10);

            // Total boxes per year
            const annualBoxes = weeklyCount * 52;

            // Calculate values
            const totalCarbon = (annualBoxes * standardFactors.carbon).toFixed(1);
            const totalPoints = annualBoxes * standardFactors.points;
            const totalSeniorHours = (annualBoxes * standardFactors.seniorHours).toFixed(1);

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

        // Initial calculation
        calculateEcoImpact();

    // 8. Sponsorship Inquiry Modal Handler
    const sponsorBtn = document.getElementById("sponsorBtn");
    const sponsorModal = document.getElementById("sponsorModal");
    const sponsorModalClose = document.getElementById("sponsorModalClose");
    const sponsorForm = document.getElementById("sponsorForm");

    if (sponsorBtn && sponsorModal && sponsorModalClose) {
        sponsorBtn.addEventListener("click", () => {
            sponsorModal.classList.add("active");
            document.body.style.overflow = "hidden";
        });

        const closeSponsorModal = () => {
            sponsorModal.classList.remove("active");
            document.body.style.overflow = "";
            if (sponsorForm) sponsorForm.reset();
        };

        sponsorModalClose.addEventListener("click", closeSponsorModal);

        // Close on clicking overlay
        sponsorModal.addEventListener("click", (e) => {
            if (e.target === sponsorModal) {
                closeSponsorModal();
            }
        });

        // Success Modal Controls
        const successModal = document.getElementById("successModal");
        const successModalCloseBtn = document.getElementById("successModalCloseBtn");

        const closeSuccessModal = () => {
            successModal.classList.remove("active");
            document.body.style.overflow = "";
        };

        if (successModalCloseBtn && successModal) {
            successModalCloseBtn.addEventListener("click", closeSuccessModal);
            successModal.addEventListener("click", (e) => {
                if (e.target === successModal) {
                    closeSuccessModal();
                }
            });
        }

        if (sponsorForm) {
            sponsorForm.addEventListener("submit", (e) => {
                e.preventDefault();
                // Close the input modal
                closeSponsorModal();
                // Open the success modal (custom dialog) in the center of the screen
                if (successModal) {
                    successModal.classList.add("active");
                    document.body.style.overflow = "hidden";
                }
            });
        }
    }

    // 9. Q&A Accordion Toggles
    const qaTriggers = document.querySelectorAll(".qa-trigger");
    qaTriggers.forEach(trigger => {
        trigger.addEventListener("click", () => {
            const qaItem = trigger.closest(".qa-item");
            
            // Toggle open class
            const isOpen = qaItem.classList.contains("open");
            
            // Close other items (accordion behavior)
            document.querySelectorAll(".qa-item").forEach(item => {
                item.classList.remove("open");
                const icon = item.querySelector(".qa-chevron i");
                if (icon) icon.setAttribute("data-lucide", "chevron-down");
            });

            if (!isOpen) {
                qaItem.classList.add("open");
                const icon = qaItem.querySelector(".qa-chevron i");
                if (icon) icon.setAttribute("data-lucide", "chevron-up");
            }
            
            // Re-initialize Lucide Icons for icon change
            if (typeof lucide !== "undefined") {
                lucide.createIcons();
            }
        });
    });

    // 10. Login Modal Handlers
    const loginBtn = document.getElementById("loginBtn");
    const mobileLoginBtn = document.getElementById("mobileLoginBtn");
    const loginModal = document.getElementById("loginModal");
    const loginModalClose = document.getElementById("loginModalClose");
    const loginForm = document.getElementById("loginForm");

    // Restore login state from localStorage on load
    const savedLoginEmail = localStorage.getItem("eco-login-email");
    if (savedLoginEmail) {
        if (loginBtn) loginBtn.textContent = "로그아웃";
        if (mobileLoginBtn) mobileLoginBtn.textContent = "로그아웃";
    }

    const openLoginModal = () => {
        if (loginModal) {
            loginModal.classList.add("active");
            document.body.style.overflow = "hidden";
        }
    };

    const closeLoginModal = () => {
        if (loginModal) {
            loginModal.classList.remove("active");
            document.body.style.overflow = "";
            if (loginForm) loginForm.reset();
        }
    };

    const handleLoginClick = (e) => {
        if (e) e.preventDefault();
        const isLoggedIn = localStorage.getItem("eco-login-email");
        if (isLoggedIn) {
            // Logout flow
            localStorage.removeItem("eco-login-email");
            alert("로그아웃되었습니다.");
            if (loginBtn) loginBtn.textContent = "로그인";
            if (mobileLoginBtn) mobileLoginBtn.textContent = "로그인";
        } else {
            // Login flow (Open modal)
            openLoginModal();
        }
    };

    if (loginBtn) loginBtn.addEventListener("click", handleLoginClick);
    if (mobileLoginBtn) mobileLoginBtn.addEventListener("click", handleLoginClick);
    if (loginModalClose) loginModalClose.addEventListener("click", closeLoginModal);
    
    if (loginModal) {
        loginModal.addEventListener("click", (e) => {
            if (e.target === loginModal) {
                closeLoginModal();
            }
        });
    }

    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const email = document.getElementById("loginEmail").value;
            alert(`환영합니다! ${email} 계정으로 로그인이 완료되었습니다.`);
            
            // Persist login state
            localStorage.setItem("eco-login-email", email);
            
            closeLoginModal();
            // Change login buttons to logout
            if (loginBtn) loginBtn.textContent = "로그아웃";
            if (mobileLoginBtn) mobileLoginBtn.textContent = "로그아웃";
        });
    }

    // 11. Point Exchange Shop Handler (connected to Simulator pointsVal)
    const exchangeBtns = document.querySelectorAll(".btn-exchange");
    exchangeBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const itemName = btn.getAttribute("data-item");
            const itemPrice = parseInt(btn.getAttribute("data-price"), 10);
            
            // Extract numerical value from pointsVal (e.g. "15,600 P" -> 15600)
            const pointsValEl = document.getElementById("pointsVal");
            const currentPointsText = pointsValEl ? pointsValEl.textContent : "0 P";
            const currentPoints = parseInt(currentPointsText.replace(/[^0-9]/g, ""), 10) || 0;
            
            if (currentPoints < itemPrice) {
                alert(`포인트가 부족합니다!\n\n현재 보유 에코픽 포인트: ${currentPoints.toLocaleString()} P\n필요 포인트: ${itemPrice.toLocaleString()} P\n\n시뮬레이터에서 '주간 택배 수령 횟수'를 조절해 포인트를 적립해 보세요!`);
            } else {
                const confirmExchange = confirm(`🎉 에코픽 포인트를 교환하시겠습니까?\n\n상품명: ${itemName}\n소모 포인트: ${itemPrice.toLocaleString()} P\n\n교환을 승인하시려면 [확인]을 누르세요.`);
                if (confirmExchange) {
                    alert(`교환 신청이 성공적으로 완료되었습니다!\n\n차감 포인트: ${itemPrice.toLocaleString()} P\n\n작성하신 휴대폰 기프티콘 번호로 모바일 쿠폰이 즉시 전송됩니다.`);
                }
            }
        });
    });

    // 12. Recruitment Application Handler (Requires login check)
    const applySeniorBtn = document.getElementById("applySeniorBtn");
    const applyYouthBtn = document.getElementById("applyYouthBtn");

    const handleApply = (role) => {
        const isLoggedIn = localStorage.getItem("eco-login-email");
        if (!isLoggedIn) {
            alert("로그인이 필요한 서비스입니다.\n\n상단의 [로그인] 버튼을 눌러 로그인을 먼저 진행해 주세요!");
            // Automatically trigger login modal opening
            openLoginModal();
        } else {
            if (role === "senior") {
                alert("시니어 크루 지원이 성공적으로 접수되었습니다!\n\n은평구/서대문구 시니어클럽의 채용 담당자가 기재하신 번호로 유선 연락드리겠습니다.");
            } else if (role === "youth") {
                alert("지역 거점 물류 매니저 지원 서류가 성공적으로 접수되었습니다!\n\n가입해 주신 이메일 주소로 상세 입사 지원 서류 가이드와 양식을 즉시 전송해 드리겠습니다.");
            }
        }
    };

    if (applySeniorBtn) applySeniorBtn.addEventListener("click", () => handleApply("senior"));
    if (applyYouthBtn) applyYouthBtn.addEventListener("click", () => handleApply("youth"));
});
