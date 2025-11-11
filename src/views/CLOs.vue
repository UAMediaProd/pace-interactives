<template>
  <div :class="wrapperClass">
    <h1 class="page-title">CLOs and Assessment Weightings Calculator</h1>

    <!-- Section 1: CLO Weightings -->
    <section class="mb-8 bg-white rounded-lg shadow p-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="section-heading">1. CLO Course Weightings</h2>
        <button @click="addCLO" class="btn-primary">
          Add CLO
        </button>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full border-collapse">
          <thead>
            <tr class="bg-gray-100">
              <th class="border p-2 text-left">CLO</th>
              <th class="border p-2 text-left">Name</th>
              <th class="border p-2 text-right">Course Weighting (%)</th>
              <th class="border p-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(clo, index) in clos" :key="clo.id">
              <td class="border p-2">CLO {{ index + 1 }}</td>
              <td class="border p-2">
                <input 
                  v-model="clo.name" 
                  type="text" 
                  class="w-full px-2 py-1 border rounded"
                  placeholder="CLO name"
                />
              </td>
              <td class="border p-2">
                <input 
                  v-model.number="clo.weighting" 
                  type="number" 
                  min="0" 
                  max="100"
                  class="w-full px-2 py-1 border rounded text-right"
                />
              </td>
              <td class="border p-2 text-center">
                <button 
                  @click="removeCLO(index)" 
                  class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  :disabled="clos.length === 1"
                >
                  Remove
                </button>
              </td>
            </tr>
            <tr class="bg-gray-50 font-bold">
              <td colspan="2" class="border p-2 text-right">Total:</td>
              <td class="border p-2 text-right" :class="totalCLOWeighting === 100 ? 'text-success' : 'text-warning'">
                {{ totalCLOWeighting.toFixed(1) }}%
              </td>
              <td class="border p-2"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Section 2: Assessment Raw Values -->
    <section class="mb-8 bg-white rounded-lg shadow p-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="section-heading">2. Assessment Raw Values (Pre-Scaled)</h2>
        <button @click="addAssessment" class="btn-primary">
          Add Assessment
        </button>
      </div>
      <p class="text-sm text-gray-600 mb-4">
        Enter raw values for each CLO within each assessment (e.g., hours, points, or any proportional measure).
      </p>
      <div class="overflow-x-auto">
        <table class="w-full border-collapse">
          <thead>
            <tr class="bg-gray-100">
              <th class="border p-2 text-left">CLO</th>
              <th v-for="assessment in assessments" :key="assessment.id" class="border p-2 text-center">
                <div class="flex flex-col items-center gap-2">
                  <input 
                    v-model="assessment.name" 
                    type="text" 
                    class="w-full px-2 py-1 border rounded text-center"
                    placeholder="Assessment name"
                  />
                  <button 
                    @click="removeAssessment(assessment.id)" 
                    class="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                    :disabled="assessments.length === 1"
                  >
                    Remove
                  </button>
                </div>
              </th>
              <th class="border p-2 text-center bg-gray-200">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(clo, index) in clos" :key="clo.id">
              <td class="border p-2 font-semibold">CLO {{ index + 1 }}</td>
              <td v-for="assessment in assessments" :key="assessment.id" class="border p-2">
                <input 
                  :value="getRawValue(clo.id, assessment.id)" 
                  @input="setRawValue(clo.id, assessment.id, parseFloat($event.target.value) || 0)"
                  type="number" 
                  min="0"
                  step="any"
                  class="w-full px-2 py-1 border rounded text-right"
                />
              </td>
              <td class="border p-2 text-right font-semibold bg-gray-50">
                {{ getCLOTotal(clo.id).toFixed(2) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Section 2A: Scaled Percentages (Collapsible) -->
    <section class="justify-center align-center text-center" style="box-shadow: none;">
        <button class="btn-secondary flex items-center gap-2 mx-auto" @click="toggleSection2A">
          <span>{{ showSection2A ? 'Hide' : 'Show' }} Section 2A - Calculated Details</span>
          <svg 
            class="w-5 h-5 transition-transform duration-200" 
            :class="{ 'rotate-180': showSection2A }"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

      
      <transition name="accordion">
        <div v-if="showSection2A" class="mb-8 bg-white rounded-lg shadow p-6">
          <p class="text-sm text-gray-600 mb-4">
            Raw values converted to percentages for each CLO across all assessments.
          </p>
          <div class="overflow-x-auto">
            <table class="w-full border-collapse">
              <thead>
                <tr class="bg-gray-100">
                  <th class="border p-2 text-left">CLO</th>
                  <th v-for="assessment in assessments" :key="assessment.id" class="border p-2 text-center">
                    {{ assessment.name || 'Assessment ' + assessment.id }}
                  </th>
                  <th class="border p-2 text-center bg-gray-200">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(clo, index) in clos" :key="clo.id">
                  <td class="border p-2 font-semibold">CLO {{ index + 1 }}</td>
                  <td v-for="assessment in assessments" :key="assessment.id" class="border p-2 text-right bg-blue-50">
                    {{ getScaledPercentage(clo.id, assessment.id).toFixed(1) }}%
                  </td>
                  <td class="border p-2 text-right font-semibold bg-gray-50" :class="getCLOScaledTotal(clo.id) === 100 ? 'text-success' : 'text-warning'">
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
    <section class="mb-8 bg-white rounded-lg shadow p-6">
      <h2 class="section-heading mb-4">3. Overall Course Contribution (%)</h2>
      <p class="text-sm text-gray-600 mb-4">
        Contribution of each CLO within each assessment towards the overall course grade.
      </p>
      <div class="overflow-x-auto">
        <table class="w-full border-collapse">
          <thead>
            <tr class="bg-gray-100">
              <th class="border p-2 text-left">CLO</th>
              <th v-for="assessment in assessments" :key="assessment.id" class="border p-2 text-center">
                {{ assessment.name || 'Assessment ' + assessment.id }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(clo, index) in clos" :key="clo.id">
              <td class="border p-2 font-semibold">CLO {{ index + 1 }}</td>
              <td v-for="assessment in assessments" :key="assessment.id" class="border p-2 text-right" :style="getHeatmapStyle(getCourseContribution(clo.id, assessment.id), section3Values)">
                {{ getCourseContribution(clo.id, assessment.id).toFixed(2) }}%
              </td>
            </tr>
            <tr class="bg-gray-100 font-bold">
              <td class="border p-2">Assessment Total:</td>
              <td v-for="assessment in assessments" :key="assessment.id" class="border p-2 text-right">
                {{ getAssessmentTotal(assessment.id).toFixed(2) }}%
              </td>
            </tr>
          </tbody>
        </table>
        <div class="mt-4 p-3 bg-gray-100 rounded">
          <p class="font-semibold">
            Grand Total: 
            <span :class="grandTotal === 100 ? 'text-success' : 'text-warning'">
              {{ grandTotal.toFixed(2) }}%
            </span>
            (Should equal 100%)
          </p>
        </div>
      </div>
    </section>

    <!-- Section 4: CLO Emphasis per Assessment -->
    <section class="mb-8 bg-white rounded-lg shadow p-6">
      <h2 class="section-heading mb-4">4. CLO Emphasis per Assessment (%)</h2>
      <p class="text-sm text-gray-600 mb-4">
        Percentage emphasis of each CLO within each individual assessment.
      </p>
      <div class="overflow-x-auto">
        <table class="w-full border-collapse">
          <thead>
            <tr class="bg-gray-100">
              <th class="border p-2 text-left">CLO</th>
              <th v-for="assessment in assessments" :key="assessment.id" class="border p-2 text-center">
                {{ assessment.name || 'Assessment ' + assessment.id }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(clo, index) in clos" :key="clo.id">
              <td class="border p-2 font-semibold">CLO {{ index + 1 }}</td>
              <td v-for="assessment in assessments" :key="assessment.id" class="border p-2 text-right" :style="getHeatmapStyle(getCLOEmphasis(clo.id, assessment.id), section4Values)">
                {{ getCLOEmphasis(clo.id, assessment.id).toFixed(1) }}%
              </td>
            </tr>
            <tr class="bg-gray-100 font-bold">
              <td class="border p-2">Total per Assessment:</td>
              <td v-for="assessment in assessments" :key="assessment.id" class="border p-2 text-right" :class="getAssessmentEmphasisTotal(assessment.id) === 100 ? 'text-success' : 'text-warning'">
                {{ getAssessmentEmphasisTotal(assessment.id).toFixed(1) }}%
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'

const wrapperClass = "mx-auto mt-4 p-4 max-w-[1200px]"

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
  if (allValues.length === 0 || value === 0) {
    return { backgroundColor: '#f9fafb' } // Very light gray for 0
  }
  
  const max = Math.max(...allValues)
  const min = Math.min(...allValues.filter(v => v > 0)) // Exclude 0s from min
  
  if (max === min) {
    // All values are the same
    return { 
      backgroundColor: '#86efac', // Light green
      color: '#000'
    }
  }
  
  // Normalize value between 0 and 1
  const normalized = (value - min) / (max - min)
  
  // Create a green gradient from light to dark
  // Light green: rgb(134, 239, 172) to Dark green: rgb(22, 101, 52)
  const r = Math.round(134 - (112 * normalized))
  const g = Math.round(239 - (138 * normalized))
  const b = Math.round(172 - (120 * normalized))
  
  // Use white text for darker backgrounds
  const textColor = normalized > 0.6 ? '#ffffff' : '#000000'
  
  return {
    backgroundColor: `rgb(${r}, ${g}, ${b})`,
    color: textColor
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
/* AU Theme Colors */
:root {
  --primary: #140F50;
  --secondary: #1448FF;
  --accent: #836BFF;
  --success: #0db009;
  --warning: #f18a2a;
}

/* Page Title - matches AU h1 styling */
.page-title {
  font-weight: 700;
  color: #140f50;
  font-size: 2rem;
  line-height: 1.2;
  margin-bottom: 1.5rem;
}

/* Section Headings - matches AU h2 styling */
.section-heading {
  font-weight: 700;
  color: #140f50;
  font-size: 1.5rem;
  line-height: 1.3;
  position: relative;
  padding-bottom: 0.5rem;
}

.section-heading::after {
  content: "";
  display: block;
  width: 36px;
  height: 5px;
  margin-top: 6px;
  background-color: #836BFF;
}

/* Primary Button - matches AU button styling */
.btn-primary {
  background-color: #140F50;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.btn-primary:hover {
  background-color: #0C0930;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Secondary Button for accordion toggle */
.btn-secondary {
  background-color: transparent;
  color: #140F50;
  padding: 0.5rem 1rem;
  border: 2px solid #140F50;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background-color: #140F50;
  color: white;
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

/* Success and Warning colors from AU theme */
.text-success {
  color: #0db009 !important;
}

.text-warning {
  color: #f18a2a !important;
}

/* Table styling */
table {
  font-size: 0.95rem;
  color: #140f50;
}

table thead tr {
  background-color: #F3F3F6;
}

table th {
  font-weight: 500;
  color: #140f50;
}

input {
  font-size: 0.9rem;
  color: #140f50;
  border: 1px solid #d4dade;
  border-radius: 4px;
}

input:focus {
  outline: none;
  border-color: #1448FF;
}

/* Number input styling */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  opacity: 1;
}

/* Remove button styling */
button.bg-red-500 {
  background-color: #cb2461;
  border-radius: 4px;
}

button.bg-red-500:hover {
  background-color: #a01d4e;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Section boxes */
section {
  border-radius: 4px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px;
}

/* Description text */
p {
  color: #140f50;
}

.text-sm {
  color: #586167;
}
</style>