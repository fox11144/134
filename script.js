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
        "#features": "features-page",
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

            if (targetHash === "#features") {
                startDemoSimulation();
            } else {
                stopDemoSimulation();
            }

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
        if (initialHash === "#features") {
            startDemoSimulation();
        }
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
                pointsVal.classList.remove("logged-out");
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
                pointsVal.classList.add("logged-out");
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

    // 12. AI-XR Logistics Demo Simulator Telemetry
    let demoInterval = null;

    function startDemoSimulation() {
        const scanW = document.getElementById("scan-w");
        const scanD = document.getElementById("scan-d");
        const scanH = document.getElementById("scan-h");
        const optimalBoxCode = document.getElementById("optimal-box-code");

        if (demoInterval) clearInterval(demoInterval);

        demoInterval = setInterval(() => {
            // Generate slightly fluctuating sensor values to simulate real-time scanning
            const w = (24.0 + Math.random() * 1.5).toFixed(1);
            const d = (18.0 + Math.random() * 1.2).toFixed(1);
            const h = (11.5 + Math.random() * 1.0).toFixed(1);

            if (scanW) scanW.textContent = `${w}cm`;
            if (scanD) scanD.textContent = `${d}cm`;
            if (scanH) scanH.textContent = `${h}cm`;

            // Calculate mock box category code based on combined size
            const sum = parseFloat(w) + parseFloat(d) + parseFloat(h);
            let code = "ECO-03";
            if (sum < 53.5) {
                code = "ECO-02";
            } else if (sum > 55.0) {
                code = "ECO-04";
            }
            if (optimalBoxCode) optimalBoxCode.textContent = code;
        }, 800);
    }

    function stopDemoSimulation() {
        if (demoInterval) {
            clearInterval(demoInterval);
            demoInterval = null;
        }
    }

    // 13. Lightbox for Diagram Image (사진 1)
    const diagramImage = document.getElementById("diagramImage");
    const zoomDiagramBtn = document.getElementById("zoomDiagramBtn");
    const diagramLightboxModal = document.getElementById("diagramLightboxModal");
    const lightboxClose = document.getElementById("lightboxClose");

    if (diagramLightboxModal) {
        const openLightbox = () => {
            diagramLightboxModal.classList.add("active");
            document.body.style.overflow = "hidden"; // disable scroll
        };

        const closeLightbox = () => {
            diagramLightboxModal.classList.remove("active");
            document.body.style.overflow = ""; // enable scroll
        };

        if (diagramImage) diagramImage.addEventListener("click", openLightbox);
        if (zoomDiagramBtn) zoomDiagramBtn.addEventListener("click", openLightbox);
        if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);

        diagramLightboxModal.addEventListener("click", (e) => {
            if (e.target === diagramLightboxModal) {
                closeLightbox();
            }
        });
    }

    // 14. Eco Lucky Gacha (Lucky Draw) Logic
    const playGachaBtn = document.getElementById("playGachaBtn");
    const gachaBowl = document.getElementById("gachaBowl");
    const gachaCrank = document.getElementById("gachaCrank");
    const rolledCapsule = document.getElementById("rolledCapsule");
    const gachaResultModal = document.getElementById("gachaResultModal");
    const gachaResultCloseBtn = document.getElementById("gachaResultCloseBtn");
    const gachaPrizeTier = document.getElementById("gachaPrizeTier");
    const gachaPrizeName = document.getElementById("gachaPrizeName");
    const gachaPrizeValue = document.getElementById("gachaPrizeValue");

    let isGachaPlaying = false;

    function playSound(type) {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            if (type === 'spin') {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(150, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(700, ctx.currentTime + 1.2);
                gain.gain.setValueAtTime(0.08, ctx.currentTime);
                gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 1.2);
                osc.start();
                osc.stop(ctx.currentTime + 1.2);
            } else if (type === 'win') {
                const now = ctx.currentTime;
                const playChime = (freq, time, duration) => {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(freq, time);
                    gain.gain.setValueAtTime(0.12, time);
                    gain.gain.exponentialRampToValueAtTime(0.01, time + duration);
                    osc.start(time);
                    osc.stop(time + duration);
                };
                playChime(523.25, now, 0.3); // C5
                playChime(659.25, now + 0.12, 0.4); // E5
                playChime(783.99, now + 0.24, 0.5); // G5
                playChime(1046.50, now + 0.36, 0.6); // C6
            }
        } catch (e) {
            console.log("Audio not supported");
        }
    }

    function triggerConfetti() {
        const container = document.getElementById("gachaConfetti");
        if (!container) return;
        container.innerHTML = "";
        const colors = ["#10b981", "#3b82f6", "#ef4444", "#f59e0b", "#ec4899", "#8b5cf6"];
        for (let i = 0; i < 40; i++) {
            const p = document.createElement("div");
            p.style.position = "absolute";
            p.style.width = `${Math.random() * 8 + 5}px`;
            p.style.height = `${Math.random() * 8 + 5}px`;
            p.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            p.style.borderRadius = Math.random() > 0.5 ? "50%" : "2px";
            p.style.left = `${Math.random() * 100}%`;
            p.style.top = "-10px";
            p.style.opacity = Math.random() * 0.7 + 0.3;
            p.style.transform = `rotate(${Math.random() * 360}deg)`;
            container.appendChild(p);

            const speed = Math.random() * 2.5 + 1.5;
            const drift = (Math.random() - 0.5) * 120;
            p.animate([
                { transform: `translateY(0) rotate(0deg)`, opacity: p.style.opacity },
                { transform: `translateY(360px) translateX(${drift}px) rotate(${Math.random() * 720}deg)`, opacity: 0 }
            ], {
                duration: speed * 1000,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                fill: 'forwards'
            });
        }
    }

    if (playGachaBtn) {
        playGachaBtn.addEventListener("click", () => {
            if (isGachaPlaying) return;

            // 1. Check Login Status
            const isLoggedIn = !!localStorage.getItem("eco-login-email");
            if (!isLoggedIn) {
                alert("가챠를 진행하려면 먼저 로그인해주시기 바랍니다.");
                const loginModal = document.getElementById("loginModal");
                if (loginModal) loginModal.classList.add("active");
                return;
            }

            // 2. Check Point Balance
            const currentDeducted = parseInt(localStorage.getItem("eco-deducted-points")) || 0;
            const totalPoints = Math.max(0, basePoints - currentDeducted);
            if (totalPoints < 100) {
                alert("보유 에코포인트가 부족합니다. (최소 100 P 필요)");
                return;
            }

            isGachaPlaying = true;
            playGachaBtn.disabled = true;
            playGachaBtn.innerHTML = `<span class="spinner" style="display: inline-block; animation: spin-loader 1s infinite linear; margin-right: 8px;">⏳</span> 행운의 캡슐 뽑는 중...`;

            // Start animations & sound
            if (gachaBowl) gachaBowl.classList.add("shaking");
            if (gachaCrank) gachaCrank.classList.add("rotating");
            if (rolledCapsule) {
                rolledCapsule.style.display = "none";
            }
            playSound("spin");

            setTimeout(() => {
                // Stop animations
                if (gachaBowl) gachaBowl.classList.remove("shaking");
                if (gachaCrank) gachaCrank.classList.remove("rotating");

                // Roll out capsule visual
                if (rolledCapsule) {
                    const capsuleColors = [
                        "linear-gradient(135deg, #10b981 50%, #34d399 50%)",
                        "linear-gradient(135deg, #f59e0b 50%, #fbbf24 50%)",
                        "linear-gradient(135deg, #ef4444 50%, #f87171 50%)",
                        "linear-gradient(135deg, #3b82f6 50%, #60a5fa 50%)",
                        "linear-gradient(135deg, #8b5cf6 50%, #a78bfa 50%)"
                    ];
                    rolledCapsule.style.background = capsuleColors[Math.floor(Math.random() * capsuleColors.length)];
                    rolledCapsule.style.display = "block";
                }

                // Wait 0.5s for capsule drop visual, then open result modal
                setTimeout(() => {
                    // Determine prize outcome based on user specified percentages:
                    // 1등: 1%, 2등: 3%, 3등: 5%, 4등: 50%, 행운상: 41%
                    const rand = Math.random() * 100;
                    let prize = { tier: "행운상", name: "에코픽 50 P 페이백", val: "50 P 즉시 적립", refund: 50, color: "#64748b" };

                    if (rand < 1) {
                        prize = { tier: "1등", name: "에코팡 리유저블 텀블러", val: "8,000 P 가치", refund: 0, color: "#d97706" };
                    } else if (rand < 4) {
                        prize = { tier: "2등", name: "투썸플레이스 초콜릿 조각 케이크", val: "6,500 P 가치", refund: 0, color: "#db2777" };
                    } else if (rand < 9) {
                        prize = { tier: "3등", name: "컴포즈커피 아메리카노 Hot", val: "2,000 P 가치", refund: 0, color: "#2563eb" };
                    } else if (rand < 59) {
                        prize = { tier: "4등", name: "에코픽 100 P 페이백", val: "100 P 즉시 적립", refund: 100, color: "#059669" };
                    }

                    // Deduct cost and refund payback
                    const newDeducted = currentDeducted + 100 - prize.refund;
                    localStorage.setItem("eco-deducted-points", newDeducted);
                    calculateEcoImpact(); // Update point displays on page

                    // Determine user display name for Winners Board
                    let userEmail = localStorage.getItem("eco-login-email") || "user@domain.com";
                    let displayName = "이*선 (나)";
                    if (userEmail.includes("@")) {
                        let parts = userEmail.split("@");
                        let username = parts[0];
                        if (username.length > 2) {
                            displayName = username.slice(0, 1) + "*".repeat(username.length - 2) + username.slice(-1) + " (나)";
                        } else {
                            displayName = username + "* (나)";
                        }
                    }

                    // Add to Winners Board
                    const winnersList = document.getElementById("gachaWinnersList");
                    if (winnersList) {
                        const winnerItem = document.createElement("div");
                        winnerItem.className = "winner-item animate-fade-in";
                        winnerItem.style.fontSize = "0.8rem";
                        winnerItem.style.padding = "8px 12px";
                        winnerItem.style.backgroundColor = "var(--card-bg)";
                        winnerItem.style.border = "1px solid var(--border)";
                        winnerItem.style.borderRadius = "10px";
                        winnerItem.style.display = "flex";
                        winnerItem.style.flexDirection = "column";
                        winnerItem.style.gap = "2px";
                        
                        let tierColor = "#64748b";
                        if (prize.tier === "1등") tierColor = "#d97706";
                        else if (prize.tier === "2등") tierColor = "#db2777";
                        else if (prize.tier === "3등") tierColor = "#2563eb";
                        else if (prize.tier === "4등") tierColor = "#059669";

                        winnerItem.innerHTML = `
                            <div style="display: flex; justify-content: space-between; font-weight: 700; color: var(--text-main);">
                                <span>${displayName}</span>
                                <span style="color: ${tierColor}; font-size: 0.72rem; font-weight: bold;">${prize.tier} 당첨!</span>
                            </div>
                            <div style="font-size: 0.75rem; color: var(--text-sub); display: flex; justify-content: space-between;">
                                <span>${prize.name}</span>
                                <span>방금 전</span>
                            </div>
                        `;
                        winnersList.insertBefore(winnerItem, winnersList.firstChild);
                        while (winnersList.children.length > 8) {
                            winnersList.removeChild(winnersList.lastChild);
                        }
                    }

                    // Fill modal content
                    if (gachaPrizeTier) {
                        gachaPrizeTier.textContent = prize.tier;
                        gachaPrizeTier.style.backgroundColor = prize.color;
                    }
                    if (gachaPrizeName) gachaPrizeName.textContent = prize.name;
                    if (gachaPrizeValue) gachaPrizeValue.textContent = prize.val;

                    // Open result modal
                    if (gachaResultModal) {
                        gachaResultModal.classList.add("active");
                    }
                    
                    playSound("win");
                    triggerConfetti();

                    // Reset button state
                    isGachaPlaying = false;
                    playGachaBtn.disabled = false;
                    playGachaBtn.innerHTML = `<i data-lucide="dices" style="width: 20px; height: 20px; margin-right: 8px;"></i> 1회 뽑기 (100 P 소모)`;
                    if (typeof lucide !== "undefined") lucide.createIcons(); // refresh icon
                }, 500);

            }, 1200);
        });
    }

    if (gachaResultCloseBtn && gachaResultModal) {
        gachaResultCloseBtn.addEventListener("click", () => {
            gachaResultModal.classList.remove("active");
            if (rolledCapsule) rolledCapsule.style.display = "none";
        });
    }
});
