/**
 * Component 31: ROI Calculator Widget
 *
 * Interactive HTML widget for practitioners to calculate time saved,
 * cost per patient, payback period, and annual efficiency gains.
 * Assumes VitalMatrix assessment = 15 min vs 45-60 min manual.
 *
 * VitalMatrix Content Studio — Web Package
 */

import { VM_BRAND } from './brand-config';

// --- Types ---

export interface RoiInput {
  patientsPerMonth: number;
  currentMinutesPerAssessment: number;
  monthlyRate: number;
}

export interface RoiResult {
  timeSavedPerMonth: number;      // minutes saved per month
  costPerPatient: number;         // GBP per patient per month
  paybackVisits: number;          // visits needed to break even on subscription
  annualTimeSaved: number;        // hours saved per year
  efficiencyGain: number;         // percentage improvement
}

// --- Constants ---

// UNVERIFIED ASSUMPTION: These time figures are estimated, not measured.
// Requires validation from first 50 patient assessments before external use.

/** VitalMatrix-assisted assessment time in minutes */
const VM_ASSESSMENT_MINUTES = 15;

/** Estimated practitioner hourly rate for time-value calculation (GBP) */
const PRACTITIONER_HOURLY_RATE = 120;

// --- Functions ---

/**
 * Calculates ROI metrics for a practitioner considering VitalMatrix adoption.
 *
 * Core assumption: VitalMatrix reduces assessment time to 15 minutes.
 * Manual assessments typically run 45-60 minutes.
 */
export function calculateRoi(input: RoiInput): RoiResult {
  const { patientsPerMonth, currentMinutesPerAssessment, monthlyRate } = input;

  // Minutes saved per patient
  const minutesSavedPerPatient = Math.max(0, currentMinutesPerAssessment - VM_ASSESSMENT_MINUTES);

  // Total minutes saved per month
  const timeSavedPerMonth = minutesSavedPerPatient * patientsPerMonth;

  // Cost per patient
  const costPerPatient = patientsPerMonth > 0
    ? monthlyRate / patientsPerMonth
    : monthlyRate;

  // Value of time saved per patient (in GBP)
  const valueSavedPerPatient = (minutesSavedPerPatient / 60) * PRACTITIONER_HOURLY_RATE;

  // Payback: how many visits until time-value savings cover the monthly fee
  const paybackVisits = valueSavedPerPatient > 0
    ? Math.ceil(monthlyRate / valueSavedPerPatient)
    : Infinity;

  // Annual time saved in hours
  const annualTimeSaved = (timeSavedPerMonth * 12) / 60;

  // Efficiency gain as percentage
  const efficiencyGain = currentMinutesPerAssessment > 0
    ? Math.round((minutesSavedPerPatient / currentMinutesPerAssessment) * 100)
    : 0;

  return {
    timeSavedPerMonth,
    costPerPatient: Math.round(costPerPatient * 100) / 100,
    paybackVisits,
    annualTimeSaved: Math.round(annualTimeSaved * 10) / 10,
    efficiencyGain,
  };
}

/**
 * Generates a complete, self-contained HTML page with an interactive
 * ROI calculator styled in the VitalMatrix design system.
 *
 * Prussian Blue background, Gold accents, Cormorant Garamond headings,
 * Outfit body text, DM Mono for data values.
 */
export function generateRoiWidgetHtml(): string {
  const { colours, fonts, credentials, platform, regulatoryFooter, tmFooter } = VM_BRAND;

  return `<!DOCTYPE html>
<html lang="en-GB">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>ROI Calculator | VitalMatrix</title>
  <style>
    :root {
      --vm-prussian-blue: ${colours.prussianBlue};
      --vm-charcoal: ${colours.charcoal};
      --vm-deep-teal: ${colours.deepTeal};
      --vm-gold: ${colours.gold};
      --vm-teal: ${colours.teal};
      --vm-white: ${colours.white};
      --vm-font-heading: '${fonts.heading}', serif;
      --vm-font-body: '${fonts.body}', sans-serif;
      --vm-font-data: '${fonts.data}', monospace;
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      background-color: var(--vm-prussian-blue);
      color: var(--vm-white);
      font-family: var(--vm-font-body);
      font-size: 16px;
      line-height: 1.6;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 2rem 1rem;
    }

    h1, h2, h3 {
      font-family: var(--vm-font-heading);
      font-weight: 600;
      color: var(--vm-gold);
    }

    h1 { font-size: 2.4rem; margin-bottom: 0.5rem; }
    h2 { font-size: 1.6rem; margin-bottom: 1rem; }

    .vm-container {
      max-width: 720px;
      width: 100%;
    }

    .vm-subtitle {
      font-size: 1rem;
      opacity: 0.8;
      margin-bottom: 2rem;
    }

    .vm-card {
      background-color: var(--vm-charcoal);
      border: 1px solid var(--vm-deep-teal);
      border-radius: 8px;
      padding: 2rem;
      margin-bottom: 1.5rem;
    }

    .vm-input-group {
      margin-bottom: 1.5rem;
    }

    .vm-input-group label {
      display: block;
      font-family: var(--vm-font-body);
      font-size: 0.9rem;
      margin-bottom: 0.4rem;
      color: var(--vm-gold);
      font-weight: 500;
    }

    .vm-input-group input,
    .vm-input-group select {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 1px solid var(--vm-deep-teal);
      border-radius: 4px;
      background-color: var(--vm-prussian-blue);
      color: var(--vm-white);
      font-family: var(--vm-font-data);
      font-size: 1rem;
    }

    .vm-input-group input:focus,
    .vm-input-group select:focus {
      outline: none;
      border-color: var(--vm-gold);
    }

    .vm-input-group .vm-hint {
      font-size: 0.8rem;
      opacity: 0.6;
      margin-top: 0.3rem;
    }

    .vm-btn {
      display: inline-block;
      padding: 0.85rem 2rem;
      background-color: var(--vm-gold);
      color: var(--vm-prussian-blue);
      font-family: var(--vm-font-body);
      font-weight: 600;
      font-size: 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      width: 100%;
      transition: opacity 0.2s;
    }

    .vm-btn:hover { opacity: 0.9; }

    .vm-results {
      display: none;
    }

    .vm-results.visible {
      display: block;
    }

    .vm-metric {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      padding: 1rem 0;
      border-bottom: 1px solid rgba(201, 168, 76, 0.15);
    }

    .vm-metric:last-child { border-bottom: none; }

    .vm-metric-label {
      font-family: var(--vm-font-body);
      font-size: 0.95rem;
    }

    .vm-metric-value {
      font-family: var(--vm-font-data);
      font-size: 1.3rem;
      color: var(--vm-gold);
      font-weight: 600;
    }

    .vm-footer {
      margin-top: 2rem;
      font-size: 0.7rem;
      opacity: 0.5;
      text-align: centre;
      max-width: 720px;
      line-height: 1.4;
    }

    .vm-assumptions {
      font-size: 0.8rem;
      opacity: 0.6;
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid rgba(201, 168, 76, 0.1);
    }

    .vm-highlight {
      background: linear-gradient(135deg, var(--vm-deep-teal), var(--vm-charcoal));
      border: 1px solid var(--vm-gold);
      border-radius: 8px;
      padding: 1.5rem 2rem;
      margin-top: 1.5rem;
      text-align: center;
    }

    .vm-highlight-value {
      font-family: var(--vm-font-data);
      font-size: 2.2rem;
      color: var(--vm-gold);
      font-weight: 700;
    }

    .vm-highlight-label {
      font-family: var(--vm-font-body);
      font-size: 0.9rem;
      margin-top: 0.3rem;
    }
  </style>
</head>
<body>
  <div class="vm-container">
    <h1>ROI Calculator</h1>
    <p class="vm-subtitle">See how VitalMatrix saves time and reduces cost per patient assessment.</p>

    <div class="vm-card">
      <h2>Your Practice</h2>

      <div class="vm-input-group">
        <label for="patients">Patients per month</label>
        <input type="number" id="patients" min="1" max="500" value="40" />
        <p class="vm-hint">How many patients you assess each month</p>
      </div>

      <div class="vm-input-group">
        <label for="minutes">Current minutes per assessment</label>
        <input type="number" id="minutes" min="15" max="120" value="45" />
        <p class="vm-hint">Typical manual functional medicine assessment: 45-60 minutes</p>
      </div>

      <div class="vm-input-group">
        <label for="rate">Monthly subscription rate</label>
        <select id="rate">
          <option value="${VM_BRAND.pricing.foundingMonthly}">GBP ${VM_BRAND.pricing.foundingMonthly}/month (Founding Cohort Rate)</option>
          <option value="${VM_BRAND.pricing.standardRate}">GBP ${VM_BRAND.pricing.standardRate}/month (Standard Rate, month ${VM_BRAND.pricing.foundingFixedMonths + 1}+)</option>
        </select>
        <p class="vm-hint">Founding cohort pricing with ${VM_BRAND.pricing.guarantee}</p>
      </div>

      <button class="vm-btn" onclick="calculate()">Calculate ROI</button>
    </div>

    <div class="vm-results" id="results">
      <div class="vm-card">
        <h2>Your Results</h2>

        <div class="vm-metric">
          <span class="vm-metric-label">Time saved per month</span>
          <span class="vm-metric-value" id="r-time-month">--</span>
        </div>

        <div class="vm-metric">
          <span class="vm-metric-label">Cost per patient</span>
          <span class="vm-metric-value" id="r-cost-patient">--</span>
        </div>

        <div class="vm-metric">
          <span class="vm-metric-label">Payback in visits</span>
          <span class="vm-metric-value" id="r-payback">--</span>
        </div>

        <div class="vm-metric">
          <span class="vm-metric-label">Annual time saved</span>
          <span class="vm-metric-value" id="r-annual">--</span>
        </div>

        <div class="vm-metric">
          <span class="vm-metric-label">Efficiency gain</span>
          <span class="vm-metric-value" id="r-efficiency">--</span>
        </div>
      </div>

      <div class="vm-highlight">
        <div class="vm-highlight-value" id="r-headline">--</div>
        <div class="vm-highlight-label">hours returned to your practice each year</div>
      </div>

      <div class="vm-assumptions">
        <strong>Assumptions:</strong> VitalMatrix-assisted assessment time = 15 minutes.
        Practitioner time valued at GBP 120/hour for payback calculation.
        Actual savings depend on practice workflow and patient complexity.
        <br /><br />
        <strong>UNVERIFIED:</strong> Time figures (15 min VM vs 45-60 min manual) are estimated, not measured.
        These projections require validation from the first 50 patient assessments before external use.
      </div>
    </div>

    <div class="vm-footer">
      <p>${credentials.name}, ${credentials.qualifications} | ${credentials.title}, ${credentials.company}</p>
      <p>${platform.descriptor} | ${platform.ico}</p>
      <p>${regulatoryFooter}</p>
      <p style="margin-top: 0.5rem;">${tmFooter}</p>
    </div>
  </div>

  <script>
    function calculate() {
      var patients = parseInt(document.getElementById('patients').value) || 0;
      var minutes = parseInt(document.getElementById('minutes').value) || 0;
      var rate = parseInt(document.getElementById('rate').value);

      var vmMinutes = 15;
      var hourlyRate = 120;
      var savedPerPatient = Math.max(0, minutes - vmMinutes);
      var timeSavedMonth = savedPerPatient * patients;
      var costPerPatient = patients > 0 ? (rate / patients) : rate;
      var valueSavedPerPatient = (savedPerPatient / 60) * hourlyRate;
      var payback = valueSavedPerPatient > 0 ? Math.ceil(rate / valueSavedPerPatient) : 999;
      var annualHours = (timeSavedMonth * 12) / 60;
      var efficiency = minutes > 0 ? Math.round((savedPerPatient / minutes) * 100) : 0;

      document.getElementById('r-time-month').textContent = timeSavedMonth + ' min';
      document.getElementById('r-cost-patient').textContent = 'GBP ' + costPerPatient.toFixed(2);
      document.getElementById('r-payback').textContent = payback + ' visits';
      document.getElementById('r-annual').textContent = annualHours.toFixed(1) + ' hours';
      document.getElementById('r-efficiency').textContent = efficiency + '%';
      document.getElementById('r-headline').textContent = annualHours.toFixed(1);

      document.getElementById('results').classList.add('visible');
    }
  </script>
</body>
</html>`;
}
