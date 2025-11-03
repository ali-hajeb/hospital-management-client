// متغیرهای سراسری برای ذخیره داده‌ها
let hospitalData = [];
const API_URL = 'http://10.3.10.12:4000/api/v1';

function refreshData(data) {
    hospitalData = [...data];
    updateAllTables();
}

function getReportsFromDatabase() {
    fetch(`${API_URL}/reports`)
        .then((res) => res.json())
        .then((data) => {
            refreshData(data.reports)
        })
        .catch((error) => {
            console.error(error);
        })
}

function submitNewReport(data) {
    fetch(`${API_URL}/reports`, { 
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data) 
    }).then((res) => res.json())
        .then(({ report }) => {
            console.log(report, data);
            hospitalData.push(report);
            updateAllTables();

            // نمایش پیام موفقیت
            showSuccessMessage();

            // پاک کردن فرم
            resetForm();
        })
        .catch((error) => {
            console.error(error);
        })
}

// محاسبه خودکار جمع کل‌ها
function setupAutoCalculation() {
    // هزینه‌های سربار
    const overheadInputs = ['drugCost', 'medicalSupplies', 'vehicleCost', 'contractForces', 
        'foodCost', 'facilitiesSupport', 'itSupport', 'overheadKaraneh',
        'officeRepairs', 'transportation', 'otherOverhead'];

    overheadInputs.forEach(id => {
        document.getElementById(id).addEventListener('input', calculateTotalOverhead);
    });

    // هزینه‌های پرسنلی
    const personnelInputs = ['treasurySalary', 'hourlyDoctors', 'doctorKaraneh', 'staffKaraneh',
        'nurseKaraneh', 'overtime', 'salaryAdjustment', 'technicalFee',
        'welfare', 'insurance', 'otherPersonnel'];

    personnelInputs.forEach(id => {
        document.getElementById(id).addEventListener('input', calculateTotalPersonnel);
    });

    // درآمدها
    const revenueInputs = ['treatmentRevenue', 'drugRevenue', 'rentRevenue', 
        'wasteRevenue', 'otherRevenue'];

    revenueInputs.forEach(id => {
        document.getElementById(id).addEventListener('input', calculateTotalRevenue);
    });
}

function calculateTotalOverhead() {
    const values = [
        parseFloat(document.getElementById('drugCost').value) || 0,
        parseFloat(document.getElementById('medicalSupplies').value) || 0,
        parseFloat(document.getElementById('vehicleCost').value) || 0,
        parseFloat(document.getElementById('contractForces').value) || 0,
        parseFloat(document.getElementById('foodCost').value) || 0,
        parseFloat(document.getElementById('facilitiesSupport').value) || 0,
        parseFloat(document.getElementById('itSupport').value) || 0,
        parseFloat(document.getElementById('overheadKaraneh').value) || 0,
        parseFloat(document.getElementById('officeRepairs').value) || 0,
        parseFloat(document.getElementById('transportation').value) || 0,
        parseFloat(document.getElementById('otherOverhead').value) || 0
    ];

    const total = values.reduce((sum, val) => sum + val, 0);
    document.getElementById('totalOverhead').value = total.toFixed(2);
}

function calculateTotalPersonnel() {
    const values = [
        parseFloat(document.getElementById('treasurySalary').value) || 0,
        parseFloat(document.getElementById('hourlyDoctors').value) || 0,
        parseFloat(document.getElementById('doctorKaraneh').value) || 0,
        parseFloat(document.getElementById('staffKaraneh').value) || 0,
        parseFloat(document.getElementById('nurseKaraneh').value) || 0,
        parseFloat(document.getElementById('overtime').value) || 0,
        parseFloat(document.getElementById('salaryAdjustment').value) || 0,
        parseFloat(document.getElementById('technicalFee').value) || 0,
        parseFloat(document.getElementById('welfare').value) || 0,
        parseFloat(document.getElementById('insurance').value) || 0,
        parseFloat(document.getElementById('otherPersonnel').value) || 0
    ];

    const total = values.reduce((sum, val) => sum + val, 0);
    document.getElementById('totalPersonnel').value = total.toFixed(2);
}

function calculateTotalRevenue() {
    const values = [
        parseFloat(document.getElementById('treatmentRevenue').value) || 0,
        parseFloat(document.getElementById('drugRevenue').value) || 0,
        parseFloat(document.getElementById('rentRevenue').value) || 0,
        parseFloat(document.getElementById('wasteRevenue').value) || 0,
        parseFloat(document.getElementById('otherRevenue').value) || 0
    ];

    const total = values.reduce((sum, val) => sum + val, 0);
    document.getElementById('totalRevenue').value = total.toFixed(2);
}

// نمایش بخش‌های مختلف
function showSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');

    const buttons = document.querySelectorAll('.nav-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
}

// ذخیره داده‌ها
function saveData() {
    const fiscalYear = document.getElementById('fiscalYear').value;
    const hospital = document.getElementById('hospital').value;

    if (!fiscalYear) {
        alert('لطفاً ابتدا سال مالی را انتخاب کنید');
        return;
    }

    if (!hospital) {
        alert('لطفاً بیمارستان را انتخاب کنید');
        return;
    }

    const data = {
        fiscalYear: fiscalYear,
        hospital: hospital,
        date: new Date().toLocaleDateString('fa-IR'),
        medical: {
            approvedBeds: parseFloat(document.getElementById('approvedBeds').value) || 0,
            activeBeds: parseFloat(document.getElementById('activeBeds').value) || 0,
            occupancyRate: parseFloat(document.getElementById('occupancyRate').value) || 0,
            outpatients: parseFloat(document.getElementById('outpatients').value) || 0,
            inpatients: parseFloat(document.getElementById('inpatients').value) || 0
        },
        overhead: {
            drugCost: parseFloat(document.getElementById('drugCost').value) || 0,
            medicalSupplies: parseFloat(document.getElementById('medicalSupplies').value) || 0,
            vehicleCost: parseFloat(document.getElementById('vehicleCost').value) || 0,
            contractForces: parseFloat(document.getElementById('contractForces').value) || 0,
            foodCost: parseFloat(document.getElementById('foodCost').value) || 0,
            facilitiesSupport: parseFloat(document.getElementById('facilitiesSupport').value) || 0,
            itSupport: parseFloat(document.getElementById('itSupport').value) || 0,
            overheadKaraneh: parseFloat(document.getElementById('overheadKaraneh').value) || 0,
            officeRepairs: parseFloat(document.getElementById('officeRepairs').value) || 0,
            transportation: parseFloat(document.getElementById('transportation').value) || 0,
            otherOverhead: parseFloat(document.getElementById('otherOverhead').value) || 0,
            total: parseFloat(document.getElementById('totalOverhead').value) || 0
        },
        personnel: {
            treasurySalary: parseFloat(document.getElementById('treasurySalary').value) || 0,
            hourlyDoctors: parseFloat(document.getElementById('hourlyDoctors').value) || 0,
            doctorKaraneh: parseFloat(document.getElementById('doctorKaraneh').value) || 0,
            staffKaraneh: parseFloat(document.getElementById('staffKaraneh').value) || 0,
            nurseKaraneh: parseFloat(document.getElementById('nurseKaraneh').value) || 0,
            overtime: parseFloat(document.getElementById('overtime').value) || 0,
            salaryAdjustment: parseFloat(document.getElementById('salaryAdjustment').value) || 0,
            technicalFee: parseFloat(document.getElementById('technicalFee').value) || 0,
            welfare: parseFloat(document.getElementById('welfare').value) || 0,
            insurance: parseFloat(document.getElementById('insurance').value) || 0,
            otherPersonnel: parseFloat(document.getElementById('otherPersonnel').value) || 0,
            total: parseFloat(document.getElementById('totalPersonnel').value) || 0
        },
        revenue: {
            treatmentRevenue: parseFloat(document.getElementById('treatmentRevenue').value) || 0,
            drugRevenue: parseFloat(document.getElementById('drugRevenue').value) || 0,
            rentRevenue: parseFloat(document.getElementById('rentRevenue').value) || 0,
            wasteRevenue: parseFloat(document.getElementById('wasteRevenue').value) || 0,
            otherRevenue: parseFloat(document.getElementById('otherRevenue').value) || 0,
            total: parseFloat(document.getElementById('totalRevenue').value) || 0
        }
    };

    submitNewReport(data);

    // hospitalData.push(data);
    // localStorage.setItem('hospitalData', JSON.stringify(hospitalData));
    // updateAllTables();

    // نمایش پیام موفقیت
    // showSuccessMessage();

    // پاک کردن فرم
    // resetForm();

}

function showSuccessMessage() {
    const existingAlert = document.querySelector('.alert');
    if (existingAlert) {
        existingAlert.remove();
    }

    const alert = document.createElement('div');
    alert.className = 'alert alert-success';
    alert.textContent = '✅ گزارش با موفقیت ثبت شد';

    const container = document.querySelector('.container');
    container.insertBefore(alert, container.firstChild);

    setTimeout(() => {
        alert.remove();
    }, 3000);
}

// به‌روزرسانی تمام جداول
function updateAllTables() {
    updateMedicalDataTable();
    updateOverheadCostsTable();
    updatePersonnelCostsTable();
    updateRevenuesTable();
    updateReportCards();
    updateProfitLossReport();
}

function updateMedicalDataTable() {
    const tbody = document.getElementById('medicalDataBody');

    if (hospitalData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8">هنوز اطلاعاتی ثبت نشده است</td></tr>';
        return;
    }

    tbody.innerHTML = hospitalData.map(data => `
<tr>
    <td><span class="fiscal-year-badge">${data.fiscalYear}</span></td>
    <td>${data.hospital}</td>
    <td>${data.medical.approvedBeds.toLocaleString()}</td>
    <td>${data.medical.activeBeds.toLocaleString()}</td>
    <td>${data.medical.occupancyRate}%</td>
    <td>${data.medical.outpatients.toLocaleString()}</td>
    <td>${data.medical.inpatients.toLocaleString()}</td>
    <td>${data.date}</td>
</tr>
`).join('');
}

function updateOverheadCostsTable() {
    const tbody = document.getElementById('overheadCostsBody');

    if (hospitalData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="10">هنوز اطلاعاتی ثبت نشده است</td></tr>';
        return;
    }

    tbody.innerHTML = hospitalData.map(data => `
<tr>
    <td><span class="fiscal-year-badge">${data.fiscalYear}</span></td>
    <td>${data.hospital}</td>
    <td>${data.overhead.drugCost.toLocaleString()}</td>
    <td>${data.overhead.medicalSupplies.toLocaleString()}</td>
    <td>${data.overhead.vehicleCost.toLocaleString()}</td>
    <td>${data.overhead.contractForces.toLocaleString()}</td>
    <td>${data.overhead.foodCost.toLocaleString()}</td>
    <td>${data.overhead.otherOverhead.toLocaleString()}</td>
    <td><strong>${data.overhead.total.toLocaleString()}</strong></td>
    <td>${data.date}</td>
</tr>
`).join('');
}

function updatePersonnelCostsTable() {
    const tbody = document.getElementById('personnelCostsBody');

    if (hospitalData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="11">هنوز اطلاعاتی ثبت نشده است</td></tr>';
        return;
    }

    tbody.innerHTML = hospitalData.map(data => `
<tr>
    <td><span class="fiscal-year-badge">${data.fiscalYear}</span></td>
    <td>${data.hospital}</td>
    <td>${data.personnel.treasurySalary.toLocaleString()}</td>
    <td>${data.personnel.hourlyDoctors.toLocaleString()}</td>
    <td>${data.personnel.doctorKaraneh.toLocaleString()}</td>
    <td>${data.personnel.staffKaraneh.toLocaleString()}</td>
    <td>${data.personnel.overtime.toLocaleString()}</td>
    <td>${data.personnel.insurance.toLocaleString()}</td>
    <td>${data.personnel.otherPersonnel.toLocaleString()}</td>
    <td><strong>${data.personnel.total.toLocaleString()}</strong></td>
    <td>${data.date}</td>
</tr>
`).join('');
}

function updateRevenuesTable() {
    const tbody = document.getElementById('revenuesBody');

    if (hospitalData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9">هنوز اطلاعاتی ثبت نشده است</td></tr>';
        return;
    }

    tbody.innerHTML = hospitalData.map(data => `
<tr>
    <td><span class="fiscal-year-badge">${data.fiscalYear}</span></td>
    <td>${data.hospital}</td>
    <td>${data.revenue.treatmentRevenue.toLocaleString()}</td>
    <td>${data.revenue.drugRevenue.toLocaleString()}</td>
    <td>${data.revenue.rentRevenue.toLocaleString()}</td>
    <td>${data.revenue.wasteRevenue.toLocaleString()}</td>
    <td>${data.revenue.otherRevenue.toLocaleString()}</td>
    <td><strong>${data.revenue.total.toLocaleString()}</strong></td>
    <td>${data.date}</td>
</tr>
`).join('');
}

function updateReportCards() {
    const container = document.getElementById('reportCardsContainer');

    if (hospitalData.length === 0) {
        container.innerHTML = '<p style="text-align: center; padding: 40px; color: #6c757d;">هنوز گزارشی ثبت نشده است</p>';
        return;
    }

    container.innerHTML = hospitalData.map(data => {
        const totalCosts = data.overhead.total + data.personnel.total;
        const profitLoss = data.revenue.total - totalCosts;
        const profitLossPercent = data.revenue.total > 0 ? ((profitLoss / data.revenue.total) * 100).toFixed(2) : 0;
        const isProfitable = profitLoss >= 0;

        return `
<div class="report-card">
<h4>🏥 ${data.hospital} <span class="fiscal-year-badge">${data.fiscalYear}</span> - ${data.date}</h4>

<div class="report-section">
<div class="report-section-title">📊 اطلاعات درمانی کل</div>
<div class="report-grid">
<div class="report-item">
<span class="report-item-label">تخت مصوب:</span>
<span class="report-item-value">${data.medical.approvedBeds.toLocaleString()}</span>
</div>
<div class="report-item">
<span class="report-item-label">تخت فعال:</span>
<span class="report-item-value">${data.medical.activeBeds.toLocaleString()}</span>
</div>
<div class="report-item">
<span class="report-item-label">ضریب اشغال تخت:</span>
<span class="report-item-value">${data.medical.occupancyRate}%</span>
</div>
<div class="report-item">
<span class="report-item-label">بیماران سرپایی:</span>
<span class="report-item-value">${data.medical.outpatients.toLocaleString()}</span>
</div>
<div class="report-item">
<span class="report-item-label">بیماران بستری:</span>
<span class="report-item-value">${data.medical.inpatients.toLocaleString()}</span>
</div>
</div>
</div>

<div class="report-section">
<div class="report-section-title">💵 جزئیات درآمدها (میلیون ریال)</div>
<div class="report-grid">
<div class="report-item">
<span class="report-item-label">درآمد درمان:</span>
<span class="report-item-value">${data.revenue.treatmentRevenue.toLocaleString()}</span>
</div>
<div class="report-item">
<span class="report-item-label">درآمد دارو:</span>
<span class="report-item-value">${data.revenue.drugRevenue.toLocaleString()}</span>
</div>
<div class="report-item">
<span class="report-item-label">درآمد اجاره:</span>
<span class="report-item-value">${data.revenue.rentRevenue.toLocaleString()}</span>
</div>
<div class="report-item">
<span class="report-item-label">فروش ضایعات:</span>
<span class="report-item-value">${data.revenue.wasteRevenue.toLocaleString()}</span>
</div>
<div class="report-item">
<span class="report-item-label">سایر درآمدها:</span>
<span class="report-item-value">${data.revenue.otherRevenue.toLocaleString()}</span>
</div>
<div class="report-item" style="background: #e7f3ff; border: 2px solid #0066cc;">
<span class="report-item-label" style="color: #0066cc;">💰 جمع کل درآمد:</span>
<span class="report-item-value" style="color: #0066cc; font-size: 1.2em;">${data.revenue.total.toLocaleString()}</span>
</div>
</div>
</div>

<div class="report-section">
<div class="report-section-title">💰 جزئیات هزینه‌های سربار (میلیون ریال)</div>
<div class="report-grid">
<div class="report-item">
<span class="report-item-label">دارو و مکمل:</span>
<span class="report-item-value">${data.overhead.drugCost.toLocaleString()}</span>
</div>
<div class="report-item">
<span class="report-item-label">لوازم پزشکی:</span>
<span class="report-item-value">${data.overhead.medicalSupplies.toLocaleString()}</span>
</div>
<div class="report-item">
<span class="report-item-label">خودرو:</span>
<span class="report-item-value">${data.overhead.vehicleCost.toLocaleString()}</span>
</div>
<div class="report-item">
<span class="report-item-label">نیروی شرکتی:</span>
<span class="report-item-value">${data.overhead.contractForces.toLocaleString()}</span>
</div>
<div class="report-item">
<span class="report-item-label">طبخ غذا:</span>
<span class="report-item-value">${data.overhead.foodCost.toLocaleString()}</span>
</div>
<div class="report-item">
<span class="report-item-label">پشتیبانی تاسیسات:</span>
<span class="report-item-value">${data.overhead.facilitiesSupport.toLocaleString()}</span>
</div>
<div class="report-item">
<span class="report-item-label">پشتیبانی IT:</span>
<span class="report-item-value">${data.overhead.itSupport.toLocaleString()}</span>
</div>
<div class="report-item">
<span class="report-item-label">سایر هزینه‌ها:</span>
<span class="report-item-value">${data.overhead.otherOverhead.toLocaleString()}</span>
</div>
<div class="report-item" style="background: #fff3cd; border: 2px solid #ff9800;">
<span class="report-item-label" style="color: #ff9800;">💰 جمع کل سربار:</span>
<span class="report-item-value" style="color: #ff9800; font-size: 1.2em;">${data.overhead.total.toLocaleString()}</span>
</div>
</div>
</div>

<div class="report-section">
<div class="report-section-title">👥 جزئیات هزینه‌های پرسنلی (میلیون ریال)</div>
<div class="report-grid">
<div class="report-item">
<span class="report-item-label">حقوق خزانه:</span>
<span class="report-item-value">${data.personnel.treasurySalary.toLocaleString()}</span>
</div>
<div class="report-item">
<span class="report-item-label">پزشکان ساعتی:</span>
<span class="report-item-value">${data.personnel.hourlyDoctors.toLocaleString()}</span>
</div>
<div class="report-item">
<span class="report-item-label">کارانه پزشک:</span>
<span class="report-item-value">${data.personnel.doctorKaraneh.toLocaleString()}</span>
</div>
<div class="report-item">
<span class="report-item-label">کارانه کارکنان:</span>
<span class="report-item-value">${data.personnel.staffKaraneh.toLocaleString()}</span>
</div>
<div class="report-item">
<span class="report-item-label">اضافه کار:</span>
<span class="report-item-value">${data.personnel.overtime.toLocaleString()}</span>
</div>
<div class="report-item">
<span class="report-item-label">بیمه کارکنان:</span>
<span class="report-item-value">${data.personnel.insurance.toLocaleString()}</span>
</div>
<div class="report-item">
<span class="report-item-label">سایر پرسنلی:</span>
<span class="report-item-value">${data.personnel.otherPersonnel.toLocaleString()}</span>
</div>
<div class="report-item" style="background: #ffe0e0; border: 2px solid #f44336;">
<span class="report-item-label" style="color: #f44336;">💰 جمع کل پرسنلی:</span>
<span class="report-item-value" style="color: #f44336; font-size: 1.2em;">${data.personnel.total.toLocaleString()}</span>
</div>
</div>
</div>

<div class="report-summary">
<h5>📊 خلاصه مالی</h5>
<div class="report-grid">
<div class="report-item">
<span class="report-item-label">💰 کل درآمد:</span>
<span class="report-item-value" style="color: #28a745;">${data.revenue.total.toLocaleString()}</span>
</div>
<div class="report-item">
<span class="report-item-label">💸 کل هزینه‌ها:</span>
<span class="report-item-value" style="color: #dc3545;">${totalCosts.toLocaleString()}</span>
</div>
</div>
<div class="profit-loss ${isProfitable ? 'profit' : 'loss'}">
${isProfitable ? '📈 سود' : '📉 زیان'}: ${Math.abs(profitLoss).toLocaleString()} میلیون ریال
(${profitLossPercent}% از بودجه)
</div>
</div>
</div>
`;
    }).join('');
}

function updateProfitLossReport() {
    const container = document.getElementById('profitLossContainer');

    if (hospitalData.length === 0) {
        container.innerHTML = '<p style="text-align: center; padding: 40px; color: #6c757d;">هنوز گزارشی ثبت نشده است</p>';
        return;
    }

    let totalRevenue = 0;
    let totalOverhead = 0;
    let totalPersonnel = 0;

    const rows = hospitalData.map(data => {
        const totalCosts = data.overhead.total + data.personnel.total;
        const profitLoss = data.revenue.total - totalCosts;
        const isProfitable = profitLoss >= 0;

        totalRevenue += data.revenue.total;
        totalOverhead += data.overhead.total;
        totalPersonnel += data.personnel.total;

        return `
<tr>
<td><span class="fiscal-year-badge">${data.fiscalYear}</span></td>
<td>${data.hospital}</td>
<td>${data.revenue.total.toLocaleString()}</td>
<td>${data.overhead.total.toLocaleString()}</td>
<td>${data.personnel.total.toLocaleString()}</td>
<td>${totalCosts.toLocaleString()}</td>
<td class="${isProfitable ? 'profit' : 'loss'}">
${isProfitable ? '📈' : '📉'} ${Math.abs(profitLoss).toLocaleString()}
</td>
<td>${data.date}</td>
</tr>
`;
    }).join('');

    const totalCosts = totalOverhead + totalPersonnel;
    const totalProfitLoss = totalRevenue - totalCosts;
    const isTotalProfitable = totalProfitLoss >= 0;

    container.innerHTML = `
<div class="table-container">
    <table>
        <thead>
            <tr>
                <th>سال مالی</th>
                <th>بیمارستان</th>
                <th>کل درآمد</th>
                <th>هزینه سربار</th>
                <th>هزینه پرسنلی</th>
                <th>کل هزینه‌ها</th>
                <th>سود/زیان</th>
                <th>تاریخ</th>
            </tr>
        </thead>
        <tbody>
            ${rows}
            <tr class="total-row">
                <td colspan="2"><strong>جمع کل</strong></td>
                <td><strong>${totalRevenue.toLocaleString()}</strong></td>
                <td><strong>${totalOverhead.toLocaleString()}</strong></td>
                <td><strong>${totalPersonnel.toLocaleString()}</strong></td>
                <td><strong>${totalCosts.toLocaleString()}</strong></td>
                <td class="${isTotalProfitable ? 'profit' : 'loss'}">
                    <strong>${isTotalProfitable ? '📈' : '📉'} ${Math.abs(totalProfitLoss).toLocaleString()}</strong>
                </td>
                <td>-</td>
            </tr>
        </tbody>
    </table>
</div>
`;
}

// پاک کردن فرم
function resetForm() {
    document.querySelectorAll('input[type="number"]').forEach(input => {
        if (!input.readOnly) {
            input.value = '';
        }
    });
    document.getElementById('hospital').value = '';
    document.getElementById('fiscalYear').value = '';
    document.getElementById('totalOverhead').value = '';
    document.getElementById('totalPersonnel').value = '';
    document.getElementById('totalRevenue').value = '';
}

// توابع پرینت و PDF
function printSection(elementId) {
    const element = document.getElementById(elementId);
    const printWindow = window.open('', '_blank');

    printWindow.document.write(`
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
<meta charset="UTF-8">
<title>پرینت گزارش</title>
<style>
@font-face {
font-family: 'B Titr';
src: local('B Titr');
}
* {
margin: 0;
padding: 0;
box-sizing: border-box;
}
body {
font-family: 'B Titr', Tahoma, Arial, sans-serif;
direction: rtl;
background: white !important;
padding: 20px;
}
.header {
background: #667eea !important;
color: white;
padding: 20px;
text-align: center;
margin-bottom: 20px;
border-radius: 10px;
-webkit-print-color-adjust: exact;
print-color-adjust: exact;
}
.header h1 {
margin-bottom: 10px;
}
table {
width: 100%;
border-collapse: collapse;
margin-top: 20px;
background: white !important;
}
th {
background: #667eea !important;
color: white;
padding: 12px;
text-align: center;
-webkit-print-color-adjust: exact;
print-color-adjust: exact;
}
td {
padding: 10px;
text-align: center;
border: 1px solid #ddd;
background: white !important;
}
.total-row {
background: #e7f3ff !important;
font-weight: bold;
-webkit-print-color-adjust: exact;
print-color-adjust: exact;
}
.profit {
background: #d4edda !important;
color: #155724 !important;
-webkit-print-color-adjust: exact;
print-color-adjust: exact;
}
.loss {
background: #f8d7da !important;
color: #721c24 !important;
-webkit-print-color-adjust: exact;
print-color-adjust: exact;
}
.fiscal-year-badge {
background: #667eea !important;
color: white;
padding: 4px 12px;
border-radius: 15px;
font-size: 0.85em;
-webkit-print-color-adjust: exact;
print-color-adjust: exact;
}
.report-card {
background: white !important;
border: 2px solid #e9ecef;
border-radius: 10px;
padding: 20px;
margin-bottom: 20px;
page-break-inside: avoid;
}
.report-card h4 {
color: #667eea;
margin-bottom: 15px;
padding-bottom: 10px;
border-bottom: 2px solid #667eea;
}
.report-section-title {
color: #667eea;
font-weight: bold;
margin: 15px 0 10px 0;
padding: 8px 12px;
background: rgba(102, 126, 234, 0.1) !important;
border-radius: 8px;
border-right: 4px solid #667eea;
-webkit-print-color-adjust: exact;
print-color-adjust: exact;
}
.report-grid {
display: grid;
grid-template-columns: repeat(2, 1fr);
gap: 10px;
margin-bottom: 15px;
}
.report-item {
background: white !important;
padding: 10px;
border: 1px solid #e9ecef;
border-radius: 5px;
display: flex;
justify-content: space-between;
}
.report-item-label {
color: #6c757d;
}
.report-item-value {
font-weight: bold;
}
.report-summary {
background: white !important;
padding: 15px;
border: 2px solid #667eea;
border-radius: 10px;
margin-top: 15px;
}
.profit-loss {
padding: 15px;
text-align: center;
font-weight: bold;
margin-top: 10px;
border-radius: 8px;
}
@media print {
body {
background: white !important;
}
* {
background: white !important;
}
.header {
background: #667eea !important;
}
th {
background: #667eea !important;
}
.total-row {
background: #e7f3ff !important;
}
.profit {
background: #d4edda !important;
}
.loss {
background: #f8d7da !important;
}
.fiscal-year-badge {
background: #667eea !important;
}
.report-section-title {
background: rgba(102, 126, 234, 0.1) !important;
}
}
</style>
</head>
<body>
<div class="header">
<h1>🏥 سیستم مدیریت اطلاعات بیمارستان‌ها</h1>
<p>حوزه توسعه علوم پزشکی بهبهان</p>
</div>
${element.innerHTML}
</body>
</html>
`);

    printWindow.document.close();
    printWindow.focus();

    setTimeout(() => {
        printWindow.print();
        printWindow.close();
    }, 500);
}

function exportToPDF(elementId, filename) {
    const element = document.getElementById(elementId);

    const opt = {
        margin: 10,
        filename: filename + '.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
            scale: 2,
            useCORS: true,
            letterRendering: true,
            backgroundColor: '#ffffff'
        },
        jsPDF: { 
            unit: 'mm', 
            format: 'a4', 
            orientation: 'portrait'
        }
    };

    // ایجاد المان موقت با هدر
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = `
<div style="font-family: 'B Titr', Tahoma, Arial, sans-serif; direction: rtl; background: white;">
    <div style="background: #667eea; color: white; padding: 20px; text-align: center; margin-bottom: 20px;">
        <h1 style="margin: 0 0 10px 0;">🏥 سیستم مدیریت اطلاعات بیمارستان‌ها</h1>
        <p style="margin: 0;">حوزه توسعه علوم پزشکی بهبهان</p>
    </div>
    ${element.innerHTML}
</div>
`;

    html2pdf().set(opt).from(tempDiv).save();
}

// تولید لینک اشتراک‌گذاری
function generateShareLink() {
    const fiscalYear = document.getElementById('fiscalYear').value;
    const hospital = document.getElementById('hospital').value;

    if (!fiscalYear || !hospital) {
        alert('لطفاً ابتدا سال مالی و بیمارستان را انتخاب کنید');
        return;
    }

    const data = {
        fiscalYear: fiscalYear,
        hospital: hospital,
        medical: {
            approvedBeds: parseFloat(document.getElementById('approvedBeds').value) || 0,
            activeBeds: parseFloat(document.getElementById('activeBeds').value) || 0,
            occupancyRate: parseFloat(document.getElementById('occupancyRate').value) || 0,
            outpatients: parseFloat(document.getElementById('outpatients').value) || 0,
            inpatients: parseFloat(document.getElementById('inpatients').value) || 0
        },
        overhead: {
            drugCost: parseFloat(document.getElementById('drugCost').value) || 0,
            medicalSupplies: parseFloat(document.getElementById('medicalSupplies').value) || 0,
            vehicleCost: parseFloat(document.getElementById('vehicleCost').value) || 0,
            contractForces: parseFloat(document.getElementById('contractForces').value) || 0,
            foodCost: parseFloat(document.getElementById('foodCost').value) || 0,
            facilitiesSupport: parseFloat(document.getElementById('facilitiesSupport').value) || 0,
            itSupport: parseFloat(document.getElementById('itSupport').value) || 0,
            overheadKaraneh: parseFloat(document.getElementById('overheadKaraneh').value) || 0,
            officeRepairs: parseFloat(document.getElementById('officeRepairs').value) || 0,
            transportation: parseFloat(document.getElementById('transportation').value) || 0,
            otherOverhead: parseFloat(document.getElementById('otherOverhead').value) || 0,
            total: parseFloat(document.getElementById('totalOverhead').value) || 0
        },
        personnel: {
            treasurySalary: parseFloat(document.getElementById('treasurySalary').value) || 0,
            hourlyDoctors: parseFloat(document.getElementById('hourlyDoctors').value) || 0,
            doctorKaraneh: parseFloat(document.getElementById('doctorKaraneh').value) || 0,
            staffKaraneh: parseFloat(document.getElementById('staffKaraneh').value) || 0,
            nurseKaraneh: parseFloat(document.getElementById('nurseKaraneh').value) || 0,
            overtime: parseFloat(document.getElementById('overtime').value) || 0,
            salaryAdjustment: parseFloat(document.getElementById('salaryAdjustment').value) || 0,
            technicalFee: parseFloat(document.getElementById('technicalFee').value) || 0,
            welfare: parseFloat(document.getElementById('welfare').value) || 0,
            insurance: parseFloat(document.getElementById('insurance').value) || 0,
            otherPersonnel: parseFloat(document.getElementById('otherPersonnel').value) || 0,
            total: parseFloat(document.getElementById('totalPersonnel').value) || 0
        },
        revenue: {
            treatmentRevenue: parseFloat(document.getElementById('treatmentRevenue').value) || 0,
            drugRevenue: parseFloat(document.getElementById('drugRevenue').value) || 0,
            rentRevenue: parseFloat(document.getElementById('rentRevenue').value) || 0,
            wasteRevenue: parseFloat(document.getElementById('wasteRevenue').value) || 0,
            otherRevenue: parseFloat(document.getElementById('otherRevenue').value) || 0,
            total: parseFloat(document.getElementById('totalRevenue').value) || 0
        }
    };

    // تبدیل داده به Base64
    const dataStr = JSON.stringify(data);
    const encodedData = btoa(encodeURIComponent(dataStr));

    // ایجاد لینک
    const baseUrl = window.location.href.split('?')[0];
    const shareUrl = `${baseUrl}?data=${encodedData}`;

    // نمایش لینک
    document.getElementById('shareLink').value = shareUrl;
    document.getElementById('shareLinkContainer').classList.add('active');
}

function copyShareLink() {
    const linkInput = document.getElementById('shareLink');
    linkInput.select();
    linkInput.setSelectionRange(0, 99999);

    try {
        document.execCommand('copy');

        const existingAlert = document.querySelector('.alert');
        if (existingAlert) {
            existingAlert.remove();
        }

        const alert = document.createElement('div');
        alert.className = 'alert alert-info';
        alert.textContent = '✅ لینک با موفقیت کپی شد';

        const container = document.querySelector('.container');
        container.insertBefore(alert, container.firstChild);

        setTimeout(() => {
            alert.remove();
        }, 3000);
    } catch (err) {
        alert('خطا در کپی کردن لینک');
    }
}

function closeShareLink() {
    document.getElementById('shareLinkContainer').classList.remove('active');
}

// بارگذاری داده از URL
function loadDataFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const encodedData = urlParams.get('data');

    if (encodedData) {
        try {
            const dataStr = decodeURIComponent(atob(encodedData));
            const data = JSON.parse(dataStr);

            // پر کردن فرم با داده‌ها
            document.getElementById('fiscalYear').value = data.fiscalYear || '';
            document.getElementById('hospital').value = data.hospital || '';

            // اطلاعات درمانی
            document.getElementById('approvedBeds').value = data.medical.approvedBeds || '';
            document.getElementById('activeBeds').value = data.medical.activeBeds || '';
            document.getElementById('occupancyRate').value = data.medical.occupancyRate || '';
            document.getElementById('outpatients').value = data.medical.outpatients || '';
            document.getElementById('inpatients').value = data.medical.inpatients || '';

            // هزینه‌های سربار
            document.getElementById('drugCost').value = data.overhead.drugCost || '';
            document.getElementById('medicalSupplies').value = data.overhead.medicalSupplies || '';
            document.getElementById('vehicleCost').value = data.overhead.vehicleCost || '';
            document.getElementById('contractForces').value = data.overhead.contractForces || '';
            document.getElementById('foodCost').value = data.overhead.foodCost || '';
            document.getElementById('facilitiesSupport').value = data.overhead.facilitiesSupport || '';
            document.getElementById('itSupport').value = data.overhead.itSupport || '';
            document.getElementById('overheadKaraneh').value = data.overhead.overheadKaraneh || '';
            document.getElementById('officeRepairs').value = data.overhead.officeRepairs || '';
            document.getElementById('transportation').value = data.overhead.transportation || '';
            document.getElementById('otherOverhead').value = data.overhead.otherOverhead || '';

            // هزینه‌های پرسنلی
            document.getElementById('treasurySalary').value = data.personnel.treasurySalary || '';
            document.getElementById('hourlyDoctors').value = data.personnel.hourlyDoctors || '';
            document.getElementById('doctorKaraneh').value = data.personnel.doctorKaraneh || '';
            document.getElementById('staffKaraneh').value = data.personnel.staffKaraneh || '';
            document.getElementById('nurseKaraneh').value = data.personnel.nurseKaraneh || '';
            document.getElementById('overtime').value = data.personnel.overtime || '';
            document.getElementById('salaryAdjustment').value = data.personnel.salaryAdjustment || '';
            document.getElementById('technicalFee').value = data.personnel.technicalFee || '';
            document.getElementById('welfare').value = data.personnel.welfare || '';
            document.getElementById('insurance').value = data.personnel.insurance || '';
            document.getElementById('otherPersonnel').value = data.personnel.otherPersonnel || '';

            // درآمدها
            document.getElementById('treatmentRevenue').value = data.revenue.treatmentRevenue || '';
            document.getElementById('drugRevenue').value = data.revenue.drugRevenue || '';
            document.getElementById('rentRevenue').value = data.revenue.rentRevenue || '';
            document.getElementById('wasteRevenue').value = data.revenue.wasteRevenue || '';
            document.getElementById('otherRevenue').value = data.revenue.otherRevenue || '';

            // محاسبه جمع کل‌ها
            calculateTotalOverhead();
            calculateTotalPersonnel();
            calculateTotalRevenue();

            // نمایش پیام
            const alert = document.createElement('div');
            alert.className = 'alert alert-info';
            alert.textContent = `✅ داده‌های ${data.hospital} - ${data.fiscalYear} بارگذاری شد`;

            const container = document.querySelector('.container');
            container.insertBefore(alert, container.firstChild);

            setTimeout(() => {
                alert.remove();
            }, 5000);

        } catch (err) {
            console.error('خطا در بارگذاری داده:', err);
        }
    }
}

// بارگذاری داده‌های ذخیره شده
function loadData() {
    const savedData = localStorage.getItem('hospitalData');
    if (savedData) {
        hospitalData = JSON.parse(savedData);
        updateAllTables();
    }
}

// اجرای توابع اولیه
window.onload = function() {
    setupAutoCalculation();
    getReportsFromDatabase();
    // loadData();
    loadDataFromURL();
};
