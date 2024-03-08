<template>
  <div class="w-full min-w-[760px] grid grid-cols-1 gap-3 items-center px-[2%] py-6">
    <div v-for="goal in goals" class="group h-30 w-full mx-auto">
      <div class="relative w-full h-24 rounded-r-xl shadow-lg transition-all duration-500 border-l-4 [transform-style:preserve-3d] group-hover:[transform:rotateX(180deg)]" :style="{background: goal.color+'20', borderColor: goal.color}">
        <div class="absolute inset-0 w-full h-full flex justify-between [transform:rotateX(0deg)] [backface-visibility:hidden]">
          <div class="w-fit -ml-1 my-auto" :style="{background: goal.color}">
            <span class="flex text-center justify-center items-center h-24 w-24 text-4xl font-bold text-white my-auto scale-150">{{ goal.init }}</span>
          </div>
          <div class="flex text-left my-auto grow">
            <div class="w-fit my-auto ml-3">
              <div class="w-[108px] font-bold text-lg my-auto">{{ goal.title }}</div>
            </div>
            <div class="grow leading-5 my-auto">{{ goal.explanation }}</div>
          </div>
          <div class="flex justify-center text-center my-auto w-fit">
            <i :class="`fad ${goal.icon} text-4xl scale-125 w-20 my-auto`" :style="{color: goal.color}" />
          </div>
        </div>
        <div class="absolute inset-0 h-full w-full rounded-r-xl bg-black/10 [transform:rotateX(180deg)] [backface-visibility:hidden]">
          <div class="flex justify-center w-full h-full relative">
            <div class="w-full pl-2 mx-auto my-auto">
              <div class="w-fit max-w-[705px] mx-auto">
                <div class="font-bold leading-6">{{ goal.question }}</div>
                <ul class="list-disc text-left flex flex-wrap pl-4 text-sm mx-auto leading-5">
                  <li v-for="(point, index) in goal.list" :class="index < goal.list.length - 1 ? 'mr-6' : ''">{{ point }}</li>
                </ul>
              </div>
            </div>

            <div class="absolute top-0 right-0 flex text-center items-center justify-center text-xl font-bold text-white h-12 w-12 rounded-xl my-auto">
              <i :class="`fad ${goal.icon} text-3xl my-auto`" :style="{color: goal.color}" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

const goals = [
  {
    title: 'Specific',
    init: 'S',
    explanation: 'Goals should be clear and specific, answering the questions of who, what, where, when and why. This helps to provide a clear purpose.',
    color: '#fa6769',
    icon: 'fa-bullseye-arrow',
    question: 'What outcome do I want to achieve? Consider:',
    list: [
      'Who?',
      'What?',
      'Where?',
      'Whe?',
      'Why?'
    ]
  },
  {
    title: 'Measurable',
    init: 'M',
    explanation: 'Goals should include criteria that allow for progress measurement. This helps to track and assess whether a goal has been met.',
    color: '#f8961e',
    icon: 'fa-analytics',
    question: 'How will I know if I\'ve achieved my goal? Consider:',
    list: [
      'How much?',
      'What will progress look like?',
      'How will quality be measured?',
    ]
  },
  {
    title: 'Achievable',
    init: 'A',
    explanation: 'Goals should be realistic and attainable. It\'s good to aim high, but the goal should not be so challenging that it becomes impossible to achieve.',
    color: '#90be6d',
    icon: 'fa-trophy-alt',
    question: 'How will I assess if my goal is achievable? Consider:',
    list: [
      'Do I have the knowledge, skills, and resources to achieve my goal? If not, what am I missing? How can I address these deficits?',
      'Have other people been able to achieve this goal before? What can I learn or adapt from their experience to assist me?',
    ]
  },
  {
    title: 'Relevant',
    init: 'R',
    explanation: 'Goals should be aligned with broader objectives relevant to the bigger picture, whether that is at an individual, team, or institution level.',
    color: '#4cc9f0',
    icon: 'fa-draw-circle',
    question: 'How will I assess the relevance of my goal? Consider:',
    list: ['How does this goal align with my other personal objectives or the objectives of my team or institution?']
  },
  {
    title: 'Time-bound',
    init: 'T',
    explanation: 'Goals should have a specific timeframe for completion to encourage effective time management.',
    color: '#a279b5',
    icon: 'fa-calendar-alt',
    question: 'When will I achieve my goal? Consider:',
    list: [
      'When will I begin?',
      'When will I assess my progress?',
      'When will I finish?',
    ]
  }
]

</script>