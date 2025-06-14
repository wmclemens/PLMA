# Simple CRM

A lightweight, customizable Customer Relationship Management (CRM) system built with React and Tailwind CSS.

## Features

- 🏢 **Company Management**: Add, edit, and track company records
- 📊 **Custom Fields**: Create custom fields to match your business needs
- 📁 **CSV Import**: Bulk import companies from spreadsheets
- 💬 **Activity Tracking**: Log notes, calls, emails, and meetings
- 👥 **User Management**: Role-based access control (Admin/User)
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🔍 **Search & Filter**: Easily find companies and information

## Quick Start

### Prerequisites

- Node.js 16 or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/simple-crm.git
cd simple-crm
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Building for Production

```bash
npm run build
```

### Deploying to GitHub Pages

1. Update the `homepage` field in `package.json` with your GitHub Pages URL
2. Deploy:
```bash
npm run deploy
```

## Usage

### Default Users

The system comes with three pre-configured users:

- **Admin User** (admin@company.com) - Full access to all features
- **BD Rep 1** (bd1@company.com) - Standard user access
- **BD Rep 2** (bd2@company.com) - Inactive by default

### Key Features

#### Custom Fields
- Add fields like "Lead Source", "Priority Level", "Deal Value"
- Support for text, email, phone, URL, number, date, dropdown, and long text fields
- Mark fields as required or optional

#### CSV Import
- Download a template with your custom fields
- Smart column mapping
- Error handling and validation
- Preview before importing

#### Activity Tracking
- Log different types of activities (notes, calls, emails, meetings)
- Activity stream with timestamps and user attribution
- Real-time updates

## File Structure

```
simple-crm/
├── public/
│   └── index.html
├── src/
│   ├── App.js          # Main CRM component
│   ├── App.css         # Custom styles
│   ├── index.js        # React entry point
│   └── index.css       # Tailwind imports
├── .github/
│   └── workflows/
│       └── deploy.yml  # GitHub Actions deployment
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## Customization

### Adding New Field Types

To add new field types, modify the `renderFieldInput` function in `App.js`:

```javascript
case 'your-new-type':
  return <YourCustomInput {...commonProps} />;
```

### Styling

The app uses Tailwind CSS for styling. Customize the design by:

1. Modifying classes in the components
2. Adding custom CSS in `App.css`
3. Extending the Tailwind config in `tailwind.config.js`

## Data Storage

Currently, the CRM uses in-memory storage (data resets on page refresh). For production use, consider integrating with:

- Local Storage for
