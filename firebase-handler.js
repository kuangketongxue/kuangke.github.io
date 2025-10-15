// firebase-handler.js

class FirebaseHandler {
    constructor() {
        this.database = firebase.database();
        this.likesRef = this.database.ref('likes');
        this.commentsRef = this.database.ref('comments');
    }

    // 获取某条动态的点赞数
    async getLikes(momentId) {
        try {
            const snapshot = await this.likesRef.child(momentId).once('value');
            return snapshot.val() || 0;
        } catch (error) {
            console.error('获取点赞数失败:', error);
            return 0;
        }
    }

    // 增加点赞
    async addLike(momentId) {
        try {
            const currentLikes = await this.getLikes(momentId);
            await this.likesRef.child(momentId).set(currentLikes + 1);
            return currentLikes + 1;
        } catch (error) {
            console.error('点赞失败:', error);
            throw error;
        }
    }

    // 监听点赞数变化
    onLikesChange(momentId, callback) {
        this.likesRef.child(momentId).on('value', (snapshot) => {
            callback(snapshot.val() || 0);
        });
    }

    // 获取某条动态的所有评论
    async getComments(momentId) {
        try {
            const snapshot = await this.commentsRef.child(momentId).once('value');
            const comments = [];
            snapshot.forEach((childSnapshot) => {
                comments.push({
                    id: childSnapshot.key,
                    ...childSnapshot.val()
                });
            });
            // 按时间排序
            return comments.sort((a, b) => a.timestamp - b.timestamp);
        } catch (error) {
            console.error('获取评论失败:', error);
            return [];
        }
    }

    // 添加评论
    async addComment(momentId, commentText, username = '匿名用户') {
        try {
            const newCommentRef = this.commentsRef.child(momentId).push();
            const comment = {
                text: commentText,
                username: username,
                timestamp: Date.now(),
                avatar: this.generateAvatar(username)
            };
            await newCommentRef.set(comment);
            return { id: newCommentRef.key, ...comment };
        } catch (error) {
            console.error('发表评论失败:', error);
            throw error;
        }
    }

    // 监听评论变化
    onCommentsChange(momentId, callback) {
        this.commentsRef.child(momentId).on('value', async (snapshot) => {
            const comments = [];
            snapshot.forEach((childSnapshot) => {
                comments.push({
                    id: childSnapshot.key,
                    ...childSnapshot.val()
                });
            });
            callback(comments.sort((a, b) => a.timestamp - b.timestamp));
        });
    }

    // 获取评论数量
    async getCommentsCount(momentId) {
        try {
            const snapshot = await this.commentsRef.child(momentId).once('value');
            return snapshot.numChildren();
        } catch (error) {
            console.error('获取评论数量失败:', error);
            return 0;
        }
    }

    // 生成头像（基于用户名）
    generateAvatar(username) {
        const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'];
        const index = username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return colors[index % colors.length];
    }

    // 停止监听
    offLikesChange(momentId) {
        this.likesRef.child(momentId).off();
    }

    offCommentsChange(momentId) {
        this.commentsRef.child(momentId).off();
    }
}

// 创建全局实例
const firebaseHandler = new FirebaseHandler();
