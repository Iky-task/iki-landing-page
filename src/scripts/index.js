import "../styles/main.scss";

window.addEventListener("load", () => {
    const preloader = document.querySelector(".preloader");
    const pageContent = document.querySelector(".page-content");
    const body = document.body;
    const langOptions = document.querySelectorAll(".lang-option");

    function getCurrentLanguage() {
        return body.classList.contains("lang-ua") ? "ua" : "en";
    }

    function getTranslation(key) {
        const translations = {
            success_message: {
                en: "All done!",
                ua: "Готово!",
            },
            error_message: {
                en: "Error. Try again",
                ua: "Помилка. Спробуйте ще раз",
            },
            submit_button: {
                en: "Sign up for updates",
                ua: "Отримати оновлення",
            },
            sending_message: {
                en: "Sending...",
                ua: "Відправляється...",
            },
        };

        const lang = getCurrentLanguage();
        return translations[key]?.[lang] || translations[key]?.["en"] || "";
    }

    function showPreloader() {
        if (preloader && pageContent && body) {
            body.classList.add("preloader-active");
            preloader.classList.add("visible");
        }
    }

    function hidePreloader(delay = 300) {
        if (preloader && pageContent && body) {
            setTimeout(() => {
                preloader.classList.remove("visible");
                body.classList.remove("preloader-active");
            }, delay);
        }
    }

    showPreloader();

    document.getElementById("year")?.replaceChildren(new Date().getFullYear());

    const form = document.getElementById("emailForm");
    const submitBtn = document.getElementById("form-button");
    const emailInput = document.getElementById("email");

    if (form && submitBtn && emailInput) {
        const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw2Aajfk1nsL5OImd9Rls0Rtfb2LGMKjL-fcqYJcaXb5DN_vhffnv_jd6KoSXFIQPwg/exec";

        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            const email = emailInput.value.trim();
            if (!email) return;

            form.classList.add("submitting");
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<img src="src/assets/img/spinner.svg" alt="${getTranslation("sending_message")}" class="form-block-spinner">`;

            try {
                await fetch(SCRIPT_URL, {
                    method: "POST",
                    mode: "no-cors",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email }),
                });

                submitBtn.disabled = false;
                const successMessage = getTranslation("success_message");
                submitBtn.innerHTML = `${successMessage} <img src="src/assets/img/success.svg" alt="Success" class="form-block-success">`;

                form.reset();
                form.classList.add("submitted");
                form.classList.remove("submitting");

                emailInput.blur();
                emailInput.style.caretColor = "transparent";

                setTimeout(() => emailInput.blur(), 50);
            } catch (err) {
                console.error("Submit error:", err);
                submitBtn.innerHTML = getTranslation("error_message");
                form.classList.remove("submitting", "submitted");
                emailInput.style.caretColor = "";

                setTimeout(() => {
                    submitBtn.innerHTML = getTranslation("submit_button");
                    submitBtn.disabled = false;
                }, 3000);
            }
        });

        emailInput.addEventListener("focus", () => {
            form.classList.remove("submitted");
            emailInput.style.caretColor = "";
        });

        form.addEventListener("click", (e) => {
            if (form.classList.contains("submitted") && e.target !== submitBtn) {
                form.classList.remove("submitted");
                emailInput.focus();
                emailInput.style.caretColor = "";
            }
        });

        emailInput.addEventListener("input", () => {
            if (form.classList.contains("submitted")) {
                form.classList.remove("submitted");
                submitBtn.innerHTML = getTranslation("submit_button");
            }
        });
    }

    function scrollToFormAndFocus() {
        if (!form || !emailInput) return;
        form.scrollIntoView({ behavior: "smooth", block: "center" });
        setTimeout(() => {
            emailInput.focus();
            emailInput.style.caretColor = "";
        }, 300);
    }

    document.querySelector(".header__button")?.addEventListener("click", (e) => {
        e.preventDefault();
        scrollToFormAndFocus();
    });

    document.querySelector(".main__button")?.addEventListener("click", (e) => {
        e.preventDefault();
        scrollToFormAndFocus();
    });

    function updatePlaceholders() {
        const lang = getCurrentLanguage();
        document.querySelectorAll("input[data-en][data-ua]").forEach((input) => {
            input.placeholder = input.dataset[lang];
        });

        if (submitBtn && form && form.classList.contains("submitted")) {
            const successMessage = getTranslation("success_message");
            submitBtn.innerHTML = `${successMessage} <img src="src/assets/img/success.svg" alt="Success" class="form-block-success">`;
        }
    }

    function detectBrowserLanguage() {
        const browserLang = navigator.language || navigator.userLanguage;
        const isUkrainian = browserLang.toLowerCase().startsWith("uk");
        return isUkrainian ? "ua" : "en";
    }

    function initializeLanguage() {
        const savedLang = localStorage.getItem("lang");

        let currentLang;

        if (savedLang) {
            currentLang = savedLang;
        } else {
            currentLang = detectBrowserLanguage();
            localStorage.setItem("lang", currentLang);
        }

        body.classList.add(`lang-${currentLang}`);

        langOptions.forEach((opt) => {
            opt.classList.toggle("curr", opt.dataset.lang === currentLang);
        });

        return currentLang;
    }

    const currentLang = initializeLanguage();
    updatePlaceholders();

    body.classList.add("loaded");
    hidePreloader(600);

    langOptions.forEach((option) => {
        option.addEventListener("click", () => {
            const selectedLang = option.dataset.lang;
            if (option.classList.contains("curr")) return;

            showPreloader();

            body.classList.remove("lang-en", "lang-ua");
            body.classList.add(`lang-${selectedLang}`);

            localStorage.setItem("lang", selectedLang);

            langOptions.forEach((opt) => {
                opt.classList.toggle("curr", opt.dataset.lang === selectedLang);
            });

            updatePlaceholders();

            setTimeout(() => {
                hidePreloader();
            }, 300);
        });
    });
});
