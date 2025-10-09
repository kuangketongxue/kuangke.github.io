const STORAGE_KEYS = {
    moments: 'momentsData',
    diary: 'successDiaryData',
    theme: 'theme',
    language: 'language'
};

let currentCategory = 'all';
let currentMomentId = null;
let selectedDiaryTags = new Set();
let diaryMoodFilter = 'all';
let diarySortBy = 'dateDesc';
let diarySearchKeyword = '';
let currentLanguage = localStorage.getItem(STORAGE_KEYS.language) || 'zh';
let currentPage = 'moments';

const translations = {
    zh: {
        successTitle: '成功日记时间轴',
        successSubtitle: '当你写成功日记的时候，你会对自己，对世界，还有对成功的规律作更深入的思考，会越来越多地了解自己和自己的愿望，这样你才会有能力去理解别人。彻底了解自己和世界上的所有秘密，是我们无法完全实现的一种理想，但我们可以一步一步地慢慢接近这种理想。一个人挣钱的多少是和他的自信心联系在一起的。另外,他的精力究竟是集中在自己的能力范围之内,还是放到了他力所不能及的事情上,这也是很重要的一点。没有我的成功日记本,我就不会去思考自己适合在哪些方面赚钱。',
        searchPlaceholder: '搜索标题、标签、心情...',
        moodAll: '全部心情',
        sortLabel: '排序',
        sortDateDesc: '日期：最新优先',
        sortDateAsc: '日期：最旧优先',
        sortAchievementDesc: '成就值：最高优先',
        sortAchievementAsc: '成就值：最低优先',
        moodLabel: '心情',
        tagLabel: '分类标签',
        resetFilters: '重置筛选',
        timelineEmpty: '暂无符合条件的成功日记',
        timelineTags: '标签',
        timelineMood: '心情',
        timelineAchievement: '成就值',
        timelineNotes: '小结',
        attachments: '附件',
        entryCount: (count) => `共 ${count} 条记录`
    },
    en: {
        successTitle: 'Success Diary Timeline',
        successSubtitle: 'When you write a success journal, you will reflect more deeply on yourself, the world, and the principles of success. You will gain a better understanding of yourself and your desires, which will enable you to comprehend others. Completely understanding oneself and all the secrets of the world is an ideal that may not be fully achievable, but we can gradually work towards it step by step.The amount of money one earns is closely linked to their level of self-confidence. Additionally, it is crucial to determine whether one's energy is focused on endeavors within their capabilities or on tasks that are beyond their reach. Without my success journal, I would not have considered which areas might be suitable for me to make money in.',
        searchPlaceholder: 'Search title, tags, moods...',
        moodAll: 'All moods',
        sortLabel: 'Sort',
        sortDateDesc: 'Date: newest first',
        sortDateAsc: 'Date: oldest first',
        sortAchievementDesc: 'Achievement: highest first',
        sortAchievementAsc: 'Achievement: lowest first',
        moodLabel: 'Mood',
        tagLabel: 'Tags',
        resetFilters: 'Reset filters',
        timelineEmpty: 'No diary entries match the filters yet.',
        timelineTags: 'Tags',
        timelineMood: 'Mood',
        timelineAchievement: 'Achievement',
        timelineNotes: 'Notes',
        attachments: 'Attachments',
        entryCount: (count) => `${count} entries`
    }
};

document.addEventListener('DOMContentLoaded', () => {
    currentPage = document.body?.dataset?.page || 'moments';
    applySavedTheme();
    initializeGlobalControls();
    if (currentPage === 'moments') {
        initMomentsPage();
    } else if (currentPage === 'success') {
        initSuccessPage();
    }
});

// 通用：主题 & 语言
function initializeGlobalControls() {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
        updateThemeToggleIcon(themeToggle);
    }
    const languageToggle = document.getElementById('languageToggle');
    if (languageToggle) {
        languageToggle.addEventListener('click', toggleLanguage);
        updateLanguageToggleLabel(languageToggle);
    }
}

function applySavedTheme() {
    const savedTheme = localStorage.getItem(STORAGE_KEYS.theme);
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
    } else {
        document.body.classList.remove('light-mode');
    }
}

function toggleTheme() {
    document.body.classList.toggle('light-mode');
    const theme = document.body.classList.contains('light-mode') ? 'light' : 'dark';
    localStorage.setItem(STORAGE_KEYS.theme, theme);
    updateThemeToggleIcon(document.getElementById('themeToggle'));
}

function updateThemeToggleIcon(button) {
    if (!button) return;
    const icon = button.querySelector('i');
    if (!icon) return;
    icon.className = document.body.classList.contains('light-mode') ? 'fas fa-sun' : 'fas fa-moon';
}

function toggleLanguage() {
    currentLanguage = currentLanguage === 'zh' ? 'en' : 'zh';
    localStorage.setItem(STORAGE_KEYS.language, currentLanguage);
    updateLanguageToggleLabel(document.getElementById('languageToggle'));
    if (currentPage === 'success') {
        populateMoodFilter();
        updateSuccessPageTexts();
        renderDiaryTagFilters();
        renderDiaryTimeline();
    }
}

function updateLanguageToggleLabel(button) {
    if (!button) return;
    const icon = button.querySelector('i');
    const span = button.querySelector('span');
    if (icon) icon.className = 'fas fa-language';
    if (span) span.textContent = currentLanguage === 'zh' ? '中 → EN' : 'EN → 中';
}

// 朋友圈页面初始化
function initMomentsPage() {
    loadMomentsData();
    renderMoments();
    initializeMomentsEventListeners();
}

function initializeMomentsEventListeners() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
    const categoryBtns = document.querySelectorAll('.category-btn');
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            categoryBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentCategory = this.dataset.category;
            renderMoments();
        });
    });
    const modal = document.getElementById('commentModal');
    if (modal) {
        const closeBtn = modal.querySelector('.close');
        if (closeBtn) {
            closeBtn.onclick = () => (modal.style.display = 'none');
        }
        window.onclick = (e) => {
            if (e.target === modal) modal.style.display = 'none';
        };
    }
    const submitComment = document.getElementById('submitComment');
    if (submitComment) {
        submitComment.addEventListener('click', handleCommentSubmit);
    }
    const commentInput = document.getElementById('commentInput');
    if (commentInput) {
        commentInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') handleCommentSubmit();
        });
    }
}

function loadMomentsData() {
    const saved = localStorage.getItem(STORAGE_KEYS.moments);
    if (saved) {
        try {
            const loaded = JSON.parse(saved);
            const savedIds = loaded.map(m => m.id);
            const newDefaults = momentsData.filter(m => !savedIds.includes(m.id));
            momentsData = [...loaded, ...newDefaults];
        } catch (e) {
            console.error('加载数据失败:', e);
        }
    }
}

function saveMomentsData() {
    try {
        localStorage.setItem(STORAGE_KEYS.moments, JSON.stringify(momentsData));
    } catch (e) {
        console.error('保存数据失败:', e);
    }
}

function renderMoments(filteredData = null) {
    const container = document.getElementById('momentsContainer');
    if (!container) return;
    const dataToRender = filteredData || momentsData;
    const filtered = currentCategory === 'all'
        ? dataToRender
        : dataToRender.filter(m => m.category === currentCategory);
    filtered.sort((a, b) => new Date(b.time) - new Date(a.time));
    if (filtered.length === 0) {
        container.innerHTML = '<div class="no-results">暂无内容</div>';
        return;
    }
    container.innerHTML = filtered.map((moment, index) => `
        <div class="moment-card" style="animation-delay: ${index * 0.1}s">
            <div class="moment-header">
                <span class="category-tag">${escapeHtml(moment.category)}</span>
                <span class="value-badge">⭐ ${moment.value}</span>
            </div>
            <div class="moment-content">${escapeHtml(moment.content)}</div>
            ${moment.image ? `<img src="${escapeHtml(moment.image)}" alt="图片" class="moment-image" onerror="this.style.display='none'">` : ''}
            <div class="moment-footer">
                <span class="moment-time">
                    <i class="far fa-clock"></i> ${formatTime(moment.time)}
                </span>
                <div class="moment-actions">
                    <button class="action-btn ${moment.likes > 0 ? 'liked' : ''}" data-like-id="${moment.id}" onclick="handleLike(${moment.id})">
                        <i class="${moment.likes > 0 ? 'fas' : 'far'} fa-heart"></i>
                        <span>${moment.likes > 0 ? moment.likes : ''}</span>
                    </button>
                    <button class="action-btn" onclick="openCommentModal(${moment.id})">
                        <i class="far fa-comment"></i>
                        <span>${moment.comments && moment.comments.length > 0 ? moment.comments.length : ''}</span>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function escapeHtml(text) {
    if (text === undefined || text === null) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatTime(timeStr) {
    const date = new Date(timeStr);
    if (Number.isNaN(date.getTime())) return timeStr;
    const now = new Date();
    const diff = now - date;
    const oneMinute = 1000 * 60;
    const oneHour = oneMinute * 60;
    const oneDay = oneHour * 24;
    if (diff < oneMinute) return '刚刚';
    if (diff < oneHour) return `${Math.floor(diff / oneMinute)}分钟前`;
    if (diff < oneDay) return `${Math.floor(diff / oneHour)}小时前`;
    if (diff < oneDay * 2) return '昨天';
    if (diff < oneDay * 7) return `${Math.floor(diff / oneDay)}天前`;
    return date.toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
}

function handleLike(id) {
    const moment = momentsData.find(m => m.id === id);
    if (moment) {
        const hasLiked = moment.likes > 0;
        moment.likes = hasLiked ? 0 : 1;
        saveMomentsData();
        renderMoments();
        const btn = document.querySelector(`.action-btn[data-like-id="${id}"]`);
        if (btn && !hasLiked) {
            btn.style.transform = 'scale(1.2)';
            setTimeout(() => { btn.style.transform = 'scale(1)'; }, 200);
        }
    }
}

function openCommentModal(id) {
    currentMomentId = id;
    const moment = momentsData.find(m => m.id === id);
    if (!moment) return;
    const modal = document.getElementById('commentModal');
    if (!modal) return;
    modal.style.display = 'block';
    if (!moment.comments) {
        moment.comments = [];
    }
    renderComments(moment.comments);
    setTimeout(() => {
        const input = document.getElementById('commentInput');
        if (input) input.focus();
    }, 100);
}

function renderComments(comments) {
    const commentsList = document.getElementById('commentsList');
    if (!commentsList) return;
    if (!comments || comments.length === 0) {
        commentsList.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 2rem;">暂无评论，快来抢沙发吧！</p>';
        return;
    }
    commentsList.innerHTML = comments.map((comment, index) => `
        <div class="comment-item" style="animation-delay: ${index * 0.05}s">
            <div style="margin-bottom: 0.5rem; color: var(--text-secondary); font-size: 0.85rem;">
                <i class="far fa-user-circle"></i> 访客 • ${escapeHtml(comment.time)}
            </div>
            <div style="line-height: 1.6;">${escapeHtml(comment.content)}</div>
        </div>
    `).join('');
}

function handleCommentSubmit() {
    const input = document.getElementById('commentInput');
    if (!input) return;
    const content = input.value.trim();
    if (!content) {
        showNotification('请输入评论内容', 'warning');
        return;
    }
    if (content.length > 500) {
        showNotification('评论内容不能超过500字', 'warning');
        return;
    }
    const moment = momentsData.find(m => m.id === currentMomentId);
    if (!moment) return;
    if (!moment.comments) {
        moment.comments = [];
    }
    const comment = {
        content,
        time: new Date().toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        })
    };
    moment.comments.unshift(comment);
    saveMomentsData();
    renderComments(moment.comments);
    renderMoments();
    input.value = '';
    showNotification('评论发表成功！', 'success');
}

function handleSearch(e) {
    const keyword = (e.target.value || '').toLowerCase().trim();
    if (!keyword) {
        renderMoments();
        return;
    }
    const filtered = momentsData.filter(moment =>
        moment.content.toLowerCase().includes(keyword) ||
        moment.category.toLowerCase().includes(keyword)
    );
    renderMoments(filtered);
}

// 成功日记页面初始化
function initSuccessPage() {
    populateMoodFilter();
    updateSuccessPageTexts();
    renderDiaryTagFilters();
    bindDiaryControls();
    renderDiaryTimeline();
}

function bindDiaryControls() {
    const searchInput = document.getElementById('diarySearchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            diarySearchKeyword = e.target.value.toLowerCase().trim();
            renderDiaryTimeline();
        });
        searchInput.placeholder = t('searchPlaceholder');
    }
    const moodSelect = document.getElementById('diaryMoodSelect');
    if (moodSelect) {
        moodSelect.addEventListener('change', (e) => {
            diaryMoodFilter = e.target.value;
            renderDiaryTimeline();
        });
    }
    const sortSelect = document.getElementById('diarySortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            diarySortBy = e.target.value;
            renderDiaryTimeline();
        });
        updateSortOptions(sortSelect);
    }
    const resetFilters = document.getElementById('diaryResetFilters');
    if (resetFilters) {
        resetFilters.addEventListener('click', () => {
            selectedDiaryTags.clear();
            diaryMoodFilter = 'all';
            diarySortBy = 'dateDesc';
            diarySearchKeyword = '';
            if (searchInput) searchInput.value = '';
            if (moodSelect) moodSelect.value = 'all';
            if (sortSelect) sortSelect.value = 'dateDesc';
            renderDiaryTagFilters();
            renderDiaryTimeline();
        });
    }
}

function updateSortOptions(select) {
    if (!select) return;
    const options = select.options;
    if (!options) return;
    options[0].textContent = t('sortDateDesc');
    options[1].textContent = t('sortDateAsc');
    options[2].textContent = t('sortAchievementDesc');
    options[3].textContent = t('sortAchievementAsc');
}

function renderDiaryTagFilters() {
    const container = document.getElementById('diaryTagFilter');
    if (!container) return;
    container.innerHTML = diaryTagLibrary.map(tag => {
        const isActive = selectedDiaryTags.has(tag.code);
        return `
            <button type="button" class="filter-chip ${isActive ? 'active' : ''}" data-tag="${tag.code}">
                ${escapeHtml(getTagLabel(tag.code))}
            </button>
        `;
    }).join('');
    container.querySelectorAll('.filter-chip').forEach(btn => {
        btn.addEventListener('click', () => {
            const code = btn.dataset.tag;
            if (selectedDiaryTags.has(code)) {
                selectedDiaryTags.delete(code);
            } else {
                selectedDiaryTags.add(code);
            }
            renderDiaryTagFilters();
            renderDiaryTimeline();
        });
    });
}

function populateMoodFilter() {
    const moodSelect = document.getElementById('diaryMoodSelect');
    if (!moodSelect) return;
    const currentValue = moodSelect.value || 'all';
    let optionsHtml = `<option value="all">${t('moodAll')}</option>`;
    Object.keys(moodLibrary).forEach(code => {
        optionsHtml += `<option value="${code}" data-code="${code}">${escapeHtml(getMoodLabel(code))}</option>`;
    });
    moodSelect.innerHTML = optionsHtml;
    moodSelect.value = currentValue;
}

function updateSuccessPageTexts() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.dataset.i18n;
        const value = t(key);
        if (typeof value === 'string') {
            element.textContent = value;
        }
    });
    const searchInput = document.getElementById('diarySearchInput');
    if (searchInput) searchInput.placeholder = t('searchPlaceholder');
    updateSortOptions(document.getElementById('diarySortSelect'));
}

function renderDiaryTimeline() {
    const container = document.getElementById('diaryTimeline');
    if (!container) return;
    const filtered = getFilteredDiaryData();
    if (filtered.length === 0) {
        container.innerHTML = `<div class="diary-empty">${t('timelineEmpty')}</div>`;
        updateDiaryCounter(0);
        return;
    }
    container.innerHTML = filtered.map(entry => renderDiaryCard(entry)).join('');
    updateDiaryCounter(filtered.length);
}

function getFilteredDiaryData() {
    let data = [...successDiaryData];
    if (selectedDiaryTags.size > 0) {
        data = data.filter(entry => {
            return Array.from(selectedDiaryTags).every(tag => entry.categories.includes(tag));
        });
    }
    if (diaryMoodFilter !== 'all') {
        data = data.filter(entry => entry.moodCode === diaryMoodFilter);
    }
    if (diarySearchKeyword) {
        data = data.filter(entry => matchDiarySearch(entry, diarySearchKeyword));
    }
    data.sort((a, b) => {
        switch (diarySortBy) {
            case 'dateAsc':
                return new Date(a.date) - new Date(b.date);
            case 'achievementDesc':
                return b.achievementLevel - a.achievementLevel;
            case 'achievementAsc':
                return a.achievementLevel - b.achievementLevel;
            case 'dateDesc':
            default:
                return new Date(b.date) - new Date(a.date);
        }
    });
    return data;
}

function matchDiarySearch(entry, keyword) {
    const fields = [
        entry.headline?.zh,
        entry.headline?.en,
        entry.content?.zh,
        entry.content?.en,
        entry.highlight?.zh,
        entry.highlight?.en,
        entry.notes?.zh,
        entry.notes?.en,
        ...entry.categories.map(code => getTagLabel(code)),
        getMoodLabel(entry.moodCode)
    ];
    return fields.some(field => field && normalize(field).includes(keyword));
}

function normalize(text) {
    return (text || '').toString().toLowerCase();
}

function renderDiaryCard(entry) {
    const lang = currentLanguage;
    const altLang = lang === 'zh' ? 'en' : 'zh';
    const headline = entry.headline?.[lang] || entry.headline?.[altLang] || '';
    const headlineAlt = entry.headline?.[altLang] || '';
    const content = entry.content?.[lang] || entry.content?.[altLang] || '';
    const contentAlt = entry.content?.[altLang] || '';
    const highlight = entry.highlight?.[lang] || entry.highlight?.[altLang] || '';
    const highlightAlt = entry.highlight?.[altLang] || '';
    const mood = getMood(entry.moodCode);
    const tagsHtml = entry.categories.map(code => `<span class="tag-pill">${escapeHtml(getTagLabel(code))}</span>`).join('');
    const attachmentsHtml = renderAttachments(entry.attachments);
    const cover = entry.coverImage ? `<img src="${escapeHtml(entry.coverImage)}" alt="cover" class="diary-cover" onerror="this.style.display='none'">` : '';
    return `
        <div class="timeline-item">
            <div class="timeline-marker"></div>
            <div class="timeline-card">
                <div class="diary-date">${formatDiaryDate(entry.date, lang)}</div>
                <article class="diary-card-body">
                    ${cover}
                    <div class="diary-card-content">
                        <header class="diary-card-header">
                            <h3 class="diary-title">${formatMultiline(headline)}</h3>
                            ${headlineAlt && headlineAlt !== headline ? `<p class="diary-alt">${formatMultiline(headlineAlt)}</p>` : ''}
                        </header>
                        <div class="diary-text">
                            ${content ? `<p>${formatMultiline(content)}</p>` : ''}
                            ${contentAlt && contentAlt !== content ? `<p class="diary-alt">${formatMultiline(contentAlt)}</p>` : ''}
                        </div>
                        ${highlight ? `
                            <div class="diary-highlight">
                                <strong>${t('timelineNotes')}：</strong>
                                <span>${formatMultiline(highlight)}</span>
                                ${highlightAlt && highlightAlt !== highlight ? `<div class="diary-alt">${formatMultiline(highlightAlt)}</div>` : ''}
                            </div>
                        ` : ''}
                        <div class="diary-meta">
                            <div>
                                <span class="meta-title">${t('timelineTags')}：</span>
                                <span class="meta-content">${tagsHtml || '—'}</span>
                            </div>
                            <div>
                                <span class="meta-title">${t('timelineMood')}：</span>
                                <span class="meta-content">
                                    ${mood ? `<span class="mood-badge" style="border-color:${mood.color}; color:${mood.color};">${escapeHtml(mood[lang] || mood.zh)}</span>` : '—'}
                                </span>
                            </div>
                            <div>
                                <span class="meta-title">${t('timelineAchievement')}：</span>
                                <span class="achievement-badge">⭐ ${entry.achievementLevel}</span>
                            </div>
                        </div>
                        ${attachmentsHtml}
                    </div>
                </article>
            </div>
        </div>
    `;
}

function formatDiaryDate(dateStr, lang) {
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return dateStr;
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short' };
    return date.toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-US', options);
}

function formatMultiline(text) {
    if (!text) return '';
    return escapeHtml(text).replace(/\n/g, '<br>');
}

function renderAttachments(attachments) {
    if (!Array.isArray(attachments) || attachments.length === 0) return '';
    const items = attachments.map(path => {
        const trimmed = path.trim();
        if (!trimmed) return '';
        const isImage = /\.(png|jpe?g|gif|webp|svg)$/i.test(trimmed);
        if (isImage) {
            return `<img src="${escapeHtml(trimmed)}" alt="attachment" class="diary-attachment" onerror="this.style.display='none'">`;
        }
        return `<a href="${escapeHtml(trimmed)}" target="_blank" rel="noopener" class="diary-attachment-link">${escapeHtml(trimmed)}</a>`;
    }).join('');
    return `<div class="diary-attachments"><span class="meta-title">${t('attachments')}：</span>${items}</div>`;
}

function getMood(code) {
    return moodLibrary[code] || null;
}

function getMoodLabel(code, lang = currentLanguage) {
    const mood = getMood(code);
    if (!mood) return code || '';
    return mood[lang] || mood.zh || code;
}

function getTagLabel(code, lang = currentLanguage) {
    const tag = diaryTagLibrary.find(item => item.code === code);
    if (!tag) return code || '';
    return tag[lang] || tag.zh || code;
}

function updateDiaryCounter(count) {
    const counter = document.getElementById('diaryCounter');
    if (!counter) return;
    const text = t('entryCount');
    counter.textContent = typeof text === 'function' ? text(count) : `${count}`;
}

// 通知气泡
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${escapeHtml(message)}</span>
    `;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#10b981' : type === 'warning' ? '#f59e0b' : '#3b82f6'};
        color: white;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        animation: slideInRight 0.3s ease-out;
        font-size: 0.95rem;
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function t(key) {
    const langPack = translations[currentLanguage] || translations.zh;
    const fallbackPack = translations.zh;
    const value = langPack[key] !== undefined ? langPack[key] : fallbackPack[key];
    return value !== undefined ? value : key;
}

// 全局函数暴露
window.handleLike = handleLike;
window.openCommentModal = openCommentModal;
