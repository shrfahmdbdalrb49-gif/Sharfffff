/* =========================================================
   شرف ERP - شجرة الحسابات
========================================================= */

const ACCOUNTS_STORAGE_KEY = "sharaf_erp_accounts_v1";

const ACCOUNT_TYPES = {
    asset: "أصول",
    liability: "خصوم",
    equity: "حقوق ملكية",
    revenue: "إيرادات",
    expense: "مصروفات"
};

const DEFAULT_ACCOUNTS = [
    { id: 1, code: "1", name: "الأصول", type: "asset", parentId: null, isGroup: true, active: true },
    { id: 2, code: "11", name: "الأصول المتداولة", type: "asset", parentId: 1, isGroup: true, active: true },
    { id: 3, code: "1101", name: "الصندوق", type: "asset", parentId: 2, isGroup: false, active: true },
    { id: 4, code: "1102", name: "البنك", type: "asset", parentId: 2, isGroup: false, active: true },
    { id: 5, code: "1103", name: "العملاء", type: "asset", parentId: 2, isGroup: false, active: true },
    { id: 6, code: "1104", name: "المخزون", type: "asset", parentId: 2, isGroup: false, active: true },

    { id: 7, code: "2", name: "الخصوم", type: "liability", parentId: null, isGroup: true, active: true },
    { id: 8, code: "21", name: "الخصوم المتداولة", type: "liability", parentId: 7, isGroup: true, active: true },
    { id: 9, code: "2101", name: "الموردون", type: "liability", parentId: 8, isGroup: false, active: true },

    { id: 10, code: "3", name: "حقوق الملكية", type: "equity", parentId: null, isGroup: true, active: true },
    { id: 11, code: "3101", name: "رأس المال", type: "equity", parentId: 10, isGroup: false, active: true },
    { id: 12, code: "3102", name: "الأرباح المحتجزة", type: "equity", parentId: 10, isGroup: false, active: true },

    { id: 13, code: "4", name: "الإيرادات", type: "revenue", parentId: null, isGroup: true, active: true },
    { id: 14, code: "4101", name: "المبيعات", type: "revenue", parentId: 13, isGroup: false, active: true },
    { id: 15, code: "4102", name: "إيرادات أخرى", type: "revenue", parentId: 13, isGroup: false, active: true },

    { id: 16, code: "5", name: "المصروفات", type: "expense", parentId: null, isGroup: true, active: true },
    { id: 17, code: "5101", name: "تكلفة المبيعات", type: "expense", parentId: 16, isGroup: false, active: true },
    { id: 18, code: "5102", name: "الرواتب", type: "expense", parentId: 16, isGroup: false, active: true },
    { id: 19, code: "5103", name: "الإيجار", type: "expense", parentId: 16, isGroup: false, active: true },
    { id: 20, code: "5104", name: "الكهرباء", type: "expense", parentId: 16, isGroup: false, active: true },
    { id: 21, code: "5105", name: "مصروفات أخرى", type: "expense", parentId: 16, isGroup: false, active: true }
];

let accounts = loadAccounts();


/* =========================================================
   التخزين
========================================================= */

function loadAccounts() {

    try {

        const saved =
            localStorage.getItem(ACCOUNTS_STORAGE_KEY);

        if (!saved) {

            const initial =
                DEFAULT_ACCOUNTS.map(account => ({ ...account }));

            localStorage.setItem(
                ACCOUNTS_STORAGE_KEY,
                JSON.stringify(initial)
            );

            return initial;
        }

        const parsed = JSON.parse(saved);

        if (!Array.isArray(parsed)) {
            throw new Error("بيانات الحسابات غير صحيحة");
        }

        return parsed;

    } catch (error) {

        console.error("تعذر تحميل الحسابات:", error);

        return DEFAULT_ACCOUNTS.map(account => ({ ...account }));
    }
}


function saveAccounts() {

    localStorage.setItem(
        ACCOUNTS_STORAGE_KEY,
        JSON.stringify(accounts)
    );
}


/* =========================================================
   الأدوات
========================================================= */

function getAccountTypeName(type) {
    return ACCOUNT_TYPES[type] || type;
}


function getAccountById(id) {

    return accounts.find(
        account =>
            String(account.id) === String(id)
    );
}


function getChildren(id) {

    return accounts.filter(
        account =>
            String(account.parentId) === String(id)
    );
}


function accountHasChildren(id) {
    return getChildren(id).length > 0;
}


/* إصلاح مهم جدًا */
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

function showAccountMessage(text, type = "success") {

    const message =
        document.getElementById("accountsMessage");

    if (!message) return;

    message.textContent = text;
    message.className = `message show ${type}`;

    setTimeout(function () {
        message.className = "message";
    }, 3000);
}


/* =========================================================
   نموذج الحساب
========================================================= */

function openAccountForm(parentId = null, accountId = null) {

    const box =
        document.getElementById("accountFormBox");

    const title =
        document.getElementById("accountFormTitle");

    const form =
        document.getElementById("accountForm");

    if (!box || !title || !form) return;

    form.reset();

    document.getElementById("editAccountId").value = "";

    fillParentSelect(parentId);

    if (accountId !== null) {

        const account = getAccountById(accountId);

        if (!account) return;

        title.textContent = "تعديل الحساب";

        document.getElementById("editAccountId").value =
            account.id;

        document.getElementById("accountCode").value =
            account.code;

        document.getElementById("accountName").value =
            account.name;

        document.getElementById("accountType").value =
            account.type;

        document.getElementById("accountParent").value =
            account.parentId ?? "";

    } else {

        title.textContent = "إضافة حساب جديد";
    }

    box.classList.add("show");

    document.getElementById("accountCode").focus();
}


function closeAccountForm() {

    const box =
        document.getElementById("accountFormBox");

    const form =
        document.getElementById("accountForm");

    if (box) box.classList.remove("show");

    if (form) form.reset();

    const edit =
        document.getElementById("editAccountId");

    if (edit) edit.value = "";
}


/* =========================================================
   الحساب الأب
========================================================= */

function fillParentSelect(selectedId = null) {

    const select =
        document.getElementById("accountParent");

    if (!select) return;

    const groups =
        accounts
            .filter(account => account.isGroup && account.active)
            .sort(compareAccountCodes);

    select.innerHTML = `
        <option value="">حساب رئيسي</option>
        ${groups.map(account => `
            <option value="${account.id}"
                ${String(account.id) === String(selectedId) ? "selected" : ""}>
                ${escapeHTML(account.code)} - ${escapeHTML(account.name)}
            </option>
        `).join("")}
    `;
}


/* =========================================================
   حفظ الحساب
========================================================= */

function handleAccountSubmit(event) {

    event.preventDefault();

    const editId =
        document.getElementById("editAccountId").value;

    const code =
        document.getElementById("accountCode").value.trim();

    const name =
        document.getElementById("accountName").value.trim();

    const type =
        document.getElementById("accountType").value;

    const parentValue =
        document.getElementById("accountParent").value;

    const parentId =
        parentValue ? Number(parentValue) : null;

    if (!code) {
        showAccountMessage("كود الحساب مطلوب.", "error");
        return;
    }

    if (!name) {
        showAccountMessage("اسم الحساب مطلوب.", "error");
        return;
    }

    const duplicate =
        accounts.find(
            account =>
                account.code === code &&
                String(account.id) !== String(editId)
        );

    if (duplicate) {
        showAccountMessage(
            "كود الحساب مستخدم بالفعل.",
            "error"
        );
        return;
    }


    /* تعديل */

    if (editId) {

        const account = getAccountById(editId);

        if (!account) {
            showAccountMessage(
                "الحساب غير موجود.",
                "error"
            );
            return;
        }

        if (
            parentId !== null &&
            String(parentId) === String(account.id)
        ) {
            showAccountMessage(
                "لا يمكن أن يكون الحساب أبًا لنفسه.",
                "error"
            );
            return;
        }

        if (
            parentId !== null &&
            isDescendant(account.id, parentId)
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

        if (parent && parent.type !== type) {
            showAccountMessage(
                "نوع الحساب يجب أن يتوافق مع نوع الحساب الأب.",
                "error"
            );
            return;
        }

        account.code = code;
        account.name = name;
        account.type = type;
        account.parentId = parentId;

        saveAccounts();
        renderAccounts();
        closeAccountForm();

        showAccountMessage(
            "تم تعديل الحساب بنجاح.",
            "success"
        );

        return;
    }


    /* إضافة */

    const parent =
        parentId !== null
            ? getAccountById(parentId)
            : null;

    if (parentId !== null && !parent) {
        showAccountMessage(
            "الحساب الأب غير موجود.",
            "error"
        );
        return;
    }

    if (parent && !parent.isGroup) {
        showAccountMessage(
            "لا يمكن إنشاء حساب فرعي تحت حساب حركة.",
            "error"
        );
        return;
    }

    if (parent && parent.type !== type) {
        showAccountMessage(
            "نوع الحساب يجب أن يتوافق مع نوع الحساب الأب.",
            "error"
        );
        return;
    }

    const newAccount = {
        id: Date.now(),
        code: code,
        name: name,
        type: type,
        parentId: parentId,
        isGroup: false,
        active: true
    };

    accounts.push(newAccount);

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
   التحقق من الشجرة
========================================================= */

function isDescendant(accountId, possibleChildId) {

    let current =
        getAccountById(possibleChildId);

    while (current) {

        if (
            String(current.parentId) ===
            String(accountId)
        ) {
            return true;
        }

        current =
            getAccountById(current.parentId);
    }

    return false;
}


/* =========================================================
   تعطيل / تفعيل
========================================================= */

function toggleAccount(id) {

    const account = getAccountById(id);

    if (!account) return;

    if (account.active && accountHasChildren(id)) {

        const activeChildren =
            getChildren(id)
                .filter(child => child.active);

        if (activeChildren.length) {

            showAccountMessage(
                "لا يمكن تعطيل هذا الحساب قبل تعطيل حساباته الفرعية.",
                "error"
            );

            return;
        }
    }

    account.active = !account.active;

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

    const account = getAccountById(id);

    if (!account) return;

    if (accountHasChildren(id)) {

        showAccountMessage(
            "لا يمكن حذف حساب يحتوي على حسابات فرعية.",
            "error"
        );

        return;
    }

    if (
        !confirm(
            `هل تريد حذف الحساب "${account.name}"؟`
        )
    ) {
        return;
    }

    accounts =
        accounts.filter(
            item =>
                String(item.id) !== String(id)
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
   عرض الحسابات
========================================================= */

function renderAccounts() {

    const tbody =
        document.getElementById("accountsTableBody");

    if (!tbody) return;

    const search =
        document.getElementById("accountSearch")?.value
            .trim()
            .toLowerCase() || "";

    let visibleAccounts;

    if (search) {

        visibleAccounts =
            accounts.filter(
                account =>
                    account.code.toLowerCase().includes(search) ||
                    account.name.toLowerCase().includes(search)
            );

    } else {

        visibleAccounts = getTreeOrder();
    }

    if (!visibleAccounts.length) {

        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="empty-row">
                    لا توجد حسابات
                </td>
            </tr>
        `;

        return;
    }

    tbody.innerHTML =
        visibleAccounts.map(account => {

            const parent =
                account.parentId !== null
                    ? getAccountById(account.parentId)
                    : null;

            const level =
                getAccountLevel(account);

            const statusClass =
                account.active
                    ? "status-active"
                    : "status-inactive";

            const statusText =
                account.active
                    ? "فعال"
                    : "معطل";

            const children =
                accountHasChildren(account.id);

            return `
                <tr>

                    <td class="account-level-${Math.min(level, 3)}">
                        ${account.isGroup ? "📁" : "📄"}
                        <strong>
                            ${escapeHTML(account.code)}
                        </strong>
                    </td>

                    <td class="account-level-${Math.min(level, 3)}">
                        ${escapeHTML(account.name)}
                    </td>

                    <td>
                        ${escapeHTML(
                            getAccountTypeName(account.type)
                        )}
                    </td>

                    <td>
                        ${
                            parent
                                ? `${escapeHTML(parent.code)} - ${escapeHTML(parent.name)}`
                                : "رئيسي"
                        }
                    </td>

                    <td>
                        <span class="status ${statusClass}">
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
                                account.isGroup && account.active
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

        }).join("");

    fillParentSelect();
}


/* =========================================================
   ترتيب الشجرة
========================================================= */

function getTreeOrder() {

    const result = [];

    const roots =
        accounts
            .filter(account => account.parentId === null)
            .sort(compareAccountCodes);

    function addChildren(account, level) {

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
                .sort(compareAccountCodes);

        children.forEach(
            child =>
                addChildren(child, level + 1)
        );
    }

    roots.forEach(
        root =>
            addChildren(root, 1)
    );

    return result;
}


function compareAccountCodes(a, b) {

    return a.code.localeCompare(
        b.code,
        undefined,
        { numeric: true }
    );
}


function getAccountLevel(account) {

    let level = 1;
    let current = account;

    while (current.parentId !== null) {

        level++;

        current =
            getAccountById(current.parentId);

        if (!current) break;
    }

    return level;
}


/* =========================================================
   الأحداث
========================================================= */

function setupAccountEvents() {

    const addButton =
        document.getElementById("addAccountButton");

    const cancelButton =
        document.getElementById("cancelAccount");

    const form =
        document.getElementById("accountForm");

    const search =
        document.getElementById("accountSearch");

    const tbody =
        document.getElementById("accountsTableBody");


    if (!addButton) {
        console.error("زر إضافة الحساب غير موجود");
        return;
    }

    if (!form) {
        console.error("نموذج الحساب غير موجود");
        return;
    }

    /* منع تكرار ربط الأحداث */
    if (addButton.dataset.eventsReady === "true") {
        return;
    }

    addButton.dataset.eventsReady = "true";


    addButton.addEventListener("click", function () {

        console.log("تم الضغط على إضافة حساب");

        openAccountForm();

    });


    if (cancelButton) {

        cancelButton.addEventListener(
            "click",
            closeAccountForm
        );

    }


    form.addEventListener(
        "submit",
        handleAccountSubmit
    );


    if (search) {

        search.addEventListener(
            "input",
            renderAccounts
        );

    }


    if (tbody) {

        tbody.addEventListener(
            "click",
            function (event) {

                const button =
                    event.target.closest("button");

                if (!button) return;

                const action =
                    button.dataset.action;

                const id =
                    button.dataset.id;

                if (action === "edit") {
                    openAccountForm(null, id);
                }

                if (action === "add-child") {
                    openAccountForm(id, null);
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

}


/* =========================================================
   التشغيل
========================================================= */

function initializeAccounts() {

    console.log("تهيئة شجرة الحسابات...");

    renderAccounts();
    setupAccountEvents();

    console.log("شجرة الحسابات جاهزة");

}


if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        initializeAccounts
    );

} else {

    initializeAccounts();

}
