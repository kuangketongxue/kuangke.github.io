/**
 * 分页管理器
 */
class PaginationManager {
    constructor(options = {}) {
        // 配置参数
        this.itemsPerPage = options.itemsPerPage || 12;
        this.currentPage = 1;
        this.totalItems = 0;
        this.totalPages = 0;
        this.maxVisiblePages = options.maxVisiblePages || 5;
        
        // DOM元素
        this.container = document.getElementById('momentsContainer');
        this.firstPageBtn = document.getElementById('firstPage');
        this.prevPageBtn = document.getElementById('prevPage');
        this.nextPageBtn = document.getElementById('nextPage');
        this.lastPageBtn = document.getElementById('lastPage');
        this.pageNumbersContainer = document.getElementById('pageNumbers');
        this.itemsPerPageSelect = document.getElementById('itemsPerPage');
        this.showingStart = document.getElementById('showingStart');
        this.showingEnd = document.getElementById('showingEnd');
        this.totalItemsSpan = document.getElementById('totalItems');
        this.announcer = document.getElementById('announcer');
        
        // 数据存储
        this.allItems = [];
        this.filteredItems = [];
        
        // 初始化
        this.init();
    }
    
    /**
     * 初始化分页器
     */
    init() {
        this.bindEvents();
    }
    
    /**
     * 绑定事件
     */
    bindEvents() {
        // 按钮事件
        this.firstPageBtn?.addEventListener('click', () => this.goToPage(1));
        this.prevPageBtn?.addEventListener('click', () => this.goToPage(this.currentPage - 1));
        this.nextPageBtn?.addEventListener('click', () => this.goToPage(this.currentPage + 1));
        this.lastPageBtn?.addEventListener('click', () => this.goToPage(this.totalPages));
        
        // 每页显示数量变化
        this.itemsPerPageSelect?.addEventListener('change', (e) => {
            this.itemsPerPage = parseInt(e.target.value);
            this.currentPage = 1;
            this.render();
        });
    }
    
    /**
     * 设置数据
     */
    setData(allItems, filteredItems = null) {
        this.allItems = allItems;
        this.filteredItems = filteredItems || allItems;
        this.totalItems = this.filteredItems.length;
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
        
        // 如果当前页超出范围，重置到第一页
        if (this.currentPage > this.totalPages) {
            this.currentPage = 1;
        }
        
        this.render();
    }
    
    /**
     * 跳转到指定页
     */
    goToPage(page) {
        if (page < 1 || page > this.totalPages) return;
        
        this.currentPage = page;
        this.render();
        
        // 滚动到顶部
        this.scrollToTop();
        
        // 无障碍通知
        this.announce(`已跳转到第 ${page} 页`);
    }
    
    /**
     * 渲染分页
     */
    render() {
        // 渲染内容
        this.renderItems();
        
        // 渲染分页控件
        this.renderControls();
        
        // 更新信息显示
        this.updateInfo();
    }
    
    /**
     * 渲染当前页的内容
     */
    renderItems() {
        if (!this.container) return;
        
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = Math.min(startIndex + this.itemsPerPage, this.totalItems);
        const pageItems = this.filteredItems.slice(startIndex, endIndex);
        
        // 触发自定义事件，让主脚本处理渲染
        const event = new CustomEvent('paginationRender', {
            detail: {
                items: pageItems,
                page: this.currentPage,
                totalPages: this.totalPages
            }
        });
        document.dispatchEvent(event);
    }
    
    /**
     * 渲染分页控件
     */
    renderControls() {
        // 更新按钮状态
        this.updateButtonStates();
        
        // 渲染页码
        this.renderPageNumbers();
    }
    
    /**
     * 更新按钮状态
     */
    updateButtonStates() {
        const isFirstPage = this.currentPage === 1;
        const isLastPage = this.currentPage === this.totalPages;
        
        if (this.firstPageBtn) this.firstPageBtn.disabled = isFirstPage;
        if (this.prevPageBtn) this.prevPageBtn.disabled = isFirstPage;
        if (this.nextPageBtn) this.nextPageBtn.disabled = isLastPage;
        if (this.lastPageBtn) this.lastPageBtn.disabled = isLastPage;
    }
    
    /**
     * 渲染页码
     */
    renderPageNumbers() {
        if (!this.pageNumbersContainer) return;
        
        this.pageNumbersContainer.innerHTML = '';
        
        const pages = this.getPageNumbers();
        
        pages.forEach(page => {
            if (page === '...') {
                const ellipsis = document.createElement('span');
                ellipsis.className = 'page-ellipsis';
                ellipsis.textContent = '...';
                ellipsis.setAttribute('aria-hidden', 'true');
                this.pageNumbersContainer.appendChild(ellipsis);
            } else {
                const button = document.createElement('button');
                button.className = 'page-number';
                button.textContent = page;
                button.setAttribute('aria-label', `第 ${page} 页`);
                
                if (page === this.currentPage) {
                    button.classList.add('active');
                    button.setAttribute('aria-current', 'page');
                }
                
                button.addEventListener('click', () => this.goToPage(page));
                this.pageNumbersContainer.appendChild(button);
            }
        });
    }
    
    /**
     * 获取要显示的页码数组
     */
    getPageNumbers() {
        const pages = [];
        const half = Math.floor(this.maxVisiblePages / 2);
        
        if (this.totalPages <= this.maxVisiblePages) {
            // 总页数少，显示全部
            for (let i = 1; i <= this.totalPages; i++) {
                pages.push(i);
            }
        } else {
            // 总页数多，显示部分
            let start = Math.max(1, this.currentPage - half);
            let end = Math.min(this.totalPages, start + this.maxVisiblePages - 1);
            
            // 调整起始位置
            if (end - start < this.maxVisiblePages - 1) {
                start = Math.max(1, end - this.maxVisiblePages + 1);
            }
            
            // 添加第一页
            if (start > 1) {
                pages.push(1);
                if (start > 2) pages.push('...');
            }
            
            // 添加中间页码
            for (let i = start; i <= end; i++) {
                pages.push(i);
            }
            
            // 添加最后一页
            if (end < this.totalPages) {
                if (end < this.totalPages - 1) pages.push('...');
                pages.push(this.totalPages);
            }
        }
        
        return pages;
    }
    
    /**
     * 更新信息显示
     */
    updateInfo() {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage + 1;
        const endIndex = Math.min(this.currentPage * this.itemsPerPage, this.totalItems);
        
        if (this.showingStart) this.showingStart.textContent = this.totalItems > 0 ? startIndex : 0;
        if (this.showingEnd) this.showingEnd.textContent = endIndex;
        if (this.totalItemsSpan) this.totalItemsSpan.textContent = this.totalItems;
    }
    
    /**
     * 滚动到顶部
     */
    scrollToTop() {
        const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
        const categoryHeight = document.querySelector('.category-nav')?.offsetHeight || 0;
        const offset = headerHeight + categoryHeight + 20;
        
        window.scrollTo({
            top: offset,
            behavior: 'smooth'
        });
    }
    
    /**
     * 无障碍通知
     */
    announce(message) {
        if (this.announcer) {
            this.announcer.textContent = message;
            setTimeout(() => {
                this.announcer.textContent = '';
            }, 1000);
        }
    }
    
    /**
     * 重置到第一页
     */
    reset() {
        this.currentPage = 1;
    }
}

// 导出分页管理器
window.PaginationManager = PaginationManager;
