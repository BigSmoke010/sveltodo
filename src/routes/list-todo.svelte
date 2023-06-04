<script>
  import { getStoreValue, todos } from "./stores";
  import { flip } from "svelte/animate";
  import { quintOut } from "svelte/easing";
  import { crossfade } from "svelte/transition";
  const [send, receive] = crossfade({
    duration: (d) => Math.sqrt(d * 200),

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
  let uid = testlist.length + 1;
  $: {
    if (todo !== previousValue) {
      addDiv();
      previousValue = todo;
    }
  }
  function addDiv() {
    testlist = [...testlist, { id: uid++, done: false, description: todo }];
    todos.set(testlist);
  }
  function mark(item, done) {
    item.done = done;
    testlist = testlist.filter((t) => t !== item);
    testlist = testlist.concat(item);
    todos.set(testlist);
  }
</script>

<div class="main-container">
  <div class="label">things to do</div>
  {#if testlist}
    {#each testlist.filter((t) => !t.done) as item (item.id)}
      <div
        class="todo-container"
        in:receive={{ key: todo.id }}
        out:send={{ key: todo.id }}
        animate:flip
      >
        <input
          type="checkbox"
          class="checkbox"
          on:change={() => mark(item, true)}
        />
        <div>{item.description}</div>
      </div>
    {/each}
  {/if}
</div>
<div class="main-container">
  <div class="label">things done</div>
  {#if testlist}
    {#each testlist.filter((t) => t.done) as item (item.id)}
      <div
        class="todo-container"
        in:receive={{ key: todo.id }}
        out:send={{ key: todo.id }}
      >
        <input
          type="checkbox"
          checked
          class="checkbox"
          on:change={() => mark(item, false)}
        />
        <div>{item.description}</div>
      </div>
    {/each}
  {/if}
</div>

<style>
  .main-container {
    flex-grow: 1;
    width: 460px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
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
    position: absolute;
    top: 0;
    font-size: 25px;
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
