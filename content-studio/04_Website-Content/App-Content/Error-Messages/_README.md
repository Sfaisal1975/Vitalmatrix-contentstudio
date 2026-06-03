# Error Message Taxonomy

All in-app error messages must follow these rules:
- Plain English (no technical jargon)
- State what happened, what to do next, who to contact
- Never expose internal system details
- T-01 compliant (no prohibited terminology)
- British English

Categories:
- Authentication errors (token expired, password wrong, credentials rejected)
- Validation errors (postcode format, file too large, missing required field)
- System errors (service unavailable, timeout)
- Permission errors (non-ACTIVE practitioner, blocked feature)
- Clinical safety errors (scoring boundary violation, data integrity)

STATUS: AWAITING POPULATION. Build alongside F-W30-005.
