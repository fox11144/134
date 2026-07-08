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



    // 7. Eco Points Dashboard Updater
    const basePoints = 60000;

    function calculateEcoImpact() {
        const pointsVal = document.getElementById("pointsVal");
        const headerPointsNum = document.getElementById("headerPointsNum");
        const pointsDesc = document.getElementById("pointsDesc");

        const isLoggedIn = !!localStorage.getItem("eco-login-email");

        if (isLoggedIn) {
            // Retrieve deducted points
            const deductedPoints = parseInt(localStorage.getItem("eco-deducted-points")) || 0;
            const totalPoints = Math.max(0, basePoints - deductedPoints);

            // Display results
            if (pointsVal) {
                pointsVal.textContent = `${totalPoints.toLocaleString()} P`;
                pointsVal.style.fontSize = "3rem";
            }
            if (pointsDesc) {
                pointsDesc.innerHTML = "에코팡 다회용 박스 수거 참여에 감사드립니다. 적립된 친환경 포인트로 아래 상점의 원하시는 상품을 바로 교환해 보세요.";
            }

            // Sync with header points display
            if (headerPointsNum) {
                headerPointsNum.textContent = `${totalPoints.toLocaleString()} P`;
            }
        } else {
            // Display locked state
            if (pointsVal) {
                pointsVal.textContent = "로그인 필요";
                pointsVal.style.fontSize = "2.2rem";
            }
            if (pointsDesc) {
                pointsDesc.innerHTML = "보유 포인트를 조회하고 상품을 교환하려면 상단에서 <strong>로그인</strong>을 진행해 주세요.";
            }

            // Sync with header points display
            if (headerPointsNum) {
                headerPointsNum.textContent = "-";
            }
        }
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
    const signupBtn = document.getElementById("signupBtn");
    const mobileSignupBtn = document.getElementById("mobileSignupBtn");
    const headerPointsDisplay = document.getElementById("headerPointsDisplay");
    const headerPointsNum = document.getElementById("headerPointsNum");
    const loginModal = document.getElementById("loginModal");
    const loginModalClose = document.getElementById("loginModalClose");
    const loginForm = document.getElementById("loginForm");

    const updateLoginUI = (isLoggedIn) => {
        calculateEcoImpact();
        
        if (isLoggedIn) {
            if (loginBtn) loginBtn.textContent = "로그아웃";
            if (mobileLoginBtn) mobileLoginBtn.textContent = "로그아웃";
            if (signupBtn) signupBtn.style.display = "none";
            if (mobileSignupBtn) mobileSignupBtn.style.display = "none";
            if (headerPointsDisplay) {
                headerPointsDisplay.style.display = "flex";
                const pointsValEl = document.getElementById("pointsVal");
                if (pointsValEl && headerPointsNum) {
                    headerPointsNum.textContent = pointsValEl.textContent;
                }
            }
        } else {
            if (loginBtn) loginBtn.textContent = "로그인";
            if (mobileLoginBtn) mobileLoginBtn.textContent = "로그인";
            if (signupBtn) signupBtn.style.display = "inline-flex";
            if (mobileSignupBtn) mobileSignupBtn.style.display = "block";
            if (headerPointsDisplay) headerPointsDisplay.style.display = "none";
        }
    };

    // Restore login state from localStorage on load
    const savedLoginEmail = localStorage.getItem("eco-login-email");
    updateLoginUI(!!savedLoginEmail);

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
            updateLoginUI(false);
        } else {
            // Login flow (Open modal)
            openLoginModal();
        }
    };

    const handleSignupClick = (e) => {
        if (e) e.preventDefault();
        alert("회원가입 기능은 현재 준비 중입니다.\n\n소셜 로그인(구글/카카오)을 이용하시면 별도의 정보 입력 절차 없이 즉시 1초 만에 회원 가입 및 로그인이 완료됩니다!");
        openLoginModal();
    };

    if (loginBtn) loginBtn.addEventListener("click", handleLoginClick);
    if (mobileLoginBtn) mobileLoginBtn.addEventListener("click", handleLoginClick);
    if (signupBtn) signupBtn.addEventListener("click", handleSignupClick);
    if (mobileSignupBtn) mobileSignupBtn.addEventListener("click", handleSignupClick);
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
            updateLoginUI(true);
        });
    }

    // Google Social Login Button Handler
    const googleLoginBtn = document.getElementById("googleLoginBtn");
    if (googleLoginBtn) {
        googleLoginBtn.addEventListener("click", () => {
            alert("구글 계정 연동 로그인이 성공적으로 완료되었습니다!");
            localStorage.setItem("eco-login-email", "google-user@gmail.com");
            closeLoginModal();
            updateLoginUI(true);
        });
    }

    // 11. Point Exchange Shop Handler (connected to Simulator pointsVal)
    const exchangeBtns = document.querySelectorAll(".btn-exchange");
    exchangeBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const isLoggedIn = !!localStorage.getItem("eco-login-email");
            if (!isLoggedIn) {
                alert("로그인이 필요한 서비스입니다.\n\n상단 로그인 버튼을 통해 로그인 후 에코픽 포인트로 상품을 교환하실 수 있습니다!");
                openLoginModal();
                return;
            }

            const itemName = btn.getAttribute("data-item");
            const itemPrice = parseInt(btn.getAttribute("data-price"), 10);
            
            // Extract numerical value from pointsVal (e.g. "15,600 P" -> 15600)
            const pointsValEl = document.getElementById("pointsVal");
            const currentPointsText = pointsValEl ? pointsValEl.textContent : "0 P";
            const currentPoints = parseInt(currentPointsText.replace(/[^0-9]/g, ""), 10) || 0;
            
            if (currentPoints < itemPrice) {
                alert(`포인트가 부족합니다!\n\n현재 보유 에코픽 포인트: ${currentPoints.toLocaleString()} P\n필요 포인트: ${itemPrice.toLocaleString()} P\n\n에코 박스 회수 수거 참여를 신청하여 포인트를 더 적립해 보세요!`);
            } else {
                const confirmExchange = confirm(`🎉 에코픽 포인트를 교환하시겠습니까?\n\n상품명: ${itemName}\n소모 포인트: ${itemPrice.toLocaleString()} P\n\n교환을 승인하시려면 [확인]을 누르세요.`);
                if (confirmExchange) {
                    // Deduct points and save to localStorage
                    let deductedPoints = parseInt(localStorage.getItem("eco-deducted-points")) || 0;
                    deductedPoints += itemPrice;
                    localStorage.setItem("eco-deducted-points", deductedPoints);

                    // Recalculate and update displays
                    calculateEcoImpact();

                    alert(`교환 신청이 성공적으로 완료되었습니다!\n\n차감 포인트: -${itemPrice.toLocaleString()} P\n\n작성하신 휴대폰 기프티콘 번호로 모바일 쿠폰이 즉시 전송됩니다.`);
                }
            }
        });
    });

    // 12. Minimum Packaging Accordion Toggle
    const minPkgTrigger = document.getElementById("minPkgTrigger");
    const minPkgContent = document.getElementById("minPkgContent");
    const minPkgChevron = document.getElementById("minPkgChevron");
    const minPkgAccordion = document.getElementById("minPkgAccordion");

    if (minPkgTrigger && minPkgContent) {
        minPkgTrigger.addEventListener("click", () => {
            const isOpen = minPkgAccordion.classList.contains("open");
            
            if (isOpen) {
                minPkgAccordion.classList.remove("open");
                minPkgContent.style.maxHeight = "0";
                minPkgContent.style.borderTopWidth = "0px";
                if (minPkgChevron) minPkgChevron.style.transform = "rotate(0deg)";
            } else {
                minPkgAccordion.classList.add("open");
                // Set max-height to scroll height for smooth slide down
                minPkgContent.style.maxHeight = minPkgContent.scrollHeight + "px";
                minPkgContent.style.borderTopWidth = "1px";
                if (minPkgChevron) minPkgChevron.style.transform = "rotate(180deg)";
            }
            
            // Re-initialize Lucide Icons for icon change
            if (typeof lucide !== "undefined") {
                lucide.createIcons();
            }
        });
    }

    // 13. Eco Points Accordion Toggle
    const ecoPointsTrigger = document.getElementById("ecoPointsTrigger");
    const ecoPointsContent = document.getElementById("ecoPointsContent");
    const ecoPointsChevron = document.getElementById("ecoPointsChevron");
    const ecoPointsAccordion = document.getElementById("ecoPointsAccordion");

    if (ecoPointsTrigger && ecoPointsContent) {
        ecoPointsTrigger.addEventListener("click", () => {
            const isOpen = ecoPointsAccordion.classList.contains("open");
            
            if (isOpen) {
                ecoPointsAccordion.classList.remove("open");
                ecoPointsContent.style.maxHeight = "0";
                ecoPointsContent.style.borderTopWidth = "0px";
                if (ecoPointsChevron) ecoPointsChevron.style.transform = "rotate(0deg)";
            } else {
                ecoPointsAccordion.classList.add("open");
                // Set max-height to scroll height for smooth slide down
                ecoPointsContent.style.maxHeight = ecoPointsContent.scrollHeight + "px";
                ecoPointsContent.style.borderTopWidth = "1px";
                if (ecoPointsChevron) ecoPointsChevron.style.transform = "rotate(180deg)";
            }
            
            // Re-initialize Lucide Icons for icon change
            if (typeof lucide !== "undefined") {
                lucide.createIcons();
            }
        });
    }
});
