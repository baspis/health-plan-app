<script lang="ts">
  import { activeTab, setTab, TABS } from '../stores/tab';
</script>

<nav>
  {#each TABS as tab (tab.name)}
    <button
      class="tab"
      class:active={$activeTab.name === tab.name}
      onclick={() => setTab(tab.name)}
      aria-label={tab.label}
    >
      <span class="jp">{tab.jp}</span>
      <span class="en">{tab.label}</span>
    </button>
  {/each}
</nav>

<style>
  nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    background: var(--bg-elevated);
    border-top: 1px solid var(--divider);
    padding: 6px 6px calc(env(safe-area-inset-bottom, 0) + 6px);
    box-shadow: 0 -4px 16px rgba(27, 43, 74, 0.05);
    z-index: 20;
    max-width: 640px;
    margin: 0 auto;
  }
  .tab {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    padding: 8px 4px;
    border-radius: 10px;
    color: var(--ink-muted);
    transition: color var(--anim-fast) var(--ease-smooth), background var(--anim-fast) var(--ease-smooth);
  }
  .tab.active {
    color: var(--accent-dark);
    background: var(--accent-light);
  }
  .jp {
    font-weight: 700;
    font-size: 14px;
    line-height: 1;
  }
  .en {
    font-size: 10px;
    letter-spacing: 0.05em;
    font-weight: 600;
    opacity: 0.7;
  }
</style>
