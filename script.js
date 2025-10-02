// 全局变量
let currentCategory = 'all';
let currentMomentId = null;

// 朋友圈数据
let momentsData = [
    {
        id: 1,
        content: "好好好，claude也赶中国国庆发模型的节奏",
        value: 3,
        category: "科技数码",
        time: "2025-09-30 12:08",
        image: "images/d59aff54b056c66e94bc15b5cd3ad78c.png",
        likes: 0,
        comments: []
    },
    {
        id: 2,
        content: "真挤，回来时504人真多🥵，应该16点就出发的",
        value: 1,
        category: "生活日常",
        time: "2025-09-30 18:36",
        image: "",
        likes: 0,
        comments: []
    },
    {
        id: 3,
        content: "发国庆祝福时发现有一百多个单删我了。真正值得的人，会留在你的生活里；删掉你的人，也是在帮你腾出空间给更合拍的人;能坦诚交流、愿意回应的人才最值得投入精力——愿意回复与交流，意味着双方在意这段关系，信息透明，问题也更容易被及时解决；持续互动能在交流中碰撞观点、互相学习，让关系与个人都得到积极成长。",
        value: 5,
        category: "情感表达",
        time: "2025-10-01 00:16",
        image: "",
        likes: 0,
        comments: []
    },
    {
        id: 4,
        content: "疯狂动物城2电影11月来啦",
        value: 1,
        category: "艺术文化",
        time: "2025-10-01 14:12",
        image: "",
        likes: 0,
        comments: []
    },
    {
        id: 5,  // 注意：ID要递增，不能重复
        content: "电脑充电线坏了，好在通过重新拆拼花了3个多小时解决了",
        value: 3,  // 长期价值 1-5
        category: "生活日常",  // 选择合适的分类
        time: "2025-10-02 16:14",
        image: "",  // 图片链接，如果没有就留空
        likes: 0,
        comments: []
    },
    {
        id: 6,  // 注意：ID要递增，不能重复
        content: "今天去图书馆学习，一堆学生在图书馆打游戏的，不安静💢",
        value: 3,  // 长期价值 1-5
        category: "生活日常",  // 选择合适的分类
        time: "2024-10-02 19:57",
        image: "",  // 图片链接，如果没有就留空
        likes: 0,
        comments: []
    },

    
    // 🆕 在这里添加新的朋友圈内容
    // 复制下面的模板来添加：
    /*
    {
        id: 5,  // 注意：ID要递增，不能重复
        content: "你的朋友圈内容",
        value: 3,  // 长期价值 1-5
        category: "生活日常",  // 选择合适的分类
        time: "2024-10-05 12:00",
        image: "",  // 图片链接，如果没有就留空
        likes: 0,
        comments: []
    },
    */
];

// DOM 加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    loadMomentsData();
    renderMoments();
    initializeEventListeners();
});

// 从 localStorage 加载数据
function loadMomentsData() {
    const saved = localStorage.getItem('momentsData');
    if (saved) {
        try {
            const loaded = JSON.parse(saved);
            // 合并保存的数据和默认数据，避免数据丢失
            const savedIds = loaded.map(m => m.id);
            const newDefaults = momentsData.filter(m => !savedIds.includes(m.id));
            momentsData = [...loaded, ...newDefaults];
        } catch (e) {
            console.error('加载数据失败:', e);
        }
    }
}

// 将数据保存到 localStorage
function saveMomentsData() {
    try {
        localStorage.setItem('momentsData', JSON.stringify(momentsData));
    } catch (e) {
        console.error('保存数据失败:', e);
    }
}

// 初始化事件监听器
function initializeEventListeners() {
    // 主题切换
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // 搜索功能
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
    
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
    if (modal) {
        const closeBtn = modal.querySelector('.close');
        if (closeBtn) {
            closeBtn.onclick = () => modal.style.display = 'none';
        }
        
        window.onclick = (e) => {
            if (e.target == modal) modal.style.display = 'none';
        };
    }
    
    // 提交评论
    const submitComment = document.getElementById('submitComment');
    if (submitComment) {
        submitComment.addEventListener('click', handleCommentSubmit);
    }
    
    // 回车提交评论
    const commentInput = document.getElementById('commentInput');
    if (commentInput) {
        commentInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') handleCommentSubmit();
        });
    }
}

// 主题切换
function toggleTheme() {
    document.body.classList.toggle('light-mode');
    const icon = document.querySelector('#themeToggle i');
    if (icon) {
        if (document.body.classList.contains('light-mode')) {
            icon.className = 'fas fa-sun';
            localStorage.setItem('theme', 'light');
        } else {
            icon.className = 'fas fa-moon';
            localStorage.setItem('theme', 'dark');
        }
    }
}

// 加载保存的主题
function loadSavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        const icon = document.querySelector('#themeToggle i');
        if (icon) {
            icon.className = 'fas fa-sun';
        }
    }
}

// 页面加载时应用主题
loadSavedTheme();

// 渲染朋友圈
function renderMoments(filteredData = null) {
    const container = document.getElementById('momentsContainer');
    if (!container) return;
    
    const dataToRender = filteredData || momentsData;
    
    // 根据分类过滤
    const filtered = currentCategory === 'all'
        ? dataToRender
        : dataToRender.filter(m => m.category === currentCategory);
    
    // 按时间倒序排序
    filtered.sort((a, b) => new Date(b.time) - new Date(a.time));
    
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
            <div class="moment-content">${escapeHtml(moment.content)}</div>
            ${moment.image ? `<img src="${moment.image}" alt="图片" class="moment-image" onerror="this.style.display='none'">` : ''}
            <div class="moment-footer">
                <span class="moment-time">
                    <i class="far fa-clock"></i> ${formatTime(moment.time)}
                </span>
                <div class="moment-actions">
                    <button class="action-btn ${moment.likes > 0 ? 'liked' : ''}" onclick="handleLike(${moment.id})">
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

// HTML转义函数，防止XSS攻击
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 格式化时间显示
function formatTime(timeStr) {
    const date = new Date(timeStr);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        if (hours === 0) {
            const minutes = Math.floor(diff / (1000 * 60));
            return minutes <= 1 ? '刚刚' : `${minutes}分钟前`;
        }
        return `${hours}小时前`;
    } else if (days === 1) {
        return '昨天';
    } else if (days < 7) {
        return `${days}天前`;
    } else {
        return timeStr;
    }
}

// 点赞功能
function handleLike(id) {
    const moment = momentsData.find(m => m.id === id);
    if (moment) {
        const hasLiked = moment.likes > 0;
        moment.likes = hasLiked ? 0 : 1;
        saveMomentsData();
        renderMoments();
        
        // 添加动画效果
        const btn = document.querySelector(`.action-btn[onclick="handleLike(${id})"]`);
        if (btn && !hasLiked) {
            btn.style.transform = 'scale(1.2)';
            setTimeout(() => {
                btn.style.transform = 'scale(1)';
            }, 200);
        }
    }
}

// 打开评论弹窗
function openCommentModal(id) {
    currentMomentId = id;
    const moment = momentsData.find(m => m.id === id);
    if (moment) {
        const modal = document.getElementById('commentModal');
        if (modal) {
            modal.style.display = 'block';
            
            // 确保评论数组存在
            if (!moment.comments) {
                moment.comments = [];
            }
            
            renderComments(moment.comments);
            
            // 聚焦到输入框
            setTimeout(() => {
                const input = document.getElementById('commentInput');
                if (input) input.focus();
            }, 100);
        }
    }
}

// 渲染评论
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
                <i class="far fa-user-circle"></i> 访客 • ${comment.time}
            </div>
            <div style="line-height: 1.6;">${escapeHtml(comment.content)}</div>
        </div>
    `).join('');
}

// 提交评论
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
    if (moment) {
        // 确保评论数组存在
        if (!moment.comments) {
            moment.comments = [];
        }
        
        const comment = {
            content: content,
            time: new Date().toLocaleString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            })
        };
        
        moment.comments.unshift(comment); // 新评论显示在前面
        saveMomentsData();
        renderComments(moment.comments);
        renderMoments();
        input.value = '';
        
        showNotification('评论发表成功！', 'success');
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

// 显示通知
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
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
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// 添加动画样式
if (!document.getElementById('custom-animations')) {
    const style = document.createElement('style');
    style.id = 'custom-animations';
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
        
        .comment-item {
            animation: slideIn 0.3s ease-out;
        }
        
        @keyframes slideIn {
            from {
                transform: translateX(-20px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
}

// 导出数据（可选功能）
function exportData() {
    const dataStr = JSON.stringify(momentsData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `moments_backup_${new Date().getTime()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showNotification('数据导出成功！', 'success');
}

// 导入数据（可选功能）
function importData(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const imported = JSON.parse(e.target.result);
            if (Array.isArray(imported)) {
                momentsData = imported;
                saveMomentsData();
                renderMoments();
                showNotification('数据导入成功！', 'success');
            } else {
                showNotification('数据格式错误', 'warning');
            }
        } catch (error) {
            showNotification('数据解析失败', 'warning');
        }
    };
    reader.readAsText(file);
}

// 全局暴露必要的函数
window.handleLike = handleLike;
window.openCommentModal = openCommentModal;
window.exportData = exportData;
window.importData = importData;

console.log('✨ 朋友圈系统加载成功！');
console.log('📝 当前有', momentsData.length, '条朋友圈');
console.log('💡 提示：你可以在代码中的 momentsData 数组添加新内容');
