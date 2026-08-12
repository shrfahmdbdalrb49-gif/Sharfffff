cat > accounts.js << EOF 
/* =====================================================
   شرف ERP - شجرة الحسابات
   تخزين مؤقت محلي حتى نربط قاعدة البيانات لاحقًا
===================================================== */

const ACCOUNTS_KEY = "sharaf_accounts_v1";


const defaultAccounts = [
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
    }
];


let accounts = loadAccounts();


function loadAccounts() {

    try {

        const saved =
            localStorage.getItem(ACCOUNTS_KEY);

        if (!saved) {
            return [...defaultAccounts];
        }

        const parsed = JSON.parse(saved);

        return Array.isArray(parsed)
            ? parsed
            : [...defaultAccounts];

    } catch (error) {

        console.error(
            "خطأ في تحميل شجرة الحسابات:",
            error
        );

        return [...defaultAccounts];
    }
}


function saveAccounts() {

    localStorage.setItem(
        ACCOUNTS_KEY,
        JSON.stringify(accounts)
    );

}


function accountTypeName(type) {

    const names = {
        asset: "أصول",
        liability: "خصوم",
        equity: "حقوق ملكية",
        revenue: "إيرادات",
        expense: "مصروفات"
    };

    return names[type] || type;
}


function buildAccountsPage() {

    const page =
        document.getElementById("accounts");

    if (!page) {
        return;
    }


    page.innerHTML = `

        <div class="accounts-header">

            <div>

                <h2>
                    شجرة الحسابات
                </h2>

                <p>
                    دليل الحسابات المحاسبي للنظام
                </p>

            </div>

            <div class="accounts-actions">

                <button
                    id="add-root-account"
                    class="account-btn primary"
                >
                    + حساب رئيسي
                </button>

            </div>

        </div>


        <div
            id="accounts-message"
            class="accounts-message"
        ></div>


        <div class="accounts-layout">

            <div class="accounts-panel">

                <div class="accounts-panel-title">
                    الحسابات
                </div>

                <div
                    id="account-tree"
                    class="account-tree"
                ></div>

            </div>


            <div
                id="account-form-panel"
                class="accounts-panel account-form-panel hidden"
            >

                <div class="accounts-panel-title">
                    إضافة حساب
                </div>

                <form id="account-form">

                    <div class="account-field">

                        <label>
                            نوع الإضافة
                        </label>

                        <select id="account-mode">

                            <option value="child">
                                حساب فرعي
                            </option>

                            <option value="root">
                                حساب رئيسي
                            </option>

                        </select>

                    </div>


                    <div
                        class="account-field"
                        id="parent-account-field"
                    >

                        <label>
                            الحساب الأب
                        </label>

                        <select id="account-parent"></select>

                    </div>


                    <div class="account-field">

                        <label>
                            كود الحساب
                        </label>

                        <input
                            id="account-code"
                            required
                        >

                    </div>


                    <div class="account-field">

                        <label>
                            اسم الحساب
                        </label>

                        <input
                            id="account-name"
                            required
                        >

                    </div>


                    <div class="account-field">

                        <label>
                            نوع الحساب
                        </label>

                        <select id="account-type">

                            <option value="asset">
                                أصول
                            </option>

                            <option value="liability">
                                خصوم
                            </option>

                            <option value="equity">
                                حقوق ملكية
                            </option>

                            <option value="revenue">
                                إيرادات
                            </option>

                            <option value="expense">
                                مصروفات
                            </option>

                        </select>

                    </div>


                    <div class="account-field">

                        <label>
                            طبيعة الحساب
                        </label>

                        <select id="account-group">

                            <option value="0">
                                حساب حركة
                            </option>

                            <option value="1">
                                حساب تجميعي
                            </option>

                        </select>

                    </div>


                    <div class="account-form-buttons">

                        <button
                            type="submit"
                            class="account-btn success"
                        >
                            حفظ الحساب
                        </button>

                        <button
                            type="button"
                            id="cancel-account"
                            class="account-btn secondary"
                        >
                            إلغاء
                        </button>

                    </div>

                </form>

            </div>

        </div>
    `;


    setupAccountEvents();

    renderAccountTree();

}


function setupAccountEvents() {

    document
        .getElementById("add-root-account")
        .addEventListener(
            "click",
            () => openAccountForm("root")
        );


    document
        .getElementById("cancel-account")
        .addEventListener(
            "click",
            closeAccountForm
        );


    document
        .getElementById("account-mode")
        .addEventListener(
            "change",
            updateParentField
        );


    document
        .getElementById("account-form")
        .addEventListener(
            "submit",
            saveNewAccount
        );


    document
        .getElementById("account-tree")
        .addEventListener(
            "click",
            handleTreeAction
        );


    updateParentField();

}


function openAccountForm(mode, parentId = null) {

    const panel =
        document.getElementById(
            "account-form-panel"
        );

    const modeSelect =
        document.getElementById(
            "account-mode"
        );

    const parentSelect =
        document.getElementById(
            "account-parent"
        );


    panel.classList.remove("hidden");


    modeSelect.value = mode;


    fillParentAccounts(parentId);


    updateParentField();


    document
        .getElementById(
            "account-code"
        )
        .focus();

}


function closeAccountForm() {

    document
        .getElementById(
            "account-form-panel"
        )
        .classList.add("hidden");


    document
        .getElementById(
            "account-form"
        )
        .reset();


    updateParentField();

}


function updateParentField() {

    const mode =
        document.getElementById(
            "account-mode"
        ).value;

    const field =
        document.getElementById(
            "parent-account-field"
        );


    if (mode === "root") {

        field.classList.add("hidden");

    } else {

        field.classList.remove("hidden");

        fillParentAccounts();

    }

}


function fillParentAccounts(selectedId = null) {

    const select =
        document.getElementById(
            "account-parent"
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
            اختر الحساب الأب
        </option>

        ${groups.map(
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
                    ${account.code}
                    -
                    ${escapeAccountText(account.name)}
                </option>
            `
        ).join("")}

    `;

}


function saveNewAccount(event) {

    event.preventDefault();


    const mode =
        document.getElementById(
            "account-mode"
        ).value;


    const parentId =
        mode === "child"
            ? document.getElementById(
                "account-parent"
              ).value
            : null;


    const code =
        document.getElementById(
            "account-code"
        ).value
        .trim();


    const name =
        document.getElementById(
            "account-name"
        ).value
        .trim();


    const type =
        document.getElementById(
            "account-type"
        ).value;


    const isGroup =
        document.getElementById(
            "account-group"
        ).value === "1";


    if (!code || !name) {

        showAccountMessage(
            "الكود واسم الحساب مطلوبان.",
            "error"
        );

        return;
    }


    if (
        accounts.some(
            account =>
                account.code === code
        )
    ) {

        showAccountMessage(
            "كود الحساب مستخدم بالفعل.",
            "error"
        );

        return;
    }


    if (
        mode === "child" &&
        !parentId
    ) {

        showAccountMessage(
            "اختر الحساب الأب.",
            "error"
        );

        return;
    }


    if (
        mode === "child"
    ) {

        const parent =
            accounts.find(
                account =>
                    String(account.id) ===
                    String(parentId)
            );


        if (!parent) {

            showAccountMessage(
                "الحساب الأب غير موجود.",
                "error"
            );

            return;
        }


        if (!parent.isGroup) {

            showAccountMessage(
                "لا يمكن إضافة حساب فرعي تحت حساب حركة.",
                "error"
            );

            return;
        }


        if (
            parent.type !== type
        ) {

            showAccountMessage(
                "يجب أن يكون نوع الحساب الفرعي متوافقًا مع الحساب الأب.",
                "error"
            );

            return;
        }

    }


    const account = {

        id:
            Date.now(),

        code,

        name,

        type,

        parentId:
            parentId
                ? Number(parentId)
                : null,

        isGroup,

        active: true

    };


    accounts.push(account);


    saveAccounts();


    renderAccountTree();

    fillParentAccounts();


    closeAccountForm();


    showAccountMessage(
        "تم إنشاء الحساب بنجاح.",
        "success"
    );

}


function renderAccountTree() {

    const tree =
        document.getElementById(
            "account-tree"
        );

    if (!tree) {
        return;
    }


    const roots =
        accounts.filter(
            account =>
                account.parentId === null
        );


    tree.innerHTML =
        roots
            .map(
                root =>
                    renderAccountNode(root, 0)
            )
            .join("");


}


function renderAccountNode(
    account,
    level
) {

    const children =
        accounts.filter(
            child =>
                String(child.parentId) ===
                String(account.id)
        );


    const indent =
        level * 24;


    return `

        <div class="account-node">

            <div
                class="account-row"
                style="padding-right:${indent}px"
            >

                <div class="account-name-area">

                    <span class="account-icon">
                        ${
                            account.isGroup
                                ? "📁"
                                : "📄"
                        }
                    </span>

                    <strong>
                        ${account.code}
                    </strong>

                    <span>
                        ${escapeAccountText(
                            account.name
                        )}
                    </span>

                    <small>
                        ${accountTypeName(
                            account.type
                        )}
                    </small>

                    ${
                        !account.active
                            ? `
                                <span class="inactive-badge">
                                    معطل
                                </span>
                            `
                            : ""
                    }

                </div>


                <div class="account-actions">

                    ${
                        account.isGroup &&
                        account.active
                            ? `
                                <button
                                    class="tree-btn add"
                                    data-action="add"
                                    data-id="${account.id}"
                                >
                                    + فرعي
                                </button>
                            `
                            : ""
                    }


                    <button
                        class="tree-btn toggle"
                        data-action="toggle"
                        data-id="${account.id}"
                    >
                        ${
                            account.active
                                ? "تعطيل"
                                : "تفعيل"
                        }
                    </button>

                </div>

            </div>


            ${
                children.length
                    ? `
                        <div class="account-children">

                            ${children
                                .map(
                                    child =>
                                        renderAccountNode(
                                            child,
                                            level + 1
                                        )
                                )
                                .join("")}

                        </div>
                    `
                    : ""
            }

        </div>

    `;

}


function handleTreeAction(event) {

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


    const account =
        accounts.find(
            item =>
                String(item.id) ===
                String(id)
        );


    if (!account) {
        return;
    }


    if (action === "add") {

        openAccountForm(
            "child",
            account.id
        );

        document
            .getElementById(
                "account-parent"
            ).value =
            account.id;

        updateParentField();

    }


    if (action === "toggle") {

        account.active =
            !account.active;


        saveAccounts();

        renderAccountTree();

        showAccountMessage(
            account.active
                ? "تم تفعيل الحساب."
                : "تم تعطيل الحساب.",
            "success"
        );

    }

}


function showAccountMessage(
    message,
    type
) {

    const element =
        document.getElementById(
            "accounts-message"
        );


    if (!element) {
        return;
    }


    element.textContent =
        message;


    element.className =
        `accounts-message show ${type}`;


    setTimeout(
        () => {
            element.className =
                "accounts-message";
        },
        3000
    );

}


function escapeAccountText(value) {

    return String(value || "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll( " , "&quot;")
        .replaceAll(" ", "&#039;");

}


/* =====================================================
   إضافة التصميم الخاص بالشجرة
===================================================== */

function addAccountStyles() {

    if (
        document.getElementById(
            "account-styles"
        )
    ) {
        return;
    }


    const style =
        document.createElement("style");


    style.id =
        "account-styles";


    style.textContent = `

        .accounts-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 15px;
            margin-bottom: 20px;
        }

        .accounts-header h2 {
            margin: 0 0 5px;
        }

        .accounts-header p {
            margin: 0;
            color: #64748b;
            font-size: 13px;
        }

        .account-btn {
            border: none;
            border-radius: 7px;
            padding: 10px 15px;
            font-size: 13px;
            cursor: pointer;
        }

        .account-btn.primary {
            background: #2563eb;
            color: white;
        }

        .account-btn.success {
            background: #16a34a;
            color: white;
        }

        .account-btn.secondary {
            background: #e5e7eb;
            color: #374151;
        }

        .accounts-layout {
            display: grid;
            grid-template-columns: 1fr 360px;
            gap: 18px;
        }

        .accounts-panel {
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 10px;
            overflow: hidden;
        }

        .accounts-panel-title {
            padding: 15px 17px;
            border-bottom: 1px solid #e2e8f0;
            font-weight: bold;
        }

        .account-tree {
            padding: 10px;
        }

        .account-row {
            min-height: 48px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 10px;
            border-bottom: 1px solid #f1f5f9;
        }

        .account-row:hover {
            background: #f8fafc;
        }

        .account-name-area {
            display: flex;
            align-items: center;
            gap: 8px;
            min-width: 0;
        }

        .account-name-area strong {
            color: #1e3a8a;
        }

        .account-name-area small {
            color: #64748b;
            font-size: 11px;
            background: #f1f5f9;
            padding: 3px 6px;
            border-radius: 10px;
        }

        .account-icon {
            width: 22px;
        }

        .account-actions {
            display: flex;
            gap: 5px;
            flex-shrink: 0;
        }

        .tree-btn {
            border: 0;
            border-radius: 5px;
            padding: 5px 8px;
            font-size: 11px;
            cursor: pointer;
        }

        .tree-btn.add {
            background: #dbeafe;
            color: #1d4ed8;
        }

        .tree-btn.toggle {
            background: #f1f5f9;
            color: #475569;
        }

        .account-form-panel {
            padding-bottom: 15px;
        }

        .account-form-panel.hidden {
            display: none;
        }

        .account-field {
            padding: 0 15px;
            margin-top: 15px;
        }

        .account-field label {
            display: block;
            font-size: 12px;
            font-weight: bold;
            color: #475569;
            margin-bottom: 6px;
        }

        .account-field input,
        .account-field select {
            width: 100%;
            padding: 10px;
            border: 1px solid #cbd5e1;
            border-radius: 7px;
            outline: none;
            background: white;
        }

        .account-field input:focus,
        .account-field select:focus {
            border-color: #2563eb;
        }

        .account-form-buttons {
            display: flex;
            gap: 8px;
            padding: 18px 15px 0;
        }

        .accounts-message {
            display: none;
            padding: 11px 14px;
            border-radius: 7px;
            margin-bottom: 15px;
            font-size: 13px;
        }

        .accounts-message.show {
            display: block;
        }

        .accounts-message.success {
            background: #dcfce7;
            color: #166534;
        }

        .accounts-message.error {
            background: #fee2e2;
            color: #991b1b;
        }

        .inactive-badge {
            color: #991b1b;
            background: #fee2e2;
            font-size: 10px;
            padding: 3px 6px;
            border-radius: 10px;
        }

        @media (max-width: 900px) {

            .accounts-layout {
                grid-template-columns: 1fr;
            }

        }

        @media (max-width: 600px) {

            .account-row {
                align-items: flex-start;
                flex-direction: column;
                padding: 10px 5px;
            }

            .account-actions {
                width: 100%;
            }

        }
    `;


    document.head.appendChild(style);

}


/* =====================================================
   التشغيل
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        addAccountStyles();

        buildAccountsPage();

    }
);
EOF
