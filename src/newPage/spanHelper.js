export function wrapWordsWithSpans(text, inputElement) {
  const words = text.split(" ");
  inputElement.innerHTML = words
    .map((word, index) => {
      return `<span class="fade-in-word" style="animation: fade-in 0.3s ${index * 0.015}s forwards cubic-bezier(0.11, 0, 0.5, 0);">${word}</span>`;
    })
    .join(" ");

    inputElement.setAttribute("contenteditable", "true");
    inputElement.value = text;
}
