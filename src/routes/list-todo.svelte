<script>
  import { get } from "svelte/store";
  import { todos } from "./stores";

  export let todo = "";

  let previousValue = "";
  let testlist = get(todos) || [];
  $: {
    if (todo !== previousValue) {
      addDiv();
      previousValue = todo;
    }
  }
  function addDiv() {
    testlist = [...testlist, todo];
    todos.set(testlist);
  }
</script>

<div class="main-container">
  <div class="label">things to do</div>
  {#if testlist}
    {#each testlist as item (item)}
      <div class="todo-container">
        <input type="checkbox" class="checkbox" />
        <div>{item}</div>
      </div>
    {/each}
  {/if}
</div>

<style>
  .main-container {
    flex-grow: 1;
  }
  .todo-container {
    display: flex;
    align-items: center;
    border: 2px solid black;
    margin: 20px;
    height: 50px;
    border-radius: 20px;
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
    animation: check 1s ease forwards;
  }
  .checkbox:not(:checked)::before {
    content: url("checkmark.svg");
    position: absolute;
    opacity: 0;
    top: -4px;
    left: 0;
    animation: uncheck 1s ease forwards;
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
</style>
