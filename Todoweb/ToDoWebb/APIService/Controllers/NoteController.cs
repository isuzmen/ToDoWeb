using APIService.Models;
using BusinessLogic.Abstract;
using DataAccess.Abstract;
using DataAccess.Concrete;
using DataAccess.Concrete.EntityFramework.Contexts;
using Entities.Concrete;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace APIService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NoteController : ControllerBase
    {
        private INoteDal _noteDal;
        private INoteService _noteManager;

        public NoteController(INoteService noteManager, INoteDal noteDal)
        {
            _noteManager = noteManager;
            _noteDal = noteDal;
        }

        [HttpPost("create/")]
        public async Task<IActionResult> Create([FromBody] NoteCreateModel model)
        {
            if (model == null)
            {
                return BadRequest("Note object is null");
            }

            try
            {
                var note = new Note
                {
                    baslik = model.baslik,
                    icerik = model.icerik,
                    oncelik = model.oncelik,
                    notTarihi = DateTime.UtcNow,

                };
                _noteManager.AddNote(note);
                return Ok("Not eklendi.");
            }
            catch (DbUpdateException ex)
            {
                var innerExceptionMessage = ex.InnerException?.Message;
                return StatusCode(StatusCodes.Status500InternalServerError, $"Internal server error: {innerExceptionMessage}");
            }
        }

        [HttpDelete("delete/{noteId}")]
        public async Task<IActionResult> Delete(int noteId)
        {
            try
            {
                using (DataContext context = new DataContext())
                {
                    var note = context.Notes.FirstOrDefault(n => n.Id == noteId);
                    if (note != null)
                    {
                        context.Notes.Remove(note);
                        context.SaveChanges();
                        return Ok("Not başarıyla silindi.");
                    }
                    else
                    {
                        return NotFound("Not bulunamadı.");
                    }
                }
            }
            catch (DbUpdateException ex)
            {
                var innerExceptionMessage = ex.InnerException?.Message;
                return StatusCode(StatusCodes.Status500InternalServerError, $"Internal server error: {innerExceptionMessage}");
            }
        }


        [HttpPut("update/{noteId}")]
        public IActionResult Update (int noteId, [FromBody] Note updatedNote)
        {
            using (DataContext context = new DataContext())
            {
                var existingNote = context.Set<Note>().FirstOrDefault(n => n.Id == noteId);
                if (existingNote == null)
                {
                    return NotFound(); 
                }

                existingNote.baslik = updatedNote.baslik;
                existingNote.icerik = updatedNote.icerik;
                existingNote.yapildimi = updatedNote.yapildimi;
                existingNote.oncelik = updatedNote.oncelik;
                existingNote.notTarihi = DateTime.UtcNow;
                _noteManager.UpdateNote(existingNote);

                context.SaveChanges(); 

                return Ok(updatedNote); 
            }
        }



        [HttpGet("get-by-id/{noteId}")]
        public async Task<ActionResult<Note>> GetById(int noteId)
        {
            try
            {
                var note = await _noteManager.GetNotesById(noteId);
                if (note == null)
                {
                    return NotFound($"Note with ID {noteId} not found.");
                }

                return Ok(note);
            }
            catch (DbUpdateException ex)
            {
                var innerExceptionMessage = ex.InnerException?.Message;
                return StatusCode(StatusCodes.Status500InternalServerError, $"Internal server error: {innerExceptionMessage}");
            }
        }

        [HttpPut("inc-priority/{noteId}")]
        public async Task<IActionResult> IncreasePriority(int id)
        {
            using (var context = new DataContext())
            {
                var note = await context.Notes.FindAsync(id);

                if (note == null)
                {
                    return NotFound();
                }

                note.oncelik++;
                await context.SaveChangesAsync();

                return NoContent();
            }
        }


        [HttpGet("open-note/{noteId}")]
        public IActionResult OpenNote(int noteId)
        {
            using (DataContext context = new DataContext())
            {
                var note = context.Set<Note>().FirstOrDefault(n => n.Id == noteId);
                if (note == null)
                {
                    return NotFound();
                }
                return Ok(note);
            }
        }
        

        [HttpGet("get-my-notes")]
        public IActionResult MyNotes()
        {
            var notes = _noteManager.GetAllNotes();
            return Ok(notes);
        }




            










        //not arama

    }
 }
