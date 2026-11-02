/**
 * DevCatalyst contact endpoint.
 *
 * Required Script Properties:
 *   NOTIFICATION_EMAIL - inbox that receives the notification
 *   SPREADSHEET_ID     - Google Sheet that stores submissions
 * Optional:
 *   CC_EMAIL           - additional recipient (e.g. devcatalyst.2025@gmail.com)
 *   SHEET_NAME         - tab name, defaults to "Submissions"
 */

const LIMITS = { name: 100, email: 254, phone: 32, company: 120, message: 3000, source: 100 };
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^\+?[0-9][0-9\s().-]*$/;

function doGet() {
  return json({ ok: true, service: "DevCatalyst contact endpoint" });
}

function doPost(e) {
  const props = PropertiesService.getScriptProperties();
  const notificationEmail = props.getProperty("NOTIFICATION_EMAIL");
  if (!notificationEmail) return json({ ok: false, error: "Missing NOTIFICATION_EMAIL" });

  const spreadsheetId = spreadsheetIdFrom(props.getProperty("SPREADSHEET_ID"));
  if (!spreadsheetId) return json({ ok: false, error: "Missing SPREADSHEET_ID" });

  let data;
  try {
    data = parsePayload(e);
  } catch (error) {
    return json({ ok: false, error: "Invalid JSON" });
  }

  const result = validate(data);
  if (!result.ok) return json({ ok: false, error: result.error });
  const submission = result.value;

  try {
    appendSubmission(spreadsheetId, props.getProperty("SHEET_NAME") || "Submissions", submission);
  } catch (error) {
    console.error("Sheet append failed", error);
    return json({ ok: false, error: "Unable to save submission", reason: "sheet" });
  }

  try {
    const options = {
      to: notificationEmail,
      subject: "New DevCatalyst enquiry from " + singleLine(submission.name),
      body: buildBody(submission),
      replyTo: submission.email,
    };
    const ccEmail = props.getProperty("CC_EMAIL");
    if (ccEmail) options.cc = ccEmail;
    MailApp.sendEmail(options);
  } catch (error) {
    console.error("Mail failed", error);
    return json({ ok: false, error: "Unable to send notification", reason: "mail" });
  }

  return json({ ok: true });
}

function spreadsheetIdFrom(value) {
  const raw = text(value);
  if (!raw) return "";
  const match = raw.match(/\/d\/([a-zA-Z0-9-_]+)/);
  return match ? match[1] : raw;
}

function parsePayload(e) {
  const raw = e && e.postData && e.postData.contents;
  if (!raw) return {};
  return JSON.parse(raw);
}

function validate(data) {
  const name = text(data.name);
  const email = text(data.email);
  const phone = text(data.phone);
  const company = text(data.company);
  const message = text(data.message);
  const source = text(data.source).slice(0, LIMITS.source) || "website";
  const submittedAt = text(data.submittedAt) || new Date().toISOString();

  if (!name) return fail("Name is required");
  if (name.length > LIMITS.name) return fail("Name is too long");
  if (!email) return fail("Email is required");
  if (email.length > LIMITS.email || !EMAIL_PATTERN.test(email)) return fail("Email is invalid");
  if (message.length < 1) return fail("Message is required");
  if (message.length > LIMITS.message) return fail("Message is too long");
  if (company.length > LIMITS.company) return fail("Company is too long");
  if (phone.length > LIMITS.phone) return fail("Phone is too long");
  if (phone) {
    const digits = phone.replace(/\D/g, "");
    if (!PHONE_PATTERN.test(phone) || digits.length < 7 || digits.length > 15) return fail("Phone is invalid");
  }

  return { ok: true, value: { name, email, phone, company, message, source, submittedAt } };
}

function appendSubmission(spreadsheetId, sheetName, value) {
  const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  const sheet = spreadsheet.getSheetByName(sheetName) || spreadsheet.getSheets()[0];
  if (!sheet) throw new Error("Missing sheet");

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["Received at", "Name", "Company", "Email", "Phone", "Message", "Source", "Submitted at"]);
  }

  sheet.appendRow([
    new Date(),
    safeCell(value.name),
    safeCell(value.company),
    safeCell(value.email),
    safeCell(value.phone),
    safeCell(value.message),
    safeCell(value.source),
    safeCell(value.submittedAt),
  ]);
}

function buildBody(value) {
  return [
    "You have a new enquiry from the DevCatalyst website.",
    "",
    "Name: " + value.name,
    "Company: " + (value.company || "Not provided"),
    "Email: " + value.email,
    "Phone: " + (value.phone || "Not provided"),
    "Source: " + value.source,
    "Submitted: " + value.submittedAt,
    "",
    "Message:",
    value.message,
  ].join("\n");
}

function text(value) {
  return typeof value === "string" ? value.trim() : "";
}

function singleLine(value) {
  return value.replace(/[\r\n]+/g, " ").slice(0, LIMITS.name);
}

function safeCell(value) {
  const cell = String(value == null ? "" : value);
  return /^[=+\-@]/.test(cell) ? "'" + cell : cell;
}

function fail(error) {
  return { ok: false, error: error };
}

function json(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}
