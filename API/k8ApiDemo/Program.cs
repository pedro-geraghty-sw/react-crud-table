using k8ApiDemo.Models;

namespace k8ApiDemo
{
    public class Program
    {
        public const string corsPolicyName = "Allow_All_Policy";

        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            builder.Services.AddSingleton<List<Product>>(provider =>
            {
                var products = new List<Product>();
                products.Add(new Product { Id = 1, Name = "Product 1" });
                products.Add(new Product { Id = 2, Name = "Product 2" });
                return products;
            });
            builder.Services.AddCors(options =>
            {
                options.AddPolicy(name: corsPolicyName,
                    policy =>
                    {
                        policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
                    });
            });
            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();

            var app = builder.Build();
            app.UseCors(corsPolicyName);
            app.UseAuthorization();
            app.MapControllers();
            app.Run();
        }
    }
}