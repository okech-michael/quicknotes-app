const form = document.querySelector("#note-form");
const input = document.querySelector("#note-input");
const categorySelect = document.querySelector("#note-category");
const searchInput = document.querySelector("#search-input");
const list = document.querySelector("#notes-list");
const count = document.querySelector("#note-count");
const errorMessage = document.querySelector("#error-message");

const STORAGE_KEY = "quicknotes-app-notes";
const categories = ["personal", "work", "study"];
let notes = loadNotes();

function loadNotes() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    return [];
  }

  try {
    const loadedNotes = JSON.parse(saved);
    if (
      !Array.isArray(loadedNotes) ||
      !loadedNotes.every((note) =>
        note &&
        typeof note.id === "string" &&
        typeof note.text === "string" &&
        categories.includes(note.category) &&
        typeof note.createdAt === "string"
      )
    ) {
      throw new TypeError("Saved notes have an invalid format.");
    }

    return loadedNotes;
  } catch (error) {
    console.error("Unable to load saved QuickNotes:", error);
    return [];
  }
}

function saveNotes() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

function render() {
  list.replaceChildren();

  const searchWords = searchInput.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const visibleNotes = notes.filter((note) =>
    searchWords.every((word) => note.text.toLowerCase().includes(word))
  );

  if (searchWords.length > 0 && visibleNotes.length === 0) {
    const emptyMessage = document.createElement("li");
    emptyMessage.classList.add("empty-message");
    emptyMessage.textContent = "No notes match your search.";
    list.append(emptyMessage);
  }

  visibleNotes.forEach((note) => {
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
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.classList.add("delete-btn");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => deleteNote(note.id));

    item.append(content, deleteButton);
    list.append(item);
  });

  if (notes.length === 0) {
    count.textContent = "You have no notes yet.";
  } else if (notes.length === 1) {
    count.textContent = "You have 1 note.";
  } else {
    count.textContent = `You have ${notes.length} notes.`;
  }
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
  saveNotes();
  render();
}

function deleteNote(id) {
  notes = notes.filter((note) => note.id !== id);
  saveNotes();
  render();
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = input.value.trim();

  if (text === "") {
    errorMessage.textContent = "Please type a note first.";
    input.focus();
    return;
  }

  if (text.length > 200) {
    errorMessage.textContent = "Notes must be 200 characters or fewer.";
    input.focus();
    return;
  }

  errorMessage.textContent = "";
  addNote(text, categorySelect.value);
  input.value = "";
  input.focus();
});

searchInput.addEventListener("input", render);

render();
