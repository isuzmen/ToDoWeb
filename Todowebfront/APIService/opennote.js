console.log('openNote.js loaded');

async function openNoteFromServer(noteId) {
    try {
        console.log(`Opening note with ID: ${noteId} from server...`);
        const response = await fetch(`https://localhost:44334/api/Note/open-note/${noteId}`, { // URL güncellendi
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const note = await response.json();
            console.log('Note opened successfully:', note);
            return note;
        } else {
            console.error('Error opening note:', response.statusText);
            const errorText = await response.text();
            console.error('Error details:', errorText);
            return null;
        }
    } catch (error) {
        console.error(`Error opening note with ID ${noteId}:`, error);
        return null;
    }
}

async function openNoteHandler(noteId) {
    let note = await openNoteFromServer(noteId);
    if (!note) return;

    activeNoteId = noteId;
    console.log(`Active note ID set to: ${activeNoteId}`);
    showNoteDetails(note);
}

function showNoteDetails(note) {
    const detailPopup = document.createElement('div');
    detailPopup.classList.add('detail-popup', 'show');
    
    const detailContent = `
        <div class="detail-content">
            <header>
                <h2>${note.baslik}</h2>
                <i class="uil uil-times" onclick="closeNoteDetails()"></i>
            </header>
            <div class="detail-body">
                <textarea>${note.icerik}</textarea>
            </div>
        </div>
    `;

    detailPopup.innerHTML = detailContent;
    document.body.appendChild(detailPopup);

    gsap.fromTo(detailPopup, {opacity: 0, scale: 0.8}, {opacity: 1, scale: 1, duration: 0.5, ease: "power2.out"});
}

function closeNoteDetails() {
    const detailPopup = document.querySelector('.detail-popup');
    if (detailPopup) {
            gsap.to(detailPopup, {
            opacity: 0,
            scale: 0.8,
            duration: 0.5,
            ease: "power2.in",
            onComplete: () => detailPopup.remove()
        });
    }
}
