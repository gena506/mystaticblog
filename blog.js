const POSTS_PER_PAGE = 5;
let currentPage = 1;
let articlesData = [];

const container = document.getElementById('articles-container');
const paginationDiv = document.getElementById('pagination');

fetch('pages/pagelist.json?v=' + Date.now())
    .then(response => {
        if (!response.ok) throw new Error('Не удалось загрузить список статей');
        return response.json();
    })
    .then(data => {
        // Сортировка от старых к новым (по возрастанию даты)
        articlesData = data.sort((a, b) => new Date(a.date) - new Date(b.date));
        renderPage(currentPage);
        setupPagination();
    })
    .catch(error => {
        container.innerHTML = `<div class="message-group"><div class="message" style="color: red;">Ошибка: ${error.message}</div></div>`;
    });

// Возвращает дату последней статьи на предыдущей странице (для page > 1)
function getPrevPageLastDate(page) {
    if (page <= 1) return null;
    const total = articlesData.length;
    // Индекс последнего элемента на странице page-1
    const prevPageLastIndex = total - (page - 2) * POSTS_PER_PAGE - 1;
    return articlesData[prevPageLastIndex]?.date || null;
}

function renderPage(page, prevDateFromPrevPage) {
    const total = articlesData.length;
    const start = Math.max(0, total - page * POSTS_PER_PAGE);
    const end = total - (page - 1) * POSTS_PER_PAGE;
    const pageArticles = articlesData.slice(start, end);

    if (pageArticles.length === 0 && page > 1) {
        // Если страница пуста (например, последняя страница с неполным блоком), переходим на последнюю существующую
        currentPage = Math.ceil(total / POSTS_PER_PAGE);
        renderPage(currentPage);
        return;
    }

    // Начальная дата для сравнения (если передана с предыдущей страницы)
    let prevDate = prevDateFromPrevPage !== undefined ? prevDateFromPrevPage : null;

    let html = '';
    for (let article of pageArticles) {
        const currentDate = article.date;
        if (currentDate !== prevDate) {
            html += `<div class="system-message">${formatDateRu(currentDate)}</div>`;
        }

        let messageContent = article.title;
        if (article.description) {
            messageContent += '<br>' + '<br>' + article.description;
        }

        html += `
            <div class="message-group">
                <div class="message">
                    ${messageContent}
                </div>
                <div class="message-buttons">
                    <a href="pages/${article.file}" class="tg-button">Открыть</a>
                </div>
            </div>
        `;

        prevDate = currentDate;
    }

    container.innerHTML = html;
}

function setupPagination() {
    const totalPages = Math.ceil(articlesData.length / POSTS_PER_PAGE);
    const backHome = document.getElementById('back-home');

    if (totalPages <= 1) {
        paginationDiv.innerHTML = '';
        if (backHome) backHome.style.display = 'none';
        return;
    }

    if (backHome) backHome.style.display = '';

    let buttonsHtml = '';
    buttonsHtml += `<button class="tg-button" id="prev-page" ${currentPage === 1 ? 'disabled' : ''}>←</button>`;
    for (let i = 1; i <= totalPages; i++) {
        buttonsHtml += `<button class="tg-button page-num" data-page="${i}" ${i === currentPage ? 'disabled' : ''}>${i}</button>`;
    }
    buttonsHtml += `<button class="tg-button" id="next-page" ${currentPage === totalPages ? 'disabled' : ''}>→</button>`;

    const paginationGroupHTML = `
        <div class="message-group">
            <div class="message">Это еще не все) <br> Я много всего пишу, я отбитый😤</div>
            <div class="message-buttons">
                ${buttonsHtml}
            </div>
        </div>
    `;

    paginationDiv.innerHTML = paginationGroupHTML;

    // Обработчики с учётом правильной даты для разделителя
    document.getElementById('prev-page')?.addEventListener('click', () => {
        if (currentPage > 1) {
            const newPage = currentPage - 1;
            const prevDate = getPrevPageLastDate(newPage);
            currentPage = newPage;
            renderPage(currentPage, prevDate);
            setupPagination();
        }
    });

    document.getElementById('next-page')?.addEventListener('click', () => {
        if (currentPage < totalPages) {
            const newPage = currentPage + 1;
            const prevDate = getPrevPageLastDate(newPage);
            currentPage = newPage;
            renderPage(currentPage, prevDate);
            setupPagination();
        }
    });

    document.querySelectorAll('.page-num').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const newPage = parseInt(e.target.dataset.page);
            if (newPage !== currentPage) {
                const prevDate = getPrevPageLastDate(newPage);
                currentPage = newPage;
                renderPage(currentPage, prevDate);
                setupPagination();
            }
        });
    });
}

function formatDateRu(dateStr) {
    const [year, month, day] = dateStr.split('-');
    const months = [
        'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
        'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
    ];
    const monthIndex = parseInt(month, 10) - 1;
    return `${parseInt(day, 10)} ${months[monthIndex]} ${year}`;
}