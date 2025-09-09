import { Link, Outlet, useLocation } from "react-router-dom";
export default function AdminDashboard() {
  const location = useLocation();

  const menuItems = [
    { name: "Home", path: "/admin/home" },
    { name: "FAQ", path: "/admin/faq" },
    { name: "Category", path: "/admin/category" },
    { name: "Sub-Category", path: "/admin/subCategory" },
    { name: "Product", path: "/admin/product" },
    { name: "Review", path: "/admin/review" },
    { name: "Service", path: "/admin/service" },
    { name: "Eye Check", path: "/admin/eyeCheck" },
    { name: "Vendor", path: "/admin/vendor" },
    { name: "Company", path: "/admin/company" },
    // { name: "Register", path: "/admin/register" },
    { name: "Testimonial", path: "/admin/testimonials" },
    { name: "Eyewear Tips", path: "/admin/eyewearTips" },
    { name: "Inquiries", path: "/admin/inquiries" },
    { name: "Disclaimer", path: "/admin/disclaimer" },
    { name: "Eye Services", path: "/admin/eye-services" }

  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg p-5">
        {/* <h2 className="text-xl font-bold mb-6"></h2> */}
        <nav className="space-y-2 text-center text-lg font-semibold mt-4">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`border-b-1 block px-4 py-2 rounded hover:bg-red-500 hover:text-white ${location.pathname === item.path
                ? "bg-red-500 text-white"
                : "text-gray-700"
                }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Page Content */}
        <main className="flex-1 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
