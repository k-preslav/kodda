import { getUserIdFromLocalStorage } from "../accountManager";
import { fetchSnippets } from "../apiHelper";

export function searchSnippets(query) {
  let found = [];

  return fetchSnippets(getUserIdFromLocalStorage()).then((snippets) => {
    query = query.toLowerCase();
    const queryWords = query.split(/\s+/);  // Split the query into words based on spaces

    // Check if snippets are empty or if the fetch failed
    if (!snippets || snippets.length === 0) {
      console.log("No snippets found or failed to fetch snippets");
      return [];
    }

    snippets.forEach((snip) => {
      const title = snip.title.toLowerCase();
      const description = snip.description.toLowerCase();
      const lang = snip.language.toLowerCase();

      const queryLang = getLanguageFromQuerry(query).toLowerCase();

      const titleWords = title.split(/\s+/);
      const descriptionWords = description.split(/\s+/);

      let titleMatch = queryWords.some(word => titleWords.includes(word));
      let descriptionMatch = queryWords.some(word => descriptionWords.includes(word));
      let langMatch = queryLang.includes(lang);

      if (titleMatch || descriptionMatch || langMatch) {
        found.push(snip);
      }
    });

    return found;
  });
}


export function getLanguageFromQuerry(querry) {
  const normalizedQuerry = querry.toLowerCase();

  for (const [key, values] of Object.entries(languageMatches)) {
    if (values.some(value => normalizedQuerry.includes(value))) {
      return key;
    }
  }

  return "";
}

const languageMatches = {
  "html": ["html"],
  "css": ["css", "style", "stylesheet"],
  "javascript": ["js", "javascript"],
  "python": ["py", "python"],
  "go": ["golang", "go"],
  "csharp": ["cs", "c#", "csharp"],
  "c": ["c"],
  "cpp": ["c++", "cpp"],
};
