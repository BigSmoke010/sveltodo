<script>
  import { createEventDispatcher } from "svelte";
  let dispatch = createEventDispatcher();
  export let todo = "";
  function addtodo() {
    dispatch("addtodo", { message: todo });
  }
</script>

<div class="main-container">
  <h1 class="title">Todo</h1>
  <h1 class="greet">Hello</h1>
  <input
    bind:value={todo}
    placeholder="what do you want to do"
    class="container-input"
  />
  <button on:click={addtodo} class="container-button">Submit</button>
</div>

<style>
  @import url("https://fonts.googleapis.com/css2?family=Lato&display=swap");
  * {
    font-family: Lato;
  }
  .title {
    font-size: 50px;
    position: absolute;
    top: 0px;
  }
  .container-input {
    width: 200px;
    height: 25px;
    font-size: 17px;
  }
  .container-button {
    transition: all 0.5s;
    margin-top: 20px;
    width: 100px;
    height: 40px;
    border-radius: 5px;
    font-size: 20px;
    background-image: linear-gradient(
      to right,
      rgb(201, 201, 56),
      rgb(255, 255, 0)
    );
    background-position: left;
    background-size: 200%;
    border: none;
  }
  .container-button:hover {
    background-position: right;
    cursor: pointer;
    box-shadow: 0px 0px 10px 5px yellow;
  }
  .main-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    border-right: black solid 2px;
    height: 100%;
    flex-grow: 1;
    justify-content: center;
  }
</style>
