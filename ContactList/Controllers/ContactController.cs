using ContactList.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ContactList.Controllers {
    [Authorize]
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
    }
}
