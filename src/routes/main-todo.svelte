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
  <div class="seperator" />
</div>

<style>
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
  .seperator {
    height: 100vh;
    width: 5px;
    background-color: black;
    position: absolute;
    right: 0;
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
    height: 100%;
    flex-grow: 1;
    justify-content: center;
    position: relative;
  }
  @media (max-width: 699px) {
    .seperator {
      width: 100vw;
      height: 5px;
      bottom: 0;
    }
    .main-container {
      width: 100vw;
      height: 200px;
    }
  }
</style>
