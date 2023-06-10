<script>
  import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
  } from "firebase/auth";
  import { createEventDispatcher } from "svelte";
  import { fly } from "svelte/transition";
  import { clickOutside } from "./clickoutside";
  export let login;

  let emailValue;
  let passValue;
  let dispatch = createEventDispatcher();
  let errorAuth;
  let errorNo;
  let errorMsg;
  const auth = getAuth();
  function createAcc() {
    createUserWithEmailAndPassword(auth, emailValue, passValue)
      .then(() => {
        errorAuth = false;
        dispatch("hideauthentication");
      })
      .catch((error) => {
        errorNo = error.code;
        errorMsg = error.message;
        errorAuth = true;
      });
  }
  function loginAcc() {
    signInWithEmailAndPassword(auth, emailValue, passValue)
      .then((userCredential) => {
        const user = userCredential.user;
        errorAuth = false;
        dispatch("hideauthentication");
      })
      .catch((error) => {
        errorNo = error.code;
        errorMsg = error.message;
        errorAuth = true;
      });
  }
</script>

<div transition:fly class="fullscreen">
  <div
    class="auth-container"
    use:clickOutside={() => {
      dispatch("hideauthentication");
    }}
  >
    {#if errorAuth} <div class="auth-failed">{errorNo}:{errorMsg}</div>{/if}
    {#if login}
      <h1 class="auth-header">Log In</h1>
    {:else}
      <h1 class="auth-header">Sign Up</h1>
    {/if}
    <p class="auth-text">Email:</p>
    <input
      type="email"
      class="auth-input"
      bind:value={emailValue}
      placeholder="enter your email"
    />
    <p class="auth-text">Password:</p>
    <input
      type="password"
      class="auth-input"
      bind:value={passValue}
      placeholder="enter your password"
    />
    {#if login}
      <button class="auth-button" on:click={loginAcc}>Log In</button>
    {:else}
      <button class="auth-button" on:click={createAcc}>Sign Up</button>
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
  .auth-failed {
    width: 100%;
    background-color: red;
    color: white;
    text-decoration: underline;
    font-size: 20px;
  }
  .auth-container {
    background-image: linear-gradient(
      to right,
      rgb(160, 160, 22),
      rgb(202, 221, 26)
    );
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
  @media (max-width: 699px) {
    .fullscreen {
      left: -335px;
    }
  }
</style>
