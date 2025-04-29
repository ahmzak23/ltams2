# LTAMS - Logging, Tracking, Alerting & Monitoring Systems

## Overview
LTAMS is a web-based application designed to manage and analyze learning and teaching activities through surveys and analytics. The system allows users to create, manage, and analyze surveys while providing insights through a comprehensive dashboard.

## Features
- Survey Management (Create, Edit, Delete)
- Dynamic Survey Forms with Multiple Question Types
- Dashboard with Analytics
- Material Design UI
- Responsive Layout

## Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)
- Angular CLI (v16.2.0)

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd ltams2/frontend
```

2. Install dependencies:
```bash
npm install --legacy-peer-deps
```

3. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:4200/`

## Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── dashboard/
│   │   │   ├── survey-list/
│   │   │   └── survey-form/
│   │   ├── monitoring/
│   │   ├── app.component.ts
│   │   ├── app.module.ts
│   │   └── app-routing.module.ts
│   ├── assets/
│   └── styles.css
├── angular.json
├── package.json
├── tsconfig.json
└── README.md
```

## Components

### Dashboard Component
- Displays overview of surveys and analytics
- Located at: `src/app/components/dashboard/dashboard.component.ts`
- Route: `/dashboard`

### Survey List Component
- Lists all surveys with management options
- Located at: `src/app/components/survey-list/survey-list.component.ts`
- Route: `/surveys`
- Features:
  - View all surveys
  - Create new survey
  - Edit existing survey
  - Delete survey

### Survey Form Component
- Form for creating and editing surveys
- Located at: `src/app/components/survey-form/survey-form.component.ts`
- Routes: 
  - `/new-survey` (Create)
  - `/edit-survey/:id` (Edit)
- Features:
  - Dynamic form fields
  - Multiple question types
  - Form validation
  - Auto-save functionality

## Development

### Development server
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

### Code scaffolding
Run `ng generate component component-name` to generate a new component.

### Build
Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

### Running tests
Run `ng test` to execute the unit tests via Karma.

## Dependencies
- Angular Material: UI component library
- Chart.js: For analytics visualizations
- OpenTelemetry: For application monitoring

## Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License
[Add your license information here]

## Contact
[Add your contact information here] 