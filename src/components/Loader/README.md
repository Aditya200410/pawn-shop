# Loader Component

A uniform loading component that displays the logo with smooth animations and can be used across all loading pages in the application.

## Features

- **Logo Integration**: Uses the application logo with spinning animation
- **Multiple Sizes**: Small, medium, large, and xlarge size options
- **Customizable Text**: Optional loading text with appropriate sizing
- **Full Screen Mode**: Can be displayed as a full-screen overlay
- **Smooth Animations**: Uses Framer Motion for professional animations
- **Error Handling**: Fallback image if logo fails to load
- **Responsive Design**: Works well on all screen sizes

## Usage

### Basic Usage
```jsx
import Loader from '../components/Loader';

// Simple loader
<Loader />

// With custom text
<Loader text="Loading products..." />

// Different sizes
<Loader size="small" text="Loading..." />
<Loader size="medium" text="Loading..." />
<Loader size="large" text="Loading..." />
<Loader size="xlarge" text="Loading..." />
```

### Full Screen Loading
```jsx
// Full screen overlay
<Loader fullScreen={true} text="Loading application..." />
```

### In Page Loading
```jsx
// In a container
<div className="flex justify-center items-center py-12">
  <Loader size="large" text="Loading products..." />
</div>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'small' \| 'medium' \| 'large' \| 'xlarge'` | `'medium'` | Size of the loader |
| `text` | `string` | `'Loading...'` | Loading text to display |
| `fullScreen` | `boolean` | `false` | Whether to display as full-screen overlay |

## Size Classes

- **small**: 32x32px (w-8 h-8)
- **medium**: 64x64px (w-16 h-16)
- **large**: 96x96px (w-24 h-24)
- **xlarge**: 128x128px (w-32 h-32)

## Examples

### Product Loading
```jsx
if (loading) return <Loader size="large" text="Loading product details..." />;
```

### Page Loading
```jsx
if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader size="xlarge" text="Loading page..." />
    </div>
  );
}
```

### Search Loading
```jsx
{searchLoading && (
  <div className="flex justify-center py-4">
    <Loader size="small" text="Searching..." />
  </div>
)}
```

## Implementation Notes

- The component uses the logo from `/public/logo.png`
- Includes fallback to placeholder image if logo fails to load
- Uses amber-600 color scheme to match the application theme
- Includes loading dots animation for better user experience
- Fully responsive and accessible 