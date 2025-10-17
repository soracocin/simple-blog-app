// Blog Manager - Quản lý bài viết với lưu trữ file txt
class BlogManager {
    constructor() {
        this.posts = [];
        this.currentEditId = null;
        this.init();
    }

    init() {
        this.loadPosts();
        this.bindEvents();
        this.renderPosts();
    }

    bindEvents() {
        const form = document.getElementById('postForm');
        const cancelBtn = document.getElementById('cancelBtn');
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit();
        });

        cancelBtn.addEventListener('click', () => {
            this.cancelEdit();
        });
    }

    handleFormSubmit() {
        const title = document.getElementById('postTitle').value.trim();
        const content = document.getElementById('postContent').value.trim();

        if (!title || !content) {
            this.showNotification('Vui lòng điền đầy đủ thông tin!', 'warning');
            return;
        }

        if (this.currentEditId !== null) {
            this.updatePost(this.currentEditId, title, content);
            this.showNotification('Cập nhật bài viết thành công!', 'success');
        } else {
            this.addPost(title, content);
            this.showNotification('Thêm bài viết thành công!', 'success');
        }

        this.clearForm();
        this.renderPosts();
        this.savePosts();
    }

    addPost(title, content) {
        const post = {
            id: Date.now(),
            title: title,
            content: content,
            date: new Date().toLocaleString('vi-VN')
        };
        
        this.posts.unshift(post); // Thêm vào đầu mảng
    }

    updatePost(id, title, content) {
        const postIndex = this.posts.findIndex(post => post.id === id);
        if (postIndex !== -1) {
            this.posts[postIndex].title = title;
            this.posts[postIndex].content = content;
            this.posts[postIndex].date = new Date().toLocaleString('vi-VN') + ' (Cập nhật)';
        }
        this.currentEditId = null;
    }

    deletePost(id) {
        if (confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
            this.posts = this.posts.filter(post => post.id !== id);
            this.renderPosts();
            this.savePosts();
            this.showNotification('Xóa bài viết thành công!', 'success');
        }
    }

    editPost(id) {
        const post = this.posts.find(post => post.id === id);
        if (post) {
            document.getElementById('postTitle').value = post.title;
            document.getElementById('postContent').value = post.content;
            document.getElementById('form-title').textContent = 'Sửa Bài Viết';
            document.getElementById('submitBtn').innerHTML = '✏️ Cập Nhật';
            document.getElementById('cancelBtn').classList.remove('hidden');
            this.currentEditId = id;
            
            // Cuộn lên form
            document.querySelector('.post-form').scrollIntoView({ behavior: 'smooth' });
        }
    }

    cancelEdit() {
        this.currentEditId = null;
        this.clearForm();
    }

    clearForm() {
        document.getElementById('postTitle').value = '';
        document.getElementById('postContent').value = '';
        document.getElementById('form-title').textContent = 'Thêm Bài Viết Mới';
        document.getElementById('submitBtn').innerHTML = '✨ Thêm Bài Viết';
        document.getElementById('cancelBtn').classList.add('hidden');
    }

    renderPosts() {
        const container = document.getElementById('posts-container');
        
        if (this.posts.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="icon">📝</div>
                    <h3>Chưa có bài viết nào</h3>
                    <p>Hãy thêm bài viết đầu tiên của bạn!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.posts.map((post, index) => `
            <div class="post fade-in" style="animation-delay: ${index * 0.1}s">
                <div class="post-header">
                    <h3 class="post-title">${this.escapeHtml(post.title)}</h3>
                    <div class="post-date">
                        📅 ${post.date}
                    </div>
                </div>
                <div class="post-content">${this.escapeHtml(post.content).replace(/\n/g, '<br>')}</div>
                <div class="post-actions">
                    <button class="btn btn-success" onclick="blogManager.editPost(${post.id})">
                        ✏️ Sửa
                    </button>
                    <button class="btn btn-danger" onclick="blogManager.deletePost(${post.id})">
                        🗑️ Xóa
                    </button>
                </div>
            </div>
        `).join('');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    savePosts() {
        try {
            // Lưu vào localStorage
            localStorage.setItem('blogPosts', JSON.stringify(this.posts));
            
        } catch (error) {
            console.error('Lỗi khi lưu bài viết:', error);
            this.showNotification('Lỗi khi lưu dữ liệu!', 'error');
        }
    }

    loadPosts() {
        try {
            const saved = localStorage.getItem('blogPosts');
            if (saved) {
                this.posts = JSON.parse(saved);
            }
        } catch (error) {
            console.error('Lỗi khi tải bài viết:', error);
            this.posts = [];
        }
    }

    downloadPostsAsFile(content) {
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `blog-posts-${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }

    // Phương thức để tải lên file txt
    loadFromFile(event) {
        const file = event.target.files[0];
        if (!file) return;

        if (!file.name.endsWith('.txt')) {
            this.showNotification('Vui lòng chọn file .txt!', 'warning');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = e.target.result;
                this.parsePostsFromFile(content);
                this.renderPosts();
                this.showNotification('Nhập dữ liệu thành công!', 'success');
            } catch (error) {
                this.showNotification('Lỗi khi đọc file: ' + error.message, 'error');
            }
        };
        reader.readAsText(file, 'UTF-8');
        
        // Reset file input
        event.target.value = '';
    }

    parsePostsFromFile(content) {
        const posts = [];
        const sections = content.split('=' + '='.repeat(50));
        
        sections.forEach(section => {
            const lines = section.trim().split('\n');
            if (lines.length >= 4) {
                const id = lines[0].replace('ID: ', '').trim();
                const title = lines[1].replace('Tiêu đề: ', '').trim();
                const date = lines[2].replace('Ngày: ', '').trim();
                const content = lines.slice(3).join('\n').replace('Nội dung: ', '').trim();
                
                if (id && title && content) {
                    posts.push({ 
                        id: parseInt(id) || Date.now() + Math.random(), 
                        title, 
                        date, 
                        content 
                    });
                }
            }
        });
        
        this.posts = posts;
        localStorage.setItem('blogPosts', JSON.stringify(this.posts));
    }

    // Xuất tất cả bài viết
    exportAllPosts() {
        if (this.posts.length === 0) {
            this.showNotification('Không có bài viết nào để xuất!', 'warning');
            return;
        }
        
        const dataStr = this.posts.map(post => 
            `ID: ${post.id}\n` +
            `Tiêu đề: ${post.title}\n` +
            `Ngày: ${post.date}\n` +
            `Nội dung: ${post.content}\n` +
            '=' + '='.repeat(50) + '\n'
        ).join('\n');
        
        this.downloadPostsAsFile(dataStr);
        this.showNotification('Xuất file thành công!', 'success');
    }

    // Hiển thị thông báo
    showNotification(message, type = 'info') {
        // Tạo hoặc tìm container thông báo
        let notificationContainer = document.querySelector('.notification-container');
        if (!notificationContainer) {
            notificationContainer = document.createElement('div');
            notificationContainer.className = 'notification-container';
            notificationContainer.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 1000;
                pointer-events: none;
            `;
            document.body.appendChild(notificationContainer);
        }

        // Tạo thông báo
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            background: ${this.getNotificationColor(type)};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            margin-bottom: 10px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            transform: translateX(350px);
            transition: all 0.3s ease;
            pointer-events: auto;
            cursor: pointer;
        `;
        notification.textContent = message;

        notificationContainer.appendChild(notification);

        // Hiệu ứng slide in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);

        // Tự động ẩn sau 3 giây
        setTimeout(() => {
            this.hideNotification(notification);
        }, 3000);

        // Click để ẩn
        notification.addEventListener('click', () => {
            this.hideNotification(notification);
        });
    }

    hideNotification(notification) {
        notification.style.transform = 'translateX(350px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    getNotificationColor(type) {
        const colors = {
            success: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
            error: 'linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)',
            warning: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            info: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
        };
        return colors[type] || colors.info;
    }
}

// Khởi tạo blog manager khi trang đã tải
let blogManager;

document.addEventListener('DOMContentLoaded', () => {
    blogManager = new BlogManager();
});