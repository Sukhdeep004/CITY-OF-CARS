/* ===================================
   SPECS PAGE JAVASCRIPT
   =================================== */

const carSpecs = {
    'Ferrari 812': {
        engine: '6.2L V12',
        power: '819 HP',
        torque: '718 Nm',
        acceleration: '2.9s (0-100 km/h)',
        topSpeed: '340 km/h',
        transmission: '7-Speed Automatic',
        price: '$455,000'
    },
    'Lamborghini Revuelto': {
        engine: '6.5L V12 Hybrid',
        power: '1001 HP',
        torque: '1100 Nm',
        acceleration: '2.5s (0-100 km/h)',
        topSpeed: '350 km/h',
        transmission: '8-Speed Automatic',
        price: '$550,000'
    },
    'Tesla Model S': {
        engine: 'Tri-Motor Electric',
        power: '1020 HP',
        torque: '1420 Nm',
        acceleration: '1.99s (0-100 km/h)',
        topSpeed: '322 km/h',
        range: '650 km',
        price: '$115,000'
    },
    'McLaren 720S': {
        engine: '4.0L Twin-Turbo V8',
        power: '720 HP',
        torque: '770 Nm',
        acceleration: '2.8s (0-100 km/h)',
        topSpeed: '341 km/h',
        transmission: '7-Speed Automatic',
        price: '$315,000'
    }
};

function viewCarModal(carName) {
    const specs = carSpecs[carName];
    if (specs) {
        alert(`${carName}\n\nEngine: ${specs.engine}\nPower: ${specs.power}\nTorque: ${specs.torque}\n0-100 km/h: ${specs.acceleration}\nTop Speed: ${specs.topSpeed}\nPrice: ${specs.price}`);
    }
}

const compareCar1 = document.getElementById('compareCar1');
const compareCar2 = document.getElementById('compareCar2');
const comparisonResult = document.getElementById('comparisonResult');

function updateComparison() {
    const car1 = compareCar1?.value;
    const car2 = compareCar2?.value;

    if (!car1 || !car2 || car1 === 'Select Car 1' || car2 === 'Select Car 2') {
        if (comparisonResult) comparisonResult.innerHTML = '';
        return;
    }

    const specs1 = carSpecs[car1];
    const specs2 = carSpecs[car2];

    if (specs1 && specs2) {
        let html = `
            <div class="row">
                <div class="col-md-6">
                    <h4>${car1}</h4>
                    <ul class="list-unstyled">
        `;
        
        for (const [key, value] of Object.entries(specs1)) {
            html += `<li><strong>${key}:</strong> ${value}</li>`;
        }
        
        html += `
                    </ul>
                </div>
                <div class="col-md-6">
                    <h4>${car2}</h4>
                    <ul class="list-unstyled">
        `;
        
        for (const [key, value] of Object.entries(specs2)) {
            html += `<li><strong>${key}:</strong> ${value}</li>`;
        }
        
        html += `
                    </ul>
                </div>
            </div>
        `;
        
        if (comparisonResult) comparisonResult.innerHTML = html;
    }
}

if (compareCar1) compareCar1.addEventListener('change', updateComparison);
if (compareCar2) compareCar2.addEventListener('change', updateComparison);
