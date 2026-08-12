/* =========================================================
   شرف ERP
   شجرة الحسابات المحاسبية
   ========================================================= */


/* =========================================================
   التخزين المستقل للحسابات
========================================================= */

const ACCOUNTS_STORAGE_KEY = "sharaf_erp_accounts_v1";


/* =========================================================
   أنواع الحسابات
========================================================= */

const ACCOUNT_TYPES = {
    asset: "أصول",
    liability: "خصوم",
    equity: "حقوق ملكية",
    revenue: "إيرادات",
    expense: "مصروفات"
};


/* =========================================================
   الحسابات الافتراضية
========================================================= */

const DEFAULT_ACCOUNTS = [

    /* الأصول */

    {
        id: 1,
        code: "1",
        name: "الأصول",
        type: "asset",
        parentId: null,
        isGroup: true,
        active: true
    },

    {
        id: 2,
        code: "11",
        name: "الأصول المتداولة",
        type: "asset",
        parentId: 1,
        isGroup: true,
        active: true
    },

    {
        id: 3,
        code: "1101",
        name: "الصندوق",
        type: "asset",
        parentId: 2,
        isGroup: false,
        active: true
    },

    {
        id: 4,
        code: "1102",
        name: "البنك",
        type: "asset",
        parentId: 2,
        isGroup: false,
        active: true
    },

    {
        id: 5,
        code: "1103",
        name: "العملاء",
        type: "asset",
        parentId: 2,
        isGroup: false,
        active: true
    },

    {
        id: 6,
        code: "1104",
        name: "المخزون",
        type: "asset",
        parentId: 2,
        isGroup: false,
        active: true
    },


    /* الخصوم */

    {
        id: 7,
        code: "2",
        name: "الخصوم",
        type: "liability",
        parentId: null,
        isGroup: true,
        active: true
    },

    {
        id: 8,
        code: "21",
        name: "الخصوم المتداولة",
        type: "liability",
        parentId: 7,
        isGroup: true,
        active: true
    },

    {
        id: 9,
        code: "2101",
        name: "الموردون",
        type: "liability",
        parentId: 8,
        isGroup: false,
        active: true
    },


    /* حقوق الملكية */

    {
        id: 10,
        code: "3",
        name: "حقوق الملكية",
        type: "equity",
        parentId: null,
        isGroup: true,
        active: true
    },

    {
        id: 11,
        code: "3101",
        name: "رأس المال",
        type: "equity",
        parentId: 10,
        isGroup: false,
        active: true
    },

    {
        id: 12,
        code: "3102",
        name: "الأرباح المحتجزة",
        type: "equity",
        parentId: 10,
        isGroup: false,
        active: true
    },


    /* الإيرادات */

    {
        id: 13,
        code: "4",
        name: "الإيرادات",
        type: "revenue",
        parentId: null,
        isGroup: true,
        active: true
    },

    {
        id: 14,
        code: "4101",
        name: "المبيعات",
        type: "revenue",
        parentId: 13,
        isGroup: false,
        active: true
    },

    {
        id: 15,
        code: "4102",
        name: "إيرادات أخرى",
        type: "revenue",
        parentId: 13,
        isGroup: false,
        active: true
    },


    /* المصروفات */

    {
        id: 16,
        code: "5",
        name: "المصروفات",
        type: "expense",
        parentId: null,
        isGroup: true,
        active: true
    },

    {
        id: 17,
        code: "5101",
        name: "تكلفة المبيعات",
        type: "expense",
        parentId: 16,
        isGroup: false,
        active: true
    },

    {
        id: 18,
        code: "5102",
        name: "الرواتب",
        type: "expense",
        parentId: 16,
        isGroup: false,
        active: true
    },

    {
        id: 19,
        code: "5103",
        name: "الإيجار",
        type: "expense",
        parentId: 16,
        isGroup: false,
        active: true
    },

    {
        id: 20,
        code: "5104",
        name: "الكهرباء",
        type: "expense",
        parentId: 16,
        isGroup: false,
        active: true
    },

    {
        id: 21,
        code: "5105",
        name: "مصروفات أخرى",
        type: "expense",
        parentId: 16,
        isGroup: false,
        active: true
    }

];


/* =========================================================
   تحميل الحسابات
========================================================= */

let accounts = loadAccounts();


function loadAccounts() {

    try {

        const saved =
            localStorage.getItem(
                ACCOUNTS_STORAGE_KEY
            );


        if (!saved) {

            const initial =
                DEFAULT_ACCOUNTS.map(
                    account => ({ ...account })
                );


            localStorage.setItem(
                ACCOUNTS_STORAGE_KEY,
                JSON.stringify(initial)
            );


            return initial;
        }


        const parsed =
            JSON.parse(saved);


        if (!Array.isArray(parsed)) {

            throw new Error(
                "بيانات الحسابات غير صحيحة"
            );

        }


        return parsed;

    } catch (error) {

        console.error(
            "تعذر تحميل الحسابات:",
            error
        );


        const fallback =
            DEFAULT_ACCOUNTS.map(
                account => ({ ...account })
            );


        localStorage.setItem(
            ACCOUNTS_STORAGE_KEY,
            JSON.stringify(fallback)
        );


        return fallback;

    }

}


/* =========================================================
   حفظ الحسابات
========================================================= */

function saveAccounts() {

    localStorage.setItem(
        ACCOUNTS_STORAGE_KEY,
        JSON.stringify(accounts)
    );

}


/* =========================================================
   أدوات الحسابات
========================================================= */

function getAccountTypeName(type) {

    return ACCOUNT_TYPES[type] || type;

}


function getAccountById(id) {

    return accounts.find(
        account =>
            String(account.id) ===
            String(id)
    );

}


function getChildren(id) {

    return accounts.filter(
        account =>
            String(account.parentId) ===
            String(id)
    );

}


function accountHasChildren(id) {

    return getChildren(id).length > 0;

}


/* =========================================================
   حماية النصوص
========================================================= */

function escapeHTML(value) {

    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll( " , "&quot;")
        .replaceAll(" ", "&#039;");

}


/* =========================================================
   الرسائل
========================================================= */

function showAccountMessage(
    text,
    type = "success"
) {

    const message =
        document.getElementById(
            "accountsMessage"
        );


    if (!message) {
        return;
    }


    message.textContent = text;


    message.className =
        `message show ${type}`;


    setTimeout(
        function () {

            message.className =
                "message";

        },
        3000
    );

}


/* =========================================================
   نموذج الحساب
========================================================= */

function openAccountForm(
    parentId = null,
    accountId = null
) {

    const box =
        document.getElementById(
            "accountFormBox"
        );


    const title =
        document.getElementById(
            "accountFormTitle"
        );


    const form =
        document.getElementById(
            "accountForm"
        );


    if (!box || !title || !form) {

        console.error(
            "واجهة نموذج الحساب غير موجودة."
        );

        return;

    }


    form.reset();


    document.getElementById(
        "editAccountId"
    ).value = "";


    fillParentSelect(
        parentId
    );


    if (accountId !== null) {

        const account =
            getAccountById(accountId);


        if (!account) {

            showAccountMessage(
                "الحساب غير موجود.",
                "error"
            );

            return;

        }


        title.textContent =
            "تعديل الحساب";


        document.getElementById(
            "editAccountId"
        ).value =
            account.id;


        document.getElementById(
            "accountCode"
        ).value =
            account.code;


        document.getElementById(
            "accountName"
        ).value =
            account.name;


        document.getElementById(
            "accountType"
        ).value =
            account.type;


        document.getElementById(
            "accountParent"
        ).value =
            account.parentId ?? "";

    } else {

        title.textContent =
            "إضافة حساب جديد";

    }


    box.classList.add("show");


    document.getElementById(
        "accountCode"
    ).focus();

}


function closeAccountForm() {

    const box =
        document.getElementById(
            "accountFormBox"
        );


    const form =
        document.getElementById(
            "accountForm"
        );


    if (box) {
        box.classList.remove("show");
    }


    if (form) {
        form.reset();
    }


    const editId =
        document.getElementById(
            "editAccountId"
        );


    if (editId) {
        editId.value = "";
    }

}


/* =========================================================
   قائمة الحساب الأب
========================================================= */

function fillParentSelect(
    selectedId = null
) {

    const select =
        document.getElementById(
            "accountParent"
        );


    if (!select) {
        return;
    }


    const groups =
        accounts
            .filter(
                account =>
                    account.isGroup &&
                    account.active
            )
            .sort(
                compareAccountCodes
            );


    select.innerHTML = `

        <option value="">
            حساب رئيسي
        </option>

        ${
            groups
                .map(
                    account => `
                        <option
                            value="${account.id}"
                            ${
                                String(account.id) ===
                                String(selectedId)
                                    ? "selected"
                                    : ""
                            }
                        >
                            ${escapeHTML(account.code)}
                            -
                            ${escapeHTML(account.name)}
                        </option>
                    `
                )
                .join("")
        }

    `;

}


/* =========================================================
   إنشاء / تعديل الحساب
========================================================= */

function handleAccountSubmit(event) {

    event.preventDefault();


    const editId =
        document.getElementById(
            "editAccountId"
        ).value;


    const code =
        document.getElementById(
            "accountCode"
        ).value
        .trim();


    const name =
        document.getElementById(
            "accountName"
        ).value
        .trim();


    const type =
        document.getElementById(
            "accountType"
        ).value;


    const parentValue =
        document.getElementById(
            "accountParent"
        ).value;


    const parentId =
        parentValue
            ? Number(parentValue)
            : null;


    if (!code) {

        showAccountMessage(
            "كود الحساب مطلوب.",
            "error"
        );

        return;

    }


    if (!name) {

        showAccountMessage(
            "اسم الحساب مطلوب.",
            "error"
        );

        return;

    }


    const duplicate =
        accounts.find(
            account =>
                account.code === code &&
                String(account.id) !==
                String(editId)
        );


    if (duplicate) {

        showAccountMessage(
            "كود الحساب مستخدم بالفعل.",
            "error"
        );

        return;

    }


    /* =====================================================
       تعديل
    ===================================================== */

    if (editId) {

        const account =
            getAccountById(editId);


        if (!account) {

            showAccountMessage(
                "الحساب غير موجود.",
                "error"
            );

            return;

        }


        if (
            parentId !== null &&
            String(parentId) ===
            String(account.id)
        ) {

            showAccountMessage(
                "لا يمكن أن يكون الحساب أبًا لنفسه.",
                "error"
            );

            return;

        }


        if (
            parentId !== null &&
            isDescendant(
                account.id,
                parentId
            )
        ) {

            showAccountMessage(
                "لا يمكن نقل الحساب تحت أحد حساباته الفرعية.",
                "error"
            );

            return;

        }


        const parent =
            parentId !== null
                ? getAccountById(parentId)
                : null;


        if (
            parent &&
            !parent.isGroup
        ) {

            showAccountMessage(
                "الحساب الأب يجب أن يكون حسابًا تجميعيًا.",
                "error"
            );

            return;

        }


        if (
            parent &&
            parent.type !== type
        ) {

            showAccountMessage(
                "نوع الحساب يجب أن يتوافق مع الحساب الأب.",
                "error"
            );

            return;

        }


        account.code =
            code;

        account.name =
            name;

        account.type =
            type;

        account.parentId =
            parentId;


        if (parent) {
            parent.isGroup = true;
        }


        saveAccounts();


        renderAccounts();


        closeAccountForm();


        showAccountMessage(
            "تم تعديل الحساب بنجاح.",
            "success"
        );


        return;

    }


    /* =====================================================
       إضافة جديد
    ===================================================== */

    const parent =
        parentId !== null
            ? getAccountById(parentId)
            : null;


    if (
        parentId !== null &&
        !parent
    ) {

        showAccountMessage(
            "الحساب الأب غير موجود.",
            "error"
        );

        return;

    }


    if (
        parent &&
        !parent.isGroup
    ) {

        showAccountMessage(
            "لا يمكن إنشاء حساب فرعي تحت حساب حركة.",
            "error"
        );

        return;

    }


    if (
        parent &&
        parent.type !== type
    ) {

        showAccountMessage(
            "نوع الحساب يجب أن يتوافق مع الحساب الأب.",
            "error"
        );

        return;

    }


    const newAccount = {

        id:
            Date.now(),

        code,

        name,

        type,

        parentId,

        isGroup:
            false,

        active:
            true

    };


    accounts.push(
        newAccount
    );


    if (parent) {

        parent.isGroup =
            true;

    }


    saveAccounts();


    renderAccounts();


    fillParentSelect();


    closeAccountForm();


    showAccountMessage(
        "تم إنشاء الحساب بنجاح.",
        "success"
    );

}


/* =========================================================
   فحص علاقة الأب والابن
========================================================= */

function isDescendant(
    accountId,
    possibleChildId
) {

    let current =
        getAccountById(
            possibleChildId
        );


    while (current) {

        if (
            String(current.parentId) ===
            String(accountId)
        ) {

            return true;

        }


        if (
            current.parentId === null
        ) {

            break;

        }


        current =
            getAccountById(
                current.parentId
            );

    }


    return false;

}


/* =========================================================
   تفعيل / تعطيل
========================================================= */

function toggleAccount(id) {

    const account =
        getAccountById(id);


    if (!account) {
        return;
    }


    if (
        account.active &&
        accountHasChildren(id)
    ) {

        const activeChildren =
            getChildren(id)
                .filter(
                    child =>
                        child.active
                );


        if (activeChildren.length > 0) {

            showAccountMessage(
                "لا يمكن تعطيل الحساب قبل تعطيل حساباته الفرعية.",
                "error"
            );

            return;

        }

    }


    account.active =
        !account.active;


    saveAccounts();


    renderAccounts();


    showAccountMessage(
        account.active
            ? "تم تفعيل الحساب."
            : "تم تعطيل الحساب.",
        "success"
    );

}


/* =========================================================
   حذف
========================================================= */

function deleteAccount(id) {

    const account =
        getAccountById(id);


    if (!account) {
        return;
    }


    if (
        accountHasChildren(id)
    ) {

        showAccountMessage(
            "لا يمكن حذف حساب يحتوي على حسابات فرعية.",
            "error"
        );

        return;

    }


    const confirmed =
        window.confirm(
            `هل تريد حذف الحساب "${account.name}"؟`
        );


    if (!confirmed) {
        return;
    }


    accounts =
        accounts.filter(
            item =>
                String(item.id) !==
                String(id)
        );


    saveAccounts();


    renderAccounts();


    fillParentSelect();


    showAccountMessage(
        "تم حذف الحساب.",
        "success"
    );

}


/* =========================================================
   ترتيب الشجرة
========================================================= */

function compareAccountCodes(a, b) {

    return a.code.localeCompare(
        b.code,
        undefined,
        {
            numeric: true
        }
    );

}


function getTreeOrder() {

    const result = [];


    const roots =
        accounts
            .filter(
                account =>
                    account.parentId === null
            )
            .sort(
                compareAccountCodes
            );


    function addChildren(
        account,
        level
    ) {

        result.push({
            ...account,
            treeLevel: level
        });


        const children =
            accounts
                .filter(
                    child =>
                        String(child.parentId) ===
                        String(account.id)
                )
                .sort(
                    compareAccountCodes
                );


        children.forEach(
            child =>
                addChildren(
                    child,
                    level + 1
                )
        );

    }


    roots.forEach(
        root =>
            addChildren(
                root,
                1
            )
    );


    return result;

}


function getAccountLevel(account) {

    let level = 1;

    let current = account;


    while (
        current &&
        current.parentId !== null
    ) {

        level++;


        current =
            getAccountById(
                current.parentId
            );

    }


    return level;

}


/* =========================================================
   عرض الحسابات
========================================================= */

function renderAccounts() {

    const tbody =
        document.getElementById(
            "accountsTableBody"
        );


    if (!tbody) {
        return;
    }


    const searchInput =
        document.getElementById(
            "accountSearch"
        );


    const search =
        searchInput
            ? searchInput.value
                .trim()
                .toLowerCase()
            : "";


    let visibleAccounts;


    if (search) {

        visibleAccounts =
            accounts
                .filter(
                    account =>
                        account.code
                            .toLowerCase()
                            .includes(search) ||
                        account.name
                            .toLowerCase()
                            .includes(search)
                )
                .sort(
                    compareAccountCodes
                );

    } else {

        visibleAccounts =
            getTreeOrder();

    }


    if (!visibleAccounts.length) {

        tbody.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    class="empty-row"
                >
                    لا توجد حسابات
                </td>

            </tr>

        `;

        return;

    }


    tbody.innerHTML =
        visibleAccounts
            .map(
                account => {

                    const parent =
                        account.parentId !== null
                            ? getAccountById(
                                account.parentId
                            )
                            : null;


                    const level =
                        account.treeLevel ||
                        getAccountLevel(
                            account
                        );


                    const statusClass =
                        account.active
                            ? "status-active"
                            : "status-inactive";


                    const statusText =
                        account.active
                            ? "فعال"
                            : "معطل";


                    const children =
                        accountHasChildren(
                            account.id
                        );


                    const indent =
                        Math.max(
                            0,
                            level - 1
                        ) * 25;


                    return `

                        <tr>

                            <td
                                style="padding-right:${12 + indent}px"
                            >

                                ${
                                    account.isGroup
                                        ? "📁"
                                        : "📄"
                                }

                                <strong>
                                    ${escapeHTML(
                                        account.code
                                    )}
                                </strong>

                            </td>


                            <td
                                style="padding-right:${12 + indent}px"
                            >

                                ${escapeHTML(
                                    account.name
                                )}

                            </td>


                            <td>

                                ${escapeHTML(
                                    getAccountTypeName(
                                        account.type
                                    )
                                )}

                            </td>


                            <td>

                                ${
                                    parent
                                        ? `
                                            ${escapeHTML(
                                                parent.code
                                            )}
                                            -
                                            ${escapeHTML(
                                                parent.name
                                            )}
                                        `
                                        : "رئيسي"
                                }

                            </td>


                            <td>

                                <span
                                    class="status ${statusClass}"
                                >
                                    ${statusText}
                                </span>

                            </td>


                            <td>

                                <div class="action-buttons">

                                    ${
                                        account.active
                                            ? `
                                                <button
                                                    type="button"
                                                    class="edit-btn"
                                                    data-action="edit"
                                                    data-id="${account.id}"
                                                >
                                                    تعديل
                                                </button>
                                            `
                                            : ""
                                    }


                                    ${
                                        account.isGroup &&
                                        account.active
                                            ? `
                                                <button
                                                    type="button"
                                                    class="edit-btn"
                                                    data-action="add-child"
                                                    data-id="${account.id}"
                                                >
                                                    + فرعي
                                                </button>
                                            `
                                            : ""
                                    }


                                    <button
                                        type="button"
                                        class="cancel-btn"
                                        style="padding:7px 10px;font-size:12px;"
                                        data-action="toggle"
                                        data-id="${account.id}"
                                    >
                                        ${
                                            account.active
                                                ? "تعطيل"
                                                : "تفعيل"
                                        }
                                    </button>


                                    ${
                                        !children
                                            ? `
                                                <button
                                                    type="button"
                                                    class="danger-btn"
                                                    data-action="delete"
                                                    data-id="${account.id}"
                                                >
                                                    حذف
                                                </button>
                                            `
                                            : ""
                                    }

                                </div>

                            </td>

                        </tr>

                    `;

                }
            )
            .join("");


    fillParentSelect();

}


/* =========================================================
   الأحداث
========================================================= */

function setupAccountEvents() {

    const addButton =
        document.getElementById(
            "addAccountButton"
        );


    const cancelButton =
        document.getElementById(
            "cancelAccount"
        );


    const form =
        document.getElementById(
            "accountForm"
        );


    const search =
        document.getElementById(
            "accountSearch"
        );


    const table =
        document.getElementById(
            "accountsTableBody"
        );


    if (!addButton || !cancelButton || !form || !search || !table) {

        console.warn(
            "لم يتم العثور على كل عناصر شاشة الحسابات."
        );

        return;

    }


    addButton.addEventListener(
        "click",
        function () {

            openAccountForm();

        }
    );


    cancelButton.addEventListener(
        "click",
        function () {

            closeAccountForm();

        }
    );


    form.addEventListener(
        "submit",
        handleAccountSubmit
    );


    search.addEventListener(
        "input",
        function () {

            renderAccounts();

        }
    );


    table.addEventListener(
        "click",
        function (event) {

            const button =
                event.target.closest(
                    "button[data-action]"
                );


            if (!button) {
                return;
            }


            const action =
                button.dataset.action;


            const id =
                button.dataset.id;


            if (action === "edit") {

                openAccountForm(
                    null,
                    id
                );

                return;

            }


            if (
                action === "add-child"
            ) {

                openAccountForm(
                    id,
                    null
                );

                return;

            }


            if (action === "toggle") {

                toggleAccount(id);

                return;

            }


            if (action === "delete") {

                deleteAccount(id);

            }

        }
    );

}


/* =========================================================
   التشغيل
========================================================= */

function initializeAccounts() {

    renderAccounts();

    setupAccountEvents();

}


/* =========================================================
   بدء الملف
========================================================= */

if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeAccounts
    );

} else {

    initializeAccounts();

}
