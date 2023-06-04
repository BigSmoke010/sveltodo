<script>
  import Main from "./main-todo.svelte";
  import Todos from "./list-todo.svelte";
  let todo = "";
  function add(event) {
    todo = event.detail.message;
  }
</script>

<div class="main-container">
  <Main on:addtodo={add} />
  <Todos bind:todo />
</div>

<style>
  @import url("https://fonts.googleapis.com/css2?family=Lato&display=swap");

  * {
    font-family: Lato;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  .main-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: calc(100vh - 16px);
  }
</style>
