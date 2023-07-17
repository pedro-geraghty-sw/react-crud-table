using k8ApiDemo.Models;
using Microsoft.AspNetCore.Mvc;

namespace k8ApiDemo.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductController : ControllerBase
    {
        private readonly ILogger<ProductController> logger;
        private readonly List<Product> products;

        public ProductController(ILogger<ProductController> logger, List<Product> products)
        {
            this.logger = logger;
            this.products = products;
        }

        [HttpGet]
        public IActionResult Get()
        {
            return Ok(this.products);
        }

        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            var existingProduct = this.products.FirstOrDefault(p => p.Id == id);
            if (existingProduct == null)
            {
                return NotFound();
            }
            return Ok(existingProduct);
        }

        [HttpPost]
        public IActionResult Post(string name)
        {
            var product_id = (this.products.Count == 0) ? 1 : this.products.Max(p => p.Id) + 1;
            var product = new Product() { Id = product_id, Name = name };
            this.products.Add(product);
            return Ok(product);
        }

        [HttpPut("{id}")]
        public IActionResult Put(int id, string name)
        {
            var existingProduct = this.products.FirstOrDefault(p => p.Id == id);
            if (existingProduct == null)
            {
                return NotFound();
            }
            existingProduct.Name = name;
            return Ok(existingProduct);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var existingProduct = this.products.FirstOrDefault(p => p.Id == id);
            if (existingProduct == null)
            {
                return NotFound();
            }
            this.products.Remove(existingProduct);
            return Ok();
        }
    }
}