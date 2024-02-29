<template>
  <div class="min-h-screen flex flex-col justify-between">
    <div class="flex flex-col justify-start">
      <div class="bg-primary-darker m-0 min-h-[30px] p-4">
        <div class="home-wrapper"><img class="my-2" src="@/assets/uoa-logo.png" width="160" alt="" /></div>
      </div>
      <div class="home-wrapper">
        <h2>PACE Interactives</h2>
        <p>Interactives for PACE courses at The University of Adelaide</p>

        <hr class="mt-4 mb-2" />
      </div>
      <div class="home-wrapper">
        <ul class="list-none mb-6">
          <li class="home-list-item">
            <i class="fas fa-circle text-[6px] my-auto align-middle mr-3" />
            <RouterLink to="/feedback-techniques" class="home-router-link">Feedback Techniques</RouterLink>
          </li>
        </ul>
      </div>
    </div>

    <div class="bg-primary-darker m-0 min-h-[150px] p-4 text-white">
      <div class="home-wrapper">
        <div class="flex justify-between my-4">
          <p class="my-auto">&copy; The University of Adelaide</p>
          <img src="@/assets/uoa-logo.png" width="200" alt="" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'

</script>

<style>
h2 {
  font-size: 2rem !important;
  line-height: 1.05;
  margin: 2rem 0 0.7rem !important;
  letter-spacing: 0.02rem;
}
</style>
