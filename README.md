# Vite & HeroUI Template

This is a template for creating applications using Vite and HeroUI (v2).

[Try it on CodeSandbox](https://githubbox.com/frontio-ai/vite-template)

## Technologies Used

- [Vite](https://vitejs.dev/guide/)
- [HeroUI](https://heroui.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Tailwind Variants](https://tailwind-variants.org)
- [TypeScript](https://www.typescriptlang.org)
- [Framer Motion](https://www.framer.com/motion)
- [Supabase](https://supabase.com) - For database and authentication

## How to Use

To clone the project, run the following command:

```bash
git clone https://github.com/frontio-ai/vite-template.git
```

### Install dependencies

You can use one of them `npm`, `yarn`, `pnpm`, `bun`, Example using `npm`:

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

### Setup pnpm (optional)

If you are using `pnpm`, you need to add the following code to your `.npmrc` file:

```bash
public-hoist-pattern[]=*@heroui/*
```

After modifying the `.npmrc` file, you need to run `pnpm install` again to ensure that the dependencies are installed correctly.

## Supabase Integration

This project uses [Supabase](https://supabase.com) for database and authentication services. The Supabase client is configured in `src/lib/supabase.ts`.

### Environment Variables

To connect to your Supabase project, you need to set up the following environment variables in a `.env` file at the root of the project:

```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

You can find these values in your Supabase project dashboard under Project Settings > API.

### Secure Environment Variables for Deployment

For production deployments, it's important to set environment variables securely:

1. **Never commit your `.env` file to version control**. Make sure it's included in your `.gitignore` file.
2. **Set environment variables in your deployment platform**:
   - For Vercel: Use the Environment Variables section in your project settings
   - For Netlify: Use the Environment Variables section in your site settings
   - For other platforms: Refer to their documentation on how to set environment variables

3. **Local Development**: Use a `.env.local` file for local development, which is automatically ignored by Git.

If environment variables are missing, the application will display an error message in the console, but will still attempt to initialize the Supabase client to prevent runtime errors.

### Using Supabase in Components

Import the Supabase client in your components to use it:

```typescript
import { supabase } from '../lib/supabase';

// Example: Fetch data from a table
const fetchData = async () => {
  const { data, error } = await supabase
    .from('your_table')
    .select('*');

  if (error) {
    console.error('Error fetching data:', error);
    return;
  }

  console.log('Data:', data);
};
```

For more information on how to use Supabase, refer to the [Supabase documentation](https://supabase.com/docs).

## License

Licensed under the [MIT license](https://github.com/frontio-ai/vite-template/blob/main/LICENSE).
