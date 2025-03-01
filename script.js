document.addEventListener("DOMContentLoaded", function () {
    // 📌 Мобильное меню
    function initMobileMenu() {
        const burgerMenu = document.querySelector('.burger-menu');
        const mobileMenu = document.querySelector('.mobile-menu');

        if (!burgerMenu || !mobileMenu) {
            console.error("❌ Ошибка: элементы меню не найдены");
            return;
        }

        const toggleMenu = () => mobileMenu.classList.toggle('open');
        const closeMenu = () => mobileMenu.classList.remove('open');

        burgerMenu.addEventListener('click', toggleMenu);
        document.querySelectorAll('.mobile-menu a').forEach(link => {
            link.addEventListener('click', closeMenu);
        });
    }

    // 📌 Карусели товаров
    function initProductCarousels() {
        document.querySelectorAll('.carousel').forEach(carousel => {
            const track = carousel.querySelector('.carousel-track');
            const images = track?.querySelectorAll('img');
            const prev = carousel.querySelector('.prev');
            const next = carousel.querySelector('.next');
            
            if (!images || images.length < 2 || !prev || !next) return;

            let currentIndex = 0;
            const maxIndex = images.length - 1;

            const updateCarousel = () => {
                images.forEach((img, idx) => {
                    img.classList.toggle('active', idx === currentIndex);
                });
            };

            prev.addEventListener('click', () => {
                currentIndex = currentIndex > 0 ? currentIndex - 1 : maxIndex;
                updateCarousel();
            });

            next.addEventListener('click', () => {
                currentIndex = currentIndex < maxIndex ? currentIndex + 1 : 0;
                updateCarousel();
            });

            updateCarousel();
        });
    }

    // 📌 Фильтрация товаров
    function initCatalogFilter() {
        const filterButtons = document.querySelectorAll(".filter-btn");
        const catalogItems = document.querySelectorAll(".catalog-item");

        filterButtons.forEach(button => {
            button.addEventListener("click", function () {
                filterButtons.forEach(btn => btn.classList.remove("active"));
                this.classList.add("active");

                const filter = this.dataset.filter;
                catalogItems.forEach(item => {
                    item.style.display = filter === "all" || item.classList.contains(filter) 
                        ? "flex" 
                        : "none";
                });
            });
        });
    }

    // 📌 Всплывающее окно с деталями
    function initPopup() {
        const elements = {
            detailsButtons: document.querySelectorAll(".btn-details"),
            popupOverlay: document.getElementById("popup-overlay"),
            catalogPopup: document.getElementById("catalog-popup"),
            closePopupButton: document.getElementById("popup-close"),
            popupTitle: document.getElementById("popup-title"),
            popupDescription: document.getElementById("popup-description"),
            popupPrice: document.getElementById("popup-price"),
            popupHeight: document.getElementById("popup-height"),
            popupColumns: document.getElementById("popup-columns"),
            popupLogs: document.getElementById("popup-logs"),
            popupCarouselTrack: document.getElementById("popup-carousel-track"),
            popupPrev: document.getElementById("popup-prev"),
            popupNext: document.getElementById("popup-next")
        };

        let currentImageIndex = 0;
        let images = [];

        const updatePopupCarousel = () => {
            elements.popupCarouselTrack.innerHTML = images
                .map((src, idx) => `
                    <img src="${src}" 
                         alt="Фото услуги" 
                         class="popup-carousel-image ${idx === currentImageIndex ? 'active' : ''}">
                `).join('');
        };

        const showPopup = (button) => {
            const getData = (attr) => button.getAttribute(attr) || '';
            
            elements.popupTitle.textContent = getData('data-title');
            elements.popupDescription.textContent = getData('data-description');
            elements.popupPrice.textContent = `${getData('data-price')} ₽`;
            elements.popupHeight.textContent = getData('data-height');
            elements.popupColumns.textContent = getData('data-columns');
            elements.popupLogs.textContent = getData('data-logs');

            try {
                images = JSON.parse(button.getAttribute('data-images') || '[]');
            } catch (e) {
                console.error("Ошибка загрузки изображений:", e);
                images = [];
            }

            currentImageIndex = 0;
            updatePopupCarousel();
            
            elements.popupOverlay.style.display = "block";
            elements.catalogPopup.style.display = "block";
            document.body.style.overflow = "hidden";
        };

        const closePopup = () => {
            elements.popupOverlay.style.display = "none";
            elements.catalogPopup.style.display = "none";
            document.body.style.overflow = "auto";
        };

        // Event Listeners
        elements.detailsButtons.forEach(btn => {
            btn.addEventListener('click', () => showPopup(btn));
        });

        elements.closePopupButton?.addEventListener('click', closePopup);
        elements.popupOverlay?.addEventListener('click', (e) => {
            if (e.target === elements.popupOverlay) closePopup();
        });

        elements.popupPrev?.addEventListener('click', () => {
            currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
            updatePopupCarousel();
        });

        elements.popupNext?.addEventListener('click', () => {
            currentImageIndex = (currentImageIndex + 1) % images.length;
            updatePopupCarousel();
        });
    }

    // 📌 Инициализация всех компонентов
    function initAll() {
        initMobileMenu();
        initProductCarousels();
        initCatalogFilter();
        initPopup();
    }

    initAll();
});

// 📌 Отзывы (отдельный обработчик для динамического контента)
function initReviewsSlider() {
    const slider = document.querySelector(".reviews-slider");
    if (!slider) return;

    let isDragging = false;
    let startX;
    let scrollLeft;

    const handleDragStart = (e) => {
        isDragging = true;
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
        slider.style.scrollSnapType = "none";
    };

    const handleDragEnd = () => {
        isDragging = false;
        snapToNearestReview();
    };

    const handleDragMove = (e) => {
        if (!isDragging) return;
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 1.2;
        slider.scrollLeft = scrollLeft - walk;
    };

    const snapToNearestReview = () => {
        const reviews = slider.querySelectorAll(".review-card");
        let closest = { index: 0, distance: Infinity };

        reviews.forEach((card, index) => {
            const distance = Math.abs(slider.scrollLeft - card.offsetLeft);
            if (distance < closest.distance) {
                closest = { index, distance };
            }
        });

        slider.style.scrollSnapType = "x mandatory";
        slider.scrollTo({
            left: reviews[closest.index].offsetLeft,
            behavior: "smooth"
        });
    };

    // Event Listeners
    slider.addEventListener('mousedown', handleDragStart);
    slider.addEventListener('mouseup', handleDragEnd);
    slider.addEventListener('mouseleave', handleDragEnd);
    slider.addEventListener('mousemove', handleDragMove);
}

document.addEventListener("DOMContentLoaded", initReviewsSlider);


// Показ модального окна при загрузке страницы
document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('consent-modal');
    const consentYes = document.getElementById('consent-yes');
    const consentNo = document.getElementById('consent-no');

    // Проверяем, было ли уже дано согласие
    if (!localStorage.getItem('consentGiven')) {
        modal.style.display = 'flex'; // Показываем модальное окно
    }

    // Обработка согласия
    consentYes.addEventListener('click', function () {
        localStorage.setItem('consentGiven', 'true'); // Сохраняем согласие
        modal.style.display = 'none'; // Скрываем модальное окно
    });

    // Обработка отказа
    consentNo.addEventListener('click', function () {
        localStorage.setItem('consentGiven', 'false'); // Сохраняем отказ
        window.location.href = 'https://google.com'; // Перенаправляем пользователя
    });
});
