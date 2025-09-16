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
    // { name: "Service", path: "/admin/service" },
    { name: "Eye Check", path: "/admin/eyeCheck" },
    { name: "Vendor", path: "/admin/vendor" },
    { name: "Company", path: "/admin/company" },
    { name: "Testimonial", path: "/admin/testimonials" },
    { name: "Eyewear Tips", path: "/admin/eyewearTips" },
    { name: "Inquiries", path: "/admin/inquiries" },
    { name: "Disclaimer", path: "/admin/disclaimer" },
    { name: "Eye Services", path: "/admin/eye-services" },
    { name: "Contact Lens", path: "/admin/contact-lens" }
  ];

  return (
    <div className="flex bg-gray-100">
      {/* Sidebar */}
      <div className="fixed left-0 h-screen w-64 bg-white shadow-lg p-5 pt-20 overflow-y-auto">
        <nav className="space-y-2 text-center text-lg font-semibold mt-10 ">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block px-4 py-2 rounded border-b border-gray-200 hover:bg-red-500 hover:text-white ${location.pathname === item.path
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
      <div className="flex-1 ml-64 flex flex-col pt-20">
        <main className="flex-1 p-6 pt-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
