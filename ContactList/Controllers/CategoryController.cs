using ContactList.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

// Kontroler odpowiadający za pobieranie kategorii

namespace ContactList.Controllers {
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class CategoryController : ControllerBase {
        private readonly ContactContext _db;
        public CategoryController(ContactContext db) {
            _db = db;
        }

        // Metoda zwracająca kategorie
        [HttpGet]
        public IEnumerable<Category> Get() {
            return _db.Categories.ToArray();
        }
    }
}
