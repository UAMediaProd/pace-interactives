<template>
  <div class="clo-page">
    <!-- Hero Header -->
    <div class="clo-hero">
      <span class="clo-hero-label">Stream B Calculator</span>
      <h1 class="clo-page-title">Assignment to CLO Contribution Calculator</h1>
      <p class="clo-subtitle">Calculate CLO weightings based on assessment rubric criteria</p>
    </div>

    <!-- Main Container -->
    <div class="clo-container">
    
    <!-- Section 1: Assignments and Rubric Criteria -->
    <section class="clo-section">
      <div class="clo-section-header">
        <div>
          <h2 class="clo-section-heading">1. Assignments and Rubric Criteria</h2>
          <div class="clo-section-divider"></div>
        </div>
        <button @click="addAssignment" class="clo-btn clo-btn-primary">
          Add Assignment
        </button>
      </div>

      <!-- Assignment Cards -->
      <div v-for="(assignment) in assignments" :key="assignment.id" class="clo-assignment-card">
        <div class="clo-assignment-tag">Assignment {{ assignment.id }}</div>
        <div class="clo-assignment-header">
          <div class="clo-field-group">
            <label class="clo-label">Assignment Name</label>
            <input 
              v-model="assignment.name" 
              type="text" 
              class="clo-input"
              placeholder="Assignment name"
            />
          </div>
          <div class="clo-field-group clo-field-narrow">
            <label class="clo-label">Weighting (%)</label>
            <input 
              v-model.number="assignment.weighting" 
              type="number" 
              min="0" 
              max="100"
              class="clo-input clo-input-numeric"
            />
          </div>
          <div class="clo-field-actions">
            <button 
              @click="removeAssignment(assignment.id)" 
              class="clo-btn clo-btn-danger"
              :disabled="assignments.length === 1"
            >
              Remove
            </button>
          </div>
        </div>

        <!-- Rubric Criteria Table -->
        <div class="clo-criteria-section">
          <div class="clo-criteria-header">
            <h3 class="clo-subsection-heading">Rubric Criteria</h3>
            <button 
              @click="addCriteria(assignment.id)" 
              class="clo-btn clo-btn-secondary"
              :disabled="getCriteria(assignment.id).length >= 5"
            >
              Add Criteria
            </button>
          </div>

          <div class="clo-table-wrapper">
            <table class="clo-table">
              <thead>
                <tr>
                  <th class="clo-th clo-th-left">Criteria Name</th>
                  <th class="clo-th clo-th-left">CLO Allocations</th>
                  <th class="clo-th clo-th-right">Total Marks</th>
                  <th class="clo-th clo-th-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(criteria) in getCriteria(assignment.id)" :key="criteria.id">
                  <td class="clo-td">
                    <input 
                      v-model="criteria.name" 
                      type="text" 
                      class="clo-input clo-input-sm"
                      placeholder="Criteria name"
                    />
                  </td>
                  <td class="clo-td">
                    <!-- CLO Allocations -->
                    <div class="clo-allocation-row">
                      <div v-for="(cloAlloc, cloIndex) in criteria.cloAllocations" :key="cloIndex" class="clo-allocation-pill">
                        <label class="clo-allocation-label">CLO:</label>
                        <input 
                          v-model.number="cloAlloc.cloNumber" 
                          type="number" 
                          min="1"
                          class="clo-input clo-input-xs"
                          placeholder="#"
                        />
                        <label class="clo-allocation-label">%:</label>
                        <input 
                          v-model.number="cloAlloc.percentage" 
                          type="number" 
                          min="0" 
                          max="100"
                          class="clo-input clo-input-xs"
                          placeholder="%"
                        />
                        <button 
                          @click="removeCLOAllocation(assignment.id, criteria.id, cloIndex)"
                          class="clo-btn-remove"
                          :disabled="criteria.cloAllocations.length === 1"
                          title="Remove CLO"
                        >
                          ×
                        </button>
                      </div>
                      <button 
                        v-if="criteria.cloAllocations.length < 3"
                        @click="addCLOAllocation(assignment.id, criteria.id)" 
                        class="clo-btn clo-btn-add-clo"
                      >
                        + Add CLO
                      </button>
                      <span class="clo-allocation-total" :class="getCriteriaAllocationTotal(criteria) === 100 ? 'clo-status-success' : 'clo-status-warning'">
                        Total: {{ getCriteriaAllocationTotal(criteria) }}%
                      </span>
                    </div>
                  </td>
                  <td class="clo-td">
                    <input 
                      v-model.number="criteria.totalMarks" 
                      type="number" 
                      min="0"
                      step="any"
                      class="clo-input clo-input-sm clo-input-numeric"
                    />
                  </td>
                  <td class="clo-td clo-td-center">
                    <button 
                      @click="removeCriteria(assignment.id, criteria.id)" 
                      class="clo-btn clo-btn-danger clo-btn-sm"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
                <tr class="clo-table-footer">
                  <td colspan="2" class="clo-td clo-td-right clo-td-bold">Total Marks:</td>
                  <td class="clo-td clo-td-right clo-td-bold">
                    {{ getAssignmentTotalMarks(assignment.id).toFixed(2) }}
                  </td>
                  <td class="clo-td"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Total Weightings Check -->
      <div class="clo-callout">
        <p class="clo-callout-text">
          Total Assignment Weightings: 
          <span :class="totalAssignmentWeighting === 100 ? 'clo-status-success' : 'clo-status-warning'">
            {{ totalAssignmentWeighting.toFixed(1) }}%
          </span>
          <span class="clo-callout-note">(Should equal 100%)</span>
        </p>
      </div>
    </section>

    <!-- Section 2: CLO Contribution Results -->
    <section class="clo-section">
      <div class="clo-section-header">
        <div>
          <h2 class="clo-section-heading">2. CLO Contribution Results</h2>
          <div class="clo-section-divider"></div>
        </div>
      </div>
      <p class="clo-section-description">
        Calculated contribution of each assignment to each CLO, based on rubric criteria.
      </p>

      <div v-if="discoveredCLOs.length > 0" class="clo-table-wrapper">
        <table class="clo-table clo-results-table">
          <thead>
            <tr>
              <th class="clo-th clo-th-left">CLO</th>
              <th v-for="assignment in assignments" :key="assignment.id" class="clo-th clo-th-center">
                {{ assignment.name || 'Assignment ' + assignment.id }}
              </th>
              <th class="clo-th clo-th-center clo-th-highlight">Overall</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="cloNum in discoveredCLOs" :key="cloNum">
              <td class="clo-td clo-td-bold clo-td-row-header">CLO {{ cloNum }}</td>
              <td v-for="assignment in assignments" :key="assignment.id" class="clo-td clo-td-right clo-td-heatmap" :style="getHeatmapStyle(getCLOContribution(cloNum, assignment.id), allContributions)">
                {{ getCLOContribution(cloNum, assignment.id).toFixed(2) }}%
              </td>
              <td class="clo-td clo-td-right clo-td-bold clo-td-heatmap" :style="getHeatmapStyle(getCLOOverall(cloNum), overallContributions)">
                {{ getCLOOverall(cloNum).toFixed(2) }}%
              </td>
            </tr>
            <tr class="clo-table-footer">
              <td class="clo-td clo-td-bold">Total:</td>
              <td v-for="assignment in assignments" :key="assignment.id" class="clo-td clo-td-right clo-td-bold">
                {{ getAssignmentColumnTotal(assignment.id).toFixed(2) }}%
              </td>
              <td class="clo-td clo-td-right clo-td-bold" :class="grandTotal === 100 ? 'clo-status-success' : 'clo-status-warning'">
                {{ grandTotal.toFixed(2) }}%
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
      <div v-else class="clo-empty-state">
        <p>No CLOs defined yet. Add criteria with CLO allocations to see results.</p>
      </div>
    </section>
    
    </div><!-- end clo-container -->
  </div><!-- end clo-page -->
</template>

<script setup>
import { ref, computed } from 'vue'

// Data structures
const assignments = ref([
  { 
    id: 1, 
    name: 'Assignment 1', 
    weighting: 15 
  }
])

const criteria = ref({
  '1': [
    { 
      id: 1, 
      name: 'Criteria 1', 
      totalMarks: 20,
      cloAllocations: [
        { cloNumber: 1, percentage: 100 }
      ]
    }
  ]
})

let nextAssignmentId = 2
let nextCriteriaId = 2

// Helper functions
const getCriteria = (assignmentId) => {
  return criteria.value[assignmentId] || []
}

const getAssignmentTotalMarks = (assignmentId) => {
  const assignmentCriteria = getCriteria(assignmentId)
  return assignmentCriteria.reduce((sum, c) => sum + (c.totalMarks || 0), 0)
}

const getCriteriaAllocationTotal = (criteria) => {
  return criteria.cloAllocations.reduce((sum, alloc) => sum + (alloc.percentage || 0), 0)
}

// Computed: Total assignment weighting
const totalAssignmentWeighting = computed(() => {
  return assignments.value.reduce((sum, a) => sum + (a.weighting || 0), 0)
})

// Computed: Discover all CLOs used across all criteria
const discoveredCLOs = computed(() => {
  const cloSet = new Set()
  Object.values(criteria.value).forEach(assignmentCriteria => {
    assignmentCriteria.forEach(c => {
      c.cloAllocations.forEach(alloc => {
        if (alloc.cloNumber && alloc.cloNumber > 0) {
          cloSet.add(alloc.cloNumber)
        }
      })
    })
  })
  return Array.from(cloSet).sort((a, b) => a - b)
})

// Calculation: CLO contribution for a specific assignment
// Formula: IF total_marks > 0: (SUMIF marks where CLO# matches / total_marks) × assignment_weighting ELSE: 0
const getCLOContribution = (cloNumber, assignmentId) => {
  const assignment = assignments.value.find(a => a.id === assignmentId)
  if (!assignment) return 0
  
  const assignmentCriteria = getCriteria(assignmentId)
  const totalMarks = getAssignmentTotalMarks(assignmentId)
  
  if (totalMarks === 0) return 0
  
  // Sum marks for this CLO across all criteria
  let cloMarks = 0
  assignmentCriteria.forEach(c => {
    c.cloAllocations.forEach(alloc => {
      if (alloc.cloNumber === cloNumber) {
        const allocPercentage = (alloc.percentage || 0) / 100
        cloMarks += (c.totalMarks || 0) * allocPercentage
      }
    })
  })
  
  return (cloMarks / totalMarks) * (assignment.weighting || 0)
}

// Calculation: Overall CLO contribution (sum across all assignments)
const getCLOOverall = (cloNumber) => {
  return assignments.value.reduce((sum, assignment) => {
    return sum + getCLOContribution(cloNumber, assignment.id)
  }, 0)
}

// Calculation: Column total for an assignment (should match assignment weighting if all criteria allocated)
const getAssignmentColumnTotal = (assignmentId) => {
  return discoveredCLOs.value.reduce((sum, cloNum) => {
    return sum + getCLOContribution(cloNum, assignmentId)
  }, 0)
}

// Calculation: Grand total (sum of all CLO overall contributions)
const grandTotal = computed(() => {
  return discoveredCLOs.value.reduce((sum, cloNum) => {
    return sum + getCLOOverall(cloNum)
  }, 0)
})

// Heatmap calculations
const allContributions = computed(() => {
  const values = []
  discoveredCLOs.value.forEach(cloNum => {
    assignments.value.forEach(assignment => {
      values.push(getCLOContribution(cloNum, assignment.id))
    })
  })
  return values
})

const overallContributions = computed(() => {
  return discoveredCLOs.value.map(cloNum => getCLOOverall(cloNum))
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
const addAssignment = () => {
  const newId = nextAssignmentId++
  assignments.value.push({
    id: newId,
    name: `Assignment ${assignments.value.length + 1}`,
    weighting: 0
  })
  criteria.value[newId] = []
}

const removeAssignment = (assignmentId) => {
  if (assignments.value.length > 1) {
    assignments.value = assignments.value.filter(a => a.id !== assignmentId)
    delete criteria.value[assignmentId]
  }
}

const addCriteria = (assignmentId) => {
  if (!criteria.value[assignmentId]) {
    criteria.value[assignmentId] = []
  }
  criteria.value[assignmentId].push({
    id: nextCriteriaId++,
    name: `Criteria ${criteria.value[assignmentId].length + 1}`,
    totalMarks: 0,
    cloAllocations: [
      { cloNumber: null, percentage: 100 }
    ]
  })
}

const removeCriteria = (assignmentId, criteriaId) => {
  if (criteria.value[assignmentId]) {
    criteria.value[assignmentId] = criteria.value[assignmentId].filter(c => c.id !== criteriaId)
  }
}

const addCLOAllocation = (assignmentId, criteriaId) => {
  const assignmentCriteria = getCriteria(assignmentId)
  const criteriaItem = assignmentCriteria.find(c => c.id === criteriaId)
  if (criteriaItem && criteriaItem.cloAllocations.length < 3) {
    criteriaItem.cloAllocations.push({
      cloNumber: null,
      percentage: 0
    })
  }
}

const removeCLOAllocation = (assignmentId, criteriaId, allocationIndex) => {
  const assignmentCriteria = getCriteria(assignmentId)
  const criteriaItem = assignmentCriteria.find(c => c.id === criteriaId)
  if (criteriaItem && criteriaItem.cloAllocations.length > 1) {
    criteriaItem.cloAllocations.splice(allocationIndex, 1)
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

/* Decorative background circles (Phase 3) */
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

.clo-subsection-heading {
  font-family: var(--clo-font-display);
  font-weight: 500;
  font-size: 1.15rem;
  color: var(--clo-ink);
  margin: 0;
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

.clo-btn-add-clo {
  font-size: 0.82rem;
  padding: 6px 12px;
  background: var(--clo-accent-b);
  color: #fff;
}

.clo-btn-add-clo:hover:not(:disabled) {
  background: #6b54e6;
  box-shadow: 0 4px 16px rgba(131,107,255,0.3);
  transform: translateY(-1px);
}

.clo-btn-remove {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  font-size: 1.2rem;
  line-height: 1;
  background: var(--clo-danger);
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.clo-btn-remove:hover:not(:disabled) {
  background: #a01d4e;
}

.clo-btn-remove:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* ========================================
   Phase 5: Assignment Cards (Top-Accent)
   ======================================== */
.clo-assignment-card {
  background: var(--clo-surface);
  border: 1px solid var(--clo-border);
  border-radius: var(--clo-radius);
  padding: var(--clo-space-md);
  margin-bottom: var(--clo-space-md);
  position: relative;
  overflow: hidden;
  transition: box-shadow 0.3s ease;
}

.clo-assignment-card:hover {
  box-shadow: 0 4px 20px rgba(20,15,80,0.06);
}

/* Top accent bar */
.clo-assignment-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--clo-accent-b);
}

.clo-assignment-tag {
  display: inline-block;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--clo-accent-b);
  background: var(--clo-accent-a-soft);
  padding: 4px 10px;
  border-radius: var(--clo-radius-xs);
  margin-bottom: var(--clo-space-sm);
}

.clo-assignment-header {
  display: flex;
  gap: var(--clo-space-sm);
  align-items: flex-end;
  flex-wrap: wrap;
  row-gap: var(--clo-space-sm);
}

.clo-field-group {
  flex: 1;
  min-width: 200px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.clo-field-narrow {
  flex: 0 0 180px;
  min-width: 150px;
}

.clo-field-actions {
  display: flex;
  align-items: flex-end;
}

.clo-label {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--clo-ink);
  display: block;
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

.clo-input-xs {
  width: 56px;
  font-size: 0.88rem;
  padding: 6px 8px;
  text-align: center;
}

/* ========================================
   Criteria Section
   ======================================== */
.clo-criteria-section {
  margin-top: var(--clo-space-md);
  padding-top: var(--clo-space-md);
  border-top: 1px solid var(--clo-border);
}

.clo-criteria-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--clo-space-sm);
  flex-wrap: wrap;
  gap: var(--clo-space-sm);
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

/* CLO Allocation Pills */
.clo-allocation-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.clo-allocation-pill {
  display: flex;
  align-items: center;
  gap: 6px;
  background: var(--clo-bg-warm);
  padding: 8px 10px;
  border: 1px solid var(--clo-border);
  border-radius: var(--clo-radius-sm);
  flex-shrink: 0;
}

.clo-allocation-label {
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--clo-ink-muted);
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.clo-allocation-total {
  font-size: 0.82rem;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: var(--clo-radius-xs);
  background: var(--clo-bg-warm);
  white-space: nowrap;
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
   Empty State
   ======================================== */
.clo-empty-state {
  padding: var(--clo-space-lg) var(--clo-space-md);
  text-align: center;
  color: var(--clo-ink-muted);
  background: var(--clo-bg-warm);
  border-radius: var(--clo-radius);
  border: 1px dashed var(--clo-border);
}

.clo-empty-state p {
  margin: 0;
  font-size: 0.95rem;
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
  
  .clo-assignment-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .clo-field-narrow {
    flex: 1;
  }
  
  .clo-field-actions {
    width: 100%;
  }
  
  .clo-field-actions .clo-btn {
    width: 100%;
  }
}

@media (max-width: 540px) {
  .clo-page::before,
  .clo-page::after {
    display: none;
  }
  
  .clo-allocation-row {
    flex-direction: column;
    align-items: stretch;
  }
  
  .clo-allocation-pill {
    width: 100%;
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
