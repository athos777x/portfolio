# 3D Interactive Badge Component

This component integrates Vercel's interactive 3D event badge into your Next.js portfolio.

## Features

- **Interactive Physics**: Drag the badge to see realistic rope physics simulation
- **3D Rendering**: Built with React Three Fiber and Three.js
- **Responsive**: Works on desktop and mobile devices
- **Performance Optimized**: Uses dynamic imports and Suspense for better loading

## Components

### Badge3D
The main 3D badge component with physics simulation.

```tsx
import Badge3D from '@/components/Badge3D'

<Badge3D 
  className="w-full h-full" 
  debug={false} // Set to true to see physics debug wireframes
/>
```

### Badge3DShowcase
A complete showcase section that includes the badge with descriptive text.

```tsx
import Badge3DShowcase from '@/components/Badge3DShowcase'

<Badge3DShowcase />
```

## Dependencies

The following packages are required:

- `three` - 3D graphics library
- `@react-three/fiber` - React renderer for Three.js
- `@react-three/drei` - Useful helpers for React Three Fiber
- `@react-three/rapier` - Physics engine integration
- `meshline` - Line rendering utility
- `leva` - Debug controls (optional)
- `@types/three` - TypeScript types for Three.js

## Usage Tips

1. **Performance**: The component is wrapped in `Suspense` and uses dynamic imports to avoid SSR issues
2. **Interaction**: Click and drag the badge to see the physics simulation in action
3. **Styling**: The badge container uses the `badge-3d-container` CSS class for proper sizing
4. **Debug Mode**: Set `debug={true}` on the Badge3D component to see physics wireframes

## Technical Details

- Uses Rapier physics engine for realistic rope simulation
- Implements rope joints and spherical joints for the hanging mechanism
- Features custom lighting setup with Environment and Lightformer components
- Includes mouse/touch interaction for dragging the badge
- Automatically handles cursor changes on hover and drag states

## Browser Compatibility

- Modern browsers with WebGL support
- Mobile devices with hardware acceleration
- Gracefully degrades on older devices with loading fallbacks
