<script>
  import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
  import { createEventDispatcher } from "svelte";
  import { fly } from "svelte/transition";
  import { clickOutside } from "./clickoutside";
  let dispatch = createEventDispatcher();
  export let login;
</script>

<div transition:fly class="fullscreen">
  <div
    class="auth-container"
    use:clickOutside={() => {
      dispatch("hideauthentication");
    }}
  >
    {#if login}
      <h1 class="auth-header">Log In</h1>
    {:else}
      <h1 class="auth-header">Sign Up</h1>
    {/if}
    <p class="auth-text">Email:</p>
    <input type="text" class="auth-input" placeholder="enter your email" />
    <p class="auth-text">Password:</p>
    <input type="text" class="auth-input" placeholder="enter your password" />
    {#if login}
      <button class="auth-button">Log In</button>
    {:else}
      <button class="auth-button">Sign Up</button>
    {/if}
  </div>
</div>

<style>
  .fullscreen {
    position: absolute;
    width: 100vw;
    height: 100vh;
    background-color: transparent;
    backdrop-filter: blur(10px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;
  }
  .auth-container {
    background-color: yellow;
    width: 300px;
    height: 400px;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    position: relative;
    border: black 3px solid;
  }
  .auth-header {
    margin-left: 10px;
  }
  .auth-text {
    margin-left: 15px;
    font-size: 22px;
  }
  .auth-input {
    margin-left: 15px;
    margin-right: 15px;
    border-radius: 5px;
    border: none;
    height: 25px;
    font-size: 16px;
  }
  .auth-button {
    transition: background-position 1s;
    position: absolute;
    height: 50px;
    bottom: 20px;
    left: 0;
    right: 0;
    margin: auto;
    width: 250px;
    border: none;
    background-image: linear-gradient(
      to right,
      rgb(201, 201, 56),
      rgb(225, 225, 0),
      rgb(144, 189, 93)
    );
    background-position: left;
    background-size: 200%;
  }
  .auth-button:hover {
    cursor: pointer;
    background-position: right;
  }
</style>
