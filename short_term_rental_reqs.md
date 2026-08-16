# Requirement: Add Short-Term Rental (Airbnb) Calculations

**Context:** The platform currently only calculates and displays long-term rental (monthly) figures. We need to add short-term rental (nightly/Airbnb-style) calculations alongside the existing long-term data. This affects two areas of the site: (1) the property overview page, and (2) the rental estimate calculator.

Long-term functionality and layout should not change. Short-term is a new, additive mode.

\---

## 1\. Property Overview Page

### 1.1 Toggle (top of page)

* Add a clearly visible toggle at the top of the property overview page, next to/near the existing filters or stat bar.
* Two states: **Long-Term (Monthly Rent)** and **Short-Term (Nightly Rate)**.
* Should follow the same visual pattern as the calculator toggle (see Section 2.1) — high-contrast, unambiguous which state is active. Not a subtle icon toggle; needs a label on both states at all times.
* Default state: Long-Term (current behavior).

### 1.2 Behavior when toggled to Long-Term (default)

* No change from current layout or data. Asking Price, Gross Yield, and Rental Estimate (monthly) display as they do today.

### 1.3 Behavior when toggled to Short-Term

On every property card in the grid/list:

* **Asking Price** — stays the same (property price doesn't change based on rental strategy).
* **Gross Yield** — recalculates using short-term rental income instead of long-term rent.
* **Rental Estimate** — changes from "€X/mo" to a nightly rate estimate, e.g. "€X/night".
* The top summary stat bar (Properties found / Avg Gross Yield / Avg Rental Estimate / Avg Price) should also recalculate based on the selected mode.

### 1.4 Property Detail Page

When a user clicks into a single property, replace the current single Asking Price / Gross Yield / Rental Estimate block with **two side-by-side sections**:

**Long-Term**

* Gross Yield
* Rental Estimate (monthly)

**Short-Term**

* Gross Yield
* Rental Estimate (nightly rate)
* **Occupancy % (estimated)** — new field, short-term only. Needed to make the short-term gross yield figure meaningful, since nightly rate alone doesn't reflect achievable annual income without an occupancy assumption.

Asking Price is shown once (not duplicated in both sections), since it's the same regardless of rental strategy.

\---

## 2\. Rental Estimate Calculator (Stage 1)

### 2.1 Toggle (top of calculator)

* Same toggle pattern as above: **Long-Term** / **Short-Term**, clearly labeled, positioned at the top of the calculator, above the form fields.
* Default state: Long-Term.

### 2.2 Long-Term Mode

* No changes to which questions display. All current Stage 1 fields remain exactly as they are today (Country, Region, Area type, Bedrooms, Property size, Year built, Property condition, Outdoor space, Energy label, Parking, Elevator).
* **Important:** the 4 fields listed in 2.3 below are collected regardless of which mode is active — see 2.4.

### 2.3 Short-Term Mode

* Show **all existing Long-Term Stage 1 fields**, unchanged, **plus** the following additional fields required specifically for short-term pricing:

|New field|Type|Options / notes|
|-|-|-|
|**Bathrooms**|Number input||
|**Max guests**|Number input||
|**Listing Type**|Dropdown, 3 options|Entire place / Private Room / Shared Room|
|**Short-Term License Status**|Dropdown, 3 options|Has License / Needs License / Unavailable in Zone|

No other fields should be added beyond these four — the short-term form should stay as close to the long-term form as possible, with only this minimal delta on top.

### 2.4 These 4 delta fields are always collected, regardless of active mode

This is a deliberate change from a strict "long-term asks X, short-term asks X+4" split. Reasoning: Short-Term's field set is a superset of Long-Term's — everything Long-Term needs, Short-Term also needs, plus these 4 extra fields. It is never the reverse. So if a user only fills in Long-Term mode, you're missing 4 fields the moment they (or the Investment Intelligence panel, see Section 7) need a Short-Term result. If they fill in Short-Term, Long-Term already has everything it needs.

**Implementation:** show the Bathrooms / Max Guests / Listing Type / License Status fields in Stage 1 **always**, independent of which mode toggle is active — not gated behind Short-Term selection. This is a one-time, small addition to the form (4 fields) that permanently removes the missing-data problem, and it means the mode toggle only ever controls *which results are displayed*, not *which questions are asked*. This is a meaningfully simpler mental model for the calculation layer — results are never conditional on which mode the user happened to have selected while filling out the form.

### **2.5 Short-Term Occupancy Estimation Model**

Importance — Critical Revenue Input



Occupancy is one of the two core variables driving Short-Term revenue:



Gross Booking Revenue =

Nightly Rate × Occupancy × 365



Because occupancy directly affects:



Annual rental revenue

Gross Yield

NOI

Net Annual Profit

ROI projections



this calculation must be configurable and data-driven.



The model should use property characteristics to adjust the city-level average occupancy.



2.5.1 Occupancy Formula



The occupancy calculation is:



Occupancy =

City Base Occupancy

× Zone Factor

× Property Condition Factor

× Guest Capacity Factor



Do not include seasonality in v1.



Reason:



Seasonal modelling requires additional market data.

It adds complexity to the calculation engine.

It introduces more assumptions and maintenance overhead.

The investment model requires an annual achievable occupancy estimate rather than monthly booking optimisation.



A future version may introduce seasonal adjustments once sufficient booking data exists.



2.5.2 City Base Occupancy



Configuration:



{

&#x20; "baseOccupancy": {

&#x20;   "lisbon": 0.74,

&#x20;   "porto": 0.71,

&#x20;   "braga": 0.63,

&#x20;   "faro": 0.69

&#x20; }

}



These values represent the average annual occupancy for a standard STR property in each market.



2.5.3 Zone Factor



Location remains a major driver of STR demand.



Configuration:



{

&#x20; "zone": {

&#x20;   "centre": 1.08,

&#x20;   "semi\_centre": 1.03,

&#x20;   "outside\_centre": 0.94

&#x20; }

}

2.5.4 Property Condition Factor



Property quality influences booking attractiveness and review potential.



Configuration:



{

&#x20; "propertyCondition": {

&#x20;   "high\_end": 1.10,

&#x20;   "premium": 1.07,

&#x20;   "good": 1.03,

&#x20;   "standard": 1.00,

&#x20;   "basic": 0.94,

&#x20;   "outdated": 0.88,

&#x20;   "in\_need\_of\_renovation": 0.78

&#x20; }

}

2.5.5 Guest Capacity Factor



Guest capacity should influence occupancy moderately.



Larger properties generally have a wider booking audience, but capacity should not overpower location or quality.



Configuration:



{

&#x20; "guestCapacity": {

&#x20;   "1": 0.95,

&#x20;   "2": 1.00,

&#x20;   "3": 1.02,

&#x20;   "4": 1.05,

&#x20;   "5": 1.06,

&#x20;   "6\_plus": 1.08

&#x20; }

}

2.5.6 Occupancy Cap



The final calculated occupancy must be capped:



Maximum Occupancy = 95%



Example:



Calculated occupancy:

101%



Displayed occupancy:

95%



This prevents unrealistic outputs.



2.5.7 Developer Logic

function calculateOccupancy({

&#x20; city,

&#x20; zone,

&#x20; condition,

&#x20; guestCapacity

}) {



&#x20; const base =

&#x20;   config.baseOccupancy\[city];



&#x20; const zoneFactor =

&#x20;   config.zone\[zone];



&#x20; const conditionFactor =

&#x20;   config.propertyCondition\[condition];



&#x20; const guestFactor =

&#x20;   config.guestCapacity\[guestCapacity];



&#x20; const occupancy =

&#x20;   base

&#x20;   \* zoneFactor

&#x20;   \* conditionFactor

&#x20;   \* guestFactor;



&#x20; return Math.min(occupancy, 0.95);

}

Example Calculation



Property:



Porto



Base occupancy:

71%



Zone:

Centre ×1.08



Condition:

High-end ×1.10



Guests:

4 ×1.05



Calculation:



71%

× 1.08

× 1.10

× 1.05



= 88.7%



Displayed:



Estimated Airbnb Occupancy



89%



#### 2.6 Short-Term Revenue Estimation Model

Purpose



Short-Term revenue estimation should be fully data-driven through a backend configuration file.



The system should not hardcode city rates, multipliers, or assumptions inside calculation logic.



All pricing assumptions should live in one JSON configuration file so new markets (e.g. Madrid, Valencia, Athens) can be added without code changes.



The revenue model consists of:



Base City Nightly Rate

× Listing Type Factor

× Bedroom Factor

× Bathroom Factor

× Property Size Factor

× Guest Capacity Factor

× Property Condition Factor

=

Estimated Nightly Rate



Estimated Nightly Rate

× Occupancy %

× 365

=

Gross Booking Revenue

2.6.1 Base City Nightly Rate



The calculation starts from the average nightly rate for a standard 1-bedroom apartment in the city centre.



Initial configuration:



{

&#x20; "baseRates": {

&#x20;   "lisbon": 145,

&#x20;   "porto": 110,

&#x20;   "braga": 82,

&#x20;   "faro": 125

&#x20; }

}



These values must remain configurable.



Future cities should only require adding a new city entry:



Example:



{

&#x20; "madrid": 160,

&#x20; "valencia": 125,

&#x20; "athens": 115

}

2.6.2 Listing Type Factor



Configuration:



{

&#x20; "listingType": {

&#x20;   "entire\_place": 1.00,

&#x20;   "private\_room": 0.62,

&#x20;   "shared\_room": 0.38

&#x20; }

}

2.6.3 Bedroom Factor



Configuration:



{

&#x20; "bedrooms": {

&#x20;   "0": 0.90,

&#x20;   "1": 1.00,

&#x20;   "2": 1.30,

&#x20;   "3": 1.55,

&#x20;   "4": 1.80,

&#x20;   "5\_plus": 2.10

&#x20; }

}

2.6.4 Bathroom Factor



Configuration:



{

&#x20; "bathrooms": {

&#x20;   "1": 1.00,

&#x20;   "1\_5": 1.05,

&#x20;   "2": 1.12,

&#x20;   "3": 1.20,

&#x20;   "4\_plus": 1.30

&#x20; }

}

2.6.5 Property Size Factor



Size should use range-based matching.



Configuration:



{

&#x20; "size": \[

&#x20;   {

&#x20;     "max": 35,

&#x20;     "factor": 0.88

&#x20;   },

&#x20;   {

&#x20;     "max": 50,

&#x20;     "factor": 0.95

&#x20;   },

&#x20;   {

&#x20;     "max": 70,

&#x20;     "factor": 1.00

&#x20;   },

&#x20;   {

&#x20;     "max": 100,

&#x20;     "factor": 1.10

&#x20;   },

&#x20;   {

&#x20;     "max": 140,

&#x20;     "factor": 1.20

&#x20;   },

&#x20;   {

&#x20;     "max": 999,

&#x20;     "factor": 1.35

&#x20;   }

&#x20; ]

}

2.6.6 Guest Capacity Factor



Configuration:



{

&#x20; "guestCapacity": {

&#x20;   "1": 0.95,

&#x20;   "2": 1.00,

&#x20;   "3": 1.05,

&#x20;   "4": 1.12,

&#x20;   "5": 1.18,

&#x20;   "6\_plus": 1.25

&#x20; }

}

2.6.7 Property Condition Factor



Use the same property condition classification system used elsewhere in the platform.



Configuration:



{

&#x20; "condition": {

&#x20;   "needs\_renovation": 0.80,

&#x20;   "fair": 0.90,

&#x20;   "good": 1.00,

&#x20;   "excellent": 1.10,

&#x20;   "luxury": 1.20

&#x20; }

}

2.6.8 Amenities Removed



Do not include an amenities multiplier in the Short-Term revenue calculation.



Reason:



Amenities should influence the property classification and condition assessment rather than directly multiplying revenue.



Including an amenities multiplier creates several problems:



Difficult to maintain consistent weighting.

Encourages double counting (e.g. luxury condition + premium amenities).

Makes the pricing model harder to explain to users.

Creates unreliable outputs when amenity data is incomplete.



The Short-Term revenue model should only use:



City

Listing Type

Bedrooms

Bathrooms

Size

Guest Capacity

Property Condition

2.6.9 Nightly Rate Calculation



Backend logic:



function calculateNightlyRate({

&#x20; city,

&#x20; listingType,

&#x20; bedrooms,

&#x20; bathrooms,

&#x20; size,

&#x20; guestCapacity,

&#x20; condition

}) {



&#x20; const baseRate =

&#x20;   config.baseRates\[city];



&#x20; const nightlyRate =

&#x20;   baseRate

&#x20;   \* config.listingType\[listingType]

&#x20;   \* config.bedrooms\[bedrooms]

&#x20;   \* config.bathrooms\[bathrooms]

&#x20;   \* getSizeFactor(size)

&#x20;   \* config.guestCapacity\[guestCapacity]

&#x20;   \* config.condition\[condition];



&#x20; return nightlyRate;

}

2.6.10 Revenue Calculation



Once the nightly rate is calculated, combine it with the occupancy model from Section 2.5.



Formula:



Gross Booking Revenue =

Nightly Rate × Occupancy % × 365



Monthly display:



Monthly Revenue =

Nightly Rate × 30 × Occupancy %



Annual display:



Annual Revenue =

Monthly Revenue × 12

2.6.11 Example Calculation (QA Reference)



Property:



City:

Braga



Listing Type:

Entire Place



Bedrooms:

2



Bathrooms:

2



Size:

85m²



Guests:

4



Condition:

Luxury



Calculation:



Base Rate

€82



Listing Type

×1.00



Bedrooms

×1.30



Bathrooms

×1.12



Size

×1.10



Guest Capacity

×1.12



Condition

×1.20



Estimated nightly rate:



≈ €157/night



Occupancy:



63%



Monthly revenue:



€157 × 30 × 0.63



≈ €2,970/month



Annual revenue:



≈ €35,600/year

\---

## 3\. Phase 2: Acquisition Costs \& IMT Logic

Phase 2 (Purchase Price / Renovation Costs / IMT Logic Decision — the screen showing Total Acquisition Costs and Gross Yield) currently only has one branch: "Are you going to rent out the property?" Yes/No. This needs to be expanded into a proper decision tree, because IMT (property transfer tax) in Portugal depends on **residency status** and **what the property will be used for**, and those two things produce genuinely different tax tables — not just different numbers on the same table.

This section replaces the current single Yes/No toggle with the full logic below.

### 3.1 Question order

**Question 1 (always asked first, both Long-Term and Short-Term modes):**

> "Are you a Portuguese tax resident?"

* **No** → skip straight to the flat non-resident rate. Do not ask Question 2 — rental status doesn't change this rate.
* **Yes** → continue to Question 2.

**Question 2 (resident branch only):**

> "Are you going to rent out the property?"

* **No** → Primary Residence (HPP) table.
* **Yes** → Rental table, and **this is where Long-Term and Short-Term diverge** (see 3.3 below). Which sub-path applies is determined by the page's existing Long-Term/Short-Term toggle — do not ask a third question here.

**Question 3 (Short-Term + renting out only):**

> "Will this also be your primary residence?"

* **No** → no additional warning.
* **Yes** → show the clawback warning in 3.3.

### 3.2 Non-resident branch (applies identically to Long-Term and Short-Term)

Show this immediately if Question 1 = No. No further questions needed.

**Rate:** Flat 7.5% on the full purchase price. No brackets, no deduction.

**Info box copy:**

> "Non-residents pay a fixed 7.5% IMT rate on residential property, regardless of price or rental strategy (Decree-Law 97/2026, effective 25 May 2026). This may be refundable if you become a tax resident within 2 years, or if the property is leased under the moderate-rent regime."

### 3.3 Resident branch — Long-Term vs Short-Term difference

This is the core of what changes between modes in Phase 2:

||**Long-Term mode**|**Short-Term mode**|
|-|-|-|
|Exemption checkboxes shown?|**Yes** — existing moderate-rent exemption checkboxes stay (rent ≤ €2,300/mo, 36-month contract, listed within 6 months)|**No** — remove these checkboxes entirely. They require a long-term habitational lease and cannot legally apply to Alojamento Local|
|If exemption conditions met|Reduced/exempt IMT under moderate-rent regime|Not applicable|
|If exemption conditions not met|Standard "habitação secundária" (second home/rental) progressive table|Standard "habitação secundária" progressive table — shown directly, no exemption path offered at all|
|Extra question|None|"Will this also be your primary residence?" (Question 3 above)|
|Extra warning|None|If Question 3 = Yes: clawback warning (see below)|

**Moderate-rent exemption info box (Long-Term, when eligible):**

> "Moderate-rent exemption applied — reduced or waived IMT in exchange for renting below market rate under an 8-year commitment."

**Primary-residence + short-term clawback warning (Short-Term, when Question 3 = Yes):**

> "Using part of your primary residence for short-term rental (Alojamento Local) within 6 years of purchase causes any reduced/exempt IMT rate to lapse, and the difference becomes payable retroactively — even if you continue living there. Confirm with a Portuguese accountant or notary before proceeding."

### 3.4 IMT bracket tables (2026, Continental Portugal)

Use these tables for the calculation. Formula: `IMT = (taxable base × rate) − deduction`. Taxable base = the higher of purchase price or VPT (fiscal value).

**Table A — Primary residence (HPP)**

|Bracket (€)|Rate|Deduction|
|-|-|-|
|Up to 106,346|0%|€0|
|106,346 – 145,470|2%|€2,126.92|
|145,470 – 198,347|5%|€6,491.02|
|198,347 – 330,539|7%|€10,457.96|
|330,539 – 660,982|8%|€13,763.35|
|660,982 – 1,150,853|6% flat|—|
|Above 1,150,853|7.5% flat|—|

**Table B — Second home / rental / investment ("habitação secundária") — applies to both Long-Term and Short-Term resident-renter branches**

|Bracket (€)|Rate|Deduction|
|-|-|-|
|Up to 106,346|1%|€0|
|106,346 – 145,470|2%|€1,063.46|
|145,470 – 198,347|5%|€5,427.56|
|198,347 – 330,539|7%|€9,394.50|
|330,539 – 633,931|8%|€12,699.89|
|633,931 – 1,150,853|6% flat|—|
|Above 1,150,853|7.5% flat|—|

**Table C — Non-resident**

Flat 7.5% on full taxable base. No brackets, no deduction.

*Note: Azores/Madeira use the same rates but with bracket thresholds 25% higher. Not required for v1 unless the platform supports properties outside mainland Portugal — flag to confirm scope.*

### 3.5 Company purchases (flag for future scope, not required for v1)

If the platform ever supports purchasing through a company entity, note that companies use their own rate table (no primary-residence option), and companies based in blacklisted tax-haven jurisdictions pay a flat 10%. Not in scope for this iteration — noted here so it isn't a surprise later.

\---

## 4\. Phase 3: Net Cash Flow Analysis — Short-Term Mode

Phase 3 (the "Net Cash Flow Analysis" screen — Yearly Rent, Operating Expenses breakdown, NOI, and the Net Annual Profit banner) needs a distinct short-term version. The revenue mechanic and several cost categories are structurally different from long-term, not just different percentages on the same template.

### 4.1 Revenue line — replaces "Yearly Rent"

* **Long-Term:** "Yearly Rent" — a fixed annual figure.
* **Short-Term:** "Gross Booking Revenue" — calculated, not fixed:

`Gross Booking Revenue = Nightly Rate × Occupancy % × 365`

* Nightly rate comes from Stage 1. Occupancy % comes from the backend location-based estimate (see Section 1's requirements), and should be editable by the user.
* Display the formula inline under the total (e.g. "€130/night × 62% occupancy × 365") so the number is never opaque to the user.

### 4.2 No separate "Vacancy" line in Short-Term mode

Long-Term mode has a "Vacancy" deduction as a separate expense line. **Do not replicate this in Short-Term mode** — occupancy is already priced into the Gross Booking Revenue calculation above (4.1), so a second vacancy deduction would double-count the same loss of income. This is a deliberate omission, not a gap.

### 4.3 Management model toggle — new control, Short-Term only

Add a toggle above the operating expenses breakdown:

> \*\*Self-managed\*\* / \*\*Professional management\*\*

* This single toggle has the largest impact on the entire expense total, so it needs to be explicit and easy to switch, not buried in an assumption.
* **Self-managed:** Property management line = €0.
* **Professional management:** Property management line = 20% of Gross Booking Revenue (see table below for where this sits in the full breakdown).
* Toggling this control should live-recalculate every downstream figure (total operating expenses, NOI, Net Annual Profit, Monthly Profit).
* Default state: Professional management (more realistic default for an investor audience unlikely to self-manage a short-term rental, especially non-resident buyers).

### 4.4 Operating expenses breakdown — Short-Term

Replace the Long-Term expense list (Vacancy, Maintenance, CapEx, Insurance, Property Tax, Condo Fees, Management, Admin) with the following for Short-Term mode:

|Line item|% of Gross Booking Revenue|Notes|
|-|-|-|
|Platform fees|3%|New line — Airbnb/OTA host service fee. Does not exist in Long-Term.|
|Cleaning \& turnover|6%|New line — recurring per-stay cost, not a one-time item.|
|Supplies|1.5%|New line — toiletries, welcome items, restocked regularly.|
|Utilities|6%|New line — host pays in Short-Term (tenant pays in Long-Term, which is why this line doesn't exist there).|
|Maintenance|11%|Higher than Long-Term's 10% — faster wear from frequent guest turnover.|
|Property management|0% (Self-managed) or 20% (Professional)|Controlled by the toggle in 4.3.|
|Insurance|2%|Slightly higher than Long-Term — short-term/holiday-let policies cost more than standard landlord insurance.|
|CapEx reserve|6%|Higher than Long-Term's 5% — furnished units see faster wear from turnover.|
|Property tax (IMI)|Fixed € amount, not a %|See 4.5 below. Same value as Long-Term — unaffected by rental strategy.|
|Condo fees|Fixed € amount, not a %|See 4.6 below. Same value as Long-Term — unaffected by rental strategy.|
|Admin|1.5%|New line — AL license renewal, STR-specific accounting/VAT reporting.|

**Show/Hide breakdown** button behavior should match the existing Long-Term pattern (collapsible list under the Operating Expenses total).

### 4.5 Property tax (IMI) — calculation detail

IMI is calculated on the property's **VPT (fiscal/taxable value)**, not the purchase price — and VPT is typically **70–85% of purchase price**, not equal to it. This applies identically regardless of rental strategy, so the same calculation should feed both the Long-Term and Short-Term cash flow cards.

**Formula:** `IMI = VPT × Municipal Rate`

* Municipal rate ranges 0.3%–0.45% depending on the city/municipality (e.g. Porto = 0.324%, most municipalities = 0.3% minimum). This should be looked up per Region/Area selected in Stage 1, not hardcoded.
* If the user doesn't have their property's actual VPT, default to **VPT ≈ 80% of purchase price** as the working assumption, with a note: *"Estimated — actual IMI is based on the property's fiscal value (VPT), which is often lower than purchase price."*
* Optional enhancement (not required for v1): add an editable "VPT (if known)" field so a user with their Caderneta Predial can override the estimate with the real figure.

**Worked example (for QA reference):** €400,000 property in Porto (rate 0.324%) → estimated VPT ≈ €320,000 → IMI ≈ **€1,037/year**. Range shown to user could be €950–1,300 depending on actual VPT.

### 4.6 Condo fees — what it is and default range

Condo fees (quota de condomínio) only apply to properties within a shared building (apartments/developments with common areas) — not standalone houses. It covers upkeep of shared areas: stairwells, elevator maintenance, building insurance, exterior maintenance, and reserve fund contributions.

* This is a **fixed cost tied to ownership**, unaffected by whether the unit is rented long-term, short-term, or vacant — same value should be used in both Phase 3 cards.
* **Default assumption if not user-provided:** €50–150/month (€600–1,800/year), varying by building age and amenity level. Older buildings without elevators sit at the low end; newer developments with concierge/pool/gym sit at the high end.
* If Stage 1 doesn't already capture building type/age, consider using "Year built" (already an existing field) as a rough proxy for where in that range to default.

\---

## 5\. Stage 4: Capital Return (ROI) — Short-Term Mode

The Stage 4 layout itself (Investment Summary card, "Build Your Return" card with the three toggles and appreciation slider, ring chart, bottom banner) does **not** need structural changes for Short-Term mode. Two of the three inputs feeding it, however, need to be verified as mode-aware rather than reused as-is — this is a data-binding check for your developer, not a redesign.

### 5.1 Total Project Cost must reflect the active mode's IMT result

Total Project Cost on this screen is pulled from Phase 2 (Section 3 of this document), and Phase 2's IMT calculation branches by residency, rental status, and — critically — whether the moderate-rent exemption is available. That exemption path only exists in Long-Term mode; Short-Term mode always uses the standard "habitação secundária" table (see 3.3).

**This means Total Project Cost can legitimately be a different number in Long-Term vs. Short-Term mode for the exact same property** — not just Gross Yield or Rental Estimate. Confirm that Stage 4 pulls Total Project Cost live from whichever Phase 2 result matches the currently active toggle state, rather than caching or reusing the Long-Term figure for both modes. A mismatch here would silently produce a wrong ROI on the ring chart, without anything on screen looking obviously broken.

### 5.2 Mortgage Loan assumptions should not be reused unchanged between modes

Portuguese banks apply more conservative financing terms to rental-purpose properties than to owner-occupied purchases, and Short-Term/Alojamento Local purpose loans specifically tend to see tighter terms than standard second-home/rental loans:

* Second-home/rental financing generally comes with a higher spread (greater perceived default risk) and a lower loan-to-value ratio than a primary-residence mortgage.
* Properties intended for Alojamento Local can be financed, but banks tend to apply stricter conditions — shorter terms or higher spreads — than for traditional long-term rental.
* Investment/non-primary-residence financing broadly comes with less favorable terms overall: larger required down payment, shorter loan terms, higher interest rates.

**Recommendation:** don't hardcode a specific LTV adjustment without a real bank quote to back it, but flag this explicitly to whoever builds the mortgage assumption logic — the Mortgage Loan figure (and therefore "My Cash Invested" and the ROI ring) should not silently reuse the Long-Term mortgage assumption for Short-Term mode. Consider a small inline note in Short-Term mode near the Mortgage Loan field: *"Loan terms may be more conservative for short-term rental/Alojamento Local purpose financing."*

### 5.3 What does NOT need to change

* **Include Appreciation** toggle/slider — property appreciation is a market-level assumption independent of rental strategy. No change.
* **Include Loan Paydown** toggle — pure mortgage amortization mechanics once loan terms are set per 5.2. No structural change needed.
* **Include Cash Flow** toggle — same toggle, same mechanic; it should simply pull from the Short-Term NOI (Section 4.4 of this document) instead of the Long-Term NOI when Short-Term mode is active. No new logic required beyond pointing it at the right number.
* The overall card layout, ring chart, and bottom banner — no redesign needed.

\---

## Summary of what needs backend/calculation support

1. A short-term nightly rate estimation model (separate from the existing long-term monthly rent model), taking the long-term Stage 1 inputs plus the four new short-term fields above.
2. A short-term gross yield calculation: `(nightly rate × estimated occupancy % × 365) / asking price`.
3. An occupancy % estimate per property/area (can start as a location-based average, refined later).
4. Toggle state should be a simple UI-level switch — no need to persist across sessions initially, but should be consistent between the overview page and detail page if a user navigates between them in the same session (nice-to-have, not a blocker for v1).
5. IMT calculation logic per Section 3 — residency status and rental status both need to feed into which bracket table is used, and the Long-Term/Short-Term toggle needs to determine whether the moderate-rent exemption path is offered at all.
6. A short-term operating expense model per Section 4 — percentage-based lines calculated off Gross Booking Revenue, a working Self-managed/Professional management toggle that live-recalculates NOI and profit, and an IMI calculation that looks up the municipal rate by Region and estimates VPT from purchase price when the real VPT isn't provided.
7. Stage 4 (ROI) must bind Total Project Cost and Mortgage Loan to the currently active mode's Phase 2 result, per Section 5 — these are not safe to reuse unchanged between Long-Term and Short-Term.
8. Stage 5 (Projection) must bind Year 0 Principal/Invested and the Monthly Loan Payment default to the currently active mode's Stage 4 result, per Section 6, and must show the AL regulatory-risk disclaimer only in Short-Term mode.

\---

## 6\. Stage 5: Long-Term Projection — Short-Term Mode

Like Stage 4, the Stage 5 layout (time-horizon tabs, assumption toggles, chart, year-by-year table, bottom stat cards) does **not** need a redesign for Short-Term mode. What's needed is: (a) a few label/data-source swaps, and (b) one genuinely new disclaimer that has no Long-Term equivalent.

### 6.1 Label and data-source changes

|Element|Long-Term (current)|Short-Term|
|-|-|-|
|"Include Cash Flow" subtitle|"From rental income"|"From short-term rental income (after expenses)" — pulls from Short-Term NOI (Section 4.4), not Long-Term rent|
|"Cash Flow (Rent)" legend item (About panel)|—|Relabel to "Cash Flow (Short-Term Income)"|
|Year 0 Principal/Invested (chart + table)|Pulled from Stage 4 "My Cash Invested"|Must pull from the **Short-Term** Stage 4 result — see 5.1, Total Project Cost can legitimately differ by mode, so this baseline must not default to a cached Long-Term figure|
|Monthly Loan Payment slider default|Long-Term mortgage assumption|Short-Term mortgage assumption (see 5.2) — STR-purpose financing tends to carry less favorable terms|

### 6.2 New disclaimer — regulatory risk over the projection horizon (Short-Term only, no Long-Term equivalent)

A 10–35 year Short-Term projection implicitly assumes today's short-term rental licensing regime (Alojamento Local) holds unchanged for the full horizon. This is a materially different assumption than long-term rent growth, because several Portuguese municipalities have already suspended new AL registrations in high-pressure zones, and existing licenses can be subject to review. This should not be modeled quantitatively (there's no reliable way to price regulatory-change probability into the chart) — it should be surfaced as a disclaimer.

**Placement:** same visual treatment as the existing "All values are in today's money (inflation-adjusted)" note at the bottom of the page — add a second line directly below it, shown only in Short-Term mode.

**Copy:**

> "Long-range projections assume current short-term rental regulations remain unchanged. Alojamento Local licensing rules have changed in recent years and may change again."

### 6.3 Future refinement — not required for v1

Long-Term cash flow is applied as a flat annual figure across the whole projection. Short-term income realistically ramps up in year 1–2 as a new listing builds reviews and search ranking before stabilizing — applying a flat figure from Year 1 onward slightly overstates early-year returns. Worth noting for a future iteration (e.g. a simple ramp-up curve for the first 1-2 years), but not a blocker for this pass.

### 6.4 What does NOT need to change

* Time-horizon tabs (10Y/15Y/20Y/25Y/35Y), Include Appreciation toggle/slider, chart structure, year-by-year table columns, and the three bottom stat cards (Total Profit, Average Annual Return, Total Return Multiple) — no structural change needed, only the underlying data source swaps in 6.1.

\---

## 7\. "Investment Intelligence" Landing Page Panel

This is the marketing/landing page component (headline: "Master your investment horizon") showing a live sample of Phase 1–5 outputs. It currently only shows Long-Term figures. This needs a Short-Term view too, plus a fallback strategy for the underlying data problem.

### 7.1 Add the same Long-Term/Short-Term toggle used elsewhere

* Place a small toggle at the top of the panel, near the "V4.2 Engine" badge — same visual pattern as Stage 1 and the property overview page toggles, for consistency.
* Toggling swaps all five phase values (Rent Estimate → Nightly Rate, Yield \& Costs, Net Profit, Cash-on-Cash ROI, Avg Annual Return) to their Short-Term equivalents.
* Do **not** show both values side-by-side in the same card — this panel's job is to be scannable at a glance; doubling every number undercuts that.

### 7.2 Auto-cycle behavior (landing page only, not the operational tool)

* Since this is a passive marketing panel rather than a task the user is actively performing, add a slow auto-cycle: show Long-Term for \~4–5 seconds, cross-fade to Short-Term, hold, cross-fade back, on a loop.
* The toggle remains fully manually operable at any time — interacting with it should pause the auto-cycle (don't fight the user's manual selection).
* This only applies to this landing page panel. Every other toggle in this document (Stage 1, property overview, Stages 2–5) stays static/manual — no auto-cycling on operational screens.

### 7.3 Data source problem this panel exposes — and the general fix

This panel needs both Long-Term and Short-Term numbers available at the same time, which surfaces a broader question: what happens if a user (or an existing property in the database) doesn't have all fields filled in for both modes?

**For users actively filling out Stage 1 (the calculator):** solved by Section 2.4 above — the 4 short-term delta fields are always collected regardless of active mode, so both Long-Term and Short-Term results are always computable once Stage 1 is submitted, with no missing data and no need for estimation.

**For properties already in the platform's database (Section 1, property overview grid):** this can't be solved by re-collecting data in real time — these are existing listings, not a form a user is actively filling in. Use fallback defaults, clearly flagged as estimated:

|Missing field|Fallback default|Display treatment|
|-|-|-|
|Bathrooms|1 for bedrooms ≤ 2, otherwise bedrooms − 1|Label as "Estimated"|
|Max guests|(bedrooms × 2) + 1|Label as "Estimated"|
|Listing type|"Entire place" (most common case)|Label as "Estimated"|
|Short-Term License Status|**Do not default to a specific answer**|Show as its own distinct state: "Unknown — not yet verified"|

**Important:** License Status must never silently default to "Has License" or any other specific answer — of all four fields, this is the one where a wrong guess carries real legal/financial risk for an investor relying on the number. Treat "Unknown" as a genuine fourth state on the grid, visually distinct from the three real answer options, rather than picking one silently.

\---

## Out of scope for this iteration

* Amenity-level detail (AC, pool, workspace, etc.) — not required for the v1 short-term estimate.
* Property style, interior design tier, management type, minimum stay, instant book — considered secondary and not included in this pass.
* Azores/Madeira bracket adjustments (25% higher thresholds) — flag to confirm if in scope.
* Company/entity purchases and blacklisted-jurisdiction rates — flag to confirm if in scope.
* Income tax treatment of short-term rental income (VAT threshold, simplified vs. organized accounting regime) — this is separate from the acquisition-cost/IMT panel and would need its own section of the app further down the financial flow. Noted here so it isn't lost, not designed in this pass.

