import { persisted } from 'svelte-local-storage-store'
import { get } from "svelte/store";
export const todos = persisted('todos')
export const getStoreValue = get(todos) || [];
export let finalId = persisted('Id')
export let id = get(finalId)||1;