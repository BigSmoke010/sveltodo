<script>
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "firebase/app";
  import Main from "./main-todo.svelte";
  import Todos from "./list-todo.svelte";
  import Auth from "./auth.svelte";
  let todo = "";
  let showauth = false;
  let login;
  function add(event) {
    todo = event.detail.message;
  }
  const firebaseConfig = {
    apiKey: "AIzaSyCD1pJBz02ustVV2ewpGMOYotAudPpxDkI",
    authDomain: "todo-app-71f4e.firebaseapp.com",
    projectId: "todo-app-71f4e",
    storageBucket: "todo-app-71f4e.appspot.com",
    messagingSenderId: "931116433284",
    appId: "1:931116433284:web:707787b6d36a18f55827d1",
    measurementId: "G-Q7F5L1FHGN",
  };
  const app = initializeApp(firebaseConfig);
</script>

<title>Sveltodo</title>
<div class="main-container">
  {#if showauth}
    <div class="main-auth">
      <Auth
        {login}
        on:hideauthentication={() => {
          showauth = false;
        }}
      />
    </div>
  {/if}

  <Main
    on:addtodo={add}
    on:showauthentication={(e) => {
      showauth = true;
      login = e.detail.message;
    }}
  />
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
  .main-auth {
    position: absolute;
    top: 0;
  }
  :global(body) {
    overflow: hidden;
  }
  @media (max-width: 699px) {
    .main-container {
      flex-direction: column;
      width: 100vw;
    }
  }
</style>
