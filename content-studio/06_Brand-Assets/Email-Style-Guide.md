# Email Style Guide
**Section:** 06_Brand-Assets
**Status:** ACTIVE — governs all outbound VitalMatrix email formatting
**Owner:** W08
**Applies to:** All emails sent from VitalMatrix or Dr Faisal personally
**Review gate:** W08 before any template change

---

## Two Email Registers

VitalMatrix sends two types of email. They have different visual treatment, structure, and tone.

| Register | When used | Visual style | Tone |
|----------|-----------|-------------|------|
| **Brand Email** | Nurture sequence, launch sequence, notifications | Dark navy template with gold accent | Professional, peer-to-peer, branded |
| **Personal Email** | Post-call follow-ups, check-ins, founder updates | Plain text or minimal formatting | Direct, personal, Dr Faisal's voice |

**Critical distinction:** the Brand Email register is for automated or campaign emails. The Personal Email register is for anything Dr Faisal sends himself or that should feel like a personal send. Using the dark navy template for a post-call follow-up undermines the personal register entirely.

---

## BRAND EMAIL — Structure and Specification

### Visual hierarchy

```
┌─────────────────────────────────────┐
│  [Brand mark — monospace, gold]     │  ← VitalMatrix™ wordmark, 11px monospace
│                                     │     uppercase, letter-spacing 0.18em
├─────────────────────────────────────┤
│                                     │
│  [H2 — email headline]              │  ← 22px, weight 400, #F4F4F2
│                                     │
│  Salutation paragraph               │  ← 15px, #rgba(244,244,242,0.82)
│                                     │     line-height 1.7
│  Body paragraph 1                   │
│                                     │
│  Body paragraph 2                   │
│                                     │
│  [Blockquote if used]               │  ← Gold left border, gold-tinted bg
│                                     │
│  [CTA Button]                       │  ← Gold bg, navy text, monospace
│                                     │
│  Signature                          │  ← Name bold, credential small
│                                     │
├─────────────────────────────────────┤
│  [Footer — legal + disclaimer]      │  ← 11px, 35% opacity white
└─────────────────────────────────────┘
```

### Colour values (copy exactly — do not approximate)

| Element | Colour | Value |
|---------|--------|-------|
| Outer background | Light grey | `#f4f4f2` |
| Email body background | Deep navy | `#0D2B4E` |
| Brand mark text | Gold | `#C9A84C` |
| H2 headline | Off-white | `#F4F4F2` |
| Body text | Off-white 82% | `rgba(244,244,242,0.82)` |
| Footer text | Off-white 35% | `rgba(244,244,242,0.35)` |
| CTA button background | Gold | `#C9A84C` |
| CTA button text | Deep navy | `#0D2B4E` |
| Blockquote border | Gold | `#C9A84C` |
| Blockquote background | Gold tinted | `rgba(201,168,76,0.08)` |
| Footer border | Gold tinted | `rgba(201,168,76,0.15)` |

### Typography

| Element | Size | Weight | Style |
|---------|------|--------|-------|
| Brand mark | 11px | 700 | Monospace, uppercase, letter-spacing 0.18em |
| H2 headline | 22px | 400 | Normal |
| Body text | 15px | 400 | Normal, line-height 1.7 |
| CTA button label | 11px | 700 | Monospace, uppercase, letter-spacing 0.12em |
| Signature name | 14px | 700 | — |
| Signature credentials | 12px | 400 | — |
| Footer | 11px | 400 | — |

### CTA button specification

```html
<a href="[URL]" style="
  display: inline-block;
  background: #C9A84C;
  color: #0D2B4E;
  font-family: 'Courier New', monospace;
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-weight: 700;
  padding: 12px 24px;
  border-radius: 3px;
  text-decoration: none;
">
  CTA LABEL HERE →
</a>
```

**CTA label conventions:**
- Always UPPERCASE
- Always end with → (right arrow, not >)
- Maximum 5 words
- Standard labels: `BOOK THE DISCOVERY CALL →` / `READ MORE →` / `REPLY TO THIS EMAIL →`

### Blockquote (for clinical disclaimers or pull quotes)

```html
<div style="
  padding: 20px 24px;
  background: rgba(201,168,76,0.08);
  border-left: 3px solid #C9A84C;
  border-radius: 0 4px 4px 0;
  margin: 0 0 24px;
">
  <p style="margin:0; font-size:14px; line-height:1.7; color:rgba(244,244,242,0.75); font-style:italic;">
    [Blockquote text]
  </p>
</div>
```

**Use blockquotes for:** clinical disclaimers, pull quotes from Dr Faisal, key platform statements.
**Do not use blockquotes for:** body copy, lists, CTAs.

### Footer (mandatory — always included)

```
VitalMatrix Ltd  |  Company No. 17046123  |  ICO ZC101813
Clinical intelligence platform for functional medicine practitioners.
VitalMatrix™ outputs are terrain support considerations only — not diagnoses.
[Privacy Notice link]
```

---

## PERSONAL EMAIL — Structure and Specification

Personal emails are sent from Dr Faisal's inbox directly, or designed to appear that way.

### Rules for personal email register

1. **No brand template.** Plain text or the simplest possible HTML formatting (single font, no colours beyond black/grey).
2. **No CTA button.** Use a hyperlinked line of text or a bare URL.
3. **No header brand mark.** The sender name in the From field is the brand.
4. **Short paragraphs.** Maximum 3–4 sentences per paragraph. Often just 1–2.
5. **No bullet lists.** Personal emails do not have bullet points — they have sentences.
6. **Signature is minimal.** Name, credential, title. No banner, no logo.

### Personal email signature

```
Dr Shahzad Faisal
MBBS, FAAMFM | Founder, VitalMatrix™
```

Or for formal contexts:

```
With respect,
Dr Shahzad Faisal
MBBS, FAAMFM | Founder, VitalMatrix™
```

**Never add:** images, logos, social media icons, legal disclaimers longer than one line, or marketing taglines to personal email signatures.

### Disclaimer for personal emails (one line only)

> *VitalMatrix™ outputs are terrain support considerations only and do not constitute a diagnosis.*

Include only if the email contains a clinical or platform claim. The post-call follow-up and onboarding emails include it. The Week 1 check-in does not need it.

---

## LENGTH GUIDELINES

| Email type | Target length | Maximum | Minimum |
|-----------|--------------|---------|---------|
| N1 Nurture (Day 2) | 180–220 words | 280 words | 140 words |
| N2 Nurture (Day 4) | 160–200 words | 250 words | 120 words |
| N3 Nurture (Day 6) | 150–180 words | 220 words | 120 words |
| N4 Nurture (Day 8) | 100–130 words | 160 words | 80 words |
| L1 Launch email | 200–250 words | 300 words | 160 words |
| L2 Launch email | 200–250 words | 300 words | 160 words |
| L3 Launch close | 100–130 words | 160 words | 80 words |
| Pre-call email | 80–100 words | 130 words | 60 words |
| Post-call Version A | 120–150 words | 180 words | 90 words |
| Post-call Version B | 180–220 words | 260 words | 140 words |
| Post-call Version C | 80–100 words | 130 words | 60 words |
| Welcome email | 150–180 words | 220 words | 120 words |
| Week 1 check-in | 100–120 words | 150 words | 80 words |
| Monthly founder update | 250–350 words | 450 words | 200 words |

**General rule:** the later in the funnel, the shorter the email. Practitioners who have already booked a call do not need to be convinced — they need clear information and a clear next step.

---

## PARAGRAPH AND SENTENCE RULES

### Paragraph length
- Brand emails: 2–4 sentences per paragraph, maximum 5
- Personal emails: 1–3 sentences per paragraph

### Sentence length
- Aim for an average of 15–20 words per sentence
- Vary length: a short sentence after two longer ones creates emphasis
- Never write a sentence longer than 35 words in any VitalMatrix email

### Line breaks
- Always leave a blank line between paragraphs
- Never use double blank lines — one is the standard
- Do not indent paragraphs

### Lists in brand emails
- Use `<ul>` bullet lists sparingly — maximum one list per email
- Each bullet: maximum 25 words
- Do not start a bullet with the same word as the previous one

### Lists in personal emails
- Do not use bullet lists
- If you need to list items, use "First... Second... Third..." or write them as a sentence

---

## THE PLAIN TEXT VERSION

Every brand email must have a plain text version. The plain text version is not an afterthought — some practitioners read email in plain text only.

**Plain text rules:**
- No HTML formatting whatsoever
- Paragraph breaks: two line returns
- CTA: write the URL in full on its own line, preceded by the label
- Bullet lists: use "  •" with two spaces before
- Section dividers: three dashes `---`
- Signature: as normal, no fancy separators

**Example CTA in plain text:**
```
Book the discovery call:
https://calendly.com/vitalmatrix-discovery-call/30min
```

---

## WHAT NEVER APPEARS IN A VITALMATRIX EMAIL

| Element | Why banned |
|---------|-----------|
| Stock photo header images | Not our register — too generic, too corporate |
| Social media icon footer bar | Practitioners do not click these; they add noise |
| "Unsubscribe" in body copy | Required in footer (legal), not in body |
| Countdown timers | Manufactured urgency — not our tone |
| Progress bars ("You are 80% through our onboarding") | Gamification — wrong register |
| GIFs or animated elements | Unprofessional for clinical audience |
| Exclamation marks | More than one per email is too many. Zero is often better. |
| "Just checking in" | Passive, weak — never an opening |
| "I hope this email finds you well" | Delete reflex trigger — never an opening |
| Red or green text | Off-brand; associated with alerts and spam |

---

## COMPLIANCE CHECKLIST (complete before any email goes out)

- [ ] Hook uses correct type for this funnel stage (see `Email-Hooks-Library.md`)
- [ ] No prohibited phrases from `Voice-and-Tone-Guide.md`
- [ ] Platform descriptor used correctly ("clinical intelligence platform" only)
- [ ] Standard disclaimer present if email contains a clinical or platform claim
- [ ] All clinical claims cross-referenced against Claims Register (`21_Evidence-Register/Claims-Register.md`)
- [ ] Subject line under 60 characters
- [ ] CTA label uppercase and ends with →
- [ ] Plain text version matches HTML version content
- [ ] Correct register used: Brand Email or Personal Email
- [ ] Length within guidelines for this email type
- [ ] W08 review completed before first send
