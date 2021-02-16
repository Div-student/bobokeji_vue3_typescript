<template>
  <div class="home">
    <LayOut></LayOut>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import LayOut from '@/components/layOut.vue'; 

@Options({
  components: {
    LayOut
  },
})
export default class Home extends Vue {}
</script>
