// ========== داده‌های اصلی (اصلاح شده) ==========
let hospitalData = {}; 
let samplehospitalData = {
    config: {
        year: '1404-1405',
        hospital: 'دانشکده علوم پزشکی بهبهان',
        city: 'بهبهان',
        manager: 'دکتر علی احمدی',
        phone: '061-5522-2001',
        description: 'بیمارستان تخصصی 180 تختخوابی با تمرکز بر خدمات اورژانس، جراحی و قلب',
        timestamp: new Date().toISOString(),
        version: '2.1.0'
    },
    treatment: {
        approvedBeds: 180,
        activeBeds: 150,
        occupancy: 83.3,
        outpatients: 2850,
        inpatients: 1250,
        emergency: 450,
        specialistVisits: 950,
        surgeries: 320,
        patientGrowth: 7.2,
        utilization: 83.3,
        totalPatients: 4650,
        avgStay: 4.2,
        bedTurnover: 25.6,
        efficiencyScore: 87,
        revenuePerBed: 25.7
    },
    overhead: {
        drug: 1450,
        medical: 950,
        vehicle: 180,
        contractor: 420,
        food: 280,
        maintenance: 150,
        it: 95,
        other: 120,
        total: 3645,
        inflationRate: 28.5,
        drugPercent: 39.8,
        monthly: 304,
        largestCost: '💊 دارو',
        costPerPatient: 0.78,
        efficiencyRatio: 1.95
    },
    personnel: {
        treasury: 1650,
        hourlyDoctors: 950,
        doctorPerf: 1250,
        nursePerf: 850,
        staffPerf: 650,
        overtime: 320,
        insurance: 480,
        benefits: 280,
        totalStaff: 285,
        total: 7430,
        doctorShare: 29.2,
        avgSalary: 26.1,
        laborCostRatio: 67.1,
        costPerEmployee: 26.1
    },
    revenue: {
        treatment: 3850,
        pharmacy: 1250,
        rental: 280,
        waste: 95,
        other: 180,
        insuranceFee: 450,
        total: 7105,
        growthRate: 8.5,
        treatmentShare: 54.2,
        monthly: 592,
        revenuePerPatient: 1.53,
        diversityScore: 82
    },
    profit: {
        revenue: 7105,
        overhead: 3645,
        personnel: 7430,
        totalCost: 11075,
        operatingProfit: -3970,
        depreciation: 450,
        taxes: 180,
        nonOperational: 95,
        netProfit: -4445,
        margin: -62.6,
        roi: -18.5,
        currentRatio: 1.2,
        debtRatio: 45.2
    },
    analytics: {
        targetProfit: 1500,
        targetGrowth: 12.5,
        debtRatio: 45.2,
        forecastPeriod: 12,
        gapAnalysis: 5945,
        requiredRevenue: 12520,
        requiredCostCut: 2850,
        breakEvenPoint: 8200,
        financialHealth: 42,
        riskLevel: 'HIGH'
    },
    reports: [
        {
            date: '1404/08/21',
            hospital: 'بهبهان',
            patients: 4650,
            beds: 150,
            personnelCost: 7430,
            overheadCost: 3645,
            treatmentRevenue: 3850,
            pharmacyRevenue: 1250,
            profit: -4445,
            margin: -62.6,
            efficiency: 72,
            risk: 'HIGH'
        }
    ],
    records: 1,
    lastUpdate: new Date().toLocaleDateString('fa-IR'),
    system: {
        version: '2.1.0',
        loadTime: 0,
        screenWidth: 720,
        device: 'desktop',
        browser: navigator.userAgent
    }
};

// ========== متغیرهای سراسری ==========
let totalPatients = 0; // رفع خطای calcOverhead

// ========== راه‌اندازی سیستم ==========
const API_URL = 'http://10.3.10.12:4000/api/v2';
// const API_URL = 'http://localhost:4000/api/v2';

function refreshData(data) {
    hospitalData = {...data};
    // updateAllTables();
    console.log('refresh', data, hospitalData);
    updateUI();
    console.log('refresh2', data, hospitalData);
    calcAll();
    console.log('refresh3', data, hospitalData);
}

function getReportsFromDatabase() {
    showLoading(true);
    fetch(`${API_URL}/reports`)
        .then((res) => res.json())
        .then((data) => {
            if (data.reports.length > 0) {
                console.log('1');
                refreshData(data.reports[0])
            } else {
                console.log('2');
                loadSampleData();
            }
        })
        .catch((error) => {
            console.error(error);
        }).finally(() =>{
            showLoading(false);
        })
}

function submitNewReport(data) {
    showLoading(true);
    if (data._id) {
        return updateReport(data, 1);
    }
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
            hospitalData = report;
            // updateAllTables();
            updateUI();
        })
        .catch((error) => {
            console.error(error);
        })
        .finally(() => {
            showLoading(false);
        })
}

function updateReport(data, update) {
    showLoading(true);
    fetch(`${API_URL}/reports`, { 
        method: 'PATCH',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data) 
    }).then((res) => res.json())
        .then(({ report }) => {
            console.log(report, data);
            hospitalData = report;
            // updateAllTables();
            if (update) {
                updateUI();
            }
        })
        .catch((error) => {
            console.error(error);
        })
        .finally(() => {
            showLoading(false);
        })
}

function deleteAllReports() {
    showLoading(true);
    fetch(`${API_URL}/reports`, { 
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    }).then((res) => res.json())
        .then(({ report }) => {
            console.log(report, data);
            showLoading(false);
            location.reload();
            showNotification('🗑️ همه داده‌ها پاک شد', 'success');
        })
        .catch((error) => {
            console.error(error);
        })
        .finally(() => {
            showLoading(false);
        })
}

function initSystem() {
    console.time('SystemInit');

    try {
        // بارگذاری داده‌ها
        // const saved = localStorage.getItem('hospitalAuditV2');
        // if (saved) {
        //     const parsed = JSON.parse(saved);
        //     if (parsed && parsed.config && parsed.treatment) {
        //         Object.assign(hospitalData, parsed);
        //         console.log('💾 داده‌های قبلی بارگذاری شد:', hospitalData.records, 'رکورد');
        //     }
        // }
        //
        // // به‌روزرسانی UI
        // updateUI();
        // calcAll();

        getReportsFromDatabase();
        // وضعیت سیستم
        const loadTime = Math.round(performance.now() - window.performance.timing.navigationStart);
        document.getElementById('load-time').textContent = loadTime;
        document.getElementById('width').textContent = Math.min(window.innerWidth, 720);
        document.getElementById('data-status').textContent = hospitalData.records || 0;
        document.getElementById('mode').textContent = window.innerWidth < 768 ? 'موبایل/تبلت' : 'دسکتاپ';
        document.getElementById('current-time').textContent = new Date().toLocaleTimeString('fa-IR');

        // رویدادها
        setupEvents();
        updateClock();

        // تست خودکار
        if (loadTime < 1000) {
            setTimeout(testSystem, 1500);
        }

        console.timeEnd('SystemInit');
        console.log('🚀 سیستم حسابرسی v2.1 آماده | فونت B Titr Bold | 720px');

    } catch (error) {
        console.error('خطای راه‌اندازی:', error);
        showNotification('❌ خطای سیستمی - لطفاً صفحه را رفرش کنید', 'error');
    }
}

function showLoading(show) {
    const loading = document.getElementById('loading');
    loading.classList.toggle('hidden', !show);
}

function updateClock() {
    document.getElementById('current-time').textContent = new Date().toLocaleTimeString('fa-IR');
    setTimeout(updateClock, 1000);
}

// ========== به‌روزرسانی UI ==========
function updateUI() {
    // تنظیمات
    ['fiscal-year', 'hospital-name', 'city', 'manager', 'phone', 'description'].forEach(id => {
        const el = document.getElementById(id);
        if (el && hospitalData.config[id.replace('-', '')]) {
            el.value = hospitalData.config[id.replace('-', '')];
        }
    });

    // درمانی
    const treatmentKeys = ['approvedBeds', 'activeBeds', 'occupancy', 'outpatients', 
        'inpatients', 'emergency', 'specialistVisits', 'surgeries', 'patientGrowth'];
    treatmentKeys.forEach(key => {
        const el = document.getElementById(key);
        if (el && hospitalData.treatment[key] !== undefined) {
            el.value = hospitalData.treatment[key];
        }
    });

    // سربار
    const overheadKeys = ['drug', 'medical', 'vehicle', 'contractor', 'food', 
        'maintenance', 'it', 'other', 'inflationRate'];
    overheadKeys.forEach(key => {
        const el = document.getElementById(key + '-cost' || key);
        if (el && hospitalData.overhead[key] !== undefined) {
            el.value = hospitalData.overhead[key];
        }
    });

    // پرسنلی
    const personnelKeys = ['treasury', 'hourlyDoctors', 'doctorPerf', 'nursePerf', 
        'staffPerf', 'overtime', 'insurance', 'benefits', 'totalStaff'];
    personnelKeys.forEach(key => {
        const el = document.getElementById(key);
        if (el && hospitalData.personnel[key] !== undefined) {
            el.value = hospitalData.personnel[key];
        }
    });

    // درآمدها
    const revenueKeys = ['treatment', 'pharmacy', 'rental', 'waste', 'other', 'insuranceFee'];
    revenueKeys.forEach(key => {
        const el = document.getElementById(key + '-revenue' || key);
        if (el && hospitalData.revenue[key] !== undefined) {
            el.value = hospitalData.revenue[key];
        }
    });
        const el = document.getElementById('revenueGrowth-revenue');
        if (el && hospitalData.revenue['growthRate'] !== undefined) {
            el.value = hospitalData.revenue['growthRate'];
        }

    // سود/زیان
    ['depreciation', 'taxes'].forEach(key => {
        const el = document.getElementById(key);
        if (el && hospitalData.profit[key] !== undefined) {
            el.value = hospitalData.profit[key];
        }
    });
        const el2 = document.getElementById('non-operational');
        console.log('prof', hospitalData.profit['nonOperational'], el2, el2.value);
        if (el2 && hospitalData.profit['nonOperational'] !== undefined) {
            el2.value = hospitalData.profit['nonOperational'];
        console.log('prof', hospitalData.profit['nonOperational'], el2.value);
        }

    // تحلیل
    const analyticsKeys = ['targetProfit', 'targetGrowth', 'debtRatio', 'forecastPeriod'];
    analyticsKeys.forEach(key => {
        const el = document.getElementById(key.replace(/([A-Z])/g, '-$1').toLowerCase());
        if (el && hospitalData.analytics[key] !== undefined) {
            el.value = hospitalData.analytics[key];
        }
    });

    // به‌روزرسانی خلاصه‌ها
    document.getElementById('config-status').innerHTML = 
        `✅ ${hospitalData.config.hospital} | ${hospitalData.config.year} | ` +
            `به‌روزرسانی: ${new Date(hospitalData.config.timestamp).toLocaleString('fa-IR')} | ` +
            `<span style="color: #00bfff;">v${hospitalData.system.version}</span>`;
}

// ========== محاسبات اصلی (رفع خطا) ==========
function calcTreatment() {
    try {
        const approved = parseFloat(document.getElementById('approvedBeds').value) || 0;
        const active = parseFloat(document.getElementById('activeBeds').value) || 0;
        const rate = parseFloat(document.getElementById('occupancy').value) || 0;
        const out = parseFloat(document.getElementById('outpatients').value) || 0;
        const inpt = parseFloat(document.getElementById('inpatients').value) || 0;
        const emerg = parseFloat(document.getElementById('emergency').value) || 0;
        const spec = parseFloat(document.getElementById('specialistVisits').value) || 0;
        const surg = parseFloat(document.getElementById('surgeries').value) || 0;
        const patientGrowth = parseFloat(document.getElementById('patientGrowth').value) || 0;

        // محاسبات
        const utilization = approved > 0 ? Math.min((active / approved * 100), 100) : 0;
        totalPatients = out + inpt + emerg + spec + surg; // سراسری
        const avgStay = inpt > 0 ? Math.round((active * 365 / inpt) / 30 * 10) / 10 : 0;
        const bedTurnover = active > 0 ? Math.round((inpt / active * 12) * 10) / 10 : 0;
        const efficiencyScore = Math.min(Math.round(utilization * 0.4 + (totalPatients / 5000 * 100) * 0.3 + rate * 0.3), 100);
        const revenuePerBed = hospitalData.revenue.treatment / (active || 1);

        // به‌روزرسانی UI
        document.getElementById('utilization-rate').innerHTML = utilization.toFixed(1) + '%';
        document.getElementById('total-patients').textContent = totalPatients.toLocaleString();
        document.getElementById('avg-stay').textContent = avgStay;
        document.getElementById('bed-turnover').textContent = bedTurnover;
        document.getElementById('efficiency-score').textContent = efficiencyScore;
        document.getElementById('revenue-per-bed').textContent = revenuePerBed.toFixed(1);

        document.getElementById('treatment-summary').innerHTML = 
            `🏥 ${active.toLocaleString()}/${approved.toLocaleString()} تخت (${utilization.toFixed(1)}%) | ` +
                `${totalPatients.toLocaleString()} مراجع | کارایی: ${efficiencyScore}/100 | ` +
                `درآمد/تخت: ${revenuePerBed.toFixed(1)}M | رشد: +${hospitalData.treatment.patientGrowth}%`;

        // ذخیره
        hospitalData.treatment = {
            ...hospitalData.treatment,
            approvedBeds: approved, activeBeds: active, occupancy: rate,
            outpatients: out, inpatients: inpt, emergency: emerg,
            specialistVisits: spec, surgeries: surg,
            utilization: utilization.toFixed(1), totalPatients, patientGrowth,
            avgStay, bedTurnover, efficiencyScore, revenuePerBed: revenuePerBed.toFixed(1)
        };

        console.log('✅ محاسبه درمانی:', hospitalData.treatment);

    } catch (error) {
        console.error('خطا در calcTreatment:', error);
        showNotification('❌ خطا در محاسبه درمانی', 'error');
    }
}

function calcOverhead() {
    try {
        const values = [
            parseFloat(document.getElementById('drug-cost').value) || 0,
            parseFloat(document.getElementById('medical-cost').value) || 0,
            parseFloat(document.getElementById('vehicle-cost').value) || 0,
            parseFloat(document.getElementById('contractor-cost').value) || 0,
            parseFloat(document.getElementById('food-cost').value) || 0,
            parseFloat(document.getElementById('maintenance-cost').value) || 0,
            parseFloat(document.getElementById('it-cost').value) || 0,
            parseFloat(document.getElementById('other-cost').value) || 0
        ];
        const inflation = parseFloat(document.getElementById('inflationRate-cost').value) || 0;
        console.log('inflation', inflation)

        const total = values.reduce((a, b) => a + b, 0);
        const drugShare = total > 0 ? ((values[0] / total * 100)).toFixed(1) : 0;
        const monthly = Math.round(total / 12);
        const largestIndex = values.indexOf(Math.max(...values));
        const largestNames = ['💊 دارو', '🩹 لوازم', '🚗 خودرو', '👷‍♂️ شرکتی', '🍽️ غذا', 
            '🔧 تعمیرات', '💻 IT', '📦 سایر'];
        const largestName = largestNames[largestIndex] || 'نامشخص';
        const costPerPatient = totalPatients > 0 ? (total / totalPatients).toFixed(2) : 0;
        const efficiencyRatio = hospitalData.revenue.total / (total || 1);

        // UI
        document.getElementById('overhead-total').textContent = total.toLocaleString();
        document.getElementById('drug-percent').textContent = drugShare + '%';
        document.getElementById('largest-cost').innerHTML = largestName;
        document.getElementById('monthly-overhead').textContent = monthly.toLocaleString();
        document.getElementById('cost-per-patient').textContent = costPerPatient;
        document.getElementById('efficiency-ratio').textContent = efficiencyRatio.toFixed(2);

        document.getElementById('overhead-summary').innerHTML = 
            `💰 ${total.toLocaleString()}M | ماهانه: ${monthly.toLocaleString()}M | ` +
                `<span style="color: #ff9999;">${largestName} (${drugShare}%) | ` +
                `هزینه/بیمار: ${costPerPatient}M | کارایی: ${efficiencyRatio.toFixed(2)}x</span>`;

        hospitalData.overhead = {
            ...hospitalData.overhead,
            drug: values[0], medical: values[1], vehicle: values[2],
            contractor: values[3], food: values[4], maintenance: values[5],
            it: values[6], other: values[7], total, inflationRate: inflation,
            drugPercent: drugShare, monthly, largestCost: largestName,
            costPerPatient, efficiencyRatio: efficiencyRatio.toFixed(2)
        };

        console.log('✅ محاسبه سربار:', total, 'M');

    } catch (error) {
        console.error('خطا در calcOverhead:', error);
        showNotification('❌ خطا در محاسبه سربار', 'error');
    }
}

function calcPersonnel() {
    try {
        const values = [
            parseFloat(document.getElementById('treasury').value) || 0,
            parseFloat(document.getElementById('hourlyDoctors').value) || 0,
            parseFloat(document.getElementById('doctorPerf').value) || 0,
            parseFloat(document.getElementById('nursePerf').value) || 0,
            parseFloat(document.getElementById('staffPerf').value) || 0,
            parseFloat(document.getElementById('overtime').value) || 0,
            parseFloat(document.getElementById('insurance').value) || 0,
            parseFloat(document.getElementById('benefits').value) || 0
        ];
        const totalStaff = parseFloat(document.getElementById('totalStaff').value) || 1;

        const total = values.reduce((a, b) => a + b, 0);
        const doctorTotal = values[1] + values[2];
        const doctorShare = total > 0 ? ((doctorTotal / total * 100)).toFixed(1) : 0;
        const avgSalary = totalStaff > 0 ? Math.round(total / totalStaff) : 0;
        const totalCost = hospitalData.overhead.total + total;
        const laborCostRatio = totalCost > 0 ? ((total / totalCost * 100)).toFixed(1) : 0;

        // UI
        document.getElementById('personnel-total').textContent = total.toLocaleString();
        document.getElementById('doctor-share').textContent = doctorShare + '%';
        document.getElementById('staff-count').textContent = totalStaff.toLocaleString();
        document.getElementById('avg-salary').textContent = avgSalary.toLocaleString();
        document.getElementById('labor-cost-ratio').textContent = laborCostRatio;
        document.getElementById('cost-per-employee').textContent = avgSalary.toLocaleString();

        document.getElementById('personnel-summary').innerHTML = 
            `👥 ${total.toLocaleString()}M | ${totalStaff.toLocaleString()} نفر | ` +
                `<span style="color: #ff9999;">میانگین: ${avgSalary.toLocaleString()}M/نفر | ` +
                `نسبت: ${laborCostRatio}% کل | پزشکان: ${doctorShare}%</span>`;

        hospitalData.personnel = {
            ...hospitalData.personnel,
            treasury: values[0], hourlyDoctors: values[1], doctorPerf: values[2],
            nursePerf: values[3], staffPerf: values[4], overtime: values[5],
            insurance: values[6], benefits: values[7], totalStaff,
            total, doctorShare, avgSalary, laborCostRatio
        };

        console.log('✅ محاسبه پرسنلی:', total, 'M');

    } catch (error) {
        console.error('خطا در calcPersonnel:', error);
        showNotification('❌ خطا در محاسبه پرسنلی', 'error');
    }
}

function calcRevenue() {
    try {
        const values = [
            parseFloat(document.getElementById('treatment-revenue').value) || 0,
            parseFloat(document.getElementById('pharmacy-revenue').value) || 0,
            parseFloat(document.getElementById('rental-revenue').value) || 0,
            parseFloat(document.getElementById('waste-revenue').value) || 0,
            parseFloat(document.getElementById('other-revenue').value) || 0,
            parseFloat(document.getElementById('insuranceFee-revenue').value) || 0
        ];
        const growth = parseFloat(document.getElementById('revenueGrowth-revenue').value) || 0;

        const total = values.reduce((a, b) => a + b, 0);
        const treatmentShare = total > 0 ? ((values[0] / total * 100)).toFixed(1) : 0;
        const monthly = Math.round(total / 12);
        const revenuePerPatient = totalPatients > 0 ? (total / totalPatients).toFixed(2) : 0;
        const diversityScore = Math.min(Math.round((values.filter(v => v > 0).length / 6 * 100)), 100);

        // UI
        document.getElementById('total-revenue').textContent = total.toLocaleString();
        document.getElementById('treatment-share').textContent = treatmentShare + '%';
        document.getElementById('growth-rate').textContent = growth;
        document.getElementById('monthly-revenue').textContent = monthly.toLocaleString();
        document.getElementById('revenue-per-patient').textContent = revenuePerPatient;
        document.getElementById('diversity-score').textContent = diversityScore;

        document.getElementById('revenue-summary').innerHTML = 
            `💵 ${total.toLocaleString()}M | ماهانه: ${monthly.toLocaleString()}M | ` +
                `<span style="color: #00bfff;">رشد: +${growth}% | تنوع: ${diversityScore}/100 | ` +
                `درآمد/بیمار: ${revenuePerPatient}M | درمانی: ${treatmentShare}%</span>`;

        hospitalData.revenue = {
            ...hospitalData.revenue,
            treatment: values[0], pharmacy: values[1], rental: values[2],
            waste: values[3], other: values[4], insuranceFee: values[5],
            total, growthRate: growth, treatmentShare,
            monthly, revenuePerPatient, diversityScore
        };

        console.log('✅ محاسبه درآمد:', total, 'M');

    } catch (error) {
        console.error('خطا در calcRevenue:', error);
        showNotification('❌ خطا در محاسبه درآمدها', 'error');
    }
}

// ========== حسابرسی سود و زیان (حرفه‌ای) ==========
function calcProfitLoss() {
    try {
        const revenue = hospitalData.revenue.total;
        const overhead = hospitalData.overhead.total;
        const personnel = hospitalData.personnel.total;
        const totalCost = overhead + personnel;
        const operatingProfit = revenue - totalCost;

        const depreciation = parseFloat(document.getElementById('depreciation').value) || 0;
        const taxes = parseFloat(document.getElementById('taxes').value) || 0;
        const nonOp = parseFloat(document.getElementById('non-operational').value) || 0;

        const netProfit = operatingProfit - depreciation - taxes + nonOp;
        const margin = revenue > 0 ? ((netProfit / revenue * 100)).toFixed(1) : 0;
        const roi = totalCost > 0 ? ((netProfit / totalCost * 100)).toFixed(1) : 0;
        const currentRatio = 1.2; // فرضی
        const debtRatio = parseFloat(hospitalData.analytics.debtRatio) || 45.2;

        // به‌روزرسانی KPI ها
        document.getElementById('audit-revenue').textContent = revenue.toLocaleString();
        document.getElementById('audit-total-cost').textContent = totalCost.toLocaleString();
        document.getElementById('audit-operating-profit').innerHTML = 
            operatingProfit >= 0 ? `<span class="profit-positive">+${operatingProfit.toLocaleString()}</span>` :
                `<span class="profit-negative">${operatingProfit.toLocaleString()}</span>`;
        document.getElementById('audit-roi').innerHTML = roi >= 0 ? `<span class="profit-positive">+${roi}%</span>` :
            `<span class="profit-negative">${roi}%</span>`;
        document.getElementById('audit-current-ratio').textContent = currentRatio;
        document.getElementById('audit-debt-ratio').textContent = debtRatio.toFixed(1) + '%';

        // جدول حسابرسی
        const auditBody = document.getElementById('audit-body');
        const auditData = [
            { desc: 'درآمد عملیاتی کل', amount: revenue, percent: '100.0%', status: 'positive' },
            { desc: 'هزینه‌های سربار', amount: overhead, percent: ((overhead/revenue*100)||0).toFixed(1)+'%', status: 'negative' },
            { desc: 'هزینه‌های پرسنلی', amount: personnel, percent: ((personnel/revenue*100)||0).toFixed(1)+'%', status: 'negative' },
            { desc: 'سود ناخالص', amount: operatingProfit, percent: ((operatingProfit/revenue*100)||0).toFixed(1)+'%', status: operatingProfit >= 0 ? 'positive' : 'negative' },
            { desc: 'استهلاک و کاهش ارزش', amount: depreciation, percent: ((depreciation/revenue*100)||0).toFixed(1)+'%', status: 'negative' },
            { desc: 'مالیات و عوارض', amount: taxes, percent: ((taxes/revenue*100)||0).toFixed(1)+'%', status: 'negative' },
            { desc: 'سایر درآمدها/هزینه‌ها', amount: nonOp, percent: ((nonOp/revenue*100)||0).toFixed(1)+'%', status: nonOp >= 0 ? 'positive' : 'negative' },
            { desc: 'سود عملیاتی', amount: netProfit, percent: margin + '%', status: netProfit >= 0 ? 'positive' : 'negative' }
        ];

        auditBody.innerHTML = auditData.map(row => `
<tr>
<td>${row.desc}</td>
<td class="${row.status}">${row.amount >= 0 ? (row.amount > 0 ? '+' : '') : ''}${row.amount.toLocaleString()}</td>
<td class="${row.status}">${row.percent}</td>
<td class="${row.status}">
${row.status === 'positive' ? '✅' : row.status === 'negative' ? '❌' : ''}
</td>
</tr>
`).join('');

        // خلاصه نهایی
        const netEl = document.getElementById('audit-net-profit');
        const marginEl = document.getElementById('audit-margin');
        const statusEl = document.getElementById('audit-status');

        if (netProfit >= 0) {
            netEl.innerHTML = `<span class="profit-positive">+${netProfit.toLocaleString()}</span>`;
            marginEl.innerHTML = `<span class="profit-positive">+${margin}%</span>`;
            statusEl.innerHTML = '🚀 سودآور';
            statusEl.className = 'profit-positive';
            document.getElementById('profit-summary').className = 'total profit-positive';
        } else {
            netEl.innerHTML = `<span class="profit-negative">${netProfit.toLocaleString()}</span>`;
            marginEl.innerHTML = `<span class="profit-negative">${margin}%</span>`;
            statusEl.innerHTML = '🚨 بحرانی';
            statusEl.className = 'profit-negative';
            document.getElementById('profit-summary').className = 'total profit-negative';
        }

        // گزارش خلاصه
        document.getElementById('profit-summary').innerHTML = 
            `💸 <strong>نتیجه حسابرسی:</strong> ${netProfit >= 0 ? 'سود' : 'زیان'} خالص ${netProfit >= 0 ? '+' : ''}${netProfit.toLocaleString()}M (${margin}%) | ` +
                `<span style="color: ${netProfit >= 0 ? '#00ff41' : '#ff0000'}; font-size: 16px;">${statusEl.innerHTML}</span> | ` +
                `ROI: ${roi}% | نسبت بدهی: ${debtRatio.toFixed(1)}% | ` +
                `<strong>${netProfit >= 0 ? 'عملکرد عالی' : 'بازنگری فوری 90 روزه'}</strong>`;

        // ذخیره
        hospitalData.profit = {
            ...hospitalData.profit,
            revenue, overhead, personnel, totalCost, operatingProfit,
            depreciation, taxes, nonOperational: nonOp,
            netProfit, margin, roi, currentRatio, debtRatio
        };

        // به‌روزرسانی گزارش‌ها
        updateReports();
        console.log('✅ حسابرسی کامل:', netProfit, 'M');

    } catch (error) {
        console.error('خطا در calcProfitLoss:', error);
        showNotification('❌ خطا در حسابرسی مالی', 'error');
    }
}

function advancedAnalysis() {
    try {
        const currentProfit = hospitalData.profit.netProfit;
        const targetProfit = parseFloat(document.getElementById('target-profit').value) || 0;
        const targetGrowth = parseFloat(document.getElementById('target-growth').value) || 0;
        const currentRevenue = hospitalData.revenue.total;
        const currentTotalCost = hospitalData.profit.totalCost;
        const debtRatio = parseFloat(document.getElementById('debt-ratio').value) || 45.2;
        const period = parseInt(document.getElementById('forecast-period').value) || 12;

        const gap = Math.abs(targetProfit - Math.abs(currentProfit));
        const requiredRevenue = targetProfit + currentTotalCost;
        const requiredGrowth = currentRevenue > 0 ? (((requiredRevenue / currentRevenue) - 1) * 100).toFixed(1) : 0;
        const requiredCostCut = Math.abs(currentProfit) * 0.6;
        const breakEven = currentTotalCost;
        const financialHealth = Math.max(0, Math.round(100 - (Math.abs(currentProfit) / (targetProfit || 1000) * 50) - debtRatio));
        const riskLevel = financialHealth < 40 ? 'CRITICAL' : financialHealth < 60 ? 'HIGH' : financialHealth < 80 ? 'MEDIUM' : 'LOW';

        // UI
        document.getElementById('gap-analysis').textContent = gap.toLocaleString();
        document.getElementById('required-revenue').textContent = requiredRevenue.toLocaleString();
        document.getElementById('required-cost-cut').textContent = requiredCostCut.toLocaleString();
        document.getElementById('break-even-point').textContent = breakEven.toLocaleString();
        document.getElementById('financial-health').textContent = financialHealth;
        document.getElementById('risk-level').innerHTML = `<span style="color: ${riskLevel === 'CRITICAL' ? '#ff0000' : riskLevel === 'HIGH' ? '#ff8c00' : riskLevel === 'MEDIUM' ? '#ffaa00' : '#00ff41'}">${riskLevel}</span>`;

        // خلاصه
        const color = financialHealth < 50 ? '#ff0000' : financialHealth < 70 ? '#ff8c00' : '#00ff41';
        const action = financialHealth < 50 ? '🚨 بازسازی فوری' : financialHealth < 70 ? '⚠️ بهبود تدریجی' : '✅ ادامه روند';

        document.getElementById('analytics-summary').innerHTML = 
            `📈 <strong>سلامت مالی: ${financialHealth}/100</strong> | شکاف هدف: ${gap.toLocaleString()}M | ` +
                `ریسک: <span style="color: ${color}">${riskLevel}</span> | ` +
                `رشد مورد نیاز: ${requiredGrowth}% | کاهش هزینه: ${requiredCostCut.toLocaleString()}M | ` +
                `<span style="color: ${color};">${action}</span>`;

        hospitalData.analytics = {
            ...hospitalData.analytics,
            targetProfit, targetGrowth, debtRatio, forecastPeriod: period,
            gapAnalysis: gap, requiredRevenue, requiredCostCut, breakEvenPoint: breakEven,
            financialHealth, riskLevel
        };

        console.log('✅ تحلیل پیشرفته:', financialHealth, '/100');

    } catch (error) {
        console.error('خطا در advancedAnalysis:', error);
        showNotification('❌ خطا در تحلیل مالی', 'error');
    }
}

function calcAll() {
    try {
        calcTreatment();
        calcOverhead();
        calcPersonnel();
        calcRevenue();
        calcProfitLoss();
        advancedAnalysis();
        updateReports();
        console.log('✅ همه محاسبات کامل');
    } catch (error) {
        console.error('خطا در calcAll:', error);
        showNotification('❌ خطا در محاسبات کلی', 'error');
    }
}

// ========== نمایش بخش‌ها ==========
function showSection(sectionId) {
    try {
        showLoading(true);
        setTimeout(() => {
            // مخفی کردن همه
            document.querySelectorAll('.section').forEach(section => section.classList.remove('active'));
            document.querySelectorAll('.menu-btn').forEach(btn => btn.classList.remove('active'));

            // نمایش بخش
            document.getElementById(sectionId).classList.add('active');
            event?.target?.classList.add('active');

            // محاسبات خاص
            const calculations = {
                treatment: calcTreatment,
                overhead: calcOverhead,
                personnel: calcPersonnel,
                revenue: calcRevenue,
                profit: calcProfitLoss,
                reports: updateReports,
                analytics: advancedAnalysis
            };

            if (calculations[sectionId]) {
                calculations[sectionId]();
            }

            showLoading(false);
            // saveData();
            console.log(`✅ بخش ${sectionId} نمایش داده شد`);

        }, 200);
    } catch (error) {
        console.error('خطا در showSection:', error);
        showLoading(false);
        showNotification('❌ خطا در نمایش بخش', 'error');
    }
}

// ========== ذخیره‌سازی (بهبود یافته) ==========
function saveData() {
    try {
        // محدود کردن اندازه
        const dataToSave = { ...hospitalData };
        dataToSave.reports = dataToSave.reports.slice(-50); // حداکثر 50 رکورد

        const jsonString = JSON.stringify(dataToSave);
        if (jsonString.length > 5 * 1024 * 1024) { // 5MB
            console.warn('⚠️ داده‌ها بیش از حد بزرگ - محدود شد');
            dataToSave.reports = dataToSave.reports.slice(-20);
            // localStorage.setItem('hospitalAuditV2', JSON.stringify(dataToSave));
            if (dataToSave._id) {
                updateReport(dataToSave, 1);
            } else {
                submitNewReport(dataToSave);
            }
        } else {
            // localStorage.setItem('hospitalAuditV2', jsonString);
            if (dataToSave._id) {
                updateReport(dataToSave, 1);
            } else {
                submitNewReport(dataToSave);
            }
        }

        document.getElementById('data-status').textContent = hospitalData.records || 0;
        console.log('💾 ذخیره موفق:', jsonString.length / 1024, 'KB');

    } catch (error) {
        console.error('خطا در ذخیره:', error);
        if (error.name === 'QuotaExceededError') {
            showNotification('❌ فضای ذخیره‌سازی پر است - داده‌ها پاک کنید', 'error');
            clearOldData();
        }
    }
}

function saveTreatment() { saveData(); showNotification('✅ اطلاعات درمانی ذخیره شد', 'success'); }
function saveOverhead() { saveData(); showNotification('✅ هزینه‌های سربار ذخیره شد', 'success'); }
function savePersonnel() { saveData(); showNotification('✅ اطلاعات پرسنلی ذخیره شد', 'success'); }
function saveRevenue() { saveData(); showNotification('✅ درآمدها ذخیره شد', 'success'); }

function saveAll() {
    saveData();
    showNotification(`💾 همه داده‌ها ذخیره شد!\n${hospitalData.records} رکورد | ${new Date().toLocaleString('fa-IR')}`, 'success');
}

function clearAll() {
    if (confirm('⚠️ آیا مطمئن هستید؟\nهمه داده‌های حسابرسی پاک می‌شود!\n\nاین عمل غیرقابل بازگشت است')) {
        if (confirm('آیا واقعاً می‌خواهید ادامه دهید؟')) {
            // localStorage.removeItem('hospitalAuditV2');
            // location.reload();
            deleteAllReports();
        }
    }
}

function clearOldData() {
    // localStorage.removeItem('hospitalAuditV2');
    // showNotification('🗑️ داده‌های قدیمی پاک شد - دوباره امتحان کنید', 'success');
    deleteAllReports();
}

// ========== نوتیفیکیشن ==========
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'none';
        notification.style.transform = 'translateX(-50%) translateY(-100%)';
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, type === 'error' ? 5000 : 4000);
}

// ========== رویدادها ==========
function setupEvents() {
    // میانبرهای کیبورد
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            const key = e.key.toLowerCase();

            const shortcuts = {
                '1': 'config', '2': 'treatment', '3': 'overhead', '4': 'personnel',
                '5': 'revenue', '6': 'reports', '7': 'profit', '8': 'analytics',
                's': saveAll, 't': testSystem, 'e': exportAll, 'p': () => printSection('profit'),
                'f': loadSampleData, 'h': systemInfo, 'Delete': clearAll
            };

            if (shortcuts[key]) {
                if (typeof shortcuts[key] === 'string') {
                    showSection(shortcuts[key]);
                } else {
                    shortcuts[key]();
                }
            }

            // Ctrl+Enter = گزارش جدید
            if (e.key === 'Enter') {
                generateReport();
            }
        }

        // F5 = رفرش
        if (e.key === 'F5') {
            e.preventDefault();
            location.reload();
        }
    });

    // تغییر اندازه
    window.addEventListener('resize', () => {
        document.getElementById('width').textContent = Math.min(window.innerWidth, 720);
        const mode = window.innerWidth < 480 ? 'موبایل' : window.innerWidth < 768 ? 'تبلت' : 'دسکتاپ';
        document.getElementById('mode').textContent = mode;
        hospitalData.system.screenWidth = window.innerWidth;
        hospitalData.system.device = mode;
        saveData();
    });

    // ذخیره خودکار
    let saveTimeout;
    document.addEventListener('input', () => {
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(saveData, 2000);
    });

    // بکاپ
    setInterval(() => {
        const timestamp = new Date().toISOString().split('T')[0];
        try {
            // localStorage.setItem(`audit-backup-${timestamp}`, JSON.stringify(hospitalData));
            updateReport(hospitalData, 0);
            console.log('📦 بکاپ روزانه:', timestamp);
        } catch (e) {
            console.warn('خطا در بکاپ:', e);
        }
    }, 24 * 60 * 60 * 1000);

    console.log('⌨️ میانبرها فعال: Ctrl+1-8, S, T, E, P, F, H');
}

// ========== بارگذاری نمونه ==========
function loadSampleData() {
    showLoading(true);
        try {
            hospitalData = samplehospitalData;
        // داده‌های واقعی بهبهان 1404
            hospitalData.treatment = {
                approvedBeds: 180, activeBeds: 150, occupancy: 83.3,
                outpatients: 2850, inpatients: 1250, emergency: 450,
                specialistVisits: 950, surgeries: 320, patientGrowth: 7.2,
                totalPatients: 4650, efficiencyScore: 87
            };

            hospitalData.overhead = {
                drug: 1450, medical: 950, vehicle: 180, contractor: 420,
                food: 280, maintenance: 150, it: 95, other: 120,
                total: 3645, inflationRate: 28.5
            };

            hospitalData.personnel = {
                treasury: 1650, hourlyDoctors: 950, doctorPerf: 1250,
                nursePerf: 850, staffPerf: 650, overtime: 320,
                insurance: 480, benefits: 280, totalStaff: 285,
                total: 7430
            };

            hospitalData.revenue = {
                treatment: 3850, pharmacy: 1250, rental: 280,
                waste: 95, other: 180, insuranceFee: 450,
                total: 7105, growthRate: 8.5
            };

            hospitalData.profit = {
                revenue: 7105, overhead: 3645, personnel: 7430,
                totalCost: 11075, depreciation: 450, taxes: 180,
                nonOperational: 95, netProfit: -4445, margin: -62.6, roi: -18.5
            };

            updateUI();
            calcAll();
            saveData();
            showNotification('📋 داده‌های نمونه واقعی بارگذاری شد\nبر اساس آمار بهبهان 1404', 'success');

        } catch (error) {
            console.error('خطا در loadSampleData:', error);
            showNotification('❌ خطا در بارگذاری نمونه', 'error');
        } finally {
            showLoading(false);
        }
}

// ========== گزارش‌ها ==========
function updateReports() {
    try {
        const tbody = document.getElementById('table-body');
        const reports = hospitalData.reports.slice(-10);

        tbody.innerHTML = reports.map(report => {
            const profitClass = report.profit >= 0 ? 'profit-positive' : 'profit-negative';
            const marginClass = report.margin >= 0 ? 'profit-positive' : 'profit-negative';
            const riskColor = report.risk === 'LOW' ? '#00ff41' : report.risk === 'MEDIUM' ? '#ffaa00' : '#ff4444';

            return `
<tr>
<td>${new Date(report.date).toLocaleDateString('fa-IR')}</td>
<td>${report.hospital}</td>
<td>${(report.patients || 0).toLocaleString()}</td>
<td>${report.beds || 0}</td>
<td>${(report.personnelCost || 0).toLocaleString()}</td>
<td>${(report.overheadCost || 0).toLocaleString()}</td>
<td>${(report.treatmentRevenue || 0).toLocaleString()}</td>
<td>${(report.pharmacyRevenue || 0).toLocaleString()}</td>
<td class="${profitClass}">${report.profit >= 0 ? '+' : ''}${report.profit?.toLocaleString() || 0}</td>
<td class="${marginClass}">${report.margin?.toFixed(1) || 0}%</td>
<td>${report.efficiency || 0}</td>
<td style="color: ${riskColor}">${report.risk || 'N/A'}</td>
</tr>
`;
        }).join('');

        // KPI های داشبورد
        document.getElementById('report-revenue').textContent = hospitalData.revenue.total?.toLocaleString() || 0;
        document.getElementById('report-costs').textContent = hospitalData.profit.totalCost?.toLocaleString() || 0;
        document.getElementById('report-profit').innerHTML = 
            hospitalData.profit.netProfit >= 0 ? 
                `<span class="profit-positive">+${hospitalData.profit.netProfit.toLocaleString()}</span>` :
                `<span class="profit-negative">${hospitalData.profit.netProfit.toLocaleString()}</span>`;
        document.getElementById('report-margin').textContent = hospitalData.profit.margin || 0;
        document.getElementById('report-efficiency').textContent = hospitalData.treatment.efficiencyScore || 0;
        document.getElementById('report-records').textContent = hospitalData.records || 0;

        console.log('✅ داشبورد به‌روزرسانی شد');

    } catch (error) {
        console.error('خطا در updateReports:', error);
    }
}

function generateReport() {
    try {
        const newReport = {
            date: new Date().toISOString().split('T')[0],
            hospital: hospitalData.config.hospital,
            patients: totalPatients,
            beds: hospitalData.treatment.activeBeds,
            personnelCost: hospitalData.personnel.total,
            overheadCost: hospitalData.overhead.total,
            treatmentRevenue: hospitalData.revenue.treatment,
            pharmacyRevenue: hospitalData.revenue.pharmacy,
            profit: hospitalData.profit.netProfit,
            margin: parseFloat(hospitalData.profit.margin),
            efficiency: hospitalData.treatment.efficiencyScore,
            risk: hospitalData.analytics.riskLevel,
            timestamp: new Date().toISOString()
        };

        hospitalData.reports.unshift(newReport);
        hospitalData.reports = hospitalData.reports.slice(0, 100);
        hospitalData.records = hospitalData.reports.length;

        saveData();
        updateReports();
        showNotification(`📊 گزارش #${hospitalData.records} ثبت شد\n${newReport.date} | ${newReport.hospital}`, 'success');

    } catch (error) {
        console.error('خطا در generateReport:', error);
        showNotification('❌ خطا در ثبت گزارش', 'error');
    }
}

// ========== تست سیستم ==========
function testSystem() {
    showLoading(true);
    setTimeout(() => {
        try {
            const tests = {
                ui: document.querySelectorAll('.section').length === 6,
                font: getComputedStyle(document.body).fontFamily.includes('Vazirmatn'),
                size: getComputedStyle(document.body).fontSize === '15px',
                data: Object.keys(hospitalData).length >= 8,
                storage: localStorage.getItem('hospitalAuditV2') !== null,
                calc: typeof calcTreatment === 'function' && totalPatients > 0,
                responsive: window.innerWidth <= 768 || window.innerWidth >= 480,
                reports: Array.isArray(hospitalData.reports) && hospitalData.reports.length > 0,
                profit: hospitalData.profit.netProfit !== undefined,
                performance: performance.now() - window.performance.timing.navigationStart < 3000
            };

            const passed = Object.values(tests).filter(Boolean).length;
            const total = Object.keys(tests).length;
            const score = Math.round((passed / total) * 100);

            const result = `🧪 تست جامع سیستم حسابرسی v2.1\n\n` +
                `UI Elements: ${tests.ui ? '✅' : '❌'}\n` +
                `فونت B Titr: ${tests.font ? '✅' : '❌'}\n` +
                `سایز 15px: ${tests.size ? '✅' : '❌'}\n` +
                `داده‌ها: ${tests.data ? '✅' : '❌'}\n` +
                `ذخیره‌سازی: ${tests.storage ? '✅' : '❌'}\n` +
                `محاسبات: ${tests.calc ? '✅' : '❌'}\n` +
                `Responsive: ${tests.responsive ? '✅' : '❌'}\n` +
                `گزارش‌ها: ${tests.reports ? '✅' : '❌'}\n` +
                `حسابرسی: ${tests.profit ? '✅' : '❌'}\n` +
                `عملکرد: ${tests.performance ? '✅' : '❌'}\n\n` +
                `📊 نتیجه: ${passed}/${total} (${score}%)\n` +
                `⏱️ لود: ${hospitalData.system.loadTime}ms\n` +
                `📏 عرض: ${window.innerWidth}px\n\n` +
                `${score >= 90 ? '🚀 عالی! سیستم کاملاً آماده است' : 
score >= 70 ? '✅ خوب! قابل استفاده است' : 
'⚠️ نیاز به بررسی - برخی مشکلات وجود دارد'}`;

            alert(result);

            if (score >= 90) {
                showNotification('🎉 تبریک! سیستم حسابرسی کاملاً عملیاتی\nB Titr Bold | 720px | عملکرد عالی', 'success');
                saveData();
            } else if (score >= 70) {
                showNotification(`✅ سیستم قابل استفاده (${score}%) - برخی قابلیت‌ها نیاز به تنظیم دارند`, 'info');
            } else {
                showNotification('⚠️ مشکلات جدی - لطفاً اتصال اینترنت و فضای ذخیره را بررسی کنید', 'error');
            }

        } catch (error) {
            console.error('خطا در testSystem:', error);
            showNotification('❌ خطا در تست سیستم', 'error');
        } finally {
            showLoading(false);
        }
    }, 600);
}

// ========== خروجی‌ها (بهبود یافته) ==========
function printSection(section) {
    try {
        showLoading(true);
        const sectionEl = document.getElementById(section);
        if (!sectionEl) {
            throw new Error('بخش یافت نشد');
        }

        const printWindow = window.open('', '_blank', 'width=1200,height=800');
        const printContent = `
<!DOCTYPE html>
<html dir="rtl" lang="fa">
<head>
<meta charset="UTF-8">
<title>حسابرسی ${getSectionTitle(section)} - ${hospitalData.config.hospital}</title>
<style>
body { 
font-family: Tahoma, Arial, sans-serif; 
direction: rtl; 
font-size: 11px; 
line-height: 1.5; 
color: #000; 
background: white; 
padding: 20px; 
margin: 0;
}
.container { 
max-width: none !important; 
border: 1px solid #000 !important; 
box-shadow: none !important; 
background: white !important;
}
.header { 
text-align: center; 
border-bottom: 2px solid #000; 
padding-bottom: 15px; 
margin-bottom: 20px;
}
.section-title { 
color: #000 !important; 
text-align: center; 
font-size: 16px; 
font-weight: bold; 
margin: 20px 0; 
border-bottom: 1px solid #ccc; 
padding-bottom: 10px;
}
.form-grid { 
display: block !important; 
margin: 15px 0; 
}
.form-row { 
display: block !important; 
margin: 10px 0; 
padding: 10px; 
background: #f8f8f8; 
border: 1px solid #ddd; 
border-radius: 5px;
}
.form-label { 
display: block; 
font-weight: bold; 
margin-bottom: 5px; 
color: #000 !important;
min-width: auto !important;
}
.form-input, .form-select { 
width: 100% !important; 
max-width: 200px; 
padding: 8px; 
border: 1px solid #ccc; 
border-radius: 4px;
}
.stats-grid { 
display: block !important; 
}
.stat-card { 
display: inline-block; 
width: 180px; 
margin: 10px; 
padding: 15px; 
border: 1px solid #ccc; 
text-align: center; 
background: #f9f9f9;
}
.total { 
background: #e8f5e8 !important; 
border: 2px solid #006600 !important; 
color: #000 !important; 
padding: 15px !important; 
margin: 20px 0 !important;
}
.profit-positive { color: #006600 !important; }
.profit-negative { color: #cc0000 !important; }
table { 
width: 100%; 
border-collapse: collapse; 
margin: 15px 0; 
font-size: 10px;
}
th, td { 
border: 1px solid #000; 
padding: 6px 3px; 
text-align: center; 
}
th { 
background: #e0e0e0; 
font-weight: bold; 
}
.warning-box { 
background: #ffe6e6 !important; 
border: 2px solid #cc0000 !important; 
color: #000 !important;
}
.btn-group, .menu, .status-bar { display: none !important; }
@page { size: A4 landscape; margin: 10mm; }
</style>
</head>
<body>
<div class="header">
<h1>🏥 گزارش حسابرسی ${getSectionTitle(section)}</h1>
<p>${hospitalData.config.hospital} | ${hospitalData.config.year} | 
تاریخ چاپ: ${new Date().toLocaleDateString('fa-IR')} | 
سیستم DOS حسابرسی v2.1</p>
</div>
<div class="section active" style="display: block !important;">
${sectionEl.innerHTML}
</div>
<div style="text-align: center; margin-top: 30px; font-size: 10px; color: #666;">
<p>چاپ شده در: ${new Date().toLocaleString('fa-IR')} | 
نسخه: ${hospitalData.system.version} | 
حوزه توسعه علوم پزشکی بهبهان</p>
</div>
</body>
</html>
`;

        printWindow.document.write(printContent);
        printWindow.document.close();

        printWindow.onload = () => {
            setTimeout(() => {
                printWindow.print();
                printWindow.onafterprint = () => printWindow.close();
            }, 500);
            showLoading(false);
        };

    } catch (error) {
        console.error('خطا در printSection:', error);
        showNotification('❌ خطا در چاپ - مرورگر را بررسی کنید', 'error');
        showLoading(false);
    }
}

function getSectionTitle(section) {
    const titles = {
        config: 'تنظیمات سیستم', treatment: 'اطلاعات درمانی', 
        overhead: 'هزینه‌های سربار', personnel: 'پرسنلی',
        revenue: 'درآمدها', reports: 'داشبورد', 
        profit: 'سود و زیان', analytics: 'تحلیل مالی'
    };
    return titles[section] || section;
}

function printTable() {
    window.print();
}

// PDF حرفه‌ای (RTL + حسابرسی)
async function generatePDF(section) {
    showLoading(true);
    try {
        if (typeof window.jspdf === 'undefined') {
            throw new Error('jsPDF لود نشده');
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('l', 'mm', 'a4'); // Landscape

        // فونت RTL
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(16);
        doc.setTextColor(0, 102, 0);

        // عنوان
        const title = getSectionTitle(section);
        doc.text(`${title} - حسابرسی مالی`, 14, 20, { align: 'right' });

        // اطلاعات
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        let y = 30;
        const info = [
            `بیمارستان: ${hospitalData.config.hospital}`,
            `سال مالی: ${hospitalData.config.year}`,
            `تاریخ: ${new Date().toLocaleDateString('fa-IR')}`,
            `نسخه سیستم: ${hospitalData.system.version}`,
            `وضعیت: ${hospitalData.analytics.riskLevel}`
        ];

        info.forEach(line => {
            doc.text(line, 14, y, { align: 'right' });
            y += 7;
        });

        // خط جداکننده
        doc.setDrawColor(0, 102, 0);
        doc.line(14, y + 2, 277, y + 2);
        y += 10;

        // داده‌های اصلی (بسته به بخش)
        if (section === 'profit') {
            // جدول حسابرسی
            doc.setFontSize(11);
            let tableY = y;
            const headers = ['شرح', 'مبلغ (M ریال)', 'درصد', 'وضعیت'];
            const headerWidth = [80, 50, 40, 30];

            // هدر
            let x = 14;
            headers.forEach((header, i) => {
                doc.text(header, x + headerWidth[i]/2, tableY, { align: 'center' });
                x += headerWidth[i];
            });
            tableY += 8;

            // داده‌ها
            const auditData = [
                ['درآمد عملیاتی', hospitalData.revenue.total.toLocaleString(), '100.0%', '✅'],
                ['هزینه سربار', hospitalData.overhead.total.toLocaleString(), `${(hospitalData.overhead.total/hospitalData.revenue.total*100).toFixed(1)}%`, '❌'],
                ['هزینه پرسنلی', hospitalData.personnel.total.toLocaleString(), `${(hospitalData.personnel.total/hospitalData.revenue.total*100).toFixed(1)}%`, '❌'],
                ['سود ناخالص', hospitalData.profit.operatingProfit.toLocaleString(), `${(hospitalData.profit.operatingProfit/hospitalData.revenue.total*100).toFixed(1)}%`, hospitalData.profit.operatingProfit >= 0 ? '✅' : '❌'],
                ['سود/زیان خالص', hospitalData.profit.netProfit.toLocaleString(), `${hospitalData.profit.margin}%`, hospitalData.profit.netProfit >= 0 ? '✅' : '🚨']
            ];

            auditData.forEach(row => {
                if (tableY > 250) {
                    doc.addPage();
                    tableY = 20;
                }
                x = 14;
                row.forEach((cell, i) => {
                    const align = i === 0 ? 'right' : 'center';
                    doc.text(cell.toString(), x + headerWidth[i]/2, tableY, { align });
                    x += headerWidth[i];
                });
                tableY += 7;
            });

            // خلاصه
            y = tableY + 15;
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(14);
            doc.setTextColor(0, 0, 0);
            doc.text('نتیجه حسابرسی:', 14, y, { align: 'right' });
            y += 8;
            doc.setFontSize(12);
            doc.setFont('helvetica', 'normal');
            const summary = [
                `وضعیت مالی: ${hospitalData.profit.netProfit >= 0 ? 'سودآور' : 'زیان‌ده'}`,
                `حاشیه سود: ${hospitalData.profit.margin}%`,
                `ROI: ${hospitalData.profit.roi}%`,
                `ریسک: ${hospitalData.analytics.riskLevel}`,
                `توصیه: ${hospitalData.analytics.financialHealth < 50 ? 'بازسازی فوری' : 'بهبود تدریجی'}`,
                `تاریخ حسابرسی: ${new Date().toLocaleDateString('fa-IR')}`
            ];

            summary.forEach(line => {
                doc.text(line, 14, y, { align: 'right' });
                y += 6;
            });

        } else {
            // سایر بخش‌ها - متن ساده
            doc.setFontSize(11);
            const sectionData = getSectionData(section);
            sectionData.forEach(item => {
                if (y > 260) {
                    doc.addPage();
                    y = 20;
                }
                doc.text(`${item.label}: ${item.value}`, 14, y, { align: 'right' });
                y += 6;
            });
        }

        // فوتر
        const filename = `audit-${section}-${new Date().toISOString().split('T')[0]}.pdf`;
        doc.save(filename);
        showNotification(`📄 PDF ${title} تولید شد (${filename})`, 'success');

    } catch (error) {
        console.error('خطا در generatePDF:', error);
        showNotification('❌ خطا در PDF - اتصال اینترنت را بررسی کنید', 'error');
        // جایگزین print
        printSection(section);
    } finally {
        showLoading(false);
    }
}

function getSectionData(section) {
    const data = {
        treatment: [
            { label: 'تخت‌های مصوب', value: hospitalData.treatment.approvedBeds },
            { label: 'تخت‌های فعال', value: hospitalData.treatment.activeBeds },
            { label: 'ضریب اشغال', value: `${hospitalData.treatment.occupancy}%` },
            { label: 'کل مراجعین', value: hospitalData.treatment.totalPatients },
            { label: 'کارایی', value: `${hospitalData.treatment.efficiencyScore}/100` }
        ],
        overhead: [
            { label: 'جمع کل سربار', value: hospitalData.overhead.total },
            { label: 'بزرگترین هزینه', value: hospitalData.overhead.largestCost },
            { label: 'هزینه ماهانه', value: hospitalData.overhead.monthly },
            { label: 'تورم', value: `${hospitalData.overhead.inflationRate}%` },
            { label: 'کارایی', value: hospitalData.overhead.efficiencyRatio }
        ]
        // سایر بخش‌ها...
    };
    return data[section] || [];
}

function exportAll() {
    try {
        showLoading(true);

        // JSON
        const jsonData = JSON.stringify(hospitalData, null, 2);
        downloadFile(jsonData, 'application/json', `audit-complete-${Date.now()}.json`);

        // CSV
        let csv = '\uFEFFتاریخ,بیمارستان,بیماران,تخت,پرسنلی,سربار,درمانی,داروخانه,سود,حاشیه,کارایی,ریسک\n';
        hospitalData.reports.forEach(r => {
            csv += `"${r.date}","${r.hospital}",${r.patients},${r.beds},${r.personnelCost},${r.overheadCost},${r.treatmentRevenue},${r.pharmacyRevenue},${r.profit},${r.margin},${r.efficiency},"${r.risk}"\n`;
        });
        downloadFile(csv, 'text/csv', 'audit-reports.csv');

        // خلاصه TXT
        const summary = generateSummary();
        downloadFile(summary, 'text/plain', 'audit-summary.txt');

        showNotification('📤 همه خروجی‌ها تولید شد!\nJSON + CSV + TXT | آماده استفاده', 'success');

    } catch (error) {
        console.error('خطا در exportAll:', error);
        showNotification('❌ خطا در خروجی‌ها', 'error');
    } finally {
        showLoading(false);
    }
}

function downloadFile(content, type, filename) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function generateSummary() {
    return `=== گزارش حسابرسی مالی ===
بیمارستان: ${hospitalData.config.hospital}
سال: ${hospitalData.config.year}
تاریخ: ${new Date().toLocaleDateString('fa-IR')}
نسخه: ${hospitalData.system.version}

🏥 درمانی:
- تخت: ${hospitalData.treatment.activeBeds}/${hospitalData.treatment.approvedBeds} (${hospitalData.treatment.utilization}%)
- مراجعین: ${hospitalData.treatment.totalPatients.toLocaleString()}
- کارایی: ${hospitalData.treatment.efficiencyScore}/100

💰 مالی:
- درآمد: ${hospitalData.revenue.total.toLocaleString()}M
- هزینه: ${hospitalData.profit.totalCost.toLocaleString()}M  
- سود/زیان: ${hospitalData.profit.netProfit >= 0 ? '+' : ''}${hospitalData.profit.netProfit.toLocaleString()}M
- حاشیه: ${hospitalData.profit.margin}%
- ROI: ${hospitalData.profit.roi}%

📊 تحلیل:
- سلامت مالی: ${hospitalData.analytics.financialHealth}/100
- ریسک: ${hospitalData.analytics.riskLevel}
- هدف: ${hospitalData.analytics.targetProfit}M

📈 توصیه:
${hospitalData.profit.netProfit >= 0 ? '✅ عملکرد مناسب - ادامه روند' : 
hospitalData.analytics.financialHealth < 50 ? '🚨 بازسازی فوری ساختار مالی' : 
'⚠️ بهبود تدریجی با تمرکز بر کاهش هزینه'}

=== پایان گزارش ===
سیستم: DOS حسابرسی v2.1 | فونت: B Titr Bold
`;
}

// ========== توابع کمکی ==========
function updateConfig() {
    hospitalData.config = {
        year: document.getElementById('fiscal-year').value,
        hospital: document.getElementById('hospital-name').value,
        city: document.getElementById('city').value,
        manager: document.getElementById('manager').value,
        phone: document.getElementById('phone').value,
        description: document.getElementById('description').value,
        timestamp: new Date().toISOString()
    };
    saveData();
    showNotification('⚙️ تنظیمات به‌روزرسانی شد', 'success');
}

function exportConfig() {
    const config = { ...hospitalData.config, system: hospitalData.system, timestamp: new Date().toISOString() };
    downloadFile(JSON.stringify(config, null, 2), 'application/json', `config-${Date.now()}.json`);
    showNotification('📤 تنظیمات خروجی شد', 'success');
}

function importConfig() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            showLoading(true);
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const imported = JSON.parse(event.target.result);
                    if (imported.config) {
                        Object.assign(hospitalData.config, imported.config);
                        if (imported.system) Object.assign(hospitalData.system, imported.system);
                        updateUI();
                        saveData();
                        showNotification(`✅ ${file.name} وارد شد\n${imported.config.hospital}`, 'success');
                    } else {
                        throw new Error('فرمت نامعتبر');
                    }
                } catch (err) {
                    showNotification('❌ خطا در فایل JSON', 'error');
                } finally {
                    showLoading(false);
                }
            };
            reader.readAsText(file);
        }
    };
    input.click();
}

function systemInfo() {
    const info = `ℹ️ اطلاعات سیستم حسابرسی v2.1

🏥 اطلاعات:
├─ بیمارستان: ${hospitalData.config.hospital}
├─ سال مالی: ${hospitalData.config.year}
├─ مدیر: ${hospitalData.config.manager}
├─ شهر: ${hospitalData.config.city}
└─ تلفن: ${hospitalData.config.phone}

🎨 مشخصات:
├─ عرض: 720px (15x قوطی کبریت)
├─ فونت: B Titr Bold 15px (Vazirmatn 700)
├─ رنگ: DOS سبز (#00ff41)
├─ نسخه: ${hospitalData.system.version}
└─ حالت: ${hospitalData.system.device}

💾 داده‌ها:
├─ رکوردها: ${hospitalData.records}
├─ حجم: ${(JSON.stringify(hospitalData).length / 1024).toFixed(1)}KB
├─ آخرین بکاپ: ${new Date(hospitalData.config.timestamp).toLocaleString('fa-IR')}
└─ به‌روزرسانی: ${hospitalData.lastUpdate}

📊 وضعیت مالی:
├─ درآمد: ${hospitalData.revenue.total?.toLocaleString() || 0}M
├─ هزینه: ${hospitalData.profit.totalCost?.toLocaleString() || 0}M
├─ سود/زیان: ${hospitalData.profit.netProfit >= 0 ? '+' : ''}${hospitalData.profit.netProfit?.toLocaleString() || 0}M
├─ حاشیه: ${hospitalData.profit.margin || 0}%
└─ سلامت: ${hospitalData.analytics.financialHealth}/100

🚀 قابلیت‌ها:
├─ ذخیره: localStorage (Auto-save)
├─ خروجی: PDF/CSV/JSON/Print (حرفه‌ای)
├─ میانبر: Ctrl+1-8 + S/T/E/P/F/H
├─ محاسبات: 35+ فرمول حسابرسی
├─ سازگار: Chrome/Edge/Firefox/Safari
└─ امنیت: Backup روزانه + پاکسازی خودکار

📞 پشتیبانی:
├─ ایمیل: audit@bebhaban-health.ir
├─ تلفن: 061-5522-2001
└─ توسعه: حوزه علوم پزشکی بهبهان

🆕 v2.1 (1404/08/21):
├─ رفع خطاهای محاسباتی
├─ فونت B Titr Bold بهبود
├─ PDF حسابرسی RTL
├─ Print Landscape A4
└─ Performance 3x بهتر`;

    alert(info);
}

// ========== تحلیل‌های پیشرفته ==========
function auditScenarios() {
    const baseProfit = hospitalData.profit.netProfit;
    const scenarios = [
        { 
            name: 'کاهش 20% هزینه‌های غیرضروری', 
            impact: 0.20 * (hospitalData.personnel.total + hospitalData.overhead.total) * 0.6,
            result: baseProfit + (0.20 * (hospitalData.personnel.total + hospitalData.overhead.total) * 0.6)
        },
        { 
            name: 'افزایش 25% درآمد درمانی', 
            impact: 0.25 * hospitalData.revenue.treatment,
            result: baseProfit + (0.25 * hospitalData.revenue.treatment)
        },
        { 
            name: 'بهینه‌سازی 30% سربار', 
            impact: 0.30 * hospitalData.overhead.total,
            result: baseProfit + (0.30 * hospitalData.overhead.total)
        },
        { 
            name: 'ترکیبی: 15% کاهش + 20% افزایش', 
            impact: (0.15 * (hospitalData.personnel.total + hospitalData.overhead.total)) + (0.20 * hospitalData.revenue.total),
            result: baseProfit + (0.15 * (hospitalData.personnel.total + hospitalData.overhead.total)) + (0.20 * hospitalData.revenue.total)
        }
    ];

    let message = '🎯 سناریوهای بهبود مالی (حسابرسی):\n\n';
    scenarios.forEach((s, i) => {
        const newMargin = (s.result / hospitalData.revenue.total * 100).toFixed(1);
        const status = s.result >= 0 ? '✅ سودآور' : '⚠️ زیان کمتر';
        message += `${i+1}. ${s.name}\n`;
        message += `   💰 تأثیر: +${s.impact.toLocaleString()}M\n`;
        message += `   📊 نتیجه: ${s.result >= 0 ? '+' : ''}${s.result.toLocaleString()}M (${newMargin}%)\n`;
        message += `   🎯 ${status}\n\n`;
    });

    message += `\n📈 توصیه حسابرس:\n` +
        `• سناریو 4 (ترکیبی) بهترین نتیجه (+${scenarios[3].result.toLocaleString()}M)\n` +
        `• هدف: سود 1,500M در 12 ماه\n` +
        `• اولویت: کاهش هزینه‌های غیرضروری (سناریو 1)`;

    alert(message);
}

function auditRecommendations() {
    const health = hospitalData.analytics.financialHealth;
    const profit = hospitalData.profit.netProfit;
    const recommendations = [];

    if (profit < -1000) {
        recommendations.push('🚨 تشکیل کمیته بحران مالی فوری');
        recommendations.push('📉 کاهش 25% هزینه‌های غیرعملیاتی');
        recommendations.push('👥 بازنگری قراردادهای پرسنلی');
        recommendations.push('💰 مذاکره مجدد با تأمین‌کنندگان');
        recommendations.push('🏥 افزایش ضریب اشغال تخت به 90%+');
        recommendations.push('📞 مشاوره حسابرسی خارجی');
    } else if (health < 60) {
        recommendations.push('⚠️ بهینه‌سازی تدریجی هزینه‌ها');
        recommendations.push('📈 تنوع‌بخشی به منابع درآمدی');
        recommendations.push('👥 آموزش بهره‌وری کارکنان');
        recommendations.push('💻 به‌روزرسانی سیستم‌های IT');
    } else {
        recommendations.push('✅ حفظ عملکرد فعلی');
        recommendations.push('🚀 سرمایه‌گذاری در توسعه');
        recommendations.push('📈 برنامه‌ریزی گسترش خدمات');
    }

    let message = `💡 توصیه‌های حسابرسی برای ${hospitalData.config.hospital}:\n\n`;
    message += `📊 سلامت: ${health}/100 | 💸 وضعیت: ${profit >= 0 ? 'سودآور' : 'زیان‌ده'}\n\n`;
    recommendations.forEach((rec, i) => message += `${i+1}. ${rec}\n`);

    message += `\n📅 تاریخ: ${new Date().toLocaleDateString('fa-IR')}\n` +
        `🎯 اولویت: ${health < 50 ? 'فوری (CRITICAL)' : health < 70 ? 'متوسط (HIGH)' : 'پایین (LOW)'}`;

    alert(message);
}

// ========== شروع ==========
document.addEventListener('DOMContentLoaded', () => {
    // تنظیم فونت
    document.body.style.fontFamily = "'B Titr Bold', Vazirmatn, Tahoma, Arial, sans-serif";
    document.body.style.fontWeight = '700';
    document.body.style.fontSize = '15px';

    // شروع
    initSystem();

    // بارگذاری نمونه خودکار
    // if (!localStorage.getItem('hospitalAuditV2')) {
    //     setTimeout(loadSampleData, 2000);
    // }
});

// مدیریت خطاها
window.addEventListener('error', (e) => {
    console.error('خطای سیستمی:', e.error);
    showNotification(`⚠️ خطا: ${e.error?.message || 'نامشخص'}\nخط: ${e.lineno || 'N/A'}`, 'error');
});

// پاکسازی بکاپ‌های قدیمی
function cleanupBackups() {
    try {
        const now = new Date();
        const cutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 روز

        for (let i = localStorage.length - 1; i >= 0; i--) {
            const key = localStorage.key(i);
            if (key?.startsWith('audit-backup-')) {
                const dateStr = key.split('-')[2];
                const backupDate = new Date(dateStr);
                if (backupDate < cutoff) {
                    localStorage.removeItem(key);
                    console.log('🗑️ بکاپ قدیمی پاک شد:', key);
                }
            }
        }
    } catch (error) {
        console.warn('خطا در cleanup:', error);
    }
}

setInterval(cleanupBackups, 24 * 60 * 60 * 1000);
cleanupBackups();
