document.addEventListener("DOMContentLoaded", function () {
    // 📌 Открытие/закрытие мобильного меню
    const burgerMenu = document.querySelector('.burger-menu');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (burgerMenu && mobileMenu) {
        burgerMenu.addEventListener('click', () => {
            mobileMenu.classList.toggle('open');
        });

        document.querySelectorAll('.mobile-menu a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('open');
            });
        });
    } else {
        console.error("❌ Ошибка: .burger-menu или .mobile-menu не найдены в DOM.");
    }

    // 📌 Карусель для изображений товаров
    document.querySelectorAll("[data-carousel]").forEach(carousel => {
        let track = carousel.querySelector(".carousel-track");
        if (!track) return;

        let images = track.querySelectorAll("img");
        let currentIndex = 0;

        function updateCarousel() {
            images.forEach((img, index) => {
                img.classList.toggle("active", index === currentIndex);
            });
        }

        const nextButton = carousel.querySelector("[data-carousel-button='next']");
        const prevButton = carousel.querySelector("[data-carousel-button='prev']");

        if (nextButton && prevButton) {
            nextButton.addEventListener("click", () => {
                currentIndex = (currentIndex + 1) % images.length;
                updateCarousel();
            });

            prevButton.addEventListener("click", () => {
                currentIndex = (currentIndex - 1 + images.length) % images.length;
                updateCarousel();
            });
        }

        updateCarousel();
    });

    // 📌 Фильтрация товаров
    const filterButtons = document.querySelectorAll(".filter-btn");
    const catalogItems = document.querySelectorAll(".catalog-item");

    filterButtons.forEach(button => {
        button.addEventListener("click", function () {
            filterButtons.forEach(btn => btn.classList.remove("active"));
            this.classList.add("active");

            const filter = this.dataset.filter;

            catalogItems.forEach(item => {
                item.style.display = filter === "all" || item.classList.contains(filter) ? "flex" : "none";
            });
        });
    });

    // 📌 Всплывающее окно "Подробнее"
    const detailsButtons = document.querySelectorAll(".btn-details");
    const popupOverlay = document.getElementById("popup-overlay");
    const catalogPopup = document.getElementById("catalog-popup");
    const closePopupButton = document.getElementById("popup-close");
    const popupTitle = document.getElementById("popup-title");
    const popupDescription = document.getElementById("popup-description");
    const popupPrice = document.getElementById("popup-price");
    const popupHeight = document.getElementById("popup-height");
    const popupColumns = document.getElementById("popup-columns");
    const popupLogs = document.getElementById("popup-logs");
    const popupCarouselTrack = document.getElementById("popup-carousel-track");
    const popupPrev = document.getElementById("popup-prev");
    const popupNext = document.getElementById("popup-next");

    let currentImageIndex = 0;
    let images = [];

    detailsButtons.forEach(button => {
        button.addEventListener("click", function () {
            popupTitle.textContent = this.getAttribute("data-title") || "Название отсутствует";
            popupDescription.textContent = this.getAttribute("data-description") || "Описание отсутствует";
            popupPrice.textContent = (this.getAttribute("data-price") || "0") + " ₽";

            popupHeight.textContent = this.getAttribute("data-height") || "";
            popupColumns.textContent = this.getAttribute("data-columns") || "";
            popupLogs.textContent = this.getAttribute("data-logs") || "";

            try {
                images = JSON.parse(this.getAttribute("data-images") || "[]");
            } catch (e) {
                console.error("Ошибка парсинга изображений:", e);
                images = [];
            }

            currentImageIndex = 0;
            updateCarousel();

            popupOverlay.style.display = "block";
            catalogPopup.style.display = "block";
            document.body.style.overflow = "hidden"; // Отключаем прокрутку страницы
        });
    });

    function updateCarousel() {
        popupCarouselTrack.innerHTML = "";
        images.forEach((src, index) => {
            const img = document.createElement("img");
            img.src = src;
            img.alt = "Фото услуги";
            img.classList.add("popup-carousel-image");
            if (index === currentImageIndex) img.classList.add("active");
            popupCarouselTrack.appendChild(img);
        });
    }

    // 📌 Навигация в карусели
    if (popupPrev && popupNext) {
        popupPrev.addEventListener("click", function () {
            currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
            updateCarousel();
        });

        popupNext.addEventListener("click", function () {
            currentImageIndex = (currentImageIndex + 1) % images.length;
            updateCarousel();
        });
    }

    // 📌 Закрытие всплывающего окна
    if (closePopupButton) {
        closePopupButton.addEventListener("click", function () {
            popupOverlay.style.display = "none";
            catalogPopup.style.display = "none";
            document.body.style.overflow = "auto"; // Включаем прокрутку обратно
        });
    }

    if (popupOverlay) {
        popupOverlay.addEventListener("click", function (event) {
            if (event.target === popupOverlay) {
                popupOverlay.style.display = "none";
                catalogPopup.style.display = "none";
                document.body.style.overflow = "auto";
            }
        });
    }

    // 📌 Переход на страницу каталога
    const fullCatalogButton = document.getElementById("btnFullCatalog");
    if (fullCatalogButton) {
        fullCatalogButton.addEventListener("click", function () {
            window.location.href = "catalog.html";
        });
    }
});