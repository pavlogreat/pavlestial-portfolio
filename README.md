# Pavlestial Portfolio

This is a static portfolio site with a Three.js particle background. The project includes a `netlify.toml` file so it can be deployed directly to Netlify.

## Deploying to Netlify

1. Create a free account at [Netlify](https://www.netlify.com/).
2. From the Netlify dashboard choose **"Add new site"** > **"Import an existing project"** and connect your Git repository.
3. When prompted for build settings, use the following:
   - **Build command:** *(leave empty)*
   - **Publish directory:** `./`
4. Click **Deploy Site**. Netlify will build and host the site automatically.

To preview a deployment locally you can use the Netlify CLI:

```bash
npm install -g netlify-cli  # if not installed
netlify dev
```

This will serve the site at `http://localhost:8888` using the settings from `netlify.toml`.
