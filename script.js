/* =====================================================
   شرف ERP
   نظام إدارة الصيدليات
   إدارة الأصناف والأدوية
===================================================== */


/* =====================================================
   البيانات
===================================================== */

let products = [];


/* =====================================================
   تحميل الأصناف المحفوظة
===================================================== */

function loadProducts() {

    try {

        const saved =
            localStorage.getItem("sharaf_products");

        if (saved) {

            products = JSON.parse(saved);

        } else {

            products = [];

        }

        if (!Array.isArray(products)) {

            products = [];

        }

    } catch (error) {

        console.error(
            "خطأ في تحميل الأصناف:",
            error
        );

        products = [];

    }

}


/* =====================================================
   حفظ الأصناف
===================================================== */

function saveProducts() {

    localStorage.setItem(
        "sharaf_products",
        JSON.stringify(products)
    );

}


/* =====================================================
   أدوات مساعدة
===================================================== */

function formatNumber(number) {

    return Number(number || 0).toLocaleString(
        "ar-YE",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    );

}


function escapeHTML(value) {

    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll( " , "&quot;")
        .replaceAll(" ", "&#039;");

}


/* =====================================================
   التنقل بين الشاشات
===================================================== */

function setupNavigation() {

    const menuItems =
        document.querySelectorAll(
            ".menu-item"
        );

    const sections =
        document.querySelectorAll(
            ".page-section"
        );

    const pageTitle =
        document.getElementById(
            "pageTitle"
        );


    const pageTitles = {

        dashboard:
            "لوحة التحكم",

        sales:
            "المبيعات",

        purchases:
            "المشتريات",

        products:
            "الأصناف والأدوية",

        inventory:
            "المخزون",

        customers:
            "العملاء",

        suppliers:
            "الموردون",

        accounts:
            "الحسابات",

        reports:
            "التقارير",

        settings:
            "الإعدادات"

    };


    menuItems.forEach(
        function(button) {

            button.addEventListener(
                "click",
                function() {

                    const sectionId =
                        this.dataset.section;


                    menuItems.forEach(
                        function(item) {

                            item.classList.remove(
                                "active"
                            );

                        }
                    );


                    this.classList.add(
                        "active"
                    );


                    sections.forEach(
                        function(section) {

                            section.classList.remove(
                                "active-section"
                            );

                        }
                    );


                    const section =
                        document.getElementById(
                            sectionId
                        );


                    if (section) {

                        section.classList.add(
                            "active-section"
                        );

                    }


                    if (
                        pageTitle &&
                        pageTitles[sectionId]
                    ) {

                        pageTitle.textContent =
                            pageTitles[sectionId];

                    }


                    /* تحديث الشاشة */

                    if (
                        sectionId ===
                        "products"
                    ) {

                        renderProducts();

                    }


                    if (
                        sectionId ===
                        "inventory"
                    ) {

                        renderInventory();

                    }


                    if (
                        sectionId ===
                        "dashboard"
                    ) {

                        updateDashboard();

                    }

                }
            );

        }
    );

}


/* =====================================================
   شاشة الأصناف
===================================================== */

function setupProductForm() {

    const openButton =
        document.getElementById(
            "openProductForm"
        );

    const formPanel =
        document.getElementById(
            "productFormPanel"
        );

    const cancelButton =
        document.getElementById(
            "cancelProductForm"
        );

    const form =
        document.getElementById(
            "productForm"
        );


    /*
       إذا كانت عناصر نموذج الأصناف
       غير موجودة في index.html
       لا نفعل شيئًا.
    */

    if (
        !openButton ||
        !formPanel ||
        !cancelButton ||
        !form
    ) {

        return;

    }


    /* فتح النموذج */

    openButton.addEventListener(
        "click",
        function() {

            formPanel.classList.remove(
                "hidden"
            );

            const nameInput =
                document.getElementById(
                    "productName"
                );

            if (nameInput) {

                nameInput.focus();

            }

        }
    );


    /* إلغاء */

    cancelButton.addEventListener(
        "click",
        function() {

            form.reset();

            formPanel.classList.add(
                "hidden"
            );

        }
    );


    /* حفظ الصنف */

    form.addEventListener(
        "submit",
        function(event) {

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


            /* التحقق */

            if (!name) {

                alert(
                    "أدخل اسم الصنف."
                );

                return;

            }


            /* منع تكرار الباركود */

            if (barcode) {

                const duplicate =
                    products.some(
                        function(product) {

                            return (
                                product.barcode ===
                                barcode
                            );

                        }
                    );


                if (duplicate) {

                    alert(
                        "هذا الباركود موجود بالفعل."
                    );

                    return;

                }

            }


            /* إنشاء الصنف */

            const product = {

                id:
                    Date.now(),

                name:
                    name,

                barcode:
                    barcode,

                category:
                    category,

                unit:
                    unit,

                purchasePrice:
                    purchasePrice,

                salePrice:
                    salePrice,

                quantity:
                    quantity,

                minimumStock:
                    minimumStock,

                createdAt:
                    new Date().toISOString()

            };


            products.push(
                product
            );


            saveProducts();


            form.reset();


            formPanel.classList.add(
                "hidden"
            );


            renderProducts();

            renderInventory();

            updateDashboard();


            alert(
                "تم حفظ الصنف بنجاح."
            );

        }
    );

}


/* =====================================================
   عرض الأصناف
===================================================== */

function renderProducts(
    search = ""
) {

    const table =
        document.getElementById(
            "productsTableBody"
        );


    if (!table) {

        return;

    }


    const keyword =
        search
            .trim()
            .toLowerCase();


    const filtered =
        products.filter(
            function(product) {

                const name =
                    String(
                        product.name || ""
                    ).toLowerCase();


                const barcode =
                    String(
                        product.barcode || ""
                    ).toLowerCase();


                return (
                    name.includes(keyword) ||
                    barcode.includes(keyword)
                );

            }
        );


    if (filtered.length === 0) {

        table.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    class="empty-table"
                >
                    لا توجد أصناف مسجلة
                </td>

            </tr>

        `;

        return;

    }


    table.innerHTML =
        filtered
            .map(
                function(product, index) {

                    let status =
                        "متوفر";

                    let statusClass =
                        "status-good";


                    if (
                        Number(
                            product.quantity
                        ) <= 0
                    ) {

                        status =
                            "نفد المخزون";

                        statusClass =
                            "status-empty";

                    }

                    else if (
                        Number(
                            product.quantity
                        ) <=
                        Number(
                            product.minimumStock
                        )
                    ) {

                        status =
                            "منخفض";

                        statusClass =
                            "status-low";

                    }


                    return `

                        <tr>

                            <td>
                                ${index + 1}
                            </td>

                            <td>
                                ${escapeHTML(
                                    product.barcode || "-"
                                )}
                            </td>

                            <td>
                                <strong>
                                    ${escapeHTML(
                                        product.name
                                    )}
                                </strong>
                            </td>

                            <td>
                                ${escapeHTML(
                                    product.category || "-"
                                )}
                            </td>

                            <td>
                                ${Number(
                                    product.quantity
                                )}
                                ${escapeHTML(
                                    product.unit || ""
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
                                    ${status}
                                </span>

                            </td>

                        </tr>

                    `;

                }
            )
            .join("");

}


/* =====================================================
   البحث عن صنف
===================================================== */

function setupProductSearch() {

    const searchInput =
        document.getElementById(
            "productSearch"
        );


    if (!searchInput) {

        return;

    }


    searchInput.addEventListener(
        "input",
        function() {

            renderProducts(
                this.value
            );

        }
    );

}


/* =====================================================
   المخزون
===================================================== */

function renderInventory() {

    const table =
        document.getElementById(
            "inventoryTableBody"
        );


    if (!table) {

        return;

    }


    if (products.length === 0) {

        table.innerHTML = `

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


    table.innerHTML =
        products
            .map(
                function(product) {

                    let status =
                        "متوفر";

                    let statusClass =
                        "status-good";


                    if (
                        Number(
                            product.quantity
                        ) <= 0
                    ) {

                        status =
                            "نفد المخزون";

                        statusClass =
                            "status-empty";

                    }

                    else if (
                        Number(
                            product.quantity
                        ) <=
                        Number(
                            product.minimumStock
                        )
                    ) {

                        status =
                            "منخفض";

                        statusClass =
                            "status-low";

                    }


                    const value =
                        Number(
                            product.quantity
                        ) *
                        Number(
                            product.purchasePrice
                        );


                    return `

                        <tr>

                            <td>
                                <strong>
                                    ${escapeHTML(
                                        product.name
                                    )}
                                </strong>
                            </td>

                            <td>
                                ${escapeHTML(
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
                                    ${status}
                                </span>

                            </td>

                            <td>
                                ${formatNumber(
                                    value
                                )}
                            </td>

                        </tr>

                    `;

                }
            )
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


    if (productCount) {

        productCount.textContent =
            products.length;

    }


    const lowStock =
        products.filter(
            function(product) {

                return (
                    Number(
                        product.quantity
                    ) <=
                    Number(
                        product.minimumStock
                    )
                );

            }
        ).length;


    if (lowStockCount) {

        lowStockCount.textContent =
            lowStock;

    }

}


/* =====================================================
   تشغيل النظام
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        loadProducts();

        setupNavigation();

        setupProductForm();

        setupProductSearch();

        renderProducts();

        renderInventory();

        updateDashboard();

        console.log(
            "شرف ERP جاهز للعمل"
        );

    }
);
