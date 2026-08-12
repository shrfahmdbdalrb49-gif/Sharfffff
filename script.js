console.log("شرف ERP يعمل");

document.addEventListener("DOMContentLoaded", function () {

    const menuItems = document.querySelectorAll(".menu-item");
    const sections = document.querySelectorAll(".page-section");
    const pageTitle = document.getElementById("pageTitle");

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

    function showPage(sectionId) {

        console.log("فتح الشاشة:", sectionId);

        sections.forEach(function (section) {
            section.classList.remove("active-section");
        });

        menuItems.forEach(function (item) {
            item.classList.remove("active");
        });

        const selectedSection =
            document.getElementById(sectionId);

        if (selectedSection) {
            selectedSection.classList.add("active-section");
        }

        const selectedMenu =
            document.querySelector(
                `.menu-item[data-page="${sectionId}"]`
            );

        if (selectedMenu) {
            selectedMenu.classList.add("active");
        }

        if (pageTitle && pageTitles[sectionId]) {
            pageTitle.textContent =
                pageTitles[sectionId];
        }

        if (
            sectionId === "accounts" &&
            typeof renderAccounts === "function"
        ) {
            renderAccounts();
        }

        if (
            sectionId === "products" &&
            typeof renderProducts === "function"
        ) {
            renderProducts();
        }

        if (
            sectionId === "dashboard" &&
            typeof updateDashboard === "function"
        ) {
            updateDashboard();
        }
    }

    menuItems.forEach(function (button) {

        button.addEventListener("click", function () {

            const sectionId =
                this.getAttribute("data-page");

            if (sectionId) {
                showPage(sectionId);
            }

        });

    });

    showPage("dashboard");

});
