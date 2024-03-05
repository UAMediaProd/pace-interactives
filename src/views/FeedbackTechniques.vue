<template>
  <div class="w-full">
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-center w-full px-3 py-6">
      <div v-for="(card, index) in cardData" class="group h-80 w-[245px] mx-auto">
        <div class="relative w-full h-full rounded-xl shadow-lg transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
          <div class="absolute inset-0">
            <img class="h-full w-full rounded-xl shadow-lg object-cover" :src="`https://mediaproduction.adelaide.edu.au/pace-interactives/images/${card.cover}`" alt="">
          </div>
          <div class="absolute inset-0 h-full w-full rounded-xl bg-black/70 text-center text-slate-200 [transform:rotateY(180deg)] [backface-visibility:hidden]">
            <div class="flex flex-col justify-end items-center h-full p-4">
              <div class="grow flex flex-col justify-center px-1">
                <div class="font-bold text-xl leading-6 mb-4">{{ card.title }}</div>
                <ul class="list-disc text-left pl-2 text-sm mx-auto">
                  <li v-for="point in card.points">{{ point }}</li>
                </ul>
              </div>
              <button class="bg-primary opacity-80 hover:opacity-100 text-white px-5 py-2 rounded-full my-3 h-fit" @click="showModal = index">Learn More</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showModal !== null" class="fixed top-0 left-0 z-20 flex justify-center items-center w-full h-full backdrop-blur-sm overflow-hidden">
      <div class="flex max-h-[90%] md:max-h-[300px] w-11/12 max-w-2xl flex-col rounded-lg bg-white px-2 py-4 shadow-md drop-shadow-md">
        <div class="flex justify-between pl-6 mb-2">
          <div class="text-2xl font-bold my-auto">{{ cardData[showModal].title }}</div>
          <div class="flex justify-center items-center w-8 h-8 -mt-1 rounded-full bg-primary-tint text-gray-400 transition-all duration-100 hover:bg-indigo-200 hover:text-gray-700 hover:rotate-90 cursor-pointer" @click="closeModal">
            <i class="far fa-times text-lg" />
          </div>
        </div>
        <div class="overflow-y-scroll px-6 w-full">
          <div v-for="p in cardData[showModal].description" class="leading-5 mb-2">{{ p }}</div>
          <ul v-if="cardData[showModal].list" class="list-disc text-left pl-4 mx-auto">
            <li v-for="point in cardData[showModal].list" class="leading-5 mb-1.5">{{ point }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const cardData = [
  {
    title: 'Providing feedback',
    description: ['Hold regular meetings to offer support and share feedback with your direct reports.', 'Get the most out of your feedback conversations by:'],
    points: ['Starting the conversation with openness', 'Creating a two-way dialogue', 'Ending the conversation with an offer of support'],
    list: [
      'Starting the conversation with openness. You could say, "I have some feedback about ...... Is this a good time to discuss that?"',
      'Creating a two-way dialogue. Allow space for direct reports to respond to show that you value their perspective and input.',
      'Ending the conversation with an offer of support. You could say, "How can I support you better in the future?"'
    ],
    cover: 'give_feedback.png'
  },
  {
    title: 'Employ a coaching mindset',
    description: ['Use a coaching approach: coaches often help their coachees to uncover the answers to problems and provide them with tools to do so. Support them to focus on improvement areas and explain the current impact on the work and the team. The key here is to offer guidance, rather than give direct suggestions and solutions.'],
    points: ['Use a coaching approach', 'Provide tools and guidance rather than solutions.'],
    list: [],
    cover: 'coaching_mindset.png'
  },
  {
    title: 'Receiving feedback',
    description: ['You should encourage your direct reports to provide you with feedback. Approaching feedback as a two-way street, where leaders are not just the givers but also the recipients of feedback, is vital for creating a culture of continuous improvement and mutual respect​​. It helps us to build strong relationships with our teams and show them that we trust their perspectives and opinions. Here are some tips for effectively supporting your direct reports to give you feedback.'],
    points: ['Create Safety', 'Encourage feedback', 'Listen', 'Communicate openly', 'Act on the feedback received and discuss the steps to take'],
    list: [
      'Create safety. Ensure a psychologically safe space for team members to express themselves freely.',
      'Encourage feedback. Directly ask for feedback and take it seriously, demonstrating your commitment to improvement.',
      'Listen. Validate the feedback you receive by repeating it back to ensure you understand it correctly.',
      'Communicate openly. Foster a culture of honest communication by sharing your experiences and showing appreciation when others are open with you.',
      'Act on the feedback you receive and discuss the steps you plan to take. This will demonstrate your dedication to positive change.',
    ],
    cover: 'receive_feedback.png'
  },
]


const showModal = ref(null)

function closeModal () {
  showModal.value = null
}

</script>