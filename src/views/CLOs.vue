<template>
  <div class="clo-page">
    <div class="clo-hero">
      <div class="clo-hero-brand">
        <img src="@/assets/catLogo.png" width="80" class="clo-cat-logo" alt="The CAT"/>
        <div class="clo-hero-brand-text">
          <span class="clo-hero-brand-name">The CAT</span>
          <span class="clo-hero-brand-tagline">The Constructive Alignment Tool</span>
        </div>
      </div>
      <h1 class="clo-page-title">Pathway A: Learning Outcomes → Assignments</h1>
    </div>

    <div class="clo-container">

    <div class="clo-mode-toggle">
      <span class="clo-mode-label">Input mode</span>
      <div class="clo-mode-pills">
        <button
          class="clo-mode-pill"
          :class="{ 'clo-mode-pill-active': !visualMode }"
          @click="visualMode = false"
        >Numbers</button>
        <button
          class="clo-mode-pill"
          :class="{ 'clo-mode-pill-active': visualMode }"
          @click="visualMode = true"
        >Visuals</button>
      </div>
    </div>

    <div class="clo-tab-bar">
      <button
        v-for="(label, i) in tabLabels"
        :key="i"
        class="clo-tab"
        :class="{ 'clo-tab-active': currentTab === i }"
        @click="currentTab = i"
      >{{ label }}</button>
    </div>

    <!-- Tab 0: CLO Weightings -->
    <section class="clo-section" v-show="currentTab === 0">
      <div class="clo-section-header">
        <div>
          <h2 class="clo-section-heading">1. CLO Weightings</h2>
          <div class="clo-section-divider"></div>
        </div>
        <button @click="addCLO" class="clo-btn clo-btn-primary">
          Add CLO
        </button>
      </div>
      <div class="clo-instructions-toggle-bar">
        <button class="clo-btn-instructions-toggle" @click="showInstructions[0] = !showInstructions[0]">
          {{ showInstructions[0] ? 'Hide instructions' : 'Show instructions' }}
        </button>
      </div>
      <div v-show="showInstructions[0]" class="clo-instructions">
        <ol class="list-decimal ml-4">
          <li>Click <strong>Add CLO</strong> to add each course learning outcome.</li>
          <li>Select your <strong>input mode</strong> using the toggle (top right). <strong>Visual mode</strong> adds sliders alongside the numbers, which is useful for a sense check. <strong>Numbers mode</strong> lets you type values directly.</li>
          <li>Estimate the <strong>relative importance</strong> of each CLO as percentages totalling 100%. Think about how much influence each outcome has across all of your assignments and their marking criteria, not just how much teaching time it receives.</li>
          <li>If using Visual mode, once the sliders are in place, you can adjust the numbers in the boxes directly to round off or even out the figures. If all CLOs are equally important, set equal weightings (e.g., 25% each for four CLOs). If a CLO supports progression but is tested less in assignments, its weighting should reflect its actual influence on the assessment, not its importance in the abstract.</li>
        </ol>
        <p class="clo-instructions-links">
          <a href="https://paulgmoss.github.io/The-CAT/stream-a-guide.html#clo-weightings" target="_blank" class="clo-placeholder-link">Detailed guidance: CLO weightings →</a>
        </p>
      </div>
      <p class="clo-section-description">
        Estimate the relative importance of each CLO in your course, expressed as percentages totalling 100%.
      </p>
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
                  v-if="!visualMode"
                  type="number"
                  min="0"
                  :max="maxWeightingFor(clo.id)"
                  :value="clo.weighting"
                  @change="setCLOWeighting(clo.id, $event.target.value)"
                  class="clo-input clo-input-sm clo-input-numeric"
                />
                <div v-else class="clo-slider-cell">
                  <div
                    class="clo-custom-slider"
                    @mousedown="startWeightDrag(clo.id, $event)"
                    @touchstart.prevent="startWeightDrag(clo.id, $event)"
                  >
                    <div class="clo-custom-track" :style="getSliderStyle(clo.weighting, maxWeightingFor(clo.id))"></div>
                    <div class="clo-custom-thumb" :style="{ left: clo.weighting + '%' }"></div>
                  </div>
                  <input
                    type="number"
                    min="0"
                    :max="maxWeightingFor(clo.id)"
                    :value="clo.weighting"
                    @change="setCLOWeighting(clo.id, $event.target.value)"
                    class="clo-input clo-input-sm clo-input-numeric clo-slider-number"
                  />
                </div>
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
              <td class="clo-td clo-td-right clo-td-bold" :class="Math.round(totalCLOWeighting) === 100 ? 'clo-status-success' : 'clo-status-warning'">
                {{ totalCLOWeighting.toFixed(1) }}%
              </td>
              <td class="clo-td"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Tab 1: CLO Mapping -->
    <div v-show="currentTab === 1">
    <section class="clo-section">
      <div class="clo-section-header">
        <div>
          <h2 class="clo-section-heading">2. CLO Mapping</h2>
          <div class="clo-section-divider"></div>
        </div>
        <button @click="addAssignment" class="clo-btn clo-btn-primary">
          Add Assignment
        </button>
      </div>
      <div class="clo-instructions-toggle-bar">
        <button class="clo-btn-instructions-toggle" @click="showInstructions[1] = !showInstructions[1]">
          {{ showInstructions[1] ? 'Hide instructions' : 'Show instructions' }}
        </button>
      </div>
      <div v-show="showInstructions[1]" class="clo-instructions">
        <ol class="list-decimal ml-4">
          <li>Click <strong>Add Assignment</strong> to add each summative assignment in your course. If your course groups assignments (e.g., Assignments 1 and 2 share a combined weighting of 30%), add each assignment individually and map them as normal. When reading the outputs in Tab 3, check that the grouped assignments' totals combined match your intended group weighting.</li>
          <li>Select your <strong>input mode</strong> using the toggle (top right). Visual mode adds sliders so you can drag to show whether one assignment is more, less, or equally important for a CLO. <strong>Numbers mode</strong> lets you type specific values, which is useful when you want to express a progression (e.g., 30% of the CLO is assessable in Assignment 1, 60% by Assignment 2, 100% by Assignment 3).</li>
          <li>Work one CLO at a time. Click a CLO row to activate it, then use the <strong>Demand</strong> row to distribute its Tab 1 CLO-weighting budget across assignments. You can enter it <strong>directly</strong> as percentages: a CLO worth 30% could be entered as 5 / 10 / 15. Or enter values <strong>proportionally</strong>: 1 / 1 / 2 distributes that same 30% as 7.5% / 7.5% / 15%. If a CLO is not assessed in an assignment, enter <strong>0</strong>.</li>
          <li>Use the <strong>Readiness</strong> slider to show how much of the CLO has been taught and is available to assess by each assignment. Readiness carries forward: later assignments cannot be set lower than an earlier one.</li>
          <li>The marker on each readiness bar shows the proportion of the CLO's assessment demand that has accumulated by that point. It is calculated from the cumulative demand divided by the CLO's course-weighting budget.</li>
          <li>You can use different modes for different CLOs. Use sliders for demand where relative importance is intuitive, then switch to Numbers for a CLO that follows a progression. The values carry over when you switch.</li>
        </ol>
        <p class="clo-instructions-links">
          <a href="https://paulgmoss.github.io/The-CAT/stream-a-guide.html#clo-mapping" target="_blank" class="clo-placeholder-link">Detailed guidance: CLO mapping →</a>
        </p>
      </div>
      <p class="clo-section-description">
        Map the relative importance of each CLO across your assignment tasks.
      </p>
      <div class="clo-table-wrapper">
        <table class="clo-table">
          <thead>
            <tr>
              <th class="clo-th clo-th-left">CLO</th>
              <th class="clo-th clo-th-left">Measure</th>
              <th v-for="assignment in assignments" :key="assignment.id" class="clo-th clo-th-center">
                <div class="clo-assignment-header-cell">
                  <input 
                    v-model="assignment.name" 
                    type="text" 
                    class="clo-input clo-input-sm"
                    placeholder="Assignment name"
                  />
                  <button 
                    @click="removeAssignment(assignment.id)" 
                    class="clo-btn clo-btn-danger clo-btn-xs"
                    :disabled="assignments.length === 1"
                  >
                    Remove
                  </button>
                </div>
              </th>
         
            </tr>
          </thead>
          <tbody>
            <template v-for="(clo, index) in clos" :key="clo.id">
              <tr
                class="clo-mapping-row clo-readiness-row"
                :class="{ 'clo-mapping-row-active': activeCLOIndex === index, 'clo-mapping-row-dim': activeCLOIndex !== index }"
                @click="activeCLOIndex = index"
              >
                <td rowspan="2" class="clo-td clo-td-bold clo-td-row-header clo-clo-cell">CLO {{ index + 1 }}</td>
                <td class="clo-td clo-mapping-measure">
                  <span>Readiness</span>
                  <small>available to assess</small>
                </td>
                <td v-for="(assignment, assignmentIndex) in assignments" :key="assignment.id" class="clo-td clo-readiness-cell">
                  <div class="clo-readiness-control">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="1"
                      :min="getReadinessMinimum(clo.id, assignmentIndex)"
                      :value="getReadiness(clo.id, assignment.id)"
                      :style="{ '--readiness': getReadiness(clo.id, assignment.id) + '%' }"
                      :aria-label="`Readiness for CLO ${index + 1} by ${assignment.name || 'assignment ' + (assignmentIndex + 1)}`"
                      class="clo-readiness-slider"
                      @input="setReadiness(clo.id, assignment.id, $event.target.value)"
                    />
                    <span
                      class="clo-readiness-target"
                      :style="{ left: getReadinessTarget(clo.id, assignment.id) + '%' }"
                      :title="`Assessment demand by this point: ${getReadinessTarget(clo.id, assignment.id).toFixed(0)}%`"
                      aria-hidden="true"
                    ></span>
                    <span class="clo-readiness-value" :class="{ 'clo-readiness-value-dark': getReadiness(clo.id, assignment.id) < 20 }">{{ getReadiness(clo.id, assignment.id) }}%</span>
                  </div>
                  <small v-if="assignmentIndex > 0 && getReadiness(clo.id, assignment.id) === getReadiness(clo.id, assignments[assignmentIndex - 1].id)" class="clo-readiness-carried">
                    Carried forward · demand by here: {{ getReadinessTarget(clo.id, assignment.id).toFixed(0) }}%
                  </small>
                  <small v-else class="clo-readiness-needed">
                    Demand by here: {{ getReadinessTarget(clo.id, assignment.id).toFixed(0) }}%
                  </small>
                </td>
              </tr>
              <tr
                class="clo-mapping-row clo-demand-row"
                :class="{ 'clo-mapping-row-active': activeCLOIndex === index, 'clo-mapping-row-dim': activeCLOIndex !== index }"
                @click="activeCLOIndex = index"
              >
              <td class="clo-td clo-mapping-measure">
                <span>Demand</span>
                <small>relative assessment share</small>
              </td>
              <td v-for="assignment in assignments" :key="assignment.id" class="clo-td">
                <input
                  v-if="!visualMode"
                  :value="getRawValue(clo.id, assignment.id)"
                  @input="setRawValue(clo.id, assignment.id, parseFloat($event.target.value) || 0)"
                  type="number"
                  min="0"
                  step="any"
                  class="clo-input clo-input-sm clo-input-numeric"
                />
                <div v-else class="clo-slider-cell">
                  <div
                    class="clo-custom-slider"
                    @mousedown="startMappingDrag(clo.id, assignment.id, $event)"
                    @touchstart.prevent="startMappingDrag(clo.id, assignment.id, $event)"
                  >
                    <div class="clo-custom-track" :style="getSliderStyle(getRawValue(clo.id, assignment.id))"></div>
                    <div class="clo-custom-thumb" :style="{ left: Math.min(100, getRawValue(clo.id, assignment.id)) + '%' }"></div>
                  </div>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    :value="getRawValue(clo.id, assignment.id)"
                    @input="setRawValue(clo.id, assignment.id, parseFloat($event.target.value) || 0)"
                    class="clo-input clo-input-sm clo-input-numeric clo-slider-number"
                  />
                </div>
              </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </section>

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
            inputs converted to percentages for each CLO across all assignments.
          </p>
          <div class="clo-table-wrapper">
            <table class="clo-table">
              <thead>
                <tr>
                  <th class="clo-th clo-th-left">CLO</th>
                  <th v-for="assignment in assignments" :key="assignment.id" class="clo-th clo-th-center">
                    {{ assignment.name || 'Assignment ' + assignment.id }}
                  </th>
                  <th class="clo-th clo-th-center clo-th-highlight">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(clo, index) in clos" :key="clo.id">
                  <td class="clo-td clo-td-bold clo-td-row-header">CLO {{ index + 1 }}</td>
                  <td v-for="assignment in assignments" :key="assignment.id" class="clo-td clo-td-right clo-td-scaled">
                    {{ getScaledPercentage(clo.id, assignment.id).toFixed(1) }}%
                  </td>
                  <td class="clo-td clo-td-right clo-td-bold clo-td-row-header" :class="Math.round(getCLOScaledTotal(clo.id)) === 100 ? 'clo-status-success' : 'clo-status-warning'">
                    {{ getCLOScaledTotal(clo.id) }}%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </transition>
    </section>
    </div>
    <!-- Tab 2: Assignment Weightings -->
    <section class="clo-section" v-show="currentTab === 2">
      <div class="clo-section-header">
        <div>
          <h2 class="clo-section-heading">3. Assignment Weightings</h2>
          <div class="clo-section-divider"></div>
        </div>
      </div>
      <div class="clo-instructions-toggle-bar">
        <button class="clo-btn-instructions-toggle" @click="showInstructions[2] = !showInstructions[2]">
          {{ showInstructions[2] ? 'Hide instructions' : 'Show instructions' }}
        </button>
      </div>
      <div v-show="showInstructions[2]" class="clo-instructions">
        <ol class="list-decimal ml-4">
          <li>Review the estimated weightings for each assignment, shown as a percentage of the overall course grade. Round to the nearest 5% when reading the totals.</li>
          <li>Ask yourself: does this distribution match what you intended? You can use this to either inform the assignment weightings of a course you are designing, or to verify whether the weightings of an existing course align with your CLO distribution.</li>
          <li>If there is a significant discrepancy, go back to CLO Weightings or CLO Mapping to adjust your inputs. The outputs will update instantly.</li>
        </ol>
        <p class="clo-instructions-links">
          <a href="https://paulgmoss.github.io/The-CAT/stream-a-guide.html#assignment-weightings" target="_blank" class="clo-placeholder-link">Detailed guidance: reading the outputs →</a> ·
          <a href="https://paulgmoss.github.io/The-CAT/stream-a-guide.html#iterate" target="_blank" class="clo-placeholder-link">Detailed guidance: how to iterate →</a>
        </p>
      </div>
      <p class="clo-section-description">
        The estimated weighting of each assignment as a percentage of the overall course grade.
      </p>
      <div class="clo-table-wrapper">
        <table class="clo-table clo-results-table">
          <thead>
            <tr>
              <th class="clo-th clo-th-left">CLO</th>
              <th v-for="assignment in assignments" :key="assignment.id" class="clo-th clo-th-center">
                {{ assignment.name || 'Assignment ' + assignment.id }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(clo, index) in clos" :key="clo.id">
              <td class="clo-td clo-td-bold clo-td-row-header">CLO {{ index + 1 }}</td>
              <td v-for="assignment in assignments" :key="assignment.id" class="clo-td clo-td-right clo-td-heatmap" :style="getHeatmapStyle(getCourseContribution(clo.id, assignment.id))">
                {{ getCourseContribution(clo.id, assignment.id).toFixed(2) }}%
              </td>
            </tr>
            <tr class="clo-table-footer clo-table-footer-highlight">
              <td class="clo-td clo-td-bold">Assignment Total:</td>
              <td v-for="assignment in assignments" :key="assignment.id" class="clo-td clo-td-right clo-td-bold">
                {{ getAssignmentTotal(assignment.id).toFixed(2) }}%
              </td>
            </tr>
          </tbody>
        </table>
        <div class="clo-callout clo-callout-highlight">
          <p class="clo-callout-text">
            Grand Total: 
            <span :class="Math.round(grandTotal) === 100 ? 'clo-status-success' : 'clo-status-warning'">
              {{ grandTotal.toFixed(2) }}%
            </span>
            <span class="clo-callout-note">(Should equal 100%)</span>
          </p>
        </div>
      </div>
    </section>

    <!-- Tab 3: Marking Guide / Rubric Composition -->
    <section class="clo-section" v-show="currentTab === 3">
      <div class="clo-section-header">
        <div>
          <h2 class="clo-section-heading">4. Marking Guide / Rubric Composition</h2>
          <div class="clo-section-divider"></div>
        </div>
      </div>
      <div class="clo-instructions-toggle-bar">
        <button class="clo-btn-instructions-toggle" @click="showInstructions[3] = !showInstructions[3]">
          {{ showInstructions[3] ? 'Hide instructions' : 'Show instructions' }}
        </button>
      </div>
      <div v-show="showInstructions[3]" class="clo-instructions">
        <ol class="list-decimal ml-4">
          <li>Read each column as one assignment's breakdown. For example, if CLO 1 shows 40% in Assignment 1, it means the criteria mapped to CLO 1 should account for approximately 40% of that assignment's marks (whether that is one criterion or several).</li>
          <li>The highlighted cells show where each CLO has its strongest influence. Ask yourself: does this composition make sense for how you would design the marking criteria?</li>
          <li>If a CLO appears in an assignment you did not expect, or if the emphasis feels wrong, go back to CLO Weightings or CLO Mapping to adjust.</li>
        </ol>
        <p class="clo-instructions-links">
          <a href="https://paulgmoss.github.io/The-CAT/stream-a-guide.html#rubric-composition" target="_blank" class="clo-placeholder-link">Detailed guidance: reading the outputs →</a> ·
          <a href="https://paulgmoss.github.io/The-CAT/stream-a-guide.html#iterate" target="_blank" class="clo-placeholder-link">Detailed guidance: how to iterate →</a>
        </p>
      </div>
      <p class="clo-section-description">
        The percentage emphasis each CLO should have within each individual assignment.
      </p>
      <div class="clo-table-wrapper">
        <table class="clo-table clo-results-table">
          <thead>
            <tr>
              <th class="clo-th clo-th-left">CLO</th>
              <th v-for="assignment in assignments" :key="assignment.id" class="clo-th clo-th-center">
                {{ assignment.name || 'Assignment ' + assignment.id }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(clo, index) in clos" :key="clo.id">
              <td class="clo-td clo-td-bold clo-td-row-header">CLO {{ index + 1 }}</td>
              <td v-for="assignment in assignments" :key="assignment.id" class="clo-td clo-td-right clo-td-heatmap" :style="getHeatmapStyle(getCLOEmphasis(clo.id, assignment.id))">
                {{ getCLOEmphasis(clo.id, assignment.id).toFixed(1) }}%
              </td>
            </tr>
            <tr class="clo-table-footer">
              <td class="clo-td clo-td-bold">Total per Assignment:</td>
              <td v-for="assignment in assignments" :key="assignment.id" class="clo-td clo-td-right clo-td-bold" :class="Math.round(getAssignmentEmphasisTotal(assignment.id)) === 100 ? 'clo-status-success' : 'clo-status-warning'">
                {{ getAssignmentEmphasisTotal(assignment.id).toFixed(1) }}%
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
    
    <div class="clo-tab-nav">
      <button v-if="currentTab > 0" class="clo-btn clo-btn-secondary" @click="currentTab--">← Back</button>
      <span v-else></span>
      <button v-if="currentTab < 3" class="clo-btn clo-btn-primary" @click="currentTab++">
        Continue to {{ tabLabels[currentTab + 1] }} →
      </button>
    </div>

    <div class="clo-notes-section">
      <div class="clo-notes-header">
        <label class="clo-notes-label" for="clo-notes-a">Design Rationale / Notes</label>
        <button class="clo-btn clo-btn-secondary" @click="exportCSV">Download CSV</button>
      </div>
      <textarea
        id="clo-notes-a"
        v-model="notes"
        class="clo-notes-textarea"
        placeholder="Record your design decisions and rationale here. Please specify the table number - this will be included in your CSV export."
        rows="5"
      ></textarea>
    </div>

    </div>  </div></template>

<script setup>
import { ref, computed, reactive, onMounted, watch } from 'vue'
import { useAnalytics } from '@/composables/useAnalytics'

const { trackEvent, trackFunnelStep, trackCompletion, trackExport } = useAnalytics()

onMounted(() => {
  document.title = 'Pathway A: Learning Outcomes → Assignments'
  trackEvent('activity_started')
})

const showSection2A = ref(false)
const visualMode = ref(false)
const currentTab = ref(0)
const tabLabels = ['1. CLO Weightings', '2. CLO Mapping', '3. Assignment Weightings', '4. Marking Guide / Rubric Composition']
const showInstructions = ref([false, false, false, false])
const activeCLOIndex = ref(0)
const notes = ref('')
const hasTrackedCompletion = ref(false)

watch(currentTab, (tab) => {
  if (tab === 1) trackFunnelStep(25)
  else if (tab === 2) trackFunnelStep(50)
  else if (tab === 3) {
    trackFunnelStep(75)
    if (!hasTrackedCompletion.value) {
      hasTrackedCompletion.value = true
      trackCompletion({ clo_count: clos.value.length, assignment_count: assignments.value.length })
    }
  }
})

const clos = ref([
  { id: 1, name: 'CLO 1', weighting: 100 }
])

const assignments = ref([
  { id: 1, name: 'Assignment 1' }
])

const rawValues = reactive({})
const readinessValues = reactive({})

let nextCLOId = 2
let nextAssignmentId = 2

const getRawValue = (cloId, assignmentId) => {
  const key = `${cloId}-${assignmentId}`
  if (!rawValues[key]) {
    rawValues[key] = 0
  }
  return rawValues[key]
}

const setRawValue = (cloId, assignmentId, value) => {
  const key = `${cloId}-${assignmentId}`
  rawValues[key] = value
}

const getReadiness = (cloId, assignmentId) => {
  return readinessValues[`${cloId}-${assignmentId}`] ?? 0
}

const getReadinessMinimum = (cloId, assignmentIndex) => {
  if (assignmentIndex === 0) return 0
  return getReadiness(cloId, assignments.value[assignmentIndex - 1].id)
}

const setReadiness = (cloId, assignmentId, value) => {
  const assignmentIndex = assignments.value.findIndex(assignment => assignment.id === assignmentId)
  if (assignmentIndex === -1) return

  const minimum = getReadinessMinimum(cloId, assignmentIndex)
  const readiness = Math.min(100, Math.max(minimum, Math.round(parseFloat(value) || 0)))
  readinessValues[`${cloId}-${assignmentId}`] = readiness

  // A later assessment cannot assume less readiness than an earlier one.
  assignments.value.slice(assignmentIndex + 1).forEach(assignment => {
    const key = `${cloId}-${assignment.id}`
    if ((readinessValues[key] ?? 0) < readiness) readinessValues[key] = readiness
  })
}

const totalCLOWeighting = computed(() => {
  return clos.value.reduce((sum, clo) => sum + (clo.weighting || 0), 0)
})

const maxWeightingFor = (cloId) => {
  const othersTotal = clos.value.reduce((sum, c) => c.id === cloId ? sum : sum + (c.weighting || 0), 0)
  return Math.max(0, 100 - othersTotal)
}

const setCLOWeighting = (cloId, value) => {
  const clo = clos.value.find(c => c.id === cloId)
  if (clo) clo.weighting = Math.min(maxWeightingFor(cloId), Math.max(0, parseFloat(value) || 0))
}

const getCLOTotal = (cloId) => {
  return assignments.value.reduce((sum, assignment) => {
    return sum + (getRawValue(cloId, assignment.id) || 0)
  }, 0)
}

const getScaledPercentage = (cloId, assignmentId) => {
  const total = getCLOTotal(cloId)
  if (total === 0) return 0
  const rawValue = getRawValue(cloId, assignmentId) || 0
  return (rawValue / total) * 100
}

const getCLOScaledTotal = (cloId) => {
  const total = assignments.value.reduce((sum, assignment) => {
    return sum + getScaledPercentage(cloId, assignment.id)
  }, 0)
  return Math.round(total)
}

const getCourseContribution = (cloId, assignmentId) => {
  const clo = clos.value.find(c => c.id === cloId)
  if (!clo) return 0
  const scaledPercentage = getScaledPercentage(cloId, assignmentId)
  return (scaledPercentage / 100) * (clo.weighting || 0)
}

const getReadinessTarget = (cloId, assignmentId) => {
  const clo = clos.value.find(c => c.id === cloId)
  const assignmentIndex = assignments.value.findIndex(assignment => assignment.id === assignmentId)
  if (!clo || !clo.weighting || assignmentIndex === -1) return 0

  const cumulativeDemand = assignments.value
    .slice(0, assignmentIndex + 1)
    .reduce((sum, assignment) => sum + getCourseContribution(cloId, assignment.id), 0)

  return Math.min(100, (cumulativeDemand / clo.weighting) * 100)
}

const getAssignmentTotal = (assignmentId) => {
  return clos.value.reduce((sum, clo) => {
    return sum + getCourseContribution(clo.id, assignmentId)
  }, 0)
}

const grandTotal = computed(() => {
  return assignments.value.reduce((sum, assignment) => {
    return sum + getAssignmentTotal(assignment.id)
  }, 0)
})

const getCLOEmphasis = (cloId, assignmentId) => {
  const assignmentTotal = getAssignmentTotal(assignmentId)
  if (assignmentTotal === 0) return 0
  const contribution = getCourseContribution(cloId, assignmentId)
  return (contribution / assignmentTotal) * 100
}

const getAssignmentEmphasisTotal = (assignmentId) => {
  return clos.value.reduce((sum, clo) => {
    return sum + getCLOEmphasis(clo.id, assignmentId)
  }, 0)
}

const getHeatmapStyle = (value) => {
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

// availableMax: the cap for this slider (0-100). Remaining is "locked" by other CLOs.
const getSliderStyle = (value, availableMax = 100) => {
  const v = Math.min(100, Math.max(0, value))
  const a = Math.min(100, Math.max(0, availableMax))
  // Two visible zones + invisible locked area: filled | available | transparent
  return {
    background: `linear-gradient(to right,
      #140F50 0%, #140F50 ${v}%,
      #ddd8f8 ${v}%, #ddd8f8 ${a}%,
      transparent ${a}%, transparent 100%)`
  }
}

const clientXOf = (e) => e.touches ? e.touches[0].clientX : e.clientX

const startDrag = (event, onPosition) => {
  event.preventDefault()
  const rect = event.currentTarget.getBoundingClientRect()

  const applyPosition = (clientX) => {
    const pct = Math.round(Math.min(100, Math.max(0, (clientX - rect.left) / rect.width * 100)))
    onPosition(pct)
  }

  applyPosition(clientXOf(event))

  const onMove = (e) => applyPosition(clientXOf(e))
  const onUp = () => {
    window.removeEventListener('mousemove', onMove)
    window.removeEventListener('mouseup', onUp)
    window.removeEventListener('touchmove', onMove)
    window.removeEventListener('touchend', onUp)
  }
  window.addEventListener('mousemove', onMove)
  window.addEventListener('mouseup', onUp)
  window.addEventListener('touchmove', onMove, { passive: false })
  window.addEventListener('touchend', onUp)
}

const startWeightDrag = (cloId, event) => startDrag(event, (pct) => setCLOWeighting(cloId, pct))

const startMappingDrag = (cloId, assignmentId, event) => startDrag(event, (pct) => setRawValue(cloId, assignmentId, pct))

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
    assignments.value.forEach(assignment => {
      const key = `${cloId}-${assignment.id}`
      delete rawValues[key]
      delete readinessValues[key]
    })
    clos.value.splice(index, 1)
    if (activeCLOIndex.value >= clos.value.length) {
      activeCLOIndex.value = Math.max(0, clos.value.length - 1)
    }
  }
}

const addAssignment = () => {
  const id = nextAssignmentId++
  assignments.value.push({
    id,
    name: `Assignment ${assignments.value.length + 1}`
  })
  clos.value.forEach(clo => {
    const precedingAssignment = assignments.value[assignments.value.length - 2]
    readinessValues[`${clo.id}-${id}`] = precedingAssignment
      ? getReadiness(clo.id, precedingAssignment.id)
      : 0
  })
}

const removeAssignment = (assignmentId) => {
  if (assignments.value.length > 1) {
    // Remove associated raw values
    clos.value.forEach(clo => {
      const key = `${clo.id}-${assignmentId}`
      delete rawValues[key]
      delete readinessValues[key]
    })
    assignments.value = assignments.value.filter(a => a.id !== assignmentId)
  }
}

const exportCSV = () => {
  const cell = (v) => {
    const s = String(v ?? '')
    return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s.replace(/"/g, '""')}"` : s
  }
  const row = (cells) => cells.map(cell).join(',')
  const lines = []
  const date = new Date().toLocaleDateString('en-AU')

  lines.push(row(['CAT — Pathway A: Learning Outcomes → Assignments']))
  lines.push(row([`Exported: ${date}`]))
  lines.push('')

  lines.push(row(['Section 1: CLO Weightings']))
  lines.push(row(['CLO', 'Name', 'Weighting (%)']))
  clos.value.forEach((clo, i) => lines.push(row([`CLO ${i + 1}`, clo.name, clo.weighting])))
  lines.push(row(['', 'Total:', totalCLOWeighting.value.toFixed(1) + '%']))
  lines.push('')

  const aNames = assignments.value.map(a => a.name || `Assignment ${a.id}`)
  lines.push(row(['Section 2: CLO Mapping (Readiness and Demand)']))
  lines.push(row(['CLO', 'Measure', ...aNames, 'Total']))
  clos.value.forEach((clo, i) => {
    lines.push(row([`CLO ${i + 1}`, 'Readiness (%)', ...assignments.value.map(a => getReadiness(clo.id, a.id) + '%'), '']))
    lines.push(row(['', 'Demand (raw)', ...assignments.value.map(a => getRawValue(clo.id, a.id)), getCLOTotal(clo.id).toFixed(2)]))
  })
  lines.push('')

  lines.push(row(['Section 3: Assignment Weightings']))
  lines.push(row(['CLO', ...aNames]))
  clos.value.forEach((clo, i) => {
    lines.push(row([`CLO ${i + 1}`, ...assignments.value.map(a => getCourseContribution(clo.id, a.id).toFixed(2) + '%')]))
  })
  lines.push(row(['Assignment Total', ...assignments.value.map(a => getAssignmentTotal(a.id).toFixed(2) + '%')]))
  lines.push(row(['Grand Total', grandTotal.value.toFixed(2) + '%']))
  lines.push('')

  lines.push(row(['Section 4: Marking Guide / Rubric Composition']))
  lines.push(row(['CLO', ...aNames]))
  clos.value.forEach((clo, i) => {
    lines.push(row([`CLO ${i + 1}`, ...assignments.value.map(a => getCLOEmphasis(clo.id, a.id).toFixed(1) + '%')]))
  })
  lines.push(row(['Total per Assignment', ...assignments.value.map(a => getAssignmentEmphasisTotal(a.id).toFixed(1) + '%')]))
  lines.push('')

  lines.push(row(['Notes']))
  lines.push(row([notes.value || '(no notes)']))

  const csv = lines.join('\n')
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'CAT-Pathway-A.csv'
  a.click()
  URL.revokeObjectURL(url)

  trackExport({ format: 'csv', tool: 'pathway_a', clo_count: clos.value.length, assignment_count: assignments.value.length })
}
</script>

<style scoped>
:global(:root) {
  /* Purple Brand Colors */
  --clo-ink: #140F50;
  --clo-ink-light: #3b3768;
  --clo-ink-muted: #6b6790;
  
  /* Warm Backgrounds */
  --clo-bg: #f5f2ec;
  --clo-bg-warm: #ede9e0;
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

.clo-hero-brand {
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: var(--clo-space-sm);
}

.clo-cat-logo {
  transform: scaleX(-1);
}

.clo-hero-brand-text {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.clo-hero-brand-name {
  font-family: var(--clo-font-display);
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--clo-ink);
  line-height: 1.15;
}

.clo-hero-brand-tagline {
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: var(--clo-accent-b);
}

.clo-instructions-toggle-bar {
  margin-bottom: 0.6rem;
}

.clo-btn-instructions-toggle {
  font-family: var(--clo-font-body);
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--clo-accent-b);
  background: none;
  border: 1px solid var(--clo-border);
  border-radius: var(--clo-radius-xs);
  padding: 4px 14px;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;
}

.clo-btn-instructions-toggle:hover {
  background: var(--clo-bg-warm);
  color: var(--clo-ink);
}

/* Main Container */
.clo-container {
  max-width: var(--clo-w-max);
  margin: 0 auto;
  padding: 0 var(--clo-space-md);
  position: relative;
  z-index: 1;
}

.clo-section {
  background: var(--clo-surface);
  border: 1px solid var(--clo-border);
  border-top: 3px solid var(--clo-accent-b);
  border-radius: var(--clo-radius);
  padding: var(--clo-space-md);
  margin-bottom: var(--clo-space-md);
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

/* Highlighted footer row (totals) */
.clo-table-footer-highlight .clo-td {
  background: var(--clo-accent-a);
  color: #fff;
  border-color: var(--clo-accent-a);
}

.clo-table-footer-highlight .clo-td:first-child {
  border-bottom-left-radius: var(--clo-radius);
}

.clo-table-footer-highlight .clo-td:last-child {
  border-bottom-right-radius: var(--clo-radius);
}

.clo-results-table .clo-td {
  min-width: 100px;
}

/* Assignment header cell in table */
.clo-assignment-header-cell {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: stretch;
}

.clo-callout {
  background: linear-gradient(135deg, var(--clo-accent-b-soft), var(--clo-bg-warm));
  border-radius: var(--clo-radius);
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

.clo-status-success {
  color: var(--clo-success);
  font-weight: 600;
}

.clo-status-warning {
  color: var(--clo-warning);
  font-weight: 600;
}

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

.clo-mode-toggle {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  margin-bottom: var(--clo-space-md);
}

.clo-mode-label {
  font-size: 0.82rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: var(--clo-ink-muted);
}

.clo-mode-pills {
  display: flex;
  background: var(--clo-bg-warm);
  border: 1px solid var(--clo-border);
  border-radius: 20px;
  padding: 3px;
  gap: 2px;
}

.clo-mode-pill {
  font-family: var(--clo-font-body);
  font-size: 0.85rem;
  font-weight: 600;
  padding: 5px 16px;
  border: none;
  border-radius: 16px;
  cursor: pointer;
  background: transparent;
  color: var(--clo-ink-muted);
  transition: background 0.2s ease, color 0.2s ease;
}

.clo-mode-pill:hover:not(.clo-mode-pill-active) {
  color: var(--clo-ink);
  background: rgba(20,15,80,0.06);
}

.clo-mode-pill-active {
  background: var(--clo-accent-a);
  color: #fff;
}

.clo-slider-cell {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 180px;
}

.clo-custom-slider {
  flex: 1;
  position: relative;
  height: 24px;
  cursor: pointer;
  user-select: none;
}

.clo-custom-track {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  transform: translateY(-50%);
  height: 6px;
  border-radius: 3px;
}

.clo-custom-thumb {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--clo-accent-a);
  border: 2px solid #fff;
  box-shadow: 0 1px 4px rgba(20,15,80,0.3);
  cursor: grab;
  transition: box-shadow 0.15s ease, transform 0.1s ease;
  pointer-events: none;
}

.clo-custom-slider:hover .clo-custom-thumb {
  box-shadow: 0 0 0 5px rgba(20,15,80,0.12), 0 1px 4px rgba(20,15,80,0.3);
  transform: translate(-50%, -50%) scale(1.15);
}

.clo-custom-slider:active .clo-custom-thumb {
  cursor: grabbing;
  box-shadow: 0 0 0 7px rgba(20,15,80,0.1), 0 1px 4px rgba(20,15,80,0.3);
}

.clo-slider-number {
  width: 62px;
  flex-shrink: 0;
}

.clo-mapping-measure {
  min-width: 135px;
  background: #fbfaff;
  color: var(--clo-ink);
  font-weight: 600;
  vertical-align: middle;
}

.clo-mapping-measure span,
.clo-mapping-measure small {
  display: block;
}

.clo-mapping-measure small,
.clo-readiness-carried,
.clo-readiness-needed {
  margin-top: 3px;
  color: var(--clo-ink-muted);
  font-size: 0.72rem;
  font-weight: 400;
  line-height: 1.25;
}

.clo-clo-cell {
  vertical-align: middle;
}

.clo-readiness-cell {
  min-width: 180px;
  padding-bottom: 8px;
}

.clo-readiness-control {
  position: relative;
  display: flex;
  align-items: center;
  min-height: 30px;
}

.clo-readiness-slider {
  --readiness: 0%;
  width: 100%;
  height: 26px;
  margin: 0;
  appearance: none;
  background: transparent;
  cursor: pointer;
}

.clo-readiness-slider::-webkit-slider-runnable-track {
  height: 20px;
  border: 1px solid #cfc8ee;
  border-radius: 3px;
  background: linear-gradient(to right, var(--clo-accent-b) 0 var(--readiness), #f5f2ff var(--readiness) 100%);
}

.clo-readiness-slider::-moz-range-track {
  height: 20px;
  border: 1px solid #cfc8ee;
  border-radius: 3px;
  background: linear-gradient(to right, var(--clo-accent-b) 0 var(--readiness), #f5f2ff var(--readiness) 100%);
}

.clo-readiness-slider::-webkit-slider-thumb {
  width: 10px;
  height: 26px;
  margin-top: -4px;
  appearance: none;
  border: 0;
  border-radius: 2px;
  background: transparent;
}

.clo-readiness-slider::-moz-range-thumb {
  width: 10px;
  height: 26px;
  border: 0;
  border-radius: 2px;
  background: transparent;
}

.clo-readiness-slider:focus-visible {
  outline: 3px solid rgba(131,107,255,0.42);
  outline-offset: 3px;
  border-radius: 3px;
}

.clo-readiness-target {
  position: absolute;
  top: 4px;
  bottom: 4px;
  width: 2px;
  transform: translateX(-1px);
  border-radius: 2px;
  background: var(--clo-ink);
  box-shadow: 0 0 0 1px rgba(255,255,255,0.82);
  pointer-events: none;
}

.clo-readiness-value {
  position: absolute;
  left: 9px;
  z-index: 1;
  color: #fff;
  font-size: 0.75rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  pointer-events: none;
}

.clo-readiness-value-dark {
  color: var(--clo-ink);
}

.clo-readiness-carried {
  color: var(--clo-accent-b);
}

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

.clo-notes-section {
  margin-top: var(--clo-space-md);
  background: var(--clo-surface);
  border: 1px solid var(--clo-border);
  border-top: 3px solid var(--clo-border);
  border-radius: var(--clo-radius);
  padding: var(--clo-space-md);
}

.clo-notes-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  flex-wrap: wrap;
  gap: var(--clo-space-sm);
}

.clo-notes-label {
  font-family: var(--clo-font-display);
  font-weight: 500;
  font-size: 1.1rem;
  color: var(--clo-ink);
}

.clo-notes-textarea {
  width: 100%;
  font-family: var(--clo-font-body);
  font-size: 0.95rem;
  color: var(--clo-ink);
  background: var(--clo-bg);
  border: 1px solid var(--clo-border);
  border-radius: var(--clo-radius-sm);
  padding: 10px 12px;
  resize: vertical;
  line-height: 1.6;
  box-sizing: border-box;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.clo-notes-textarea:focus {
  outline: none;
  border-color: var(--clo-highlight);
  box-shadow: 0 0 0 3px rgba(131,107,255,0.1);
}

.clo-tab-bar {
  display: flex;
  gap: 0;
  border-bottom: 2px solid var(--clo-border);
  margin-bottom: var(--clo-space-md);
  overflow-x: auto;
  scrollbar-width: none;
}

.clo-tab-bar::-webkit-scrollbar {
  display: none;
}

.clo-tab {
  font-family: var(--clo-font-body);
  font-size: 0.9rem;
  font-weight: 500;
  padding: 0.75rem 1.25rem;
  border: none;
  background: transparent;
  color: var(--clo-ink);
  opacity: 0.45;
  border-bottom: 3px solid transparent;
  margin-bottom: -2px;
  white-space: nowrap;
  cursor: pointer;
  transition: opacity 0.2s ease, border-color 0.2s ease;
}

.clo-tab:hover {
  opacity: 0.75;
}

.clo-tab-active {
  opacity: 1;
  border-bottom-color: var(--clo-ink);
  font-weight: 600;
}

.clo-instructions {
  border: 1px solid var(--clo-border);
  border-radius: var(--clo-radius);
  padding: 1rem 1.25rem;
  margin-bottom: var(--clo-space-md);
  font-size: 0.9rem;
  line-height: 1.65;
  color: var(--clo-ink-light);
}

.clo-instructions ul {
  padding-left: 1.25rem;
}

.clo-instructions li {
  margin-bottom: 0.3rem;
}

.clo-instructions-links {
  margin: 0;
  font-size: 0.85rem;
  color: var(--clo-ink-muted);
}

.clo-placeholder-link {
  color: var(--clo-accent-b);
  text-decoration: none;
  border-bottom: 1px dashed var(--clo-accent-b);
}

.clo-placeholder-link:hover {
  opacity: 0.75;
}

.clo-tab-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: var(--clo-space-md);
  padding-top: var(--clo-space-md);
  border-top: 1px solid var(--clo-border);
}

.clo-mapping-row {
  cursor: pointer;
  transition: opacity 0.25s ease;
}

.clo-mapping-row-dim {
  opacity: 1;
}

.clo-mapping-row-active .clo-clo-cell {
  border-left: 3px solid var(--clo-highlight);
}

.clo-mapping-row-active .clo-readiness-cell,
.clo-mapping-row-active .clo-mapping-measure {
  background-color: #fcfbff;
}
</style>
