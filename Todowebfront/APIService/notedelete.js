console.log('notedelete.js loaded');

async function deleteNoteFromServer(noteId) {
    try {
        console.log(`Sending delete request for note ID: ${noteId}...`);
        const response = await fetch(`https://localhost:44334/api/Note/delete/${noteId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log('Delete request sent. Waiting for response...');

        if (response.ok) {
            const responseText = await response.text();
            console.log('Note deleted successfully on server:', responseText);

            let responseData;
            try {
                responseData = JSON.parse(responseText);
            } catch (error) {
                responseData = { message: responseText };
            }
        } else {
            console.error('Error deleting note:', response.statusText);
            const errorText = await response.text();
            console.error('Error details:', errorText);
        }
    } catch (error) {
        console.error('Error deleting note:', error);
    }
}


function deleteNoteFromLocal(noteId) {
    console.log(`Deleting note from local storage with ID: ${noteId}...`);
    const notes = JSON.parse(localStorage.getItem('notes') || '[]');
    const updatedNotes = notes.filter(note => note.id !== noteId);
    localStorage.setItem('notes', JSON.stringify(updatedNotes));
    console.log('Note deleted from local storage successfully');
    fetchAndShowNotes(); 
}
