<template>
  <div class="clo-page">
    <!-- Hero Header -->
    <div class="clo-hero">
      <span class="clo-hero-label">Stream A Calculator</span>
      <h1 class="clo-page-title">CLO to Assessment Weightings Calculator</h1>
      <p class="clo-subtitle">Design assessments based on your Course Learning Outcomes distribution</p>
    </div>

    <!-- Main Container -->
    <div class="clo-container">

    <!-- Section 1: CLO Weightings -->
    <section class="clo-section">
      <div class="clo-section-header">
        <div>
          <h2 class="clo-section-heading">1. CLO Course Weightings</h2>
          <div class="clo-section-divider"></div>
        </div>
        <button @click="addCLO" class="clo-btn clo-btn-primary">
          Add CLO
        </button>
      </div>
      <div class="clo-table-wrapper">
        <table class="clo-table">
          <thead>
            <tr>
              <th class="clo-th clo-th-left">CLO</th>
              <th class="clo-th clo-th-left">Name</th>
              <th class="clo-th clo-th-right">Course Weighting (%)</th>
              <th class="clo-th clo-th-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(clo, index) in clos" :key="clo.id">
              <td class="clo-td clo-td-bold">CLO {{ index + 1 }}</td>
              <td class="clo-td">
                <input 
                  v-model="clo.name" 
                  type="text" 
                  class="clo-input clo-input-sm"
                  placeholder="CLO name"
                />
              </td>
              <td class="clo-td">
                <input 
                  v-model.number="clo.weighting" 
                  type="number" 
                  min="0" 
                  max="100"
                  class="clo-input clo-input-sm clo-input-numeric"
                />
              </td>
              <td class="clo-td clo-td-center">
                <button 
                  @click="removeCLO(index)" 
                  class="clo-btn clo-btn-danger clo-btn-sm"
                  :disabled="clos.length === 1"
                >
                  Remove
                </button>
              </td>
            </tr>
            <tr class="clo-table-footer">
              <td colspan="2" class="clo-td clo-td-right clo-td-bold">Total:</td>
              <td class="clo-td clo-td-right clo-td-bold" :class="totalCLOWeighting === 100 ? 'clo-status-success' : 'clo-status-warning'">
                {{ totalCLOWeighting.toFixed(1) }}%
              </td>
              <td class="clo-td"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Section 2: Assessment Raw Values -->
    <section class="clo-section">
      <div class="clo-section-header">
        <div>
          <h2 class="clo-section-heading">2. Assessment Raw Values (Pre-Scaled)</h2>
          <div class="clo-section-divider"></div>
        </div>
        <button @click="addAssessment" class="clo-btn clo-btn-primary">
          Add Assessment
        </button>
      </div>
      <p class="clo-section-description">
        Enter raw values for each CLO within each assessment (e.g., hours, points, or any proportional measure).
      </p>
      <div class="clo-table-wrapper">
        <table class="clo-table">
          <thead>
            <tr>
              <th class="clo-th clo-th-left">CLO</th>
              <th v-for="assessment in assessments" :key="assessment.id" class="clo-th clo-th-center">
                <div class="clo-assessment-header-cell">
                  <input 
                    v-model="assessment.name" 
                    type="text" 
                    class="clo-input clo-input-sm"
                    placeholder="Assessment name"
                  />
                  <button 
                    @click="removeAssessment(assessment.id)" 
                    class="clo-btn clo-btn-danger clo-btn-xs"
                    :disabled="assessments.length === 1"
                  >
                    Remove
                  </button>
                </div>
              </th>
              <th class="clo-th clo-th-center clo-th-highlight">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(clo, index) in clos" :key="clo.id">
              <td class="clo-td clo-td-bold clo-td-row-header">CLO {{ index + 1 }}</td>
              <td v-for="assessment in assessments" :key="assessment.id" class="clo-td">
                <input 
                  :value="getRawValue(clo.id, assessment.id)" 
                  @input="setRawValue(clo.id, assessment.id, parseFloat($event.target.value) || 0)"
                  type="number" 
                  min="0"
                  step="any"
                  class="clo-input clo-input-sm clo-input-numeric"
                />
              </td>
              <td class="clo-td clo-td-right clo-td-bold clo-td-row-header">
                {{ getCLOTotal(clo.id).toFixed(2) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Section 2A: Scaled Percentages (Collapsible) -->
    <section class="clo-section clo-section-collapsible">
      <button class="clo-btn clo-btn-secondary clo-toggle-btn" @click="toggleSection2A">
        <span>{{ showSection2A ? 'Hide' : 'Show' }} Section 2A - Calculated Details</span>
        <svg 
          class="clo-chevron" 
          :class="{ 'clo-chevron-open': showSection2A }"
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <transition name="accordion">
        <div v-if="showSection2A" class="clo-accordion-content">
          <p class="clo-section-description">
            Raw values converted to percentages for each CLO across all assessments.
          </p>
          <div class="clo-table-wrapper">
            <table class="clo-table">
              <thead>
                <tr>
                  <th class="clo-th clo-th-left">CLO</th>
                  <th v-for="assessment in assessments" :key="assessment.id" class="clo-th clo-th-center">
                    {{ assessment.name || 'Assessment ' + assessment.id }}
                  </th>
                  <th class="clo-th clo-th-center clo-th-highlight">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(clo, index) in clos" :key="clo.id">
                  <td class="clo-td clo-td-bold clo-td-row-header">CLO {{ index + 1 }}</td>
                  <td v-for="assessment in assessments" :key="assessment.id" class="clo-td clo-td-right clo-td-scaled">
                    {{ getScaledPercentage(clo.id, assessment.id).toFixed(1) }}%
                  </td>
                  <td class="clo-td clo-td-right clo-td-bold clo-td-row-header" :class="getCLOScaledTotal(clo.id) === 100 ? 'clo-status-success' : 'clo-status-warning'">
                    {{ getCLOScaledTotal(clo.id) }}%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </transition>
    </section>

    <!-- Section 3: Overall Course Contribution -->
    <section class="clo-section">
      <div class="clo-section-header">
        <div>
          <h2 class="clo-section-heading">3. Overall Course Contribution (%)</h2>
          <div class="clo-section-divider"></div>
        </div>
      </div>
      <p class="clo-section-description">
        Contribution of each CLO within each assessment towards the overall course grade.
      </p>
      <div class="clo-table-wrapper">
        <table class="clo-table clo-results-table">
          <thead>
            <tr>
              <th class="clo-th clo-th-left">CLO</th>
              <th v-for="assessment in assessments" :key="assessment.id" class="clo-th clo-th-center">
                {{ assessment.name || 'Assessment ' + assessment.id }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(clo, index) in clos" :key="clo.id">
              <td class="clo-td clo-td-bold clo-td-row-header">CLO {{ index + 1 }}</td>
              <td v-for="assessment in assessments" :key="assessment.id" class="clo-td clo-td-right clo-td-heatmap" :style="getHeatmapStyle(getCourseContribution(clo.id, assessment.id), section3Values)">
                {{ getCourseContribution(clo.id, assessment.id).toFixed(2) }}%
              </td>
            </tr>
            <tr class="clo-table-footer">
              <td class="clo-td clo-td-bold">Assessment Total:</td>
              <td v-for="assessment in assessments" :key="assessment.id" class="clo-td clo-td-right clo-td-bold">
                {{ getAssessmentTotal(assessment.id).toFixed(2) }}%
              </td>
            </tr>
          </tbody>
        </table>
        <div class="clo-callout clo-callout-highlight">
          <p class="clo-callout-text">
            Grand Total: 
            <span :class="grandTotal === 100 ? 'clo-status-success' : 'clo-status-warning'">
              {{ grandTotal.toFixed(2) }}%
            </span>
            <span class="clo-callout-note">(Should equal 100%)</span>
          </p>
        </div>
      </div>
    </section>

    <!-- Section 4: CLO Emphasis per Assessment -->
    <section class="clo-section">
      <div class="clo-section-header">
        <div>
          <h2 class="clo-section-heading">4. CLO Emphasis per Assessment (%)</h2>
          <div class="clo-section-divider"></div>
        </div>
      </div>
      <p class="clo-section-description">
        Percentage emphasis of each CLO within each individual assessment.
      </p>
      <div class="clo-table-wrapper">
        <table class="clo-table clo-results-table">
          <thead>
            <tr>
              <th class="clo-th clo-th-left">CLO</th>
              <th v-for="assessment in assessments" :key="assessment.id" class="clo-th clo-th-center">
                {{ assessment.name || 'Assessment ' + assessment.id }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(clo, index) in clos" :key="clo.id">
              <td class="clo-td clo-td-bold clo-td-row-header">CLO {{ index + 1 }}</td>
              <td v-for="assessment in assessments" :key="assessment.id" class="clo-td clo-td-right clo-td-heatmap" :style="getHeatmapStyle(getCLOEmphasis(clo.id, assessment.id), section4Values)">
                {{ getCLOEmphasis(clo.id, assessment.id).toFixed(1) }}%
              </td>
            </tr>
            <tr class="clo-table-footer">
              <td class="clo-td clo-td-bold">Total per Assessment:</td>
              <td v-for="assessment in assessments" :key="assessment.id" class="clo-td clo-td-right clo-td-bold" :class="getAssessmentEmphasisTotal(assessment.id) === 100 ? 'clo-status-success' : 'clo-status-warning'">
                {{ getAssessmentEmphasisTotal(assessment.id).toFixed(1) }}%
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
    
    </div><!-- end clo-container -->
  </div><!-- end clo-page -->
</template>

<script setup>
import { ref, computed, reactive } from 'vue'

// UI state
const showSection2A = ref(false)

// Data structures
const clos = ref([
  { id: 1, name: 'CLO 1', weighting: 100 }
])

const assessments = ref([
  { id: 1, name: 'Assessment 1' }
])

const rawValues = reactive({})

let nextCLOId = 2
let nextAssessmentId = 2

// Helper functions
const getRawValue = (cloId, assessmentId) => {
  const key = `${cloId}-${assessmentId}`
  if (!rawValues[key]) {
    rawValues[key] = 0
  }
  return rawValues[key]
}

const setRawValue = (cloId, assessmentId, value) => {
  const key = `${cloId}-${assessmentId}`
  rawValues[key] = value
}

// Section 1 computations
const totalCLOWeighting = computed(() => {
  return clos.value.reduce((sum, clo) => sum + (clo.weighting || 0), 0)
})

// Section 2 computations
const getCLOTotal = (cloId) => {
  return assessments.value.reduce((sum, assessment) => {
    return sum + (getRawValue(cloId, assessment.id) || 0)
  }, 0)
}

// Section 2A computations
const getScaledPercentage = (cloId, assessmentId) => {
  const total = getCLOTotal(cloId)
  if (total === 0) return 0
  const rawValue = getRawValue(cloId, assessmentId) || 0
  return (rawValue / total) * 100
}

const getCLOScaledTotal = (cloId) => {
  const total = assessments.value.reduce((sum, assessment) => {
    return sum + getScaledPercentage(cloId, assessment.id)
  }, 0)
  return Math.round(total)
}

// Section 3 computations
const getCourseContribution = (cloId, assessmentId) => {
  const clo = clos.value.find(c => c.id === cloId)
  if (!clo) return 0
  const scaledPercentage = getScaledPercentage(cloId, assessmentId)
  return (scaledPercentage / 100) * (clo.weighting || 0)
}

const getAssessmentTotal = (assessmentId) => {
  return clos.value.reduce((sum, clo) => {
    return sum + getCourseContribution(clo.id, assessmentId)
  }, 0)
}

const grandTotal = computed(() => {
  return assessments.value.reduce((sum, assessment) => {
    return sum + getAssessmentTotal(assessment.id)
  }, 0)
})

// Section 4 computations
const getCLOEmphasis = (cloId, assessmentId) => {
  const assessmentTotal = getAssessmentTotal(assessmentId)
  if (assessmentTotal === 0) return 0
  const contribution = getCourseContribution(cloId, assessmentId)
  return (contribution / assessmentTotal) * 100
}

const getAssessmentEmphasisTotal = (assessmentId) => {
  return clos.value.reduce((sum, clo) => {
    return sum + getCLOEmphasis(clo.id, assessmentId)
  }, 0)
}

// Heatmap calculations
const section3Values = computed(() => {
  const values = []
  clos.value.forEach(clo => {
    assessments.value.forEach(assessment => {
      values.push(getCourseContribution(clo.id, assessment.id))
    })
  })
  return values
})

const section4Values = computed(() => {
  const values = []
  clos.value.forEach(clo => {
    assessments.value.forEach(assessment => {
      values.push(getCLOEmphasis(clo.id, assessment.id))
    })
  })
  return values
})

const getHeatmapStyle = (value, allValues) => {
  if (value === 0) {
    return { backgroundColor: '#faf9ff' }
  }
  
  // Fixed breakpoints: 20%, 40%, 60%, 80%, 100%
  // Color palette (purple gradient)
  const breakpoints = [
    { threshold: 0,   bg: '#f5f3ff', text: '#140F50' },  // 0-20%: Very light lavender
    { threshold: 20,  bg: '#e9e5ff', text: '#140F50' },  // 20%: Light lavender
    { threshold: 40,  bg: '#d4c5ff', text: '#140F50' },  // 40%: Medium lavender
    { threshold: 60,  bg: '#a78bfa', text: '#ffffff' },  // 60%: Purple
    { threshold: 80,  bg: '#7c3aed', text: '#ffffff' },  // 80%: Dark purple
    { threshold: 100, bg: '#140F50', text: '#ffffff' }   // 100%: Deep purple
  ]
  
  // Find the appropriate color based on value
  let style = breakpoints[0]
  for (let i = 0; i < breakpoints.length; i++) {
    if (value >= breakpoints[i].threshold) {
      style = breakpoints[i]
    } else {
      break
    }
  }
  
  return {
    backgroundColor: style.bg,
    color: style.text
  }
}

// Actions
const toggleSection2A = () => {
  showSection2A.value = !showSection2A.value
}

const addCLO = () => {
  clos.value.push({
    id: nextCLOId++,
    name: `CLO ${clos.value.length + 1}`,
    weighting: 0
  })
}

const removeCLO = (index) => {
  if (clos.value.length > 1) {
    const cloId = clos.value[index].id
    // Remove associated raw values
    assessments.value.forEach(assessment => {
      const key = `${cloId}-${assessment.id}`
      delete rawValues[key]
    })
    clos.value.splice(index, 1)
  }
}

const addAssessment = () => {
  assessments.value.push({
    id: nextAssessmentId++,
    name: `Assessment ${assessments.value.length + 1}`
  })
}

const removeAssessment = (assessmentId) => {
  if (assessments.value.length > 1) {
    // Remove associated raw values
    clos.value.forEach(clo => {
      const key = `${clo.id}-${assessmentId}`
      delete rawValues[key]
    })
    assessments.value = assessments.value.filter(a => a.id !== assessmentId)
  }
}
</script>

<style scoped>
/* ========================================
   Phase 1: Token System (Global Scope)
   ======================================== */
:global(:root) {
  /* Purple Brand Colors */
  --clo-ink: #140F50;
  --clo-ink-light: #3b3768;
  --clo-ink-muted: #6b6790;
  
  /* Warm Backgrounds */
  --clo-bg: #faf9ff;
  --clo-bg-warm: #f4f2ff;
  --clo-surface: #ffffff;
  
  /* Purple Accents */
  --clo-accent-a: #140F50;
  --clo-accent-a-soft: rgba(131,107,255,0.14);
  --clo-accent-b: #836BFF;
  --clo-accent-b-soft: rgba(131,107,255,0.18);
  
  /* Borders & Focus */
  --clo-border: #e2def7;
  --clo-highlight: #836BFF;
  
  /* Status Colors */
  --clo-success: #1b6b5a;
  --clo-warning: #d4a853;
  --clo-danger: #cb2461;
  
  /* Layout Tokens */
  --clo-w-max: 1120px;
  --clo-radius: 10px;
  --clo-radius-sm: 8px;
  --clo-radius-xs: 5px;
  
  /* Spacing System */
  --clo-space-xs: 0.5rem;
  --clo-space-sm: 1rem;
  --clo-space-md: 1.75rem;
  --clo-space-lg: 3rem;
  --clo-space-xl: 5rem;
  
  /* Typography */
  --clo-font-display: 'Fraunces', Georgia, serif;
  --clo-font-body: 'Source Sans 3', 'Segoe UI', sans-serif;
}

/* ========================================
   Phase 2 & 3: Page Layout & Hero
   ======================================== */
.clo-page {
  font-family: var(--clo-font-body);
  color: var(--clo-ink);
  background: var(--clo-bg);
  min-height: 100vh;
  padding-bottom: var(--clo-space-xl);
  position: relative;
  overflow: hidden;
}

/* Decorative background circles */
.clo-page::before {
  content: '';
  position: absolute;
  top: -80px;
  right: -120px;
  width: 480px;
  height: 480px;
  background: radial-gradient(circle, rgba(131,107,255,0.08) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
  z-index: 0;
}

.clo-page::after {
  content: '';
  position: absolute;
  bottom: -60px;
  left: -80px;
  width: 360px;
  height: 360px;
  background: radial-gradient(circle, rgba(20,15,80,0.06) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
  z-index: 0;
}

/* Hero Section */
.clo-hero {
  padding: var(--clo-space-lg) var(--clo-space-md) var(--clo-space-md);
  text-align: center;
  position: relative;
  z-index: 1;
}

.clo-hero-label {
  display: inline-block;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: var(--clo-accent-b);
  background: var(--clo-accent-a-soft);
  padding: 5px 14px;
  border-radius: 20px;
  margin-bottom: var(--clo-space-sm);
  animation: fadeUp 0.6s ease forwards;
}

.clo-page-title {
  font-family: var(--clo-font-display);
  font-weight: 700;
  font-size: clamp(2rem, 4.5vw, 2.8rem);
  line-height: 1.18;
  letter-spacing: -0.025em;
  color: var(--clo-ink);
  margin-bottom: var(--clo-space-sm);
  animation: fadeUp 0.6s ease forwards 0.1s;
  animation-fill-mode: both;
}

.clo-subtitle {
  font-size: 1.1rem;
  color: var(--clo-ink-light);
  line-height: 1.75;
  max-width: 600px;
  margin: 0 auto;
  animation: fadeUp 0.6s ease forwards 0.2s;
  animation-fill-mode: both;
}

/* Main Container */
.clo-container {
  max-width: var(--clo-w-max);
  margin: 0 auto;
  padding: 0 var(--clo-space-md);
  position: relative;
  z-index: 1;
}

/* ========================================
   Section Styling
   ======================================== */
.clo-section {
  background: var(--clo-surface);
  border: 1px solid var(--clo-border);
  border-radius: var(--clo-radius);
  padding: var(--clo-space-md);
  margin-bottom: var(--clo-space-md);
  box-shadow: 0 2px 8px rgba(20,15,80,0.04);
}

.clo-section-collapsible {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--clo-space-sm);
}

.clo-section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--clo-space-md);
  margin-bottom: var(--clo-space-md);
  flex-wrap: wrap;
}

.clo-section-heading {
  font-family: var(--clo-font-display);
  font-weight: 500;
  font-size: clamp(1.3rem, 2.5vw, 1.6rem);
  line-height: 1.3;
  color: var(--clo-ink);
  margin: 0;
}

.clo-section-divider {
  width: 48px;
  height: 3px;
  background: var(--clo-highlight);
  border-radius: 2px;
  margin-top: 6px;
}

.clo-section-description {
  color: var(--clo-ink-light);
  font-size: 0.97rem;
  line-height: 1.7;
  margin-bottom: var(--clo-space-md);
}

/* ========================================
   Phase 4: Button System
   ======================================== */
.clo-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-family: var(--clo-font-body);
  font-size: 1rem;
  font-weight: 600;
  padding: 12px 24px;
  border-radius: var(--clo-radius-sm);
  border: none;
  cursor: pointer;
  transition: all 0.25s ease;
  text-decoration: none;
  white-space: nowrap;
}

.clo-btn:focus-visible {
  outline: 3px solid var(--clo-highlight);
  outline-offset: 2px;
}

.clo-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}

.clo-btn-primary {
  background: var(--clo-accent-a);
  color: #fff;
}

.clo-btn-primary:hover:not(:disabled) {
  background: #0C0930;
  box-shadow: 0 6px 24px rgba(20,15,80,0.25);
  transform: translateY(-1px);
}

.clo-btn-secondary {
  background: transparent;
  color: var(--clo-accent-a);
  border: 2px solid var(--clo-accent-a);
  padding: 10px 22px;
}

.clo-btn-secondary:hover:not(:disabled) {
  background: var(--clo-accent-a);
  color: #fff;
  transform: translateY(-1px);
}

.clo-btn-danger {
  background: var(--clo-danger);
  color: #fff;
}

.clo-btn-danger:hover:not(:disabled) {
  background: #a01d4e;
  box-shadow: 0 6px 24px rgba(203,36,97,0.25);
  transform: translateY(-1px);
}

.clo-btn-sm {
  font-size: 0.88rem;
  padding: 8px 16px;
}

.clo-btn-xs {
  font-size: 0.8rem;
  padding: 6px 12px;
}

.clo-toggle-btn {
  width: auto;
  margin: 0 auto;
}

/* Chevron icon */
.clo-chevron {
  width: 20px;
  height: 20px;
  transition: transform 0.2s ease;
}

.clo-chevron-open {
  transform: rotate(180deg);
}

/* ========================================
   Accordion Content
   ======================================== */
.clo-accordion-content {
  width: 100%;
  padding-top: var(--clo-space-md);
}

/* Accordion animation */
.accordion-enter-active,
.accordion-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.accordion-enter-from,
.accordion-leave-to {
  opacity: 0;
  max-height: 0;
}

.accordion-enter-to,
.accordion-leave-from {
  opacity: 1;
  max-height: 2000px;
}

/* ========================================
   Phase 7: Form Controls
   ======================================== */
.clo-input {
  width: 100%;
  font-family: var(--clo-font-body);
  font-size: 0.95rem;
  color: var(--clo-ink);
  background: #fff;
  border: 1px solid var(--clo-border);
  border-radius: var(--clo-radius-sm);
  padding: 10px 12px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.clo-input:focus {
  outline: none;
  border-color: var(--clo-highlight);
  box-shadow: 0 0 0 3px rgba(131,107,255,0.1);
}

.clo-input-numeric {
  text-align: right;
  font-variant-numeric: tabular-nums;
}

.clo-input-sm {
  font-size: 0.9rem;
  padding: 8px 10px;
}

/* ========================================
   Phase 7: Table Styling
   ======================================== */
.clo-table-wrapper {
  overflow-x: auto;
  border-radius: var(--clo-radius);
  margin-top: var(--clo-space-sm);
}

.clo-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 0.93rem;
  color: var(--clo-ink);
}

.clo-th {
  background: var(--clo-bg-warm);
  color: var(--clo-ink);
  font-weight: 600;
  font-size: 0.88rem;
  padding: 12px 14px;
  border: 1px solid var(--clo-border);
  border-right: none;
  white-space: nowrap;
  vertical-align: top;
}

.clo-th:last-child {
  border-right: 1px solid var(--clo-border);
}

.clo-th:first-child {
  border-top-left-radius: var(--clo-radius);
}

.clo-th:last-child {
  border-top-right-radius: var(--clo-radius);
}

.clo-th-left {
  text-align: left;
}

.clo-th-center {
  text-align: center;
}

.clo-th-right {
  text-align: right;
}

.clo-th-highlight {
  background: var(--clo-accent-a-soft);
  color: var(--clo-accent-a);
}

.clo-td {
  padding: 12px 14px;
  border: 1px solid var(--clo-border);
  border-top: none;
  border-right: none;
  background: var(--clo-surface);
}

.clo-td:last-child {
  border-right: 1px solid var(--clo-border);
}

.clo-td-left {
  text-align: left;
}

.clo-td-center {
  text-align: center;
}

.clo-td-right {
  text-align: right;
}

.clo-td-bold {
  font-weight: 600;
  color: var(--clo-ink);
}

.clo-td-row-header {
  background: var(--clo-bg-warm);
  font-weight: 600;
}

.clo-td-heatmap {
  font-variant-numeric: tabular-nums;
  transition: background-color 0.2s ease;
}

.clo-td-scaled {
  background: var(--clo-accent-a-soft);
  font-variant-numeric: tabular-nums;
}

.clo-table-footer .clo-td {
  background: var(--clo-bg-warm);
  font-weight: 600;
  border-bottom: 1px solid var(--clo-border);
}

.clo-table-footer .clo-td:first-child {
  border-bottom-left-radius: var(--clo-radius);
}

.clo-table-footer .clo-td:last-child {
  border-bottom-right-radius: var(--clo-radius);
}

.clo-results-table .clo-td {
  min-width: 100px;
}

/* Assessment header cell in table */
.clo-assessment-header-cell {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: stretch;
}

/* ========================================
   Phase 6: Callouts
   ======================================== */
.clo-callout {
  background: linear-gradient(135deg, var(--clo-accent-b-soft), var(--clo-bg-warm));
  border-left: 4px solid var(--clo-accent-b);
  border-radius: 0 var(--clo-radius) var(--clo-radius) 0;
  padding: var(--clo-space-md);
  margin-top: var(--clo-space-md);
}

.clo-callout-highlight {
  background: linear-gradient(135deg, var(--clo-accent-a-soft), var(--clo-bg-warm));
  border-left-color: var(--clo-accent-a);
}

.clo-callout-text {
  font-size: 0.97rem;
  font-weight: 600;
  color: var(--clo-ink);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.clo-callout-note {
  font-weight: 400;
  color: var(--clo-ink-muted);
  font-size: 0.9rem;
}

/* ========================================
   Status Indicators
   ======================================== */
.clo-status-success {
  color: var(--clo-success);
  font-weight: 600;
}

.clo-status-warning {
  color: var(--clo-warning);
  font-weight: 600;
}

/* ========================================
   Phase 9: Animations
   ======================================== */
@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ========================================
   Responsive Design
   ======================================== */
@media (max-width: 860px) {
  .clo-hero {
    padding: var(--clo-space-md);
  }
  
  .clo-page-title {
    font-size: 2rem;
  }
  
  .clo-container {
    padding: 0 var(--clo-space-sm);
  }
  
  .clo-section {
    padding: var(--clo-space-sm);
  }
  
  .clo-section-header {
    flex-direction: column;
    align-items: stretch;
  }
}

@media (max-width: 540px) {
  .clo-page::before,
  .clo-page::after {
    display: none;
  }
}

/* Focus styles for accessibility */
a:focus-visible,
button:focus-visible,
input:focus-visible,
select:focus-visible {
  outline: 3px solid var(--clo-highlight);
  outline-offset: 2px;
}
</style>