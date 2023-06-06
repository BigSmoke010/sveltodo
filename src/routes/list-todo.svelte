<script>
  import { getStoreValue, todos, id, finalId, themeStore } from "./stores";
  import { flip } from "svelte/animate";
  import { quintOut } from "svelte/easing";
  import { crossfade } from "svelte/transition";
  import Trash from "./trash-can.svg";
  const [send, receive] = crossfade({
    duration: 600,

    fallback(node, params) {
      const style = getComputedStyle(node);
      const transform = style.transform === "none" ? "" : style.transform;

      return {
        duration: 600,
        easing: quintOut,
        css: (t) => `
					transform: ${transform} scale(${t});
					opacity: ${t}
				`,
      };
    },
  });
  export let todo = "";
  let previousValue = "";
  let testlist = getStoreValue;
  let uid = id;

  $: {
    if (todo !== previousValue) {
      addDiv();
      previousValue = todo;
    }
  }
  function addDiv() {
    testlist = [
      ...testlist,
      {
        id: uid++,
        done: false,
        description: todo,
      },
    ];
    todos.set(testlist);
    finalId.set(uid);
  }
  function mark(item, done) {
    item.done = done;
    testlist = testlist.filter((t) => t !== item);
    testlist = testlist.concat(item);
    todos.set(testlist);
  }
  function deletetodo(item) {
    testlist = testlist.filter((t) => t !== item);
    todos.set(testlist);
  }
</script>

<div class="container">
  <div class="main-container">
    <div
      class="label"
      class:lightfc={$themeStore === true}
      class:darkfc={$themeStore === false}
    >
      things to do
    </div>
    {#if testlist}
      {#each testlist.filter((t) => !t.done) as item (item.id)}
        <div
          class:light={$themeStore === true}
          class:dark={$themeStore === false}
          class="todo-container"
          in:receive={{ key: todo.id }}
          out:send={{ key: todo.id }}
          animate:flip
        >
          <input
            type="checkbox"
            class="checkbox"
            class:checkboxlight={$themeStore === true}
            class:checkboxdark={$themeStore === false}
            on:change={() => mark(item, true)}
          />
          <div class="todo-desc">{item.description}</div>
          <div class="trash-wrapper" on:click={() => deletetodo(item)}>
            <img src={Trash} alt="dots" />
          </div>
        </div>
      {/each}
    {/if}
  </div>
  <div class="main-container">
    <div
      class="label"
      class:lightfc={$themeStore === true}
      class:darkfc={$themeStore === false}
    >
      things done
    </div>
    {#if testlist}
      {#each testlist.filter((t) => t.done) as item (item.id)}
        <div
          class:light={$themeStore === true}
          class:dark={$themeStore === false}
          class="todo-container"
          in:receive={{ key: todo.id }}
          out:send={{ key: todo.id }}
          animate:flip
        >
          <input
            type="checkbox"
            checked
            class="checkbox"
            on:change={() => mark(item, false)}
            class:checkboxlight={$themeStore === true}
            class:checkboxdark={$themeStore === false}
          />
          <div class="todo-desc done">{item.description}</div>
          <div class="trash-wrapper" on:click={() => deletetodo(item)}>
            <img src={Trash} alt="dots" />
          </div>
        </div>
      {/each}
    {/if}
  </div>
</div>

<style>
  /* width */
  ::-webkit-scrollbar {
    width: 5px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: black;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 20px;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
  .main-container {
    flex-grow: 1;
    width: 500px;
    display: flex;
    height: 100vh;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .todo-container {
    display: flex;
    align-items: center;
    border: 2px solid black;
    height: 50px;
    margin-bottom: 10px;
    margin-left: 10px;
    width: 460px;
    border-radius: 12px;
  }
  .label {
    font-size: 25px;
  }
  .done {
    text-decoration: line-through;
    opacity: 0.5;
    text-decoration-color: rgb(88, 88, 0);
    text-decoration-thickness: 2px;
  }
  .todo-desc {
    width: 100%;
  }
  .light {
    background-color: white;
    border-color: black;
    color: black;
    transition: all 1s;
  }
  .dark {
    background-color: black;
    border-color: white;
    color: white;
    transition: all 1s;
  }
  .lightfc {
    color: black;
  }
  .darkfc {
    color: white;
  }
  .checkbox {
    transition: all 1s;
    position: relative;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    width: 24px;
    height: 24px;
    border: 1px solid #000;
    border-radius: 6px;
    margin-right: 6px;
  }
  .checkbox:checked {
    box-shadow: 0px 0px 10px 3px yellow;
    border: 1px solid #00000063;
  }
  .checkbox:hover {
    cursor: pointer;
  }
  .checkbox:checked::before {
    content: url("checkmark.svg");
    position: absolute;
    opacity: 0;
    top: -4px;
    left: 0;
    animation: check 0.5s ease forwards;
  }
  .checkbox:not(:checked)::before {
    content: url("checkmark.svg");
    position: absolute;
    opacity: 0;
    top: -4px;
    left: 0;
    animation: uncheck 0.5s ease forwards;
  }
  .checkboxdark {
    border-color: white;
  }
  .checkboxlight {
    border-color: black;
  }
  .container {
    display: flex;
    flex-direction: row;
    gap: 10px;
  }
  .trash-wrapper {
    margin: 10px;
  }
  .trash-wrapper:hover {
    cursor: pointer;
  }
  @keyframes check {
    0% {
      transform: translate(-20%, 10%);
    }
    100% {
      transform: translate(0, 0);
      opacity: 1;
    }
  }
  @keyframes uncheck {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
  @media (max-width: 1148px) {
    .container {
      flex-direction: column;
    }
  }
  @media (min-width: 1148px) {
    .container {
      flex-direction: row;
    }
  }
  @media (max-width: 699px) {
    .todo-container {
      width: 100vw;
    }
    .main-container {
      height: auto;
    }
  }
</style>
