# 📝 Blog API - TypeScript + Express + PostgreSQL + Prisma

A production-ready RESTful API for a blogging platform, built with **TypeScript**, **Express**, **PostgreSQL**, and **Prisma ORM**. It includes user authentication, profile management, role-based access control, blog CRUD operations, file uploads, and Swagger API documentation.

---

## 🚀 Features

- ✅ **Authentication** (Register, Login, Forgot/Reset/Change Password)
- 👤 **User Profiles** (View, Update, Upload Profile Picture)
- 🛡️ **Admin Panel** (Manage Users, Verify Accounts, Role Permissions)
- ✍️ **Blog Posts** (Create, Read, Update, Delete with images)
- 🔒 **Protected Routes** using JWT-based Auth
- 📄 **Zod Validation** (runtime safety)
- 🧠 **Prisma ORM** (type-safe database queries)
- 📦 **File Uploads** with Multer
- 📚 **Swagger API Docs** (auto-generated)
- ⚙️ **Global Error Handling**
- 💅 **Clean Modular Folder Structure**

---
## Important Skills

| Script                   | Purpose                            |
| ------------------------ | ---------------------------------- |
| `npm run dev`            | Start dev server with TS + nodemon |
| `npx prisma generate`    | Regenerate Prisma Client           |
| `npx prisma migrate dev` | Run DB migrations                  |
| `npx prisma studio`      | View DB in Prisma Studio           |



## 📂 File Uploads
Profile pictures and post images are stored in the uploads/ directory.

Use multipart/form-data when uploading files.


## 🧪 Tech Stack
Language: TypeScript

Runtime: Node.js

Framework: Express

ORM: Prisma

DB: PostgreSQL

Validation: Zod

File Uploads: Multer

Email: SendGrid

Auth: JWT

Docs: Swagger


