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
                "product-quantity"
            ).value
        ) || 0;


    const minimum =
        Number(
            document.getElementById(
                "product-minimum"
            ).value
        ) || 0;


    const expiry =
        document.getElementById(
            "product-expiry"
        ).value;


    const batch =
        document.getElementById(
            "product-batch"
        ).value.trim();


    if (!name) {

        alert("اسم الصنف مطلوب.");

        return;
    }


    const duplicate = db.products.find(
        product =>
            barcode &&
            product.barcode === barcode &&
            String(product.id) !== String(id)
    );


    if (duplicate) {

        alert(
            "هذا الباركود مستخدم لصنف آخر."
        );

        return;
    }


    if (id) {

        const product =
            db.products.find(
                p => String(p.id) === String(id)
            );


        if (!product) {
            alert("الصنف غير موجود.");
            return;
        }


        /*
           عند التعديل لا نسمح بتغيير الكمية
           من شاشة الصنف لاحقًا إذا أردنا
           مخزونًا مضبوطًا، لكن حاليًا نسمح
           بها لأننا في النسخة المحلية الأساسية.
        */

        product.name = name;
        product.generic = generic;
        product.barcode = barcode;
        product.category = category;
        product.unit = unit;
        product.purchasePrice = purchasePrice;
        product.salePrice = salePrice;
        product.quantity = quantity;
        product.minimum = minimum;
        product.expiry = expiry;
        product.batch = batch;

        showToast("تم تعديل الصنف.");

    } else {

        db.products.push({

            id: Date.now(),

            name,
            generic,
            barcode,
            category,
            unit,

            purchasePrice,
            salePrice,

            quantity,
            minimum,

            expiry,
            batch,

            createdAt:
                new Date().toISOString()

        });

        showToast("تم إضافة الصنف.");

    }


    saveDB();

    document
        .getElementById(
            "product-form-panel"
        )
        .classList.add("hidden");


    renderProducts();

    renderInventory();

    renderDashboard();

    refreshSelects();

}


function renderProducts() {

    const tbody =
        document.getElementById(
            "products-table"
        );


    const search =
        document.getElementById(
            "product-search"
        ).value
            .trim()
            .toLowerCase();


    const list =
        db.products.filter(product => {

            return (
                product.name
                    .toLowerCase()
                    .includes(search) ||

                String(product.barcode || "")
                    .toLowerCase()
                    .includes(search) ||

                String(product.generic || "")
                    .toLowerCase()
                    .includes(search)
            );

        });


    if (!list.length) {

        tbody.innerHTML = `
            <tr>
                <td colspan="9" class="empty-row">
                    لا توجد أصناف مسجلة
                </td>
            </tr>
        `;

        return;
    }


    tbody.innerHTML =
        list.map(product => {

            const status =
                getProductStatus(product);


            return `
                <tr>

                    <td>
                        ${escapeHTML(
                            product.barcode || "-"
                        )}
                    </td>

                    <td>
                        <strong>
                            ${escapeHTML(product.name)}
                        </strong>
                    </td>

                    <td>
                        ${escapeHTML(
                            product.generic || "-"
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            product.category || "-"
                        )}
                    </td>

                    <td>
                        ${product.quantity}
                        ${escapeHTML(product.unit)}
                    </td>

                    <td>
                        ${money(product.salePrice)}
                    </td>

                    <td>
                        ${escapeHTML(product.expiry || "-")}
                    </td>

                    <td>
                        <span class="status ${status.class}">
                            ${status.text}
                        </span>
                    </td>

                    <td>

                        <div class="action-group">

                            <button
                                class="action-button action-edit"
                                data-action="edit"
                                data-id="${product.id}"
                            >
                                تعديل
                            </button>

                            <button
                                class="action-button action-delete"
                                data-action="delete"
                                data-id="${product.id}"
                            >
                                حذف
                            </button>

                        </div>

                    </td>

                </tr>
            `;

        }).join("");

}


function handleProductTableClick(event) {

    const button =
        event.target.closest("button");


    if (!button) return;


    const id = button.dataset.id;

    const action = button.dataset.action;


    if (action === "edit") {

        editProduct(id);

    }


    if (action === "delete") {

        deleteProduct(id);

    }

}


function editProduct(id) {

    const product =
        db.products.find(
            p => String(p.id) === String(id)
        );


    if (!product) return;


    document.getElementById(
        "product-id"
    ).value = product.id;


    document.getElementById(
        "product-name"
    ).value = product.name;


    document.getElementById(
        "product-generic"
    ).value = product.generic || "";


    document.getElementById(
        "product-barcode"
    ).value = product.barcode || "";


    document.getElementById(
        "product-category"
    ).value = product.category || "";


    document.getElementById(
        "product-unit"
    ).value = product.unit || "علبة";


    document.getElementById(
        "product-purchase-price"
    ).value = product.purchasePrice;


    document.getElementById(
        "product-sale-price"
    ).value = product.salePrice;


    document.getElementById(
        "product-quantity"
    ).value = product.quantity;


    document.getElementById(
        "product-minimum"
    ).value = product.minimum;


    document.getElementById(
        "product-expiry"
    ).value = product.expiry || "";


    document.getElementById(
        "product-batch"
    ).value = product.batch || "";


    document.getElementById(
        "product-form-panel"
    ).classList.remove("hidden");

}


function deleteProduct(id) {

    const product =
        db.products.find(
            p => String(p.id) === String(id)
        );


    if (!product) return;


    const ok =
        confirm(
            `هل تريد حذف الصنف "${product.name}"؟`
        );


    if (!ok) return;


    db.products =
        db.products.filter(
            p => String(p.id) !== String(id)
        );


    saveDB();

    renderProducts();

    renderInventory();

    renderDashboard();

    refreshSelects();

    showToast("تم حذف الصنف.");

}


function getProductStatus(product) {

    if (Number(product.quantity) <= 0) {

        return {
            class: "out",
            text: "نافد"
        };
    }


    if (
        Number(product.minimum) > 0 &&
        Number(product.quantity) <=
        Number(product.minimum)
    ) {

        return {
            class: "low",
            text: "منخفض"
        };
    }


    if (isExpired(product.expiry)) {

        return {
            class: "expired",
            text: "منتهي"
        };
    }


    return {
        class: "good",
        text: "متوفر"
    };
}


function isExpired(dateString) {

    if (!dateString) return false;

    const date =
        new Date(dateString + "T23:59:59");

    return date < new Date();
}


/* =========================================================
   INVENTORY
========================================================= */

function renderInventory() {

    const tbody =
        document.getElementById(
            "inventory-table"
        );


    tbody.innerHTML = "";


    const total =
        db.products.length;


    const low =
        db.products.filter(
            p =>
                Number(p.quantity) > 0 &&
                Number(p.quantity) <= Number(p.minimum)
        ).length;


    const out =
        db.products.filter(
            p =>
                Number(p.quantity) <= 0
        ).length;


    const expired =
        db.products.filter(
            p =>
                isExpired(p.expiry)
        ).length;


    document.getElementById(
        "inventory-product-count"
    ).textContent = total;


    document.getElementById(
        "inventory-low-count"
    ).textContent = low;


    document.getElementById(
        "inventory-out-count"
    ).textContent = out;


    document.getElementById(
        "inventory-expired-count"
    ).textContent = expired;


    if (!db.products.length) {

        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="empty-row">
                    لا توجد أصناف
                </td>
            </tr>
        `;

        return;
    }


    tbody.innerHTML =
        db.products.map(product => {

            const status =
                getProductStatus(product);


            const value =
                Number(product.quantity) *
                Number(product.purchasePrice);


            return `
                <tr>

                    <td>
                        <strong>
                            ${escapeHTML(product.name)}
                        </strong>
                    </td>

                    <td>
                        ${escapeHTML(
                            product.barcode || "-"
                        )}
                    </td>

                    <td>${product.quantity}</td>

                    <td>${product.minimum}</td>

                    <td>${money(product.purchasePrice)}</td>

                    <td>${money(value)}</td>

                    <td>${escapeHTML(product.expiry || "-")}</td>

                    <td>
                        <span class="status ${status.class}">
                            ${status.text}
                        </span>
                    </td>

                </tr>
            `;

        }).join("");

}


/* =========================================================
   SALES
========================================================= */

function prepareSaleScreen() {

    document.getElementById(
        "sale-number"
    ).value =
        getNextNumber("SAL", db.sales);


    document.getElementById(
        "sale-date"
    ).value = today();


    renderSaleLines();

    refreshSelects();

}


function setupSales() {

    document
        .getElementById("add-sale-line")
        .addEventListener(
            "click",
            addSaleLine
        );


    document
        .getElementById("save-sale")
        .addEventListener(
            "click",
            saveSale
        );


    document
        .getElementById("sale-discount")
        .addEventListener(
            "input",
            renderSaleLines
        );


    document
        .getElementById("sale-lines")
        .addEventListener(
            "click",
            event => {

                const button =
                    event.target.closest(
                        ".delete-line"
                    );

                if (!button) return;

                const index =
                    Number(button.dataset.index);

                saleLines.splice(
                    index,
                    1
                );

                renderSaleLines();

            }
        );

}


function addSaleLine() {

    const productId =
        document.getElementById(
            "sale-product"
        ).value;


    const qty =
        Number(
            document.getElementById(
                "sale-qty"
            ).value
        );


    const product =
        db.products.find(
            p => String(p.id) === String(productId)
        );


    if (!product) {

        alert("اختر صنفًا.");

        return;
    }


    if (qty <= 0) {

        alert("الكمية يجب أن تكون أكبر من صفر.");

        return;
    }


    const existing =
        saleLines.find(
            line =>
                String(line.productId) ===
                String(productId)
        );


    const existingQty =
        existing
            ? Number(existing.quantity)
            : 0;


    if (
        existingQty + qty >
        Number(product.quantity)
    ) {

        alert(
            `الكمية المتاحة من ${product.name} هي ${product.quantity}.`
        );

        return;
    }


    if (existing) {

        existing.quantity += qty;

    } else {

        saleLines.push({

            productId:
                product.id,

            quantity:
                qty,

            price:
                Number(product.salePrice)

        });

    }


    document.getElementById(
        "sale-qty"
    ).value = 1;


    renderSaleLines();

}


function renderSaleLines() {

    const tbody =
        document.getElementById(
            "sale-lines"
        );


    if (!saleLines.length) {

        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="empty-row">
                    لم تتم إضافة أصناف للفاتورة
                </td>
            </tr>
        `;

    } else {

        tbody.innerHTML =
            saleLines.map(
                (line, index) => {

                    const product =
                        db.products.find(
                            p =>
                                String(p.id) ===
                                String(line.productId)
                        );


                    const total =
                        Number(line.quantity) *
                        Number(line.price);


                    return `
                        <tr>

                            <td>
                                ${escapeHTML(
                                    product?.name || "محذوف"
                                )}
                            </td>

                            <td>
                                ${line.quantity}
                            </td>

                            <td>
                                ${money(line.price)}
                            </td>

                            <td>
                                ${money(total)}
                            </td>

                            <td>
                                <button
                                    class="delete-line"
                                    data-index="${index}"
                                >
                                    حذف
                                </button>
                            </td>

                        </tr>
                    `;

                }
            ).join("");

    }


    const subtotal =
        saleLines.reduce(
            (sum, line) =>
                sum +
                Number(line.quantity) *
                Number(line.price),
            0
        );


    const discount =
        Number(
            document.getElementById(
                "sale-discount"
            ).value
        ) || 0;


    const total =
        Math.max(
            0,
            subtotal - discount
        );


    document.getElementById(
        "sale-total"
    ).textContent =
        money(total);

}


function saveSale() {

    if (!saleLines.length) {

        alert(
            "أضف صنفًا واحدًا على الأقل."
        );

        return;
    }


    const payment =
        document.getElementById(
            "sale-payment"
        ).value;


    const customerId =
        document.getElementById(
            "sale-customer"
        ).value;


    const date =
        document.getElementById(
            "sale-date"
        ).value ||
        today();


    const discount =
        Number(
            document.getElementById(
                "sale-discount"
            ).value
        ) || 0;


    const subtotal =
        saleLines.reduce(
            (sum, line) =>
                sum +
                Number(line.quantity) *
                Number(line.price),
            0
        );


    const total =
        Math.max(
            0,
            subtotal - discount
        );


    /*
       تحقق أخير من المخزون قبل الاعتماد
    */

    for (const line of saleLines) {

        const product =
            db.products.find(
                p =>
                    String(p.id) ===
                    String(line.productId)
            );


        if (!product) {

            alert(
                "يوجد صنف غير موجود في الفاتورة."
            );

            return;
        }


        if (
            Number(line.quantity) >
            Number(product.quantity)
        ) {

            alert(
                `المخزون غير كافٍ للصنف ${product.name}.`
            );

            return;
        }

    }


    const sale = {

        id:
            Date.now(),

        number:
            getNextNumber("SAL", db.sales),

        date,

        customerId:
            customerId || "",

        payment,

        lines:
            structuredClone(saleLines),

        subtotal,

        discount,

        total,

        createdAt:
            new Date().toISOString()

    };


    /*
       خصم المخزون
    */

    saleLines.forEach(line => {

        const product =
            db.products.find(
                p =>
                    String(p.id) ===
                    String(line.productId)
            );


        product.quantity -=
            Number(line.quantity);

    });


    db.sales.push(sale);

    saveDB();


    saleLines = [];


    document.getElementById(
        "sale-discount"
    ).value = 0;


    prepareSaleScreen();

    renderSalesHistory();

    renderInventory();

    renderDashboard();


    showToast(
        "تم اعتماد فاتورة البيع وتحديث المخزون."
    );

}


function renderSalesHistory() {

    const tbody =
        document.getElementById(
            "sales-history"
        );


    if (!db.sales.length) {

        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="empty-row">
                    لا توجد فواتير بيع
                </td>
            </tr>
        `;

        return;
    }


    tbody.innerHTML =
        [...db.sales]
            .reverse()
            .map(sale => {

                const customer =
                    db.customers.find(
                        c =>
                            String(c.id) ===
                            String(sale.customerId)
                    );


                const paymentText =
                    sale.payment === "credit"
                        ? "آجل"
                        : "نقدي";


                return `
                    <tr>
                        <td>${escapeHTML(sale.number)}</td>
                        <td>${escapeHTML(sale.date)}</td>
                        <td>${escapeHTML(customer?.name || "عميل نقدي")}</td>
                        <td>${paymentText}</td>
                        <td>${money(sale.total)}</td>
                    </tr>
                `;

            }).join("");

}


/* =========================================================
   PURCHASES
========================================================= */

function preparePurchaseScreen() {

    document.getElementById(
        "purchase-number"
    ).value =
        getNextNumber(
            "PUR",
            db.purchases
        );


    document.getElementById(
        "purchase-date"
    ).value = today();


    renderPurchaseLines();

    refreshSelects();

}


function setupPurchases() {

    document
        .getElementById("add-purchase-line")
        .addEventListener(
            "click",
            addPurchaseLine
        );


    document
        .getElementById("save-purchase")
        .addEventListener(
            "click",
            savePurchase
        );


    document
        .getElementById("purchase-discount")
        .addEventListener(
            "input",
            renderPurchaseLines
        );


    document
        .getElementById("purchase-product")
        .addEventListener(
            "change",
            fillPurchasePrice
        );


    document
        .getElementById("purchase-lines")
        .addEventListener(
            "click",
            event => {

                const button =
                    event.target.closest(
                        ".delete-line"
                    );

                if (!button) return;

                const index =
                    Number(button.dataset.index);

                purchaseLines.splice(
                    index,
                    1
                );

                renderPurchaseLines();

            }
        );

}


function fillPurchasePrice() {

    const id =
        document.getElementById(
            "purchase-product"
        ).value;


    const product =
        db.products.find(
            p =>
                String(p.id) ===
                String(id)
        );


    document.getElementById(
        "purchase-price"
    ).value =
        product
            ? product.purchasePrice
            : 0;

}


function addPurchaseLine() {

    const productId =
        document.getElementById(
            "purchase-product"
        ).value;


    const qty =
        Number(
            document.getElementById(
                "purchase-qty"
            ).value
        );


    const price =
        Number(
            document.getElementById(
                "purchase-price"
            ).value
        );


    const product =
        db.products.find(
            p =>
                String(p.id) ===
                String(productId)
        );


    if (!product) {

        alert("اختر صنفًا.");

        return;
    }


    if (qty <= 0) {

        alert("الكمية غير صحيحة.");

        return;
    }


    if (price < 0) {

        alert("السعر غير صحيح.");

        return;
    }


    purchaseLines.push({

        productId:
            product.id,

        quantity:
            qty,

        price

    });


    document.getElementById(
        "purchase-qty"
    ).value = 1;


    renderPurchaseLines();

}


function renderPurchaseLines() {

    const tbody =
        document.getElementById(
            "purchase-lines"
        );


    if (!purchaseLines.length) {

        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="empty-row">
                    لم تتم إضافة أصناف
                </td>
            </tr>
        `;

    } else {

        tbody.innerHTML =
            purchaseLines.map(
                (line, index) => {

                    const product =
                        db.products.find(
                            p =>
                                String(p.id) ===
                                String(line.productId)
                        );


                    const total =
                        Number(line.quantity) *
                        Number(line.price);


                    return `
                        <tr>

                            <td>
                                ${escapeHTML(
                                    product?.name || "محذوف"
                                )}
                            </td>

                            <td>${line.quantity}</td>

                            <td>${money(line.price)}</td>

                            <td>${money(total)}</td>

                            <td>

                                <button
                                    class="delete-line"
                                    data-index="${index}"
                                >
                                    حذف
                                </button>

                            </td>

                        </tr>
                    `;

                }
            ).join("");

    }


    const subtotal =
        purchaseLines.reduce(
            (sum, line) =>
                sum +
                Number(line.quantity) *
                Number(line.price),
            0
        );


    const discount =
        Number(
            document.getElementById(
                "purchase-discount"
            ).value
        ) || 0;


    const total =
        Math.max(
            0,
            subtotal - discount
        );


    document.getElementById(
        "purchase-total"
    ).textContent =
        money(total);

}


function savePurchase() {

    if (!purchaseLines.length) {

        alert(
            "أضف صنفًا واحدًا على الأقل."
        );

        return;
    }


    const supplierId =
        document.getElementById(
            "purchase-supplier"
        ).value;


    const date =
        document.getElementById(
            "purchase-date"
        ).value ||
        today();


    const discount =
        Number(
            document.getElementById(
                "purchase-discount"
            ).value
        ) || 0;


    const subtotal =
        purchaseLines.reduce(
            (sum, line) =>
                sum +
                Number(line.quantity) *
                Number(line.price),
            0
        );


    const total =
        Math.max(
            0,
            subtotal - discount
        );


    const purchase = {

        id:
            Date.now(),

        number:
            getNextNumber(
                "PUR",
                db.purchases
            ),

        date,

        supplierId:
            supplierId || "",

        lines:
            structuredClone(purchaseLines),

        subtotal,

        discount,

        total,

        createdAt:
            new Date().toISOString()

    };


    /*
       إضافة الكميات للمخزون
    */

    purchaseLines.forEach(line => {

        const product =
            db.products.find(
                p =>
                    String(p.id) ===
                    String(line.productId)
            );


        if (product) {

            product.quantity +=
                Number(line.quantity);

            /*
               تحديث آخر سعر شراء
            */

            product.purchasePrice =
                Number(line.price);

        }

    });


    db.purchases.push(
        purchase
    );


    saveDB();


    purchaseLines = [];


    document.getElementById(
        "purchase-discount"
    ).value = 0;


    preparePurchaseScreen();

    renderPurchasesHistory();

    renderInventory();

    renderDashboard();

    renderProducts();


    showToast(
        "تم اعتماد فاتورة الشراء وتحديث المخزون."
    );

}


function renderPurchasesHistory() {

    const tbody =
        document.getElementById(
            "purchases-history"
        );


    if (!db.purchases.length) {

        tbody.innerHTML = `
            <tr>
                <td colspan="4" class="empty-row">
                    لا توجد فواتير شراء
                </td>
            </tr>
        `;

        return;
    }


    tbody.innerHTML =
        [...db.purchases]
            .reverse()
            .map(purchase => {

                const supplier =
                    db.suppliers.find(
                        s =>
                            String(s.id) ===
                            String(purchase.supplierId)
                    );


                return `
                    <tr>
                        <td>${escapeHTML(purchase.number)}</td>
                        <td>${escapeHTML(purchase.date)}</td>
                        <td>${escapeHTML(supplier?.name || "مورد نقدي")}</td>
                        <td>${money(purchase.total)}</td>
                    </tr>
                `;

            }).join("");

}


/* =========================================================
   CUSTOMERS
========================================================= */

function setupCustomers() {

    document
        .getElementById("open-customer-form")
        .addEventListener(
            "click",
            () => {

                document
                    .getElementById(
                        "customer-form-panel"
                    )
                    .classList.remove("hidden");

            }
        );


    document
        .getElementById("cancel-customer")
        .addEventListener(
            "click",
            () => {

                document
                    .getElementById(
                        "customer-form-panel"
                    )
                    .classList.add("hidden");

            }
        );


    document
        .getElementById("customer-form")
        .addEventListener(
            "submit",
            event => {

                event.preventDefault();


                const name =
                    document.getElementById(
                        "customer-name"
                    ).value.trim();


                const phone =
                    document.getElementById(
                        "customer-phone"
                    ).value.trim();


                const address =
                    document.getElementById(
                        "customer-address"
                    ).value.trim();


                if (!name) {

                    alert("اسم العميل مطلوب.");

                    return;
                }


                db.customers.push({

                    id: Date.now(),

                    name,

                    phone,

                    address,

                    balance: 0

                });


                saveDB();


                event.target.reset();


                document
                    .getElementById(
                        "customer-form-panel"
                    )
                    .classList.add("hidden");


                renderCustomers();

                refreshSelects();

                showToast("تم حفظ العميل.");

            }
        );

}


function renderCustomers() {

    const tbody =
        document.getElementById(
            "customers-table"
        );


    if (!db.customers.length) {

        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="empty-row">
                    لا يوجد عملاء
                </td>
            </tr>
        `;

        return;
    }


    tbody.innerHTML =
        db.customers.map(
            (customer, index) => {

                return `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${escapeHTML(customer.name)}</td>
                        <td>${escapeHTML(customer.phone || "-")}</td>
                        <td>${escapeHTML(customer.address || "-")}</td>
                        <td>${money(calculateCustomerBalance(customer.id))}</td>
                    </tr>
                `;

            }
        ).join("");

}


function calculateCustomerBalance(customerId) {

    return db.sales
        .filter(
            sale =>
                sale.payment === "credit" &&
                String(sale.customerId) ===
                String(customerId)
        )
        .reduce(
            (sum, sale) =>
                sum + Number(sale.total),
            0
        );
}


/* =========================================================
   SUPPLIERS
========================================================= */

function setupSuppliers() {

    document
        .getElementById("open-supplier-form")
        .addEventListener(
            "click",
            () => {

                document
                    .getElementById(
                        "supplier-form-panel"
                    )
                    .classList.remove("hidden");

            }
        );


    document
        .getElementById("cancel-supplier")
        .addEventListener(
            "click",
            () => {

                document
                    .getElementById(
                        "supplier-form-panel"
                    )
                    .classList.add("hidden");

            }
        );


    document
        .getElementById("supplier-form")
        .addEventListener(
            "submit",
            event => {

                event.preventDefault();


                const name =
                    document.getElementById(
                        "supplier-name"
                    ).value.trim();


                const phone =
                    document.getElementById(
                        "supplier-phone"
                    ).value.trim();


                const address =
                    document.getElementById(
                        "supplier-address"
                    ).value.trim();


                if (!name) {

                    alert("اسم المورد مطلوب.");

                    return;
                }


                db.suppliers.push({

                    id: Date.now(),

                    name,

                    phone,

                    address,

                    balance: 0

                });


                saveDB();


                event.target.reset();


                document
                    .getElementById(
                        "supplier-form-panel"
                    )
                    .classList.add("hidden");


                renderSuppliers();

                refreshSelects();

                showToast("تم حفظ المورد.");

            }
        );

}


function renderSuppliers() {

    const tbody =
        document.getElementById(
            "suppliers-table"
        );


    if (!db.suppliers.length) {

        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="empty-row">
                    لا يوجد موردون
                </td>
            </tr>
        `;

        return;
    }


    tbody.innerHTML =
        db.suppliers.map(
            (supplier, index) => {

                return `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${escapeHTML(supplier.name)}</td>
                        <td>${escapeHTML(supplier.phone || "-")}</td>
                        <td>${escapeHTML(supplier.address || "-")}</td>
                        <td>${money(calculateSupplierBalance(supplier.id))}</td>
                    </tr>
                `;

            }
        ).join("");

}


function calculateSupplierBalance(supplierId) {

    return db.purchases
        .filter(
            purchase =>
                String(purchase.supplierId) ===
                String(supplierId)
        )
        .reduce(
            (sum, purchase) =>
                sum + Number(purchase.total),
            0
        );
}


/* =========================================================
   ACCOUNTS
========================================================= */

function renderAccounts() {

    const totalSales =
        db.sales.reduce(
            (sum, sale) =>
                sum + Number(sale.total),
            0
        );


    const totalPurchases =
        db.purchases.reduce(
            (sum, purchase) =>
                sum + Number(purchase.total),
            0
        );


    const net =
        totalSales -
        totalPurchases;


    document.getElementById(
        "account-sales-total"
    ).textContent =
        money(totalSales);


    document.getElementById(
        "account-purchases-total"
    ).textContent =
        money(totalPurchases);


    document.getElementById(
        "account-net-total"
    ).textContent =
        money(net);


    document.getElementById(
        "accounts-table"
    ).innerHTML = `

        <tr>
            <td>المبيعات</td>
            <td>0.00</td>
            <td>${money(totalSales)}</td>
            <td>${money(totalSales)}</td>
        </tr>

        <tr>
            <td>المشتريات</td>
            <td>${money(totalPurchases)}</td>
            <td>0.00</td>
            <td>${money(totalPurchases)}</td>
        </tr>

        <tr>
            <td>صافي الحركة</td>
            <td>${money(totalPurchases)}</td>
            <td>${money(totalSales)}</td>
            <td>${money(net)}</td>
        </tr>
    `;

}


/* =========================================================
   REPORTS
========================================================= */

function setupReports() {

    document
        .querySelectorAll(".report-card")
        .forEach(button => {

            button.addEventListener(
                "click",
                () =>
                    generateReport(
                        button.dataset.report
                    )
            );

        });

}


function renderReportsDefault() {

    document.getElementById(
        "report-title"
    ).textContent =
        "اختر تقريرًا";


    document.getElementById(
        "report-content"
    ).innerHTML =
        "اختر أحد التقارير لعرض البيانات.";

}


function generateReport(type) {

    const title =
        document.getElementById(
            "report-title"
        );

    const content =
        document.getElementById(
            "report-content"
        );


    if (type === "sales") {

        const total =
            db.sales.reduce(
                (sum, sale) =>
                    sum + Number(sale.total),
                0
            );


        title.textContent =
            "تقرير المبيعات";


        content.innerHTML = `

            <h3>
                إجمالي المبيعات:
                ${money(total)} ريال
            </h3>

            <p>
                عدد الفواتير:
                ${db.sales.length}
            </p>
        `;

        return;
    }


    if (type === "purchases") {

        const total =
            db.purchases.reduce(
                (sum, purchase) =>
                    sum + Number(purchase.total),
                0
            );


        title.textContent =
            "تقرير المشتريات";


        content.innerHTML = `

            <h3>
                إجمالي المشتريات:
                ${money(total)} ريال
            </h3>

            <p>
                عدد الفواتير:
                ${db.purchases.length}
            </p>
        `;

        return;
    }


    if (type === "stock") {

        const value =
            db.products.reduce(
                (sum, product) =>
                    sum +
                    Number(product.quantity) *
                    Number(product.purchasePrice),
                0
            );


        title.textContent =
            "تقرير المخزون";


        content.innerHTML = `

            <h3>
                قيمة المخزون:
                ${money(value)} ريال
            </h3>

            <p>
                عدد الأصناف:
                ${db.products.length}
            </p>
        `;

        return;
    }


    if (type === "profit") {

        const sales =
            db.sales.reduce(
                (sum, sale) =>
                    sum + Number(sale.total),
                0
            );


        let cost = 0;


        db.sales.forEach(
            sale => {

                sale.lines.forEach(
                    line => {

                        const product =
                            db.products.find(
                                p =>
                                    String(p.id) ===
                                    String(line.productId)
                            );


                        if (product) {

                            cost +=
                                Number(line.quantity) *
                                Number(product.purchasePrice);

                        }

                    }
                );

            }
        );


        title.textContent =
            "ملخص الربحية";


        content.innerHTML = `

            <p>
                إجمالي المبيعات:
                <strong>
                    ${money(sales)}
                </strong>
            </p>

            <p>
                التكلفة التقريبية:
                <strong>
                    ${money(cost)}
                </strong>
            </p>

            <p>
                الربح التقريبي:
                <strong>
                    ${money(sales - cost)}
                </strong>
            </p>

        `;

    }

}


/* =========================================================
   SETTINGS
========================================================= */

function setupSettings() {

    document
        .getElementById("settings-form")
        .addEventListener(
            "submit",
            event => {

                event.preventDefault();


                db.settings.name =
                    document.getElementById(
                        "setting-name"
                    ).value.trim();


                db.settings.phone =
                    document.getElementById(
                        "setting-phone"
                    ).value.trim();


                db.settings.address =
                    document.getElementById(
                        "setting-address"
                    ).value.trim();


                db.settings.currency =
                    document.getElementById(
                        "setting-currency"
                    ).value;


                saveDB();

                showToast(
                    "تم حفظ الإعدادات."
                );

            }
        );

}


function loadSettingsForm() {

    document.getElementById(
        "setting-name"
    ).value =
        db.settings.name;


    document.getElementById(
        "setting-phone"
    ).value =
        db.settings.phone;


    document.getElementById(
        "setting-address"
    ).value =
        db.settings.address;


    document.getElementById(
        "setting-currency"
    ).value =
        db.settings.currency;

}


/* =========================================================
   SELECTS
========================================================= */

function refreshSelects() {

    const productOptions = `
        <option value="">
            اختر الصنف
        </option>

        ${db.products.map(
            product => `
                <option value="${product.id}">
                    ${escapeHTML(product.name)}
                    -
                    ${escapeHTML(product.barcode || "بدون باركود")}
                    -
                    المتاح ${product.quantity}
                </option>
            `
        ).join("")}
    `;


    document.getElementById(
        "sale-product"
    ).innerHTML =
        productOptions;


    document.getElementById(
        "purchase-product"
    ).innerHTML =
        productOptions;


    document.getElementById(
        "sale-customer"
    ).innerHTML = `

        <option value="">
            عميل نقدي
        </option>

        ${db.customers.map(
            customer => `
                <option value="${customer.id}">
                    ${escapeHTML(customer.name)}
                </option>
            `
        ).join("")}

    `;


    document.getElementById(
        "purchase-supplier"
    ).innerHTML = `

        <option value="">
            مورد نقدي
        </option>

        ${db.suppliers.map(
            supplier => `
                <option value="${supplier.id}">
                    ${escapeHTML(supplier.name)}
                </option>
            `
        ).join("")}

    `;

}


/* =========================================================
   DASHBOARD
========================================================= */

function renderDashboard() {

    const currentDate =
        today();


    document.getElementById(
        "currentDate"
    ).textContent =
        currentDate;


    const salesToday =
        db.sales
            .filter(
                sale =>
                    sale.date === currentDate
            )
            .reduce(
                (sum, sale) =>
                    sum + Number(sale.total),
                0
            );


    const purchasesToday =
        db.purchases
            .filter(
                purchase =>
                    purchase.date === currentDate
            )
            .reduce(
                (sum, purchase) =>
                    sum + Number(purchase.total),
                0
            );


    const stockValue =
        db.products.reduce(
            (sum, product) =>
                sum +
                Number(product.quantity) *
                Number(product.purchasePrice),
            0
        );


    const lowStock =
        db.products.filter(
            product =>
                Number(product.quantity) > 0 &&
                Number(product.quantity) <=
                Number(product.minimum)
        ).length;


    const outStock =
        db.products.filter(
            product =>
                Number(product.quantity) <= 0
        ).length;


    document.getElementById(
        "dashboard-sales"
    ).textContent =
        money(salesToday);


    document.getElementById(
        "dashboard-purchases"
    ).textContent =
        money(purchasesToday);


    document.getElementById(
        "dashboard-stock-value"
    ).textContent =
        money(stockValue);


    document.getElementById(
        "dashboard-low-stock"
    ).textContent =
        lowStock;


    document.getElementById(
        "dashboard-out-stock"
    ).textContent =
        outStock;


    document.getElementById(
        "dashboard-products"
    ).textContent =
        db.products.length;


    const salesContainer =
        document.getElementById(
            "dashboard-sales-list"
        );


    if (!db.sales.length) {

        salesContainer.innerHTML =
            `<div class="empty-row">
                لا توجد مبيعات
            </div>`;

    } else {

        salesContainer.innerHTML =
            [...db.sales]
                .reverse()
                .slice(0, 6)
                .map(
                    sale => `
                        <div class="list-row">
                            <span>
                                ${escapeHTML(sale.number)}
                            </span>

                            <strong>
                                ${money(sale.total)}
                            </strong>
                        </div>
                    `
                )
                .join("");

    }


    const alertContainer =
        document.getElementById(
            "dashboard-alerts"
        );


    const alerts =
        db.products.filter(
            product =>
                Number(product.quantity) <=
                Number(product.minimum)
        );


    if (!alerts.length) {

        alertContainer.innerHTML =
            `<div class="empty-row">
                لا توجد تنبيهات
            </div>`;

    } else {

        alertContainer.innerHTML =
            alerts
                .slice(0, 8)
                .map(
                    product => `
                        <div class="list-row">
                            <span>
                                ${escapeHTML(product.name)}
                            </span>

                            <strong>
                                ${product.quantity}
                            </strong>
                        </div>
                    `
                )
                .join("");

    }

}


/* =========================================================
   INITIALIZATION
========================================================= */

function initialize() {

    setupNavigation();

    setupProductForm();

    setupSales();

    setupPurchases();

    setupCustomers();

    setupSuppliers();

    setupReports();

    setupSettings();

    refreshSelects();

    renderDashboard();

    renderProducts();

    renderInventory();

    renderCustomers();

    renderSuppliers();

    renderAccounts();

    prepareSaleScreen();

    preparePurchaseScreen();

    loadSettingsForm();

    renderSalesHistory();

    renderPurchasesHistory();

    console.log(
        "شرف ERP تم تشغيله بنجاح"
    );

}


document.addEventListener(
    "DOMContentLoaded",
    initialize
);
