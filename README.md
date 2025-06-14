# Debtrix - UX Debt Tracking SaaS

A comprehensive platform for identifying, tracking, and resolving UX debt across your products. Keep your user experience polished and your team aligned.

## 🚀 Quick Setup Guide

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be fully set up (this takes a few minutes)
3. Go to **Settings** → **API** in your Supabase dashboard
4. Copy your **Project URL** and **anon public** key

### 2. Configure Environment Variables

1. Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Set Up Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy and paste the migration file content from `supabase/migrations/20250614174953_misty_union.sql`
3. Click **Run** to execute the migration

### 4. Configure Authentication

1. In Supabase dashboard, go to **Authentication** → **Settings**
2. Under **Site URL**, add your domain: `https://your-domain.netlify.app`
3. Under **Redirect URLs**, add: `https://your-domain.netlify.app/**`
4. **Disable email confirmation** for testing (optional):
   - Go to **Authentication** → **Settings** → **Email**
   - Turn off "Enable email confirmations"

### 5. Test the Setup

1. Run `npm run dev`
2. Try creating a new account
3. Check your Supabase dashboard to see if the user was created

## 🔧 Features

### Core Features
- **Project Management**: Create and organize multiple UX projects
- **UX Debt Tracking**: Log issues with detailed categorization and severity levels
- **Visual Analytics**: Insights into UX debt patterns with charts and metrics
- **Team Collaboration**: Invite team members and assign tasks
- **Multiple Views**: List and Kanban board views for debt management

### Technical Features
- **Authentication**: Secure user authentication with Supabase
- **Real-time Updates**: Live collaboration with real-time data sync
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Type Safety**: Full TypeScript implementation
- **Form Validation**: Robust form validation with Zod
- **Error Handling**: Comprehensive error boundaries and user feedback
- **Performance**: Optimized builds with code splitting

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Routing**: React Router v6
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Deployment**: Netlify
- **Testing**: Vitest

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (Button, Input, etc.)
│   └── ...             # Feature-specific components
├── contexts/           # React Context providers
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── pages/              # Page components
├── types/              # TypeScript type definitions
└── supabase/           # Database migrations
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd debtrix
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

4. **Set up Supabase database**
   - Create a new Supabase project
   - Run the SQL migration in `supabase/migrations/20250614174953_misty_union.sql`
   - Configure authentication settings

5. **Start development server**
   ```bash
   npm run dev
   ```

## 📊 Database Schema

The application uses the following database structure:

### Tables
- **profiles**: User profile information
- **projects**: UX projects owned by users
- **ux_debts**: Individual UX debt items within projects

### Security
- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- Automatic profile creation on user signup

## 🧪 Testing

```bash
# Run tests
npm run test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## 🚀 Deployment

### Netlify (Recommended)

1. **Connect your repository to Netlify**
2. **Set build settings**:
   - Build command: `npm ci && npm run build`
   - Publish directory: `dist`
3. **Add environment variables** in Netlify dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

The `netlify.toml` file is already configured for SPA routing.

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | Yes |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous key | Yes |
| `VITE_APP_NAME` | Application name | No |
| `VITE_APP_URL` | Application URL | No |
| `VITE_SUPPORT_EMAIL` | Support email address | No |

### Supabase Setup Checklist

- [ ] Create Supabase project
- [ ] Run database migration
- [ ] Configure authentication settings
- [ ] Set up environment variables
- [ ] Test user registration and login
- [ ] Deploy to production

## 🆘 Troubleshooting

### Common Issues

1. **"Missing Supabase environment variables"**
   - Make sure your `.env` file exists and has the correct variables
   - Check that your Supabase URL format is correct

2. **Authentication not working**
   - Verify your Supabase project is fully set up
   - Check authentication settings in Supabase dashboard
   - Ensure database migration has been run

3. **Database errors**
   - Run the migration file in Supabase SQL editor
   - Check that RLS policies are properly set up

## 📝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@debtrix.com or join our Discord community.

## 🗺️ Roadmap

- [ ] Team collaboration features
- [ ] Advanced analytics and reporting
- [ ] Integration with design tools (Figma, Sketch)
- [ ] Mobile app
- [ ] API for third-party integrations
- [ ] Advanced notification system
- [ ] Custom workflows and automation

---

Built with ❤️ by the Debtrix team