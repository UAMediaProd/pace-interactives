<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-center w-full px-3 py-6">
    <div v-for="(card, index) in cardData" class="group h-80 w-[245px] mx-auto">
      <div class="relative w-full h-full rounded-xl shadow-lg transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
        <div class="absolute inset-0">
          <img class="h-full w-full rounded-xl shadow-lg object-cover" :src="`https://mediaproduction.adelaide.edu.au/pace-interactives/images/${card.cover}`" alt="">
        </div>
        <div class="absolute inset-0 h-full w-full rounded-xl bg-black/70 px12 text-center text-slate-200 [transform:rotateY(180deg)] [backface-visibility:hidden]">
          <div class="flex flex-col justify-end items-center h-full p-4">
            <div class="grow flex flex-col justify-center px-4">
              <div class="font-bold text-xl leading-6 mb-4">{{ card.title }}</div>
              <ul class="list-disc text-left px-4 text-sm mx-auto">
                <li v-for="point in card.points">{{ point }}</li>
              </ul>
            </div>
            <button class="bg-primary opacity-80 hover:opacity-100 text-white px-5 py-2 rounded-full my-3 h-fit" @click="showModal = index">Learn More</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-if="showModal !== null" class="fixed top-0 left-0 z-20 flex justify-center items-center w-screen h-screen bg-black/50 backdrop-blur-sm">
    <div class="flex max-h-[90vh] w-11/12 max-w-2xl flex-col overflow-y-scroll rounded bg-white px-8 py-4 shadow-lg">
      <div class="flex justify-between mb-2">
        <h2 class="text-xl font-bold">{{ cardData[showModal].title }}</h2>
        <div class="flex justify-center items-center w-8 h-8 rounded-full bg-primary-tint text-gray-400 hover:bg-gray-300 hover:text-gray-700 cursor-pointer" @click="closeModal">
          <i class="far fa-times text-lg"/>
        </div>
      </div>
      <div v-if="cardData[showModal].description" class="leading-5 mb-2">{{ cardData[showModal].description}}</div>
      <ul class="list-disc text-left px-4 mx-auto">
        <li v-for="point in cardData[showModal].list" class="leading-5 mb-1.5">{{ point }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const cardData = [
  {
    title: 'Giving Feedback to Direct Reports',
    description: '',
    points:['Holding Regular Meetings', 'Open Approach'],
    list: [
      'Holding Regular Meetings: Conduct regular check-ins to offer support and share feedback.',
      'Open Approach: Start the conversation with openness, like, "I have some feedback about ...... Is this a good time to discuss that?"'
    ],
    cover: 'give_feedback.png'
  },
  {
    title: 'Coaching Mindset',
    description: 'Use coaching language which includes focusing on improvement areas, explaining the impact and offering guidance to your team rather than giving direct suggestions. Coaches often help their coachees to uncover the answers and give them tools to do so.',
    points: ['Two-Way Dialogue', 'Supportive Conclusion'],
    list: [
      'Two-Way Dialogue: Allow space for direct reports to respond, showing that you value their perspective and input.',
      'Supportive Conclusion: End with an offer of support, asking, "How can I support you better in the future?"'
    ],
    cover: 'coaching_mindset.png'
  },
  {
    title: 'Receiving Feedback from Direct Reports',
    description: 'In addition, a successful leader values feedback from their team so here are some ways we can do that effectively:',
    points: ['Create Safety', 'Open Communication', 'Encourage Feedback', 'Active Listening', 'Implement and Follow-up', 'Upward feedback'],
    list: [
      'Create Safety: Ensure a psychologically safe space for team members to express themselves freely.',
      'Open Communication: Foster a culture of honest communication by sharing your experiences and showing appreciation for openness.',
      'Encourage Feedback: Directly ask for feedback and take it seriously, demonstrating your openness and commitment to improvement.',
      'Active Listening: Validate the feedback by repeating it back ensuring you understand it correctly.',
      'Implement and Follow-up: Act on the feedback and discuss the steps taken to prove your dedication to positive change.',
      'Upward feedback: Encourage direct reports to also provide you with feedback. When using this, research stresses the importance of timing and context. Approaching feedback as a two-way street, where leaders are not just the givers but also the recipients of feedback, is vital for creating a culture of continuous improvement and mutual respect​​. It helps us to build strong relationships with our teams also and show them that we trust their perspective and opinions.'
    ],
    cover: 'receive_feedback.png'
  },
]


const showModal = ref(null)

function closeModal() {
  showModal.value = null
}

</script>