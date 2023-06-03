<script>
  export let todo = "";
  let previousValue = "";
  let divcount = 1;
  let testlist = [];
  $: {
    if (todo !== previousValue) {
      addDiv();
      previousValue = todo;
    }
  }
  function addDiv() {
    testlist = [...testlist, todo];
    console.log(testlist);
  }
</script>

<div class="main-container">
  <div class="label">things to do</div>

  {#each testlist as item (item)}
    <div>{item}</div>
  {/each}
</div>

<style>
  .main-container {
    flex-grow: 1;
  }
</style>
