/* =========================================================
   شرف ERP
   نظام إدارة الصيدليات
   نسخة محلية تجريبية - LocalStorage
========================================================= */


/* =========================================================
   DATABASE LOCAL
========================================================= */

const DB_KEY = "sharaf_erp_db_v1";

const defaultDB = {
    products: [],
    sales: [],
    purchases: [],
    customers: [],
    suppliers: [],
    settings: {
        name: "صيدلية شرف",
        phone: "",
        address: "",
        currency: "YER"
    }
};

let db = loadDB();

let saleLines = [];
let purchaseLines = [];


/* =========================================================
   BASIC
========================================================= */

function loadDB() {

    try {

        const raw = localStorage.getItem(DB_KEY);

        if (!raw) {
            return structuredClone(defaultDB);
        }

        const parsed = JSON.parse(raw);

        return {
            ...structuredClone(defaultDB),
            ...parsed,
            settings: {
                ...defaultDB.settings,
                ...(parsed.settings || {})
            }
        };

    } catch (error) {

        console.error(error);

        return structuredClone(defaultDB);
    }
}


function saveDB() {

    localStorage.setItem(
        DB_KEY,
        JSON.stringify(db)
    );
}


function money(value) {

    return Number(value || 0).toLocaleString(
        "ar-YE",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    );
}


function today() {

    const d = new Date();

    const y = d.getFullYear();

    const m = String(d.getMonth() + 1)
        .padStart(2, "0");

    const day = String(d.getDate())
        .padStart(2, "0");

    return `${y}-${m}-${day}`;
}


function escapeHTML(value) {

    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll( " , "&quot;")
        .replaceAll(" ", "&#039;");
}


function showToast(message) {

    const toast =
        document.getElementById("toast");

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}


function getNextNumber(prefix, list) {

    return (
        prefix +
        "-" +
        String(list.length + 1)
            .padStart(5, "0")
    );
}


/* =========================================================
   NAVIGATION
========================================================= */

const pageInfo = {

    dashboard: [
        "لوحة التحكم",
        "نظرة عامة على عمليات الصيدلية"
    ],

    sales: [
        "المبيعات",
        "إنشاء وإدارة فواتير البيع"
    ],

    purchases: [
        "المشتريات",
        "إنشاء وإدارة فواتير الشراء"
    ],

    products: [
        "الأصناف والأدوية",
        "إدارة قاعدة أصناف الصيدلية"
    ],

    inventory: [
        "المخزون",
        "الكميات والصلاحيات وحالة المخزون"
    ],

    customers: [
        "العملاء",
        "العملاء والأرصدة المدينة"
    ],

    suppliers: [
        "الموردون",
        "الموردون والأرصدة الدائنة"
    ],

    accounts: [
        "الحسابات",
        "ملخص الحركة المالية"
    ],

    reports: [
        "التقارير",
        "تقارير من البيانات المسجلة"
    ],

    settings: [
        "الإعدادات",
        "إعدادات الصيدلية والنظام"
    ]

};


function navigate(page) {

    document
        .querySelectorAll(".nav-item")
        .forEach(button => {

            button.classList.toggle(
                "active",
                button.dataset.page === page
            );

        });


    document
        .querySelectorAll(".page")
        .forEach(section => {

            section.classList.toggle(
                "active",
                section.id === `page-${page}`
            );

        });


    const info = pageInfo[page];

    if (info) {

        document.getElementById(
            "pageTitle"
        ).textContent = info[0];

        document.getElementById(
            "pageSubtitle"
        ).textContent = info[1];

    }


    refreshPage(page);
}


function setupNavigation() {

    document
        .querySelectorAll(".nav-item")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => navigate(button.dataset.page)
            );

        });

}


/* =========================================================
   REFRESH PAGE
========================================================= */

function refreshPage(page) {

    switch (page) {

        case "dashboard":
            renderDashboard();
            break;

        case "sales":
            prepareSaleScreen();
            renderSalesHistory();
            break;

        case "purchases":
            preparePurchaseScreen();
            renderPurchasesHistory();
            break;

        case "products":
            renderProducts();
            break;

        case "inventory":
            renderInventory();
            break;

        case "customers":
            renderCustomers();
            break;

        case "suppliers":
            renderSuppliers();
            break;

        case "accounts":
            renderAccounts();
            break;

        case "reports":
            renderReportsDefault();
            break;

        case "settings":
            loadSettingsForm();
            break;
    }
}


/* =========================================================
   PRODUCTS
========================================================= */

function setupProductForm() {

    const open =
        document.getElementById(
            "open-product-form"
        );

    const panel =
        document.getElementById(
            "product-form-panel"
        );

    const cancel =
        document.getElementById(
            "cancel-product"
        );

    const form =
        document.getElementById(
            "product-form"
        );


    open.addEventListener("click", () => {

        resetProductForm();

        panel.classList.remove("hidden");

    });


    cancel.addEventListener("click", () => {

        panel.classList.add("hidden");

    });


    form.addEventListener(
        "submit",
        event => {

            event.preventDefault();

            saveProduct();

        }
    );


    document
        .getElementById("product-search")
        .addEventListener(
            "input",
            renderProducts
        );


    document
        .getElementById("products-table")
        .addEventListener(
            "click",
            handleProductTableClick
        );

}


function resetProductForm() {

    document
        .getElementById("product-form")
        .reset();

    document
        .getElementById("product-id")
        .value = "";

    document
        .getElementById("product-quantity")
        .value = "0";

    document
        .getElementById("product-minimum")
        .value = "5";

    document
        .getElementById("product-form-panel")
        .classList.remove("hidden");

}


function saveProduct() {

    const id =
        document.getElementById(
            "product-id"
        ).value;


    const name =
        document.getElementById(
            "product-name"
        ).value.trim();


    const generic =
        document.getElementById(
            "product-generic"
        ).value.trim();


    const barcode =
        document.getElementById(
            "product-barcode"
        ).value.trim();


    const category =
        document.getElementById(
            "product-category"
        ).value.trim();


    const unit =
        document.getElementById(
            "product-unit"
        ).value;


    const purchasePrice =
        Number(
            document.getElementById(
                "product-purchase-price"
            ).value
        ) || 0;


    const salePrice =
        Number(
            document.getElementById(
                "product-sale-price"
            ).value
        ) || 0;


    const quantity =
        Number(
            document.getElementById(
               
