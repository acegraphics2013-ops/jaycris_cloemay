/**
 * RSVP backend for the Jay Cris & Cloe May wedding site.
 * Stores every RSVP in the Google Sheet this script is attached to.
 *
 * SETUP: see README.md, step 2. In short:
 *   1. Create a Google Sheet.  2. Extensions > Apps Script, paste this file.
 *   3. Change ADMIN_PASSWORD below.  4. Deploy > New deployment > Web app
 *      (Execute as: Me, Who has access: Anyone).  5. Copy the web app URL
 *      into DATA.rsvp.scriptUrl in index.html.
 *
 * AFTER EVERY EDIT to this file you must redeploy:
 *   Deploy > Manage deployments > pencil icon > Version: New version > Deploy.
 */

/* ===================== EDIT THESE ===================== */
const ADMIN_PASSWORD = 'CHANGE-ME';                 // REQUIRED: choose your own password
const RSVP_DEADLINE  = new Date('2026-12-10T23:59:59+08:00'); // replies are refused after this
const SHEET_NAME     = 'RSVPs';                     // tab name (created automatically)
const MAX_SEATS      = 10;                          // hard upper limit per reply
/* ======================================================= */

const HEADERS = ['Timestamp', 'Name', 'Mobile', 'Attending', 'Seats', 'Dietary', 'Message'];

/** Opening the web app URL in a browser just shows that it is alive. */
function doGet() {
  return json_({ ok: true, service: 'wedding-rsvp' });
}

/** The website sends JSON as text/plain (this avoids browser CORS pre-checks). */
function doPost(e) {
  let body;
  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    return json_({ ok: false, error: 'bad_request' });
  }
  if (body.action === 'list') return handleList_(body);
  if (body.action === 'rsvp') return handleRsvp_(body);
  return json_({ ok: false, error: 'bad_request' });
}

/* ---------------------- guest RSVP ---------------------- */
function handleRsvp_(b) {
  if (b.website) return json_({ ok: true });                 // hidden bot trap: pretend it worked
  if (new Date() > RSVP_DEADLINE) return json_({ ok: false, error: 'closed' });

  const name = clean_(b.name, 80);
  const mobile = String(b.mobile || '').replace(/[\s-]/g, '');
  const attending = b.attending === 'yes' ? 'Joyfully accepts' : b.attending === 'no' ? 'Regretfully declines' : '';
  let seats = parseInt(b.seats, 10);
  if (name.length < 2 || !/^09\d{9}$/.test(mobile) || !attending) return json_({ ok: false, error: 'invalid' });
  if (attending === 'Regretfully declines') seats = 0;
  else if (!(seats >= 1 && seats <= MAX_SEATS)) return json_({ ok: false, error: 'invalid' });

  const lock = LockService.getScriptLock();
  lock.waitLock(20000);                                      // one reply at a time, so duplicates cannot slip in
  try {
    const sheet = getSheet_();
    const last = sheet.getLastRow();
    const key = norm_(name);
    if (last > 1) {
      const names = sheet.getRange(2, 2, last - 1, 1).getValues();
      if (names.some(function (r) { return norm_(r[0]) === key; })) return json_({ ok: false, error: 'duplicate' });
    }
    const stamp = Utilities.formatDate(new Date(), 'Asia/Manila', 'yyyy-MM-dd HH:mm:ss');
    const range = sheet.getRange(last + 1, 1, 1, HEADERS.length);
    range.setNumberFormat('@');                              // plain text: nothing typed by a guest can run as a formula
    range.setValues([[stamp, name, mobile, attending, String(seats), clean_(b.diet, 200), clean_(b.message, 500)]]);
    return json_({ ok: true });
  } finally {
    lock.releaseLock();
  }
}

/* ---------------------- admin list ---------------------- */
function handleList_(b) {
  if (ADMIN_PASSWORD === 'CHANGE-ME') return json_({ ok: false, error: 'not_configured' });
  if (String(b.password || '') !== ADMIN_PASSWORD) {
    Utilities.sleep(1000);                                   // slows down password guessing
    return json_({ ok: false, error: 'unauthorized' });
  }
  const sheet = getSheet_();
  const last = sheet.getLastRow();
  const rows = last > 1 ? sheet.getRange(2, 1, last - 1, HEADERS.length).getValues() : [];
  return json_({
    ok: true,
    rows: rows.map(function (r) {
      return { timestamp: String(r[0]), name: String(r[1]), mobile: String(r[2]), attending: String(r[3]),
               seats: String(r[4]), diet: String(r[5]), message: String(r[6]) };
    })
  });
}

/* ---------------------- helpers ---------------------- */
function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}
function clean_(s, max) {
  return String(s == null ? '' : s).replace(/[\u0000-\u001f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max);
}
function norm_(s) {
  return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
}
function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
