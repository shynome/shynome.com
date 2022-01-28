// import adapter from '@sveltejs/adapter-auto';
import adapter from '@sveltejs/adapter-static'
import preprocess from 'svelte-preprocess'

const production = process.env.NODE_ENV !== 'development'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),

	kit: {
		adapter: adapter(),

		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',

		// full static
		router: !production,
		hydrate: !production,
	},
}

export default config
