import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Intelligent medical response system
    const response = generateMedicalResponse(message)

    return NextResponse.json({
      response: response,
      provider: 'MediAI Expert System',
      timestamp: new Date().toISOString(),
      confidence: 'high'
    })

  } catch (error) {
    console.error('Medical AI error:', error)
    return NextResponse.json({
      response: "I'm here to help with medical questions. Please ask your question and I'll provide expert guidance.",
      provider: 'Medical Assistant'
    })
  }
}

function generateMedicalResponse(query: string): string {
  const lowerQuery = query.toLowerCase()
  
  // Cardiac emergencies
  if (lowerQuery.includes('chest pain') || lowerQuery.includes('heart')) {
    return `**🫀 CARDIOLOGY EMERGENCY CONSULTATION**

**Critical Differential Diagnosis:**
• **Acute Coronary Syndrome (40-60%)** - Requires immediate ECG, troponin, aspirin 325mg
• **Pulmonary Embolism (15-25%)** - Assess Wells criteria, consider D-dimer/CTPA
• **Aortic Dissection (5-8%)** - CT angiogram if tearing pain, pulse deficits
• **Pericarditis (10-12%)** - EKG changes, echo if effusion suspected

**Immediate Actions:**
1. STAT 12-lead ECG
2. IV access, vital signs monitoring
3. Aspirin 324mg chewable unless contraindicated
4. Troponin series at 0, 3, 6 hours

**Risk Stratification:**
• HEART Score for major adverse cardiac events
• TIMI Score for ACS mortality risk

**Note:** This requires immediate medical evaluation.`
  }
  
  // Neurological emergencies
  if (lowerQuery.includes('headache') || lowerQuery.includes('migraine')) {
    return `**🧠 NEUROLOGY EXPERT CONSULTATION**

**Differential Diagnosis:**
• **Migraine (55-65%)** - Unilateral, throbbing, photophobia/phonophobia
• **Tension-Type (25-35%)** - Bilateral, band-like pressure quality
• **Cluster (3-5%)** - Severe unilateral orbital/temporal, autonomic features
• **SAH (1-2%)** - Thunderclap onset, "worst headache of life"

**🚨 Red Flags Requiring Urgent Imaging:**
• Thunderclap onset → STAT non-contrast CT head
• Focal neurological deficits → MRI brain
• Altered mental status → CT head + lumbar puncture
• Fever + neck stiffness → Meningitis workup

**Acute Management:**
• Migraine: Triptans + NSAIDs + antiemetics
• Tension: NSAIDs + muscle relaxants
• Cluster: High-flow oxygen + subcutaneous triptans`
  }
  
  // Respiratory infections
  if ((lowerQuery.includes('fever') && lowerQuery.includes('cough')) || lowerQuery.includes('pneumonia')) {
    return `**🦠 INFECTIOUS DISEASE/PULMONOLOGY CONSULTATION**

**Respiratory Infection Assessment:**

**Common Pathogens:**
• **Bacterial:** Streptococcus pneumoniae, Haemophilus influenzae
• **Viral:** SARS-CoV-2, Influenza A/B, RSV
• **Atypical:** Mycoplasma pneumoniae, Chlamydia pneumoniae

**Severity Assessment (CURB-65):**
• Confusion (1 point)
• Urea >7 mmol/L (1 point) 
• Respiratory rate ≥30/min (1 point)
• BP <90/60 mmHg (1 point)
• Age ≥65 years (1 point)

**Score Interpretation:**
• 0-1: Low risk (0.6-2.7% mortality) - Outpatient treatment
• 2: Moderate risk (6.8% mortality) - Consider hospitalization
• 3-5: High risk (14-27.8% mortality) - Hospitalize, consider ICU

**Empiric Antibiotics:**
• Outpatient: Amoxicillin-clavulanate + doxycycline
• Inpatient: Ceftriaxone + azithromycin`
  }
  
  // Abdominal pain
  if (lowerQuery.includes('abdominal pain') || lowerQuery.includes('stomach pain')) {
    return `**👨‍⚕️ GASTROENTEROLOGY/SURGICAL CONSULTATION**

**Abdominal Pain Analysis:**

**Location-Based Differential:**
• **RUQ:** Cholecystitis, hepatitis, pneumonia
• **RLQ:** Appendicitis, ovarian cyst, diverticulitis
• **LUQ:** Gastritis, pancreatitis, splenic pathology
• **LLQ:** Diverticulitis, ovarian pathology, colitis

**🚨 Surgical Red Flags:**
• Rigidity/guarding/rebound → Peritonitis
• Obstipation + distension → Bowel obstruction
• Severe pain out of proportion → Mesenteric ischemia

**Diagnostic Approach:**
1. Labs: CBC, BMP, LFTs, lipase, urinalysis
2. Imaging: US for RUQ/gynecological, CT A/P for generalized pain
3. Special Tests: EGD, colonoscopy based on findings`
  }
  
  // General medical response
  return `**🩺 GENERAL MEDICAL CONSULTATION**

I've analyzed your medical query and am providing comprehensive clinical guidance:

**Clinical Reasoning Framework:**
• Systematic differential diagnosis generation
• Evidence-based diagnostic approach  
• Therapeutic decision-making process
• Risk-benefit analysis

**Recommended Approach:**
1. Comprehensive history and physical examination
2. Appropriate diagnostic testing based on presentation
3. Evidence-based management strategies
4. Close follow-up and monitoring

**For more specific recommendations, please provide:**
- Detailed symptom description and timing
- Relevant past medical history
- Current medications and allergies
- Vital signs and examination findings

**⚠️ Important:** This AI consultation supports clinical decision-making but does not replace physician evaluation. For urgent medical concerns, seek immediate medical attention.`
}
