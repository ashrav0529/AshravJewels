# 💎 Ashrav Jewels

**Ashrav Jewels** is a premium luxury jewelry e-commerce web application. Designed with modern aesthetics and a seamless user experience, the platform allows users to browse exclusive jewelry collections, create personalized accounts, and securely place orders. 

## ✨ Key Features
- **Modern User Interface**: A beautifully designed, responsive frontend with a luxury aesthetic.
- **User Authentication**: Secure user registration and login functionality using JWT (JSON Web Tokens) and bcrypt password hashing.
- **Product Catalog**: Dynamic product listings categorized by jewelry types.
- **Shopping Cart & Checkout**: Interactive cart management and order processing system.
- **User Dashboard**: Dedicated user profile page to view past order history and account details.
- **Robust Backend API**: RESTful API powered by Node.js and Express.
- **Database Fallback Engine**: Primary integration with MongoDB (Mongoose), with a built-in automated fallback to local JSON file storage if the database is offline.

## 🛠️ Tech Stack
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose) + Local JSON Fallback
- **Authentication**: JWT (JSON Web Tokens), bcryptjs

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/ashrav-jewels.git
   cd ashrav-jewels
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables (Optional):**
   Create a `.env` file in the root directory and add your MongoDB connection string and JWT Secret:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/ashrav_jewels
   JWT_SECRET=your_super_secret_key
   ```

4. **Start the Development Server:**
   ```bash
   npm start
   ```

5. **View the Application:**
   Open your browser and navigate to `http://localhost:5000`

## 📂 Project Structure
- `/public` - Contains all frontend assets (HTML, CSS, JS, Images)
- `/routes` - Express API routes (Auth, Products, Orders)
- `/models` - Mongoose database schemas
- `/data` - Local JSON fallback storage (auto-generated)
- `index.js` - Main entry point for the server
- `db.js` - Database connection and fallback logic

## 📄 License
This project is licensed under the ISC License.
