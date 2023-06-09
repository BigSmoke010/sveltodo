<script>
  import { getStoreValue, todos, id, finalId, themeStore } from "./stores";
  import { flip } from "svelte/animate";
  import { quintOut } from "svelte/easing";
  import { crossfade, slide } from "svelte/transition";
  import Trash from "./trash-can.svg";
  import Dots from "./three-dots-svgrepo-com.svg";
  import { clickOutside } from "./clickoutside";

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
  let todolist = getStoreValue;
  let uid = id;
  let showContext = false;
  let x;
  let y;
  let selectedItem;

  $: {
    if (todo !== previousValue) {
      addDiv();
      previousValue = todo;
    }
  }
  function addDiv() {
    todolist = [
      ...todolist,
      {
        id: uid++,
        done: false,
        description: todo,
      },
    ];
    todos.set(todolist);
    finalId.set(uid);
  }
  function mark(item, done) {
    item.done = done;
    todolist = todolist.filter((t) => t !== item);
    todolist = todolist.concat(item);
    todos.set(todolist);
  }
  function deletetodo(item) {
    console.log(item);
    todolist = todolist.filter((t) => t !== item);
    todos.set(todolist);
  }
  function showContextMenu(event, item) {
    showContext = true;
    x = event.clientX + "px";
    y = event.clientY + "px";
    console.log(x);
    console.log(Math.floor(getwidth() * 0.5));
    if (event.clientX > getwidth() - 80) {
      x = getwidth() - 80 + "px";
    }

    selectedItem = item;
  }
  function getwidth() {
    return document.documentElement.clientWidth;
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
    {#if todolist}
      {#each todolist.filter((t) => !t.done) as item (item.id)}
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
          <div
            class="dots-container"
            on:click={() => {
              showContextMenu(event, item);
            }}
          >
            <img
              src={Dots}
              alt="more options"
              class:lightsvg={$themeStore === true}
              class:darksvg={$themeStore === false}
            />
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
    {#if todolist}
      {#each todolist.filter((t) => t.done) as item (item.id)}
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
          <div
            class="dots-container"
            on:click={() => {
              showContextMenu(event, item);
            }}
          >
            <img
              src={Dots}
              alt="more options"
              class:lightsvg={$themeStore === true}
              class:darksvg={$themeStore === false}
            />
          </div>
        </div>
      {/each}
    {/if}
  </div>
</div>
{#if showContext}
  <div
    class="context-menu"
    transition:slide
    on:click={() => {
      showContext = false;
    }}
    use:clickOutside={() => {
      showContext = false;
    }}
    style="position: absolute; left : {x}; top : {y}"
  >
    <button class="context-it" on:click={() => deletetodo(selectedItem)}
      ><img
        class:lightsvg={$themeStore === true}
        class:darksvg={$themeStore === false}
        src={Trash}
        alt="trash"
      />Delete</button
    >
  </div>
{/if}

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
    background: #bcd100;
    border-radius: 20px;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: #9fb10055;
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
  .context-menu {
    background-color: rgb(234, 243, 157);
    display: flex;
    flex-direction: column;
    z-index: 1;
    border-radius: 10px;
    align-items: center;
    width: 80px;
    right: 0;
  }
  .context-it {
    transition: all 0.25s;
    background-color: transparent;
    border: none;
    padding: 10px;
    display: flex;
    align-items: center;
    border-radius: 10px;
  }
  .context-it:hover {
    background-color: rgba(124, 124, 0, 0.664);
  }
  .dots-container {
    transition: all 0.2s;
    margin: 5px;
    border-radius: 5px;
  }
  .dots-container:hover {
    background-color: rgba(0, 0, 0, 0.411);
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
  .darksvg {
    filter: invert();
  }
  .lightsvg {
    filter: none;
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
    top: -4px;
    left: 0;
  }
  .checkbox:not(:checked)::before {
    content: "";
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
