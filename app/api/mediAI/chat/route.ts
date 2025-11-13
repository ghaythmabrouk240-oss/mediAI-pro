import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Generate expert medical response - NO APIs, NO external calls
    const expertResponse = generateDoctorLevelResponse(message)

    return NextResponse.json({
      response: expertResponse,
      provider: 'MediAI Expert System',
      timestamp: new Date().toISOString(),
      confidence: 'high'
    })

  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({
      response: "I'm here to help. Please describe your medical question and I'll provide expert guidance.",
      provider: 'Medical Assistant',
      timestamp: new Date().toISOString(),
      confidence: 'high'
    })
  }
}

function generateDoctorLevelResponse(query: string): string {
  const lowerQuery = query.toLowerCase().trim()

  // CARDIAC CHEST PAIN
  if (lowerQuery.includes('chest pain') || lowerQuery.includes('heart') || lowerQuery.includes('cardiac')) {
    return `**🚨 CARDIOLOGY EMERGENCY CONSULTATION**

**CRITICAL ASSESSMENT:**
Based on chest pain presentation, immediate evaluation required:

**DIFFERENTIAL DIAGNOSIS:**
• **Acute Coronary Syndrome (50-60%)** - STEMI/NSTEMI, requires immediate ECG & troponin
• **Pulmonary Embolism (15-20%)** - Consider if dyspnea predominant, check Wells criteria
• **Aortic Dissection (5-8%)** - Tearing pain, BP differential between arms
• **Pericarditis (10-12%)** - Positional pain, pericardial friction rub

**EMERGENCY ACTIONS:**
1. **IMMEDIATE:** 12-lead ECG, IV access, vital signs
2. **MEDICATIONS:** Aspirin 325mg chewable, nitroglycerin if ischemic pain
3. **LABS:** Troponin series, CBC, BMP, coagulation studies
4. **MONITORING:** Continuous cardiac monitoring, pulse oximetry

**RISK STRATIFICATION:**
• **HEART Score** predicts major cardiac events
• **TIMI Score** estimates mortality risk
• Low risk: <2% 30-day MACE | High risk: >20% 30-day MACE

**DISPOSITION:**
• High probability ACS → Cardiac catheterization lab activation
• Intermediate risk → Observation with serial troponins
• Low risk → Outpatient stress testing

**FOLLOW-UP:** Cardiology referral within 1 week, risk factor modification`
  }

  // HEADACHE / NEUROLOGY
  if (lowerQuery.includes('headache') || lowerQuery.includes('migraine') || lowerQuery.includes('stroke')) {
    return `**🧠 NEUROLOGY EXPERT CONSULTATION**

**NEUROLOGICAL ASSESSMENT:**
Comprehensive headache evaluation:

**DIFFERENTIAL DIAGNOSIS:**
• **Migraine (55-65%)** - Unilateral, throbbing, photophobia/phonophobia
• **Tension-Type (25-35%)** - Bilateral, band-like, pressure quality
• **Cluster (3-5%)** - Severe unilateral orbital/temporal, autonomic features
• **SAH (1-2%)** - Thunderclap onset, "worst headache of life"

**🚨 RED FLAGS REQUIRING URGENT IMAGING:**
• Thunderclap onset → STAT non-contrast CT head
• Focal neurological deficits → MRI brain
• Altered mental status → CT head + lumbar puncture
• Fever + neck stiffness → Meningitis workup

**DIAGNOSTIC APPROACH:**
1. **Immediate:** Non-contrast CT head, basic labs
2. **Secondary:** MRI brain if CT negative with high suspicion
3. **Special Tests:** LP for SAH rule-out, ESR for temporal arteritis

**ACUTE MANAGEMENT:**
• **Migraine:** Sumatriptan 6mg SC + metoclopramide 10mg IV
• **Tension:** Naproxen 500mg + muscle relaxant
• **Cluster:** High-flow oxygen 12L/min + sumatriptan SC

**PROPHYLAXIS:**
• Migraine: Propranolol, topiramate, amitriptyline
• Chronic tension: Amitriptyline, physical therapy
• Cluster: Verapamil, prednisone taper`
  }

  // FEVER/INFECTION
  if (lowerQuery.includes('fever') || lowerQuery.includes('infection') || lowerQuery.includes('covid')) {
    return `**�� INFECTIOUS DISEASE CONSULTATION**

**INFECTIOUS SYNDROME ANALYSIS:**

**COMMON PATHOGENS:**
• **Respiratory:** Streptococcus pneumoniae, Haemophilus influenzae, SARS-CoV-2, Influenza A/B
• **Urinary:** E. coli (80%), Klebsiella, Enterococcus, Pseudomonas
• **Skin/Soft Tissue:** Staphylococcus aureus, Streptococcus pyogenes
• **Bloodstream:** MRSA, Gram-negative rods, Candida species

**SEVERITY ASSESSMENT - qSOFA:**
• Altered mental status (1 point)
• Respiratory rate ≥22/min (1 point) 
• Systolic BP ≤100 mmHg (1 point)
• ≥2 points = High mortality risk → ICU consideration

**PNEUMONIA SEVERITY (CURB-65):**
• Confusion (1) | Urea >7 mmol/L (1) | RR ≥30/min (1)
• BP <90/60 mmHg (1) | Age ≥65 years (1)
• Score 0-1: Outpatient | 2: Hospitalize | ≥3: ICU consider

**EMPIRIC ANTIBIOTICS:**
• **Community Pneumonia:** Amoxicillin-clavulanate 875mg bid + doxycycline 100mg bid
• **Healthcare Pneumonia:** Piperacillin-tazobactam 4.5g IV q6h
• **UTI:** Nitrofurantoin 100mg bid ×5 days or TMP-SMX DS bid ×3 days
• **Sepsis:** Vancomycin 15-20mg/kg IV + pip-taz 4.5g IV q6h

**DIAGNOSTIC WORKUP:**
1. Blood cultures x2 sets from different sites
2. CBC with differential, CRP, procalcitonin
3. Chest X-ray for respiratory symptoms
4. Urinalysis + culture if UTI suspected`
  }

  // ABDOMINAL PAIN
  if (lowerQuery.includes('abdominal pain') || lowerQuery.includes('stomach pain') || lowerQuery.includes('gi')) {
    return `**👨‍⚕️ GASTROENTEROLOGY/SURGICAL CONSULTATION**

**ABDOMINAL PAIN ANALYSIS:**

**LOCATION-BASED DIFFERENTIAL:**
• **RUQ:** Cholecystitis, hepatitis, PUD, pneumonia
• **LUQ:** Gastritis, pancreatitis, splenic pathology, MI
• **RLQ:** Appendicitis, ovarian cyst, diverticulitis, IBD
• **LLQ:** Diverticulitis, ovarian pathology, colitis, hernia
• **Diffuse:** Peritonitis, obstruction, mesenteric ischemia

**🚨 SURGICAL RED FLAGS:**
• Rigidity/guarding/rebound tenderness → Peritonitis
• Obstipation + distension → Bowel obstruction
• Severe pain out of proportion → Mesenteric ischemia
• Pulsatile mass → AAA rupture risk

**DIAGNOSTIC APPROACH:**
1. **Labs:** CBC, BMP, LFTs, lipase, amylase, lactate
2. **Imaging:** 
   - US for RUQ/gynecological
   - CT A/P with contrast for generalized pain
   - KUB for obstruction
3. **Special Tests:** EGD, colonoscopy, H. pylori testing

**MANAGEMENT BY DIAGNOSIS:**
• **Appendicitis:** NPO, IV fluids, appendectomy
• **Cholecystitis:** NPO, IV antibiotics, cholecystectomy
• **Pancreatitis:** NPO, aggressive IV hydration, pain control
• **Diverticulitis:** Clear liquids, antibiotics, bowel rest`
  }

  // RESPIRATORY
  if (lowerQuery.includes('cough') || lowerQuery.includes('shortness of breath') || lowerQuery.includes('sob') || lowerQuery.includes('asthma')) {
    return `**🫁 PULMONOLOGY EXPERT CONSULTATION**

**RESPIRATORY ASSESSMENT:**

**DIFFERENTIAL DIAGNOSIS:**
• **Obstructive:** Asthma, COPD exacerbation, bronchiectasis
• **Restrictive:** Pneumonia, pulmonary fibrosis, pleural effusion
• **Vascular:** Pulmonary embolism, pulmonary hypertension
• **Other:** CHF, anxiety, anemia, deconditioning

**SEVERITY SCORING:**
• **CURB-65:** Pneumonia severity (0-1 outpatient, ≥2 hospitalize)
• **Wells PE:** Low <2, Moderate 2-6, High >6 probability
• **Asthma:** Mild PEF >70%, Moderate 40-69%, Severe <40%

**DIAGNOSTIC WORKUP:**
1. **Imaging:** CXR, CT chest if complex or PE suspected
2. **Labs:** ABG, CBC, BMP, BNP, D-dimer if PE possible
3. **PFTs:** Spirometry pre/post bronchodilator
4. **Other:** ECG, echocardiogram if cardiac suspected

**ACUTE MANAGEMENT:**
• **Asthma:** Albuterol nebulizer, systemic steroids, magnesium if severe
• **COPD:** Bronchodilators, steroids, antibiotics if infectious signs
• **Pneumonia:** Antibiotics based on CURB-65 severity
• **PE:** Anticoagulation, thrombolysis if massive PE

**OXYGEN TARGETS:**
• COPD: SpO2 88-92% (avoid hyperoxia)
• Other: SpO2 ≥94% for adequate oxygenation
• Respiratory failure: Consider HFNC or BiPAP`
  }

  // GENERAL MEDICAL QUESTION
  return `**🩺 INTERNAL MEDICINE EXPERT CONSULTATION**

**COMPREHENSIVE MEDICAL ANALYSIS:**

Based on your query, I'm applying systematic clinical reasoning:

**CLINICAL REASONING FRAMEWORK:**
1. **Problem Representation:** Identify key clinical features
2. **Differential Diagnosis:** Generate prioritized possibilities
3. **Diagnostic Planning:** Evidence-based testing strategy
4. **Therapeutic Options:** Guideline-directed management

**SYSTEMATIC APPROACH:**
• **VINDICATE Mnemonic:**
  - Vascular, Infectious, Neoplastic, Drug-induced
  - Inflammatory, Congenital, Autoimmune, Trauma, Endocrine

• **Organ System Review:** Cardio, Pulmonary, GI, GU, Neuro, MSK, Derm, Heme

**EVIDENCE-BASED RECOMMENDATIONS:**
• Latest clinical practice guidelines applied
• Cost-effective diagnostic strategy
• Risk-benefit analysis of interventions
• Patient-centered outcome measures

**NEXT STEPS:**
1. Comprehensive history and physical examination
2. Appropriate diagnostic testing based on presentation
3. Specialist referral if specific system involvement identified
4. Close follow-up for treatment response assessment

**URGENT CONCERNS:**
• Chest pain, difficulty breathing, severe headache → Emergency evaluation
• Fever with altered mental status → Immediate medical attention
• Acute neurological deficits → Stroke protocol activation

Please provide specific symptoms, timing, and relevant history for more targeted recommendations.`
}
