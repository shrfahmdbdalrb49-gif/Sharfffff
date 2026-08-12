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

        /*
         * إخفاء جميع الشاشات
         */
        sections.forEach(function (section) {
            section.classList.remove("active-section");
        });


        /*
         * إزالة التحديد من القوائم
         */
        menuItems.forEach(function (item) {
            item.classList.remove("active");
        });


        /*
         * إظهار الشاشة المطلوبة
         */
        const selectedSection =
            document.getElementById(sectionId);

        if (selectedSection) {
            selectedSection.classList.add("active-section");
        } else {
            console.error(
                "الشاشة غير موجودة:",
                sectionId
            );
        }


        /*
         * تحديد القائمة الحالية
         */
        const selectedMenu =
            document.querySelector(
                `.menu-item[data-section="${sectionId}"]`
            );

        if (selectedMenu) {
            selectedMenu.classList.add("active");
        }


        /*
         * تغيير عنوان الصفحة
         */
        if (
            pageTitle &&
            pageTitles[sectionId]
        ) {
            pageTitle.textContent =
                pageTitles[sectionId];
        }


        /*
         * إذا فتحنا الحسابات،
         * نبني شاشة شجرة الحسابات
         */
        if (
            sectionId === "accounts" &&
            typeof buildAccountsPage === "function"
        ) {
            buildAccountsPage();
        }

    }


    /*
     * تشغيل جميع أزرار القائمة
     */
    menuItems.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                const sectionId =
                    this.getAttribute(
                        "data-section"
                    );

                if (sectionId) {
                    showPage(sectionId);
                }

            }
        );

    });


    /*
     * تشغيل لوحة التحكم عند فتح النظام
     */
    showPage("dashboard");

});
