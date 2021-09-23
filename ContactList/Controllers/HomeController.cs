using ContactList.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ContactList.Controllers {
    [ApiController]
    [Route("api/[controller]")]
    public class HomeController : ControllerBase {
        private readonly ContactContext _db;

        public HomeController(ContactContext db) {
            _db = db;
        }

        [HttpGet]
        public IEnumerable<Contact> Get() {
            return _db.Contacts.ToArray();
        }

    }
}
