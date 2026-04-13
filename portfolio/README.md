# My Portfolio & Blog

A personal portfolio and blog, hosted free on GitHub Pages.

---

## Getting it live (step by step)

### 1. Create a GitHub account
Go to [github.com](https://github.com) and sign up if you haven't already.

### 2. Create a new repository
- Click the **+** button → **New repository**
- Name it exactly: `yourusername.github.io` (replace `yourusername` with your actual GitHub username)
- Set it to **Public**
- Click **Create repository**

### 3. Upload these files
- On your new repo page, click **uploading an existing file**
- Drag and drop ALL the files and folders from this folder
- Scroll down, click **Commit changes**

### 4. Enable GitHub Pages
- Go to your repo → **Settings** → **Pages** (left sidebar)
- Under "Source", select **Deploy from a branch**
- Choose **main** branch → **/ (root)**
- Click **Save**

### 5. Wait ~2 minutes, then visit:
`https://yourusername.github.io`

---

## Making it yours

### Change your name and details
Open `_config.yml` and update:
- `title` — your name
- `description` — one line about you
- `author` — your name
- `email` — your email
- `github_username` — your GitHub username
- `url` — your GitHub Pages URL

### Edit the homepage
Open `index.html` and update the hero text, bio, and about section.

---

## Writing a blog post

1. Go to the `_posts` folder
2. Create a new file named: `YYYY-MM-DD-post-title.md`
   - Example: `2025-05-10-my-new-post.md`
3. Paste this at the top of the file (called "front matter"):

```
---
title: "Your Post Title"
date: 2025-05-10
tags: [general]
---
```

4. Write your post below in plain text (Markdown). Then commit.

### Adding photos to posts
1. Drop your image into the `assets/images/` folder
2. Reference it in your post:
```
![Description of image](/assets/images/your-photo.jpg)
```

---

## Adding a project

1. Go to the `_projects` folder
2. Create a new file: `project-name.md`
3. Paste this front matter:

```
---
title: "Project Name"
description: "One sentence about what it does."
tech: [Python, JavaScript]
github: "https://github.com/yourusername/repo"
demo: "https://your-live-site.com"
image: "/assets/images/project-screenshot.jpg"
featured: true
status: "Completed"
---
```

4. Set `featured: true` to show it on the homepage.
5. Write a description below the front matter.

### Adding a project screenshot
- Drop the image in `assets/images/`
- Update the `image:` field in the front matter to match the filename

---

## Folder structure

```
/
├── _config.yml          ← site settings (edit this first)
├── index.html           ← homepage
├── blog.html            ← blog listing page
├── projects.html        ← projects listing page
├── _layouts/            ← page templates (don't need to touch these)
├── _posts/              ← your blog posts go here
├── _projects/           ← your project pages go here
└── assets/
    ├── css/style.css    ← all the styling
    └── images/          ← put all your photos here
```

---

## Updating the site

Every time you commit (save) a file to GitHub, the site rebuilds automatically. Changes are live in about 1–2 minutes.

---

## Questions?

If something doesn't look right, check the **Actions** tab in your GitHub repo — it shows the build log and any errors.
