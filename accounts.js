/* =========================================================
   شرف ERP
   شجرة الحسابات المحاسبية
   ========================================================= */


/* =========================================================
   التخزين
========================================================= */

const ACCOUNTS_STORAGE_KEY =
    "sharaf_erp_accounts_v1";


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
   الشجرة الافتراضية
   ملاحظة:
   هذه البيانات تُنشأ مرة واحدة فقط عند عدم وجود بيانات.
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

        return DEFAULT_ACCOUNTS.map(
            account => ({ ...account })
        );

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
   أدوات
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
   فتح وإغلاق نموذج الحساب
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


    box.classList.remove("show");


    document.getElementById(
        "accountForm"
    ).reset();


    document.getElementById(
        "editAccountId"
    ).value = "";

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
        accounts.filter(
            account =>
                account.isGroup &&
                account.active
        );


    select.innerHTML = `

        <option value="">
            حساب رئيسي
        </option>

        ${
            groups
                .sort(
                    (a, b) =>
                        a.code.localeCompare(
                            b.code,
                            undefined,
                            {
                                numeric: true
                            }
                        )
                )
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
   حفظ حساب جديد أو تعديل حساب
========================================================= */

function handleAccountSubmit(
    event
) {

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


    /* منع تكرار الكود */

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
       تعديل حساب
    ===================================================== */

    if (editId) {

        const account =
            getAccountById(
                editId
            );


        if (!account) {

            showAccountMessage(
                "الحساب غير موجود.",
                "error"
            );

            return;

        }


        /*
           لا نسمح بجعل الحساب أبًا لنفسه.
        */

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


        /*
           لا نسمح بنقل الحساب تحت أحد أبنائه.
        */

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
            parent.type !== type
        ) {

            showAccountMessage(
                "نوع الحساب يجب أن يتوافق مع نوع الحساب الأب.",
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
       إضافة حساب
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
            "نوع الحساب يجب أن يتوافق مع نوع الحساب الأب.",
            "error"
        );

        return;

    }


    /*
       إذا لم يوجد أب فهو حساب رئيسي
       وإذا وجد أب فهو حساب فرعي
    */

    const newAccount = {

        id:
            Date.now(),

        code,

        name,

        type,

        parentId,

        /*
           الحساب الذي لا يوجد له أبناء يمكن أن يكون
           حساب حركة، لكن المستخدم يستطيع لاحقًا
           تحويله إلى مجموعة عندما نحتاج ذلك.
        */

        isGroup:
            false,

        active:
            true

    };


    accounts.push(
        newAccount
    );


    /*
       إذا أصبح للحساب أبناء، يتحول إلى مجموعة.
    */

    if (parent) {

        parent.isGroup = true;

    }


    saveAccounts();

    renderAccounts();

    closeAccountForm();


    showAccountMessage(
        "تم إنشاء الحساب بنجاح.",
        "success"
    );

}


/* =========================================================
   التحقق من علاقة الأب والابن
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


        current =
            getAccountById(
                current.parentId
            );

    }


    return false;

}


/* =========================================================
   تغيير حالة الحساب
========================================================= */

function toggleAccount(
    id
) {

    const account =
        getAccountById(id);


    if (!account) {
        return;
    }


    /*
       لا نعطل حساب مجموعة إذا كان تحته حسابات نشطة.
    */

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


        if (activeChildren.length) {

            showAccountMessage(
                "لا يمكن تعطيل هذا الحساب قبل تعطيل حساباته الفرعية.",
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
   حذف الحساب
========================================================= */

function deleteAccount(
    id
) {

    const account =
        getAccountById(id);


    if (!account) {
        return;
    }


    /*
       لا نسمح بالحذف إذا كان له أبناء.
    */

    if (
        accountHasChildren(id)
    ) {

        showAccountMessage(
            "لا يمكن حذف حساب يحتوي على حسابات فرعية.",
            "error"
        );

        return;

    }


    /*
       في النسخة الحالية لا توجد قيود بعد،
       لذلك الحذف مسموح لحساب حركة غير مستخدم.
       بعد بناء القيود سيتم منع الحذف إذا كان له حركات.
    */

    const confirmed =
        confirm(
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
   عرض الشجرة
========================================================= */

function renderAccounts() {

    const tbody =
        document.getElementById(
            "accountsTableBody"
        );


    if (!tbody) {
        return;
    }


    const search =
        document.getElementById(
            "accountSearch"
        )?.value
            .trim()
            .toLowerCase()
            || "";


    let visibleAccounts;


    if (search) {

        visibleAccounts =
            accounts.filter(
                account =>
                    account.code
                        .toLowerCase()
                        .includes(search) ||
                    account.name
                        .toLowerCase()
                        .includes(search)
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


                    return `

                        <tr>

                            <td
                                class="account-level-${Math.min(
                                    level,
                                    3
                                )}"
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
                                class="account-level-${Math.min(
                                    level,
                                    3
                                )}"
                            >

                                ${
                                    escapeHTML(
                                        account.name
                                    )
                                }

                            </td>


                            <td>

                                ${
                                    getAccountTypeName(
                                        account.type
                                    )
                                }

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
                                    class="status ${
                                        statusClass
                                    }"
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
   ترتيب الحسابات كشجرة
========================================================= */

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


function compareAccountCodes(
    a,
    b
) {

    return a.code.localeCompare(
        b.code,
        undefined,
        {
            numeric: true
        }
    );

}


function getAccountLevel(
    account
) {

    let level = 1;

    let current =
        account;


    while (
        current.parentId !== null
    ) {

        level++;

        current =
            getAccountById(
                current.parentId
            );


        if (!current) {
            break;
        }

    }


    return level;

}


/* =========================================================
   الأحداث
========================================================= */

function setupAccountEvents() {

    const addButton =
        document.getElementById(
            "addAccountButton"
        );


    if (!addButton) {
        return;
    }


    addButton.addEventListener(
        "click",
        function () {

            openAccountForm();

        }
    );


    document
        .getElementById(
            "cancelAccount"
        )
        .addEventListener(
            "click",
            closeAccountForm
        );


    document
        .getElementById(
            "accountForm"
        )
        .addEventListener(
            "submit",
            handleAccountSubmit
        );


    document
        .getElementById(
            "accountSearch"
        )
        .addEventListener(
            "input",
            renderAccounts
        );


    document
        .getElementById(
            "accountsTableBody"
        )
        .addEventListener(
            "click",
            function (event) {

                const button =
                    event.target.closest(
                        "button"
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

                }


                if (
                    action === "add-child"
                ) {

                    openAccountForm(
                        id,
                        null
                    );

                }


                if (action === "toggle") {

                    toggleAccount(id);

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


/*
   مهم:
   accounts.js يتم تحميله بعد script.js.
*/

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeAccounts
    );

} else {

    initializeAccounts();

}
