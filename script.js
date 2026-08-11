// إظهار وإخفاء الأقسام
function showSection(sectionId) {
    document.querySelectorAll( .section ).forEach(s => s.classList.remove( active ));
    document.getElementById(sectionId).classList.add( active );
    
    // تحديث المحتوى
    if (sectionId ===  chart ) updateChartOfAccounts();
    if (sectionId ===  ledger ) updateLedger();
    if (sectionId ===  trial ) updateTrialBalance();
}

// قاعدة بيانات بسيطة في الذاكرة
const accounts = [
    { code:  1001 , name:  الصندوق , type:  أصول  },
    { code:  1002 , name:  البنك , type:  أصول  },
    { code:  2001 , name:  الموردين , type:  خصوم  },
    { code:  3001 , name:  المبيعات , type:  إيرادات  },
    { code:  4001 , name:  الإيجار , type:  مصروفات  }
];

let journalEntries = JSON.parse(localStorage.getItem( entries ) ||  [] );

// معالجة نموذج القيد
document.getElementById( journalForm ).addEventListener( submit , function(e) {
    e.preventDefault();
    
    const debitAccount = document.getElementById( debitAccount ).value;
    const debitAmount = parseFloat(document.getElementById( debitAmount ).value);
    const creditAccount = document.getElementById( creditAccount ).value;
    const creditAmount = parseFloat(document.getElementById( creditAmount ).value);
    const description = document.getElementById( description ).value;
    const date = document.getElementById( entryDate ).value;
    
    if (!debitAmount || !creditAmount) {
        alert( الرجاء إدخال المبالغ );
        return;
    }
    
    if (debitAccount === creditAccount) {
        alert( لا يمكن أن يكون الحساب المدين هو نفسه الحساب الدائن );
        return;
    }
    
    const entry = {
        id: Date.now(),
        number:  قيد-  + (journalEntries.length + 1),
        date: date,
        description: description,
        debitAccount: debitAccount,
        creditAccount: creditAccount,
        debitAmount: debitAmount,
        creditAmount: creditAmount
    };
    
    journalEntries.unshift(entry);
    localStorage.setItem( entries , JSON.stringify(journalEntries));
    
    displayEntries();
    this.reset();
    alert( ✅ تم تسجيل القيد بنجاح );
});

// عرض القيود
function displayEntries() {
    const container = document.getElementById( entries );
    container.innerHTML =  <h3 style="margin-top:20px">القيود المسجلة</h3> ;
    
    journalEntries.forEach(entry => {
        const debitAcc = accounts.find(a => a.code === entry.debitAccount);
        const creditAcc = accounts.find(a => a.code === entry.creditAccount);
        
        container.innerHTML += `
            <div class="entry-card">
                <span class="entry-number">${entry.number}</span> - ${entry.date}
                <p>${entry.description}</p>
                <p>من حـ / ${debitAcc.name} <span class="debit">${entry.debitAmount}</span></p>
                <p>إلى حـ / ${creditAcc.name} <span class="credit">${entry.creditAmount}</span></p>
            </div>
        `;
    });
}

// عرض شجرة الحسابات
function updateChartOfAccounts() {
    const container = document.getElementById( chartContent );
    let html =  <table><tr><th>الكود</th><th>الاسم</th><th>النوع</th></tr> ;
    
    accounts.forEach(acc => {
        html += `<tr><td>${acc.code}</td><td>${acc.name}</td><td>${acc.type}</td></tr>`;
    });
    
    html +=  </table> ;
    container.innerHTML = html;
}

// عرض الأستاذ العام
function updateLedger() {
    const container = document.getElementById( ledgerContent );
    let html =   ;
    
    accounts.forEach(acc => {
        html += `<h4>${acc.code} - ${acc.name}</h4><table>
            <tr><th>التاريخ</th><th>البيان</th><th>مدين</th><th>دائن</th></tr>`;
        
        let hasEntries = false;
        journalEntries.forEach(entry => {
            if (entry.debitAccount === acc.code) {
                html += `<tr><td>${entry.date}</td><td>${entry.description}</td>
                    <td class="debit">${entry.debitAmount}</td><td>0</td></tr>`;
                hasEntries = true;
            }
            if (entry.creditAccount === acc.code) {
                html += `<tr><td>${entry.date}</td><td>${entry.description}</td>
                    <td>0</td><td class="credit">${entry.creditAmount}</td></tr>`;
                hasEntries = true;
            }
        });
        
        if (!hasEntries) html +=  <tr><td colspan="4">لا توجد حركات</td></tr> ;
        html +=  </table><br> ;
    });
    
    container.innerHTML = html;
}

// عرض ميزان المراجعة
function updateTrialBalance() {
    const container = document.getElementById( trialContent );
    let balances = {};
    
    accounts.forEach(acc => {
        balances[acc.code] = { name: acc.name, debit: 0, credit: 0 };
    });
    
    journalEntries.forEach(entry => {
        if (balances[entry.debitAccount]) {
            balances[entry.debitAccount].debit += entry.debitAmount;
        }
        if (balances[entry.creditAccount]) {
            balances[entry.creditAccount].credit += entry.creditAmount;
        }
    });
    
    let html =  <table><tr><th>الحساب</th><th>مدين</th><th>دائن</th></tr> ;
    let totalDebit = 0, totalCredit = 0;
    
    for (let code in balances) {
        const b = balances[code];
        html += `<tr><td>${b.name}</td>
            <td class="debit">${b.debit}</td>
            <td class="credit">${b.credit}</td></tr>`;
        totalDebit += b.debit;
        totalCredit += b.credit;
    }
    
    html += `<tr style="font-weight:bold; background:#f5f5f5">
        <td>المجموع</td>
        <td>${totalDebit}</td>
        <td>${totalCredit}</td></tr></table>`;
    
    container.innerHTML = html;
}

// تحميل القيود عند البدء
displayEntries();
