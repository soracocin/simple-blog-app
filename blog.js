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
            alert('Vui lòng điền đầy đủ thông tin!');
            return;
        }

        if (this.currentEditId !== null) {
            this.updatePost(this.currentEditId, title, content);
        } else {
            this.addPost(title, content);
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
        }
    }

    editPost(id) {
        const post = this.posts.find(post => post.id === id);
        if (post) {
            document.getElementById('postTitle').value = post.title;
            document.getElementById('postContent').value = post.content;
            document.getElementById('form-title').textContent = 'Sửa Bài Viết';
            document.getElementById('submitBtn').textContent = 'Cập Nhật';
            document.getElementById('cancelBtn').style.display = 'inline-block';
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
        document.getElementById('submitBtn').textContent = 'Thêm Bài Viết';
        document.getElementById('cancelBtn').style.display = 'none';
    }

    renderPosts() {
        const container = document.getElementById('posts-container');
        
        if (this.posts.length === 0) {
            container.innerHTML = '<div class="post"><p>Chưa có bài viết nào. Hãy thêm bài viết đầu tiên của bạn!</p></div>';
            return;
        }

        container.innerHTML = this.posts.map(post => `
            <div class="post">
                <h3 class="post-title">${this.escapeHtml(post.title)}</h3>
                <div class="post-date">📅 ${post.date}</div>
                <div class="post-content">${this.escapeHtml(post.content).replace(/\n/g, '<br>')}</div>
                <div class="post-actions">
                    <button class="edit-btn" onclick="blogManager.editPost(${post.id})">
                        ✏️ Sửa
                    </button>
                    <button class="delete-btn" onclick="blogManager.deletePost(${post.id})">
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
            const dataStr = this.posts.map(post => 
                `ID: ${post.id}\n` +
                `Tiêu đề: ${post.title}\n` +
                `Ngày: ${post.date}\n` +
                `Nội dung: ${post.content}\n` +
                '=' + '='.repeat(50) + '\n'
            ).join('\n');
            
            // Lưu vào localStorage (mô phỏng lưu file)
            localStorage.setItem('blogPosts', JSON.stringify(this.posts));
            
            // Tạo file txt và tải xuống
            this.downloadPostsAsFile(dataStr);
            
        } catch (error) {
            console.error('Lỗi khi lưu bài viết:', error);
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

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = e.target.result;
                this.parsePostsFromFile(content);
                this.renderPosts();
            } catch (error) {
                alert('Lỗi khi đọc file: ' + error.message);
            }
        };
        reader.readAsText(file, 'UTF-8');
    }

    parsePostsFromFile(content) {
        // Đây là logic đơn giản để parse file txt
        // Bạn có thể cải tiến thêm
        const posts = [];
        const sections = content.split('=' + '='.repeat(50));
        
        sections.forEach(section => {
            const lines = section.trim().split('\n');
            if (lines.length >= 4) {
                const id = lines[0].replace('ID: ', '');
                const title = lines[1].replace('Tiêu đề: ', '');
                const date = lines[2].replace('Ngày: ', '');
                const content = lines[3].replace('Nội dung: ', '');
                
                if (id && title && content) {
                    posts.push({ id: parseInt(id), title, date, content });
                }
            }
        });
        
        this.posts = posts;
        localStorage.setItem('blogPosts', JSON.stringify(this.posts));
    }

    // Xuất tất cả bài viết
    exportAllPosts() {
        if (this.posts.length === 0) {
            alert('Không có bài viết nào để xuất!');
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
    }
}

// Khởi tạo blog manager
const blogManager = new BlogManager();

// Thêm event listener cho việc tải file
document.addEventListener('DOMContentLoaded', () => {
    // Tạo nút import/export (tùy chọn)
    const header = document.querySelector('.header');
    const importExportDiv = document.createElement('div');
    importExportDiv.innerHTML = `
        <div style="margin-top: 15px;">
            <input type="file" id="fileInput" accept=".txt" style="display: none;" onchange="blogManager.loadFromFile(event)">
            <button onclick="document.getElementById('fileInput').click()" style="background-color: #17a2b8;">
                📁 Nhập Tập Tin
            </button>
            <button onclick="blogManager.exportAllPosts()" style="background-color: #6f42c1;">
                📋 Xuất Tập Tin
            </button>
        </div>
    `;
    header.appendChild(importExportDiv);
});