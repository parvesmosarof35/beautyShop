# beauty Shop - Full-Stack E-Commerce

live : https://lunel-beauty.vercel.app/

A modern, full-featured e-commerce platform for beauty and skincare products built with next.js 16, TypeScript, and Redux Toolkit.

## 🌟 Features

### User-Facing Features
- **Product Catalog**: Browse and filter products with advanced filtering options
- **Product Collections**: Curated collections of beauty products
- **Shopping Cart**: Add, remove, and manage products in cart
- **Wishlist**: Save favorite products for later
- **User Authentication**: Register, login, OTP verification, and password reset
- **User Account**: Profile management and order history
- **Blog**: Beauty tips, tutorials, and product information
- **Responsive Design**: Fully responsive across all devices

### Admin Dashboard
- **Dashboard Analytics**: Overview of sales, users, and revenue with growth charts
- **Product Management**: Create, update, and delete products
- **Collection Management**: Organize products into collections
- **Order Management**: Track and manage customer orders
- **Customer Management**: View and manage customer accounts
- **Blog Management**: Create and publish blog posts
- **Content Management**: Manage About Us, FAQ, Privacy Policy, Terms & Conditions, and Contact information
- **Admin Management**: Manage admin users and permissions
- **Profile Management**: Update admin profile and change password

## 🛠️ Tech Stack

### Core Technologies
- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI Library**: [react 19](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)

### State Management & Data Fetching
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **API Integration**: [RTK Query](https://redux-toolkit.js.org/rtk-query/overview)
- **Persistence**: [Redux Persist](https://github.com/rt2zz/redux-persist)

### UI Components & Libraries
- **Component Library**: [Ant Design](https://ant.design/)
- **Icons**: [Lucide React](https://lucide.dev/), [React Icons](https://react-icons.github.io/react-icons/)
- **Charts**: [Recharts](https://recharts.org/)
- **Rich Text Editor**: [Jodit React](https://github.com/jodit/jodit-react)
- **Alerts**: [SweetAlert2](https://sweetalert2.github.io/)
- **Utilities**: [clsx](https://github.com/lukeed/clsx), [tailwind-merge](https://github.com/dcastil/tailwind-merge), [class-variance-authority](https://cva.style/)

### Authentication & Security
- **JWT Handling**: [jwt-decode](https://github.com/auth0/jwt-decode)


## 📁 Project Structure

```
ecommarce-frontend/
├── app/
│   ├── (admin)/              # Admin dashboard routes
│   │   ├── admin/
│   │   │   ├── dashboard/    # Analytics and overview
│   │   │   ├── products/     # Product management
│   │   │   ├── collections/  # Collection management
│   │   │   ├── orders/       # Order management
│   │   │   ├── customers/    # Customer management
│   │   │   ├── blog/         # Blog management
│   │   │   ├── admins/       # Admin user management
│   │   │   ├── profile/      # Admin profile
│   │   │   ├── about-us/     # About Us content
│   │   │   ├── faq/          # FAQ management
│   │   │   ├── privacy-policy/
│   │   │   ├── terms/        # Terms & Conditions
│   │   │   └── contact/      # Contact information
│   │   └── layout.tsx        # Admin layout with sidebar
│   ├── (user)/               # User-facing routes
│   │   ├── page.tsx          # Homepage
│   │   ├── shop/             # Product listing
│   │   ├── products/         # Product details
│   │   ├── cart/             # Shopping cart
│   │   ├── wishlist/         # Wishlist
│   │   ├── account/          # User account
│   │   ├── blog/             # Blog posts
│   │   ├── about/            # About page
│   │   ├── contact/          # Contact page
│   │   ├── faq/              # FAQ page
│   │   ├── login/            # Login page
│   │   ├── register/         # Registration
│   │   ├── forgot-password/  # Password recovery
│   │   ├── reset-password/   # Password reset
│   │   ├── otp/              # OTP verification
│   │   ├── verify-email/     # Email verification
│   │   ├── privacy/          # Privacy policy
│   │   ├── terms/            # Terms & conditions
│   │   └── cookies/          # Cookie policy
│   ├── components/           # Reusable components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── HeroSection.tsx
│   │   ├── ProductCard.tsx
│   │   ├── FilterSidebar.tsx
│   │   ├── dashboard/        # Dashboard components
│   │   └── ui/               # UI components
│   ├── store/                # Redux store
│   │   ├── api/              # RTK Query API slices
│   │   │   ├── baseApi.ts    # Base API configuration
│   │   │   ├── authApi.ts    # Authentication endpoints
│   │   │   ├── productApi.ts # Product endpoints
│   │   │   ├── blogApi.ts    # Blog endpoints
│   │   │   ├── userApi.ts    # User endpoints
│   │   │   └── ...           # Other API slices
│   │   ├── authSlice.ts      # Auth state slice
│   │   ├── config/           # Store configuration
│   │   ├── hooks.ts          # Typed Redux hooks
│   │   └── index.ts          # Store setup
│   ├── context/              # React contexts
│   ├── data/                 # Static data
│   ├── globals.css           # Global styles
│   └── providers.tsx         # App providers
├── lib/                      # Utility functions
├── public/                   # Static assets
├── next.config.js            # Next.js configuration
├── tailwind.config.js        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Project dependencies
```

## 🎨 Styling

This project uses **Tailwind CSS** for styling with custom configurations. Global styles are defined in `app/globals.css`.

### Image Domains

The following image domains are configured in `next.config.js`:
- `images.unsplash.com`
- `res.cloudinary.com`

## 🔐 Authentication

The application uses JWT-based authentication with the following features:
- User registration with email verification
- OTP-based verification
- Password reset flow
- Persistent authentication state using Redux Persist
- Protected routes for admin and user areas

## 📡 API Integration

All API calls are managed through RTK Query with the following structure:
- **Base API**: Centralized API configuration with automatic token injection
- **API Slices**: Modular API endpoints for different features
- **Automatic Caching**: Built-in caching and invalidation
- **Optimistic Updates**: Immediate UI updates with background sync

## 📝 License

This project is private and proprietary.

## 👥 Authors

LUNEL Beauty Development Team

**Built with ❤️ using Next.js and TypeScript**
# beautyShop
