<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
  
	let className: HTMLInputAttributes['class'] = undefined;
	export { className as class };
	export let type: HTMLInputAttributes['type'];
	export let value: string | null | undefined = '';
	export let name: string = '';
	export let label: string = '';
	export let placeholder: string = '';
	export let spellcheck: boolean = true;
	export let autocomplete: string = 'on';
	export let maxlength: number | undefined = undefined;
	export let errorMessage: string | undefined = undefined;
  
	$: valueLength = value?.length;
  </script>
  
  <label class="grid gap-1 text-sm font-medium">
	<div class="flex justify-between">
	  <span>{label}</span>
	  {#if maxlength}
		<span class="text-xs text-gray-400">
		  {valueLength}/{maxlength}
		</span>
	  {/if}
	</div>
  
	{#if errorMessage}
	  <p class="text-red-500 text-xs">{errorMessage}</p>
	{/if}
  
	<input
	{name}
	{...{ type }}
	bind:value
	{maxlength}
	{spellcheck}
	{placeholder}
	{autocomplete}
	class={`w-full py-3 sm:py-4 md:py-5 p-4 sm:p-5 md:p-6 rounded-xl bg-transparent px-3 border-2 border-[#9F9F9F] text-gray-500 text-left focus:outline-none focus:ring-2 focus:ring-gray-300 ${className || ''}`} 
	aria-label={label}
	aria-invalid={errorMessage ? 'true' : undefined}
  />
  
  
  </label>
  