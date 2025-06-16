# Debtrix Figma Plugin

A Figma plugin that allows you to log UX debt directly from your design files to your Debtrix account.

## Features

- **API Key Authentication**: Secure connection to your Debtrix account
- **Project Selection**: Choose from your existing Debtrix projects
- **UX Debt Logging**: Create new UX debt entries with Figma context
- **Debt Listing**: View existing UX debts for selected projects
- **Figma Integration**: Automatically captures file, page, and selection context

## Setup

### 1. Get Your API Key

1. Go to your Debtrix web application
2. Navigate to **Settings** → **API Access**
3. Click **Generate API Key**
4. Copy the generated API key

### 2. Install the Plugin

1. In Figma, go to **Plugins** → **Development** → **Import plugin from manifest**
2. Select the `manifest.json` file from this directory
3. The plugin will appear in your **Plugins** → **Development** menu

### 3. Configure the Plugin

1. Open the Debtrix plugin in Figma
2. Paste your API key in the input field
3. Click **Connect to Debtrix**

## Usage

### Logging UX Debt

1. Select the element(s) in Figma that have UX issues
2. Open the Debtrix plugin
3. Go to the **Add Debt** tab
4. Select a project from the **Projects** tab first
5. Fill in the debt details:
   - **Title**: Brief description of the issue
   - **Type**: Category of the UX debt
   - **Severity**: Priority level
   - **Description**: Detailed explanation
   - **Recommendation**: How to fix the issue
6. Click **Log UX Debt**

The plugin will automatically capture:
- Current Figma file name
- Current page name
- Selected elements
- Direct link to the Figma selection

### Viewing UX Debts

1. Select a project from the **Projects** tab
2. Go to the **List** tab to see existing UX debts
3. Each debt shows its title, severity, type, and status

## Development

### Prerequisites

- Node.js 16+
- TypeScript

### Build

```bash
npm install
npm run build
```

### Watch Mode

```bash
npm run watch
```

## Configuration

Update the following variables in `ui.html`:

```javascript
const API_BASE_URL = 'https://your-project.supabase.co';
const ANON_KEY = 'your-anon-key';
```

Replace with your actual Supabase project URL and anonymous key.

## Security

- API keys are stored securely in Figma's client storage
- All communication uses HTTPS
- API keys can be revoked from the web application

## Support

For issues or questions:
1. Check the Debtrix web application settings
2. Ensure your API key is valid and not revoked
3. Verify your Supabase configuration