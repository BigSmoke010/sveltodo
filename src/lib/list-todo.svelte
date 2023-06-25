<script>
  import { getStoreValue, todos, id, finalId, themeStore } from "./js/stores";
  import { slide } from "svelte/transition";
  import Trash from "./svgs/trash-can.svg";
  import { clickOutside } from "./js/clickoutside";
  import {
    getFirestore,
    collection,
    getDocs,
    addDoc,
    deleteDoc,
    query,
    where,
  } from "firebase/firestore";
  import { getAuth } from "firebase/auth";
  import TodoCont from "./todos-container.svelte";
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

  export let todo = "";
  let previousValue = "";
  let uid = id;
  let showContext = false;
  let selectedItem, x, y;

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
    }).then(() => {
      finalId.set(uid);
      fetchTodos();
    });
  }
  function fetchTodos() {
    const q = query(collectionRef, where("userid", "==", userUID));
    getDocs(q).then((querySnapshot) => {
      const documentsData = querySnapshot.docs.map((doc) => doc.data());
      todolist = documentsData;
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
    getDocs(q).then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        deleteDoc(doc.ref).then(() => {
          fetchTodos();
        });
      });
    });
  }
</script>

<div class="container">
  <TodoCont
    {todolist}
    {todos}
    {userUID}
    {collectionRef}
    bind:showContext
    bind:x
    bind:y
    bind:selectedItem
  />
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
</style>
