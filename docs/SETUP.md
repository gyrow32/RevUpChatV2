# Setup Instructions

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your actual API keys and configuration

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Allowed Image Domains

Vehicle images are loaded from external sources. The application only
allows optimized images from the following domains:

- `example.com`
- `images.example.com` 