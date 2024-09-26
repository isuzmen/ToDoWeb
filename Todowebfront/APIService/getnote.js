        console.log('getnote.js loaded');

        async function fetchNoteFromServer(noteId) {
            try {
                console.log(`Fetching note with ID: ${noteId} from server...`);
                const response = await fetch(`https://localhost:44334/api/Note/get/${noteId}`, { // URL güncellendi
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const note = await response.json();
                    console.log('Note fetched successfully:', note);
                    return note;
                } else {
                    console.error('Error fetching note:', response.statusText);
                    const errorText = await response.text();
                    console.error('Error details:', errorText);
                    return null;
                }
            } catch (error) {
                console.error(`Error fetching note with ID ${noteId}:`, error);
                return null;
            }
        }
            
        console.log('getnote.js loaded');

        async function fetchNotesFromServer() {
            try {
                console.log('Fetching notes from server...');
                const response = await fetch('https://localhost:44334/api/Account/getmynotes', { // URL güncellendi
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
        
                if (response.ok) {
                    const notes = await response.json();
                    console.log('Notes fetched successfully:', notes);
                    return notes;
                } else {
                    console.error('Error fetching notes:', response.statusText);
                    const errorText = await response.text();
                    console.error('Error details:', errorText);
                    return [];
                }
            } catch (error) {
                console.error('Error fetching notes:', error);
                return [];
            }
        }
        
        
        



        function updateLocalStorage(notes) {
            console.log('Updating local storage with notes:', notes);
            localStorage.setItem('notes', JSON.stringify(notes));
            console.log('Local storage updated successfully');
            fetchAndShowNotes(); // showNotes yerine fetchAndShowNotes çağrıldı
        }

        async function fetchAndShowNotes() {
            const notesFromServer = await fetchNotesFromServer();
            updateLocalStorage(notesFromServer);
        }
