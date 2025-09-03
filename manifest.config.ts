import { defineManifest } from "@crxjs/vite-plugin";
import pkg from "./package.json";

export default defineManifest({
	manifest_version: 3,
	name: pkg.name,
	version: pkg.version,
	icons: {
		48: "public/logo.png",
	},
	action: {
		default_icon: {
			48: "public/logo.png",
		},
		default_popup: "src/popup/index.html",
	},
	background: {
		service_worker: "src/background/main.ts",
		type: "module",
	},
	content_scripts: [
		{
			js: ["src/content/main.ts"],
			matches: ["https://*/*"],
		},
	],
	permissions: ["sidePanel", "contentSettings"],
	side_panel: {
		default_path: "src/sidepanel/index.html",
	},
});
