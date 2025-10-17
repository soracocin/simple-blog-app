# Blog Đơn Giản - Simple Blog App

📝 Một ứng dụng blog đơn giản với khả năng thêm, xóa, sửa bài viết và lưu trữ dữ liệu trong file txt.

## 🎆 Tính Năng

- ✨ **Thêm bài viết mới**: Tạo bài viết với tiêu đề và nội dung
- ✏️ **Sửa bài viết**: Chỉnh sửa bài viết đã có
- 🗑️ **Xóa bài viết**: Gỡ bỏ bài viết không cần thiết
- 💾 **Lưu trữ tự động**: Dữ liệu được lưu trong localStorage và file txt
- 📋 **Xuất/Nhập file**: Sao lưu và khôi phục dữ liệu từ file txt
- 📱 **Responsive**: Hiển thị tốt trên mọi thiết bị

## 🚀 Cách Sử Dụng

### 1. Mở ứng dụng
- Tải hoặc clone repository này
- Mở file `index.html` trong trình duyệt

### 2. Quản lý bài viết
- **Thêm**: Điền tiêu đề và nội dung, nhấn "Thêm Bài Viết"
- **Sửa**: Nhấn nút "Sửa" trên bài viết muốn chỉnh sửa
- **Xóa**: Nhấn nút "Xóa" và xác nhận

### 3. Sao lưu dữ liệu
- **Xuất**: Nhấn "Xuất Tập Tin" để tải file txt
- **Nhập**: Nhấn "Nhập Tập Tin" để tải lên file đã sao lưu

## 📁 Cấu Trúc File

```
simple-blog-app/
│
├── index.html      # Giao diện chính
├── blog.js         # Logic xử lý
└── README.md       # Hướng dẫn
```

## 🛠️ Công Nghệ Sử Dụng

- **HTML5**: Cấu trúc trang web
- **CSS3**: Thiết kế và bố cục responsive
- **JavaScript (ES6+)**: Logic xử lý CRUD
- **LocalStorage**: Lưu trữ dữ liệu trên trình duyệt
- **File API**: Xử lý xuất/nhập file txt

## 📝 Định Dạng File Txt

Dữ liệu được lưu theo định dạng:

```
ID: 1698408123456
Tiêu đề: Tiêu đề bài viết
Ngày: 17/10/2025, 16:05:23
Nội dung: Nội dung bài viết...
==================================================

ID: 1698408456789
Tiêu đề: Bài viết thứ hai
...
```

## 🔧 Tính Năng Nâng Cao

### Lưu trữ
- Dữ liệu được lưu tự động vào localStorage
- Tự động tạo file backup khi có thay đổi
- Hỗ trợ xuất/nhập file để sao lưu

### Giao diện
- Thiết kế responsive, thân thiện với người dùng
- Biểu tượng emoji tạo sự thú vị
- Hiệu ứng hover và animation mượt mà

### Bảo mật
- Xác nhận trước khi xóa
- Escape HTML để tránh XSS
- Xử lý lỗi an toàn

## 🔄 Cải Tiến Trong Tương Lai

- [ ] Tìm kiếm bài viết
- [ ] Phân loại theo thể loại
- [ ] Editor WYSIWYG
- [ ] Đính kèm hình ảnh
- [ ] Xuất ra nhiều định dạng (JSON, CSV, Markdown)

## 🐛 Báo Lỗi

Nếu gặp sự cố, vui lòng tạo Issue trên GitHub hoặc liên hệ trực tiếp.

## 📝 Giấy Phép

Dự án này sử dụng giấy phép MIT. Bạn có thể tự do sử dụng, sửa đổi và phân phối.

---

🎆 **Chúc bạn viết blog vui vẻ!** 🎆