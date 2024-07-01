<template>
  <div class="w-full min-w-[760px] max-w-[1000px] grid grid-cols-1 gap-3 items-center px-[2%] py-6 mx-auto">
    <div v-for="goal in goals" class="group h-30 w-full mx-auto">
      <div class="relative w-full h-24 rounded-r-xl transition-all duration-500 border-l-4 [transform-style:preserve-3d] group-hover:[transform:rotateX(180deg)]" :style="{background: goal.color+'20', borderColor: goal.color}">
        <div class="absolute inset-0 w-full h-full flex justify-between rounded-r-xl shadow-md [transform:rotateX(0deg)] [backface-visibility:hidden]">
          <div class="w-fit -ml-1 my-auto" :style="{background: goal.color}">
            <div class="flex text-center justify-center items-center h-24 w-24 text-4xl font-bold text-white my-auto scale-150">
              <i :class="`fas ${goal.icon} text-3xl text-white/80 scale-125 w-20 my-auto`" />
            </div>
          </div>
          <div class="flex text-left my-auto grow">
            <div class="my-auto -ml-0.5"><i class="fas fa-caret-right text-4xl" :style="{color: goal.color}" /></div>
            <div class="grow font-bold text-2xl ml-20 my-auto">{{ goal.explanation }}</div>
          </div>
        </div>
        <div class="absolute inset-0 h-full w-full rounded-r-xl shadow-md bg-black/10 [transform:rotateX(180deg)] [backface-visibility:hidden]">
          <div class="flex justify-center w-full h-full relative">
            <div class="w-full pl-2 mx-auto my-auto">
              <div class="w-fit max-w-[720px] mx-auto">
                <div class="leading-5 mr-2">{{ goal.flip }}</div>
              </div>
            </div>
            <div class="absolute bottom-0 right-0 flex text-center items-center justify-center text-xl font-bold text-white h-10 w-10 rounded-xl my-auto">
              <i :class="`fad ${goal.icon} text-2xl my-auto`" :style="{color: goal.color}" />
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
    explanation: 'Lead by example, even in small tasks',
    color: '#F9C74F',
    icon: 'fa-hand-holding-box',
    flip: 'A good role model works hard and helps their team when needed, showing commitment to the organisation. No task should be beneath a manager. If dishes need washing and no one else is available, do it yourself and do it well. This demonstrates that a \'it\'s not my job\' mentality isn\'t acceptable in your team.',
  },
  {
    explanation: 'Maintain your composure',
    color: '#90BE6D',
    icon: 'fa-users-cog',
    flip: 'When challenges come up, our teams notice how we handle them. If we overreact or get easily overwhelmed, our staff might do the same. It\'s crucial to stay composed even when things don\'t go as planned.',
  },
  {
    explanation: 'Take responsibility for your mistakes',
    color: '#43AA8B',
    icon: 'fa-ballot-check',
    flip: 'As leaders, we\'re human and we make mistakes. When that happens, we should take responsibility - we should admit our mistake and let the team know how we plan to fix it. Avoid blaming others or making excuses: by modelling accountability and vulnerability, we encourage our teams to do the same.',
  },
  {
    explanation: 'Take a stand when you see something is wrong',
    color: '#4cc9f0',
    icon: 'fa-person-sign',
    flip: 'When poor behaviours go unchallenged, they\'re accepted. By calling them out, you encourage others to act ethically and address unacceptable conduct.',
  },
  {
    explanation: 'Ask for feedback',
    color: '#337BB0',
    icon: 'fa-comments-alt',
    flip: 'Asking your team members questions like, \"what aspects of my leadership style do you value, and what can I improve on?\" provides valuable insights into how others see your leadership. It also encourages your team members to seek feedback themselves.',
  },
  {
    explanation: 'Reflect on your leadership practice',
    color: '#a279b5',
    icon: 'fa-lightbulb-on',
    flip: 'Being a great role model isn\'t easy. It requires self-awareness, regular reflection, and a lot of practise. ask yourself questions like, \"did I demonstrate openness to others\' ideas?\" and \"did I embrace feedback as a way to improve, or did I take it personally?\" will help you to identify strengths and areas for improvement.',
  }
]

</script>