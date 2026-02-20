<template>
  <div id="mapping-demo" class="w-full h-screen">
    <aside class="w-[84px] h-full fixed bg-[#140f50] text-white text-center text-[14px] ">
      <img src="https://instructure-uploads-apse2.s3.ap-southeast-2.amazonaws.com/account_264300000000000001/attachments/7153/AU_Logo_sm.png" class="w-full h-[85px] object-contain" alt="logo">
      <div class="w-full py-[7px]">
        <div class="bg-white w-9 h-9 rounded-full m-auto"/>
        <div class="mt-[1px]">Account</div>
      </div>
      <div class="w-full py-[7px]">
        <div class="w-[26px] h-[26px] mx-auto mt-0.5">
          <svg xmlns="http://www.w3.org/2000/svg" class="ic-icon-svg ic-icon-svg--dashboard" x="0" y="0" viewBox="0 0 280 200" fill="white" xml:space="preserve"><path d="M273.09,180.75H197.47V164.47h62.62A122.16,122.16,0,1,0,17.85,142a124,124,0,0,0,2,22.51H90.18v16.29H6.89l-1.5-6.22A138.51,138.51,0,0,1,1.57,142C1.57,65.64,63.67,3.53,140,3.53S278.43,65.64,278.43,142a137.67,137.67,0,0,1-3.84,32.57ZM66.49,87.63,50.24,71.38,61.75,59.86,78,76.12Zm147,0L202,76.12l16.25-16.25,11.51,11.51ZM131.85,53.82v-23h16.29v23Zm15.63,142.3a31.71,31.71,0,0,1-28-16.81c-6.4-12.08-15.73-72.29-17.54-84.25a8.15,8.15,0,0,1,13.58-7.2c8.88,8.21,53.48,49.72,59.88,61.81a31.61,31.61,0,0,1-27.9,46.45ZM121.81,116.2c4.17,24.56,9.23,50.21,12,55.49A15.35,15.35,0,1,0,161,157.3C158.18,152,139.79,133.44,121.81,116.2Z"></path></svg>
        </div>
        <div class="leading-tight mb-0.5">Dashboard</div>
      </div>
      <div class="w-full py-[7px] bg-white text-[#140f50]">
        <div class="w-[26px] h-[26px] mx-auto mt-0.5">
          <svg xmlns="http://www.w3.org/2000/svg" class="ic-icon-svg ic-icon-svg--courses" x="0" y="0" viewBox="0 0 280 259" fill="#140f50" xml:space="preserve"><path d="M73.31,198c-11.93,0-22.22,8-24,18.73a26.67,26.67,0,0,0-.3,3.63v.3a22,22,0,0,0,5.44,14.65,22.47,22.47,0,0,0,17.22,8H200V228.19h-134V213.08H200V198Zm21-105.74h90.64V62H94.3ZM79.19,107.34V46.92H200v60.42Zm7.55,30.21V122.45H192.49v15.11ZM71.65,16.71A22.72,22.72,0,0,0,49,39.36V190.88a41.12,41.12,0,0,1,24.32-8h157V16.71ZM33.88,39.36A37.78,37.78,0,0,1,71.65,1.6H245.36V198H215.15v45.32h22.66V258.4H71.65a37.85,37.85,0,0,1-37.76-37.76Z"></path></svg>
        </div>
        <div class="leading-tight my-0.5">Courses</div>
      </div>

    </aside>
    <main class="w-full pl-[84px] text-[#140f50]">
      <div class="mx-6 h-[72px] flex border-b border-[#e8eaec]">
        <i class="fal fa-bars my-auto w-[36px] text-center text-[24px]"/>
        <div class="my-auto text-lg ml-[22px]">SANDPIT_DEMO</div>
        <i class="fal fa-chevron-right my-auto text-[10px] mx-3"/>
        <div class="my-auto text-lg">{{ currentMenu }}</div>
      </div>
      <div class="w-full">
        <aside class="w-48 fixed pl-6 py-6">
          <div v-for="menu in menus" class="py-2 pl-1 leading-tight cursor-pointer" :class="currentMenu === menu ? 'font-bold border-l-2 border-[#140f50]' : ''" @click="currentMenu = menu">{{ menu }}</div>
        </aside>
        <div class="w-full pl-48">

          <!--    Outcomes      -->
          <div v-if="currentMenu === 'Outcomes'" class="w-full p-12 pt-9">
            <div class="mx-6">
              <div class="font-bold text-[38px]">Outcomes</div>
              <div class="flex border-b border-[#e8eaec]">
                <div v-for="oTab in outcomesTabs" class="py-3 px-5 leading-tight cursor-pointer" :class="outcomesTab === oTab ? 'border-b-4 border-[#140f50]' : ''" @click="outcomesTab = oTab">{{ oTab }}</div>
              </div>
              <div v-if="outcomesTab === 'Manage'">
                <div v-if="!isOutcomeCreateMode" class="flex justify-between my-2">
                  <div class="font-bold text-lg mt-auto">{{ outcomes.length }} Outcome{{ outcomes.length > 1 ? 's' : '' }}</div>
                  <button class="bg-slate-100 border border-slate-400 rounded-md px-3 py-2 cursor-pointer mr-2 my-2 hover:bg-slate-200" @click="startOutcomeCreate">
                    <i class="far fa-plus"/> Create
                  </button>
                </div>
                <div v-else class="flex justify-between my-2 px-3 py-2 bg-slate-50 rounded-md shadow">
                  <div class="flex grow">
                    <div class="font-bold my-auto mr-3">Name</div>
                    <input v-model="newOutcomeName" type="text" class="border border-slate-200 rounded shadow-inner my-auto px-2 py-1 w-1/2" placeholder="Enter name or code">
                    <div v-if="isOutcomeNameEmpty" class="flex text-red-600 text-sm leading-tight my-auto ml-2">
                      <i class="fas fa-exclamation-circle my-auto mr-1"/>
                      <span class="my-auto">Cannot be blank</span>
                    </div>
                  </div>
                  <div class="flex justify-end">
                    <button class="bg-slate-50 border border-slate-300 rounded-md px-3 py-2 cursor-pointer mr-2 my-auto hover:bg-gray-100" @click="endOutcomeCreate">Cancel</button>
                    <button class="bg-blue-600  rounded-md px-3 py-2 cursor-pointer mr-2 my-auto hover:bg-blue-700 text-white" @click="addOutcome">Create</button>
                  </div>
                </div>
                <hr/>
                <div v-if="outcomes.length">
                  <div v-for="(outcome, index) in outcomes" class="px-4">
                    <div class="flex justify-between">
                      <div class="font-bold py-2">{{ outcome.name }}</div>
                      <button class="border border-red-600 bg-red-50 text-red-600 text-sm px-2 my-auto rounded-full disabled:border-gray-300 disabled:text-gray-600 disabled:bg-gray-100 hover:bg-red-600 hover:text-white cursor-pointer disabled:cursor-not-allowed" :disabled="numOfRubricsMappedToOutcome(outcome.id) > 0" @click="removeOutcome(outcome.id)">Remove</button>
                    </div>
                    <div v-if="index < outcomes.length - 1">
                      <hr>
                    </div>
                  </div>
                </div>
                <div v-else class="flex flex-col my-6">
                  <div class="mx-auto">
                    <img src="@/assets/rubric-outcome-mapping/no-outcome-panda.svg" alt="">
                  </div>
                  <div class="text-center mt-4">There are no outcomes in this course.</div>
                </div>
              </div>
              <div v-if="outcomesTab === 'Alignments'">
                <div class="flex my-2 px-3">
                  <div class="border border-slate-200 shadow rounded-md p-4 mr-3">
                    <div class="text-xl">{{ outcomes.length }} OUTCOMES</div>
                    <div class="flex">
                      <div class="mr-3"><strong class="text-lg">{{ outcomeCoverage }}%</strong> Coverage</div>
                      <div><strong class="text-lg">{{ avgAlignmentsPerOutcome }}</strong> Avg. Alignments per Outcome</div>
                    </div>
                  </div>

                  <div class="border border-slate-200 shadow rounded-md p-4">
                    <div class="text-xl">0 ASSESSABLE ARTIFACTS</div>
                    <div class="flex">
                      <div class="mr-3"><strong class="text-lg">{{ 0 }}%</strong> With Alignments</div>
                      <div><strong class="text-lg">{{ '0.0' }}</strong> Avg. Alignments per Artefact</div>
                    </div>
                  </div>
                </div>
                <div v-if="outcomes.length">
                  <div v-for="(outcome, index) in outcomes" class="px-4">
                    <div class="flex justify-between">
                      <div class="font-bold py-3 my-auto">{{ outcome.name }}</div>
                      <div class="flex justify-end my-auto">
                        <div>Alignments: <strong>{{ numOfRubricsMappedToOutcome(outcome.id) }}</strong></div>
                        <div class="mx-2">(Rubrics: <strong>{{ numOfRubricsMappedToOutcome(outcome.id) }}</strong></div>
                        <div>Assignments: <strong>{{ 0 }}</strong>)</div>
                      </div>
                    </div>

                    <div v-if="index < outcomes.length - 1">
                      <hr>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!--    Rubrics      -->
          <div v-if="currentMenu === 'Rubrics'" class="p-12 pt-9">
            <div v-if="rubricView === 'List'" class="mx-6">
              <div class="flex justify-between">
                <div class="font-bold text-[38px]">Rubrics</div>
                <button class="h-9 bg-blue-600 text-white rounded-md px-4 my-auto hover:bg-blue-700" @click="startCreateRubric"><i class="far fa-plus mr-1"/> Create New Rubric</button>
              </div>
              <table class="w-full">
                <thead>
                  <tr class="text-left border-b">
                    <th class="px-1">Rubric Name</th>
                    <th class="px-1">Total points</th>
                    <th class="px-1">Criteria</th>
                    <th class="px-1">Location Used</th>
                    <th class="px-1">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="rubric in rubrics" class="text-left border-b">
                    <td class="px-1">{{ rubric.name }}</td>
                    <td class="px-1">{{ rubric.criteria.reduce((a,c) => a + c.points, 0) }}</td>
                    <td class="px-1">{{ rubric.criteria.length }}</td>
                    <td class="px-1">-</td>
                    <td class="px-1 flex">
                      <button class="mr-4" @click="startEditRubric(rubric.id)">Edit</button>
                      <button class="text-red-700 disabled:text-gray-400 disabled:cursor-not-allowed" :disabled="false" @click="deleteRubric(rubric.id)">Delete</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div v-if="['Create', 'Edit'].includes(rubricView)" class="mx-6">
              <div class="font-bold text-[38px]">{{ rubricView === 'Create' ? 'Create New' : 'Edit' }} Rubric</div>
              <div class="flex">
                <div class="w-1/2">
                  <div class="font-bold text-lg">Rubric Name <span :class="currentRubric.name ? '' : 'text-red-600'">*</span></div>
                  <input v-model="currentRubric.name" type="text" class="border border-slate-200 shadow-inner rounded w-full px-2 py-1" />
                  <div><span v-if="!currentRubric.name" class="text-red-600 text-sm">Rubric requires a name</span></div>
                </div>
              </div>

              <div class="flex justify-between my-3">
                <div class="font-bold text-xl my-auto">Criteria Builder</div>
                <div class="font-bold text-lg my-auto">{{ currentRubric.criteria.reduce((a,c) => a + c.points, 0) }} Points Possible</div>
              </div>

              <div v-for="(criterion, index) in currentRubric.criteria" class="my-3">
                <div class="flex justify-between">
                  <div class="flex grow">
                    <div class="flex flex-col justify-between w-3 text-lg mr-3">
                      <div><i v-if="index" class="fas fa-caret-up cursor-pointer opacity-60 hover:opacity-100" @click="swapCriterion(index, index-1)"/></div>
                      <div><i v-if="index < currentRubric.criteria.length - 1" class="fas fa-caret-down cursor-pointer opacity-60 hover:opacity-100" @click="swapCriterion(index, index+1)" /></div>
                    </div>
                    <div class="text-lg font-bold mr-2">{{ index + 1 }}. </div>
                    <div class="my-auto">
                      <div class="text-lg font-bold">{{ criterion.name }}</div>
                      <div v-if="criterion.description" class="text-sm text-slate-600 leading-tight">{{ criterion.description }}</div>
                      <div class="text-sm font-bold">Outcome: <span :class="outcomes.find(o => o.id === criterion.outcomeId) ? 'text-white bg-orange-600 rounded-full px-2 py-0.5 ml-0.5' : 'font-normal text-slate-600'">{{ outcomes.find(o => o.id === criterion.outcomeId) ? outcomes.find(o => o.id === criterion.outcomeId).name : 'N/A' }}</span></div>
                    </div>
                  </div>
                  <div class="flex justify-end">
                    <div class="rounded-full bg-sky-600 text-white text-sm px-2 my-auto mx-2">{{ criterion.points }} pts</div>
                    <div class="mx-2 my-auto"><i class="fal fa-pencil-alt cursor-pointer" @click="editCriterion(criterion.id)" /></div>
                    <div class="mx-2 my-auto"><i class="fal fa-trash-alt text-red-700 cursor-pointer" @click="deleteCriterion(criterion.id)"/></div>
                  </div>
                </div>
                <hr class="my-1" />
              </div>

              <div class="flex my-3">
                <button class="border border-gray-300 bg-gray-50 text-gray-800 hover:bg-gray-200 rounded-md px-2 py-1 my-auto" @click="createCriterion">
                  <i class="fal fa-pencil-alt -scale-x-100 text-lg mr-1"/>Draft New Criterion
                </button>
              </div>

              <hr />
              <div class="flex justify-end py-2">
                <button class="bg-slate-50 border border-slate-300 rounded-md px-3 py-2 cursor-pointer mr-2 my-auto hover:bg-gray-100" @click="endEditRubric">Cancel</button>
                <button v-if="rubricView === 'Create'" class="bg-indigo-500  rounded-md px-3 py-2 cursor-pointer mr-2 my-auto hover:bg-indigo-700 text-white disabled:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed" :disabled="!currentRubric.name || !currentRubric.criteria" @click="createRubric">Create rubric</button>
                <button v-else class="bg-indigo-500  rounded-md px-3 py-2 cursor-pointer mr-2 my-auto hover:bg-indigo-700 text-white disabled:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed" :disabled="!currentRubric.name || !currentRubric.criteria" @click="updateRubric">Save rubric</button>
              </div>

            </div>

            <div v-if="rubricView === 'View'" class="mx-6">

            </div>


            <div v-show="criterionMode" id="CriterionModal" class="fixed inset-0 z-[999] h-screen w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300 flex justify-center">
              <div class="w-3/5 rounded bg-white shadow overflow-hidden">
                <div class="py-3 px-4 text-xl font-bold">{{ criterionMode === 'Create' ? 'Create new' : 'Edit' }} criterion</div>
                <hr/>
                <div class="p-4">
                  <div class="flex">
                    <div class="w-1/3 px-1">
                      <div class="font-bold">Criterion name</div>
                      <input v-model="currentCriterion.name" type="text" class="border border-slate-200 shadow-inner rounded w-full px-2 py-1" placeholder="Enter the name" />
                    </div>
                    <div class="w-2/3 px-1">
                      <div class="font-bold">Criterion description</div>
                      <textarea id="CriterionDescription" v-model="currentCriterion.description" rows="1" style="resize: none" class="border border-slate-200 shadow-inner rounded w-full text-wrap px-2 py-1" placeholder="Enter the description" @focus="resizeTextarea('CriterionDescription')" @input="resizeTextarea('CriterionDescription')" @keydown="preventNewLine($event)"/>
                    </div>
                  </div>
                  <div class="flex justify-between my-4">
                    <div>4 - Exceeds <span class="text-slate-300 mx-1">|</span> 3 - Mastery <span class="text-slate-300 mx-1">|</span> 2 - Near <span class="text-slate-300 mx-1">|</span> 1 - Below <span class="text-slate-300 mx-1">|</span> 0 - No Evidence</div>
                    <div>4 Points possible</div>
                  </div>
                  <div class="flex mb-3">
                    <div class="my-auto mr-2 font-bold">Map to Outcome:</div>
                    <select v-model="currentCriterion.outcomeId" class="my-auto p-2 border border-slate-300 rounded-md shadow-inner" :class="currentCriterion.outcomeId ? 'font-bold' : 'text-gray-500'">
                      <option value="">Select an outcome</option>
                      <option v-for="outcome in outcomes" :value="outcome.id" class="font-bold">{{ outcome.name }}</option>
                    </select>
                  </div>
                </div>
                <div class="flex py-3 px-4 border-t border-slate-300 bg-gray-100">
                  <button class="rounded-md border border-slate-300 py-2 px-4 text-center hover:bg-gray-200" @click="closeCriterionModal">Cancel</button>
                  <button class="rounded-md bg-blue-600 py-2 px-4 text-center text-white hover:bg-blue-700 disabled:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50 ml-2" :disabled="!currentCriterion.name" @click="saveCriterion">Save criterion</button>
                </div>
              </div>
            </div>
          </div>

          <!--    Rubrics      -->
          <div v-if="currentMenu === 'Assignments'" class="p-12 pt-9">
            <div class="mx-6">
              <div class="font-bold text-[38px]">Assignments</div>
            </div>
          </div>

          <!--    Grades      -->
          <div v-if="currentMenu === 'Grades'" class="p-12 pt-9">
            <div class="mx-6">
              <div class="font-bold text-[38px]">Grades</div>
            </div>
          </div>
        </div>
      </div>

    </main>
  </div>

</template>

<script setup>
import { computed, ref, watch } from "vue";

const menus = ['Outcomes', 'Rubrics', 'Assignments', 'Grades']
const outcomesTabs = ['Manage', 'Alignments']
const rubricViews = ['List', 'Create', 'View', 'Edit']
const newRubric = { id: '', name: '', criteria: []}
const newCriterion = { id: '', name: '', description: '', points: 4, outcomeId: '' }

const currentMenu = ref(menus[1])
const outcomesTab = ref(outcomesTabs[0])
const rubricView = ref(rubricViews[0])

const isOutcomeCreateMode = ref(false)
const newOutcomeName = ref('')
const isOutcomeNameEmpty = ref(false)
const criterionMode = ref('') //Create, Edit

const outcomes = ref(JSON.parse(localStorage.getItem('outcomes:rubric-outcome-mapping') || '[]') || [])
const rubrics = ref(JSON.parse(localStorage.getItem('rubrics:rubric-outcome-mapping') || '[]') || [])

const currentRubric = ref({ ...newRubric })
const currentCriterion = ref({ ...newCriterion })

const outcomeCoverage = computed(() => {
  return outcomes.value.length ? Math.round(outcomes.value.filter(r => numOfRubricsMappedToOutcome(r.id)).length / outcomes.value.length * 1000)/10 : 0
})

const avgAlignmentsPerOutcome = computed(() => {
  return outcomes.value.length
    ? outcomes.value.reduce((a, c) => a + numOfRubricsMappedToOutcome(c.id), 0) / outcomes.value. length
    : 0
})

function numOfRubricsMappedToOutcome(id) {
  return rubrics.value.filter(r => r.criteria.filter(c => c.outcomeId === id).length).length
}

function clearOutcomeInput () {
  newOutcomeName.value = ''
  isOutcomeNameEmpty.value = false
}

function startOutcomeCreate () {
  clearOutcomeInput()
  isOutcomeCreateMode.value = true
}

function endOutcomeCreate () {
  clearOutcomeInput()
  isOutcomeCreateMode.value = false
}

function saveOutcomesToLocal () {
  localStorage.setItem('outcomes:rubric-outcome-mapping', JSON.stringify(outcomes.value))
}

function addOutcome () {
  if (!newOutcomeName.value) {
    isOutcomeNameEmpty.value = true
    return
  }
  const uid = Date.now().toString(32)
  outcomes.value.push({
    id: 'o-' + uid,
    name: newOutcomeName.value,
  })
  newOutcomeName.value = ''
  isOutcomeCreateMode.value = false
  saveOutcomesToLocal()
}

function removeOutcome (id) {
  const index = outcomes.value.findIndex(e => e.id === id)
  if (index > -1) {
    outcomes.value.splice(index, 1)
    saveOutcomesToLocal()
  }
}

function startCreateRubric() {
  currentRubric.value = { ...newRubric, criteria: [] }
  rubricView.value = 'Create'
}

function startEditRubric(id) {
  const selected = rubrics.value.find(r => r.id === id)
  if (!id || !selected ) {
    return
  }
  currentRubric.value = { ...selected }
  rubricView.value = 'Edit'
}

function endEditRubric() {
  rubricView.value = 'List'
  currentRubric.value = { ...newRubric, criteria: [] }
}

function createRubric() {
  rubrics.value.push({ ...currentRubric.value, id: 'r-' + Date.now().toString(32) })
  endEditRubric()
  saveRubricsToLocal()
}

function updateRubric() {
  if (!currentRubric.value.id || !currentRubric.value.name || !currentRubric.value.criteria) {
    return
  }
  const index = rubrics.value.findIndex(r => r.id === currentRubric.value.id)
  rubrics.value[index] = { ...currentRubric.value }
  endEditRubric()
  saveRubricsToLocal ()
}

function deleteRubric(id) {
  const index = rubrics.value.findIndex(r => r.id === id)
  if (index > -1) {
    rubrics.value.splice(index, 1)
    saveRubricsToLocal()
  }
}

function saveRubricsToLocal () {
  localStorage.setItem('rubrics:rubric-outcome-mapping', JSON.stringify(rubrics.value))
}

function createCriterion() {
  currentCriterion.value = { ...newCriterion }
  criterionMode.value = 'Create'
}

function editCriterion(id) {
  const selected = currentRubric.value.criteria.find(c => c.id === id)
  if (!id ||!selected ) {
    return
  }
  currentCriterion.value = { ...selected }
  criterionMode.value = 'Edit'
}

function deleteCriterion(id) {
  const index = currentRubric.value.criteria.findIndex(c=> c.id === id)
  if (index > -1) {
    currentRubric.value.criteria.splice(index, 1)
  }
}

function closeCriterionModal() {
  criterionMode.value = ''
  currentCriterion.value = { ...newCriterion }
}

function saveCriterion() {
  if (!currentCriterion.value.id) {
    currentCriterion.value.id = 'c-' + Date.now().toString(32)
    currentRubric.value.criteria.push(currentCriterion.value)
  } else {
    const index = currentRubric.value.criteria.findIndex(c => c.id === currentCriterion.value.id)
    if (index > -1) {
      currentRubric.value.criteria[index] = { ...currentCriterion.value }
    } else {
      return
    }
  }
  closeCriterionModal()
}

function swapCriterion(index1, index2) {
  const temp = currentRubric.value.criteria[index1]
  currentRubric.value.criteria[index1] = currentRubric.value.criteria[index2]
  currentRubric.value.criteria[index2] = temp
}


function resizeTextarea (id) {
  const textarea = document.querySelector(`#${id}`)
  textarea.style.height = 'auto'
  textarea.style.height = `${textarea.scrollHeight + 2}px`
}

function preventNewLine (e) {
  if (e.keyCode === 13) {
    e.preventDefault()
  }
}

watch(currentMenu, () => {
  if (currentMenu.value === 'Outcomes') {
    outcomesTab.value = outcomesTabs[0]
  }
})

watch(currentMenu, () => {
  if (currentMenu.value === 'Rubrics') {
    rubricView.value = rubricViews[0]
  }
})
</script>

<style scoped>
@import url("https://pro.fontawesome.com/releases/v5.15.0/css/all.css");
@import url('https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,400;0,700;1,400;1,700&family=Source+Code+Pro:ital,wght@0,200..900;1,200..900&display=swap');

#mapping-demo {
  font-family: "Lato", sans-serif;
}

</style>