// health-reminder-sw.js - 健康提醒 Service Worker
const CACHE_NAME = 'health-reminder-v1';
const BACKGROUND_REMINDERS = {
    break: 30 * 60 * 1000,    // 30分钟
    eyeCare: 2 * 60 * 60 * 1000  // 2小时
};

let isActive = false;
let backgroundMode = false;
let breakTimer = null;
let eyeCareTimer = null;

// 安装 Service Worker
self.addEventListener('install', (event) => {
    console.log('Health Reminder Service Worker 安装完成');
    self.skipWaiting();
});

// 激活 Service Worker
self.addEventListener('activate', (event) => {
    console.log('Health Reminder Service Worker 激活完成');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// 监听消息
self.addEventListener('message', (event) => {
    const { type, isActive: active, isDoingEyeCare } = event.data;
    
    switch (type) {
        case 'ENABLE_BACKGROUND':
            backgroundMode = true;
            isActive = active;
            if (isActive) {
                startBackgroundReminders();
            }
            break;
            
        case 'START_REMINDERS':
            isActive = true;
            if (backgroundMode) {
                startBackgroundReminders();
            }
            break;
            
        case 'STOP_REMINDERS':
            isActive = false;
            stopBackgroundReminders();
            break;
            
        case 'SYNC_STATE':
            if (backgroundMode) {
                syncState(active, isDoingEyeCare);
            }
            break;
            
        case 'REQUEST_SYNC':
            if (backgroundMode) {
                event.ports[0].postMessage({
                    type: 'SYNC_RESPONSE',
                    state: { isActive, isDoingEyeCare: false }
                });
            }
            break;
            
        case 'SCHEDULE_BREAK':
            if (backgroundMode) {
                scheduleBreakReminder();
            }
            break;
            
        case 'SCHEDULE_EYE_CARE':
            if (backgroundMode) {
                scheduleEyeCareReminder();
            }
            break;
    }
});

// 开始后台提醒
function startBackgroundReminders() {
    stopBackgroundReminders(); // 先停止现有的计时器
    
    scheduleBreakReminder();
    scheduleEyeCareReminder();
}

// 停止后台提醒
function stopBackgroundReminders() {
    if (breakTimer) {
        clearTimeout(breakTimer);
        breakTimer = null;
    }
    if (eyeCareTimer) {
        clearTimeout(eyeCareTimer);
        eyeCareTimer = null;
    }
}

// 安排活动提醒
function scheduleBreakReminder() {
    breakTimer = setTimeout(() => {
        showBackgroundNotification('break', '活动提醒', '您已经坐了30分钟，该活动一下了！');
        
        // 发送消息给页面
        self.clients.matchAll().then(clients => {
            clients.forEach(client => {
                client.postMessage({
                    type: 'BREAK_REMINDER'
                });
            });
        });
        
        // 安排下一次提醒
        if (isActive && backgroundMode) {
            scheduleBreakReminder();
        }
    }, BACKGROUND_REMINDERS.break);
}

// 安排眼保健操提醒
function scheduleEyeCareReminder() {
    eyeCareTimer = setTimeout(() => {
        showBackgroundNotification('eye-care', '眼保健操提醒', '该做眼保健操了！保护您的视力健康。');
        
        // 发送消息给页面
        self.clients.matchAll().then(clients => {
            clients.forEach(client => {
                client.postMessage({
                    type: 'EYE_CARE_REMINDER'
                });
            });
        });
        
        // 安排下一次提醒
        if (isActive && backgroundMode) {
            scheduleEyeCareReminder();
        }
    }, BACKGROUND_REMINDERS.eyeCare);
}

// 显示后台通知
function showBackgroundNotification(type, title, body) {
    if ('Notification' in window && self.Notification.permission === 'granted') {
        const options = {
            body: body,
            icon: '/images/favicon.ico',
            badge: '/images/favicon.ico',
            tag: type,
            requireInteraction: type === 'eye-care',
            actions: [
                {
                    action: 'confirm',
                    title: '确认完成'
                },
                {
                    action: 'snooze',
                    title: '稍后提醒'
                }
            ],
            data: {
                type: type,
                url: self.location.origin
            }
        };
        
        self.registration.showNotification(title, options);
    }
}

// 处理通知点击
self.addEventListener('notificationclick', (event) => {
    const { notification, action } = event;
    const type = notification.data.type;
    
    notification.close();
    
    // 打开或聚焦到页面
    event.waitUntil(
        clients.matchAll({ type: 'window' }).then((clientList) => {
            for (const client of clientList) {
                if (client.url === notification.data.url && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(notification.data.url);
            }
        })
    );
    
    // 处理用户操作
    if (action === 'confirm') {
        console.log('用户确认完成:', type);
        if (type === 'eye-care') {
            // 重新安排眼保健操提醒
            if (isActive && backgroundMode) {
                scheduleEyeCareReminder();
            }
        }
    } else if (action === 'snooze' && type === 'break') {
        // 5分钟后再次提醒
        setTimeout(() => {
            showBackgroundNotification('break', '活动提醒', '您已经坐了30分钟，该活动一下了！');
        }, 5 * 60 * 1000);
    }
});

// 同步状态
function syncState(active, isDoingEyeCare) {
    isActive = active;
    // 这里可以添加更多状态同步逻辑
}

// 处理推送事件（如果需要）
self.addEventListener('push', (event) => {
    if (event.data) {
        const data = event.data.json();
        showBackgroundNotification(data.type, data.title, data.body);
    }
});
