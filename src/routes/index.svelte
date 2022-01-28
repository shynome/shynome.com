<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit'
	import type { Project } from './projects.json'

	export const load: Load = async ({ fetch }) => {
		let projects: Project[] = await fetch('/projects.json').then((r) => r.json())
		return {
			props: {
				projects,
			},
		}
	}
</script>

<script lang="ts">
	export let projects: Project[]
</script>

<svelte:head>
	<title>shynome profile</title>
</svelte:head>

<header>
	<h1>shynome</h1>
	<blockquote>less is more</blockquote>
	<address>
		<ul>
			<li>
				<dl>
					<dt>email</dt>
					<dd>
						<a href="mailto:shynome@gmail.com" target="_blank" title="email">shynome@gmail.com</a>
					</dd>
				</dl>
			</li>
			<!-- pgp 暂时没有确定就不放上来了 -->
			{#if 0}
				<li>
					<dl>
						<dt>pgp</dt>
						<dd>
							<pre><code /></pre>
						</dd>
					</dl>
				</li>
			{/if}
		</ul>
	</address>
</header>
<main>
	<section>
		<header>
			<h2>projects</h2>
		</header>
		<ul>
			{#each projects as p}
				<li>
					<cite>
						<a rel="external" href={p.link} target={p.id}>{p.name}</a>
					</cite>
					<p>{p.desc}</p>
					<aside>
						<dl>
							<dt>keyswords</dt>
							{#each p.tags as t}
								<dd><code>{t}</code></dd>
							{/each}
						</dl>
					</aside>
				</li>
			{/each}
		</ul>
	</section>
</main>
<footer />
