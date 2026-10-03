# Orbit Pay — Premium Debt & Credit Ledger

A sleek, Apple-style debt and credit management wallet built with Next.js, Tailwind CSS, and Firebase.

## 🚀 Features

- **Apple-inspired UI**: Clean typography, glassy nav bars, and premium animations.
- **Flippable Wallet Card**: Track total receiving and payable balances with a 3D flip card.
- **Memoji Avatars**: Personalized iOS-style faces for every entry.
- **Dynamic Sorting & Filtering**: Instantly sort by date or amount; filter by "To receive" or "To pay".
- **Responsive Receipts**: Generate and download professional ripped-edge paper receipts with barcodes.
- **Google Sign-In**: Secure authentication via Firebase.
- **Cloud Storage**: Real-time data sync with Firestore.
- **One-Tap Pay**: UPI deep-linking for instant payments via GPay, PhonePe, or Paytm.

---

## 🛠 Setup & Hosting Guide

### 1. Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/).
2. Create a new project named **Orbit Pay**.
3. **Authentication**: Enable **Google** in the "Sign-in method" tab.
4. **Firestore Database**: Create a database in **Test Mode**.
5. **Project Settings**: Create a "Web App" and copy the configuration keys.

### 2. GitHub Preparation

1. Extract the source code zip.
2. Initialize a git repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```
3. Create a new repository on [GitHub](https://github.com/new).
4. Push your code:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/orbit-pay.git
   git branch -M main
   git push -u origin main
   ```

### 3. Vercel Deployment

1. Go to [Vercel](https://vercel.com/new).
2. Import your **orbit-pay** repository.
3. In the **Environment Variables** section, add the following (from your Firebase Web App config):

   | Key | Value |
   |---|---|
   | `NEXT_PUBLIC_FIREBASE_API_KEY` | `AIza...` |
   | `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `...firebaseapp.com` |
   | `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `...` |
   | `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | `...firebasestorage.app` |
   | `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | `...` |
   | `NEXT_PUBLIC_FIREBASE_APP_ID` | `1:123:web:abc...` |

4. Click **Deploy**.

### 4. Authorize Domain (Crucial)

After deploying to Vercel, you must authorize your new domain in Firebase:
1. Copy your Vercel URL (e.g., `orbit-pay.vercel.app`).
2. In Firebase Console, go to **Authentication** → **Settings** → **Authorized domains**.
3. Click **Add domain** and paste your Vercel URL.

---

## 💻 Technical Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS 4
- **Auth**: Firebase Auth
- **Database**: Firebase Firestore
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Images**: `html-to-image` (Receipt downloads)

---

## 📄 License
This project is for personal use and ledger management.
