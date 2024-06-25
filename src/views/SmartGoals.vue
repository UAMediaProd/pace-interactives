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
                <div class="font-bold italic leading-6 mr-2">"{{ goal.flip }}"</div>
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
    explanation: 'What needs to be accomplished? Who is involved and is responsible for it?',
    color: '#fa6769',
    icon: 'fa-bullseye-arrow',
    flip: 'Design and launch a peer mentorship program connecting 100 first-year students with 25 trained mentors from the same faculty.',
  },
  {
    title: 'Measurable',
    init: 'M',
    explanation: 'Includes quantifiable indicators of progress. Specifies how success will be evaluated.',
    color: '#f8961e',
    icon: 'fa-analytics',
    flip: 'Track the number of mentor-mentee pairings formed and measure program effectiveness through monthly participation rates and end-of-semester feedback.',
  },
  {
    title: 'Achievable',
    init: 'A',
    explanation: 'Goals should be realistic and attainable. It\'s good to aim high, but the goal should not be so challenging that it becomes impossible to achieve. Ask yourself \"Do we have the knowledge, skills and resources to achieve our goal?\"',
    color: '#90be6d',
    icon: 'fa-trophy-alt',
    flip: 'Select and train 25 high-achieving students as mentors, providing them with clear guidelines and resources. Work with academic advisors to identify and invite 100 first-year students who would benefit most from the program.',
  },
  {
    title: 'Relevant',
    init: 'R',
    explanation: 'Goals should be aligned with broader objectives relevant to the bigger picture, whether that is at an individual, team, or institutional level.',
    color: '#4cc9f0',
    icon: 'fa-draw-circle',
    flip: 'The peer mentorship program directly supports the faculty’s goal of improving first-year student retention by providing personalised guidance, fostering a sense of community, and helping new students navigate academic challenges.',
  },
  {
    title: 'Time-bound',
    init: 'T',
    explanation: 'Goals should have a specific timeframe for completion to encourage effective time management. Ask yourself \"When will we start?\" \"When will we assess the project?\" \"When will we finish?\"',
    color: '#a279b5',
    icon: 'fa-calendar-alt',
    flip: 'Complete mentor recruitment and training by June 15th, finalise mentee selection by July 1st, and launch the program during the first week of the second semester. Conduct mid-semester check-ins and a full program evaluation by December 15th.',
  }
]

</script>