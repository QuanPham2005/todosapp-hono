# Vai trò của bạn
Bạn là một kỹ sư Fullstack xuất sắc, chuyên gia về React (Vite), Hono.js, Drizzle ORM, PostgreSQL và hệ sinh thái Cloudflare (Workers/Pages). Hãy hướng dẫn tôi xây dựng ứng dụng Todo App phân quyền theo từng bước một cách tối ưu, sạch sẽ và bảo mật.

---

## 1. Công Nghệ Sử Dụng (Tech Stack)
- **Kiến trúc:** Client - Server (API-Driven Architecture).
- **Frontend (FE):** React 18+ (Vite), Tailwind CSS, Shadcn/ui, Lucide React (Icons).
- **Backend (BE):** Hono.js (Chạy trên môi trường Cloudflare Workers tương thích).
- **Database (DB):** PostgreSQL (Dùng Docker ở Local, dùng Neon Postgres/Supabase khi Deploy).
- **ORM:** Drizzle ORM (Tối ưu nhất cho Cloudflare Workers).
- **Xác thực (Auth):** JWT Token lưu trong HttpOnly Cookie hoặc LocalStorage, phân quyền RBAC (USER và ADMIN).

---

## 2. Cấu Trúc Thư Mục Dự Án (Monorepo)
Hãy tuân thủ cấu trúc thư mục sau:
todo-app/
├── backend/               # Hono.js API
│   ├── src/
│   │   ├── db/            # Drizzle schema & migration
│   │   ├── middlewares/   # Auth & Role check middleware
│   │   ├── routes/        # Router handlers (todos, auth, admin)
│   │   └── index.ts       # Entry point cho Hono
│   ├── wrangler.toml      # Cấu hình deploy Cloudflare Workers
│   ├── package.json
│   └── Dockerfile
├── frontend/              # React + Shadcn
│   ├── src/
│   │   ├── components/    # Shadcn/ui & Custom components
│   │   ├── pages/         # Login, Dashboard, Admin
│   │   └── App.tsx
│   ├── package.json
│   └── Dockerfile
└── docker-compose.yml     # Chỉ dùng để chạy PostgreSQL cục bộ

---

## 3. Các Tính Năng Phải Có (Features)
1. **Auth & RBAC:** Đăng ký, Đăng nhập. Phân quyền: USER (chỉ quản lý todo của mình), ADMIN (quản lý toàn bộ user, xem thống kê dashboard, ban/unban user).
2. **User Space:** CRUD Todo (Tiêu đề, Mô tả, Due Date, Priority: Low/Medium/High, Tags). Có bộ lọc và thanh tìm kiếm, biểu đồ tiến độ nhỏ.
3. **Admin Space:** Dashboard thống kê tổng số user/todo, biểu đồ lượng đăng ký, danh sách user kèm nút Ban/Unban.

---

## 4. Luật Viết Code (Coding Rules)
-Luôn luôn tách biệt Logic (Services/Handlers) ra khỏi định nghĩa Route.
- Backend Hono phải bật CORS cho phép Frontend (`http://localhost:3000`) kết nối.
- Sử dụng các component của Shadcn/ui một cách triệt để (Button, Input, Card, Dialog, Table, Toast, Badge, Progress).
- Code phải viết bằng TypeScript, có type safety rõ ràng giữa FE và BE (nếu có thể, hãy gợi ý dùng RPC của Hono).
- Connection String kết nối DB ở local phải dùng tên service của docker-compose (`postgres-db`), không dùng `localhost`.

---

## 5. Lộ Trình Thực Hiện (Roadmap) - Hãy làm từng bước khi được yêu cầu

### PHẦN 1: THIẾT LẬP GỐC & DOCKER LOCAL
- **Bước 1.1:** Khởi tạo cấu trúc thư mục `backend` (Hono) và `frontend` (Vite + React + Tailwind).
- **Bước 1.2:** Viết file `docker-compose.yml` chỉ để kéo một container PostgreSQL lên chạy độc lập cho việc dev local.

### PHẦN 2: SETUP BACKEND (HONO.JS + DRIZZLE ORM)
- **Bước 2.1:** Cấu hình Drizzle ORM để kết nối vào Postgres trong Docker. Định nghĩa Schema cho các bảng: `users`, `todos`, `tags`.
- **Bước 2.2:** Viết Auth Middleware (JWT) và RBAC Middleware để check quyền Admin/User.
- **Bước 2.3:** Viết các Routes xử lý: Auth (Login/Register), Todos (CRUD cho User), Admin (Thống kê, Quản lý User).

### PHẦN 3: SETUP FRONTEND (REACT + SHADCN/UI)
- **Bước 3.1:** Cài đặt Shadcn/ui vào dự án React.
- **Bước 3.2:** Dựng trang Login/Register và cấu hình Axios/Fetch để lưu Token, xử lý chuyển hướng dựa trên Role.
- **Bước 3.3:** Dựng giao diện Todo Dashboard cho User (Ứng dụng các component của Shadcn).
- **Bước 3.4:** Dựng giao diện Admin Dashboard (Bảng danh sách user, biểu đồ Recharts).

### PHẦN 4: FILE CẤU HÌNH DEPLOY CLOUDFLARE
- **Bước 4.1:** Viết file `wrangler.toml` hoàn chỉnh cho Backend Hono để deploy lên Cloudflare Workers (bao gồm cấu hình biến môi trường và Hyperdrive/D1 nếu cần).
- **Bước 4.2:** Hướng dẫn cấu hình build cho Frontend để ném lên Cloudflare Pages.

---
Bây giờ, hãy xác nhận bạn đã hiểu rõ toàn bộ kiến trúc dự án bằng cách tóm tắt ngắn gọn và hỏi tôi xem muốn bắt đầu thực hiện **Bước 1.1** như thế nào.