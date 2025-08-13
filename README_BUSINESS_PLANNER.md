# Business Planner Feature Documentation

## Overview

The Business Planner is an AI-powered feature that helps users create comprehensive business plans through an interactive chat interface. It leverages OpenAI's GPT-4 to provide personalized business planning assistance, market analysis, financial projections, and strategic recommendations.

### Key Features

- **Interactive Chat Interface**: Natural conversation flow for business planning
- **AI-Powered Insights**: GPT-4 driven business analysis and recommendations
- **Comprehensive Business Plans**: Full business plan generation with multiple sections
- **Export Functionality**: Export plans in PDF, DOCX, and TXT formats
- **Usage Tracking**: Monitor user sessions and API usage
- **Payment Integration**: Freemium model with Stripe integration
- **Admin Dashboard**: Administrative controls and analytics
- **Security**: Rate limiting, input validation, and secure data handling

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                             │
├─────────────────────────────────────────────────────────────────┤
│  Next.js Frontend                                               │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   Onboarding    │  │   Chat Interface│  │   Export/Billing│ │
│  │   Component     │  │   Component     │  │   Components    │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                        API LAYER                               │
├─────────────────────────────────────────────────────────────────┤
│  Next.js API Routes                                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   /onboarding   │  │     /chat       │  │    /export      │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   /sessions     │  │    /payment     │  │     /admin      │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      SERVICE LAYER                             │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   OpenAI API    │  │   Stripe API    │  │  Rate Limiter   │ │
│  │   Integration   │  │   Integration   │  │   Middleware    │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │  Input Validator│  │  Export Service │  │  Usage Tracker  │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                       DATA LAYER                               │
├─────────────────────────────────────────────────────────────────┤
│  Supabase PostgreSQL Database                                  │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │    Sessions     │  │    Messages     │  │     Plans       │ │
│  │     Table       │  │     Table       │  │     Table       │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
│  ┌─────────────────┐  ┌─────────────────┐                     │
│  │     Usage       │  │    Payments     │                     │
│  │     Table       │  │     Table       │                     │
│  └─────────────────┘  └─────────────────┘                     │
└─────────────────────────────────────────────────────────────────┘
```

## API Endpoints Documentation

### Authentication
All endpoints require user authentication via Supabase Auth.

### Base URL
```
/api/business-planner
```

### Endpoints

#### 1. Onboarding
**POST** `/api/business-planner/onboarding`

Creates a new business planning session with user's initial information.

**Request Body:**
```json
{
  "businessName": "string",
  "industry": "string",
  "businessType": "startup|existing|expansion",
  "targetMarket": "string",
  "goals": "string[]",
  "timeline": "string",
  "budget": "number",
  "experience": "beginner|intermediate|expert"
}
```

**Response:**
```json
{
  "success": true,
  "sessionId": "uuid",
  "message": "Session created successfully"
}
```

**Error Responses:**
- `400`: Invalid input data
- `401`: Unauthorized
- `429`: Rate limit exceeded
- `500`: Internal server error

#### 2. Chat Interface
**POST** `/api/business-planner/chat`

Sends a message to the AI and receives a response.

**Request Body:**
```json
{
  "sessionId": "uuid",
  "message": "string",
  "context": "object (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "response": "string",
  "messageId": "uuid",
  "tokensUsed": "number",
  "remainingTokens": "number"
}
```

**Error Responses:**
- `400`: Invalid session or message
- `401`: Unauthorized
- `402`: Payment required (quota exceeded)
- `429`: Rate limit exceeded
- `500`: AI service error

#### 3. Session Management
**GET** `/api/business-planner/sessions`

Retrieves user's business planning sessions.

**Query Parameters:**
- `limit`: Number of sessions to return (default: 10)
- `offset`: Pagination offset (default: 0)
- `status`: Filter by status (active|completed|archived)

**Response:**
```json
{
  "success": true,
  "sessions": [
    {
      "id": "uuid",
      "businessName": "string",
      "industry": "string",
      "status": "string",
      "createdAt": "timestamp",
      "updatedAt": "timestamp",
      "messageCount": "number"
    }
  ],
  "total": "number"
}
```

#### 4. Export Business Plan
**POST** `/api/business-planner/export`

Exports a business plan in the specified format.

**Request Body:**
```json
{
  "sessionId": "uuid",
  "format": "pdf|docx|txt",
  "sections": "string[] (optional)",
  "template": "string (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "downloadUrl": "string",
  "expiresAt": "timestamp"
}
```

#### 5. Payment Processing
**POST** `/api/business-planner/payment`

Creates a Stripe checkout session for premium access.

**Request Body:**
```json
{
  "priceId": "string",
  "successUrl": "string",
  "cancelUrl": "string"
}
```

**Response:**
```json
{
  "success": true,
  "checkoutUrl": "string",
  "sessionId": "string"
}
```

#### 6. Payment Verification
**POST** `/api/business-planner/payment/verify`

Verifies payment completion and updates user access.

**Request Body:**
```json
{
  "sessionId": "string"
}
```

**Response:**
```json
{
  "success": true,
  "paymentStatus": "completed|pending|failed",
  "accessLevel": "free|premium"
}
```

#### 7. Usage Tracking
**GET** `/api/business-planner/usage`

Retrieves user's usage statistics.

**Response:**
```json
{
  "success": true,
  "usage": {
    "sessionsUsed": "number",
    "sessionsLimit": "number",
    "tokensUsed": "number",
    "tokensLimit": "number",
    "currentPeriodStart": "timestamp",
    "currentPeriodEnd": "timestamp"
  }
}
```

#### 8. Admin Dashboard
**GET** `/api/business-planner/admin`

Administrative endpoint for system statistics (admin only).

**Response:**
```json
{
  "success": true,
  "stats": {
    "totalUsers": "number",
    "activeSessions": "number",
    "totalPlansGenerated": "number",
    "apiUsage": "object",
    "revenue": "object"
  }
}
```

## User Flow Description

### 1. User Registration/Login
- User authenticates via Supabase Auth
- System checks user's access level (free/premium)
- Redirects to business planner dashboard

### 2. Onboarding Process
```
Start → Business Info → Industry Selection → Goals Setting → Session Creation
```

**Steps:**
1. **Business Information**: Name, type, current stage
2. **Industry Selection**: Choose from predefined categories
3. **Target Market**: Define customer segments
4. **Goals & Objectives**: Set specific business goals
5. **Timeline & Budget**: Planning horizon and financial constraints
6. **Experience Level**: User's business experience

### 3. Interactive Planning Session
```
Session Start → AI Conversation → Plan Building → Section Completion → Export
```

**Flow:**
1. **Initial Assessment**: AI asks clarifying questions
2. **Market Analysis**: Discussion of market opportunities
3. **Business Model**: Revenue streams and value proposition
4. **Financial Planning**: Projections and funding requirements
5. **Marketing Strategy**: Customer acquisition and retention
6. **Operations Plan**: Day-to-day business operations
7. **Risk Assessment**: Potential challenges and mitigation

### 4. Plan Generation & Export
```
Complete Session → Generate Plan → Choose Format → Download/Share
```

**Export Options:**
- **PDF**: Professional formatted document
- **DOCX**: Editable Microsoft Word format
- **TXT**: Plain text for further editing

### 5. Payment Flow (Premium Features)
```
Usage Limit → Payment Prompt → Stripe Checkout → Access Upgrade → Continue Planning
```

## Security Measures

### 1. Authentication & Authorization
- **Supabase Auth**: Secure user authentication
- **JWT Tokens**: Session management
- **Role-Based Access**: Admin vs. regular user permissions
- **Session Validation**: Verify user ownership of sessions

### 2. Input Validation & Sanitization
```javascript
// Example validation middleware
const validateInput = (req, res, next) => {
  const { message, sessionId } = req.body;
  
  // Sanitize input
  const sanitizedMessage = sanitizeHtml(message);
  
  // Validate session ownership
  if (!isValidSession(sessionId, req.user.id)) {
    return res.status(403).json({ error: 'Unauthorized session access' });
  }
  
  next();
};
```

### 3. Rate Limiting
```javascript
// Rate limiting configuration
const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});
```

### 4. Data Protection
- **Encryption**: Sensitive data encrypted at rest
- **HTTPS**: All communications over secure connections
- **CSRF Protection**: Cross-site request forgery prevention
- **SQL Injection Prevention**: Parameterized queries

### 5. API Security
- **API Key Management**: Secure OpenAI API key storage
- **Request Signing**: Webhook signature verification
- **CORS Configuration**: Restricted cross-origin requests

## Payment Flow

### Freemium Model
- **Free Tier**: 3 business planning sessions
- **Premium Tier**: Unlimited sessions + advanced features

### Payment Process
```
Usage Limit → Payment Required → Stripe Checkout → Webhook Verification → Access Grant
```

### Stripe Integration
```javascript
// Payment session creation
const session = await stripe.checkout.sessions.create({
  payment_method_types: ['card'],
  line_items: [{
    price: process.env.STRIPE_BUSINESS_PLANNER_PRICE_ID,
    quantity: 1,
  }],
  mode: 'payment',
  success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success`,
  cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cancel`,
  customer_email: user.email,
  metadata: {
    userId: user.id,
    feature: 'business_planner'
  }
});
```

### Webhook Handling
```javascript
// Stripe webhook verification
const sig = req.headers['stripe-signature'];
const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);

if (event.type === 'checkout.session.completed') {
  // Update user access level
  await updateUserAccess(event.data.object.metadata.userId, 'premium');
}
```

## Admin Functions

### 1. System Monitoring
- **Usage Analytics**: Track API usage and costs
- **User Statistics**: Active users, session counts
- **Performance Metrics**: Response times, error rates
- **Revenue Tracking**: Payment processing and revenue

### 2. User Management
- **User Lookup**: Search and view user details
- **Access Control**: Modify user access levels
- **Session Management**: View and manage user sessions
- **Usage Limits**: Adjust user quotas

### 3. Content Moderation
- **Message Review**: Monitor chat conversations
- **Content Filtering**: Automated inappropriate content detection
- **User Reports**: Handle user-reported issues
- **Compliance**: Ensure content meets guidelines

### 4. System Configuration
- **Feature Flags**: Enable/disable features
- **Rate Limits**: Adjust API rate limiting
- **Pricing**: Update subscription pricing
- **AI Parameters**: Modify OpenAI model settings

### Admin Dashboard Features
```javascript
// Admin statistics endpoint
app.get('/api/business-planner/admin', requireAdmin, async (req, res) => {
  const stats = {
    totalUsers: await getUserCount(),
    activeSessions: await getActiveSessionCount(),
    totalPlansGenerated: await getPlanCount(),
    apiUsage: await getAPIUsage(),
    revenue: await getRevenueStats()
  };
  
  res.json({ success: true, stats });
});
```

## Database Schema

### Tables

#### business_planner_sessions
```sql
CREATE TABLE business_planner_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name VARCHAR(255) NOT NULL,
  industry VARCHAR(100) NOT NULL,
  business_type VARCHAR(50) NOT NULL,
  target_market TEXT,
  goals JSONB,
  timeline VARCHAR(100),
  budget DECIMAL(12,2),
  experience VARCHAR(50),
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### business_planner_messages
```sql
CREATE TABLE business_planner_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES business_planner_sessions(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL, -- 'user' or 'assistant'
  content TEXT NOT NULL,
  tokens_used INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### business_planner_plans
```sql
CREATE TABLE business_planner_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES business_planner_sessions(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  format VARCHAR(10) NOT NULL, -- 'pdf', 'docx', 'txt'
  file_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE
);
```

#### business_planner_usage
```sql
CREATE TABLE business_planner_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  sessions_used INTEGER DEFAULT 0,
  tokens_used INTEGER DEFAULT 0,
  period_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  period_end TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '1 month',
  access_level VARCHAR(20) DEFAULT 'free'
);
```

#### business_planner_payments
```sql
CREATE TABLE business_planner_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_session_id VARCHAR(255) UNIQUE,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'usd',
  status VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);
```

## Performance Considerations

### 1. Caching Strategy
- **Session Caching**: Cache active sessions in memory
- **Response Caching**: Cache common AI responses
- **Static Assets**: CDN for static files

### 2. Database Optimization
- **Indexing**: Proper indexes on frequently queried columns
- **Connection Pooling**: Efficient database connections
- **Query Optimization**: Optimized SQL queries

### 3. API Optimization
- **Request Batching**: Batch multiple API calls
- **Streaming**: Stream long AI responses
- **Compression**: Gzip compression for responses

### 4. Monitoring & Alerting
- **Performance Monitoring**: Track response times
- **Error Tracking**: Monitor and alert on errors
- **Usage Monitoring**: Track API usage and costs

## Troubleshooting

### Common Issues

#### 1. OpenAI API Errors
- **Rate Limits**: Implement exponential backoff
- **Token Limits**: Chunk large requests
- **API Downtime**: Implement fallback responses

#### 2. Payment Issues
- **Webhook Failures**: Retry mechanism for webhooks
- **Double Charging**: Idempotency keys
- **Refunds**: Automated refund processing

#### 3. Performance Issues
- **Slow Responses**: Optimize database queries
- **Memory Leaks**: Monitor memory usage
- **High CPU**: Optimize AI processing

### Debug Tools
```javascript
// Debug logging
const debug = require('debug')('business-planner');

debug('Processing chat message', { sessionId, messageLength: message.length });
```

## Future Enhancements

### Planned Features
- **Collaboration**: Multi-user business planning
- **Templates**: Pre-built business plan templates
- **Integration**: CRM and accounting software integration
- **Mobile App**: Native mobile application
- **Multilingual**: Support for multiple languages

### Technical Improvements
- **Real-time**: WebSocket for real-time chat
- **Offline**: Offline capability for mobile
- **AI Models**: Support for multiple AI providers
- **Analytics**: Advanced business analytics

---

For technical support or feature requests, please contact the development team or create an issue in the project repository.