import { persisted } from 'svelte-local-storage-store'
import { get, writable } from "svelte/store";
export const todos = persisted('todos')
export const getStoreValue = get(todos) || [];
export const themeStore = persisted('theme')
export const theme = writable(get(themeStore))
export let finalId = persisted('Id')
export let id = get(finalId)||1;
