# 🏍️ Smooth-Ride Admin Dashboard

A professional, high-performance administrative management system built with **Next.js**, **TypeScript**, and **Tailwind CSS**. This dashboard is designed for managing vehicle registrations, dealers, and administrative notifications with a premium UX/UI.

---

## Key Features

### Records Management
- **Live Data Grid:** Sort, filter, and manage thousands of customer registrations seamlessly.
- **Search & Filtering:** Instant filtering by Engine Number, Buyer Name, Dealer, or State.
- **Data Persistence:** Full CRUD (Create, Read, Update, Delete) operations connected to a backend API.
- **Exporting:** One-click CSV export of filtered data for offline reporting.

###  Advanced Analytics
- **Visual Insights:** Interactive charts powered by `Recharts`.
- **Key Metrics:** Monthly registration trends, top bike models, and usage distribution (Private vs. Commercial).
- **Geographic Data:** Heatmaps for State and Dealer performance.

###  Notification System
- **Real-time Alerts:** Unread notification count and pulsing badges in the sidebar.
- **Management:** Mark all as read, delete individual alerts, or wipe notification history.

###  Dealer & Admin Management
- **Security:** Protected routes ensuring only authenticated admins can access the dashboard.
- **Admin Tools:** Interfaces for adding/viewing system admins and authorized dealers.

---

##  Tech Stack

- **Framework:** [Next.js](https://nextjs.org/)
- **Language:** [TypeScript](https://www.typescript.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Charts:** [Recharts](https://recharts.org/)
- **Deployment:** [Vercel](https://vercel.com/)

---


### Step 2: Installation & Setup
```markdown
## 📥 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/your-username/smooth-ride-admin.git](https://github.com/your-username/smooth-ride-admin.git)
   cd smooth-ride-admin
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Variables:**
   Create a `.env.local` file in the root directory and add your connection strings:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   ADMIN_PASSWORD=your_secure_password
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000/admin](http://localhost:3000/admin) to view the dashboard.
```

---

### Step 3: Project Structure
```markdown
## 🏗️ Project Structure

```text
├── components/          # Reusable UI components (Layout, Modals, Sidebar)
├── pages/
│   ├── admin/
│   │   ├── index.tsx      # Main Records Management
│   │   ├── analytics.tsx  # Charts and Data Visualization
│   │   └── notifications.tsx
│   └── api/             # Backend Serverless Functions (Node.js/Mongo)
├── public/              # Static assets (Logos, Icons)
└── styles/              # Global CSS and Tailwind configuration
```
```




**Built for Smooth-Ride Management System**
```