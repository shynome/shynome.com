<script>
	import Header from '$lib/header.svelte'
</script>

<Header />
<slot />

<style global>
	@import 'normalize.css';
	@import './_app.css';
</style>
