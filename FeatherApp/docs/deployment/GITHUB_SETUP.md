# 🚀 GitHub Upload Instructions

## Step 1: Create Repository on GitHub

1. Go to https://github.com/new
2. Repository name: `Feather-Capstone` (or your preferred name)
3. Select Public or Private
4. **IMPORTANT:** Do **NOT** check "Initialize this repository with a README"
5. Click "Create repository" button

## Step 2: Add Remote and Push

After creating the repository on GitHub, use the URL provided to you:

```bash
# Example URL: https://github.com/Cengizbey-m/Feather-Capstone.git

# Add remote
git remote add origin https://github.com/Cengizbey-m/Feather-Capstone.git

# Change branch to main (GitHub default)
git branch -M main

# Push
git push -u origin main
```

## Step 3: Invite Team Members

1. Go to the GitHub repository page
2. Navigate to "Settings" > "Collaborators" section
3. Click "Add people" button
4. Add your team members' GitHub usernames

## Clone Instructions for Team Members

Your team members can clone the project using these commands:

```bash
# Clone the repository
git clone https://github.com/Cengizbey-m/Feather-Capstone.git

# Navigate to project directory
cd Feather-Capstone/FeatherApp

# Backend setup
cd backend
python -m venv venv
# Windows: venv\Scripts\activate
# macOS/Linux: source venv/bin/activate
pip install -r requirements.txt
cp env.example .env
# Edit the .env file

# Frontend setup
cd ../frontend
npm install
cp env.example .env
# Edit the .env file

# Start backend (in one terminal)
cd backend
uvicorn app.main:app --reload

# Start frontend (in another terminal)
cd frontend
npm run dev
```

## Important Notes

- `.env` files are in `.gitignore` so they won't be uploaded to GitHub
- Each team member must create their own `.env` file
- `env.example` files can be used as templates
- Database file (`feather.db`) is also in `.gitignore`, everyone will create their own local database

