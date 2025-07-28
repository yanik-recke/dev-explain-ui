# DevExplain UI for the Learning & Softcomputing Project

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Markdown**: react-markdown with GitHub Flavored Markdown
- **Syntax Highlighting**: react-syntax-highlighter

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 18.17.0 or later
- **npm**: Comes with Node.js (or yarn/pnpm as alternatives)
- **Git**: For version control

## Installation

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd github-inspired-webapp
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Install Required Packages

The project uses several additional packages that need to be installed:

```bash
# UI Components (shadcn/ui)
npx shadcn@latest init
npx shadcn@latest add button input card scroll-area select textarea

# Icons
npm install lucide-react

# Markdown Support
npm install react-markdown remark-gfm react-syntax-highlighter
npm install --save-dev @types/react-syntax-highlighter
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
├── app/
│   ├── chat/
│   │   ├── page.tsx          # Chat interface
│   │   └── loading.tsx       # Loading component
│   ├── context-demo/
│   │   └── page.tsx          # Context demonstration
│   ├── demo/
│   │   └── page.tsx          # Demo page
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout with providers
│   └── page.tsx              # Selection/home page
├── components/
│   ├── ui/                   # shadcn/ui components
│   └── example-usage.tsx     # Context usage examples
├── contexts/
│   └── string-context.tsx    # React Context for state management
├── lib/
│   └── utils.ts              # Utility functions
└── README.md
```

## Design Choices

- **Dual-View Interface**: Selection page with URL input and dropdown options
- **Interactive Chat**: Real-time chat interface with markdown rendering
- **Markdown Support**: Full markdown rendering with syntax highlighting
- **Auto-expanding Input**: Text input that grows with content
- **Scrollable Components**: Independent scrolling for chat and sidebar
- **Loading States**: Proper loading indicators and error handling
- **Context Management**: React Context for sharing data between components
- **Responsive Design**: Works on desktop and mobile devices
- **GitHub-Inspired UI**: Clean, minimal design with proper spacing

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler check

## Development Guide

### Adding New Components

1. Create components in the `components/` directory
2. Use TypeScript for type safety
3. Follow the existing naming conventions (kebab-case for files)
4. Import and use shadcn/ui components when possible

### Styling Guidelines

- Use Tailwind CSS classes for styling
- Follow the existing color scheme (grays with accent colors)
- Maintain responsive design principles
- Use the `cn()` utility function for conditional classes

### State Management

The project uses React Context for state management:

```typescript
import { useStringContext } from '@/contexts/string-context'

function MyComponent() {
  const { value, setValue } = useStringContext()
  // Use the context...
}
```

### Adding New Pages

1. Create a new directory in `app/`
2. Add a `page.tsx` file
3. Export a default React component
4. The file will automatically become a route

### API Integration

Currently, the app uses simulated API calls. To integrate real APIs:

1. Replace the mock functions in the components
2. Add proper error handling
3. Consider using a data fetching library like SWR or React Query

## Building for Production

### 1. Build the Application

```bash
npm run build
```

### 2. Test the Production Build

```bash
npm run start
```

### 3. Optimize for Production

The build process automatically:
- Minifies JavaScript and CSS
- Optimizes images
- Generates static pages where possible
- Creates service worker for caching

#### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Environment Variables

Create a `.env.local` file for environment variables:
