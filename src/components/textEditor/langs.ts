import { langs, type LanguageName } from "@uiw/codemirror-extensions-langs"
import { languages as cmLanguages } from "@codemirror/language-data"
import pathModule from "path"

const aliasToKey: Record<string, LanguageName> = {}
for (const key of Object.keys(langs) as LanguageName[]) {
       aliasToKey[key.toLowerCase()] = key
}

const manualAliases: Record<string, LanguageName> = {
       "postgresql": "pgsql",
       "webassembly": "wast",
       "clojurescript": "clojure",
       "jsonld": "json",
       "json-ld": "json",
       "latex": "stex",
       "tiki wiki": "tiki",
       "angular template": "angular"
}

for (const [alias, key] of Object.entries(manualAliases)) {
       aliasToKey[alias] = key
}

function normalize(name: string) {
	return name.toLowerCase().replace(/[^a-z0-9]/g, "")
}

const extensionMap: Record<string, LanguageName> = {}
const filenameMap: Array<[RegExp, LanguageName]> = []
for (const desc of cmLanguages) {
       let found: LanguageName | null = null

	for (const alias of [desc.name, ...(desc.alias ?? [])]) {
		const direct = alias.toLowerCase()
		if (aliasToKey[direct]) {
			found = aliasToKey[direct]
			break
		}
	}

	if (!found) {
		for (const alias of [desc.name, ...(desc.alias ?? [])]) {
			const simple = normalize(alias)
			if (aliasToKey[simple]) {
				found = aliasToKey[simple]
				break
			}
		}
	}

	if (found) {
		for (const ext of desc.extensions ?? []) {
			const key = "." + ext.toLowerCase()
			if (!extensionMap[key]) {
				extensionMap[key] = found
			}
		}

               if (desc.filename) {
                       const flags = desc.filename.flags.includes("i") ? desc.filename.flags : desc.filename.flags + "i"
                       const regex = new RegExp(desc.filename.source, flags)
                       filenameMap.push([regex, found])
               }
       }
}

const manualMap: Record<string, string> = {
	".html5": "html",
	".css3": "css",
	".litcoffee": "coffeescript",
	".py3": "python",
	".ps": "powershell",
	".bat": "powershell",
	".protobuf": "protobuf",
	".dockerfile": "dockerfile",
	".conf": "shell"
}

for (const [ext, lang] of Object.entries(manualMap)) {
	const key = aliasToKey[lang]
	if (key && !extensionMap[ext]) {
		extensionMap[ext] = key
	}
}

export function loadLanguage(name: string) {
       const { ext, base } = pathModule.posix.parse(name)
       const lowerExt = ext.toLowerCase()
       const lowerBase = base.toLowerCase()

       if (lowerExt) {
               const key = extensionMap[lowerExt]

               if (key && langs[key]) {
                       return langs[key]()
               }
       }

       for (const [regex, lang] of filenameMap) {
               if (regex.test(lowerBase)) {
                       return langs[lang]()
               }
       }

	return null
}
