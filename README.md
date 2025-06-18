# 📚 Book Club

A modern web application for book lovers to discover, review, and discuss books in reading communities.

![App Screenshot](https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1200)

## ✨ Features

- **User Authentication** - Secure signup and login with JWT
- **Book Discovery** - Browse and search through an extensive book catalog
- **Reading Clubs** - Join or create book clubs for shared reading experiences
- **Reviews & Ratings** - Share your thoughts and rate books you've read
- **Personal Library** - Track your reading progress and wishlist
- **Social Features** - Like and comment on reviews, follow other readers

## 🛠️ Tech Stack

### Frontend
- React 18 with TypeScript
- Vite
- Shadcn UI (Radix UI)
- Tailwind CSS
- React Hook Form
- React Router
- Axios

### Backend
- NestJS
- PostgreSQL with TypeORM
- JWT Authentication
- Swagger/OpenAPI
- Class Validator

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- PostgreSQL v14+
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Daniel-kav/book-club.git
   cd book-club
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   pnpm install
   
   # Install frontend dependencies
   cd frontend
   pnpm install
   
   # Install backend dependencies
   cd ../Backend
   pnpm install
   ```

3. **Set up environment variables**
   - Create `.env` files in both root and backend directories
   - Example backend `.env`:
     ```
     DATABASE_URL=postgresql://user:password@localhost:5432/book_club
     JWT_SECRET=your_jwt_secret
     NODE_ENV=development
     ```

### Database Setup

1. Create a PostgreSQL database
2. Run the schema:
   ```bash
   psql -U your_username -d your_database -f Backend/src/schema.sql
   ```

### Running the Application

1. **Start the backend**
   ```bash
   cd Backend
   pnpm start:dev
   ```

2. **Start the frontend**
   ```bash
   cd ../frontend
   pnpm dev
   ```

3. Access the application at `http://localhost:5173`

## 📚 Database Seeding

To populate the database with sample data:

```bash
cd Backend
npx ts-node src/seed-data.ts
```

## 📖 API Documentation

Access the interactive API documentation at:
```
http://localhost:3000/api
```

## 🏗 Project Structure

```
.
├── Backend/               # NestJS backend
│   ├── src/
│   │   ├── auth/         # Authentication logic
│   │   ├── books/         # Book management
│   │   ├── club/          # Book club functionality
│   │   ├── likes/         # Review likes
│   │   └── ...
│   └── package.json
├── frontend/              # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   └── ...
│   └── package.json
└── README.md
```

## 🧪 Testing

Run tests for both frontend and backend:

```bash
# Backend tests
cd Backend
pnpm test

# Frontend tests
cd ../frontend
pnpm test
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- [Your Name](https://github.com/yourusername)

## 🙏 Acknowledgments

- [NestJS](https://nestjs.com/)
- [React](https://reactjs.org/)
- [Shadcn UI](https://ui.shadcn.com/)
- [TypeORM](https://typeorm.io/)
