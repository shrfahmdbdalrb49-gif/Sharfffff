console.log("شرف ERP يعمل");

const menuItems = document.querySelectorAll(".menu-item");
const sections = document.querySelectorAll(".page-section");

const pageTitles = {
    dashboard: "لوحة التحكم",
    sales: "المبيعات",
    purchases: "المشتريات",
    products: "الأصناف والأدوية",
    inventory: "المخزون",
    customers: "العملاء",
    suppliers: "الموردون",
    accounts: "الحسابات",
    reports: "التقارير",
    settings: "الإعدادات"
};

menuItems.forEach(function(button) {

    button.addEventListener("click", function() {

        const sectionId = button.dataset.section;

        console.log("تم الضغط:", sectionId);

        menuItems.forEach(function(item) {
            item.classList.remove("active");
        });

        button.classList.add("active");

        sections.forEach(function(section) {
            section.classList.remove("active-section");
        });

        const section = document.getElementById(sectionId);

        if (section) {
            section.classList.add("active-section");
        }

        const title = document.getElementById("pageTitle");

        if (title && pageTitles[sectionId]) {
            title.textContent = pageTitles[sectionId];
        }

    });

});
