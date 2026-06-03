# Content Versioning Protocol

## Version numbering
- Major: v1.0, v2.0 (structural changes, scope changes)
- Minor: v1.1, v1.2 (content additions, corrections)
- Format: SpecificDescriptor_vN_YYYY-MM-DD.ext

## When to version
- Any change to published content creates a new version
- Superseded version moves to Version-Registry/[type]/Superseded/
- Current version stays in Version-Registry/[type]/Current/

## Change log entry required for
- Any clinical claim change (mandatory)
- Any regulatory-triggered change (mandatory)
- Any content correction (mandatory)
- Routine updates (recommended)

## Recall protocol
- Withdrawn content: move to Recall-Register/Withdrawn-Content/ with timestamp and reason
- Corrected content: move old version to Recall-Register/Corrected-Content/, new version replaces in-situ
