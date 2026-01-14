# Innoma Health Care - Project Structure

## 📁 Folder Structure

```
innoma_health care/
├── public/                     # Static assets
├── src/
│   ├── components/            # React components
│   │   ├── Header.tsx        # Navigation header (sticky, responsive)
│   │   ├── HeroBanner.tsx    # Hero section
│   │   ├── TherapistsCarousel.tsx  # Therapist cards carousel
│   │   ├── SymptomsGrid.tsx  # Symptoms/specializations grid
│   │   ├── BenefitsSection.tsx     # Benefits showcase
│   │   ├── AssessmentCTA.tsx       # Call-to-action section
│   │   ├── FAQSection.tsx          # FAQ accordion
│   │   └── Footer.tsx              # Footer section
│   │
│   ├── assets/               # Images, fonts, etc.
│   ├── types.ts             # TypeScript type definitions
│   ├── index.css            # Global styles & Tailwind config
│   ├── App.tsx              # Main app component
│   └── main.tsx             # App entry point
│
├── index.html               # HTML template
├── package.json            # Dependencies
├── tsconfig.json           # TypeScript config
├── vite.config.ts          # Vite configuration
└── postcss.config.js       # PostCSS configuration

```

## 🎨 Component Organization

### Layout Components

- **Header**: Fixed navigation bar with mobile menu
- **Footer**: Site footer with links and info

### Section Components

- **HeroBanner**: Landing page hero section
- **TherapistsCarousel**: Featured therapists showcase
- **SymptomsGrid**: Mental health specializations
- **BenefitsSection**: Platform benefits
- **AssessmentCTA**: Free assessment call-to-action
- **FAQSection**: Frequently asked questions

## 🔧 Technology Stack

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS v4
- **Fonts**: Inter (sans-serif), Playfair Display (display)

## 📝 Type Definitions

All shared types are defined in `src/types.ts`:

- `Therapist`: Therapist profile data
- `Symptom`: Mental health symptom/specialization
- `FAQ`: FAQ item structure
- `Benefit`: Platform benefit data

## 🎯 Best Practices

1. **Component Structure**: Each component is self-contained in its own file
2. **Type Safety**: Use TypeScript types from `types.ts`
3. **Styling**: Use Tailwind utility classes + custom CSS in `index.css`
4. **Imports**: Use `import type` for type-only imports (Tailwind v4 requirement)

## 🚀 Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📱 Responsive Design

All components are fully responsive with breakpoints:

- **sm**: 640px (mobile)
- **md**: 768px (tablet)
- **lg**: 1024px (desktop)
- **xl**: 1280px (large desktop)
