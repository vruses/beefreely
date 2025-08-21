<script lang='ts'>
  import HelloWorld from '@/components/HelloWorld.svelte'
</script>

<HelloWorld msg='Vite + Svelte + CRXJS' />

<style>
  .logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
    transition: filter 300ms;
  }
  .logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
  }
  .logo.svelte:hover {
    filter: drop-shadow(0 0 2em #ff3e00aa);
  }
  .logo.crx:hover {
    filter: drop-shadow(0 0 2em #f2bae4aa);
  }
</style>
