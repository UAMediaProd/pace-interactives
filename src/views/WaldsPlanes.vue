<template>
  <div class="flex w-full my-6">
    <div class="w-1/3 p-2">
      <div class="flex">
        <label for="mode">Mode</label>
        <select id="mode" v-model="currentMode" class="ml-2 border">
          <option v-for="m in Object.keys(modes)" :value="m">{{ m }}</option>
        </select>
      </div>
      <div v-for="loc in planeLocations">
        <div v-if="loc.modes.includes(currentMode)" class="flex">
          <label :for="loc.name" class="min-w-[100px]">{{ loc.display }}</label>
          <input :id="loc.name" min="0" :max="modes[currentMode].inputMax" step="0.1" v-model="inputs[loc.name]" type="range" class="mx-2" />
          <span>{{ inputs[loc.name] }}</span>
        </div>
      </div>

      <button @click="getResults" class="border bg-gray-100">Send planes</button>
    </div>
    <div class="w-2/3 p-2">
      <div>You're adding {{ extraArmour }} extra kilograms of armour to each plane.</div>
      <div>Out of {{ squadronSize }} planes, {{ numReturned }} have returned.</div>
      <div>You have observed {{ numHits }} bullet marks in total on the returned planes.</div>

      <div>That's an average of {{ numReturned ? hitsPerPlane : 'n/a' }} per plane.</div>

      <div v-for="(loc, index) in modes[currentMode].locations">{{ loc }}: {{ hitProportion[index] }}%</div>

    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";

const modes = {
  Beginner: {
    name: "Beginner",
    inputMax: 10,
    locations: ['tail', 'cockpit']
  },
  Intermediate: {
    name: "Intermediate",
    inputMax: 5,
    locations: ['tail', 'rearFusalage', 'fuelTank', 'engines', 'wings', 'cockpit']
  },
  Advanced: {
    name: "Advanced",
    inputMax: 3,
    locations: ['tail', 'rudder', 'elevator', 'rearFusalage', 'midsection', 'fuelTank', 'engines', 'wings', 'winglet', 'aileron', 'flaps', 'cockpit']
  }
}

const planeLocations = [
  { name: 'tail', display: "Tail", modes: ["Beginner", "Intermediate", 'Advanced'] },
  { name: 'cockpit', display: "Cockpit", modes: ["Beginner", "Intermediate", 'Advanced'] },
  { name: 'rearFusalage', display: "Rear Fusalage", modes: ["Intermediate", 'Advanced'] },
  { name: 'fuelTank', display: "Fuel Tank", modes: ["Intermediate", 'Advanced'] },
  { name: 'engines', display: "Engines", modes: ["Intermediate", 'Advanced'] },
  { name: 'wings', display: "Wings", modes: ["Intermediate", 'Advanced'] },
  { name: 'rudder', display: "Rudder", modes: ['Advanced'] },
  { name: 'elevator', display: "Elevator", modes: ['Advanced'] },
  { name: 'midsection', display: "Midsection", modes: ['Advanced'] },
  { name: 'winglet', display: "Winglet", modes: ['Advanced'] },
  { name: 'aileron', display: "Aileron", modes: ['Advanced'] },
  { name: 'flaps', display: "Flaps", modes: ['Advanced'] },
]
const squadronSize = 100
const baseHits = 1.14


const currentMode = ref('Beginner')
const inputs = ref({
  tail: 0,
  rudder: 0,
  elevator: 0,
  rearFusalage: 0,
  midsection: 0,
  fuelTank: 0,
  engines: 0,
  wings: 0,
  winglet: 0,
  aileron: 0,
  flaps: 0,
  cockpit: 0
})
const results = ref([])
const extraArmour = ref(0)

const sd = computed(() => {
  return modes[currentMode.value].inputMax / 8
})

const sumInputs = computed(() => {
  return Object.values(inputs.value).reduce((acc, val) => acc + parseFloat(val), 0)
})

const vulnerability = computed(() => {
  return modes[currentMode.value].locations.map((l, i) => (i + 1) / (modes[currentMode.value].locations.length + 1))
})

const armour = computed(() => {
  return modes[currentMode.value].locations.map(l => parseFloat(inputs.value[l]) + vulnerability.value[0] * modes[currentMode.value].inputMax / 4)
})

const hitsLambda = computed(() => {
  return baseHits * armour.value.reduce((acc, val) => acc + val, 0)
})

const probKill = computed(() => {
  let probKill = []
  for (let i = 0; i < modes[currentMode.value].locations.length; i++) {
    probKill.push(cdf(armour.value[i], vulnerability.value[modes[currentMode.value].locations.length - 1 - i] * modes[currentMode.value].inputMax, sd.value) - cdf(armour.value[i] - sd.value, vulnerability.value[[modes[currentMode.value].locations.length - 1 - i]] * modes[currentMode.value].inputMax, sd.value))
  }
  return probKill
})

const numReturned = computed(() => {
  return Math.round(results.value.reduce((acc, val) => acc + val.length, 0) / squadronSize)
})

const numHits = computed(() => {
  return Math.round(results.value.reduce((acc, val) => acc.concat(val.flat()), []).reduce((acc, val) => acc + val, 0) / squadronSize)
})

const hitsPerPlane = computed(() => {
  return Math.round(numHits.value / numReturned.value * 10) / 10
})

const hitProportion = computed(() => {
  const totalHits = results.value.reduce((acc, val) => acc.concat(val.flat()), []).reduce((acc, val) => acc + val, 0)
  return modes[currentMode.value].locations.map((l, i) => {
    let hits = results.value.flat().reduce((acc, val) => acc + val[i], 0)
    return Math.round(hits / totalHits * 10000) / 100
  }).sort((a, b) => a - b)
})

function mission () {
  let planes = []
  for (let i = 0; i < squadronSize; i++) {
    let eachPlane = []
    const randPicks = sample([...Array(squadronSize * modes[currentMode.value].locations.length).keys()], randomPoisson(hitsLambda.value))
    for (let j = 0; j < modes[currentMode.value].locations.length; j++) {
      let locationHits = randPicks.filter(p => p >= j * (squadronSize - 1) && p < (j + 1) * (squadronSize - 1))
      eachPlane.push(locationHits.length)
    }
    planes.push(eachPlane)
  }

  const altProbKill = probKill.value.map(p => 1 - p)

  const planeKilledStatues = planes.map(plane => {
    return Math.random() < plane.map((loc, lIndex) => {
      return altProbKill[lIndex] ** loc
    }).reduce((acc, val) => acc * val, 1)
  })

  return planes.filter((p, index) => !planeKilledStatues[index])
}

function cdf (x, mean, std) {
  let X = (x - mean) / std
  let T = 1 / (1 + 0.2316419 * Math.abs(X))
  let D = 0.3989423 * Math.exp(-X * X / 2)
  let prob = D * T * (0.3193815 + T * (-0.3565638 + T * (1.781478 + T * (-1.821256 + T * 1.330274))))
  if (X > 0) {
    prob = 1 - prob
  }
  return prob
}


function randomPoisson (lambda) {
  let L = Math.exp(-lambda)
  let k = 0
  let p = 1
  do {
    k++
    p *= Math.random()
  } while (p > L)
  return k - 1
}

function sample (array, n) {
  let result = []
  for (let i = 0; i < n; i++) {
    result.push(array[Math.floor(Math.random() * array.length)])
  }
  return result
}

function getResults () {
  extraArmour.value = sumInputs.value
  let missions = []
  for (let i = 0; i < squadronSize; i++) {
    missions.push(mission())
  }
  results.value = missions
}

onMounted(() => {
  getResults()
})

watch(currentMode, () => {
  for (const key in inputs.value) {
    inputs.value[key] = 0
  }
  getResults()
})
</script>

<style scoped>

</style>