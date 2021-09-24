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
            _db.Contacts.Add(contact);
            await _db.SaveChangesAsync();

            return CreatedAtAction(nameof(Get), new { id = contact.Id }, contact);
        }

        [HttpDelete]
        [Route("delete/{id}")]
        public string Delete(int id) {
            var toDelete = _db.Contacts.Where(x => x.Id == id).FirstOrDefault();
            if (toDelete == null) {
                return "Contact doesn't exist";
            }
            _db.Contacts.Remove(toDelete);
            _db.SaveChanges();

            return "Contact deleted";
        }
    }
}
