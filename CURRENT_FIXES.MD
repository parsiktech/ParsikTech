## Completed Fixes

1. **Fix the Add Client feature** - Email now sends via Resend API when adding clients
2. **Delete companies from DB** - Added delete button to company rows with confirmation dialog
3. **Resend invite link button** - Added "Send Invite" / "Resend Invite" buttons for companies without client accounts

### Changes Made:

**Backend:**
- Added DELETE `/api/admin/companies/:id` endpoint to delete companies and all associated data
- Added POST `/api/admin/clients/resend-invite/:companyId` endpoint to resend invites
- Added `pending_invite_email` field to company listing to track pending invites
- Registered activity routes in index.js
- Added COMPANY_DELETE action to activity service

**Frontend:**
- Updated Company interface with `account_email` and `pending_invite_email` fields
- Added `handleDeleteCompany` function with confirmation dialog
- Added `handleResendInvite` function with email prompt
- Added `resendInvite` method to API client
- Added delete button (trash icon) to each company row
- Added "Send Invite" / "Resend Invite" buttons for companies without active client accounts
