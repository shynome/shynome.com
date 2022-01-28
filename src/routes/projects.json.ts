import type { RequestHandler } from '@sveltejs/kit'
import glob from 'glob-promise'
import chunk from 'lodash.chunk'
import fs from 'fs/promises'
import YAML from 'yaml'

export type Project = {
	id: string
	name: string
	link: string
	desc: string
	tags: string[]
}

export const get: RequestHandler = async () => {
	let files = await glob('./data/projects.{yml,yaml}')
	let fcontent = await fs.readFile(files[0], 'utf8')
	let projects: Project[] = await YAML.parse(fcontent)
	return {
		body: projects,
	}
}
