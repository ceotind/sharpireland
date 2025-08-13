# Video Calling System - Sharp Ireland

This directory contains the complete video calling system implementation for Sharp Ireland, providing one-to-one video calling functionality accessible via the `/meet` route.

## Features

- **Real-time Video & Audio Communication**: Powered by Agora RTC SDK
- **Light Theme Integration**: Matches the Sharp Ireland website design
- **Session Management**: 30-minute session timer with warnings
- **Mobile Optimized**: Works on both desktop and mobile devices
- **Contact Integration**: Post-session contact form
- **TypeScript Support**: Fully typed for better development experience
- **Security**: Token-based authentication and HTTPS requirements

## File Structure

```
app/meet/
├── README.md                    # This documentation
├── page.tsx                     # Main video calling interface
├── layout.tsx                   # Meet-specific layout (no nav/footer)
├── components/
│   ├── SessionTimer.tsx         # 30-minute session timer
│   └── ContactModal.tsx         # Post-session contact form
├── lib/
│   └── agora.ts                # Agora SDK wrapper and manager
├── types/
│   └── index.ts                # TypeScript type definitions
└── api/
    └── agora/
        └── token/
            └── route.ts         # Token generation API endpoint
```

## Setup Instructions

### 1. Environment Variables

Add the following variables to your `.env.local` file:

```env
# Agora Video Calling Configuration
NEXT_PUBLIC_AGORA_APP_ID=your_agora_app_id_here
AGORA_APP_CERTIFICATE=your_agora_app_certificate_here
```

### 2. Agora Account Setup

1. Create an account at [Agora.io](https://www.agora.io/)
2. Create a new project in the Agora Console
3. Get your App ID and App Certificate
4. Add them to your environment variables

### 3. Dependencies

The following dependencies are already installed:

- `agora-rtc-sdk-ng`: Agora RTC Web SDK
- `agora-token`: Token generation library
- `@phosphor-icons/react`: Icons for UI controls

## Usage

### Basic Usage

Users can access the video calling system by navigating to `/meet`:

1. Enter a channel name
2. Click "Join Call"
3. Grant camera/microphone permissions
4. Start video calling

### Programmatic Usage

You can also integrate the video calling system programmatically:

```tsx
import MeetPage from './app/meet/page';

// With initial channel name
<MeetPage 
  initialChannelName="my-channel"
  autoJoin={true}
  maxDuration={45} // 45 minutes
/>
```

## Components

### MeetPage

Main video calling interface with the following features:

- Channel joining/leaving
- Local and remote video display
- Audio/video controls
- Session timer
- Error handling

**Props:**
- `initialChannelName?: string` - Pre-fill channel name
- `autoJoin?: boolean` - Automatically join on load
- `maxDuration?: number` - Session duration in minutes (default: 30)

### SessionTimer

Displays session duration and warnings:

- Shows remaining time
- Warning at 5 minutes remaining
- Automatic session termination
- Visual progress indicator

**Props:**
- `onTimeout: () => void` - Called when session expires
- `maxDuration?: number` - Session duration in minutes
- `warningThreshold?: number` - Warning threshold in minutes

### ContactModal

Post-session contact form:

- Collects user information
- Integrates with existing contact API
- Success/error handling
- Responsive design

**Props:**
- `isOpen: boolean` - Modal visibility
- `onClose: () => void` - Close handler
- `sessionData?: object` - Optional session metadata

## API Endpoints

### POST /api/agora/token

Generates Agora RTC tokens for channel authentication.

**Request:**
```json
{
  "channelName": "string",
  "uid": "string|number", // optional
  "role": "publisher|subscriber", // optional
  "expirationTime": "number" // optional
}
```

**Response:**
```json
{
  "token": "string",
  "appId": "string",
  "channelName": "string",
  "uid": "string|number",
  "expirationTime": "number"
}
```

## Security Features

- **Token-based Authentication**: All connections require valid tokens
- **HTTPS Enforcement**: Required for camera/microphone access
- **Session Timeouts**: Automatic disconnection after 30 minutes
- **Input Validation**: All user inputs are validated and sanitized

## Mobile Support

The system is optimized for mobile devices:

- **Responsive Design**: Works on all screen sizes
- **Touch Controls**: Mobile-friendly interface
- **Optimized Settings**: Mobile-specific video/audio configurations
- **Browser Compatibility**: Works with modern mobile browsers

## Error Handling

Comprehensive error handling for:

- Camera/microphone permission denied
- Network connectivity issues
- Browser compatibility problems
- Token generation failures
- Session timeouts

## Customization

### Styling

The system uses the website's existing CSS variables for consistent theming:

- `--primary-100`, `--primary-200`: Primary brand colors
- `--bg-100`, `--bg-200`, `--bg-300`: Background colors
- `--text-100`, `--text-200`, `--text-300`: Text colors
- `--accent-green`, `--accent-red`: Accent colors

### Configuration

Key configuration options in the code:

```typescript
// Session duration (minutes)
const MAX_DURATION = 30;

// Warning threshold (minutes)
const WARNING_THRESHOLD = 5;

// Video quality settings
const VIDEO_CONFIG = {
  width: 1280,
  height: 720,
  frameRate: 30
};
```

## Troubleshooting

### Common Issues

1. **Camera/Microphone Not Working**
   - Ensure HTTPS is enabled
   - Check browser permissions
   - Verify device availability

2. **Connection Failed**
   - Check Agora credentials
   - Verify network connectivity
   - Ensure token generation is working

3. **Mobile Issues**
   - Use HTTPS (required for mobile)
   - Test with supported browsers
   - Check mobile-specific permissions

### Debug Mode

Enable debug logging by setting:

```javascript
localStorage.setItem('agora-debug', 'true');
```

## Performance Optimization

- **Lazy Loading**: Agora SDK is loaded only when needed
- **Mobile Optimization**: Reduced video quality on mobile devices
- **Memory Management**: Proper cleanup of resources
- **Error Recovery**: Automatic retry mechanisms

## Browser Support

- **Desktop**: Chrome 58+, Firefox 56+, Safari 11+, Edge 79+
- **Mobile**: Chrome Mobile 58+, Safari Mobile 11+, Samsung Internet 7.2+

## License

This video calling system is part of the Sharp Ireland website and follows the same licensing terms.

## Support

For technical support or questions about the video calling system, contact the Sharp Ireland development team.