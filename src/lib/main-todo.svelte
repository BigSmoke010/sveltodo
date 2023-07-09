<script>
  import { createEventDispatcher, onMount } from "svelte";
  import { theme, themeStore } from "./js/stores";
  import { getAuth, signOut } from "firebase/auth";

  const auth = getAuth();
  let dispatch = createEventDispatcher();
  let loggedIn = false;
  auth.onAuthStateChanged((user) => {
    if (user) {
      if (user.emailVerified) {
        loggedIn = true;
      }
    }
  });
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
    Sveltodo
  </h1>
  {#if !loggedIn}
    <div class="auth-container">
      <div
        class="auth-btn login-btn"
        on:click={() => {
          dispatch("showauthentication", { message: true });
        }}
      >
        Log in
      </div>

      <div
        class="auth-btn signout-btn"
        on:click={() => {
          dispatch("showauthentication", { message: false });
        }}
      >
        Sign up
      </div>
    </div>
  {:else}
    <div
      class="signout-btn auth-btn"
      on:click={() => {
        signOut(auth);
        location.reload(true);
      }}
    >
      Sign Out
    </div>
  {/if}
  <div class="toggle-container">
    <div class="container">
      <div
        on:click={changetheme}
        class:active={$themeStore === false}
        id="toggle"
      >
        <span class:change={$themeStore === false} class="indicator" />
      </div>
    </div>
  </div>
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
    position: absolute;
    top: 100px;
  }
  .greet {
    padding: 25px;
  }
  * {
    padding: 0;
    margin: 0;
  }
  .toggle-container {
    position: absolute;
    top: 0;
  }
  .container {
    position: relative;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .container #toggle {
    height: 20px;
    width: 40px;
    background-color: #bebebe;
    border-radius: 30px;
    cursor: pointer;
    transition: all 0.5s;
  }
  .container .active {
    background-color: #353535 !important;
  }
  .container #toggle .indicator {
    position: absolute;
    height: 15px;
    width: 15px;
    top: 3px;
    left: 4px;
    background-color: #000;
    border-radius: 50%;
    transition: all 0.5s;
  }
  .container #toggle .change {
    left: 22px;
    background-color: #fff;
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
    color: rgb(124, 124, 59);
  }
  .auth-btn:hover {
    cursor: pointer;
    color: rgba(209, 209, 75, 0.5);
  }
  .signout-btn {
    position: absolute;
    top: 0;
    left: 0;
  }
  .login-btn {
    position: absolute;
    right: 10px;
    top: 0;
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
    .title {
      top: 50px;
    }
    .main-container {
      width: 100vw;
    }
  }
</style>
