document.addEventListener('DOMContentLoaded', function() {
    const addBox = document.querySelector(".add-box"),
        popupBox = document.querySelector(".popup-box"),
        popupTitle = popupBox.querySelector("header p"),
        closeIcon = popupBox.querySelector("header i"),
        titleTag = popupBox.querySelector("input[type='text']"),
        descTag = popupBox.querySelector("textarea"),
        priorityInput = popupBox.querySelector("input[type='number']"),
        addBtn = popupBox.querySelector("button");

    let notes = [];
    let activeNoteId = null;

    try {
        notes = JSON.parse(localStorage.getItem('notes')) || [];
    } catch (e) {
        console.error('Failed to parse notes from local storage:', e);
        notes = [];
    }

    let isUpdate = false, updateId;

    addBox.addEventListener("click", () => {
        popupTitle.innerText = "Add a new Note";
        addBtn.innerText = "Add Note";
        popupBox.classList.add("show");
        document.querySelector("body").style.overflow = "hidden";
        if (window.innerWidth > 660) titleTag.focus();
    });

    closeIcon.addEventListener("click", () => {
        isUpdate = false;
        titleTag.value = descTag.value = priorityInput.value = "";
        popupBox.classList.remove("show");
        document.querySelector("body").style.overflow = "auto";
    });

    function fetchAndShowNotes() {
        fetchNotesFromServer().then(serverNotes => {
            notes = serverNotes || [];
            localStorage.setItem('notes', JSON.stringify(notes));
            displayNotes();
        }).catch(error => {
            console.error('Failed to fetch notes from server:', error);
            displayNotes();
        });
    }

    function displayNotes() {
        document.querySelectorAll(".note").forEach(li => li.remove());
        notes.forEach((note) => {
            let filterDesc = note.icerik ? note.icerik.replaceAll("\n", '<br/>') : '';
            let liTag = `<li class="note" data-id="${note.id}">
                            <div class="details">
                                <p>${note.baslik}</p>
                                <span>${filterDesc}</span>
                            </div>
                            <div class="bottom-content">
                                <span>${new Date(note.notTarihi).toLocaleDateString()}</span>
                                <div class="settings">
                                    <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                                    <ul class="menu">
                                        <li onclick="event.stopPropagation(); triggerUpdate(${note.id})"><i class="uil uil-pen"></i>Edit</li>
                                        <li onclick="event.stopPropagation(); deleteNoteHandler(${note.id})"><i class="uil uil-trash"></i>Delete</li>
                                    </ul>
                                </div>
                            </div>
                        </li>`;
            addBox.insertAdjacentHTML("afterend", liTag);
        });
    }

    window.showMenu = function(elem) {
        elem.parentElement.classList.add("show");
        document.addEventListener("click", e => {
            if (e.target.tagName != "I" || e.target != elem) {
                elem.parentElement.classList.remove("show");
            }
        });
    }

    window.deleteNoteHandler = function(noteId) {
        console.log(`Deleting note with ID: ${noteId}`);
        let confirmDel = confirm("Are you sure you want to delete this note?");
        if (!confirmDel) return;

        deleteNoteFromLocal(noteId);

        deleteNoteFromServer(noteId).then(() => {
            Swal.fire({
                icon: 'success',
                title: 'Note Deleted',
                text: 'Your note has been deleted successfully!',
            });
        }).catch(error => {
            console.error(`Failed to delete note ID ${noteId} from server:`, error);
        });
    }

    window.triggerUpdate = async function(noteId) {
        let note = await openNoteFromServer(noteId); 
        if (!note) return;

        updateId = noteId;
        isUpdate = true;
        addBox.click();
        titleTag.value = note.baslik;
        descTag.value = note.icerik ? note.icerik.replaceAll('<br/>', '\r\n') : '';
        priorityInput.value = note.oncelik;
        popupTitle.innerText = "Update a Note";
        addBtn.innerText = "Update Note";
    }

    document.querySelector('form').addEventListener("submit", e => {
        e.preventDefault();
        if (isUpdate) {
            updateNoteInServer(updateId, titleTag.value.trim(), descTag.value.trim(), parseInt(priorityInput.value) || 0).then(updatedNote => {
                Swal.fire({
                    icon: 'success',
                    title: 'Note Updated',
                    text: 'Your note has been updated successfully!',
                });
                updateNoteLocal(updatedNote);
            });
        } else {
            createNoteInServer(titleTag.value.trim(), descTag.value.trim(), parseInt(priorityInput.value) || 0).then(newNote => {
                Swal.fire({
                    icon: 'success',
                    title: 'Note Created',
                    text: 'Your note has been created successfully!',
                });
                addNoteToLocal(newNote);
            });
        }
    });

    function addNoteToLocal(note) {
        console.log('Adding note to local storage:', note);
        notes.push(note);
        localStorage.setItem('notes', JSON.stringify(notes));
        displayNotes();
        document.querySelector(".popup-box").classList.remove("show");
        document.querySelector("body").style.overflow = "auto";
    }

    function updateNoteLocal(note) {
        console.log('Updating note in local storage:', note);
        const index = notes.findIndex(n => n.id === note.id);
        if (index !== -1) {
            notes[index] = note;
        } else {
            notes.push(note);
        }
        localStorage.setItem('notes', JSON.stringify(notes));
        displayNotes();
        document.querySelector(".popup-box").classList.remove("show");
        document.querySelector("body").style.overflow = "auto";
    }

    function deleteNoteFromLocal(noteId) {
        console.log(`Deleting note from local storage with ID: ${noteId}...`);
        notes = notes.filter(note => note.id !== noteId);
        localStorage.setItem('notes', JSON.stringify(notes));
        console.log('Note deleted from local storage successfully');
        displayNotes();
    }

    fetchAndShowNotes();
});

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', function(event) {
    event.preventDefault();
    document.body.classList.add('animate-fade-out');
    setTimeout(() => {
      window.location.href = this.href;
    }, 500);
  });
});

document.querySelectorAll('.logo-link').forEach(link => {
  link.addEventListener('click', function(event) {
    event.preventDefault();
    document.body.classList.add('animate-slide-out');
    setTimeout(() => {
      window.location.href = this.href;
    }, 500);
  });
});
