// Открытие/закрытие мобильного меню
const burgerMenu = document.querySelector('.burger-menu');
const mobileMenu = document.querySelector('.mobile-menu');

burgerMenu.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
});

// Закрываем меню при выборе пункта
document.querySelectorAll('.mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
    });
});

// Карусель для изображений товаров
document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("[data-carousel]").forEach(carousel => {
        let track = carousel.querySelector(".carousel-track");
        if (!track) return; // Проверяем, существует ли элемент

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
});

// Карусель для отзывов
document.addEventListener("DOMContentLoaded", function () {
    const carousels = document.querySelectorAll("[data-carousel]");

    carousels.forEach(carousel => {
        let track = carousel.querySelector(".reviews-track");
        if (!track) return;

        let reviews = track.querySelectorAll(".review");
        let currentIndex = 0;

        function updateCarousel() {
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
        }

        const nextButton = carousel.querySelector("[data-carousel-button='next']");
        const prevButton = carousel.querySelector("[data-carousel-button='prev']");

        if (nextButton && prevButton) {
            nextButton.addEventListener("click", () => {
                if (currentIndex < reviews.length - 1) {
                    currentIndex++;
                } else {
                    currentIndex = 0; // Если последний – перейти к первому
                }
                updateCarousel();
            });

            prevButton.addEventListener("click", () => {
                if (currentIndex > 0) {
                    currentIndex--;
                } else {
                    currentIndex = reviews.length - 1; // Если первый – перейти к последнему
                }
                updateCarousel();
            });
        }

        updateCarousel();
    });
});


document.addEventListener("DOMContentLoaded", function () {
    const detailsButtons = document.querySelectorAll(".btn-details");
    const popup = document.getElementById("catalog-popup");
    const overlay = document.getElementById("popup-overlay");
    const closeButton = document.getElementById("popup-close");

    const popupTitle = document.getElementById("popup-title");
    const popupDescription = document.getElementById("popup-description");
    const popupPrice = document.getElementById("popup-price");
    const popupHeight = document.getElementById("popup-height");
    const popupColumns = document.getElementById("popup-columns");
    const popupLogs = document.getElementById("popup-logs");
    const popupWorkPrice = document.getElementById("popup-workprice");
    const popupImagesContainer = document.getElementById("popup-carousel-track");

    const prevButton = document.getElementById("popup-prev");
    const nextButton = document.getElementById("popup-next");

    let images = [];
    let currentIndex = 0;

    detailsButtons.forEach(button => {
        button.addEventListener("click", function () {
            document.body.classList.add("no-scroll");

            // Заполняем заголовки и описание, если они есть
            if (popupTitle) popupTitle.textContent = this.dataset.title || "Название отсутствует";
            if (popupDescription) popupDescription.textContent = this.dataset.description || "Описание отсутствует";
            if (popupPrice) popupPrice.textContent = this.dataset.price ? `${this.dataset.price} ₽` : "Цена уточняется";
            if (popupHeight) popupHeight.textContent = this.dataset.height || "";
            if (popupColumns) popupColumns.textContent = this.dataset.columns || "";
            if (popupLogs) popupLogs.textContent = this.dataset.logs || "";
            if (popupWorkPrice) popupWorkPrice.textContent = this.dataset.workprice || "";

            // Загружаем изображения (если есть)
            images = this.dataset.images ? JSON.parse(this.dataset.images) : [];
            if (popupImagesContainer) {
                popupImagesContainer.innerHTML = images.length > 0
                    ? images.map((src, index) =>
                        `<img src="${src}" class="popup-carousel-image ${index === 0 ? 'active' : ''}">`
                    ).join("")
                    : "<p class='no-image'>Нет доступных изображений</p>";
            }

            currentIndex = 0;
            updateCarousel();

            popup.classList.add("active");
            overlay.classList.add("active");
        });
    });

    function closePopup() {
        document.body.classList.remove("no-scroll");
        popup.classList.remove("active");
        overlay.classList.remove("active");
    }

    closeButton.addEventListener("click", closePopup);
    overlay.addEventListener("click", closePopup);

    // Функции для листания изображений
    prevButton.addEventListener("click", () => changeSlide(-1));
    nextButton.addEventListener("click", () => changeSlide(1));

    function changeSlide(direction) {
        const allImages = document.querySelectorAll(".popup-carousel-image");
        if (allImages.length === 0) return; // Если нет фото, ничего не делаем

        allImages[currentIndex].classList.remove("active");

        currentIndex = (currentIndex + direction + images.length) % images.length;
        allImages[currentIndex].classList.add("active");
    }

    function updateCarousel() {
        const allImages = document.querySelectorAll(".popup-carousel-image");
        allImages.forEach((img, index) => img.classList.toggle("active", index === currentIndex));
    }
});


document.addEventListener("DOMContentLoaded", function () {
    const fullCatalogButton = document.getElementById("btnFullCatalog");

    if (fullCatalogButton) {
        fullCatalogButton.addEventListener("click", function () {
            window.location.href = "catalog.html"; // Укажите нужную страницу
        });
    }
});


document.addEventListener("DOMContentLoaded", function () {
    const filterButtons = document.querySelectorAll(".filter-btn");
    const catalogItems = document.querySelectorAll(".catalog-item");

    filterButtons.forEach(button => {
        button.addEventListener("click", function () {
            // Удаляем активный класс у всех кнопок
            filterButtons.forEach(btn => btn.classList.remove("active"));
            this.classList.add("active");

            const filter = this.dataset.filter;

            catalogItems.forEach(item => {
                if (filter === "all" || item.classList.contains(filter)) {
                    item.style.display = "flex";
                } else {
                    item.style.display = "none";
                }
            });
        });
    });
});