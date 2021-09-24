using ContactList.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

// Kontroler odpowiadający za pobieranie, dodawanie, usuwanie i edycję kontaktów

namespace ContactList.Controllers {
    //[Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ContactController : ControllerBase {
        private readonly ContactContext _db;
        public ContactController(ContactContext db) {
            _db = db;
        }

        [HttpGet]
        [Route("{id}")]
        public Contact Get(int id) {
            return _db.Contacts.Where(c => c.Id == id).Include(c => c.Category).FirstOrDefault();
        }

        [HttpPost]
        public async Task<ActionResult<Contact>> Post(Contact contact) {
            var categoryId = contact.Category.Id;
            var category = _db.Categories.FirstOrDefault(x => x.Id == categoryId);
            contact.Category = category;

            _db.Contacts.Add(contact);
            await _db.SaveChangesAsync();

            return CreatedAtAction(nameof(Get), new { id = contact.Id }, contact);
        }

        [HttpDelete]
        [Route("delete/{id}")]
        public async Task<IActionResult> Delete(int id) {
            var toDelete = await _db.Contacts.FindAsync(id);
            if (toDelete == null) {
                return NotFound();
            }
            _db.Contacts.Remove(toDelete);
            await _db.SaveChangesAsync();

            return NoContent();
        }

        [HttpPut]
        [Route("update/{id}")]
        public async Task<IActionResult> Update(int id, Contact contact) {
            if (id != contact.Id) {
                return BadRequest();
            }

            _db.Entry(contact).State = EntityState.Modified;

            try {
                await _db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException) {
                if (!ContactItemExists(id)) {
                    return NotFound();
                }
                else {
                    throw;
                }
            }

            return NoContent();
        }

        private bool ContactItemExists(int id) {
            return _db.Contacts.Any(x => x.Id == id);
        }
    }
}
