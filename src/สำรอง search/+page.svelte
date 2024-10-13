<script>
  export let stations = [];
  export let data../search copy/$types.js;
</script>

{#if data.stations.length > 0}
  <ul>
    {#each data.stations as station}
      <li>{station.station_name}</li>
    {/each}
  </ul>
{:else}
  <p>No stations available.</p>
{/if}
