const elements = {
    domCheckNotes: document.getElementById("no-notes"),
    domNotesContainer: document.getElementById("notes"),
    addNoteTitle: document.getElementById("new-note-title-input"),
    addNoteBody: document.getElementById("new-note-body-input"),
    addNoteForm: document.getElementById("inputForm"),
    addBtn: document.querySelector(".btn"),
};

const state = { editFlag: false, editNote: null, notes: [] };

const setState = (newState, prevState = state || {}) => Object.assign(prevState, newState);

const getID = () => `note-${Math.floor(Math.random() * Date.now()).toString(16)}`;

const getColor = () => {
    const hex = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "A", "B", "C", "D", "E", "F"];

    return `#${Array.from({ length: 6 }, () => hex[Math.floor(Math.random() * hex.length)]).join("")}`;
};

const getDomNoteData = editNote =>
    ({ domNoteTitle: editNote?.querySelector("h2"), domNoteBody: editNote?.querySelector("p") } || {});

const isNotePresent = ({ notes = state.notes, newNoteTitle, newNoteBody }) =>
    notes.some(({ noteTitle, noteBody }) => noteTitle === newNoteTitle && noteBody === newNoteBody);

const clearDomInputs = (...domInputs) => domInputs.forEach(domInput => (domInput.value = ""));

const renderNote = ({ id, noteTitle, noteBody }) => {
    let markup = `
        <li id="${id}">
            <a href="#" style="background-color:${getColor()}">
                <h2 class="note-title">${noteTitle}</h2>
                <p class="note-body">${noteBody}</p>
                <button class="delete">X</button>
                <button class="edit">edit</button>
            </a>
        </li>
    `;

    elements.domNotesContainer.insertAdjacentHTML("beforeend", markup);
};

const backToInitial = () => {
    setState({ editFlag: false });
    elements.addBtn.textContent = "Create Note";
    elements.addNoteForm.reset();
};

const addNoteController = e => {
    e.preventDefault();

    const { addNoteTitle, addNoteBody } = elements;

    const { notes, editFlag, editNote } = state;

    let newNoteTitle = addNoteTitle.value.trim();

    let newNoteBody = addNoteBody.value.trim();

    if (!newNoteTitle || !newNoteBody || isNotePresent({ newNoteTitle, newNoteBody })) return;

    const stickNote = { id: getID(), noteTitle: newNoteTitle, noteBody: newNoteBody };

    if (editFlag) {
        const { domNoteTitle, domNoteBody } = getDomNoteData(editNote);

        [domNoteTitle.textContent, domNoteBody.textContent] = [newNoteTitle, newNoteBody];

        Object.assign(notes.find(({ id }) => id === editNote.id) || {}, {
            noteTitle: newNoteTitle,
            noteBody: newNoteBody,
        });

        localStorage.setItem("stickNotes", JSON.stringify(notes));

        return backToInitial();
    }

    renderNote(stickNote);

    notes.push(stickNote);

    localStorage.setItem("stickNotes", JSON.stringify(notes));

    e.target.reset();

    addNoteTitle.focus();

    elements.domCheckNotes.classList.add("hidden");
};

const handleRemoveEditController = ({ target }) => {
    const { domCheckNotes, domNotesContainer, addNoteBody, addNoteTitle, addBtn } = elements;

    const domStickNote = target.closest("li");

    if (target.matches(".edit")) {
        setState({ editFlag: true, editNote: domStickNote });

        const { domNoteTitle, domNoteBody } = getDomNoteData(state.editNote);

        [addNoteTitle.value, addNoteBody.value] = [domNoteTitle.textContent, domNoteBody.textContent];

        addBtn.textContent = "edit";

        addNoteTitle.focus();
    }

    if (target.matches(".delete")) {
        domStickNote.remove();

        setState({ notes: state.notes.filter(({ id }) => id !== domStickNote.id) });

        localStorage.setItem("stickNotes", JSON.stringify(state.notes));

        !domNotesContainer.children.length && domCheckNotes.classList.remove("hidden");

        backToInitial();
    }
};

const getLocalNotes = () => {
    setState({ notes: JSON.parse(localStorage.getItem("stickNotes")) || [] });

    state.notes.forEach(renderNote);

    state.notes.length && elements.domCheckNotes.classList.add("hidden");
};

elements.addNoteForm.addEventListener("submit", addNoteController);

elements.domNotesContainer.addEventListener("click", handleRemoveEditController);

document.addEventListener("DOMContentLoaded", getLocalNotes);
