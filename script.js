// 全局变量
let currentCategory = 'all';
let currentMomentId = null;

// DOM 加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    loadMomentsData();
    renderMoments();
    initializeEventListeners();
});

// 初始化事件监听器
function initializeEventListeners() {
    // 主题切换
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.addEventListener('click', toggleTheme);
    
    // 搜索功能
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', handleSearch);
    
    // 分类按钮
    const categoryBtns = document.querySelectorAll('.category-btn');
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            categoryBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentCategory = this.dataset.category;
            renderMoments();
        });
    });
    
    // 评论弹窗
    const modal = document.getElementById('commentModal');
    const closeBtn = modal.querySelector('.close');
    closeBtn.onclick = () => modal.style.display = 'none';
    window.onclick = (e) => {
        if (e.target == modal) modal.style.display = 'none';
    };
    
    // 提交评论
    const submitComment = document.getElementById('submitComment');
    submitComment.addEventListener('click', handleCommentSubmit);
    
    // 回车提交评论
    document.getElementById('commentInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') handleCommentSubmit();
    });
}

// 主题切换
function toggleTheme() {
    document.body.classList.toggle('light-mode');
    const icon = document.querySelector('#themeToggle i');
    if (document.body.classList.contains('light-mode')) {
        icon.className = 'fas fa-sun';
        localStorage.setItem('theme', 'light');
    } else {
        icon.className = 'fas fa-moon';
        localStorage.setItem('theme', 'dark');
    }
}

// 加载保存的主题
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
    document.querySelector('#themeToggle i').className = 'fas fa-sun';
}

// 渲染朋友圈
function renderMoments(filteredData = null) {
    const container = document.getElementById('momentsContainer');
    const dataToRender = filteredData || momentsData;
    
    // 根据分类过滤
    const filtered = currentCategory === 'all' 
        ? dataToRender 
        : dataToRender.filter(m => m.category === currentCategory);
    
    if (filtered.length === 0) {
        container.innerHTML = '<div class="no-results">暂无内容</div>';
        return;
    }
    
    container.innerHTML = filtered.map((moment, index) => `
        <div class="moment-card" style="animation-delay: ${index * 0.1}s">
            <div class="moment-header">
                <span class="category-tag">${moment.category}</span>
                <span class="value-badge">⭐ ${moment.value}</span>
            </div>
            <div class="moment-content">${moment.content}</div>
            ${moment.image ? `<img src="${moment.image}" alt="图片" class="moment-image" onerror="this.style.display='none'">` : ''}
            <div class="moment-footer">
                <span class="moment-time">
                    <i class="far fa-clock"></i> ${moment.time}
                </span>
                <div class="moment-actions">
                    <button class="action-btn ${moment.likes > 0 ? 'liked' : ''}" onclick="handleLike(${moment.id})">
                        <i class="${moment.likes > 0 ? 'fas' : 'far'} fa-heart"></i>
                        <span>${moment.likes || ''}</span>
                    </button>
                    <button class="action-btn" onclick="openCommentModal(${moment.id})">
                        <i class="far fa-comment"></i>
                        <span>${moment.comments.length || ''}</span>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// 点赞功能
function handleLike(id) {
    const moment = momentsData.find(m => m.id === id);
    if (moment) {
        const hasLiked = moment.likes > 0;
        moment.likes = hasLiked ? 0 : 1;
        saveMomentsData();
        renderMoments();
    }
}

// 打开评论弹窗
function openCommentModal(id) {
    currentMomentId = id;
    const moment = momentsData.find(m => m.id === id);
    if (moment) {
        const modal = document.getElementById('commentModal');
        modal.style.display = 'block';
        renderComments(moment.comments);
    }
}

// 渲染评论
function renderComments(comments) {
    const commentsList = document.getElementById('commentsList');
    if (comments.length === 0) {
        commentsList.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">暂无评论</p>';
        return;
    }
    commentsList.innerHTML = comments.map(comment => `
        <div class="comment-item">
            <div style="margin-bottom: 0.5rem; color: var(--text-secondary); font-size: 0.85rem;">
                ${comment.time}
            </div>
            <div>${comment.content}</div>
        </div>
    `).join('');
}

// 提交评论
function handleCommentSubmit() {
    const input = document.getElementById('commentInput');
    const content = input.value.trim();
    
    if (!content) return;
    
    const moment = momentsData.find(m => m.id === currentMomentId);
    if (moment) {
        const comment = {
            content: content,
            time: new Date().toLocaleString('zh-CN')
        };
        moment.comments.push(comment);
        saveMomentsData();
        renderComments(moment.comments);
        renderMoments();
        input.value = '';
    }
}

// 搜索功能
function handleSearch(e) {
    const keyword = e.target.value.toLowerCase().trim();
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
