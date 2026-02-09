# Push this repo to GitHub

The repo is already initialized with one commit. To put it on GitHub:

## 1. Create the repo on GitHub

1. Go to [github.com/new](https://github.com/new).
2. **Repository name:** `dr-asher-naturals-chiro`
3. Choose **Public**.
4. **Do not** add a README, .gitignore, or license (this project already has them).
5. Click **Create repository**.

## 2. Add the remote and push

In Terminal, from **this folder** (the one with `drasher-static`, `README.md`, etc.), run (replace `YOUR_USERNAME` with your GitHub username):

```bash
git remote add origin https://github.com/YOUR_USERNAME/dr-asher-naturals-chiro.git
git push -u origin main
```

If you use SSH instead of HTTPS:

```bash
git remote add origin git@github.com:YOUR_USERNAME/dr-asher-naturals-chiro.git
git push -u origin main
```

After that, the project will be at `https://github.com/YOUR_USERNAME/dr-asher-naturals-chiro`.

## 3. (Optional) Deploy from GitHub

- **Netlify:** Connect the repo, set **Publish directory** to `drasher-static/drashernaturals.com`, deploy.
- **Vercel:** Same idea — connect repo, set root to `drasher-static/drashernaturals.com` if needed.
- **GitHub Pages:** In repo Settings → Pages, set source to **main** and either root or the folder above; if you use root, the site will be at `YOUR_USERNAME.github.io/dr-asher-naturals-chiro` unless you use a custom domain.
