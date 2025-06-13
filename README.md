# Debtrix - UX Debt Tracking SaaS

A comprehensive platform for identifying, tracking, and resolving UX debt across your products. Keep your user experience polished and your team aligned.

## 🚀 Features

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
└── types/              # TypeScript type definitions
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
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase database**
   - Create a new Supabase project
   - Run the SQL migrations in `supabase/migrations/`
   - Enable Row Level Security (RLS)

5. **Start development server**
   ```bash
   npm run dev
   ```

### Database Setup

Create the following tables in your Supabase database:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects table
CREATE TABLE projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  color TEXT NOT NULL,
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- UX Debts table
CREATE TABLE ux_debts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  screen TEXT NOT NULL,
  type TEXT CHECK (type IN ('Heuristic', 'Accessibility', 'Performance', 'Visual', 'Usability')) NOT NULL,
  severity TEXT CHECK (severity IN ('Low', 'Medium', 'High', 'Critical')) NOT NULL,
  status TEXT CHECK (status IN ('Open', 'In Progress', 'Resolved')) NOT NULL DEFAULT 'Open',
  description TEXT NOT NULL,
  recommendation TEXT NOT NULL,
  logged_by TEXT NOT NULL,
  assignee TEXT,
  figma_url TEXT,
  screenshot_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE ux_debts ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own projects" ON projects FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Users can create projects" ON projects FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Users can update own projects" ON projects FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Users can delete own projects" ON projects FOR DELETE USING (auth.uid() = owner_id);

CREATE POLICY "Users can view debts in own projects" ON ux_debts FOR SELECT USING (
  EXISTS (SELECT 1 FROM projects WHERE projects.id = ux_debts.project_id AND projects.owner_id = auth.uid())
);
CREATE POLICY "Users can create debts in own projects" ON ux_debts FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM projects WHERE projects.id = ux_debts.project_id AND projects.owner_id = auth.uid())
);
CREATE POLICY "Users can update debts in own projects" ON ux_debts FOR UPDATE USING (
  EXISTS (SELECT 1 FROM projects WHERE projects.id = ux_debts.project_id AND projects.owner_id = auth.uid())
);
CREATE POLICY "Users can delete debts in own projects" ON ux_debts FOR DELETE USING (
  EXISTS (SELECT 1 FROM projects WHERE projects.id = ux_debts.project_id AND projects.owner_id = auth.uid())
);
```

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

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Connect your repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `dist`
   - Add environment variables in Netlify dashboard

3. **Configure redirects**
   The `netlify.toml` file is already configured for SPA routing.

### Manual Deployment

1. **Build for production**
   ```bash
   npm run build
   ```

2. **Serve the `dist` folder**
   The built files will be in the `dist` directory.

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | Yes |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous key | Yes |
| `VITE_APP_NAME` | Application name | No |
| `VITE_APP_URL` | Application URL | No |
| `VITE_SUPPORT_EMAIL` | Support email address | No |

### Feature Flags

Enable/disable features using environment variables:

- `VITE_ENABLE_ANALYTICS`: Enable analytics features
- `VITE_ENABLE_NOTIFICATIONS`: Enable notification features

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