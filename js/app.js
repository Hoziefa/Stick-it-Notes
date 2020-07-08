const elements = {
    domCheckNotes: document.getElementById("no-notes"),
    domNotesContainer: document.getElementById("notes"),
    domNoteTitle: document.getElementById("new-note-title-input"),
    domNoteBody: document.getElementById("new-note-body-input"),
    addStickForm: document.getElementById("inputForm"),
    addBtn: document.querySelector(".btn"),
};

let stickNotes = [];

let editFlag = false;
let editNote;

const getColor = _ => {
    const hex = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "A", "B", "C", "D", "E", "F"];

    return `#${Array.from({ length: 6 }, _ => hex[Math.floor(Math.random() * hex.length)]).join("")}`;
};

const getID = _ => Math.floor(Math.random() * new Date().getTime());

const createNote = ({ id, noteTitle, noteBody }) => {
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
    elements.addBtn.textContent = "Create note";
    elements.addStickForm.reset();
};

const addNoteController = e => {
    e.preventDefault();

    const { domNoteTitle, domNoteBody } = elements;

    const stickNote = { id: getID(), noteTitle: domNoteTitle.value, noteBody: domNoteBody.value };

    if ((!stickNote.noteTitle, !stickNote.noteBody)) return;

    if (editFlag) {
        const note = stickNotes.find(({ id }) => id === +editNote.id);

        let [domNoteTitleCn, domNoteBodyCn] = [editNote.querySelector("h2"), editNote.querySelector("p")];

        [domNoteTitleCn.textContent, domNoteBodyCn.textContent] = [stickNote.noteTitle, stickNote.noteBody];

        Object.assign(note, { noteTitle: stickNote.noteTitle, noteBody: stickNote.noteBody });

        localStorage.setItem("stickNotes", JSON.stringify(stickNotes));

        return backToInitial();
    }

    createNote(stickNote);

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

        const [domNoteTitleCn, domNoteBodyCn] = [editNote.querySelector("h2"), editNote.querySelector("p")];

        [domNoteTitle.value, domNoteBody.value] = [domNoteTitleCn.textContent, domNoteBodyCn.textContent];

        domNoteTitle.focus();
    }

    if (target.matches(".delete")) {
        domStickNote.remove();

        stickNotes = stickNotes.filter(({ id }) => id !== +domStickNote.id);

        localStorage.setItem("stickNotes", JSON.stringify(stickNotes));

        !domNotesContainer.children.length && domCheckNotes.classList.remove("hidden");

        backToInitial();
    }
};

const getLocalNotes = _ => {
    stickNotes.push(...(JSON.parse(localStorage.getItem("stickNotes")) || []));

    stickNotes.forEach(createNote);

    stickNotes.length && elements.domCheckNotes.classList.add("hidden");
};

elements.addStickForm.addEventListener("submit", addNoteController);

elements.domNotesContainer.addEventListener("click", handleRemoveEditController);

document.addEventListener("DOMContentLoaded", getLocalNotes);
