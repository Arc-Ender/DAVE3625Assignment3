# SpendSmart — Personal Expense Tracker

SpendSmart is a beginner-friendly personal finance web app built with React and Vite. It helps users record income and expenses, understand spending by category, and track a monthly budget.

## Features

- Dashboard with total income, expenses, balance, and remaining budget
- Add income and expense transactions with categories and dates
- Filter transaction history by all, expenses, or income
- Delete transactions
- Category spending breakdown
- Editable monthly spending budget and over-budget warning
- Saves transactions and budget in browser `localStorage`
- Responsive layout for desktop and mobile
- Uses Norwegian kroner (NOK)

## Built with

- React
- Vite
- Lucide React icons
- CSS
- Browser localStorage for persistence

## Run locally

1. Install [Node.js](https://nodejs.org/) (the LTS version is recommended).
2. Download or clone this repository.
3. Open a terminal in the project folder.
4. Install dependencies:

   ```bash
   npm install
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open the local URL printed by Vite (usually `http://localhost:5173`).

## Create a production build

```bash
npm run build
```

The built files will be in the `dist/` folder.

## Upload to GitHub

### Option 1: GitHub website (no Git commands required)

1. Sign in to [GitHub](https://github.com/).
2. Click **New repository**.
3. Name it `spendsmart-expense-tracker`.
4. Choose Public or Private according to your assignment requirements.
5. Create the repository.
6. Click **Add file → Upload files**.
7. Upload the project files and folders from this project. Do not upload `node_modules/` or `dist/`.
8. Click **Commit changes**.

### Option 2: Git commands

Create an empty repository on GitHub, then run these commands in the project folder:

```bash
git init
git add .
git commit -m "Build SpendSmart expense tracker"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/spendsmart-expense-tracker.git
git push -u origin main
```

Replace `YOUR-USERNAME` with your GitHub username and use your repository URL.

## Notes and limitations

- The initial transactions are sample/demo data. Use **Restore demo data** in the footer to reset the sample dataset.
- Data is stored in the browser on the current device and browser profile. It is not synced across devices and is not backed up to a server.
- This app does not connect to bank accounts or process payments.
- This is an educational project, not professional financial advice.

## Ideas for future improvements

- Export transactions as CSV
- Add a month selector and month-specific budget
- Add unit tests
- Add user accounts and secure cloud storage
- Add charts for spending trends over time
