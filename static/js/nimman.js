// Main script for Nimman Smart Travel Guide
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the screens
    initScreens();
    
    // Initialize the map
    initMap();
    
    // Initialize the chatbot
    initChatbot();
});

// Screen Management Functions
function initScreens() {
    // Hide all screens except the active one on load
    document.querySelectorAll('.screen').forEach(screen => {
        if (!screen.classList.contains('active')) {
            screen.style.display = 'none';
        }
    });
    
    // Add animation class to splash screen elements
    document.querySelectorAll('.animate-slide-up').forEach((el, index) => {
        el.style.animationDelay = `${index * 0.1}s`;
    });
}

function showScreen(screenId) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.style.display = 'none';
        screen.classList.remove('active');
    });
    
    // Show the selected screen
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.style.display = 'flex';
        targetScreen.classList.add('active');
        
        // Special handling for map screen
        if (screenId === 'map-screen' && window.map) {
            setTimeout(() => {
                window.map.invalidateSize();
            }, 100);
        }
    }
}

// Map Functions
function initMap() {
    // Create map centered on Nimman area in Chiang Mai
    window.map = L.map('map').setView([18.8005, 98.9679], 15);
    
    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(window.map);
    
    // Add popular places as markers - These will remain in the code but could be fetched from API
    addMapMarkers();
}

// Function to get appropriate icon based on location type
function getIconByLocationType(type) {
    // Map location types to appropriate FontAwesome icons
    const iconMap = {
        'ศูนย์การค้า': 'shopping-bag',
        'คอมมูนิตี้มอลล์': 'store',
        'ห้างสรรพสินค้า': 'shopping-cart',
        'ผับ': 'music',
        'บาร์': 'glass-martini',
        'คาเฟ่': 'coffee',
        'ร้านอาหาร': 'utensils',
        'โรงแรม': 'bed',
        'ที่พัก': 'hotel',
        'วัด': 'place-of-worship',
        'สถานที่ท่องเที่ยว': 'landmark',
        'สวนสาธารณะ': 'tree'
    };
    
    // Check if the type includes any of the keys
    for (const [key, icon] of Object.entries(iconMap)) {
        if (type.includes(key)) {
            return icon;
        }
    }
    
    // Default icon if no match is found
    return 'map-marker-alt';
}

function addMapMarkers() {
    // Define popular locations with their coordinates and details
    const locations = [
        {
            name: "One Nimman",
            type: "ศูนย์การค้า & คอมมูนิตี้มอลล์",
            coords: [18.7968, 98.9677],
            description: "ศูนย์การค้าสไตล์ล้านนาร่วมสมัย รวมร้านค้า ร้านอาหาร และร้านกาแฟ"
        },
        {
            name: "Think Park",
            type: "คอมมูนิตี้มอลล์",
            coords: [18.8004, 98.9678],
            description: "แหล่งช้อปปิ้งและพบปะสังสรรค์ที่มีร้านค้าเล็กๆ น่ารัก"
        },
        {
            name: "Maya Lifestyle Shopping Center",
            type: "ห้างสรรพสินค้า",
            coords: [18.8023, 98.9673],
            description: "ไลฟ์สไตล์มอลล์ที่ใหญ่ที่สุดในย่านนิมมาน มีร้านค้า ร้านอาหาร และโรงภาพยนตร์"
        },
        {
            name: "Warm Up Cafe",
            type: "ผับ & บาร์",
            coords: [18.7985, 98.9664],
            description: "สถานบันเทิงยอดนิยม มีทั้งอาหาร เครื่องดื่ม และดนตรีสด"
        },
        {
            name: "Ristr8to Coffee",
            type: "คาเฟ่",
            coords: [18.8008, 98.9670],
            description: "ร้านกาแฟสุดฮิปที่มีชื่อเสียงเรื่องลาเต้อาร์ตและเมนูกาแฟสุดครีเอทีฟ"
        },
        {
            name: "Nimman House Hotel",
            type: "โรงแรม",
            coords: [18.8012, 98.9685],
            description: "โรงแรมบูติกสไตล์โมเดิร์นในย่านนิมมาน ใกล้แหล่งช้อปปิ้งและร้านอาหาร"
        }
    ];
    
    // Create custom icon for markers
    function createCustomIcon(iconName) {
        return L.divIcon({
            html: `<div class="map-marker bg-nimman-purple shadow-lg rounded-full p-2 border-2 border-white">
                    <i class="fas fa-${iconName} text-white"></i>
                   </div>`,
            className: '',
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        });
    }
    
    // Add markers to map
    locations.forEach(location => {
        // Get appropriate icon based on location type
        const iconName = getIconByLocationType(location.type);
        
        const marker = L.marker(location.coords, {
            icon: createCustomIcon(iconName)
        }).addTo(window.map);
        
        // Create popup content
        const popupContent = `
            <div class="popup-content p-2">
                <h3 class="font-bold text-nimman-purple">${location.name}</h3>
                <p class="text-xs text-gray-600">${location.type}</p>
                <p class="text-sm mt-1">${location.description}</p>
                <div class="mt-2 flex justify-between">
                    <button class="text-xs bg-nimman-purple text-white px-2 py-1 rounded" 
                            onclick="addToPlanner('${location.name}', '${location.type}', [${location.coords}])">
                        <i class="fas fa-plus mr-1"></i> เพิ่มลงแผน
                    </button>
                    <button class="text-xs text-nimman-purple underline">
                        ดูรายละเอียด
                    </button>
                </div>
            </div>
        `;
        
        marker.bindPopup(popupContent);
    });
}

function focusLocation(coords) {
    if (window.map) {
        window.map.setView(coords, 17);
        togglePlanner();
    }
}

function togglePlanner() {
    const planner = document.getElementById('planner-sidebar');
    if (planner.classList.contains('hidden')) {
        planner.classList.remove('hidden');
        setTimeout(() => {
            planner.classList.remove('transform');
            planner.classList.remove('translate-x-full');
        }, 10);
    } else {
        planner.classList.add('transform');
        planner.classList.add('translate-x-full');
        setTimeout(() => {
            planner.classList.add('hidden');
        }, 300);
    }
}

function addToPlanner(name, type, coords) {
    // Get the planner container
    const planner = document.getElementById('planner-sidebar');
    
    // Show the planner if it's hidden
    if (planner.classList.contains('hidden')) {
        togglePlanner();
    }
    
    // Simple time assignment (would be more sophisticated in a real app)
    const startTime = new Date();
    startTime.setHours(startTime.getHours() + 1);
    startTime.setMinutes(0);
    const endTime = new Date(startTime);
    endTime.setHours(endTime.getHours() + 2);
    
    const formattedStartTime = startTime.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', hour12: false });
    const formattedEndTime = endTime.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', hour12: false });
    
    // Create a new item for the planner
    const newPlannerItem = document.createElement('div');
    newPlannerItem.className = 'bg-gray-100 p-3 rounded-lg mb-4';
    newPlannerItem.innerHTML = `
        <div class="flex justify-between items-start">
            <div>
                <h4 class="font-medium">${name}</h4>
                <p class="text-sm text-gray-600">${type}</p>
            </div>
            <div class="flex space-x-1">
                <button class="text-gray-500 hover:text-nimman-purple">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="text-gray-500 hover:text-red-500" onclick="this.parentNode.parentNode.parentNode.remove()">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
        <div class="mt-2 text-sm">
            <div><i class="far fa-clock mr-1"></i> ${formattedStartTime} - ${formattedEndTime}</div>
            <div class="flex items-center mt-1 text-nimman-purple">
                <i class="fas fa-map-marker-alt mr-1"></i>
                <span class="underline cursor-pointer" onclick="focusLocation([${coords}])">ดูในแผนที่</span>
            </div>
        </div>
    `;
    
    // Add the new item to the planner
    const itemsContainer = planner.querySelector('.space-y-4');
    itemsContainer.appendChild(newPlannerItem);
}

// Modified Chatbot with API Integration
function initChatbot() {
    const chatInput = document.getElementById('chat-input');
    const sendButton = document.getElementById('send-message');
    const chatMessages = document.getElementById('chat-messages');

    const chatApiEndpoint = 'http://127.0.0.1:8000/chat';

    async function getChatbotResponse(message) {
        try {
            const response = await fetch(chatApiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ question: message })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json(); // expected: { response: "...", locations: [...] }
        } catch (error) {
            console.error('Error fetching chatbot response:', error);
            return { response: "ขออภัยค่ะ เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้งค่ะ" };
        }
    }

    function addLocationToMap(location) {
        if (window.map && location) {
            const lat = 18.8005 + (Math.random() - 0.5) * 0.01;
            const lng = 98.9679 + (Math.random() - 0.5) * 0.01;

            const iconName = getIconByLocationType(location.type);

            const customIcon = L.divIcon({
                html: `<div class="map-marker bg-nimman-purple shadow-lg rounded-full p-2 border-2 border-white">
                        <i class="fas fa-${iconName} text-white"></i>
                       </div>`,
                className: '',
                iconSize: [30, 30],
                iconAnchor: [15, 15]
            });

            const marker = L.marker([lat, lng], { icon: customIcon }).addTo(window.map);

            const popupContent = `
                <div class="popup-content p-2">
                    <h3 class="font-bold text-nimman-purple">${location.name}</h3>
                    <p class="text-xs text-gray-600">${location.type}</p>
                    <p class="text-sm mt-1">${location.details}</p>
                    <div class="mt-2 flex justify-between">
                        <button class="text-xs bg-nimman-purple text-white px-2 py-1 rounded" 
                                onclick="addToPlanner('${location.name}', '${location.type}', [${lat}, ${lng}])">
                            <i class="fas fa-plus mr-1"></i> เพิ่มลงแผน
                        </button>
                        <button class="text-xs text-nimman-purple underline">
                            ดูรายละเอียด
                        </button>
                    </div>
                </div>
            `;

            marker.bindPopup(popupContent);
        }
    }

    function displayLocations(locations) {
        if (!locations || locations.length === 0) return;

        const locationsContainer = document.createElement('div');
        locationsContainer.className = 'locations-container bg-gray-100 rounded-lg p-2 mt-2 max-w-xs';

        locations.forEach(location => {
            const escapedLocation = JSON.stringify(location).replace(/"/g, '&quot;');
            const locationElement = document.createElement('div');
            locationElement.className = 'location-item p-2 mb-2 border-b border-gray-300';
            locationElement.innerHTML = `
                <div class="font-medium text-nimman-purple">${location.name}</div>
                <div class="text-xs text-gray-600">${location.type}</div>
                <div class="text-sm">${location.details}</div>
                <button class="text-xs bg-nimman-purple text-white px-2 py-1 rounded mt-1" 
                        onclick="showScreen('map-screen'); setTimeout(() => { addLocationToMap(${escapedLocation}) }, 500);">
                    <i class="fas fa-map-marker-alt mr-1"></i> ดูในแผนที่
                </button>
            `;
            locationsContainer.appendChild(locationElement);
        });

        chatMessages.appendChild(locationsContainer);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        locations.forEach(addLocationToMap);
    }

    async function typeMessage(content, sender) {
    const messageElement = document.createElement('div');
    messageElement.className = sender === 'user'
        ? 'user-message bg-nimman-purple text-white rounded-lg p-3 max-w-xs ml-auto mr-2 mb-2'
        : 'bot-message bg-nimman-purple text-white rounded-lg p-3 max-w-xs mx-2 mb-2';

    // แปลงข้อความก่อนแสดง
    let formatted = content
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>');

    messageElement.innerHTML = '';

    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // พิมพ์ทีละตัวอักษร แบบง่ายๆ
    for (let i = 0; i < formatted.length; i++) {
        messageElement.innerHTML = formatted.substring(0, i + 1);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        await new Promise(resolve => setTimeout(resolve, 20));  // ความเร็วการพิมพ์
    }
}


    async function sendMessage() {
        const message = chatInput.value.trim();
        if (!message) return;

        addMessage(message, 'user');
        chatInput.value = '';

        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'typing-indicator bg-gray-200 rounded-lg p-3 max-w-xs mx-2 mb-2 flex';
        typingIndicator.innerHTML = `
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
        `;
        chatMessages.appendChild(typingIndicator);

        const response = await getChatbotResponse(message);
        chatMessages.removeChild(typingIndicator);

        typeMessage(response.answer || "ขออภัยค่ะ ไม่มีการตอบกลับจากระบบ", 'bot');

        if (response.locations) {
            displayLocations(response.locations);
        }
    }

    function addMessage(content, sender) {
    const messageElement = document.createElement('div');
    messageElement.className = sender === 'user'
        ? 'user-message bg-nimman-purple text-white rounded-lg p-3 max-w-xs ml-auto mr-2 mb-2'
        : 'bot-message bg-nimman-purple text-white rounded-lg p-3 max-w-xs mx-2 mb-2';

    // แปลงข้อความให้รองรับตัวหนาและขึ้นบรรทัดใหม่
    let formatted = content
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')   // **text** -> <strong>text</strong>
        .replace(/\n/g, '<br>');                             // \n -> <br>

    messageElement.innerHTML = formatted;

    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}



    window.addLocationToMap = addLocationToMap;

    sendButton.addEventListener('click', sendMessage);
    chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
}


// Add CSS styles programmatically
const styleElement = document.createElement('style');
styleElement.textContent = `
    .map-marker {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 30px;
        height: 30px;
    }
    
    .popup-content {
        min-width: 200px;
    }
    
    .screen {
        display: none;
    }
    
    .screen.active {
        display: flex;
    }
    
    .hide-scrollbar::-webkit-scrollbar {
        display: none;
    }
    
    .hide-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
    
    .bottom-nav {
        box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
    }
    
    .chat-messages {
        flex-grow: 1;
        overflow-y: auto;
        padding: 1rem;
    }
    
    /* Typing indicator animation */
    .typing-indicator {
        align-items: center;
        column-gap: 4px;
    }
    
    .typing-indicator .dot {
        width: 8px;
        height: 8px;
        background-color: #6B7280;
        border-radius: 50%;
        animation: typing-animation 1.5s infinite ease-in-out;
    }
    
    .typing-indicator .dot:nth-child(1) {
        animation-delay: 0s;
    }
    
    .typing-indicator .dot:nth-child(2) {
        animation-delay: 0.2s;
    }
    
    .typing-indicator .dot:nth-child(3) {
        animation-delay: 0.4s;
    }
    
    @keyframes typing-animation {
        0%, 100% {
            transform: translateY(0);
        }
        50% {
            transform: translateY(-4px);
        }
    }
    
    /* Location items styling */
    .locations-container {
        width: 100%;
    }
    
    .location-item:last-child {
        border-bottom: none;
        margin-bottom: 0;
    }

    .typing-indicator .dot {
    height: 8px;
    width: 8px;
    margin: 0 2px;
    background-color: #999;
    border-radius: 50%;
    display: inline-block;
    animation: blink 1.4s infinite both;
}

.typing-indicator .dot:nth-child(2) {
    animation-delay: 0.2s;
}
.typing-indicator .dot:nth-child(3) {
    animation-delay: 0.4s;
}

@keyframes blink {
    0%, 80%, 100% {
        opacity: 0;
    }
    40% {
        opacity: 1;
    }
}

`;
document.head.appendChild(styleElement);