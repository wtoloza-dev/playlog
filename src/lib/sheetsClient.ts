import { google } from "googleapis";

/**
 * Google Sheets client configuration.
 * Shared infrastructure for all features that need Sheets access.
 */

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

/**
 * Get authenticated Google Sheets client.
 */
export function getSheetsClient() {
	const auth = new google.auth.GoogleAuth({
		credentials: {
			client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
			private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
		},
		scopes: SCOPES,
	});

	return google.sheets({ version: "v4", auth });
}

export const SHEET_ID = process.env.GOOGLE_SHEET_ID;
export const SHEET_NAME = "plays";
