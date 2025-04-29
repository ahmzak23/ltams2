# Setup Guide

## Development Environment Setup

### Prerequisites
1. **Node.js and npm**
   - Install Node.js (v14 or higher) from [nodejs.org](https://nodejs.org/)
   - Verify installation:
     ```bash
     node --version
     npm --version
     ```

2. **Angular CLI**
   - Install globally:
     ```bash
     npm install -g @angular/cli@16.2.0
     ```
   - Verify installation:
     ```bash
     ng version
     ```

### Project Setup

1. **Clone Repository**
   ```bash
   git clone [repository-url]
   cd ltams2
   ```

2. **Frontend Setup**
   ```bash
   cd frontend
   npm install --legacy-peer-deps
   ```

3. **Environment Configuration**
   - Copy environment template:
     ```bash
     cp src/environments/environment.template.ts src/environments/environment.ts
     ```
   - Update environment variables as needed

4. **Development Server**
   ```bash
   npm start
   ```
   Access the application at `http://localhost:4200`

### Production Deployment

1. **Build Application**
   ```bash
   npm run build -- --configuration=production
   ```
   Build artifacts will be in `dist/ltams-frontend/`

2. **Deployment Options**
   - **Static Hosting**
     - Copy contents of `dist/ltams-frontend/` to web server
     - Configure server for SPA routing
   
   - **Docker Deployment**
     ```bash
     docker build -t ltams-frontend .
     docker run -p 80:80 ltams-frontend
     ```

### Troubleshooting

1. **Common Issues**
   - **Node Version Mismatch**
     - Use `nvm` to switch Node versions
     - Verify in `package.json`

   - **Dependency Conflicts**
     - Clear npm cache: `npm cache clean --force`
     - Delete `node_modules` and reinstall

   - **Angular CLI Issues**
     - Reinstall globally: `npm install -g @angular/cli@16.2.0`
     - Use local CLI: `npx ng serve`

2. **Verification Steps**
   - Check Node/npm versions
   - Verify Angular CLI installation
   - Confirm environment configuration
   - Check console for errors
   - Validate API endpoints

### Development Tools

1. **VS Code Extensions**
   - Angular Language Service
   - ESLint
   - Prettier
   - Angular Snippets

2. **Browser Extensions**
   - Angular DevTools
   - Redux DevTools
   - Angular Augury

### Security Considerations

1. **Environment Variables**
   - Never commit sensitive data
   - Use environment-specific files
   - Implement secure key management

2. **API Security**
   - Use HTTPS
   - Implement CORS properly
   - Set up CSP headers

### Maintenance

1. **Regular Updates**
   - Check for npm updates: `npm outdated`
   - Update dependencies: `npm update`
   - Review security advisories: `npm audit`

2. **Backup Procedures**
   - Source code version control
   - Database backups
   - Configuration backups 