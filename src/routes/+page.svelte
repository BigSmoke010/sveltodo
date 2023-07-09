<script>
  import Main from "$lib/main-todo.svelte";
  import Todos from "$lib/list-todo.svelte";
  import Auth from "$lib/auth.svelte";
  import { app } from "$lib/js/firebaseinit.js";
  import { SvelteToast } from "@zerodevx/svelte-toast";

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
<div class="font-wrapper">
  <SvelteToast />
</div>

<style>
  @import url("https://fonts.googleapis.com/css2?family=Lato&display=swap");
  :root {
    --toastBackground: rgba(183, 194, 38, 0.95);
    --toastColor: #424242;
    --toastBarBackground: rgb(94, 110, 0);
  }
  * {
    font-family: Lato;
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
    margin: 0;
    padding: 0;
    box-sizing: border-box;
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
