<template>
  <RouterView />
</template>

<script setup>
import { RouterView } from "vue-router";
import { provide } from "vue";
import { useParentInfo } from "@/composables/useParentInfo";

const { getParentInfo } = useParentInfo();
const info = getParentInfo();

// Provide to all children (interactives) just in case they need it later
provide("parentUrl", info.parentUrl);

// Silent verification hook
window.__parentInfo = info;

// Debug logging
const urlParams = new URLSearchParams(window.location.search);

if (info.parentUrl) {
  console.group("Parent Detection Debug: SUCCESS");
  console.log("Detected URL:", info.parentUrl);
  console.log("Method:", info.detectionMethod);
  console.log("Full Debug Object:", info.debug);
  console.groupEnd();
} else {
  console.group("Parent Detection Debug: FAILED");
  console.log("No parent detected (direct access or restricted).");
  console.log("Full Debug Object:", info.debug);
  console.groupEnd();
}
</script>

<style>
@import "@/assets/base.css";
</style>
