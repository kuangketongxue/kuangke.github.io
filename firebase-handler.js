// firebase-handler.js - Firebase 数据处理层

class FirebaseHandler {
    constructor() {
        this.database = firebase.database();
        this.likesRef = this.database.ref('likes');
        this.commentsRef = this.database.ref('comments');
        console.log('FirebaseHandler 初始化完成');
    }

    // ============ 点赞相关方法 ============

    /**
     * 获取指定动态的点赞数
     * @param {string} momentId - 动态ID
     * @returns {Promise<number>} 点赞数量
     */
    async getLikes(momentId) {
        try {
            const snapshot = await this.likesRef.child(momentId).once('value');
            const likes = snapshot.val();
            return likes !== null ? likes : 0;
        } catch (error) {
            console.error(`获取点赞数失败 [${momentId}]:`, error);
            return 0;
        }
    }

    /**
     * 增加点赞
     * @param {string} momentId - 动态ID
     * @returns {Promise<number|null>} 新的点赞数或null（失败）
     */
    async addLike(momentId) {
        try {
            const currentLikes = await this.getLikes(momentId);
            const newLikes = currentLikes + 1;
            await this.likesRef.child(momentId).set(newLikes);
            console.log(`点赞成功 [${momentId}]: ${currentLikes} → ${newLikes}`);
            return newLikes;
        } catch (error) {
            console.error(`点赞失败 [${momentId}]:`, error);
            return null;
        }
    }

    /**
     * 取消点赞
     * @param {string} momentId - 动态ID
     * @returns {Promise<number|null>} 新的点赞数或null（失败）
     */
    async removeLike(momentId) {
        try {
            const currentLikes = await this.getLikes(momentId);
            const newLikes = Math.max(0, currentLikes - 1);
            await this.likesRef.child(momentId).set(newLikes);
            console.log(`取消点赞成功 [${momentId}]: ${currentLikes} → ${newLikes}`);
            return newLikes;
        } catch (error) {
            console.error(`取消点赞失败 [${momentId}]:`, error);
            return null;
        }
    }

    /**
     * 监听点赞数变化
     * @param {string} momentId - 动态ID
     * @param {Function} callback - 回调函数(newLikes)
     */
    onLikesChange(momentId, callback) {
        this.likesRef.child(momentId).on('value', (snapshot) => {
            const likes = snapshot.val() !== null ? snapshot.val() : 0;
            callback(likes);
        });
    }

    // ============ 评论相关方法 ============

    /**
     * 获取指定动态的所有评论
     * @param {string} momentId - 动态ID
     * @returns {Promise<Array>} 评论数组
     */
    async getComments(momentId) {
        try {
            const snapshot = await this.commentsRef.child(momentId).once('value');
            const commentsData = snapshot.val();
            
            if (!commentsData) {
                return [];
            }

            // 转换为数组并按时间排序（最新在前）
            const commentsArray = Object.values(commentsData);
            commentsArray.sort((a, b) => b.timestamp - a.timestamp);
            
            return commentsArray;
        } catch (error) {
            console.error(`获取评论失败 [${momentId}]:`, error);
            return [];
        }
    }

    /**
     * 添加评论
     * @param {string} momentId - 动态ID
     * @param {string} commentText - 评论内容
     * @param {string} author - 评论者（可选）
     * @returns {Promise<Object|null>} 新评论对象或null（失败）
     */
    async addComment(momentId, commentText, author = '访客') {
        try {
            const newCommentRef = this.commentsRef.child(momentId).push();
            const comment = {
                id: newCommentRef.key,
                text: commentText,
                timestamp: Date.now(),
                author: author
            };
            
            await newCommentRef.set(comment);
            console.log(`评论添加成功 [${momentId}]:`, comment);
            return comment;
        } catch (error) {
            console.error(`添加评论失败 [${momentId}]:`, error);
            return null;
        }
    }

    /**
     * 监听评论变化
     * @param {string} momentId - 动态ID
     * @param {Function} callback - 回调函数(commentsArray)
     */
    onCommentsChange(momentId, callback) {
        this.commentsRef.child(momentId).on('value', (snapshot) => {
            const commentsData = snapshot.val();
            
            if (!commentsData) {
                callback([]);
                return;
            }

            const commentsArray = Object.values(commentsData);
            commentsArray.sort((a, b) => b.timestamp - a.timestamp);
            callback(commentsArray);
        });
    }

    /**
     * 停止监听
     * @param {string} momentId - 动态ID（可选，不传则停止所有监听）
     */
    stopListening(momentId = null) {
        if (momentId) {
            this.likesRef.child(momentId).off();
            this.commentsRef.child(momentId).off();
        } else {
            this.likesRef.off();
            this.commentsRef.off();
        }
    }
}

// 创建全局实例
const firebaseHandler = new FirebaseHandler();
