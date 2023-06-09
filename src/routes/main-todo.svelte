<script>
  import { createEventDispatcher, onMount } from "svelte";
  import { theme, themeStore } from "./stores";

  let dispatch = createEventDispatcher();
  export let todo = "";
  function addtodo() {
    dispatch("addtodo", { message: todo });
  }
  onMount(() => {
    if (!$theme) {
      window.document.body.classList.toggle("dark-mode");
    }
  });
  function changetheme() {
    theme.set(!$theme);
    themeStore.set($theme);
    window.document.body.classList.toggle("dark-mode");
  }
</script>

<div class="main-container">
  <h1
    class="title"
    class:lightfc={$themeStore === true}
    class:darkfc={$themeStore === false}
  >
    Todo
  </h1>
  <div class="auth-container">
    <div
      class="auth-btn"
      on:click={() => {
        dispatch("showauthentication", { message: true });
      }}
    >
      Log in
    </div>
    |
    <div
      class="auth-btn"
      on:click={() => {
        dispatch("showauthentication", { message: false });
      }}
    >
      Sign up
    </div>
  </div>
  <i class:lightfc={$themeStore === true} class:darkfc={$themeStore === false}
    >Dark mode:</i
  >
  <label class="switch">
    <input on:click={changetheme} checked={!$themeStore} type="checkbox" />
    <span class="slider round" />
  </label>
  <h1
    class:lightfc={$themeStore === true}
    class:darkfc={$themeStore === false}
    class="greet"
  >
    Hello
  </h1>
  <input
    bind:value={todo}
    placeholder="what do you want to do"
    class="container-input"
  />
  <button on:click={addtodo} class="container-button">Submit</button>
  <div
    class="seperator"
    class:lightsep={$themeStore === true}
    class:darksep={$themeStore === false}
  />
</div>

<style>
  .title {
    font-size: 50px;
  }
  /* The switch - the box around the slider */
  .switch {
    position: relative;
    display: inline-block;
    width: 60px;
    height: 25px;
  }

  /* Hide default HTML checkbox */
  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  /* The slider */
  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    border-radius: 20px;
    bottom: 0;
    background-color: #ccc;
    -webkit-transition: 0.4s;
    transition: 0.4s;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 18px;
    border-radius: 20px;

    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    -webkit-transition: 0.4s;
    transition: 0.4s;
  }

  input:checked + .slider {
    background-color: #2196f3;
  }

  input:focus + .slider {
    box-shadow: 0 0 1px #2196f3;
  }

  input:checked + .slider:before {
    -webkit-transform: translateX(26px);
    -ms-transform: translateX(26px);
    transform: translateX(26px);
  }

  .container-input {
    width: 200px;
    height: 25px;
    font-size: 17px;
  }
  :global(body) {
    transition: all 1s;
  }
  :global(body.dark-mode) {
    transition: all 1s;
    background-color: black;
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
    margin-bottom: 20px;
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
  .auth-container {
    display: flex;
    margin-bottom: 20px;
  }
  .auth-btn {
    text-decoration: underline;
    color: rgb(209, 209, 75);
  }
  .auth-btn:hover {
    cursor: pointer;
    color: rgba(209, 209, 75, 0.5);
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
  .lightfc {
    color: black;
  }
  .darkfc {
    color: white;
  }
  .lightsep {
    background-color: black;
  }
  .darksep {
    background-color: white;
  }
  @media (max-width: 699px) {
    .seperator {
      width: 100vw;
      height: 5px;
      bottom: 0;
      left: 0;
    }
    .main-container {
      width: 100vw;
    }
  }
</style>
