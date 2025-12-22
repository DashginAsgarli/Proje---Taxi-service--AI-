let map, userMarker, routeLine;
let state = {
    ride: null,
    pickup: "",
    dest: "",
    darkMode: localStorage.getItem('darkMode') === 'true'
};

const ridePrices = {
    'GetGəl': { base: 1.5, perKm: 0.7, icon: 'fa-car' },
    'Priority': { base: 3.0, perKm: 1.1, icon: 'fa-rocket' },
    'XL': { base: 4.0, perKm: 1.5, icon: 'fa-users' },
    'Eco': { base: 1.8, perKm: 0.75, icon: 'fa-leaf' }
};

document.addEventListener('DOMContentLoaded', () => {
    initMap();
    if (state.darkMode) document.body.classList.add('dark-mode');

    document.getElementById('menuBtn').onclick = () => {
        document.getElementById('sideMenu').classList.remove('invisible');
        document.getElementById('menuOverlay').classList.replace('opacity-0', 'opacity-50');
        document.getElementById('menuContent').classList.replace('-translate-x-full', 'translate-x-0');
    };

    document.getElementById('menuOverlay').onclick = () => {
        document.getElementById('menuOverlay').classList.replace('opacity-50', 'opacity-0');
        document.getElementById('menuContent').classList.replace('translate-x-0', '-translate-x-full');
        setTimeout(() => document.getElementById('sideMenu').classList.add('invisible'), 300);
    };

    document.getElementById('sheetHandle').onclick = () => {
        document.getElementById('sheet').classList.toggle('is-open');
    };

    document.getElementById('darkModeToggle').onclick = toggleDarkMode;
});

function initMap() {
    map = L.map('map', { zoomControl: false }).setView([40.4093, 49.8671], 14);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    userMarker = L.marker([40.4093, 49.8671]).addTo(map).bindPopup("Mənim yerim").openPopup();
}

function showRides() {
    const p = document.getElementById('pickup').value;
    const d = document.getElementById('dest').value;
    if (!p || !d) return showNotification("Ünvanları daxil edin!", "error");

    state.pickup = p;
    state.dest = d;

    const km = (Math.random() * 10 + 2).toFixed(1);
    const rideContainer = document.getElementById('rideOptions');
    rideContainer.innerHTML = '';

    Object.keys(ridePrices).forEach(type => {
        const price = (ridePrices[type].base + (ridePrices[type].perKm * km)).toFixed(2);
        rideContainer.innerHTML += `
                    <div onclick="selectRide('${type}', ${price})" class="ride-option p-4 border-2 border-gray-100 rounded-xl cursor-pointer hover:border-green-500 transition-all flex justify-between items-center">
                        <div class="flex items-center space-x-3">
                            <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                <i class="fas ${ridePrices[type].icon} text-gray-600"></i>
                            </div>
                            <div>
                                <h3 class="font-bold">${type}</h3>
                                <p class="text-xs text-gray-500">${km} km • 12 dəq</p>
                            </div>
                        </div>
                        <div class="font-bold text-lg">₼${price}</div>
                    </div>
                `;
    });

    document.getElementById('search').classList.add('hidden');
    document.getElementById('rides').classList.remove('hidden');
    document.getElementById('sheet').classList.add('is-open');
}

function selectRide(type, price) {
    state.ride = type;
    document.querySelectorAll('.ride-option').forEach(el => el.classList.remove('selected', 'border-green-500'));
    event.currentTarget.classList.add('selected', 'border-green-500');

    const btn = document.getElementById('bookRideBtn');
    btn.disabled = false;
    btn.innerText = `${type} Sifariş Et`;
    btn.classList.replace('bg-gray-300', 'bg-green-600');
    btn.classList.replace('text-gray-500', 'text-white');
}

function bookRide() {
    document.getElementById('rides').classList.add('hidden');
    document.getElementById('driverPrefs').classList.remove('hidden');
}

function setDriverOption(opt) {
    const multi = document.getElementById('optMulti');
    const single = document.getElementById('optSingle');
    if (opt === 'multi') {
        multi.className = "p-4 border-2 border-green-500 bg-green-50 rounded-xl cursor-pointer";
        single.className = "p-4 border-2 border-gray-100 rounded-xl cursor-pointer";
    } else {
        single.className = "p-4 border-2 border-green-500 bg-green-50 rounded-xl cursor-pointer";
        multi.className = "p-4 border-2 border-gray-100 rounded-xl cursor-pointer";
    }
}

function finalStepConfirm() {
    document.getElementById('driverPrefs').classList.add('hidden');
    document.getElementById('booking').classList.remove('hidden');
    showNotification("Sürücü axtarılır...", "success");
}

function goBackToSearch() {
    document.getElementById('rides').classList.add('hidden');
    document.getElementById('search').classList.remove('hidden');
}

function toggleDarkMode() {
    state.darkMode = !state.darkMode;
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', state.darkMode);
    showNotification(state.darkMode ? "Qaranlıq rejim aktiv" : "İşıqlı rejim aktiv", "info");
}

function showNotification(msg, type) {
    const container = document.getElementById('notificationContainer');
    const toast = document.createElement('div');
    toast.className = `p-4 mb-2 rounded-xl text-white shadow-lg fade-in ${type === 'error' ? 'bg-red-500' : 'bg-green-600'}`;
    toast.innerText = msg;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}
function selectRecentTrip(pickup, dest) {
    document.getElementById('pickup').value = pickup;
    document.getElementById('dest').value = dest;
    showNotification("Ünvanlar dolduruldu", "info");
}




function initHistory() {
    const mockHistory = [
        {
            pickup: "Şonqar qəsəbəsi",
            dest: "Səməd Vurğun bağı",
            price: "12.00",
            date: "21.12.2025"
        },
        {
            pickup: "Heydər Əliyev Hava Limanı",
            dest: "Port Baku Mall",
            price: "15.50",
            date: "20.12.2025"
        },
        {
            pickup: "İçərişəhər m/st",
            dest: "Alov Qüllələri (Flame Towers)",
            price: "3.40",
            date: "19.12.2025"
        },
        {
            pickup: "Gənclik Mall",
            dest: "Bakı Kristal Zalı",
            price: "6.20",
            date: "18.12.2025"
        }
    ];

    renderHistoryUI(mockHistory);
}

function renderHistoryUI(history) {
    const container = document.querySelector('.recent-trips');
    if (!container) return;

    let html = '<h3 class="recent-trips-title">Son səfərlər</h3>';

    history.forEach(trip => {
        html += `
            <div class="trip-item group hover:bg-gray-200 transition-colors" onclick="selectRecentTrip('${trip.pickup}', '${trip.dest}')">
                <div class="trip-info">
                    <h4 class="font-semibold text-gray-800">${trip.dest}</h4>
                    <p class="text-xs text-gray-500">${trip.pickup}</p>
                </div>
                <div class="text-right">
                    <div class="trip-price font-bold text-green-600">₼${trip.price}</div>
                    <div class="text-[10px] text-gray-400">${trip.date}</div>
                </div>
            </div>`;
    });

    container.innerHTML = html;
}
function finalStepConfirm() {
    document.getElementById('driverPrefs').classList.add('hidden');
    document.getElementById('booking').classList.remove('hidden');
    showNotification("Sürücü axtarılır...", "success");

    setTimeout(() => {
        findDriver();
    }, 6000);
}

function findDriver() {
    const driverData = {
        name: "Elvin Məmmədov",
        rating: "4.9 ★",
        car: "Toyota Prius (Gümüşü)",
        plate: "77-AB-101",
        phone: "+994 50 123 45 67"
    };
    document.getElementById('booking').classList.add('hidden');
    const driverFoundDiv = document.getElementById('driverFound');
    driverFoundDiv.classList.remove('hidden');

    driverFoundDiv.innerHTML = `
        <div class="driver-card bg-white p-5 rounded-2xl shadow-lg border-t-4 border-green-500 fade-in">
            <div class="flex items-center justify-between mb-4">
                <div class="flex items-center space-x-3">
                    <div class="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center text-2xl text-gray-600">
                        <i class="fas fa-user-tie"></i>
                    </div>
                    <div>
                        <h4 class="font-bold text-lg">${driverData.name}</h4>
                        <p class="text-sm text-green-600 font-semibold">${driverData.rating}</p>
                    </div>
                </div>
                <div class="text-right">
                    <div class="font-bold text-gray-800">${driverData.plate}</div>
                    <div class="text-xs text-gray-500">${driverData.car}</div>
                </div>
            </div>

            <div class="flex space-x-2 mt-4">
                <a href="tel:${driverData.phone}" class="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold text-center flex items-center justify-center">
                    <i class="fas fa-phone-alt mr-2"></i> Zəng et
                </a>
                <button onclick="showNotification('Mesaj bölməsi tezliklə...', 'info')" class="w-14 bg-gray-100 py-3 rounded-xl text-gray-600">
                    <i class="fas fa-comment-dots"></i>
                </button>
            </div>
            
            <div class="mt-4 p-3 bg-blue-50 rounded-lg text-xs text-blue-700 flex items-center">
                <i class="fas fa-info-circle mr-2"></i> Sürücü marşrut üzrə sizə yaxınlaşır.
            </div>
        </div>
    `;

    showNotification("Sürücü tapıldı!", "success");

}

document.addEventListener('DOMContentLoaded', initHistory);

document.addEventListener('DOMContentLoaded', () => {
    const splash = document.getElementById('splash-screen');
    const logo = document.getElementById('splash-logo');
    const progressBar = document.getElementById('progress-bar');

    setTimeout(() => {
        logo.classList.add('logo-appear');
        progressBar.style.width = '100%'; 
    }, 500);

    setTimeout(() => {
        splash.classList.add('splash-exit');
        
        setTimeout(() => {
            splash.style.display = 'none';
        }, 1000);
        
    }, 2000); 
});

function addStop() {
    const container = document.getElementById('extraStops');
    const stopDiv = document.createElement('div');
    stopDiv.className = "flex space-x-3 mb-4 fade-in items-center";
    stopDiv.innerHTML = `
        <div class="w-1.5 h-10 bg-yellow-500 rounded-full my-auto"></div>
        <input type="text" placeholder="Əlavə dayanacaq" class="flex-1 p-3 rounded-xl bg-gray-100 outline-none">
        <button onclick="this.parentElement.remove()" class="text-red-500 px-2"><i class="fas fa-times"></i></button>
    `;
    container.appendChild(stopDiv);
}
