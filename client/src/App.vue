<script setup lang="ts">
import TodoList from './components/TodoList.vue'

const getGreeting = () => {
  const hoursNow = new Date().getHours()
  if (hoursNow < 12) return 'Huomenta!'
  if (hoursNow >= 18) return 'Iltaa!'
  return 'Mahtavaa iltapäivää!'
}
</script>

<template>
  <div class="wrapper">
    <header>
      <h1>{{ getGreeting() }}</h1>
    </header>

    <main>
      <TodoList />
    </main>
  </div>
</template>

<style scoped>
header {
  line-height: 1.5;
}

wrapper {
  width: 100vw;
  margin: 0 auto;
}

@media (min-width: 1024px) {
  wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
  }
}
</style>
