document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.getElementById("menuToggle");
    const menu = document.getElementById("menu");
    const themeToggle = document.getElementById("themeToggle");
    const projectSearch = document.getElementById("projectSearch");
    const projectFilter = document.getElementById("projectFilter");
    const projectEmpty = document.getElementById("projectEmpty");
    const contactForm = document.getElementById("contactForm");
    const formStatus = document.getElementById("formStatus");
    const messageInput = document.getElementById("contactMessage");
    const characterCount = document.getElementById("characterCount");

    menuToggle.addEventListener("click", () => {
        const isOpen = !menu.hidden;
        menu.hidden = isOpen;
        menuToggle.setAttribute("aria-expanded", String(!isOpen));
    });

    document.querySelectorAll(".menu a").forEach((link) => {
        link.addEventListener("click", () => {
            menu.hidden = true;
            menuToggle.setAttribute("aria-expanded", "false");
        });
    });

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
        themeToggle.innerHTML = '<span aria-hidden="true">&#9728;</span><span>Giao diện sáng</span>';
    }

    themeToggle.addEventListener("click", () => {
        const isDark = document.body.classList.toggle("dark-mode");
        localStorage.setItem("theme", isDark ? "dark" : "light");
        themeToggle.innerHTML = isDark
            ? '<span aria-hidden="true">&#9728;</span><span>Giao diện sáng</span>'
            : '<span aria-hidden="true">&#9790;</span><span>Giao diện tối</span>';
    });

    const filterProjects = () => {
        const keyword = projectSearch.value.trim().toLowerCase();
        const selectedTag = projectFilter.value;
        let visibleCount = 0;

        document.querySelectorAll(".project-card").forEach((card) => {
            const matchesKeyword = card.textContent.toLowerCase().includes(keyword);
            const matchesTag = selectedTag === "all" || card.dataset.tags.includes(selectedTag);
            const visible = matchesKeyword && matchesTag;
            card.hidden = !visible;
            visibleCount += visible ? 1 : 0;
        });

        projectEmpty.hidden = visibleCount !== 0;
    };

    projectSearch.addEventListener("input", filterProjects);
    projectFilter.addEventListener("change", filterProjects);

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    document.querySelectorAll(".reveal").forEach((section) => revealObserver.observe(section));

    const updateCharacterCount = () => {
        characterCount.textContent = `${messageInput.value.length}/500 ký tự`;
    };
    messageInput.addEventListener("input", updateCharacterCount);
    updateCharacterCount();

    contactForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const fields = [...contactForm.querySelectorAll("input, textarea")];
        let isValid = true;

        fields.forEach((field) => {
            const error = contactForm.querySelector(`[data-error-for="${field.id}"]`);
            error.textContent = "";
            if (!field.checkValidity()) {
                isValid = false;
                if (field.validity.valueMissing) {
                    error.textContent = "Trường này không được để trống.";
                } else if (field.validity.typeMismatch) {
                    error.textContent = "Vui lòng nhập email hợp lệ.";
                } else if (field.validity.tooShort) {
                    error.textContent = `Vui lòng nhập ít nhất ${field.minLength} ký tự.`;
                } else if (field.validity.tooLong) {
                    error.textContent = "Nội dung không được vượt quá 500 ký tự.";
                }
            }
        });

        formStatus.textContent = isValid
            ? "Đã kiểm tra hợp lệ! Cảm ơn bạn đã liên hệ."
            : "Vui lòng kiểm tra lại thông tin.";
        formStatus.className = isValid ? "success-message" : "error-message";
    });

    document.getElementById("currentYear").textContent = new Date().getFullYear();
});