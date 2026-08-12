/* =====================================================
   شرف ERP
   نظام إدارة الصيدليات
   المرحلة الأولى من الوظائف
===================================================== */


/* =====================================================
   البيانات
===================================================== */

let products = [];

let sales = [];

let purchases = [];


/* =====================================================
   تحميل البيانات من LocalStorage
===================================================== */

function loadData() {

    try {

        products =
            JSON.parse(
                localStorage.getItem("sharaf_products") || "[]"
            );

        sales =
            JSON.parse(
                localStorage.getItem("sharaf_sales") || "[]"
            );

        purchases =
            JSON.parse(
                localStorage.getItem("sharaf_purchases") || "[]"
            );


        if (!Array.isArray(products)) {
            products = [];
        }

        if (!Array.isArray(sales)) {
            sales = [];
        }

        if (!Array.isArray(purchases)) {
            purchases = [];
        }

    } catch (error) {

        console.error(
            "حدث خطأ أثناء تحميل البيانات:",
            error
        );

        products = [];
        sales = [];
        purchases = [];
    }
}


/* =====================================================
   حفظ البيانات
===================================================== */

function saveData() {

    localStorage.setItem(
        "sharaf_products",
        JSON.stringify(products)
    );

    localStorage.setItem(
        "sharaf_sales",
        JSON.stringify(sales)
    );

    localStorage.setItem(
        "sharaf_purchases",
        JSON.stringify(purchases)
    );
}


/* =====================================================
   التنقل بين الصفحات
===================================================== */

const menuItems =
    document.querySelectorAll(".menu-item");

const sections =
    document.querySelectorAll(".page-section");


const pageTitles = {

    dashboard: {
        title: "لوحة التحكم",
        description: "نظرة عامة على عمليات الصيدلية"
    },

    sales: {
        title: "المبيعات",
        description: "إدارة فواتير مبيعات الصيدلية"
    },

    purchases: {
        title: "المشتريات",
        description: "إدارة فواتير الشراء والموردين"
    },

    products: {
        title: "الأصناف والأدوية",
        description: "إضافة وإدارة أصناف الصيدلية"
    },

    inventory: {
        title: "المخزون",
        description: "متابعة كميات الأصناف وحالة المخزون"
    },

    customers: {
        title: "العملاء",
        description: "إدارة العملاء والحسابات المدينة"
    },

    suppliers: {
        title: "الموردون",
        description: "إدارة الموردين والأرصدة والمشتريات"
    },

    accounts: {
        title: "الحسابات",
        description: "الإدارة المالية والحسابات"
    },

    reports: {
        title: "التقارير",
        description: "التقارير المالية والتشغيلية"
    },

    settings: {
        title: "الإعدادات",
        description: "إعدادات النظام والصيدلية"
    }

};


menuItems.forEach(button => {

    button.addEventListener("click", () => {

        const sectionId =
            button.dataset.section;


        /* إزالة الحالة من الأزرار */

        menuItems.forEach(item => {

            item.classList.remove("active");

        });


        /* إضافة الحالة للزر الحالي */

        button.classList.add("active");


        /* إخفاء جميع الصفحات */

        sections.forEach(section => {

            section.classList.remove(
                "active-section"
            );

        });


        /* إظهار الصفحة المطلوبة */

        const selectedSection =
            document.getElementById(sectionId);


        if (selectedSection) {

            selectedSection.classList.add(
                "active-section"
            );

        }


        /* تحديث عنوان الصفحة */

        updatePageHeader(sectionId);


        /* تحديث البيانات حسب الصفحة */

        if (sectionId === "dashboard") {

            updateDashboard();

        }

        if (sectionId === "products") {

            renderProducts();

        }

        if (sectionId === "inventory") {

            renderInventory();

        }

    });

});


/* =====================================================
   عنوان الصفحة
===================================================== */

function updatePageHeader(sectionId) {

    const config =
        pageTitles[sectionId];


    if (!config) {
        return;
    }


    document.getElementById(
        "pageTitle"
    ).textContent = config.title;


    document.getElementById(
        "pageDescription"
    ).textContent = config.description;

}


/* =====================================================
   نموذج إضافة صنف
===================================================== */

const openProductFormButton =
    document.getElementById(
        "openProductForm"
    );

const productFormPanel =
    document.getElementById(
        "productFormPanel"
    );

const cancelProductFormButton =
    document.getElementById(
        "cancelProductForm"
    );


openProductFormButton.addEventListener(
    "click",
    () => {

        productFormPanel.classList.remove(
            "hidden"
        );

        document.getElementById(
            "productName"
        ).focus();

    }
);


cancelProductFormButton.addEventListener(
    "click",
    () => {

        productFormPanel.classList.add(
            "hidden"
        );

        document.getElementById(
            "productForm"
        ).reset();

    }
);


/* =====================================================
   حفظ صنف جديد
===================================================== */

const productForm =
    document.getElementById(
        "productForm"
    );


productForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        const name =
            document.getElementById(
                "productName"
            ).value.trim();


        const barcode =
            document.getElementById(
                "productBarcode"
            ).value.trim();


        const category =
            document.getElementById(
                "productCategory"
            ).value.trim();


        const unit =
            document.getElementById(
                "productUnit"
            ).value;


        const purchasePrice =
            Number(
                document.getElementById(
                    "purchasePrice"
                ).value
            ) || 0;


        const salePrice =
            Number(
                document.getElementById(
                    "salePrice"
                ).value
            ) || 0;


        const quantity =
            Number(
                document.getElementById(
                    "productQuantity"
                ).value
            ) || 0;


        const minimumStock =
            Number(
                document.getElementById(
                    "minimumStock"
                ).value
            ) || 0;


        /* التحقق من الاسم */

        if (!name) {

            alert(
                "يجب إدخال اسم الصنف."
            );

            return;
        }


        /* منع تكرار الباركود */

        if (barcode) {

            const barcodeExists =
                products.some(
                    product =>
                        product.barcode === barcode
                );


            if (barcodeExists) {

                alert(
                    "هذا الباركود مستخدم بالفعل."
                );

                return;
            }

        }


        /* إنشاء الصنف */

        const product = {

            id: Date.now(),

            name: name,

            barcode: barcode,

            category: category,

            unit: unit,

            purchasePrice: purchasePrice,

            salePrice: salePrice,

            quantity: quantity,

            minimumStock: minimumStock,

            createdAt:
                new Date().toISOString()

        };


        /* إضافة الصنف */

        products.push(product);


        /* الحفظ */

        saveData();


        /* تنظيف النموذج */

        productForm.reset();


        document.getElementById(
            "productUnit"
        ).value = "علبة";


        document.getElementById(
            "productQuantity"
        ).value = 0;


        document.getElementById(
            "minimumStock"
        ).value = 5;


        /* إخفاء النموذج */

        productFormPanel.classList.add(
            "hidden"
        );


        /* تحديث الجدول */

        renderProducts();

        renderInventory();

        updateDashboard();


        alert(
            "تم حفظ الصنف بنجاح."
        );

    }
);


/* =====================================================
   عرض الأصناف
===================================================== */

function renderProducts(
    searchText = ""
) {

    const tbody =
        document.getElementById(
            "productsTableBody"
        );


    if (!tbody) {
        return;
    }


    const search =
        searchText
            .trim()
            .toLowerCase();


    const filteredProducts =
        products.filter(product => {

            const name =
                String(
                    product.name || ""
                ).toLowerCase();


            const barcode =
                String(
                    product.barcode || ""
                ).toLowerCase();


            return (
                name.includes(search) ||
                barcode.includes(search)
            );

        });


    if (filteredProducts.length === 0) {

        tbody.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    class="empty-table"
                >
                    لا توجد أصناف
                </td>

            </tr>

        `;

        return;
    }


    tbody.innerHTML =
        filteredProducts
            .map(
                (product, index) => {

                    let statusClass =
                        "status-good";

                    let statusText =
                        "متوفر";


                    if (
                        Number(product.quantity) <= 0
                    ) {

                        statusClass =
                            "status-empty";

                        statusText =
                            "نفد المخزون";

                    } else if (
                        Number(product.quantity) <=
                        Number(product.minimumStock)
                    ) {

                        statusClass =
                            "status-low";

                        statusText =
                            "منخفض";

                    }


                    return `

                        <tr>

                            <td>
                                ${index + 1}
                            </td>

                            <td>
                                ${escapeHtml(
                                    product.barcode || "-"
                                )}
                            </td>

                            <td>
                                <strong>
                                    ${escapeHtml(
                                        product.name
                                    )}
                                </strong>
                            </td>

                            <td>
                                ${escapeHtml(
                                    product.category || "-"
                                )}
                            </td>

                            <td>
                                ${Number(
                                    product.quantity
                                )}
                                ${escapeHtml(
                                    product.unit
                                )}
                            </td>

                            <td>
                                ${formatNumber(
                                    product.salePrice
                                )}
                            </td>

                            <td>

                                <span
                                    class="
                                        status
                                        ${statusClass}
                                    "
                                >
                                    ${statusText}
                                </span>

                            </td>

                        </tr>

                    `;

                }
            )
            .join("");

}


/* =====================================================
   البحث في الأصناف
===================================================== */

const productSearch =
    document.getElementById(
        "productSearch"
    );


productSearch.addEventListener(
    "input",
    event => {

        renderProducts(
            event.target.value
        );

    }
);


/* =====================================================
   عرض المخزون
===================================================== */

function renderInventory() {

    const tbody =
        document.getElementById(
            "inventoryTableBody"
        );


    if (!tbody) {
        return;
    }


    if (products.length === 0) {

        tbody.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    class="empty-table"
                >
                    لا توجد أصناف في المخزون
                </td>

            </tr>

        `;

        return;
    }


    tbody.innerHTML =
        products
            .map(product => {

                let statusClass =
                    "status-good";

                let statusText =
                    "متوفر";


                if (
                    Number(product.quantity) <= 0
                ) {

                    statusClass =
                        "status-empty";

                    statusText =
                        "نفد المخزون";

                } else if (
                    Number(product.quantity) <=
                    Number(product.minimumStock)
                ) {

                    statusClass =
                        "status-low";

                    statusText =
                        "منخفض";

                }


                const inventoryValue =
                    Number(product.quantity) *
                    Number(product.purchasePrice);


                return `

                    <tr>

                        <td>
                            <strong>
                                ${escapeHtml(
                                    product.name
                                )}
                            </strong>
                        </td>

                        <td>
                            ${escapeHtml(
                                product.barcode || "-"
                            )}
                        </td>

                        <td>
                            ${Number(
                                product.quantity
                            )}
                        </td>

                        <td>
                            ${Number(
                                product.minimumStock
                            )}
                        </td>

                        <td>

                            <span
                                class="
                                    status
                                    ${statusClass}
                                "
                            >
                                ${statusText}
                            </span>

                        </td>

                        <td>
                            ${formatNumber(
                                inventoryValue
                            )}
                        </td>

                    </tr>

                `;

            })
            .join("");

}


/* =====================================================
   لوحة التحكم
===================================================== */

function updateDashboard() {

    const productCount =
        document.getElementById(
            "productCount"
        );


    const lowStockCount =
        document.getElementById(
            "lowStockCount"
        );


    const todaySales =
        document.getElementById(
            "todaySales"
        );


    const todayPurchases =
        document.getElementById(
            "todayPurchases"
        );


    if (productCount) {

        productCount.textContent =
            products.length;

    }


    const lowStock =
        products.filter(
            product =>
                Number(product.quantity) <=
                Number(product.minimumStock)
        ).length;


    if (lowStockCount) {

        lowStockCount.textContent =
            lowStock;

    }


    const today =
        getToday();


    const salesTotal =
        sales
            .filter(
                sale =>
                    sale.date === today
            )
            .reduce(
                (sum, sale) =>
                    sum +
                    Number(sale.total || 0),
                0
            );


    const purchasesTotal =
        purchases
            .filter(
                purchase =>
                    purchase.date === today
            )
            .reduce(
                (sum, purchase) =>
                    sum +
                    Number(purchase.total || 0),
                0
            );


    if (todaySales) {

        todaySales.textContent =
            formatNumber(salesTotal);

    }


    if (todayPurchases) {

        todayPurchases.textContent =
            formatNumber(
                purchasesTotal
            );

    }


    renderStockAlerts();

    renderRecentSales();

}


/* =====================================================
   تنبيهات المخزون
===================================================== */

function renderStockAlerts() {

    const container =
        document.getElementById(
            "stockAlerts"
        );


    if (!container) {
        return;
    }


    const lowStockProducts =
        products.filter(
            product =>
                Number(product.quantity) <=
                Number(product.minimumStock)
        );


    if (lowStockProducts.length === 0) {

        container.innerHTML =
            "لا توجد تنبيهات";

        return;
    }


    container.innerHTML =
        lowStockProducts
            .slice(0, 10)
            .map(product => {

                return `

                    <div
                        class="alert-row"
                    >

                        <strong>
                            ${escapeHtml(
                                product.name
                            )}
                        </strong>

                        <span>
                            الكمية:
                            ${Number(
                                product.quantity
                            )}
                        </span>

                    </div>

                `;

            })
            .join("");

}


/* =====================================================
   آخر المبيعات
===================================================== */

function renderRecentSales() {

    const container =
        document.getElementById(
            "recentSales"
        );


    if (!container) {
        return;
    }


    if (sales.length === 0) {

        container.innerHTML =
            "لا توجد مبيعات حتى الآن";

        return;
    }


    container.innerHTML =
        sales
            .slice(-5)
            .reverse()
            .map(sale => {

                return `

                    <div
                        class="alert-row"
                    >

                        <strong>
                            فاتورة
                            ${escapeHtml(
                                sale.number || "-"
                            )}
                        </strong>

                        <span>
                            ${formatNumber(
                                sale.total
                            )}
                        </span>

                    </div>

                `;

            })
            .join("");

}


/* =====================================================
   أدوات مساعدة
===================================================== */

function getToday() {

    const now =
        new Date();

    const year =
        now.getFullYear();

    const month =
        String(
            now.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            now.getDate()
        ).padStart(2, "0");


    return `${year}-${month}-${day}`;

}


function formatNumber(value) {

    return Number(
        value || 0
    ).toLocaleString(
        "ar-YE",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    );

}


function escapeHtml(value) {

    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll( " , "&quot;")
        .replaceAll(" ", "&#039;");

}


/* =====================================================
   التشغيل الأول
===================================================== */

loadData();

renderProducts();

renderInventory();

updateDashboard();

updatePageHeader(
    "dashboard"
);
