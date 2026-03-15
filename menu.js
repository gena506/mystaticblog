// menu.js – управление контекстным меню и переключение темы

document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menu-toggle');
    const contextMenu = document.getElementById('context-menu');
    const themeToggle = document.getElementById('theme-toggle');

    // ===== Переключение темы =====
    // При загрузке применяем сохранённую тему, если есть
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'light') {
        document.body.classList.add('theme-light');
    }
    // Если savedTheme === 'dark' или null, оставляем тёмную тему (по умолчанию)

    if (themeToggle) {
        themeToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            // Переключаем класс на body
            document.body.classList.toggle('theme-light');
            
            // Сохраняем выбор
            if (document.body.classList.contains('theme-light')) {
                localStorage.setItem('theme', 'light');
            } else {
                localStorage.setItem('theme', 'dark');
            }

            // Закрываем меню после выбора
            contextMenu.classList.remove('active');
        });
    }

    // ===== Контекстное меню =====
    if (menuToggle && contextMenu) {
        // Открытие/закрытие по клику на иконку
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            contextMenu.classList.toggle('active');
        });

        // Закрытие при клике вне меню
        document.addEventListener('click', function(e) {
            if (!contextMenu.contains(e.target) && !menuToggle.contains(e.target)) {
                contextMenu.classList.remove('active');
            }
        });
    }
});