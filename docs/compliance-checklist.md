# Compliance and Fairness Checklist

This checklist helps developers review common fairness, privacy, and operational issues before connecting lucky draw logic to a real campaign.

## Before the campaign

- Define the campaign organizer, campaign period, eligibility rules, and prize details.
- Define each user's participation limit, win limit, and exception handling process.
- Freeze prize configuration, inventory, weights, and random seed, then save the configuration fingerprint.
- Avoid exposing tamperable core draw parameters on the frontend.
- Define why shipping information is collected, how long it is retained, and how it can be deleted.

## During the campaign

- Record the user ID, prize ID, draw time, campaign ID, and result reason for every draw.
- Use transactions or atomic operations for inventory deduction to avoid overselling in concurrent requests.
- Apply rate limits across risk dimensions such as user, device, and phone number.
- Keep exception logs for later review.

## After the campaign

- Export draw records and audit snapshots.
- Verify remaining inventory and the number of winning records.
- Handle sensitive data such as phone numbers and addresses according to your privacy policy.
- Mask personal information before publishing any necessary winner information.

## Non-goals

Lucky Draw Kit does not replace legal advice and does not handle campaign approval, platform review, payments, logistics, or user identity verification.
