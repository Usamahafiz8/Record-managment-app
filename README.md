# Record Management App

A professional React Native mobile application built with Expo for managing customers, suppliers, and their records. Perfect for small businesses and personal use.

## Features

- 🔐 **Authentication**: Secure login and registration system
- 👥 **Customer Management**: Add, edit, delete, and view customers
- 🏢 **Supplier Management**: Add, edit, delete, and view suppliers
- 📝 **Record Management**: Track records with details, date, time, and amount for each customer/supplier
- 💾 **Data Export/Import**: Export your data to JSON files and import it back
- 📱 **Offline Support**: All data stored locally using AsyncStorage
- 🎨 **Modern UI/UX**: Professional and user-friendly interface
- 📊 **Dashboard**: View statistics and summaries on the home screen

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app on your mobile device (for testing)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Scan the QR code with Expo Go app (Android) or Camera app (iOS)

### Building for Production

#### Android
```bash
expo build:android
```

#### iOS
```bash
expo build:ios
```

## Project Structure

```
├── App.tsx                 # Main app entry point
├── src/
│   ├── context/           # React Context (Auth)
│   ├── screens/           # All screen components
│   │   ├── auth/         # Login & Register
│   │   ├── customers/    # Customer management
│   │   ├── suppliers/    # Supplier management
│   │   └── records/      # Record management
│   ├── services/         # Storage and API services
│   └── types/            # TypeScript type definitions
└── logo.png              # App icon/logo
```

## Usage

1. **Register/Login**: Create an account or sign in
2. **Add Customers/Suppliers**: Use the + button to add new entries
3. **Add Records**: Open a customer/supplier detail page and add records with amount, date, and details
4. **Export Data**: Go to Settings to export your data as JSON
5. **Import Data**: Import previously exported JSON files to restore data

## Technology Stack

- **React Native**: Mobile app framework
- **Expo**: Development platform
- **TypeScript**: Type safety
- **React Navigation**: Navigation library
- **AsyncStorage**: Local data storage
- **Expo File System**: File operations
- **Expo Document Picker**: File selection
- **Expo Sharing**: File sharing
- **Date-fns**: Date formatting
- **React Native Date Picker**: Date/time selection

## Developer

Developed by Osama

---

For issues or questions, please check the documentation or contact support.
