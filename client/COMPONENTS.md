# Component Library Documentation

This project uses [ShadCN/UI](https://ui.shadcn.com/) with [Tailwind CSS](https://tailwindcss.com/) for styling.

## Installation

All dependencies have been configured in `package.json`. Run:

```bash
npm install
```

## Configuration Files

- `tailwind.config.js` - Tailwind CSS configuration with custom theme
- `postcss.config.js` - PostCSS configuration for Tailwind
- `src/index.css` - Global styles and CSS variables
- `tsconfig.json` - Updated with path aliases (@/*)
- `vite.config.ts` - Updated with path resolution

## Available Components

### Basic Components
- **Button** - Multiple variants (default, secondary, outline, ghost, destructive, link)
- **Card** - Container with Header, Title, Description, Content, and Footer sections
- **Input** - Text input field
- **Label** - Form label
- **Textarea** - Multi-line text input
- **Badge** - Tag/label component for categorization
- **Separator** - Visual divider
- **Skeleton** - Loading placeholder

### Component Showcase

Visit `/components` in the application to see all components in action.

## Usage Examples

### Button

```tsx
import { Button } from "@/components/ui/button"

<Button>Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button size="sm">Small</Button>
```

### Card

```tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

<Card>
  <CardHeader>
    <CardTitle>Recipe Title</CardTitle>
    <CardDescription>A delicious meal</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Recipe details go here</p>
  </CardContent>
  <CardFooter>
    <Button>View Recipe</Button>
  </CardFooter>
</Card>
```

### Input & Label

```tsx
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

<div className="space-y-2">
  <Label htmlFor="name">Recipe Name</Label>
  <Input id="name" placeholder="Enter name..." />
</div>
```

### Badge

```tsx
import { Badge } from "@/components/ui/badge"

<Badge>dinner</Badge>
<Badge variant="secondary">vegetarian</Badge>
<Badge variant="outline">< 30 min</Badge>
```

## Theme Customization

### CSS Variables

Theme colors are defined as CSS variables in `src/index.css`:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  /* ... more variables */
}
```

### Dark Mode

Dark mode is supported through the `.dark` class. Toggle dark mode by adding/removing the `dark` class on the `<html>` element:

```tsx
document.documentElement.classList.toggle('dark')
```

## Typography Scale

Recommended text sizes:

```tsx
<h1 className="text-4xl font-bold tracking-tight">Heading 1</h1>
<h2 className="text-3xl font-bold tracking-tight">Heading 2</h2>
<h3 className="text-2xl font-semibold">Heading 3</h3>
<h4 className="text-xl font-semibold">Heading 4</h4>
<p className="text-base">Body text</p>
<p className="text-sm">Small text</p>
<p className="text-sm text-muted-foreground">Muted text</p>
```

## Spacing & Layout

### Container
```tsx
<div className="container">Content</div>
<div className="container-narrow">Narrow content (max-w-4xl)</div>
```

### Spacing
Use Tailwind's spacing scale (4px base unit):
- `space-y-4` - Vertical spacing between children
- `gap-4` - Gap in flex/grid layouts
- `p-4` - Padding
- `m-4` - Margin

### Common Layouts
```tsx
{/* Stack with spacing */}
<div className="space-y-4">...</div>

{/* Flex row with gap */}
<div className="flex gap-2">...</div>

{/* Grid */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">...</div>
```

## Responsive Design

Tailwind breakpoints:
- `sm`: 640px (mobile landscape)
- `md`: 768px (tablet)
- `lg`: 1024px (desktop)
- `xl`: 1280px (large desktop)
- `2xl`: 1536px (extra large)

Example:
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* 1 column on mobile, 2 on tablet, 3 on desktop */}
</div>
```

## Utilities

### cn() Helper

The `cn()` utility (from `@/lib/utils`) merges Tailwind classes intelligently:

```tsx
import { cn } from "@/lib/utils"

<div className={cn(
  "base-classes",
  condition && "conditional-classes",
  className // Accept className prop
)}>
```

### Custom Utilities

Additional utilities in `src/index.css`:
- `.container-narrow` - Centered container with max-width
- `.text-balance` - Balanced text wrapping
- `.scrollbar-thin` - Styled thin scrollbar

## Best Practices

1. **Import components from @/components/ui** - Use the path alias
2. **Use cn() for conditional classes** - Prevents conflicts
3. **Follow the color system** - Use semantic colors (primary, secondary, etc.)
4. **Responsive by default** - Design mobile-first, enhance for larger screens
5. **Semantic HTML** - Use proper elements (button, label, etc.)

## Adding New Components

To add more ShadCN components:

```bash
npx shadcn-ui@latest add [component-name]
```

Examples:
```bash
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add select
npx shadcn-ui@latest add dropdown-menu
```

## Resources

- [ShadCN/UI Documentation](https://ui.shadcn.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Component Showcase](/components) - See components in the app
