console.log('notecreate.js loaded');

async function createNoteInServer(title, description, priority) {
    const noteData = {
        baslik: title,
        icerik: description,
        yapildimi: false,
        notTarihi: new Date().toISOString(),
        oncelik: priority
    };

    console.log('Form submitted for create:', noteData);

    try {
        console.log('Sending fetch request...');
        const response = await fetch('https://localhost:44334/api/Note/create', { // URL güncellendi
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(noteData)
        });

        console.log('Fetch request sent. Waiting for response...');

        if (response.ok) {
            const responseText = await response.text();
            console.log('Note created successfully:', responseText);

            let responseData;
            try {
                responseData = JSON.parse(responseText);
            } catch (error) {
                responseData = { message: responseText };
            }

            if (responseData && responseData.id) {
                noteData.id = responseData.id; 
            }
            return noteData;
        } else {
            console.error('Error creating note:', response.statusText);
            const errorText = await response.text();
            console.error('Error details:', errorText);
        }
    } catch (error) {
        console.error('Error creating note:', error);
    }
}



function addNoteToLocal(noteData) {
    console.log('Adding note to local storage:', noteData);
    const notes = JSON.parse(localStorage.getItem('notes') || '[]');
    notes.push(noteData);
    localStorage.setItem('notes', JSON.stringify(notes));
    console.log('Note added to local storage successfully');
    fetchAndShowNotes(); 
    document.querySelector(".popup-box").classList.remove("show");
    document.querySelector("body").style.overflow = "auto";
}
