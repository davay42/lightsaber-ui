import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import Unocss from 'unocss/vite'
import { transformerDirectives, presetIcons, presetUno, extractorSplit } from 'unocss'
import extractorPug from '@unocss/extractor-pug'
import { viteSingleFile } from "vite-plugin-singlefile"

export default defineConfig({
	server: {
		port: 3942,
		strictPort: false,
		fs: {
			allow: ['../']
		}
	},
	publicDir: "public",
	plugins: [
		vue({
			script: {
				defineModel: true
			}
		}),
		Unocss({
			transformers: [
				transformerDirectives(),
			],
			presets: [
				presetIcons({
					cdn: 'https://esm.sh/',
					scale: 1.2,
					extraProperties: {
						'vertical-align': 'middle'
					}
				}),
				presetUno(),
			],
			extractors: [
				extractorSplit,
				extractorPug()
			]
		}),
		viteSingleFile({ removeViteModuleLoader: true })
	],
	build: {
		outDir: "./dist/",
		target: "esnext",
	},
	optimizeDeps: {
		include: ["vue", "@vueuse/core", "@vueuse/math", "@vueuse/gesture"],
	},
});
