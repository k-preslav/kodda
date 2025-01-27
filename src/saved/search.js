import { getUserIdFromLocalStorage } from "../registerPage/registerPage.js";
import { fetchSnippets } from "../apiHelper.js";

export function searchSnippets(query) {
  let found = [];

  return fetchSnippets(getUserIdFromLocalStorage()).then((snippets) => {
    query = query.toLowerCase();
    const queryWords = splitQuerry(query);

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

      const titleWords = splitQuerry(title);
      const descriptionWords = splitQuerry(description);

      let titleMatch = queryWords.some(queryWord => 
        titleWords.some(titleWord => titleWord.includes(queryWord))
      );
      let descriptionMatch = queryWords.some(queryWord => 
        descriptionWords.some(descriptionWord => descriptionWord.includes(queryWord))
      );
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

function splitQuerry(querry) {
  return querry.split(/[\s,.:;|&]+/).filter(word => word.length > 0);
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
