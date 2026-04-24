<script lang="ts">
  import { fly } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import TopBar from './lib/components/TopBar.svelte';
  import TabBar from './lib/components/TabBar.svelte';
  import Today from './routes/Today.svelte';
  import Journey from './routes/Journey.svelte';
  import Forecast from './routes/Forecast.svelte';
  import Input from './routes/Input.svelte';
  import { activeTab, goNeighborTab, type TabName } from './lib/stores/tab';
  import { swipe } from './lib/utils/swipe';

  const ROUTES: Record<TabName, any> = {
    today: Today,
    journey: Journey,
    forecast: Forecast,
    input: Input
  };

  function onSwipe(dir: 'left' | 'right') {
    const delta = dir === 'left' ? 1 : -1;
    goNeighborTab(delta as 1 | -1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const slideIn = $derived(
    $activeTab.direction === 0
      ? { x: 0, duration: 0 }
      : { x: $activeTab.direction === 1 ? 24 : -24, duration: 260, easing: cubicOut }
  );
  const slideOut = $derived(
    $activeTab.direction === 0
      ? { x: 0, duration: 0 }
      : { x: $activeTab.direction === 1 ? -24 : 24, duration: 200, easing: cubicOut }
  );
</script>

<TopBar />

<main use:swipe={{ onSwipe }}>
  {#key $activeTab.name}
    <div class="screen-wrap" in:fly={slideIn} out:fly={slideOut}>
      {#if $activeTab.name === 'today'}
        <Today />
      {:else if $activeTab.name === 'journey'}
        <Journey />
      {:else if $activeTab.name === 'forecast'}
        <Forecast />
      {:else if $activeTab.name === 'input'}
        <Input />
      {/if}
    </div>
  {/key}
</main>

<TabBar />

<style>
  main {
    padding: 8px 18px;
    position: relative;
    overflow-x: hidden;
  }

  .screen-wrap {
    position: relative;
  }
</style>
