// 考试页面登录验证功能
(function() {
    // 设置正确的密码（可以修改为你想要的密码）
    const CORRECT_PASSWORD = 'exam2025';
    
    // 会话存储键名
    const SESSION_KEY = 'examPageAuthenticated';
    
    // 获取DOM元素
    const loginOverlay = document.getElementById('loginOverlay');
    const loginForm = document.getElementById('loginForm');
    const passwordInput = document.getElementById('passwordInput');
    const errorMessage = document.getElementById('errorMessage');
    
    // 检查是否已经登录
    function checkAuthentication() {
        const isAuthenticated = sessionStorage.getItem(SESSION_KEY);
        if (isAuthenticated === 'true') {
            hideLoginOverlay();
        } else {
            showLoginOverlay();
        }
    }
    
    // 显示登录界面
    function showLoginOverlay() {
        loginOverlay.classList.remove('hidden');
        passwordInput.focus();
    }
    
    // 隐藏登录界面
    function hideLoginOverlay() {
        loginOverlay.classList.add('hidden');
    }
    
    // 验证密码
    function validatePassword(password) {
        return password === CORRECT_PASSWORD;
    }
    
    // 显示错误信息
    function showError() {
        errorMessage.classList.add('show');
        passwordInput.classList.add('error');
        passwordInput.value = '';
        
        // 3秒后自动隐藏错误信息
        setTimeout(() => {
            errorMessage.classList.remove('show');
            passwordInput.classList.remove('error');
        }, 3000);
    }
    
    // 处理表单提交
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const password = passwordInput.value.trim();
        
        if (validatePassword(password)) {
            // 密码正确，保存登录状态
            sessionStorage.setItem(SESSION_KEY, 'true');
            
            // 添加成功动画效果
            loginOverlay.style.animation = 'fadeOut 0.5s ease';
            setTimeout(() => {
                hideLoginOverlay();
            }, 500);
        } else {
            // 密码错误，显示错误信息
            showError();
        }
    });
    
    // 支持Enter键提交
    passwordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            loginForm.dispatchEvent(new Event('submit'));
        }
    });
    
    // 添加淡出动画
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeOut {
            from {
                opacity: 1;
            }
            to {
                opacity: 0;
            }
        }
        
        .form-group input.error {
            border-color: #e74c3c !important;
            animation: shake 0.5s ease;
        }
    `;
    document.head.appendChild(style);
    
    // 页面加载时检查认证状态
    checkAuthentication();
    
    // 离开页面时可选择清除登录状态（如果需要每次访问都要输入密码）
    // window.addEventListener('beforeunload', function() {
    //     sessionStorage.removeItem(SESSION_KEY);
    // });
})();
