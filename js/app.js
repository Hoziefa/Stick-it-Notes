const elements = {
    domCheckNotes: document.getElementById("no-notes"),
    domNotesContainer: document.getElementById("notes"),
    domNoteTitle: document.getElementById("new-note-title-input"),
    domNoteBody: document.getElementById("new-note-body-input"),
    addNoteForm: document.getElementById("inputForm"),
    addBtn: document.querySelector(".btn"),
};

let stickNotes = [];

let editFlag = false;
let editNote;

const getColor = _ => {
    const hex = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "A", "B", "C", "D", "E", "F"];

    return `#${Array.from({ length: 6 }, _ => hex[Math.floor(Math.random() * hex.length)]).join("")}`;
};

const getID = _ => `note-${Math.floor(Math.random() * new Date().getTime()).toString(16)}`;

const renderNote = ({ id, noteTitle, noteBody }) => {
    let markup = `
        <li id="${id}">
            <a href="#" style="background-color:${getColor()}">
                <h2>${noteTitle}</h2>
                <p>${noteBody}</p>
                <button class="delete">X</button>
                <button class="edit">edit</button>
            </a>
        </li>
    `;

    elements.domNotesContainer.insertAdjacentHTML("beforeend", markup);
};

const backToInitial = _ => {
    editFlag = false;
    elements.addBtn.textContent = "Create Note";
    elements.addNoteForm.reset();
};

const addNoteController = e => {
    e.preventDefault();

    const { domNoteTitle, domNoteBody } = elements;

    let noteTitle = domNoteTitle.value.trim();
    let noteBody = domNoteBody.value.trim();

    if (!noteTitle || !noteBody) return;

    const stickNote = { id: getID(), noteTitle, noteBody };

    if (editFlag) {
        [editNote.querySelector("h2").textContent, editNote.querySelector("p").textContent] = [
            noteTitle,
            noteBody,
        ];

        Object.assign(stickNotes.find(({ id }) => id === editNote.id) || {}, { noteTitle, noteBody });

        localStorage.setItem("stickNotes", JSON.stringify(stickNotes));

        return backToInitial();
    }

    renderNote(stickNote);

    stickNotes.push(stickNote);

    localStorage.setItem("stickNotes", JSON.stringify(stickNotes));

    e.target.reset();

    domNoteTitle.focus();

    elements.domCheckNotes.classList.add("hidden");
};

const handleRemoveEditController = ({ target }) => {
    const { domCheckNotes, domNotesContainer, domNoteBody, domNoteTitle, addBtn } = elements;

    const domStickNote = target.closest("li");

    if (target.matches(".edit")) {
        editFlag = true;

        editNote = domStickNote;

        addBtn.textContent = "edit";

        [domNoteTitle.value, domNoteBody.value] = [
            editNote.querySelector("h2").textContent,
            editNote.querySelector("p").textContent,
        ];

        domNoteTitle.focus();
    }

    if (target.matches(".delete")) {
        domStickNote.remove();

        stickNotes = stickNotes.filter(({ id }) => id !== domStickNote.id);

        localStorage.setItem("stickNotes", JSON.stringify(stickNotes));

        !domNotesContainer.children.length && domCheckNotes.classList.remove("hidden");

        backToInitial();
    }
};

const getLocalNotes = _ => {
    stickNotes.push(...(JSON.parse(localStorage.getItem("stickNotes")) || []));

    stickNotes.forEach(renderNote);

    stickNotes.length && elements.domCheckNotes.classList.add("hidden");
};

elements.addNoteForm.addEventListener("submit", addNoteController);

elements.domNotesContainer.addEventListener("click", handleRemoveEditController);

document.addEventListener("DOMContentLoaded", getLocalNotes);
