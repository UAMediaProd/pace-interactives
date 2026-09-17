<template>
  <div class="clo-page">
    <div class="clo-hero">
      <div class="clo-hero-brand">
        <img src="@/assets/catLogo.png" width="54" class="clo-cat-logo" alt="The CAT"/>
        <div class="clo-hero-brand-text">
          <span class="clo-hero-brand-name">The CAT</span>
          <span class="clo-hero-brand-tagline">The Constructive Alignment Tool</span>
        </div>
      </div>
      <h1 class="clo-page-title">Pathway A: Learning Outcomes → Assignments</h1>
    </div>

    <div class="clo-container">

    <div class="clo-mode-toggle mt-4" role="group" aria-label="Input mode">
      <span class="clo-mode-label">Input mode</span>
      <div class="clo-mode-pills">
        <button
          class="clo-mode-pill"
          :class="{ 'clo-mode-pill-active': !visualMode }"
          :aria-pressed="!visualMode"
          @click="visualMode = false"
        >Numbers</button>
        <button
          class="clo-mode-pill"
          :class="{ 'clo-mode-pill-active': visualMode }"
          :aria-pressed="visualMode"
          @click="visualMode = true"
        >Visuals</button>
      </div>
    </div>

    <div class="clo-tab-bar" aria-label="Pathway A steps">
      <button
        v-for="(label, i) in tabLabels"
        :key="i"
        class="clo-tab"
        :class="{ 'clo-tab-active': currentTab === i }"
        :aria-current="currentTab === i ? 'step' : undefined"
        @click="currentTab = i"
      >{{ label }}</button>
    </div>
    <p class="clo-tab-scroll-cue">Scroll to view steps →</p>

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
        <button class="clo-btn-instructions-toggle" @click="showInstructions[0] = !showInstructions[0]" :aria-expanded="showInstructions[0]" aria-controls="clo-weightings-instructions">
          {{ showInstructions[0] ? 'Hide instructions' : 'Show instructions' }}
        </button>
      </div>
      <div id="clo-weightings-instructions" v-show="showInstructions[0]" class="clo-instructions">
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
                  <input
                    type="range"
                    min="0"
                    max="100"
                    :value="clo.weighting"
                    @input="$event.target.value = setCLOWeighting(clo.id, $event.target.value)"
                    :style="{ '--slider-value': clo.weighting + '%', '--slider-max': maxWeightingFor(clo.id) + '%' }"
                    :aria-valuemax="maxWeightingFor(clo.id)"
                    :aria-label="`Weighting for CLO ${index + 1}`"
                    class="clo-visual-slider"
                  />
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

    <!-- Tab 1: Teaching readiness (optional, preferred source) -->
    <section class="clo-section" v-show="currentTab === 1">
      <div class="clo-section-header">
        <div>
          <h2 class="clo-section-heading">2. Teaching readiness</h2>
          <div class="clo-section-divider"></div>
        </div>
      </div>
      <div v-if="!readinessTemplateEnabled" class="clo-readiness-opt-in">
        <div>
          <h3>Use the teaching readiness template?</h3>
          <p>Teaching readiness is a mapping exercise that links topics, relevant CLOs and assignment timing across the teaching weeks. It indicates how much of each CLO will be taught by the end of the week it is mapped to. Completing the teaching readiness template will auto populate the readiness indicators in the CLO mapping table and also generate a useful planning document that can guide the design and the decisions made in how resources might be allocated towards teaching and learning activities and the structure of the pages in the LMS. If you choose to skip this step, please go to the CLO mapping table (Tab 4), where you will be required to manually populate the readiness levels.</p>
        </div>
        <button @click="enableReadinessTemplate" class="clo-btn clo-btn-primary">Set up teaching readiness</button>
      </div>

      <div v-else>
        <div class="clo-readiness-template-note">
          Teaching readiness is a mapping exercise that links topics, relevant CLOs and assignment timing across the teaching weeks. It indicates how much of each CLO will be taught by the end of the week it is mapped to. Completing the teaching readiness template below will auto populate the readiness indicators in the CLO mapping table and also generate a useful planning document that can guide the design and the decisions made in how resources might be allocated towards teaching and learning activities and the structure of the pages in the LMS.
        </div>

        <article v-for="(week, weekIndex) in teachingWeeks" :key="week.id" class="clo-teaching-week">
          <header class="clo-teaching-week-header">
            <div class="clo-teaching-week-topline">
              <strong>Week {{ weekIndex + 1 }}</strong>
              <label class="clo-compact-field clo-week-topic-field"><span>Topic</span><input v-model="week.topic" class="clo-input clo-week-topic" type="text" :placeholder="`Topic or teaching focus for Week ${weekIndex + 1}`" /></label>
            </div>
            <div class="clo-teaching-week-actions">
              <button @click="removeTeachingWeek(weekIndex)" class="clo-inline-danger" :disabled="teachingWeeks.length === 1">Remove week</button>
            </div>
          </header>
          <p v-if="week.outcomes.length === 0" class="clo-empty-hint">Add each CLO that students meaningfully work with this week.</p>
          <div v-for="(outcome, outcomeIndex) in week.outcomes" :key="outcome.id" class="clo-teaching-outcome">
            <label class="clo-compact-field"><span>CLO</span><select v-model.number="outcome.cloId" class="clo-input clo-teaching-clo-select" aria-label="CLO taught this week">
              <option v-for="(clo, cloIndex) in clos" :key="clo.id" :value="clo.id">CLO {{ cloIndex + 1 }} — {{ clo.name }}</option>
            </select></label>
            <div class="clo-readiness-level-control">
              <span>Readiness level</span>
              <div class="clo-teaching-readiness-ruler" :class="readinessPillClass(outcome.readiness)">
                <div class="clo-teaching-readiness-track" :style="{ '--teaching-readiness': `${outcome.readiness}%` }">
                  <span class="clo-teaching-readiness-range-layer" aria-hidden="true">
                    <span class="clo-teaching-readiness-range clo-teaching-readiness-range-foundational">Foundational</span>
                    <span class="clo-teaching-readiness-range clo-teaching-readiness-range-developing">Developing</span>
                  </span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    :value="outcome.readiness"
                    :aria-label="`Teaching readiness for CLO ${clos.findIndex(clo => clo.id === outcome.cloId) + 1} in Week ${weekIndex + 1}`"
                    :aria-valuetext="`${outcome.readiness}% — ${readinessCategory(outcome.readiness)}`"
                    :title="`${outcome.readiness}% — ${readinessCategory(outcome.readiness)}`"
                    class="clo-teaching-readiness-slider"
                    @input="setTeachingReadiness(outcome, weekIndex, $event.target.value)"
                  />
                  <small class="clo-readiness-category clo-teaching-readiness-category" :class="readinessPillClass(outcome.readiness)" :style="{ left: readinessPillPosition(outcome.readiness) }"><ReadinessIcon :value="outcome.readiness" />{{ outcome.readiness }}% {{ readinessCategory(outcome.readiness) }}</small>
                </div>
              </div>
            </div>
            <button @click="removeTeachingOutcome(week, outcomeIndex)" class="clo-icon-btn" :aria-label="`Remove CLO from Week ${weekIndex + 1}`">×</button>
          </div>
          <div class="clo-week-add-controls">
            <button @click="addTeachingOutcome(week)" class="clo-inline-add">+ CLO</button>
            <button @click="addAssignment(weekIndex + 1)" class="clo-inline-add">+ assignment</button>
          </div>
          <section v-if="assignmentsForWeek(weekIndex + 1).length" class="clo-week-assessments">
            <header class="clo-week-assessments-header">
              <h3>Assignments</h3>
            </header>
            <article v-for="assignment in assignmentsForWeek(weekIndex + 1)" :key="assignment.id" :id="teachingAssignmentId(assignment.id)" class="clo-assessment-readiness-card" :class="{ 'clo-focus-target': isTeachingFocusAssignment(assignment.id) }">
              <div class="clo-assessment-info">
                <label class="clo-compact-field"><span>Assignment</span><input v-model="assignment.name" class="clo-input clo-assessment-name" type="text" :placeholder="`Assignment ${assignment.id} name`" /></label>
                <label class="clo-assessment-week-field">Week
                  <select :value="assignment.week" @change="setAssignmentWeek(assignment, $event.target.value)" class="clo-input" :aria-label="`Move ${assignment.name || 'assignment'} to week`">
                    <option v-for="(_, destinationWeekIndex) in teachingWeeks" :key="destinationWeekIndex" :value="destinationWeekIndex + 1">Week {{ destinationWeekIndex + 1 }}</option>
                  </select>
                </label>
              </div>
              <div v-if="assessmentChangeNoticesFor(assignment.id).length" class="clo-assessment-change-alert" role="status">
                <div v-for="notice in assessmentChangeNoticesFor(assignment.id)" :key="`${notice.assignmentId}-${notice.cloId}`">
                  <span>This assessment level has been changed. Reevaluate if the teaching readiness levels prior to this assignment are still relevant.</span>
                  <button class="clo-inline-link" @click="goToMapping(notice.assignmentId, notice.cloId)">Review in CLO Mapping</button>
                </div>
              </div>
              <div class="clo-assessment-clo-list">
                <p v-if="validCLOsForAssignment(assignment).length === 0" class="clo-validation-message clo-validation-warning">No CLO has been taught by this point. Add teaching readiness before mapping assignment CLOs.</p>
                <div v-for="mapping in assessmentMappingsFor(assignment.id)" :key="mapping.id" class="clo-assessment-mapping" :class="{ 'clo-focus-target': isTeachingFocusMapping(assignment.id, mapping.cloId) }">
                  <div class="clo-assessment-clo-details">
                    <label class="clo-compact-field"><span>CLO</span><select :value="mapping.cloId" @change="setAssessmentCLO(mapping, $event.target.value)" class="clo-input" aria-label="CLO assessed">
                      <option v-if="!isCLOValidForAssignment(mapping.cloId, assignment)" :value="mapping.cloId">CLO no longer taught by this point</option>
                      <option v-for="(clo, cloIndex) in validCLOsForAssignment(assignment)" :key="clo.id" :value="clo.id">CLO {{ cloIndex + 1 }} — {{ clo.name }}</option>
                    </select></label>
                    <label class="clo-compact-field clo-assessment-level-field"><span>Assessment level</span><span class="clo-readiness-select" :class="readinessPillClass(mapping.readiness)"><ReadinessIcon :value="mapping.readiness" /><select v-model.number="mapping.readiness" aria-label="Readiness level assessed">
                      <option :value="33" :disabled="!canAssessAtReadiness(33, availableReadinessFor(assignment, mapping.cloId))">Foundational</option>
                      <option :value="66" :disabled="!canAssessAtReadiness(66, availableReadinessFor(assignment, mapping.cloId))">Developing</option>
                      <option :value="100" :disabled="!canAssessAtReadiness(100, availableReadinessFor(assignment, mapping.cloId))">Complete</option>
                    </select></span></label>
                    <p v-if="assessmentValidation(mapping, assignment)" class="clo-validation-message">{{ assessmentValidation(mapping, assignment) }}</p>
                  </div>
                  <div class="clo-assessment-clo-controls">
                    <button @click="removeAssessmentMapping(mapping.id)" class="clo-icon-btn" aria-label="Remove assessment CLO">×</button>
                  </div>
                </div>
              </div>
              <div class="clo-assessment-controls">
                <button v-if="validCLOsForAssignment(assignment).length" @click="addAssessmentMapping(assignment)" class="clo-inline-add">+ CLO</button>
              </div>
              <footer class="clo-assignment-remove-action">
                <button @click="removeAssignment(assignment.id)" class="clo-inline-danger" :aria-label="`Remove ${assignment.name || 'assignment'}`">Remove assignment</button>
              </footer>
            </article>
          </section>
        </article>
        <div class="clo-add-week-footer">
          <button @click="addTeachingWeek" class="clo-btn clo-btn-primary">+ week</button>
        </div>
      </div>
    </section>

    <!-- Tab 3: Readiness Summary -->
    <section class="clo-section" v-show="currentTab === 2">
      <div class="clo-section-header">
        <div>
          <h2 class="clo-section-heading">3. Readiness Summary</h2>
          <div class="clo-section-divider"></div>
        </div>
      </div>
      <p class="clo-section-description">
        This is a course level view of the readiness of each CLO at each assessment point.
      </p>
      <div v-if="!readinessTemplateEnabled" class="clo-readiness-opt-in clo-summary-fallback">
        <div>
          <h3>Using manual readiness</h3>
          <p>These values come from CLO Mapping because the teaching sequence has not been completed.</p>
        </div>
        <button @click="currentTab = 1" class="clo-btn clo-btn-secondary">Set up teaching readiness</button>
      </div>
      <div class="clo-table-wrapper">
        <table class="clo-table clo-results-table">
          <thead>
            <tr>
              <th class="clo-th clo-th-left">CLO</th>
              <th v-for="assignment in assignments" :key="assignment.id" class="clo-th clo-th-center">
                {{ assignment.name || `Assignment ${assignment.id}` }}<br><small>after Week {{ assignment.week }}</small>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(clo, cloIndex) in clos" :key="clo.id">
              <td class="clo-td clo-td-bold clo-td-row-header">CLO {{ cloIndex + 1 }}</td>
              <td v-for="assignment in assignments" :key="assignment.id" class="clo-td clo-summary-readiness-cell" :style="getReadinessSummaryStyle(getReadiness(clo.id, assignment.id))">
                <strong>{{ getReadiness(clo.id, assignment.id) }}%</strong>
                <small class="clo-summary-readiness-category" :class="readinessPillClass(getReadiness(clo.id, assignment.id))"><ReadinessIcon :value="getReadiness(clo.id, assignment.id)" />{{ readinessCategory(getReadiness(clo.id, assignment.id)) }}</small>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="assessmentIssues.length" class="clo-summary-issues">
        <h3>Assessment checks to resolve</h3>
        <p v-for="issue in assessmentIssues" :key="issue.id" class="clo-validation-message">{{ issue.message }}</p>
      </div>
    </section>

    <!-- Tab 4: CLO Mapping -->
    <div v-show="currentTab === 3">
    <section class="clo-section">
      <div class="clo-section-header">
        <div>
          <h2 class="clo-section-heading">4. CLO Mapping</h2>
          <div class="clo-section-divider"></div>
        </div>
        <button @click="addAssignment" class="clo-btn clo-btn-primary">
          Add Assignment
        </button>
      </div>
      <div class="clo-instructions-toggle-bar">
        <button class="clo-btn-instructions-toggle" @click="showInstructions[3] = !showInstructions[3]" :aria-expanded="showInstructions[3]" aria-controls="clo-mapping-instructions">
          {{ showInstructions[3] ? 'Hide instructions' : 'Show instructions' }}
        </button>
      </div>
      <div id="clo-mapping-instructions" v-show="showInstructions[3]" class="clo-instructions">
        <ol class="list-decimal ml-4">
          <li>Click <strong>Add Assignment</strong> to add each summative assignment in your course. If your course groups assignments (e.g., Assignments 1 and 2 share a combined weighting of 30%), add each assignment individually and map them as normal. When reading the CLO mapping table outputs, check that the grouped assignments' totals combined match your intended group weighting.</li>
          <li>Select your <strong>input mode</strong> using the toggle (top right). Visual mode adds sliders so you can drag to show whether one assignment is more, less, or equally important for a CLO. Numbers mode lets you type specific values, which is useful when you want to express a progression (e.g., 30% of the CLO is assessable in Assignment 1, 60% by Assignment 2, 100% by Assignment 3).</li>
          <li>If you have completed the teaching readiness template, the readiness levels will have been automatically populated in the table below.</li>
          <li>If you haven’t completed the teaching readiness template, you will have to manually adjust the readiness levels now following Step 4.</li>
          <li>Work one CLO at a time. Use the Readiness slider to show how much of the CLO has been taught and is available to assess by each assignment. Readiness carries forward: later assignments cannot be set lower than an earlier one.</li>
          <li>Use the <strong>Demand</strong> row to indicate how each CLO's assessment weight is distributed across assignments. There are two approaches. You can enter values proportionally: 1 / 1 / 2 means Assignment 3 carries twice the demand of the other two, and the tool calculates the percentages for you. Or you can enter the percentages directly: a CLO worth 30% could be entered as 5 / 10 / 15. If a CLO is not assessed in an assignment, enter 0. The demand availability is visible next to the CLO itself.</li>
          <li>The marker on each readiness bar shows the minimum readiness level required to satisfy the demand at that point. If your readiness slider is below this marker, you are assessing more than has been taught. Adjust the readiness slider or redistribute the demand.</li>
          <li>Download your final decisions and save the document, as these values can be used to design the course, including the learning sequence, the tutorials, and the LMS resources.</li>
        </ol>
        <p class="clo-instructions-links">
          <a href="https://paulgmoss.github.io/The-CAT/stream-a-guide.html#clo-mapping" target="_blank" class="clo-placeholder-link">Detailed guidance: CLO mapping →</a>
        </p>
      </div>
      <p class="clo-section-description">
        Map the readiness and demand of each CLO across your assignment tasks.
      </p>
      <div class="clo-mapping-layout-wrapper">
        <div
          class="clo-mapping-header"
          :style="{ '--assignment-count': assignments.length }"
        >
          <div class="clo-mapping-header-cell">CLO</div>
          <div class="clo-mapping-header-cell">Measures</div>
          <div v-for="assignment in assignments" :key="assignment.id" class="clo-mapping-header-cell">
            <div class="clo-assignment-header-cell">
              <label class="clo-compact-field"><span>Assignment</span><input
                v-model="assignment.name"
                type="text"
                class="clo-input clo-input-sm"
                placeholder="Assignment name"
              /></label>
              <span v-if="readinessTemplateEnabled" class="clo-assignment-week-summary">Week {{ getWeekNumber(assignment) }}</span>
              <label v-else class="clo-assignment-week-label">Due after week
                <input
                  :value="assignment.week"
                  @input="setAssignmentWeek(assignment, $event.target.value)"
                  type="number"
                  min="1"
                  :max="readinessTemplateEnabled ? teachingWeeks.length : undefined"
                  class="clo-input clo-input-numeric clo-assignment-week-input"
                />
              </label>
              <button
                @click="removeAssignment(assignment.id)"
                class="clo-btn clo-btn-danger clo-btn-xs"
              >
                Remove
              </button>
            </div>
          </div>
        </div>

        <section
          v-for="(clo, index) in clos"
          :key="clo.id"
          class="clo-mapping-group"
          :style="{ '--assignment-count': assignments.length }"
          :aria-label="`CLO ${index + 1} mapping`"
        >
          <div class="clo-mapping-cell clo-mapping-clo-cell"><span>CLO {{ index + 1 }}</span><small>{{ clo.weighting }}% course weighting</small></div>
          <div class="clo-mapping-cell clo-mapping-measure clo-mapping-readiness-measure">
            <span>Readiness</span>
            <small>taught by this point</small>
          </div>
          <div v-for="(assignment, assignmentIndex) in assignments" :key="assignment.id" :id="mappingCellId(clo.id, assignment.id)" class="clo-mapping-cell clo-mapping-readiness-cell" :class="{ 'clo-focus-target': mappingFocus?.assignmentId === assignment.id && mappingFocus?.cloId === clo.id }">
                  <div class="clo-readiness-control">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="1"
                      :min="getReadinessMinimum(clo.id, assignmentIndex)"
                      :value="getDisplayedReadiness(clo.id, assignment.id)"
                      :style="{
                        '--readiness-start': getReadinessMinimum(clo.id, assignmentIndex) + '%',
                        '--readiness': getDisplayedReadiness(clo.id, assignment.id) + '%'
                      }"
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
                    <span class="clo-readiness-value" :class="{ 'clo-readiness-value-dark': getDisplayedReadiness(clo.id, assignment.id) < 20 }">{{ getDisplayedReadiness(clo.id, assignment.id) }}%</span>
                  </div>
                  <small class="clo-readiness-category" :class="[readinessPillClass(getDisplayedReadiness(clo.id, assignment.id)), { 'clo-readiness-alert': isBelowReadinessMinimum(clo.id, assignment.id) }]"><ReadinessIcon :value="getDisplayedReadiness(clo.id, assignment.id)" />{{ readinessCategory(getDisplayedReadiness(clo.id, assignment.id)) }}</small>
                  <small v-if="assignmentIndex > 0 && getDisplayedReadiness(clo.id, assignment.id) === getDisplayedReadiness(clo.id, assignments[assignmentIndex - 1].id)" class="clo-readiness-carried" :class="{ 'clo-readiness-alert': isBelowReadinessMinimum(clo.id, assignment.id) }">
                    Minimum readiness: {{ getReadinessTarget(clo.id, assignment.id).toFixed(0) }}%
                  </small>
                  <small v-else class="clo-readiness-needed" :class="{ 'clo-readiness-alert': isBelowReadinessMinimum(clo.id, assignment.id) }">
                    Minimum readiness: {{ getReadinessTarget(clo.id, assignment.id).toFixed(0) }}%
                  </small>
                  <div v-if="readinessProposals[proposalKey(clo.id, assignment.id)]" class="clo-readiness-proposal">
                    <template v-if="readinessProposals[proposalKey(clo.id, assignment.id)].blocked">
                      <span>{{ readinessProposals[proposalKey(clo.id, assignment.id)].blocked }}</span>
                      <button class="clo-inline-link" @click="goToTeachingReadiness(clo.id, assignment.id)">Review teaching readiness</button>
                    </template>
                    <span v-else>Suggested assessment update: {{ readinessProposals[proposalKey(clo.id, assignment.id)].assessmentCategory || 'Not set' }} → {{ readinessProposals[proposalKey(clo.id, assignment.id)].proposedCategory }}.</span>
                    <button v-if="!readinessProposals[proposalKey(clo.id, assignment.id)].blocked" @click="applyReadinessProposal(readinessProposals[proposalKey(clo.id, assignment.id)])">Apply category</button>
                    <button @click="discardReadinessProposal(readinessProposals[proposalKey(clo.id, assignment.id)])">Dismiss</button>
                  </div>
          </div>
          <div class="clo-mapping-cell clo-mapping-measure">
            <span>Demand</span>
            <small>how much is assessed</small>
          </div>
          <div v-for="assignment in assignments" :key="assignment.id" class="clo-mapping-cell clo-mapping-demand-cell">
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
                  <input
                    type="range"
                    min="0"
                    max="100"
                    :value="Math.min(100, getRawValue(clo.id, assignment.id))"
                    @input="setRawValue(clo.id, assignment.id, parseFloat($event.target.value) || 0)"
                    :style="{ '--slider-value': Math.min(100, getRawValue(clo.id, assignment.id)) + '%', '--slider-max': '100%' }"
                    :aria-label="`Demand for CLO ${index + 1} in ${assignment.name || 'assignment'}`"
                    class="clo-visual-slider"
                  />
                  <input
                    type="number"
                    min="0"
                    step="any"
                    :value="getRawValue(clo.id, assignment.id)"
                    @input="setRawValue(clo.id, assignment.id, parseFloat($event.target.value) || 0)"
                    class="clo-input clo-input-sm clo-input-numeric clo-slider-number"
                  />
                </div>
          </div>
        </section>
      </div>
      <p v-if="assignments.length > 1" class="clo-mapping-scroll-cue">Scroll to view assignments →</p>
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
    <!-- Tab 5: Assignment Weightings -->
    <section class="clo-section" v-show="currentTab === 4">
      <div class="clo-section-header">
        <div>
          <h2 class="clo-section-heading">5. Assignment Weightings</h2>
          <div class="clo-section-divider"></div>
        </div>
      </div>
      <div class="clo-instructions-toggle-bar">
        <button class="clo-btn-instructions-toggle" @click="showInstructions[4] = !showInstructions[4]" :aria-expanded="showInstructions[4]" aria-controls="assignment-weightings-instructions">
          {{ showInstructions[4] ? 'Hide instructions' : 'Show instructions' }}
        </button>
      </div>
      <div id="assignment-weightings-instructions" v-show="showInstructions[4]" class="clo-instructions">
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

    <!-- Tab 6: Marking Guide / Rubric Composition -->
    <section class="clo-section" v-show="currentTab === 5">
      <div class="clo-section-header">
        <div>
          <h2 class="clo-section-heading">6. Marking Guide / Rubric Composition</h2>
          <div class="clo-section-divider"></div>
        </div>
      </div>
      <div class="clo-instructions-toggle-bar">
        <button class="clo-btn-instructions-toggle" @click="showInstructions[5] = !showInstructions[5]" :aria-expanded="showInstructions[5]" aria-controls="rubric-composition-instructions">
          {{ showInstructions[5] ? 'Hide instructions' : 'Show instructions' }}
        </button>
      </div>
      <div id="rubric-composition-instructions" v-show="showInstructions[5]" class="clo-instructions">
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
      <button v-if="currentTab < tabLabels.length - 1" class="clo-btn clo-btn-primary" @click="currentTab++">
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
import { ref, computed, reactive, onMounted, watch, nextTick } from 'vue'
import { useAnalytics } from '@/composables/useAnalytics'
import ReadinessIcon from '@/components/ReadinessIcon.vue'

const { trackEvent, trackFunnelStep, trackCompletion, trackExport } = useAnalytics()

onMounted(() => {
  document.title = 'Pathway A: Learning Outcomes → Assignments'
  trackEvent('activity_started')
})

const showSection2A = ref(false)
const visualMode = ref(false)
const currentTab = ref(0)
const tabLabels = ['1. CLO Weightings', '2. Teaching Readiness', '3. Readiness Summary', '4. CLO Mapping', '5. Assignment Weightings', '6. Marking Guide / Rubric Composition']
const showInstructions = ref([false, false, false, false, false, false])
const notes = ref('')
const hasTrackedCompletion = ref(false)

watch(currentTab, (tab) => {
  if (tab === 1) trackFunnelStep(20)
  else if (tab === 2) trackFunnelStep(40)
  else if (tab === 3) trackFunnelStep(60)
  else if (tab === 4) trackFunnelStep(80)
  else if (tab === 5) {
    trackFunnelStep(100)
    if (!hasTrackedCompletion.value) {
      hasTrackedCompletion.value = true
      trackCompletion({ clo_count: clos.value.length, assignment_count: assignments.value.length })
    }
  }
})

const clos = ref([
  { id: 1, name: 'CLO 1', weighting: 100 }
])

const assignments = ref([])

const rawValues = reactive({})
const readinessValues = reactive({})
const readinessTemplateEnabled = ref(false)
const teachingWeeks = ref([])
const assessmentMappings = ref([])
const readinessProposals = reactive({})
// Mapping uses this ephemeral value so the bar responds immediately while a
// teaching-category update is waiting for the user's explicit confirmation.
const readinessPreviews = reactive({})
const assessmentChangeNotices = ref([])
const teachingFocus = ref(null)
const mappingFocus = ref(null)

let nextCLOId = 2
let nextAssignmentId = 1
let nextTeachingWeekId = 1
let nextTeachingOutcomeId = 1
let nextAssessmentMappingId = 1

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

const getManualReadiness = (cloId, assignmentId) => {
  return readinessValues[`${cloId}-${assignmentId}`] ?? 0
}

const getWeekNumber = (assignment) => Math.max(1, Math.round(parseFloat(assignment.week) || 1))

const taughtReadinessAt = (cloId, weekNumber) => {
  if (!readinessTemplateEnabled.value) return 0
  return teachingWeeks.value
    .slice(0, Math.min(teachingWeeks.value.length, getWeekNumber({ week: weekNumber })))
    .reduce((highest, week) => Math.max(highest, ...week.outcomes
      .filter(outcome => Number(outcome.cloId) === Number(cloId))
      .map(outcome => Number(outcome.readiness) || 0)), 0)
}

const getReadiness = (cloId, assignmentId) => {
  const assignment = assignments.value.find(item => item.id === assignmentId)
  if (readinessTemplateEnabled.value && assignment) return taughtReadinessAt(cloId, assignment.week)
  return getManualReadiness(cloId, assignmentId)
}

const getDisplayedReadiness = (cloId, assignmentId) => {
  const key = proposalKey(cloId, assignmentId)
  return readinessTemplateEnabled.value && readinessPreviews[key] !== undefined
    ? readinessPreviews[key]
    : getReadiness(cloId, assignmentId)
}

const getReadinessMinimum = (cloId, assignmentIndex) => {
  // Teaching readiness is calculated against an assignment's due week, which may
  // legitimately differ from the visual order of assignment columns.
  if (readinessTemplateEnabled.value) return 0
  if (assignmentIndex === 0) return 0
  return getReadiness(cloId, assignments.value[assignmentIndex - 1].id)
}

const setReadiness = (cloId, assignmentId, value) => {
  if (readinessTemplateEnabled.value) {
    const preview = Math.min(100, Math.max(0, Math.round(parseFloat(value) || 0)))
    readinessPreviews[proposalKey(cloId, assignmentId)] = preview
    proposeReadinessChange(cloId, assignmentId, preview)
    return
  }
  const assignmentIndex = assignments.value.findIndex(assignment => assignment.id === assignmentId)
  if (assignmentIndex === -1) return

  const minimum = getReadinessMinimum(cloId, assignmentIndex)
  const readiness = Math.min(100, Math.max(minimum, Math.round(parseFloat(value) || 0)))
  readinessValues[`${cloId}-${assignmentId}`] = readiness

  // Manual fallback preserves availability at later assessment points.
  assignments.value.slice(assignmentIndex + 1).forEach(assignment => {
    const key = `${cloId}-${assignment.id}`
    if ((readinessValues[key] ?? 0) < readiness) readinessValues[key] = readiness
  })
}

const readinessCategory = (value) => {
  const readiness = Math.max(0, Number(value) || 0)
  if (readiness === 0) return 'Not taught'
  if (readiness <= 33) return 'Foundational'
  if (readiness < 100) return 'Developing'
  return 'Complete'
}

const readinessPillClass = (value) => `clo-readiness-${readinessCategory(value).toLowerCase().replace(' ', '-')}`

const readinessPillPosition = (value) => {
  const readiness = Math.min(100, Math.max(0, Number(value) || 0))
  return `${Math.min(86, Math.max(14, readiness))}%`
}

const readinessForCategory = (category) => ({
  'Not taught': 0,
  Foundational: 33,
  Developing: 66,
  Complete: 100
}[category] ?? 0)

const readinessCategoryRank = (value) => ({
  'Not taught': 0,
  Foundational: 1,
  Developing: 2,
  Complete: 3
}[readinessCategory(value)] ?? 0)

// Assessment levels are category-based: any value in a taught category makes
// that category available to assess. The stored 33/66/100 values are labels,
// rather than thresholds students must reach.
const canAssessAtReadiness = (assessmentReadiness, taughtReadiness) =>
  readinessCategoryRank(assessmentReadiness) > 0 &&
  readinessCategoryRank(assessmentReadiness) <= readinessCategoryRank(taughtReadiness)

const enableReadinessTemplate = () => {
  readinessTemplateEnabled.value = true
  const latestAssignmentWeek = Math.max(1, ...assignments.value.map(assignment => getWeekNumber(assignment)))
  ensureTeachingWeeksThrough(latestAssignmentWeek)
  assignments.value.forEach(assignment => setAssignmentWeek(assignment, assignment.week || 1))
}

const addTeachingWeek = () => {
  teachingWeeks.value.push({ id: nextTeachingWeekId++, topic: '', outcomes: [] })
}

const ensureTeachingWeeksThrough = (weekNumber) => {
  const targetWeek = Math.max(1, Math.round(Number(weekNumber) || 1))
  while (teachingWeeks.value.length < targetWeek) addTeachingWeek()
}

const removeTeachingWeek = (weekIndex) => {
  if (teachingWeeks.value.length === 1) return
  teachingWeeks.value.splice(weekIndex, 1)
  assignments.value.forEach(assignment => setAssignmentWeek(assignment, assignment.week))
}

const addTeachingOutcome = (week) => {
  const alreadyMapped = new Set(week.outcomes.map(outcome => Number(outcome.cloId)))
  const available = clos.value.find(clo => !alreadyMapped.has(clo.id)) || clos.value[0]
  if (available) week.outcomes.push({ id: nextTeachingOutcomeId++, cloId: available.id, readiness: 33 })
}

const removeTeachingOutcome = (week, outcomeIndex) => week.outcomes.splice(outcomeIndex, 1)

const setTeachingReadiness = (outcome, weekIndex, value) => {
  outcome.readiness = Math.min(100, Math.max(0, Math.round(parseFloat(value) || 0)))
  assignments.value
    .filter(assignment => getWeekNumber(assignment) >= weekIndex + 1)
    .forEach(assignment => {
      const key = proposalKey(outcome.cloId, assignment.id)
      delete readinessPreviews[key]
      delete readinessProposals[key]
    })
}

const setAssignmentWeek = (assignment, value) => {
  if (!readinessTemplateEnabled.value) ensureTeachingWeeksThrough(value)
  const max = readinessTemplateEnabled.value ? Math.max(1, teachingWeeks.value.length) : 52
  assignment.week = Math.min(max, Math.max(1, Math.round(parseFloat(value) || 1)))
  sortAssignments()
  // A preview is tied to an assessment point; moving the assessment changes that point.
  clos.value.forEach(clo => {
    const key = proposalKey(clo.id, assignment.id)
    delete readinessPreviews[key]
    delete readinessProposals[key]
  })
}

const availableReadinessFor = (assignment, cloId) => taughtReadinessAt(cloId, assignment.week)

const validCLOsForAssignment = (assignment) => clos.value.filter(clo => availableReadinessFor(assignment, clo.id) > 0)

const isCLOValidForAssignment = (cloId, assignment) => validCLOsForAssignment(assignment).some(clo => clo.id === Number(cloId))

const assessmentMappingsFor = (assignmentId) => assessmentMappings.value.filter(mapping => mapping.assignmentId === assignmentId)

const assessmentMappingForCLO = (assignmentId, cloId) => assessmentMappingsFor(assignmentId)
  .find(mapping => Number(mapping.cloId) === Number(cloId))

const assessmentChangeNoticesFor = (assignmentId) =>
  assessmentChangeNotices.value.filter(notice => notice.assignmentId === assignmentId)

const teachingAssignmentId = (assignmentId) => `teaching-assignment-${assignmentId}`
const mappingCellId = (cloId, assignmentId) => `mapping-cell-${cloId}-${assignmentId}`

const isTeachingFocusAssignment = (assignmentId) => teachingFocus.value?.assignmentId === assignmentId

const isTeachingFocusMapping = (assignmentId, cloId) =>
  isTeachingFocusAssignment(assignmentId) && Number(teachingFocus.value?.cloId) === Number(cloId)

const goToTeachingReadiness = (cloId, assignmentId) => {
  teachingFocus.value = { cloId, assignmentId }
  currentTab.value = 1
  nextTick(() => document.getElementById(teachingAssignmentId(assignmentId))?.scrollIntoView({ block: 'center', inline: 'nearest' }))
}

const goToMapping = (assignmentId, cloId) => {
  mappingFocus.value = { assignmentId, cloId }
  currentTab.value = 3
  nextTick(() => document.getElementById(mappingCellId(cloId, assignmentId))?.scrollIntoView({ block: 'center', inline: 'center' }))
}

const assignmentsForWeek = (weekNumber) => assignments.value.filter(assignment => getWeekNumber(assignment) === weekNumber)

const addAssessmentMapping = (assignment) => {
  const available = validCLOsForAssignment(assignment)
  const alreadyMapped = new Set(assessmentMappingsFor(assignment.id).map(mapping => Number(mapping.cloId)))
  const clo = available.find(item => !alreadyMapped.has(item.id)) || available[0]
  if (!clo) return
  assessmentMappings.value.push({ id: nextAssessmentMappingId++, assignmentId: assignment.id, cloId: clo.id, readiness: 33 })
}

const removeAssessmentMapping = (mappingId) => {
  const mappingIndex = assessmentMappings.value.findIndex(mapping => mapping.id === mappingId)
  if (mappingIndex !== -1) assessmentMappings.value.splice(mappingIndex, 1)
}

const setAssessmentCLO = (mapping, value) => {
  mapping.cloId = Number(value)
}

const assessmentValidation = (mapping, assignment) => {
  const taught = availableReadinessFor(assignment, mapping.cloId)
  if (taught === 0) return 'This CLO has not been taught by this assessment point. Move the assessment, or add the relevant teaching earlier in the sequence.'
  if (!canAssessAtReadiness(mapping.readiness, taught)) return `This assessment tests ${readinessCategory(mapping.readiness)} (${mapping.readiness}%), but only ${taught}% has been taught. Lower the assessment level or update the teaching sequence.`
  return ''
}

const assessmentIssues = computed(() => assessmentMappings.value
  .map(mapping => {
    const assignment = assignments.value.find(item => item.id === mapping.assignmentId)
    if (!assignment) return null
    const message = assessmentValidation(mapping, assignment)
    return message ? { id: mapping.id, message: `${assignment.name || `Assignment ${assignment.id}`}: ${message}` } : null
  })
  .filter(Boolean))

const proposalKey = (cloId, assignmentId) => `${cloId}-${assignmentId}`

const proposeReadinessChange = (cloId, assignmentId, value) => {
  const assignment = assignments.value.find(item => item.id === assignmentId)
  if (!assignment) return
  const taught = getReadiness(cloId, assignmentId)
  const proposed = Math.min(100, Math.max(0, Math.round(parseFloat(value) || 0)))
  const previousCategory = readinessCategory(taught)
  const proposedCategory = readinessCategory(proposed)
  const key = proposalKey(cloId, assignmentId)
  const assessmentMapping = assessmentMappingForCLO(assignmentId, cloId)
  const assessmentCategory = assessmentMapping ? readinessCategory(assessmentMapping.readiness) : ''

  // Percentages within a category are useful for sense-checking the mapping,
  // but do not need an assessment-level change. A category boundary does.
  if (proposedCategory === previousCategory || proposedCategory === assessmentCategory) {
    delete readinessProposals[key]
    return
  }

  readinessProposals[key] = {
    cloId, assignmentId, proposed, previousCategory, proposedCategory, assessmentCategory,
    assessmentReadiness: readinessForCategory(proposedCategory),
    blocked: !canAssessAtReadiness(readinessForCategory(proposedCategory), taught)
      ? `This assessment cannot be set to ${proposedCategory}: only ${previousCategory.toLowerCase()} learning has been taught by this point.`
      : ''
  }
}

const applyReadinessProposal = (proposal) => {
  if (proposal.blocked) return
  const existing = assessmentMappingForCLO(proposal.assignmentId, proposal.cloId)
  if (existing) existing.readiness = proposal.assessmentReadiness
  else assessmentMappings.value.push({
    id: nextAssessmentMappingId++,
    assignmentId: proposal.assignmentId,
    cloId: proposal.cloId,
    readiness: proposal.assessmentReadiness
  })
  // The adjustment applies to the assessment category. Keep the live mapping
  // value visible until teaching readiness is deliberately updated to match.
  readinessPreviews[proposalKey(proposal.cloId, proposal.assignmentId)] = proposal.proposed
  delete readinessProposals[proposalKey(proposal.cloId, proposal.assignmentId)]
  if (!assessmentChangeNotices.value.some(notice => notice.assignmentId === proposal.assignmentId && notice.cloId === proposal.cloId)) {
    assessmentChangeNotices.value.push({ assignmentId: proposal.assignmentId, cloId: proposal.cloId })
  }
}

//
//
//
//
// Future State?
//
// - Rubric Composition
// -- Now build your rubric
// -- Look at Kangarubric tool that Tim C made
// --- Export from the Rubric Composition table to a Canvas-ready rubric.
//
//

const discardReadinessProposal = (proposal) => {
  delete readinessPreviews[proposalKey(proposal.cloId, proposal.assignmentId)]
  delete readinessProposals[proposalKey(proposal.cloId, proposal.assignmentId)]
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
  if (!clo) return 0
  clo.weighting = Math.min(maxWeightingFor(cloId), Math.max(0, parseFloat(value) || 0))
  return clo.weighting
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

const isBelowReadinessMinimum = (cloId, assignmentId) => (
  getDisplayedReadiness(cloId, assignmentId) < getReadinessTarget(cloId, assignmentId)
)

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

const getReadinessSummaryStyle = (value) => {
  const readiness = Math.min(100, Math.max(0, Number(value) || 0))
  const category = readinessCategory(readiness)
  const categoryColours = {
    'Not taught': { fill: '#f1f2f4', text: '#5d6470' },
    Foundational: { fill: '#fff3e0', text: '#9a6700' },
    Developing: { fill: '#e8f5e9', text: '#2e7d32' },
    Complete: { fill: 'var(--clo-accent-b-soft)', text: '#140F50' }
  }
  const colours = categoryColours[category]
  return {
    background: `linear-gradient(90deg, ${colours.fill} 0 ${readiness}%, #faf9ff ${readiness}% 100%)`,
    color: colours.text
  }
}

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
    teachingWeeks.value.forEach(week => {
      week.outcomes = week.outcomes.filter(outcome => Number(outcome.cloId) !== cloId)
    })
    assessmentMappings.value = assessmentMappings.value.filter(mapping => Number(mapping.cloId) !== cloId)
    clos.value.splice(index, 1)
  }
}

const addAssignment = (weekNumber) => {
  const id = nextAssignmentId++
  const defaultWeek = readinessTemplateEnabled.value
    ? Math.min(Math.max(1, Math.round(weekNumber || teachingWeeks.value.length)), Math.max(1, teachingWeeks.value.length))
    : assignments.value.length + 1
  ensureTeachingWeeksThrough(defaultWeek)
  assignments.value.push({
    id,
    name: `Assignment ${id}`,
    week: defaultWeek
  })
  clos.value.forEach(clo => {
    const precedingAssignment = assignments.value[assignments.value.length - 2]
    readinessValues[`${clo.id}-${id}`] = precedingAssignment
      ? getReadiness(clo.id, precedingAssignment.id)
      : 0
  })
  sortAssignments()
}

const sortAssignments = () => {
  assignments.value.sort((a, b) => getWeekNumber(a) - getWeekNumber(b) || a.id - b.id)
}

const removeAssignment = (assignmentId) => {
  // Assessments are optional: removing the last one is valid.
  clos.value.forEach(clo => {
    const key = `${clo.id}-${assignmentId}`
    delete rawValues[key]
    delete readinessValues[key]
  })
  assessmentMappings.value = assessmentMappings.value.filter(mapping => mapping.assignmentId !== assignmentId)
  assignments.value = assignments.value.filter(a => a.id !== assignmentId)
  assessmentChangeNotices.value = assessmentChangeNotices.value.filter(notice => notice.assignmentId !== assignmentId)
  if (teachingFocus.value?.assignmentId === assignmentId) teachingFocus.value = null
  if (mappingFocus.value?.assignmentId === assignmentId) mappingFocus.value = null
  sortAssignments()
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

  const aNames = assignments.value.map(a => `${a.name || `Assignment ${a.id}`} (after Week ${a.week})`)
  if (readinessTemplateEnabled.value) {
    lines.push(row(['Section 2: Teaching Readiness']))
    lines.push(row(['Week', 'Topic', 'CLO', 'Taught readiness (%)', 'Category']))
    teachingWeeks.value.forEach((week, weekIndex) => {
      if (!week.outcomes.length) lines.push(row([`Week ${weekIndex + 1}`, week.topic, '', '', '']))
      week.outcomes.forEach((outcome, outcomeIndex) => {
        const cloIndex = clos.value.findIndex(clo => clo.id === Number(outcome.cloId))
        lines.push(row([
          outcomeIndex === 0 ? `Week ${weekIndex + 1}` : '',
          outcomeIndex === 0 ? week.topic : '',
          cloIndex === -1 ? '' : `CLO ${cloIndex + 1}`,
          outcome.readiness + '%',
          readinessCategory(outcome.readiness)
        ]))
      })
    })
    lines.push('')
  }

  lines.push(row(['Section 3: Readiness Summary']))
  lines.push(row(['CLO', ...aNames]))
  clos.value.forEach((clo, i) => {
    lines.push(row([`CLO ${i + 1}`, ...assignments.value.map(a => `${getReadiness(clo.id, a.id)}% — ${readinessCategory(getReadiness(clo.id, a.id))}`)]))
  })
  lines.push('')

  lines.push(row(['Section 4: CLO Mapping (Readiness and Demand)']))
  lines.push(row(['CLO', 'Measure', ...aNames, 'Total']))
  clos.value.forEach((clo, i) => {
    lines.push(row([`CLO ${i + 1}`, 'Readiness (%)', ...assignments.value.map(a => getReadiness(clo.id, a.id) + '%'), '']))
    lines.push(row(['', 'Demand (raw)', ...assignments.value.map(a => getRawValue(clo.id, a.id)), getCLOTotal(clo.id).toFixed(2)]))
  })
  lines.push('')

  lines.push(row(['Section 5: Assignment Weightings']))
  lines.push(row(['CLO', ...aNames]))
  clos.value.forEach((clo, i) => {
    lines.push(row([`CLO ${i + 1}`, ...assignments.value.map(a => getCourseContribution(clo.id, a.id).toFixed(2) + '%')]))
  })
  lines.push(row(['Assignment Total', ...assignments.value.map(a => getAssignmentTotal(a.id).toFixed(2) + '%')]))
  lines.push(row(['Grand Total', grandTotal.value.toFixed(2) + '%']))
  lines.push('')

  lines.push(row(['Section 6: Marking Guide / Rubric Composition']))
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
  /* Shared CAT explainer tokens */
  --clo-ink: #140F50;
  --clo-ink-light: #3E3A6B;
  --clo-ink-muted: #6B6790;

  /* Limestone working surfaces */
  --clo-bg: #F8EFE0;
  --clo-bg-warm: #EDEAE0;
  --clo-surface: #ffffff;

  /* Purple Accents */
  --clo-accent-a: #140F50;
  --clo-accent-a-soft: rgba(91,61,245,0.08);
  --clo-accent-b: #5B3DF5;
  --clo-accent-b-soft: rgba(131,107,255,0.12);

  /* Borders & Focus */
  --clo-border: #E5DFC9;
  --clo-highlight: #5B3DF5;

  /* Status Colors */
  --clo-success: #087b05;
  --clo-warning: #b55d00;
  --clo-danger: #cb2461;

  /* Layout Tokens */
  --clo-w-max: 1280px;
  --clo-radius: 8px;
  --clo-radius-sm: 4px;
  --clo-radius-xs: 4px;

  /* Spacing System */
  --clo-space-xs: 0.5rem;
  --clo-space-sm: 1rem;
  --clo-space-md: 1.75rem;
  --clo-space-lg: 3rem;
  --clo-space-xl: 5rem;

  /* Typography */
  --clo-font-display: Georgia, 'Times New Roman', serif;
  --clo-font-body: 'Mulish', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
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

/* Keep the working area visually quiet. */
.clo-page::before {
  content: none;
}

.clo-page::after {
  content: none;
}

/* Hero Section */
.clo-hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--clo-space-md);
  padding: 14px max(24px, calc((100vw - var(--clo-w-max)) / 2 + var(--clo-space-md)));
  text-align: left;
  background: rgba(248, 239, 224, 0.9);
  border-bottom: 1px solid var(--clo-border);
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
  font-size: clamp(1.2rem, 2.2vw, 1.55rem);
  line-height: 1.18;
  letter-spacing: -0.01em;
  color: var(--clo-ink);
  margin-bottom: var(--clo-space-sm);
}

.clo-hero-brand {
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
  margin-bottom: 0;
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
  font-size: 1.25rem;
  font-weight: 400;
  color: var(--clo-ink);
  line-height: 1.15;
}

.clo-hero-brand-tagline {
  font-size: 0.62rem;
  font-weight: 500;
  letter-spacing: 0.1em;
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
  border-top: 2px solid var(--clo-accent-b);
  border-radius: var(--clo-radius);
  padding: var(--clo-space-md);
  margin-bottom: var(--clo-space-md);
  box-shadow: 0 1px 2px rgba(8, 6, 32, 0.05);
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
  padding: 9px 18px;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
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
}

.clo-btn-secondary {
  background: transparent;
  color: var(--clo-accent-a);
  border: 1px solid var(--clo-accent-a);
  padding: 8px 17px;
}

.clo-btn-secondary:hover:not(:disabled) {
  background: var(--clo-accent-a);
  color: #fff;
}

.clo-btn-danger {
  background: var(--clo-danger);
  color: #fff;
}

.clo-btn-danger:hover:not(:disabled) {
  background: #a01d4e;
}

.clo-btn-sm {
  font-size: 0.88rem;
  padding: 6px 13px;
}

.clo-btn-xs {
  font-size: 0.8rem;
  padding: 5px 11px;
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

.clo-input:focus-visible {
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
  border-left: 3px solid var(--clo-accent-b);
  background: var(--clo-accent-b-soft);
  border-radius: var(--clo-radius);
  padding: var(--clo-space-md);
  margin-top: var(--clo-space-md);
}

.clo-callout-highlight {
  background: var(--clo-accent-a-soft);
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
  letter-spacing: 0;
  color: var(--clo-ink-muted);
}

.clo-mode-pills {
  display: flex;
  background: var(--clo-bg);
  border: 1px solid var(--clo-border);
  border-radius: var(--clo-radius-sm);
  padding: 2px;
  gap: 2px;
}

.clo-mode-pill {
  font-family: var(--clo-font-body);
  font-size: 0.85rem;
  font-weight: 600;
  padding: 5px 16px;
  border: none;
  border-radius: 3px;
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
  background: #fff;
  color: var(--clo-ink);
  box-shadow: 0 1px 2px rgba(8, 6, 32, 0.12);
}

.clo-slider-cell {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 180px;
}

.clo-visual-slider {
  flex: 1 1 auto;
  min-width: 0;
  height: 28px;
  margin: 0;
  appearance: none;
  background: transparent;
  cursor: pointer;
}

.clo-visual-slider::-webkit-slider-runnable-track {
  height: 8px;
  border: 1px solid #cfc8ee;
  border-radius: 999px;
  background: linear-gradient(to right, var(--clo-accent-a) 0 var(--slider-value), #e8e4fa var(--slider-value) var(--slider-max), #f8f7fc var(--slider-max) 100%);
}

.clo-visual-slider::-moz-range-track {
  height: 8px;
  border: 1px solid #cfc8ee;
  border-radius: 999px;
  background: linear-gradient(to right, var(--clo-accent-a) 0 var(--slider-value), #e8e4fa var(--slider-value) var(--slider-max), #f8f7fc var(--slider-max) 100%);
}

.clo-visual-slider::-webkit-slider-thumb {
  width: 18px;
  height: 18px;
  margin-top: -6px;
  appearance: none;
  border: 2px solid #fff;
  border-radius: 50%;
  background: var(--clo-accent-a);
  box-shadow: 0 1px 4px rgba(20,15,80,0.3);
}

.clo-visual-slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border: 2px solid #fff;
  border-radius: 50%;
  background: var(--clo-accent-a);
  box-shadow: 0 1px 4px rgba(20,15,80,0.3);
}

.clo-visual-slider:focus-visible { outline: 3px solid var(--clo-highlight); outline-offset: 3px; border-radius: 999px; }

.clo-slider-number {
  width: 62px;
  flex-shrink: 0;
}

.clo-mapping-layout-wrapper {
  overflow-x: auto;
  margin-top: var(--clo-space-sm);
  padding-bottom: 2px;
}

.clo-mapping-header,
.clo-mapping-group {
  display: grid;
  width: 100%;
  min-width: 620px;
  grid-template-columns:
    112px
    168px
    repeat(var(--assignment-count), minmax(190px, 1fr));
}

.clo-mapping-header {
  border: 1px solid var(--clo-border);
  border-radius: var(--clo-radius);
  background: var(--clo-bg-warm);
}

.clo-mapping-header-cell {
  min-width: 0;
  padding: 12px 14px;
  border-right: 1px solid var(--clo-border);
  color: var(--clo-ink-light);
  font-size: 0.76rem;
  font-weight: 600;
}

.clo-mapping-header-cell:last-child {
  border-right: none;
}

.clo-assignment-header-cell {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 7px;
  align-items: end;
}

.clo-assignment-week-label {
  grid-column: 1;
  color: var(--clo-ink-muted);
  font-size: 0.7rem;
  font-weight: 500;
}

.clo-assignment-week-summary {
  grid-column: 1;
  align-self: end;
  padding: 7px 9px;
  border: 1px solid var(--clo-border);
  border-radius: var(--clo-radius-xs);
  background: var(--clo-bg);
  color: var(--clo-ink-light);
  font-size: 0.8rem;
  font-weight: 600;
}

.clo-assignment-week-input {
  min-width: 0;
  margin-top: 3px;
  padding: 5px 7px;
  font-size: 0.8rem;
}

.clo-mapping-group {
  margin-top: 18px;
  border: 1px solid var(--clo-border);
  border-radius: var(--clo-radius);
  background: #fff;
}

.clo-mapping-cell {
  min-width: 0;
  padding: 12px 14px;
  background: #fff;
}

.clo-mapping-cell:not(.clo-mapping-clo-cell) {
  border-left: 1px solid var(--clo-border);
}

.clo-mapping-header-cell:nth-child(1),
.clo-mapping-clo-cell {
  position: sticky;
  left: 0;
  z-index: 3;
}

.clo-mapping-header-cell:nth-child(2),
.clo-mapping-measure {
  position: sticky;
  left: 112px;
  z-index: 2;
}

.clo-mapping-header-cell:nth-child(1),
.clo-mapping-header-cell:nth-child(2) { background: var(--clo-bg-warm); }

/* Assignment columns are assessment checkpoints, not generic table headers. */
.clo-mapping-header-cell:nth-child(n + 3) { background: #fff3e0; }

.clo-mapping-measure { background: #fff; }

.clo-mapping-header-cell:nth-child(2),
.clo-mapping-measure { box-shadow: 2px 0 4px rgba(20,15,80,0.06); }

.clo-mapping-clo-cell {
  grid-row: span 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--clo-bg-warm);
  color: var(--clo-ink);
  font-weight: 600;
}

.clo-mapping-clo-cell small {
  margin-top: 3px;
  color: var(--clo-ink-muted);
  font-size: 0.72rem;
  font-weight: 400;
}

.clo-mapping-measure {
  color: var(--clo-ink);
  font-weight: 600;
}

.clo-mapping-measure span,
.clo-mapping-measure small {
  display: block;
}

.clo-mapping-readiness-measure,
.clo-mapping-readiness-cell {
  border-bottom: 1px solid var(--clo-border);
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

.clo-readiness-category {
  display: block;
  width: fit-content;
  margin-top: 4px;
  color: #5b46c7;
  font-size: 0.69rem;
  font-weight: 700;
  line-height: 1.2;
}

.clo-mapping-readiness-cell {
  padding-bottom: 8px;
}

.clo-mapping-demand-cell {
  display: flex;
  align-items: center;
}

.clo-mapping-demand-cell .clo-slider-cell {
  flex: 1 1 auto;
  width: 100%;
  min-width: 0;
  gap: 6px;
}

.clo-mapping-demand-cell .clo-visual-slider {
  min-width: 92px;
}

.clo-mapping-demand-cell .clo-slider-number {
  width: 56px;
}

.clo-readiness-control {
  position: relative;
  display: flex;
  align-items: center;
  min-height: 30px;
}

.clo-readiness-slider {
  --readiness-start: 0%;
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
  background: linear-gradient(to right,
    #cfc5f4 0 var(--readiness-start),
    var(--clo-accent-b) var(--readiness-start) var(--readiness),
    #f5f2ff var(--readiness) 100%);
}

.clo-readiness-slider::-moz-range-track {
  height: 20px;
  border: 1px solid #cfc8ee;
  border-radius: 3px;
  background: linear-gradient(to right,
    #cfc5f4 0 var(--readiness-start),
    var(--clo-accent-b) var(--readiness-start) var(--readiness),
    #f5f2ff var(--readiness) 100%);
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
  color: #5b46c7;
  font-weight: 600;
}

.clo-readiness-proposal {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 5px;
  align-items: center;
  margin-top: 7px;
  padding: 6px;
  border-left: 3px solid var(--clo-accent-b);
  background: #f7f5ff;
  color: var(--clo-ink-light);
  font-size: 0.7rem;
  line-height: 1.3;
}

.clo-readiness-proposal button {
  border: 0;
  border-radius: 3px;
  padding: 3px 5px;
  background: var(--clo-accent-a);
  color: #fff;
  font: inherit;
  cursor: pointer;
}

.clo-readiness-proposal button:last-child {
  background: transparent;
  color: var(--clo-ink-light);
  border: 1px solid var(--clo-border);
}

.clo-inline-link {
  padding: 0;
  border: 0;
  background: transparent;
  color: #4F4099;
  font: inherit;
  font-weight: 700;
  text-decoration: underline;
  text-underline-offset: 2px;
  cursor: pointer;
}

.clo-readiness-proposal .clo-inline-link {
  background: transparent;
  color: #4F4099;
}

.clo-assessment-change-alert {
  display: grid;
  gap: 0.35rem;
  margin-bottom: var(--clo-space-md);
  padding: 0.75rem 0.9rem;
  border-left: 3px solid var(--clo-accent-b);
  background: var(--clo-accent-b-soft);
  color: var(--clo-ink-light);
  font-size: 0.85rem;
  line-height: 1.4;
}

.clo-assessment-change-alert > div {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.4rem;
}

.clo-readiness-opt-in {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--clo-space-md);
  padding: 1.25rem;
  border: 1px solid var(--clo-border);
  border-left: 3px solid var(--clo-accent-b);
  background: var(--clo-bg);
}

.clo-readiness-opt-in h3,
.clo-week-assessments h3,
.clo-summary-issues h3 {
  margin: 0 0 0.35rem;
  font-family: var(--clo-font-display);
  font-size: 1.2rem;
  font-weight: 600;
}

.clo-readiness-opt-in p,
.clo-week-assessments-header p {
  max-width: 68ch;
  margin: 0;
  color: var(--clo-ink-light);
  line-height: 1.5;
}

.clo-readiness-template-note,
.clo-summary-clear {
  margin-bottom: 0.9rem;
  padding: 0.55rem 0.75rem;
  border-left: 3px solid var(--clo-accent-b);
  background: #f7f5ff;
  color: var(--clo-ink-light);
  font-size: 0.88rem;
  line-height: 1.4;
}

.clo-teaching-week {
  margin-top: 0;
  padding: 1.15rem 0;
  border: 0;
  border-top: 1px solid var(--clo-border);
  background: transparent;
}

.clo-teaching-week-actions,
.clo-teaching-week-topline {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.clo-teaching-week-header {
  display: grid;
  gap: 0.5rem;
}

.clo-teaching-week-header,
.clo-week-assessments-header {
  margin-bottom: 0.55rem;
}

.clo-teaching-week-actions {
  justify-content: flex-end;
}

.clo-week-add-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.35rem;
}

.clo-add-week-footer {
  display: flex;
  justify-content: center;
  padding-top: var(--clo-space-md);
}

.clo-teaching-week-topline > strong { flex: 0 0 auto; }
.clo-week-topic-field { flex: 1 1 auto; }

.clo-week-topic {
  width: 100%;
  max-width: none;
  padding: 6px 9px;
}

.clo-empty-hint {
  margin: 0 0 0.8rem;
  color: var(--clo-ink-muted);
  font-size: 0.88rem;
}

.clo-teaching-outcome {
  display: grid;
  grid-template-columns: minmax(170px, 1fr) minmax(260px, 1.6fr) 32px;
  gap: 0.45rem;
  align-items: center;
  margin-bottom: 0.4rem;
  padding: 0.4rem;
  background: #faf9ff;
}

.clo-teaching-outcome .clo-input,
.clo-assessment-clo-details .clo-input {
  padding: 7px 9px;
  font-size: 0.86rem;
}

.clo-teaching-clo-select {
  height: 30px;
  padding: 0 9px !important;
}

.clo-compact-field,
.clo-readiness-level-control {
  display: grid;
  gap: 3px;
  min-width: 0;
  color: var(--clo-ink-muted);
  font-size: 0.68rem;
  font-weight: 600;
}

.clo-week-topic-field.clo-compact-field {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.clo-week-topic-field > span { flex: 0 0 auto; }

.clo-compact-field > span,
.clo-readiness-level-control > span { line-height: 1.1; }

.clo-teaching-readiness-ruler {
  --teaching-readiness-fill: #7a8290;
  --teaching-readiness-fill-soft: #f1f2f4;
  position: relative;
  padding-top: 1.65rem;
  transform: translateY(2px);
  background: transparent;
  color: var(--clo-ink-light);
}

.clo-teaching-readiness-ruler.clo-readiness-foundational {
  --teaching-readiness-fill: #d99a32;
  --teaching-readiness-fill-soft: #fff3e0;
}

.clo-teaching-readiness-ruler.clo-readiness-developing {
  --teaching-readiness-fill: #4b9b57;
  --teaching-readiness-fill-soft: #e8f5e9;
}

.clo-teaching-readiness-ruler.clo-readiness-complete {
  --teaching-readiness-fill: #7561f7;
  --teaching-readiness-fill-soft: var(--clo-accent-b-soft);
}

.clo-teaching-readiness-track { position: relative; }

.clo-teaching-readiness-range-layer {
  position: absolute;
  inset: 0;
  z-index: 2;
  clip-path: inset(0 0 0 var(--teaching-readiness));
  pointer-events: none;
}

.clo-teaching-readiness-range {
  position: absolute;
  top: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 28px;
  overflow: hidden;
  font-size: 0.55rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  line-height: 1;
  pointer-events: none;
  text-transform: uppercase;
  white-space: nowrap;
}

.clo-teaching-readiness-range-foundational {
  left: 1%;
  width: 32%;
  color: #9a6700;
}

.clo-teaching-readiness-range-developing {
  left: 33%;
  width: 66%;
  color: #226a30;
}

.clo-teaching-readiness-slider {
  width: 100%;
  height: 34px;
  margin: 0;
  appearance: none;
  background: transparent;
  cursor: pointer;
}

.clo-teaching-readiness-slider::-webkit-slider-runnable-track {
  height: 28px;
  border: 1px solid color-mix(in srgb, var(--teaching-readiness-fill) 34%, var(--clo-border));
  border-radius: 3px;
  background:
    linear-gradient(to right, var(--teaching-readiness-fill) 0 var(--teaching-readiness), transparent var(--teaching-readiness) 100%),
    linear-gradient(to right, #f1f2f4 0 1%, #fff3e0 1% 33%, #e8f5e9 33% 99%, var(--clo-accent-b-soft) 99% 100%);
}

.clo-teaching-readiness-slider::-moz-range-track {
  height: 28px;
  border: 1px solid color-mix(in srgb, var(--teaching-readiness-fill) 34%, var(--clo-border));
  border-radius: 3px;
  background:
    linear-gradient(to right, var(--teaching-readiness-fill) 0 var(--teaching-readiness), transparent var(--teaching-readiness) 100%),
    linear-gradient(to right, #f1f2f4 0 1%, #fff3e0 1% 33%, #e8f5e9 33% 99%, var(--clo-accent-b-soft) 99% 100%);
}

.clo-teaching-readiness-slider::-webkit-slider-thumb {
  width: 10px;
  height: 34px;
  margin-top: -4px;
  appearance: none;
  border: 0;
  border-radius: 2px;
  background: transparent;
}

.clo-teaching-readiness-slider::-moz-range-thumb {
  width: 10px;
  height: 34px;
  border: 0;
  border-radius: 2px;
  background: transparent;
}

.clo-teaching-readiness-slider:focus-visible {
  outline: 3px solid rgba(131,107,255,0.42);
  outline-offset: 3px;
  border-radius: 3px;
}

.clo-teaching-readiness-category {
  position: absolute;
  bottom: calc(100% + 4px);
  z-index: 4;
  margin: 0;
  transform: translateX(-50%);
  pointer-events: none;
}

@media (min-width: 701px) {
  .clo-teaching-outcome > .clo-compact-field {
    align-self: end;
    padding-bottom: 0.35rem;
  }
}

.clo-readiness-category :deep(.readiness-icon),
.clo-summary-readiness-category :deep(.readiness-icon),
.clo-readiness-select :deep(.readiness-icon) { margin-right: 0.35em; }

.clo-readiness-category,
.clo-summary-readiness-category {
  display: inline-flex;
  align-items: center;
  min-height: 25px;
  padding: 3px 7px;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 600;
  white-space: nowrap;
}

.clo-readiness-category.clo-readiness-not-taught,
.clo-summary-readiness-category.clo-readiness-not-taught,
.clo-readiness-select.clo-readiness-not-taught { background: #e3e5e8; color: #535a66; }

.clo-readiness-category.clo-readiness-foundational,
.clo-summary-readiness-category.clo-readiness-foundational,
.clo-readiness-select.clo-readiness-foundational { background: #f3d7bc; color: #815000; }

.clo-readiness-category.clo-readiness-developing,
.clo-summary-readiness-category.clo-readiness-developing,
.clo-readiness-select.clo-readiness-developing { background: #ccebd0; color: #1d6a2c; }

.clo-readiness-category.clo-readiness-complete,
.clo-summary-readiness-category.clo-readiness-complete,
.clo-readiness-select.clo-readiness-complete { background: #d9ccff; color: #3d2a92; }

.clo-readiness-levels button.clo-readiness-not-taught { background: #e3e5e8; color: #535a66; }
.clo-readiness-levels button.clo-readiness-foundational { background: #f3d7bc; color: #815000; }
.clo-readiness-levels button.clo-readiness-developing { background: #ccebd0; color: #1d6a2c; }
.clo-readiness-levels button.clo-readiness-complete { background: #d9ccff; color: #3d2a92; }

.clo-readiness-alert {
  color: #9b5700 !important;
  font-weight: 700;
}

.clo-readiness-category.clo-readiness-alert {
  padding: 3px 7px;
  border-radius: 999px;
  background: #fff1dc;
}

.clo-icon-btn {
  width: 32px;
  height: 32px;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: var(--clo-danger);
  font-size: 1.25rem;
  line-height: 1;
  cursor: pointer;
}

.clo-icon-btn:hover { background: #fff0f5; }
.clo-icon-btn:disabled { color: var(--clo-ink-muted); opacity: 0.45; cursor: not-allowed; }

.clo-inline-add {
  padding: 5px 11px;
  border: 1px solid var(--clo-accent-b);
  border-radius: 999px;
  background: #fff;
  color: var(--clo-accent-b);
  font-family: var(--clo-font-body);
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
}

.clo-inline-add:hover { color: #fff; background: var(--clo-accent-b); }

.clo-inline-danger {
  padding: 5px 11px;
  border: 1px solid transparent;
  border-radius: 999px;
  background: transparent;
  color: var(--clo-danger);
  font-family: var(--clo-font-body);
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
}

.clo-inline-danger:hover:not(:disabled) { background: #fff0f5; border-color: #f3cedd; }
.clo-inline-danger:disabled { color: var(--clo-ink-muted); cursor: not-allowed; }

.clo-week-assessments {
  margin-top: 0.7rem;
  padding: 0.65rem 0 0;
  border-top: 1px solid #edc982;
}

.clo-week-assessments-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 0.35rem;
}

.clo-week-assessments h3 { margin: 0; font-size: 1rem; }

.clo-assessment-readiness-card {
  display: grid;
  grid-template-columns: minmax(260px, 0.75fr) minmax(420px, 1.25fr) max-content;
  gap: 0.7rem;
  align-items: end;
  margin-top: 0.35rem;
  padding: 0.5rem 0.45rem 0.5rem 0.65rem;
  border: 1px solid #efd5a4;
  border-left: 3px solid #d89220;
  border-radius: var(--clo-radius-xs);
  background: #fff8eb;
}

.clo-focus-target {
  position: relative;
  z-index: 1;
  box-shadow: 0 0 0 3px rgba(131,107,255,0.28);
}

.clo-assessment-info {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 100px;
  gap: 0.45rem;
  align-items: end;
}

.clo-assessment-name { min-width: 0; max-width: 410px; padding: 6px 9px; }
.clo-assessment-info .clo-input { height: 40px; box-sizing: border-box; }

.clo-assessment-week-field {
  display: grid;
  gap: 2px;
  color: var(--clo-ink-muted);
  font-size: 0.68rem;
  font-weight: 600;
}

.clo-assessment-week-field .clo-input {
  min-width: 0;
  padding: 7px 9px;
  font-size: 0.86rem;
}

.clo-assessment-clo-list { min-width: 0; }

.clo-assessment-mapping {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 32px;
  gap: 0.3rem;
  align-items: end;
  padding: 0.25rem 0;
  border-bottom: 1px dashed #efd5a4;
}

.clo-assessment-mapping:last-child { border-bottom: 0; }

.clo-assessment-clo-details {
  display: grid;
  grid-template-columns: minmax(210px, 1.25fr) minmax(175px, 0.75fr);
  gap: 0.45rem;
  align-items: end;
}

.clo-mapping-scroll-cue {
  display: none;
  margin: 0.45rem 0 0;
  color: var(--clo-ink-muted);
  font-size: 0.8rem;
  text-align: right;
}

.clo-assessment-clo-details .clo-validation-message { grid-column: 1 / -1; }
.clo-assessment-clo-controls { display: flex; justify-content: flex-end; align-self: end; }

.clo-assessment-controls { display: flex; align-self: end; align-items: center; gap: 0.6rem; min-height: 32px; }

.clo-assessment-readiness-card > .clo-assessment-change-alert {
  grid-column: 2 / -1;
  grid-row: 2;
  margin: 0;
}

.clo-assignment-remove-action {
  grid-column: 1 / -1;
  display: flex;
  justify-content: flex-end;
  margin-top: 0.1rem;
  padding-top: 0.65rem;
  border-top: 1px solid var(--clo-border);
}

.clo-readiness-select {
  display: flex;
  align-items: center;
  min-height: 34px;
  padding: 0 0.55rem;
  border: 1px solid transparent;
  border-radius: 999px;
}

.clo-readiness-select:focus-within {
  border-color: var(--clo-highlight);
  box-shadow: 0 0 0 3px rgba(131,107,255,0.1);
}

.clo-readiness-select select {
  width: 100%;
  min-width: 0;
  padding: 0.35rem 0.1rem 0.35rem 0;
  border: 0;
  outline: 0;
  color: inherit;
  background: transparent;
  font: inherit;
  font-size: 0.82rem;
  font-weight: 700;
}

.clo-validation-message {
  margin: 0;
  padding: 0.55rem 0.7rem;
  border-left: 3px solid var(--clo-danger);
  background: #fff2f6;
  color: #8f1745;
  font-size: 0.82rem;
  line-height: 1.45;
}

.clo-validation-warning { border-left-color: var(--clo-warning); background: #fffaf0; color: #735410; }
.clo-summary-fallback { margin-bottom: var(--clo-space-md); }
.clo-summary-readiness-cell {
  border: 1px solid var(--clo-border);
  text-align: center;
  background: #faf9ff;
}
.clo-summary-readiness-cell strong,
.clo-summary-readiness-cell small { display: block; }
.clo-summary-readiness-cell small { margin-top: 3px; font-size: 0.72rem; }
.clo-summary-readiness-category { display: inline-flex !important; align-items: center; }
.clo-summary-issues { margin-top: var(--clo-space-md); }

@media (max-width: 860px) {
  .clo-hero {
    padding: 12px var(--clo-space-sm);
  }

  .clo-page-title {
    font-size: 1.25rem;
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

  .clo-mapping-scroll-cue { display: block; }
}

@media (max-width: 540px) {
  .clo-hero {
    align-items: flex-start;
    flex-direction: column;
    gap: 0.5rem;
  }

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

.clo-notes-textarea:focus-visible {
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
  scrollbar-width: thin;
}

.clo-tab-bar::-webkit-scrollbar {
  height: 5px;
}

.clo-tab-bar::-webkit-scrollbar-thumb { background: #cfc8ee; border-radius: 999px; }

.clo-tab-scroll-cue {
  display: none;
  margin: -0.55rem 0 var(--clo-space-md);
  color: var(--clo-ink-muted);
  font-size: 0.8rem;
  text-align: right;
}

@media (max-width: 540px) {
  .clo-tab-scroll-cue { display: block; }
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

@media (max-width: 720px) {
  .clo-teaching-week-actions,
  .clo-teaching-week-topline,
  .clo-week-assessments-header {
    align-items: stretch;
    flex-direction: column;
  }

  .clo-teaching-week-actions { justify-content: stretch; }
  .clo-week-topic-field.clo-compact-field { align-items: stretch; flex-direction: column; gap: 3px; }
  .clo-week-topic,
  .clo-assessment-name { max-width: none; }

  .clo-assessment-info { grid-template-columns: 1fr auto; }

  .clo-teaching-outcome,
  .clo-assessment-mapping {
    grid-template-columns: 1fr auto;
  }

  .clo-teaching-clo-select,
  .clo-readiness-level-control,
  .clo-assessment-clo-details .clo-validation-message { grid-column: 1 / -1; }

  .clo-assessment-readiness-card { grid-template-columns: 1fr; }
  .clo-assessment-controls { flex-direction: row; }
  .clo-assessment-readiness-card > .clo-assessment-change-alert,
  .clo-assignment-remove-action { grid-column: 1; grid-row: auto; }
  .clo-assessment-clo-details { grid-template-columns: 1fr auto; }
  .clo-assessment-level-field { grid-column: 1 / -1; }
}

</style>
