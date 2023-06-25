<script>
  import { themeStore } from "./js/stores";
  import { getDocs, updateDoc, query, where } from "firebase/firestore";
  import Dots from "./svgs/three-dots-svgrepo-com.svg";
  import { quintOut } from "svelte/easing";
  import { crossfade } from "svelte/transition";
  import { flip } from "svelte/animate";
  export let todo = "";
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

  export let todolist;
  export let todos;
  export let userUID;
  export let collectionRef;
  export let showContext;
  export let x;
  export let y;
  export let selectedItem;

  function markdb(item, done) {
    const q = query(
      collectionRef,
      where("description", "==", item.description)
    );
    getDocs(q).then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        updateDoc(doc.ref, { ["done"]: done }).then(() => {
          fetchTodos();
        });
      });
    });
  }
  function mark(item, done) {
    item.done = done;
    todolist = todolist.filter((t) => t !== item);
    todolist = todolist.concat(item);
    todos.set(todolist);
  }
  function showContextMenu(event, item) {
    showContext = true;
    x = event.clientX + "px";
    y = event.clientY + "px";
    if (event.clientX > getwidth() - 80) {
      x = getwidth() - 80 + "px";
    }

    selectedItem = item;
  }
  function getwidth() {
    return document.documentElement.clientWidth;
  }
  function fetchTodos() {
    const q = query(collectionRef, where("userid", "==", userUID));
    getDocs(q).then((querySnapshot) => {
      const documentsData = querySnapshot.docs.map((doc) => doc.data());
      todolist = documentsData;
    });
  }
</script>

<div class="wrapper">
  {#if todolist}
    <div class="todo-label">
      <div
        class="label"
        class:lightfc={$themeStore === true}
        class:darkfc={$themeStore === false}
      >
        things to do
      </div>
      <div class="main-container">
        {#each todolist.filter((t) => !t.done) as item (item.id)}
          <div
            class:light={$themeStore === true}
            class:dark={$themeStore === false}
            class="todo-container"
            in:receive={{ key: todo.id }}
            out:send={{ key: todo.id }}
            animate:flip
          >
            {#if userUID}
              <input
                type="checkbox"
                class="checkbox"
                class:checkboxlight={$themeStore === true}
                class:checkboxdark={$themeStore === false}
                on:change={() => markdb(item, true)}
              />
            {:else}<input
                type="checkbox"
                class="checkbox"
                class:checkboxlight={$themeStore === true}
                class:checkboxdark={$themeStore === false}
                on:change={() => mark(item, true)}
              />{/if}
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
      </div>
    </div>
    <div class="todo-label">
      <div
        class="label"
        class:lightfc={$themeStore === true}
        class:darkfc={$themeStore === false}
      >
        things done
      </div>
      <div class="main-container">
        {#each todolist.filter((t) => t.done) as item (item.id)}
          <div
            class:light={$themeStore === true}
            class:dark={$themeStore === false}
            class="todo-container"
            in:receive={{ key: todo.id }}
            out:send={{ key: todo.id }}
            animate:flip
          >
            {#if userUID}
              <input
                type="checkbox"
                class="checkbox"
                checked
                class:checkboxlight={$themeStore === true}
                class:checkboxdark={$themeStore === false}
                on:change={() => markdb(item, false)}
              />
            {:else}<input
                type="checkbox"
                class="checkbox"
                checked
                class:checkboxlight={$themeStore === true}
                class:checkboxdark={$themeStore === false}
                on:change={() => mark(item, false)}
              />{/if}
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
      </div>
    </div>
  {/if}
</div>

<style>
  ::-webkit-scrollbar {
    width: 5px;
  }
  ::-webkit-scrollbar-track {
    background: black;
  }
  ::-webkit-scrollbar-thumb {
    background: #bcd100;
    border-radius: 20px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #9fb10055;
  }
  .main-container {
    display: flex;
    flex-grow: 1;
    max-height: 90vh;
    flex-direction: column;
    overflow: auto;
  }
  .todo-label {
    display: flex;
    flex-direction: column;
  }
  .lightfc {
    color: black;
  }
  .darkfc {
    color: white;
  }
  .todo-container {
    display: flex;
    align-items: center;
    border: 2px solid black;
    height: 50px;
    width: 460px;
    margin-left: 10px;
    margin-bottom: 5px;
    border-radius: 12px;
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
    text-align: center;
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
    content: url("./svgs/checkmark.svg");
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
  .darksvg {
    filter: invert();
  }
  .lightsvg {
    filter: none;
  }
  .checkboxlight {
    border-color: black;
  }
  @media (max-width: 1148px) {
    .main-container {
      height: auto;
    }
  }
  @media (min-width: 1148px) {
    .wrapper {
      width: 75vw;
      display: flex;
      flex-direction: row;
    }
    .main-container {
      height: auto;
    }
  }
  @media (max-width: 699px) {
    .todo-container {
      width: 90vw;
    }
    .main-container {
      max-height: 240px;
      overflow-x: auto;
    }
  }
</style>
