# Jay Cris & Cloe May: Wedding Invitation Website

Friday, December 18, 2026 · San Pedro Pio Parish, Tina, San Miguel, Surigao del Sur

Live site: **https://jaycriscloemay.vercel.app/**

A one-page invitation with an envelope intro, countdown, love story, program, maps, entourage, dress code, gift guide, gallery, FAQ and an RSVP form that saves to Google Sheets. It also has personal invite links, an English / Bisaya switch, and a "thank you" mode after the wedding. There is no build step: it is plain HTML, CSS and JavaScript.

```
index.html                    the whole website (edit the DATA block near the bottom)
images/                       photos (JPG + WebP copies), og-image.jpg (link preview), apple-touch-icon.png
fonts/                        the three fonts, self-hosted (woff2)
music/                        put your song here (optional)
google-apps-script/Code.gs    the RSVP backend (pasted into Google Apps Script)
vercel.json                   hosting settings for Vercel
```

---

## Updating the site

1. Edit `index.html` (almost everything is in the `1. WEDDING DATA` block).
2. Commit and push to GitHub.
3. Vercel sees the push and redeploys by itself; the live site updates in about a minute.

**After editing `google-apps-script/Code.gs`** you must also update the copy inside Google: open the Apps Script project, paste the new code, save, then **Deploy > Manage deployments > pencil icon > Version: New version > Deploy**. The web app URL stays the same, so `index.html` does not need to change. Until you do this, the old script keeps running.

---

## Step 1. Look at it on your computer

Open `index.html` in a browser. The RSVP form runs in **test mode** until you finish step 2 (it shows a yellow note and does not save anything).

Useful links while testing (add to the address):

| Add this | What it does |
|---|---|
| `?intro` | shows the envelope again (it normally shows once per browser session) |
| `?to=Maria%20Santos` | personal greeting "Dear Maria Santos," and the RSVP name filled in |
| `?seats=1` or `?seats=3` | sets how many seats that guest may reserve (default is 2, maximum 10) |
| `?to=Maria%20Santos&seats=3` | both together (this is what the admin link generator makes) |
| `?admin` | opens the RSVP admin page |
| `?now=2026-12-19T09:00` | **testing only:** the page acts as if it were that date and time. Try `2026-12-11T08:00` (RSVP closed), `2026-12-18T15:00` (wedding day) or `2026-12-19T09:00` (after the wedding). The Google script always uses the real date. |

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

The script refuses replies after December 10, 2026 (11:59 PM Philippine time) and stores everything as plain text, so nothing a guest types can run as a spreadsheet formula.

### Changing a reply

If a guest sends the form again with a **name that is already in the sheet**:

- **same mobile number** as the first time: their row is updated (reply, seats, dietary, message). The first `Timestamp` is kept and the new time goes in the `Updated` column. The guest sees "Your RSVP has been updated."
- **different mobile number**: the reply is refused, so nobody can overwrite someone else's RSVP. The guest is told to use the mobile number they used before, or to contact the coordinator.

Names are compared ignoring capital letters, accents and extra spaces. A sheet made with the older script gets the `Updated` heading added automatically.

### Admin page

Open `https://jaycriscloemay.vercel.app/?admin` and enter the password from step 2. The password is checked inside Google's script, not in the website, so guests cannot find it by viewing the page source. There are two tabs.

**Replies:** all replies, totals (attending, declined, seats confirmed), search, an Attending/Declined filter, and **Download CSV** for the caterer and seating plan. Edited replies show "edited" with the time.

**Guest links:**

1. Paste your guest list, one guest per line as `name,seats`, or press **Upload CSV file**. In Google Sheets, put names in column A and seats in column B, then **File > Download > Comma-separated values (.csv)**. A first line `name,seats` is skipped, a blank seat count uses `DATA.rsvp.defaultMaxSeats`, and repeated names are skipped.
2. Press **Generate links**. Every guest gets a personal link like `https://jaycriscloemay.vercel.app/?to=Maria%20Santos&seats=2`. Use **Copy** on a row, or **Copy all** for every `Name: link` line at once.
3. **Not yet replied** lists the guests whose name is not in the RSVP sheet (capital letters, accents and extra spaces are ignored). **Copy reminder message** copies a friendly reminder with that guest's link; **Copy all reminders** copies one for each. Edit the wording in `DATA.rsvp.reminderText`. Press **Refresh** on the Replies tab first to get the latest replies.

The guest list stays in this browser tab only (it is not uploaded anywhere). Matching is by name, so a guest who typed their name differently from your list will still appear as "not yet replied"; check the Replies tab before sending reminders.

---

## Step 3. Put it online with GitHub and Vercel

The site is already on Vercel at https://jaycriscloemay.vercel.app/ (see **Updating the site** above). For a fresh setup:

1. Push this folder to a GitHub repository.
2. Go to [vercel.com](https://vercel.com), sign in with GitHub, click **Add New > Project**, and import the repository.
3. Leave every setting as it is (Framework: **Other**, no build command, no output directory). Click **Deploy**.

### Link preview

The `og:` tags at the top of `index.html` already point to `https://jaycriscloemay.vercel.app/`. If the address ever changes, update `og:url`, `og:image` and `DATA.site.url`. If a chat app still shows an old preview, paste the link into the [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) and click **Scrape Again**.

---

## Where to edit things

Everything about the wedding lives in the clearly labeled `1. WEDDING DATA` block at the top of the `<script>` in `index.html`. Search for the words in quotes.

| What | Search for | Notes |
|---|---|---|
| Names, hashtag | `couple:` | also change the title and `og:` tags at the very top |
| Date and time | `event:` | keep the `+08:00` (Philippine time). `endISO` is also when "thank you" mode starts |
| Ceremony and reception venues, maps | `ceremony:` / `reception:` | change `mapQuery` if the map pin is off |
| Waze pin | `wazeLL:` | optional exact `"latitude,longitude"`; empty = Waze searches `mapQuery` |
| Program | `program:` | one line per item: `["time", "what happens"]` |
| Love story texts | `story:` | replace the bracketed placeholder sentences |
| Story photos | `photo: ""` inside `story` | put a file in `images/`, then `photo: "images/name.jpg"` |
| Entourage and sponsors | `entourage:` | a pair is two names, a single name stands alone |
| Dress code colors | `dress:` | |
| Gallery photos | `gallery:` | 8 slots; `src: ""` shows a placeholder |
| Hero and invitation photo | `heroPhoto:` / `invitePhoto:` | if you change the hero photo, also change the `preload` line in `<head>` |
| Fast photo versions | `photoSizes:` | see **Photos** below |
| Music | `music:` | put the mp3 in `music/`, then `src: "music/name.mp3"` |
| **Gift details** | `gifts:` | replace the `[PLACEHOLDER]` text |
| **Coordinator name and mobile** | `coordinator:` | shown in the footer |
| RSVP deadline, default seats | `rsvp:` | the script has its own deadline in `Code.gs` |
| Reminder message | `reminderText:` | `{name}`, `{link}`, `{deadline}` are filled in |
| Google Sheet link | `scriptUrl` | from step 2 |
| FAQ (English) | `faq:` | the Bisaya FAQ is in `i18n.ceb.faq` |
| Photo album after the wedding | `albumUrl:` | must start with `https://`; empty = no button |
| English / Bisaya text | `i18n:` | see **Languages** below |
| Site address | `site:` | used for guest links when the admin page is opened as a file |
| **Site colors** | `:root {` in the `<style>` | change the `--peach`, `--coral`, `--rose` values |
| Admin password | `ADMIN_PASSWORD` in `Code.gs` | not in index.html |

---

## Features

### Personal invite links

`?to=Guest%20Name` shows "Dear Guest Name," above the invitation message and fills in the RSVP name (the guest can still change it). `?seats=N` limits the seat choice to N (1 to 10). Make these links in bulk with the admin **Guest links** tab. Whatever is in the link is shown as plain text, never as HTML.

### Music

If `DATA.music.src` is set, the song starts when the guest taps **Tap to open** on the envelope. Phones only allow sound after a tap, so it never starts by itself. The round button in the bottom-right corner mutes and unmutes it. If the guest mutes it, it stays muted until they close the browser tab, even if they reload or open the envelope again. Use a song you are allowed to share, and keep the file small (about 3 MB or less).

### Thank-you screen

After a guest accepts, the thank-you screen shows **Add to Google Calendar**, **Download .ics** (Apple Calendar, Outlook) and **Waze** directions to the ceremony and the reception. A guest who declines sees only the thank-you message.

### After the wedding

After `DATA.event.endISO` (December 18, 2026, 10:00 PM), the countdown is replaced by "Thank you for celebrating with us" and, if `DATA.albumUrl` is set, a **View our photo album** button. Everything else stays the same. Test it with `?now=2026-12-19T09:00`.

### Languages (English / Bisaya)

Guests switch language with the **EN / BIS** button in the top-right corner, and the choice is remembered on their device. English is the default. The text is in `DATA.i18n`: `en` holds the English, `ceb` holds Bisaya. A key missing from `ceb` falls back to English. The English date, deadline, dress code text and FAQ come from `event.dateLong`, `rsvp.deadlineText`, `dress.text` and `faq`.

**Every Bisaya line is marked `// REVIEW WITH A NATIVE SPEAKER`.** These are draft translations. Have a native Bisaya speaker read them, correct anything that sounds off, and then delete the comments. Names, the program, entourage roles and venue names are not translated.

### Photos

Each photo has small WebP copies (for example `prenup-1-600.webp`, `-1200.webp`, `-1800.webp`) plus an 800-pixel JPG for older browsers, and `DATA.photoSizes` tells the site they exist. Each browser picks the smallest file that is sharp enough for its screen, usually 25-140 KB instead of the full 200-240 KB JPG.

To add a new photo:

1. Resize it to about 1800 pixels on the long side and save it as JPG in `images/`, for example `images/story-1.jpg`. It works right away; this alone is fine.
2. For faster loading, make WebP copies 600 and 1200 (and 1800 if the photo is that wide) pixels wide with [squoosh.app](https://squoosh.app), named `story-1-600.webp`, `story-1-1200.webp`, and an 800-pixel JPG named `story-1-800.jpg`.
3. Add a line to `photoSizes`, with the size of the original JPG:
   ```js
   "images/story-1.jpg": { w: 1800, h: 1200, webp: [600, 1200, 1800], small: 800 },
   ```

If you replace an existing photo with a new file of the same name, also replace its WebP and `-800.jpg` copies, or the old picture keeps showing.

### Fonts

Great Vibes, Playfair Display and Montserrat are served from `fonts/` instead of Google Fonts (faster, and no third-party requests). They are free fonts under the SIL Open Font License.

---

## Good to know

- **Button text color.** Cream text on the peach `#F4A582` is hard to read (about 2:1 contrast), so button text is a dark warm brown. To switch back, change `--btn-text` to `#FFFAF5`.
- **The deadline and the form.** The form hides itself after December 10 using the guest's own clock, and the script refuses late replies no matter what the clock says.
- **Privacy.** The site asks search engines not to index it (`noindex`), and the link preview still works. Anyone with the link can see the page, so share it only with your guests.
- **Deleting RSVPs.** Delete rows directly in the Google Sheet. The admin page is read-only.
