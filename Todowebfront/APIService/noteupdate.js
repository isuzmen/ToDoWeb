console.log('noteupdate.js loaded');

async function updateNoteInServer(noteId, title, description, priority) {
    const noteData = {
        id: noteId,
        baslik: title,
        icerik: description,
        yapildimi: false,
        notTarihi: new Date().toISOString(),
        oncelik: priority
    };

    console.log('Form submitted for update:', noteData);

    try {
        console.log('Sending fetch request for update...');
        const response = await fetch(`https://localhost:44334/api/Note/update/${noteId}`, { // URL güncellendi
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(noteData)
        });

        console.log('Fetch request for update sent. Waiting for response...');

        if (response.ok) {
            const responseData = await response.json();
            console.log('Note updated successfully on server:', responseData);
            return responseData;
        } else {
            console.error('Error updating note:', response.statusText);
            const errorText = await response.text();
            console.error('Error details:', errorText);
        }
    } catch (error) {
        console.error('Error updating note:', error);
    }
}
    

function updateNoteLocal(noteData) {
    console.log('Updating note in local storage:', noteData);
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    const existingNoteIndex = notes.findIndex(note => note.id === noteData.id);
    if (existingNoteIndex !== -1) {
        notes[existingNoteIndex] = noteData;
    } else {
        notes.push(noteData);
    }
    localStorage.setItem('notes', JSON.stringify(notes));
    console.log('Note updated in local storage successfully');
    fetchAndShowNotes(); 
    document.querySelector(".popup-box").classList.remove("show");
    document.querySelector("body").style.overflow = "auto";
}
