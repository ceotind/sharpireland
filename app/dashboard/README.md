# Sharp Ireland Dashboard

A comprehensive, enterprise-grade dashboard built with Next.js 14, TypeScript, and Supabase. This dashboard provides a complete solution for project management, analytics, user management, and business operations.

## 🚀 Features

### Core Dashboard Features
- **Real-time Analytics** - Live metrics and performance monitoring
- **Project Management** - Complete project lifecycle management
- **User Management** - Team collaboration and user administration
- **Billing & Subscriptions** - Integrated payment and subscription management
- **Support System** - Built-in ticketing and customer support
- **SEO Tools** - Comprehensive SEO analysis and reporting

### Advanced Features
- **Real-time Updates** - Live data synchronization with Supabase
- **Mobile Responsive** - Optimized for all device sizes
- **Global Search** - Fuzzy search across all dashboard content
- **Export Capabilities** - CSV, PDF, and Excel export functionality
- **Error Tracking** - Comprehensive error monitoring and reporting
- **Performance Monitoring** - Built-in performance metrics and optimization
- **Caching Layer** - Redis-like in-memory caching for optimal performance

## 📁 Project Structure

```
app/dashboard/
├── README.md                 # This file
├── page.tsx                 # Main dashboard page
├── analytics/               # Analytics pages
├── billing/                 # Billing and subscription pages
├── marketing/              # Marketing tools and campaigns
├── projects/               # Project management pages
├── resources/              # Documentation and resources
├── seo-reports/            # SEO analysis and reports
├── services/               # Service management pages
├── settings/               # User and system settings
└── support/                # Support and ticketing system
```

### Component Architecture

```
app/components/dashboard/
├── DashboardLayout.tsx          # Main layout wrapper
├── DashboardErrorBoundary.tsx   # Error handling and fallback UI
├── MobileNav.tsx               # Mobile navigation component
├── GlobalSearch.tsx            # Global search functionality
├── SettingsPanel.tsx           # Reusable settings panel
├── NotificationCenter.tsx      # Notification management
├── ProjectCard.tsx             # Project display component
├── AnalyticsCard.tsx           # Analytics visualization
├── FileUploader.tsx            # File upload component
└── charts/                     # Chart components
    ├── BarChart.tsx
    └── LineChart.tsx
```

### Utility Functions

```
app/utils/
├── cache.ts                    # In-memory caching system
├── realtime-manager.ts         # Supabase real-time subscriptions
├── performance-monitor.ts      # Performance tracking and metrics
├── export-utils.ts            # Data export functionality
├── error-tracker.ts           # Error tracking and reporting
└── test-helpers.ts            # Testing utilities and mocks
```

## 🛠️ Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS
- **Icons**: Heroicons
- **State Management**: React Hooks + Context
- **Real-time**: Supabase Realtime
- **Testing**: Jest + React Testing Library
- **Performance**: Built-in monitoring and optimization

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sharp-ireland
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure the following variables:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

4. **Run database migrations**
   ```bash
   npx supabase db push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Access the dashboard**
   Open [http://localhost:3000/dashboard](http://localhost:3000/dashboard)

## 📊 Dashboard Sections

### 1. Overview Dashboard (`/dashboard`)
- Key performance indicators (KPIs)
- Recent activity feed
- Quick action buttons
- Real-time metrics

### 2. Analytics (`/dashboard/analytics`)
- Website analytics
- SEO performance metrics
- Marketing campaign results
- Custom reporting tools

### 3. Projects (`/dashboard/projects`)
- Project listing and management
- Progress tracking
- Team collaboration
- Budget and timeline management

### 4. Billing (`/dashboard/billing`)
- Subscription management
- Invoice generation and tracking
- Payment history
- Usage monitoring

### 5. Support (`/dashboard/support`)
- Ticket management system
- Knowledge base integration
- Live chat support
- Customer feedback

### 6. Settings (`/dashboard/settings`)
- User profile management
- Notification preferences
- API key management
- System configuration

## 🔧 Configuration

### Cache Configuration

The dashboard includes a powerful caching system:

```typescript
import { globalCache } from '@/app/utils/cache';

// Set cache with TTL
globalCache.set('user-data', userData, 300000); // 5 minutes

// Get cached data
const cachedData = globalCache.get('user-data');

// Cache with tags for easy invalidation
CacheUtils.setWithTags('project-123', projectData, ['projects', 'user-123']);
```

### Real-time Updates

Configure real-time subscriptions:

```typescript
import { getRealtimeManager } from '@/app/utils/realtime-manager';

const realtimeManager = getRealtimeManager();

// Subscribe to project updates
await realtimeManager.subscribe('project-updates', {
  table: 'projects',
  filter: 'user_id=eq.123'
}, {
  onInsert: (payload) => console.log('New project:', payload),
  onUpdate: (payload) => console.log('Project updated:', payload),
  onDelete: (payload) => console.log('Project deleted:', payload)
});
```

### Performance Monitoring

Monitor dashboard performance:

```typescript
import { getPerformanceMonitor } from '@/app/utils/performance-monitor';

const monitor = getPerformanceMonitor();

// Track custom metrics
monitor.recordMetric('dashboard-load-time', loadTime);

// Monitor function performance
const result = monitor.measureFunction('expensive-operation', () => {
  // Your expensive operation here
});
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Structure

```
__tests__/
├── components/           # Component tests
├── utils/               # Utility function tests
├── api/                 # API endpoint tests
└── integration/         # Integration tests
```

### Using Test Helpers

```typescript
import { MockDataGenerator, ComponentTestUtils } from '@/app/utils/test-helpers';

// Generate mock data
const mockUser = MockDataGenerator.generateUserProfile();
const mockProjects = MockDataGenerator.generateArray(
  () => MockDataGenerator.generateProject(),
  5
);

// Test component props
const props = ComponentTestUtils.createMockProps('ProjectCard', {
  project: mockProjects[0]
});
```

## 📈 Performance Optimization

### Built-in Optimizations

1. **Caching Layer**: In-memory caching with TTL and LRU eviction
2. **Real-time Optimization**: Efficient WebSocket connections with reconnection logic
3. **Code Splitting**: Automatic code splitting with Next.js
4. **Image Optimization**: Next.js Image component with lazy loading
5. **Bundle Analysis**: Built-in bundle analyzer for optimization insights

### Performance Monitoring

The dashboard includes comprehensive performance monitoring:

- **Web Vitals**: LCP, FID, CLS, FCP tracking
- **Custom Metrics**: API response times, render performance
- **Error Tracking**: Automatic error capture and reporting
- **Resource Monitoring**: Network requests and resource loading

### Performance Best Practices

1. **Use the caching layer** for frequently accessed data
2. **Implement optimistic updates** for better UX
3. **Lazy load components** that are not immediately visible
4. **Monitor performance metrics** regularly
5. **Use error boundaries** to prevent cascading failures

## 🔒 Security

### Authentication & Authorization

- **Supabase Auth**: Secure authentication with multiple providers
- **Row Level Security (RLS)**: Database-level security policies
- **API Protection**: Authenticated API endpoints
- **CSRF Protection**: Built-in CSRF token validation

### Data Protection

- **Input Validation**: Comprehensive input sanitization
- **SQL Injection Prevention**: Parameterized queries via Supabase
- **XSS Protection**: Content Security Policy headers
- **Secure Headers**: Security headers for production deployment

## 🚀 Deployment

### Environment Setup

1. **Production Environment Variables**
   ```env
   NODE_ENV=production
   NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key
   ```

2. **Build the Application**
   ```bash
   npm run build
   ```

3. **Deploy to Vercel (Recommended)**
   ```bash
   npx vercel --prod
   ```

### Performance Checklist

- [ ] Enable caching headers
- [ ] Configure CDN for static assets
- [ ] Set up database connection pooling
- [ ] Enable gzip compression
- [ ] Configure monitoring and alerting

## 📚 API Documentation

### Core Endpoints

- `GET /api/user/profile` - Get user profile
- `PUT /api/user/preferences` - Update user preferences
- `GET /api/projects` - List user projects
- `POST /api/projects` - Create new project
- `GET /api/notifications` - Get user notifications
- `GET /api/search` - Global search functionality

### Real-time Subscriptions

- `projects` - Project updates
- `notifications` - New notifications
- `team_members` - Team changes
- `activity_logs` - Activity updates

## 🤝 Contributing

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
4. **Add tests for new functionality**
5. **Run the test suite**
   ```bash
   npm test
   ```
6. **Submit a pull request**

### Code Standards

- **TypeScript**: Strict mode enabled
- **ESLint**: Configured with Next.js rules
- **Prettier**: Code formatting
- **Husky**: Pre-commit hooks
- **Conventional Commits**: Commit message format

## 📞 Support

### Getting Help

- **Documentation**: Check this README and inline code comments
- **Issues**: Create a GitHub issue for bugs or feature requests
- **Discussions**: Use GitHub Discussions for questions
- **Email**: Contact support@sharpireland.com

### Troubleshooting

#### Common Issues

1. **Database Connection Issues**
   - Verify Supabase credentials
   - Check network connectivity
   - Ensure RLS policies are configured

2. **Real-time Not Working**
   - Check WebSocket connections
   - Verify subscription permissions
   - Review browser console for errors

3. **Performance Issues**
   - Check performance monitoring dashboard
   - Review cache hit rates
   - Analyze bundle size

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](../../LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** - For the amazing framework
- **Supabase Team** - For the backend-as-a-service platform
- **Tailwind CSS** - For the utility-first CSS framework
- **Heroicons** - For the beautiful icon set

---

**Built with ❤️ by the Sharp Ireland Team**

For more information, visit [sharpireland.com](https://sharpireland.com)