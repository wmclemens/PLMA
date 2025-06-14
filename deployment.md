# Deployment Guide

This guide will help you deploy your Simple CRM to GitHub Pages.

## Prerequisites

- GitHub account
- Git installed on your computer
- Node.js 16+ installed

## Step-by-Step Deployment

### 1. Create a GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the "+" icon and select "New repository"
3. Name your repository (e.g., `simple-crm`)
4. Make it public (required for GitHub Pages)
5. Don't initialize with README (we have our own files)
6. Click "Create repository"

### 2. Update Package.json

Before uploading, update the `homepage` field in `package.json`:

```json
{
  "homepage": "https://YOUR_USERNAME.github.io/YOUR_REPOSITORY_NAME"
}
```

Replace:
- `YOUR_USERNAME` with your GitHub username
- `YOUR_REPOSITORY_NAME` with your repository name

Example:
```json
{
  "homepage": "https://johndoe.github.io/simple-crm"
}
```

### 3. Upload Your Files

In your terminal/command prompt:

```bash
# Navigate to your project folder
cd path/to/your/simple-crm

# Initialize git repository
git init

# Add all files
git add .

# Commit files
git commit -m "Initial commit"

# Add your GitHub repository as origin
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git

# Push to GitHub
git push -u origin main
```

### 4. Enable GitHub Actions

The repository includes a GitHub Actions workflow that will automatically deploy your app. No additional setup needed!

### 5. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on "Settings" tab
3. Scroll down to "Pages" in the left sidebar
4. Under "Source", select "GitHub Actions"
5. The workflow will run automatically and deploy your site

### 6. Access Your CRM

After the deployment completes (usually 2-5 minutes), your CRM will be available at:
```
https://YOUR_USERNAME.github.io/YOUR_REPOSITORY_NAME
```

## Alternative: Manual Deployment

If you prefer to deploy manually:

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Deploy to GitHub Pages
npm run deploy
```

## Updating Your CRM

To update your deployed CRM:

1. Make changes to your code
2. Commit and push to GitHub:
```bash
git add .
git commit -m "Your update message"
git push
```

3. GitHub Actions will automatically redeploy your changes

## Troubleshooting

### Build Fails
- Check that all dependencies are installed: `npm install`
- Verify Node.js version: `node --version` (should be 16+)
- Check for syntax errors in your code

### Page Shows 404
- Verify the `homepage` field in `package.json` matches your GitHub Pages URL
- Check that GitHub Pages is enabled in repository settings
- Wait a few minutes for changes to propagate

### Styling Issues
- Ensure Tailwind CSS is properly configured
- Check that `postcss.config.js` and `tailwind.config.js` are present
- Verify all CSS imports in `index.css`

### Import/Export Not Working
- GitHub Pages serves static files only
- File upload works, but downloads might have CORS restrictions
- Consider using a different hosting service for full functionality

## Custom Domain (Optional)

To use a custom domain:

1. Add a `CNAME` file to the `public/` folder with your domain name
2. Configure your domain's DNS to point to GitHub Pages
3. Enable custom domain in repository settings

## Production Considerations

For a production CRM, consider:

- **Backend Integration**: Add a database and API
- **Authentication**: Implement proper user authentication
- **Data Persistence**: Store data permanently
- **Backup Systems**: Regular data backups
- **Security**: HTTPS, input validation, access controls
- **Performance**: Optimize for larger datasets

## Support

If you encounter issues:

1. Check the [GitHub Actions](https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME/actions) tab for build errors
2. Review the deployment logs
3. Open an issue in the repository for help
