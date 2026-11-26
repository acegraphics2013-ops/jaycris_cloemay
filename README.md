# Jay Cris & Cloe May: Wedding Invitation Website

Friday, December 18, 2026 · San Pedro Pio Parish, Tina, San Miguel, Surigao del Sur

A one-page invitation with an envelope intro, countdown, love story, program, maps, entourage, dress code, gift guide, gallery, FAQ and an RSVP form that saves to Google Sheets. There is no build step: it is plain HTML, CSS and JavaScript.

```
index.html                    the whole website (edit the DATA block near the bottom)
images/                       prenup-1/2/3.jpg and og-image.jpg (link preview)
music/                        put your song here (optional)
google-apps-script/Code.gs    the RSVP backend (pasted into Google Apps Script)
vercel.json                   hosting settings for Vercel
```

---

## Step 1. Look at it on your computer

Open `index.html` in a browser. The RSVP form runs in **test mode** until you finish step 2 (it shows a yellow note and does not save anything).

Useful links while testing (add to the address):

| Add this | What it does |
|---|---|
| `?intro` | shows the envelope again (it normally shows once per browser session) |
| `?seats=1` or `?seats=3` | sets how many seats that guest may reserve (default is 2) |
| `?admin` | opens the RSVP admin page |

To give each guest their own seat count, send them `https://your-site.vercel.app/?seats=3`.

---

## Step 2. Save RSVPs in Google Sheets (free)

1. Go to [sheets.google.com](https://sheets.google.com) and create a blank sheet. Name it `Wedding RSVPs`.
2. Click **Extensions > Apps Script**.
3. Delete the sample code, then paste the entire contents of `google-apps-script/Code.gs`.
4. At the top of the script, change `ADMIN_PASSWORD` from `CHANGE-ME` to your own password. Click the save icon.
5. Click **Deploy > New deployment**. Click the gear next to "Select type" and choose **Web app**.
6. Set **Execute as: Me** and **Who has access: Anyone**. Click **Deploy**.
7. Google asks you to authorize. Click **Authorize access**, choose your account, then **Advanced > Go to project (unsafe) > Allow**. (It says unsafe only because you wrote the script yourself.)
8. Copy the **Web app URL** (it ends in `/exec`).
9. In `index.html`, find `scriptUrl: ""` and paste the URL between the quotes:
   ```js
   scriptUrl: "https://script.google.com/macros/s/XXXXXXXX/exec",
   ```
10. Open your site, send a test RSVP, and check that a row appears in the sheet's `RSVPs` tab. Delete the test row afterward.

**If you edit Code.gs later**, redeploy or the change will not apply: **Deploy > Manage deployments > pencil icon > Version: New version > Deploy**.

The script refuses replies after December 10, 2026 (11:59 PM Philippine time), refuses a name that is already in the sheet, and stores everything as plain text.

### Admin page

Open `https://your-site.vercel.app/?admin`, enter the password from step 2, and you will see all replies, totals (attending, declined, seats confirmed), search, an Attending/Declined filter, and **Download CSV** for the caterer and seating plan. The password is checked inside Google's script, not in the website, so guests cannot find it by viewing the page source.

---

## Step 3. Put it online with GitHub and Vercel

From Antigravity (or any editor):

1. Open this folder as your project.
2. Create a new GitHub repository and push the folder to it (Antigravity's source-control panel can do "Publish to GitHub", or use `git init`, `git add .`, `git commit`, `git push`).
3. Go to [vercel.com](https://vercel.com), sign in with GitHub, click **Add New > Project**, and import the repository.
4. Leave every setting as it is (Framework: **Other**, no build command, no output directory). Click **Deploy**.
5. You get an address like `https://your-project.vercel.app`. Every time you push a change to GitHub, Vercel updates the site by itself.

### Fix the link preview (important)

Messenger, Viber and Facebook need a full web address for the preview picture. In `index.html`, near the top, replace both `https://YOUR-SITE.vercel.app` values (`og:image` and `og:url`) with your real address, then push again. If a chat app still shows an old preview, paste the link into the [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) and click **Scrape Again**.

### Alternative: Netlify drag-and-drop

1. Go to [app.netlify.com/drop](https://app.netlify.com/drop).
2. Drag this whole folder (not just `index.html`, so the `images` folder goes too) onto the page.
3. Netlify gives you a shareable link. Create a free account to keep it permanently.

---

## Where to edit things

Everything about the wedding lives in the clearly labeled `1. WEDDING DATA` block at the top of the `<script>` in `index.html`. Search for the words in quotes.

| What | Search for | Notes |
|---|---|---|
| Names, hashtag | `couple:` | also change the title and `og:` tags at the very top |
| Date and time | `event:` | keep the `+08:00` (Philippine time) |
| Ceremony and reception venues, maps | `ceremony:` / `reception:` | change `mapQuery` if the map pin is off |
| Program | `program:` | one line per item: `["time", "what happens"]` |
| Love story texts | `story:` | replace the bracketed placeholder sentences |
| Story photos | `photo: ""` inside `story` | put a file in `images/`, then `photo: "images/name.jpg"` |
| Entourage and sponsors | `entourage:` | a pair is two names, a single name stands alone |
| Dress code colors | `dress:` | |
| Gallery photos | `gallery:` | 8 slots; `src: ""` shows a placeholder |
| Hero and invitation photo | `heroPhoto:` / `invitePhoto:` | |
| Music | `music:` | put the mp3 in `music/`, then `src: "music/name.mp3"` |
| **Gift details** | `gifts:` | replace the `[PLACEHOLDER]` text |
| **Coordinator name and mobile** | `coordinator:` | shown in the footer |
| RSVP deadline, default seats | `rsvp:` | the script has its own deadline in `Code.gs` |
| Google Sheet link | `scriptUrl` | from step 2 |
| FAQ | `faq:` | |
| **Site colors** | `:root {` in the `<style>` | change the `--peach`, `--coral`, `--rose` values |
| Admin password | `ADMIN_PASSWORD` in `Code.gs` | not in index.html |

To replace a photo, keep the file name the same (for example overwrite `images/prenup-1.jpg`) or change the file name in the data block. Resize photos to about 1800 pixels wide first so the page loads fast on phones.

---

## Good to know

- **Button text color.** Cream text on the peach `#F4A582` is hard to read (about 2:1 contrast), so button text is a dark warm brown. To switch back, change `--btn-text` to `#FFFAF5`.
- **The deadline and the form.** The form hides itself after December 10 using the guest's own clock, and the script refuses late replies no matter what the clock says.
- **Privacy.** The site asks search engines not to index it (`noindex`), and the link preview still works. Anyone with the link can see the page, so share it only with your guests.
- **Duplicates.** The same name cannot be submitted twice (checked in the sheet). A guest who made a mistake needs you to edit or delete their row in the sheet.
- **Deleting RSVPs.** Delete rows directly in the Google Sheet. The admin page is read-only.
