<template>
  <div class="max-w-[720px] mx-auto py-8">
    <div class="flex flex-col items-stretch gap-2 mb-6 max-w-md mx-auto">
      <template v-for="(step, idx) in steps" :key="step.title">
        <button
          @click="toggleStep(idx)"
          class="w-full px-4 py-3 rounded-lg bg-blue-500 text-white font-semibold shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-150 text-center"
          :class="{ 'bg-blue-700': openStep === idx }"
          style="white-space: normal;"
        >
          {{ step.title }}
        </button>
        <svg v-if="idx < steps.length - 1" class="mx-auto my-1" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
      </template>
    </div>
    <transition name="fade-slide" mode="out-in">
      <div v-if="openStep !== null" key="reveal" class="bg-blue-50 border border-blue-200 rounded shadow p-6 max-w-3xl mx-auto animate-fade-in">
        <h3 class="font-bold text-lg mb-2">Purpose:</h3>
        <p class="mb-3 whitespace-pre-line">{{ steps[openStep].purpose }}</p>
        <h4 class="font-semibold mb-1">ISR Context:</h4>
        <ul class="list-disc pl-6 mb-2">
          <li v-for="(item, i) in steps[openStep].isrContext" :key="i">
            <span v-if="i === steps[openStep].isrContext.length - 1" class="italic" v-html="item"></span>
            <span v-else v-html="item"></span>
          </li>
        </ul>
        <div v-if="steps[openStep].note" class="italic text-blue-700 mt-2" v-html="steps[openStep].note"></div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const steps = [
  {
    title: 'Unit and Subsystem Verification',
    purpose: `Confirm that individual hardware and software components meet their design specs.`,
    isrContext: [
      'Does the SAR sensor meet resolution and swath requirements?',
      'Is the STANAG 4607 GMTI stream being formatted and timestamped correctly?',
      'Is the mission computer handling OMS/UCI message traffic within latency thresholds?',
      '<span class="italic">Typically done in isolation or in hardware-in-the-loop test rigs.</span>'
    ],
    note: ''
  },
  {
    title: 'Integration Verification',
    purpose: `Check that components interact properly with each other according to defined interfaces and protocols.`,
    isrContext: [
      'Can EO/IR tasking be triggered from GMTI tracks?',
      'Does the metadata from WAMI feed into the fusion processor correctly?',
      'Are UCI messages received and interpreted correctly by the onboard mission manager?',
      '<span class="italic">Often performed in System Integration Lab (SIL), including partial or virtual components.</span>'
    ],
    note: ''
  },
  {
    title: 'System Validation (Functionality)',
    purpose: `Validate that the ISR system performs its intended mission in a simulated or operationally relevant environment.`,
    isrContext: [
      'Does the end-to-end PED chain (task, collect, process, exploit, disseminate) meet mission timing requirements?',
      'Can multiple INTs be fused to generate actionable insight?',
      'Can operators interact with and retask sensors during a mission?',
      '<span class="italic">Includes scenario-based testing (e.g. detecting and tracking a fast boat with SIGINT + FMV), often with human-in-the-loop.</span>'
    ],
    note: ''
  },
  {
    title: 'Environmental and Edge-Case Testing',
    purpose: `Test the system’s resilience under degraded or extreme conditions.`,
    isrContext: [
      'What happens if SATCOM bandwidth drops by 80%?',
      'Can the system continue functioning when an onboard processor resets mid-mission?',
      'Is performance degraded in contested EW environments?',
      '<span class="italic">Often conducted with simulation-in-the-loop or fault injection frameworks.</span>'
    ],
    note: ''
  },
  {
    title: 'Interoperability & Compliance Testing',
    purpose: `Ensure the system plays well with others—coalition partners, joint C2 systems, and EW/cyber environments.`,
    isrContext: [
      'Are STANAG 4609 video feeds interoperable with allied PED stations?',
      'Can metadata traverse cross-domain guards (low to high)?',
      'Are communications deconflicted with adjacent EW systems?',
      '<span class="italic">Uses interface control documents (ICDs), conformance tools, and joint integration events.</span>'
    ],
    note: ''
  },
  {
    title: 'Operational Test & Evaluation (OT&E)',
    purpose: `Assess the system in a full mission context with end users.`,
    isrContext: [
      'Can operators generate mission products within required timelines?',
      'Do outputs improve situational awareness or target prosecution rates?',
      'Are system interactions intuitive and reliable under stress?',
      '<span class="italic">May be done in large-scale exercises or deployments with early users (e.g. Project Shepherd, Harvest Reaper).</span>'
    ],
    note: ''
  }
];

const openStep = ref(null);
function toggleStep(idx) {
  openStep.value = openStep.value === idx ? null : idx;
}
</script>

<style scoped>
.fade-slide-enter-active, .fade-slide-leave-active {
  transition: all 0.3s cubic-bezier(.4,0,.2,1);
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
.animate-fade-in {
  animation: fadeIn 0.3s;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
