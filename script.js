// DOM Elements
const loginBtn = document.querySelector('.login-btn');
const toggleLoginPassword = document.getElementById('toggleLoginPassword');
const toggleRegisterPassword = document.getElementById('toggleRegisterPassword');
const registerPassword = document.getElementById('registerPassword');
const passwordStrengthBar = document.querySelector('.strength-bar');
const strengthText = document.querySelector('.strength-text span');
const passwordRequirements = {
    length: document.getElementById('length-req'),
    uppercase: document.getElementById('uppercase-req'),
    lowercase: document.getElementById('lowercase-req'),
    number: document.getElementById('number-req'),
    special: document.getElementById('special-req')
};
const donationForm = document.getElementById('donation-form');
const searchBtn = document.getElementById('search-btn');
const foodTypeFilter = document.getElementById('food-type-filter');
const distanceFilter = document.getElementById('distance-filter');
const locationSearch = document.getElementById('location-search');
const viewButtons = document.querySelectorAll('.view-btn');
const foodItemsContainer = document.getElementById('foodItems');

// Food Items Elements
const foodItems = document.getElementById('foodItems');

// Sample food items data
const sampleFoodItems = [
    { type: 'prepared', name: 'Fresh Pasta', distance: 2, image: 'pasta.jpg' },
    { type: 'produce', name: 'Organic Vegetables', distance: 5, image: 'vegetables.jpg' },
    { type: 'bakery', name: 'Artisan Bread', distance: 3, image: 'bread.jpg' },
    { type: 'dairy', name: 'Fresh Milk', distance: 4, image: 'milk.jpg' }
];

// Password Visibility Toggle
function togglePasswordVisibility(inputField, toggleBtn) {
    if (!inputField || !toggleBtn) return;
    
    toggleBtn.addEventListener('click', () => {
        const type = inputField.getAttribute('type') === 'password' ? 'text' : 'password';
        inputField.setAttribute('type', type);
        toggleBtn.classList.toggle('fa-eye');
        toggleBtn.classList.toggle('fa-eye-slash');
    });
}

// Initialize password visibility toggles
const loginPassword = document.getElementById('loginPassword');
if (loginPassword && toggleLoginPassword) {
    togglePasswordVisibility(loginPassword, toggleLoginPassword);
}

if (registerPassword && toggleRegisterPassword) {
    togglePasswordVisibility(registerPassword, toggleRegisterPassword);
}

// Password Strength Checker
function checkPasswordStrength(password) {
    if (!passwordStrengthBar || !strengthText || !passwordRequirements.length) return 0;
    
    const requirements = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    let strength = 0;
    Object.values(requirements).forEach(met => {
        if (met) strength += 20;
    });

    // Update UI
    Object.entries(requirements).forEach(([req, met]) => {
        const icon = passwordRequirements[req].querySelector('i');
        if (icon) {
            icon.className = met ? 'fas fa-check' : 'fas fa-times';
            icon.style.color = met ? '#4CAF50' : '#ff4444';
        }
    });

    // Update strength meter
    passwordStrengthBar.style.width = `${strength}%`;
    if (strength <= 20) {
        passwordStrengthBar.style.backgroundColor = '#ff4444';
        strengthText.textContent = 'Weak';
    } else if (strength <= 40) {
        passwordStrengthBar.style.backgroundColor = '#ffbb33';
        strengthText.textContent = 'Fair';
    } else if (strength <= 60) {
        passwordStrengthBar.style.backgroundColor = '#ffeb3b';
        strengthText.textContent = 'Good';
    } else if (strength <= 80) {
        passwordStrengthBar.style.backgroundColor = '#00C851';
        strengthText.textContent = 'Strong';
    } else {
        passwordStrengthBar.style.backgroundColor = '#007E33';
        strengthText.textContent = 'Very Strong';
    }

    return strength;
}

// Initialize password strength checker if on registration page
if (registerPassword) {
    registerPassword.addEventListener('input', (e) => {
        checkPasswordStrength(e.target.value);
    });
}

// Login Form Handling
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        // For demo purposes, accept any valid email and password
        if (email && password) {
            // Store login state
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userData', JSON.stringify({
                firstName: email.split('@')[0], // Use part of email as name
                email: email,
                lastLogin: new Date().toISOString()
            }));
            
            // Show success message
            showNotification('Login successful! Redirecting to dashboard...', 'success');
            
            // Redirect to dashboard after a short delay
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        } else {
            showNotification('Please enter both email and password', 'error');
        }
    });
}

const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = {
            userType: document.getElementById('userType').value,
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('registerEmail').value,
            password: registerPassword.value,
            phone: document.getElementById('registerPhone').value,
            zip: document.getElementById('registerZip').value,
            address: document.getElementById('registerAddress').value,
            terms: document.getElementById('terms').checked
        };

        // TODO: Implement actual registration logic
        console.log('Registration attempt:', formData);
        showNotification('Registration successful!', 'success');
        
        // Redirect to login page after successful registration
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
    });
}

// Food Donation Form
const foodDonationForm = document.getElementById('food-donation-form');
if (foodDonationForm) {
    foodDonationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = {
            donorType: document.getElementById('donor-type').value,
            foodType: document.getElementById('food-type').value,
            quantity: document.getElementById('quantity').value,
            expiry: document.getElementById('expiry').value,
            location: document.getElementById('location').value,
            storage: document.getElementById('storage').value,
            safety: {
                licensed: document.getElementById('safety1').checked,
                temperature: document.getElementById('safety2').checked,
                expiration: document.getElementById('safety3').checked
            }
        };

        // TODO: Implement actual donation submission logic
        console.log('Donation submission:', formData);
        showNotification('Donation submitted successfully!', 'success');
        foodDonationForm.reset();
    });
}

// Food Items Functionality
function renderFoodItems(items) {
    if (!foodItemsContainer) return;
    
    foodItemsContainer.innerHTML = items.map(item => `
        <div class="food-item">
            <img src="images/${item.image}" alt="${item.name}">
            <h3>${item.name}</h3>
            <p>${item.distance} miles away</p>
            <button class="primary-btn">Request Pickup</button>
        </div>
    `).join('');
}

function filterFoodItems() {
    if (!foodTypeFilter || !distanceFilter || !foodItemsContainer) return;
    
    const type = foodTypeFilter.value;
    const maxDistance = parseInt(distanceFilter.value);
    
    const filteredItems = sampleFoodItems.filter(item => {
        const typeMatch = type === 'all' || item.type === type;
        const distanceMatch = item.distance <= maxDistance;
        return typeMatch && distanceMatch;
    });

    renderFoodItems(filteredItems);
}

if (foodTypeFilter && distanceFilter) {
    foodTypeFilter.addEventListener('change', filterFoodItems);
    distanceFilter.addEventListener('change', filterFoodItems);
    // Initial render
    renderFoodItems(sampleFoodItems);
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => notification.classList.add('show'), 100);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Responsive Navigation
const navLinks = document.querySelector('.nav-links');
const hamburger = document.createElement('button');
hamburger.className = 'hamburger';
hamburger.innerHTML = '<i class="fas fa-bars"></i>';

const header = document.querySelector('header nav');
if (header && navLinks) {
    header.insertBefore(hamburger, navLinks);

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
}

// Add responsive styles
const style = document.createElement('style');
style.textContent = `
    @media (max-width: 768px) {
        .hamburger {
            display: block;
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0.5rem;
        }

        .nav-links {
            display: none;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            padding: 1rem;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }

        .nav-links.active {
            display: block;
        }

        .nav-links li {
            display: block;
            margin: 1rem 0;
        }

        .notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 1rem;
            border-radius: 4px;
            background: white;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            transform: translateY(100px);
            opacity: 0;
            transition: all 0.3s ease;
        }

        .notification.show {
            transform: translateY(0);
            opacity: 1;
        }

        .notification.success {
            background: #4CAF50;
            color: white;
        }

        .notification.error {
            background: #ff4444;
            color: white;
        }

        .notification.info {
            background: #2196F3;
            color: white;
        }
    }
`;

document.head.appendChild(style);

// Find Food Page Functionality
// View toggle functionality
viewButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        viewButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const view = btn.dataset.view;
        foodItemsContainer.className = view === 'grid' ? 'food-grid' : 'food-list';
        
        displayFoodItems(filterFoodItems());
    });
});

// Search and filter functionality
if (searchBtn) {
    searchBtn.addEventListener('click', () => {
        displayFoodItems(filterFoodItems());
    });
}

function displayFoodItems(items) {
    if (!foodItemsContainer) return;
    
    foodItemsContainer.innerHTML = '';
    
    if (items.length === 0) {
        foodItemsContainer.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h3>No food items found</h3>
                <p>Try adjusting your search filters</p>
            </div>
        `;
        return;
    }
    
    items.forEach(item => {
        const foodItem = document.createElement('div');
        foodItem.className = 'food-item';
        foodItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="food-item-content">
                <h3>${item.name}</h3>
                <div class="details">
                    <p><i class="fas fa-box"></i> Quantity: ${item.quantity}</p>
                    <p><i class="fas fa-map-marker-alt"></i> ${item.location}</p>
                    <p><i class="fas fa-road"></i> ${item.distance} miles away</p>
                    <p><i class="fas fa-temperature-low"></i> ${item.storage}</p>
                    <p><i class="fas fa-clock"></i> Expires: ${new Date(item.expiry).toLocaleString()}</p>
                </div>
                <div class="actions">
                    <button class="primary-btn" onclick="requestFood(${item.id})">
                        Request Pickup
                    </button>
                </div>
            </div>
        `;
        foodItemsContainer.appendChild(foodItem);
    });
}

function requestFood(itemId) {
    const item = foodItems.find(i => i.id === itemId);
    if (item) {
        // TODO: Implement food request functionality
        console.log('Requesting food:', item);
        showNotification('Food request submitted successfully!', 'success');
    }
}

// Initialize food items display if on find-food page
if (foodItemsContainer) {
    displayFoodItems(foodItems);
}

// Chatbot Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Chatbot Elements
    const chatbotWidget = document.getElementById('chatbotWidget');
    const chatbotToggle = document.getElementById('chatbotToggle');
    const minimizeChatbot = document.getElementById('minimizeChatbot');
    const chatbotHeader = document.getElementById('chatbotHeader');
    const chatMessages = document.getElementById('chatMessages');
    const chatInput = document.getElementById('chatInput');
    const sendMessageBtn = document.getElementById('sendMessageBtn');

    // Chatbot State
    let isChatbotActive = false;
    let isChatbotMinimized = false;
    let conversationHistory = [];
    let currentTopic = null;

    // Toggle Chatbot
    if (chatbotToggle) {
        chatbotToggle.addEventListener('click', function() {
            isChatbotActive = true;
            chatbotWidget.classList.add('active');
            chatbotWidget.style.display = 'flex';
            chatbotToggle.style.display = 'none';
        });
    }

    // Minimize Chatbot
    if (minimizeChatbot) {
        minimizeChatbot.addEventListener('click', function(e) {
            e.stopPropagation();
            isChatbotMinimized = !isChatbotMinimized;
            chatbotWidget.classList.toggle('minimized');
            minimizeChatbot.innerHTML = isChatbotMinimized ? 
                '<i class="fas fa-plus"></i>' : 
                '<i class="fas fa-minus"></i>';
        });
    }

    // Expand Chatbot on Header Click
    if (chatbotHeader) {
        chatbotHeader.addEventListener('click', function() {
            if (isChatbotMinimized) {
                isChatbotMinimized = false;
                chatbotWidget.classList.remove('minimized');
                minimizeChatbot.innerHTML = '<i class="fas fa-minus"></i>';
            }
        });
    }

    // Send Message
    function sendMessage() {
        const message = chatInput.value.trim();
        if (message === '') return;

        // Add user message to chat
        addMessage(message, 'user');
        chatInput.value = '';

        // Add to conversation history
        conversationHistory.push({ role: 'user', content: message });

        // Show typing indicator
        showTypingIndicator();

        // Process message and get bot response
        setTimeout(() => {
            // Remove typing indicator
            removeTypingIndicator();
            
            const botResponse = getBotResponse(message);
            addMessage(botResponse.text, 'bot');
            
            // Add to conversation history
            conversationHistory.push({ role: 'bot', content: botResponse.text });
            
            // Update current topic
            if (botResponse.topic) {
                currentTopic = botResponse.topic;
            }
            
            // Show suggested responses if available
            if (botResponse.suggestions && botResponse.suggestions.length > 0) {
                showSuggestedResponses(botResponse.suggestions);
            }
        }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
    }

    // Add Message to Chat
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        const paragraph = document.createElement('p');
        paragraph.textContent = text;
        
        messageContent.appendChild(paragraph);
        messageDiv.appendChild(messageContent);
        chatMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Show Typing Indicator
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';
        typingDiv.id = 'typingIndicator';
        
        const dots = document.createElement('div');
        dots.className = 'typing-dots';
        dots.innerHTML = '<span></span><span></span><span></span>';
        
        typingDiv.appendChild(dots);
        chatMessages.appendChild(typingDiv);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Remove Typing Indicator
    function removeTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    // Show Suggested Responses
    function showSuggestedResponses(suggestions) {
        const suggestionsDiv = document.createElement('div');
        suggestionsDiv.className = 'suggested-responses';
        
        suggestions.forEach(suggestion => {
            const button = document.createElement('button');
            button.className = 'suggestion-btn';
            button.textContent = suggestion;
            button.addEventListener('click', () => {
                chatInput.value = suggestion;
                sendMessage();
            });
            suggestionsDiv.appendChild(button);
        });
        
        chatMessages.appendChild(suggestionsDiv);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Get Bot Response
    function getBotResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Check for greetings
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
            return {
                text: "Hello! How can I help you with FoodShare today?",
                topic: 'greeting',
                suggestions: ["How do I donate food?", "How do I find food?", "Tell me about FoodShare"]
            };
        }
        
        // Check for donation-related queries
        if (lowerMessage.includes('donate') || lowerMessage.includes('donation')) {
            return {
                text: "To donate food, click on the 'Donate' button in the navigation bar. You'll need to provide details about the food type, quantity, and pickup location.",
                topic: 'donation',
                suggestions: ["What types of food can I donate?", "What are the safety guidelines?", "How is the food distributed?"]
            };
        }
        
        // Check for food type donation queries
        if (lowerMessage.includes('type') && lowerMessage.includes('donate')) {
            return {
                text: "You can donate various types of food including prepared meals, produce, bakery items, dairy products, and non-perishable items. All food must be properly packaged and within its expiration date.",
                topic: 'donation_types'
            };
        }
        
        // Check for food finding queries
        if (lowerMessage.includes('find') || lowerMessage.includes('search') || lowerMessage.includes('food')) {
            return {
                text: "You can find available food by clicking on 'Find Food' in the navigation bar. You can filter by food type and distance.",
                topic: 'finding_food',
                suggestions: ["How do I request food?", "What happens after I request food?", "How far will I need to travel?"]
            };
        
        // Check for food request process
        if (lowerMessage.includes('request') || lowerMessage.includes('pickup')) {
            return {
                text: "After finding food you want, click the 'Request Pickup' button. You'll receive confirmation and pickup instructions. A volunteer will coordinate with you for collection.",
                topic: 'request_process'
            };
        }
        
        // Check for registration queries
        if (lowerMessage.includes('register') || lowerMessage.includes('sign up') || lowerMessage.includes('account')) {
            return {
                text: "To create an account, click on the 'Register' button in the navigation bar. You'll need to provide your name, email, and create a password.",
                topic: 'registration',
                suggestions: ["What are the benefits of registering?", "Can I register as a volunteer?", "What information do I need to provide?"]
            };
        }
        
        // Check for login queries
        if (lowerMessage.includes('login') || lowerMessage.includes('sign in')) {
            return {
                text: "To log in, click on the 'Login' button in the navigation bar. You'll need your email and password.",
                topic: 'login'
            };
        }
        
        // Check for safety guidelines
        if (lowerMessage.includes('safety') || lowerMessage.includes('guidelines')) {
            return {
                text: "FoodShare follows strict food safety guidelines. All donations must be properly packaged, within expiration dates, and maintained at appropriate temperatures.",
                topic: 'safety',
                suggestions: ["What temperature should food be stored at?", "How should I package my donation?", "Who checks food safety?"]
            };
        }
        
        // Check for temperature storage queries
        if (lowerMessage.includes('temperature') || lowerMessage.includes('store')) {
            return {
                text: "Perishable items should be kept refrigerated (below 40°F/4°C) or frozen (below 0°F/-18°C). Non-perishable items can be stored at room temperature.",
                topic: 'storage'
            };
        }
        
        // Check for packaging queries
        if (lowerMessage.includes('package') || lowerMessage.includes('container')) {
            return {
                text: "Food should be in clean, sealed containers. Use appropriate packaging for the food type - airtight containers for dry goods, insulated containers for temperature-sensitive items.",
                topic: 'packaging'
            };
        }
        
        // Check for contact queries
        if (lowerMessage.includes('contact') || lowerMessage.includes('help') || lowerMessage.includes('support')) {
            return {
                text: "You can contact us at info@foodshare.org or call (555) 123-4567. Our support team is available 24/7.",
                topic: 'contact',
                suggestions: ["I need help with my account", "I want to report an issue", "How can I become a partner?"]
            };
        }
        
        // Check for about/mission queries
        if (lowerMessage.includes('about') || lowerMessage.includes('mission')) {
            return {
                text: "FoodShare connects surplus food with those in need to reduce waste and fight hunger. We work with restaurants, grocery stores, and individual donors.",
                topic: 'about',
                suggestions: ["How many people have you helped?", "Where do you operate?", "How can I get involved?"]
            };
        }
        
        // Check for volunteer queries
        if (lowerMessage.includes('volunteer') || lowerMessage.includes('help out')) {
            return {
                text: "We welcome volunteers! You can sign up by clicking on 'Register' and selecting 'Volunteer' as your user type.",
                topic: 'volunteer',
                suggestions: ["What do volunteers do?", "How much time do I need to commit?", "Do I need special training?"]
            };
        }
        
        // Check for impact queries
        if (lowerMessage.includes('impact') || lowerMessage.includes('help') || lowerMessage.includes('people')) {
            return {
                text: "FoodShare has helped over 50,000 people access nutritious food and prevented over 100,000 pounds of food from going to waste. Every donation makes a difference!",
                topic: 'impact'
            };
        }
        
        // Check for thank you messages
        if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
            return {
                text: "You're welcome! Is there anything else I can help you with?",
                topic: 'gratitude'
            };
        }
        
        // Check for goodbye messages
        if (lowerMessage.includes('bye') || lowerMessage.includes('goodbye')) {
            return {
                text: "Goodbye! Thank you for using FoodShare. Have a great day!",
                topic: 'farewell'
            };
        }
        
        // Default response for unrecognized queries
        return {
            text: "I'm not sure I understand. You can ask me about donating food, finding food, registering, logging in, safety guidelines, or contact information.",
            topic: 'unknown',
            suggestions: ["How do I donate food?", "How do I find food?", "Tell me about FoodShare"]
        };
    }

    // Event Listeners
    if (sendMessageBtn) {
        sendMessageBtn.addEventListener('click', sendMessage);
    }
    
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
});

// Dashboard Functionality
function initializeDashboard() {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        window.location.href = 'login.html';
        return;
    }

    // Get user data
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    
    // Update user name
    const userNameElement = document.getElementById('userName');
    if (userNameElement) {
        userNameElement.textContent = userData.firstName || 'User';
    }

    // Update last login
    const lastLoginElement = document.getElementById('lastLogin');
    if (lastLoginElement) {
        const lastLogin = localStorage.getItem('lastLogin');
        lastLoginElement.textContent = lastLogin ? new Date(lastLogin).toLocaleString() : 'Just now';
    }

    // Initialize dashboard stats
    initializeDashboardStats();

    // Initialize recent activity
    initializeRecentActivity();

    // Handle logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
}

function initializeDashboardStats() {
    // Get stats from localStorage or set defaults
    const stats = JSON.parse(localStorage.getItem('userStats') || JSON.stringify({
        donations: 0,
        received: 0,
        impactScore: 0,
        mealsProvided: 0,
        foodSaved: 0,
        peopleHelped: 0
    }));

    // Update stats display
    const elements = {
        donationCount: document.getElementById('donationCount'),
        receivedCount: document.getElementById('receivedCount'),
        impactScore: document.getElementById('impactScore'),
        mealsProvided: document.getElementById('mealsProvided'),
        foodSaved: document.getElementById('foodSaved'),
        peopleHelped: document.getElementById('peopleHelped')
    };

    for (const [key, element] of Object.entries(elements)) {
        if (element) {
            element.textContent = stats[key] || '0';
        }
    }
}

function initializeRecentActivity() {
    const activityList = document.getElementById('activityList');
    if (!activityList) return;

    // Get activities from localStorage or set defaults
    const activities = JSON.parse(localStorage.getItem('userActivities') || JSON.stringify([
        {
            type: 'donation',
            title: 'No recent activity',
            description: 'Start donating or receiving food to see your activity here',
            timestamp: new Date().toISOString()
        }
    ]));

    // Clear existing activities
    activityList.innerHTML = '';

    // Add activities to the list
    activities.forEach(activity => {
        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item';
        
        const icon = getActivityIcon(activity.type);
        const timeAgo = getTimeAgo(new Date(activity.timestamp));

        activityItem.innerHTML = `
            <div class="activity-icon">
                <i class="${icon}"></i>
            </div>
            <div class="activity-details">
                <h4>${activity.title}</h4>
                <p>${activity.description}</p>
                <small>${timeAgo}</small>
            </div>
        `;

        activityList.appendChild(activityItem);
    });
}

function getActivityIcon(type) {
    const icons = {
        donation: 'fas fa-hand-holding-heart',
        received: 'fas fa-utensils',
        profile: 'fas fa-user-edit',
        default: 'fas fa-info-circle'
    };
    return icons[type] || icons.default;
}

function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + ' years ago';
    
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + ' months ago';
    
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + ' days ago';
    
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + ' hours ago';
    
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + ' minutes ago';
    
    return Math.floor(seconds) + ' seconds ago';
}

function handleLogout() {
    // Clear user data
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userData');
    
    // Redirect to login page
    window.location.href = 'login.html';
}

// Initialize dashboard if on dashboard page
if (window.location.pathname.includes('dashboard.html')) {
    document.addEventListener('DOMContentLoaded', initializeDashboard);
} 