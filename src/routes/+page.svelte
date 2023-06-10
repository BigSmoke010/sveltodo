<script>
  import Main from "./main-todo.svelte";
  import Todos from "./list-todo.svelte";
  import Auth from "./auth.svelte";
  import { app } from "./firebaseinit.js";
  import { onMount } from "svelte";
  let todo = "";
  let showauth = false;
  let login;
  let ready = false;
  function add(event) {
    todo = event.detail.message;
  }
  onMount(() => {
    ready = true;
  });
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
  {#if ready}
    <Main
      on:addtodo={add}
      on:showauthentication={(e) => {
        showauth = true;
        login = e.detail.message;
      }}
    />
    <Todos bind:todo />
  {/if}
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
      align-items: center;
      justify-content: center;
      width: 100vw;
    }
  }
</style>
