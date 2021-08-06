<script lang="ts">
import { onMount } from "svelte";


	
	let todos:{done: boolean, todoText:string, id: number}[] = []
	let todoInputValue = ""
	let highestId = 0;

	onMount(()=>{
		 // Handle messages sent from the extension to the webview
		 // copied from https://github.com/microsoft/vscode-extension-samples/blob/main/webview-sample/media/main.js
		 window.addEventListener('message', event => {
        const message = event.data; // The json data that the extension sent
        switch (message.type) {
            case 'new-todo': 
							addTodo(message.value)
        }
    });
	})

	function addTodo(text: string) {
		highestId = highestId + 1

		const newestTodo = {
			done: false,
			todoText: text,
			id: highestId
		}

		todos = [...todos, newestTodo]
	}

	function removeTodo(id: number) {
		todos = todos.filter(todo => todo.id !== id)
	}

	function removeFinishedTodos() {
		todos = todos.filter(todo => todo.done !== true)
	}

	function handleKeyPress (e:KeyboardEvent) {
		const key = e.key
		if (key === "Enter"){
			addTodo(todoInputValue)
			todoInputValue = ""
		}
	}
</script>

<style>
	.todoItem {
		display: flex;
		justify-content: space-between;
	}
</style>



<input bind:value = {todoInputValue} type="text" on:keypress="{handleKeyPress}">
<h1>
	Todos
</h1>
<ul>
	{#each todos as todo (todo.id)}
	<div class = "todoItem">
		<input type="checkbox" bind:checked = {todo.done}>
		{todo.todoText}
		<div on:click="{() => {removeTodo(todo.id)}}">x</div>
	</div>
	{/each}
</ul>
<button on:click="{removeFinishedTodos}">Remove finished todos</button>
<button on:click = {()=>{
	tsvscode.postMessage({
		type: 'onInfo',
		value: 'info message boys'
	})
}}>click me</button>