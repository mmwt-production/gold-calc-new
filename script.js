const purityData = {
    gold: [
        { name: 'K24 (100%)', ratio: 1.000 },
        { name: 'K22 (91.6%)', ratio: 0.916 },
        { name: 'K20 (83.3%)', ratio: 0.833 },
        { name: 'K18 (75.0%)', ratio: 0.750 },
        { name: 'K14 (58.5%)', ratio: 0.585 },
        { name: 'K10 (41.6%)', ratio: 0.416 },
        { name: 'K9 (37.5%)', ratio: 0.375 }
    ],
    platinum: [
        { name: 'Pt1000 (100%)', ratio: 1.000 },
        { name: 'Pt950 (95.0%)', ratio: 0.950 },
        { name: 'Pt900 (90.0%)', ratio: 0.900 },
        { name: 'Pt850 (85.0%)', ratio: 0.850 }
    ],
    silver: [
        { name: 'Sv1000 (100%)', ratio: 1.000 },
        { name: 'Sv925 (92.5%)', ratio: 0.925 }
    ]
};

function onMetalChange(colNum) {
    const metalType = document.getElementById(`metal-${colNum}`).value;
    const puritySelect = document.getElementById(`purity-${colNum}`);
    
    puritySelect.innerHTML = '';
    
    purityData[metalType].forEach(item => {
        const option = document.createElement('option');
        option.value = item.ratio;
        option.textContent = item.name;
        puritySelect.appendChild(option);
    });
    
    calculateAll();
}

function calculateAll() {
    const marketPrices = {
        gold: parseFloat(document.getElementById('market-gold').value) || 0,
        platinum: parseFloat(document.getElementById('market-platinum').value) || 0,
        silver: parseFloat(document.getElementById('market-silver').value) || 0
    };

    let grandTotal = 0;
    let grandPurchase = 0;

    for (let i = 1; i <= 6; i++) {
        const metalType = document.getElementById(`metal-${i}`).value;
        const ratio = parseFloat(document.getElementById(`purity-${i}`).value) || 0;
        const weight = parseFloat(document.getElementById(`weight-${i}`).value) || 0;
        const rate = parseFloat(document.getElementById(`rate-${i}`).value) || 0;

        const baseMarketPrice = marketPrices[metalType];
        const unitPrice = Math.floor(baseMarketPrice * ratio);

        document.getElementById(`unit-price-${i}`).textContent = '¥' + unitPrice.toLocaleString();

        const subTotal = unitPrice * weight;
        const subPur = subTotal * (rate / 100);

        document.getElementById(`sub-total-${i}`).textContent = '¥' + Math.floor(subTotal).toLocaleString();
        document.getElementById(`sub-pur-${i}`).textContent = '¥' + Math.floor(subPur).toLocaleString();

        grandTotal += subTotal;
        grandPurchase += subPur;
    }

    document.getElementById('grand-total').textContent = '¥' + Math.floor(grandTotal).toLocaleString();
    document.getElementById('grand-purchase').textContent = '¥' + Math.floor(grandPurchase).toLocaleString();
}

function saveAsPDF() {
    const result = confirm("PDFで保存しますか？");
    
    if (result) {
        const element = document.querySelector('.container');
        const actionArea = document.querySelector('.action-area');
        
        actionArea.style.display = 'none';
        element.classList.add('pdf-mode'); 
        
        const customerName = document.getElementById('customer-name').value || 'お客様';
        const filename = `${customerName}様_地金計算書.pdf`;
        
        const opt = {
            margin:       [18, 8, 18, 8],
            filename:     filename,
            image:        { type: 'jpeg', quality: 0.98 },
            // ★ html2canvasの中に「scrollX: 0, scrollY: 0」を書き加えました。
            // これにより、画面のスクロール位置に関わらず、常に最上部を基準に綺麗にPDF化されます。
            html2canvas:  { scale: 2, backgroundColor: '#ffffff', useCORS: true, scrollX: 0, scrollY: 0 }, 
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        
        html2pdf().set(opt).from(element).save().then(() => {
            element.classList.remove('pdf-mode'); 
            actionArea.style.display = 'flex';
        });
        
    } else {
        alert("キャンセルします");
    }
}

window.addEventListener('DOMContentLoaded', () => {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const hh = String(now.getHours()).padStart(2, '0');
    const mi = String(now.getMinutes()).padStart(2, '0');
    document.getElementById('create-datetime').value = `${yyyy}/${mm}/${dd} ${hh}:${mi}`;
    
    for (let i = 1; i <= 6; i++) {
        onMetalChange(i);
    }
});