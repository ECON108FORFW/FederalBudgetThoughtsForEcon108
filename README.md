# Fieldnotes — GitHub Pages + managed anonymous comments

This is a **static** blog: GitHub Pages hosts all public pages, posts, and image files. **Supabase Cloud** is the managed comment storage/API. No WordPress, PHP, hosting subscription, SSH, server maintenance, or reader account is needed. GitHub pushes update the website automatically. Supabase offers a usage-limited free plan; check its current terms and inactivity policies before relying on it.

**Why Supabase instead of an embedded commenting widget?** This blog specifically requires that the *only displayed commenter identifier* is a **server-generated animal species**. Generic commenting widgets often display guest names, require logins, or cannot enforce an animal name. The provided database generates the animal itself and doesn't ask for names or emails. This is a managed backend, rather than an off-the-shelf comments UI.

## First-time setup

### 1) Set up hosted comments
1. Sign up at https://supabase.com and create a project.
2. In **SQL Editor**, execute all of `supabase/setup.sql`.
3. Locate your **Project URL** and **publishable** key (`sb_publishable_...`).
4. Replace the placeholders in `config.js`. It's safe to commit the **publishable key** only in conjunction with restrictive table permissions and row-level security. **Never** commit a secret (`sb_secret_...`) or `service_role` key.
5. Optional: in Supabase project settings set up cost/usage alerts if available. Free tiers have limits and projects may pause after inactivity.

### 2) Publish to GitHub Pages
1. Create a **public repository** at https://github.com/new, e.g. `fieldnotes`.
2. Upload **all the files in this folder** to the repository root, including hidden `.github/workflows/pages.yml`. `index.html` must be at the root.
3. Go to **Settings → Pages → Build and deployment → Source: GitHub Actions**.
4. Open **Actions** and run **Publish Fieldnotes on GitHub Pages** if the workflow hasn't run. Once successful, your blog is usually at `https://YOUR_USERNAME.github.io/fieldnotes/`.
5. Open a post and submit a test comment; check that an animal appears. This verifies the live backend setup.

### 3) Make new posts
- Edit `posts.js` and add a post object with a **unique** `slug`, `title`, `date` (`YYYY-MM-DD`), `excerpt`, optional `cover`, and `blocks`.
- Add images to `assets/` and reference relative paths, e.g. `assets/photo.jpg`.
- Supported blocks: `{type: 'paragraph', text: '...'}, {type: 'heading', text: '...'}, {type: 'image', src: 'assets/photo.jpg', alt: 'Description', caption: 'Optional'}`.
- Commit to `main`. GitHub Actions publishes the changed site automatically. New posts live in GitHub, **not** Supabase.

## What you can customize
- Site copy/navigation: `index.html`
- Appearance: `styles.css`
- Posts and images: `posts.js`, `assets/`
- About page and layout logic: `app.js`
- Animal species and comment storage permissions: `supabase/setup.sql` (execute changes in the SQL Editor, too)

## Comment moderation, abuse, and privacy
- **No reader login** or name/email fields. Each comment is independently assigned a random species, not a durable user identity. A commenter could be given different animals across different comments.
- Public comments are not untraceable. GitHub, Supabase, and intermediate infrastructure may store request metadata such as IP addresses in logs. The comments table stores comment text, post slug, animal, UUID, and timestamp; it does not store username/email/account fields.
- **Public unauthenticated commenting allows spam**. Before promoting a busy site, add server-side anti-spam / CAPTCHA verification and rate limits, or moderate submissions before display. Browser-only CAPTCHA is not sufficient protection. Remove offensive/spam comments using Supabase Table Editor. There is no built-in moderator UI.
- The included SQL grants the anonymous role only read and two-column insert; it cannot choose the animal, edit, or delete comments. Your Supabase account is responsible for moderation and configuration.
- The example frontend displays a maximum of 100 most-recent comments per post.

## Local preview
Run `python3 -m http.server 8000` in this directory, then open `http://localhost:8000/`.

## Troubleshooting
- If comments say they are not configured, check both values in `config.js`.
- If posting fails, re-run the SQL and confirm the key and project URL match the same project. Check browser devtools Network for 4xx responses.
- If GitHub Pages says 404, ensure `index.html` is at the root, `main` exists, and Pages Source is **GitHub Actions**. Confirm a successful Actions run.
- If pages load but images are missing, check the exact case-sensitive image filename/path in `posts.js`.
