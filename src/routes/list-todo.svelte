<script>
  import { getStoreValue, todos, id, finalId, themeStore } from "./stores";
  import { flip } from "svelte/animate";
  import { quintOut } from "svelte/easing";
  import { crossfade, slide } from "svelte/transition";
  import Trash from "./trash-can.svg";
  import Dots from "./three-dots-svgrepo-com.svg";
  import { clickOutside } from "./clickoutside";
  import {
    getFirestore,
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
  } from "firebase/firestore";
  import { getAuth } from "firebase/auth";
  let todolist;
  const db = getFirestore();
  const collectionRef = collection(db, "todos");
  const auth = getAuth();
  let userUID;
  auth.onAuthStateChanged((user) => {
    if (user) {
      userUID = user.uid;
      fetchTodos(user);
    } else {
      todolist = getStoreValue;
    }
  });

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
  let uid = id;
  let showContext = false;
  let x;
  let y;
  let selectedItem;

  $: {
    if (todo !== previousValue) {
      auth.onAuthStateChanged((user) => {
        if (user) {
          addDivdb();
          previousValue = todo;
        } else {
          addDiv();
          previousValue = todo;
        }
      });
    }
  }
  function addDivdb() {
    addDoc(collectionRef, {
      userid: userUID,
      id: uid++,
      done: false,
      description: todo,
    })
      .then(() => {
        finalId.set(uid);
        fetchTodos();
      })
      .catch((error) => {
        console.error("Error adding document:", error);
      });
  }
  function fetchTodos() {
    const q = query(collectionRef, where("userid", "==", userUID));
    getDocs(q)
      .then((querySnapshot) => {
        const documentsData = querySnapshot.docs.map((doc) => doc.data());
        todolist = documentsData;
        console.log(todolist);
      })
      .catch((error) => {
        console.log("Error getting documents:", error);
      });
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
  function markdb(item, done) {
    const q = query(
      collectionRef,
      where("description", "==", item.description)
    );
    getDocs(q)
      .then((querySnapshot) => {
        // Iterate through the documents and update the field
        querySnapshot.forEach((doc) => {
          updateDoc(doc.ref, { ["done"]: done })
            .then(() => {
              console.log("Document successfully updated!");
              fetchTodos();
            })
            .catch((error) => {
              console.error("Error updating document: ", error);
            });
        });
      })
      .catch((error) => {
        console.log("Error getting documents:", error);
      });
  }
  function deletetodo(item) {
    todolist = todolist.filter((t) => t !== item);
    todos.set(todolist);
  }
  function deletetododb(item) {
    const q = query(
      collectionRef,
      where("userid", "==", userUID),
      where("description", "==", item.description)
    );
    getDocs(q)
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          deleteDoc(doc.ref)
            .then(() => {
              console.log("Document successfully deleted.");
              fetchTodos();
            })
            .catch((error) => {
              console.error("Error deleting document: ", error);
            });
        });
      })
      .catch((error) => {
        console.log("Error getting documents:", error);
      });
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
</script>

<div class="container">
  <div class="wrapper">
    <div
      class="label"
      class:lightfc={$themeStore === true}
      class:darkfc={$themeStore === false}
    >
      things to do
    </div>
    <div class="main-container">
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
      {/if}
    </div>
  </div>
  <div class="wrapper">
    <div
      class="label"
      class:lightfc={$themeStore === true}
      class:darkfc={$themeStore === false}
    >
      things done
    </div>
    <div class="main-container">
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
      {/if}
    </div>
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
    class:light-context={$themeStore === true}
    class:dark-context={$themeStore === false}
    style="position: absolute; left : {x}; top : {y}"
  >
    {#if userUID}
      <button class="context-it" on:click={() => deletetododb(selectedItem)}
        ><img
          class:lightsvg={$themeStore === true}
          class:darksvg={$themeStore === false}
          src={Trash}
          alt="trash"
        />Delete</button
      >{:else}
      <button
        class="context-it"
        class:darkfc={$themeStore === true}
        class:lightfc={$themeStore === false}
        on:click={() => deletetodo(selectedItem)}
        ><img
          class:lightsvg={$themeStore === true}
          class:darksvg={$themeStore === false}
          src={Trash}
          alt="trash"
        />Delete</button
      >{/if}
  </div>
{/if}

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
    flex-grow: 1;
    width: 500px;
    display: flex;
    max-height: 90vh;
    flex-direction: column;
    overflow: auto;
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
    background-color: rgb(52, 53, 49);
    display: flex;
    flex-direction: column;
    z-index: 1;
    border-radius: 10px;
    align-items: center;
    width: 80px;
    right: 0;
  }
  .light-context {
    background-color: rgb(133, 133, 133);
  }
  .dark-context {
    background-color: rgb(52, 53, 49);
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
    .main-container {
      height: auto;
    }
  }
  @media (min-width: 1148px) {
    .container {
      flex-direction: row;
    }
    .wrapper {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    .main-container {
      height: auto;
    }
  }
  @media (max-width: 699px) {
    .todo-container {
      width: 440px;
    }
    .main-container {
      max-height: 240px;
      overflow-x: auto;
    }
  }
</style>
