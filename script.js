const form = document.querySelector("#note-form");
const input = document.querySelector("#note-input");
const categorySelect = document.querySelector("#note-category");
const list = document.querySelector("#notes-list");
const count = document.querySelector("#note-count");

let notes = [];

function render() {
  list.replaceChildren();

  notes.forEach((note) => {
    const item = document.createElement("li");
    item.classList.add("note", `category-${note.category}`);

    const content = document.createElement("div");
    content.classList.add("note-content");

    const text = document.createElement("span");
    text.classList.add("note-text");
    text.textContent = note.text;

    const meta = document.createElement("div");
    meta.classList.add("note-meta");

    const category = document.createElement("span");
    category.classList.add("category-label");
    category.textContent = note.category[0].toUpperCase() + note.category.slice(1);

    const date = document.createElement("time");
    date.textContent = note.createdAt;

    meta.append(category, date);
    content.append(text, meta);
    item.append(content);
    list.append(item);
  });

  count.textContent =
    notes.length === 1 ? "You have 1 note." : `You have ${notes.length} notes.`;
}

function addNote(text, category) {
  const id = globalThis.crypto?.randomUUID
    ? globalThis.crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  notes.push({
    id,
    text,
    category,
    createdAt: new Date().toLocaleString(),
  });
  render();
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = input.value.trim();
  addNote(text, categorySelect.value);
  input.value = "";
  input.focus();
});

render();
