# NavigationBar Component

Reusable navigation bar component for La Ofi application that supports both marketing and authenticated user experiences.

## Overview

The `NavigationBar` component provides a unified navigation solution with two variants:
- **Marketing**: For public pages (home, services, reservations)
- **Authenticated**: For logged-in users with role-based navigation

## Features

### Common Features
- ✅ Responsive design (mobile & desktop)
- ✅ Sticky positioning with backdrop blur
- ✅ Active route highlighting
- ✅ Mobile drawer menu
- ✅ Smooth transitions and hover states
- ✅ Accessibility support (ARIA labels, keyboard navigation)

### Marketing Variant Features
- Public navigation links (Inicio, Servicios, Reservá tu espacio)
- Call-to-action buttons (Iniciar sesión, App Café)
- Brand yellow accent color (#fdca00)
- Mobile-optimized menu

### Authenticated Variant Features
- Role-based navigation (admin vs coworker)
- Account dropdown with user info
- User initials avatar
- Logout functionality
- Quick access to profile settings
- Real-time session management

## Usage

### Basic Usage in Layout

```tsx
import NavigationBar from "@/app/components/NavigationBar";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

function Layout() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const isMarketing = ["/", "/servicios", "/reserva"].includes(pathname ?? "");

  return (
    <>
      <NavigationBar 
        variant={isMarketing ? "marketing" : "authenticated"} 
        session={session}
        pathname={pathname}
      />
      {/* Page content */}
    </>
  );
}
```

### Props

```typescript
interface NavigationBarProps {
  variant: "authenticated" | "marketing";
  session?: { 
    user?: { 
      name?: string | null; 
      email?: string | null; 
      role?: string 
    } 
  } | null;
  pathname?: string | null;
}
```

#### `variant` (required)
- Type: `"authenticated" | "marketing"`
- Determines which navigation style to render

#### `session` (optional)
- Type: NextAuth session object
- Required when `variant="authenticated"`
- Used to display user info and determine admin access

#### `pathname` (optional)
- Type: `string | null`
- Current route path from `usePathname()`
- Used for active state highlighting

## Navigation Links

### Marketing Links
```typescript
const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/servicios", label: "Servicios" },
  { href: "/reserva", label: "Reservá tu espacio" },
];
```

### Authenticated Links (Coworker)
```typescript
const navLinks = [
  { href: "/pedidos/realizar", label: "Realizar pedido" },
  { href: "/pedidos/historial", label: "Historial" },
];
```

### Authenticated Links (Admin)
```typescript
const navLinks = [
  { href: "/pedidos", label: "Panel" },
  { href: "/pedidos/realizar", label: "Realizar pedido" },
  { href: "/pedidos/historial", label: "Historial" },
  { href: "/productos", label: "Productos" },
  { href: "/clientes", label: "Usuarios" },
];
```

## Styling

### Design System Colors
- **Brand Yellow**: `#fdca00` (primary CTA)
- **Hover Yellow**: `#f1be00`
- **Neutral Scale**: `neutral-50` through `neutral-900`
- **Background**: White with 80% opacity for blur effect

### Shadows
- **Soft**: `shadow-[0_1px_2px_rgba(0,0,0,0.05)]`
- **Medium**: `shadow-[0_10px_30px_-20px_rgba(0,0,0,0.45)]`
- **CTA Glow**: `shadow-[0_10px_40px_-10px_rgba(253,202,0,0.6)]`

### Border Radius
- **Buttons/Pills**: `rounded-full` or `rounded-lg`
- **Dropdown**: `rounded-xl`

## Responsive Behavior

### Breakpoints
- **Mobile**: < 1024px (lg breakpoint)
  - Shows hamburger menu
  - Hides desktop navigation
  - Full-width mobile drawer from right
  
- **Desktop**: ≥ 1024px
  - Shows inline navigation
  - Hides mobile menu button
  - Account dropdown on hover

### Mobile Menu
- Slides in from right with overlay
- 80% viewport width (max 320px)
- Backdrop blur for visual separation
- Tap outside to close

## Customization

### Adding New Links
To add new navigation links, modify the `navLinks` array in the respective component:

```typescript
// For marketing variant (MarketingNavigation)
const navLinks: NavLink[] = [
  { href: "/", label: "Inicio" },
  { href: "/servicios", label: "Servicios" },
  { href: "/new-page", label: "New Page" }, // Add here
];

// For authenticated variant (AuthenticatedNavigation)
const navLinks = useMemo(() => {
  const links: NavLink[] = [
    { href: "/pedidos/realizar", label: "Realizar pedido" },
    { href: "/pedidos/historial", label: "Historial" },
    { href: "/new-feature", label: "New Feature" }, // Add here
  ];
  // Role-based links...
  return links;
}, [isAdmin]);
```

### Customizing Styles
All styles use Tailwind classes. To customize:

1. **Colors**: Update color classes (e.g., `bg-[#fdca00]` → `bg-blue-500`)
2. **Spacing**: Modify padding/margin (e.g., `px-4` → `px-6`)
3. **Typography**: Change font sizes (e.g., `text-sm` → `text-base`)

## Accessibility

- ✅ Semantic HTML (`<header>`, `<nav>`)
- ✅ ARIA labels for screen readers
- ✅ Keyboard navigation support
- ✅ Focus states on interactive elements
- ✅ Proper button roles and states

## Dependencies

- `next/link` - Client-side navigation
- `next/image` - Optimized logo rendering
- `next-auth/react` - Authentication hooks
- `next/navigation` - Route detection
- `react-icons` - Icon components (IoMdMenu, IoMdClose, FaSignOutAlt)

## Testing

### Manual Testing Checklist
- [ ] Marketing navigation displays on public pages
- [ ] Authenticated navigation shows for logged-in users
- [ ] Admin users see additional links (Panel, Productos, Usuarios)
- [ ] Active route highlighting works correctly
- [ ] Mobile menu opens/closes properly
- [ ] Account dropdown shows user info
- [ ] Logout function works
- [ ] Responsive behavior at all breakpoints

### Future Improvements
- Add unit tests with Jest/Testing Library
- Add E2E tests with Playwright
- Add accessibility tests with axe-core

## File Structure

```
src/app/components/
├── NavigationBar.tsx       # Main component
├── AdminNotificationListener.tsx
└── README.md              # This file
```

## Related Files

- [src/app/layout.tsx](../layout.tsx) - Root layout implementation
- [src/lib/authOptions.ts](../../lib/authOptions.ts) - NextAuth configuration
- [middleware.ts](../../../middleware.ts) - Route protection

## Notes

- Component is client-side only (`"use client"`)
- Session state managed by NextAuth
- Logo file must exist at `/public/logolaofi.svg`
- Maintains existing design patterns from original implementation
- Mobile menu z-index: 40 (matches header)
