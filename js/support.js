// Support System JavaScript

// Ticket System
class TicketSystem {
    constructor() {
        this.tickets = JSON.parse(localStorage.getItem('supportTickets')) || [];
    }

    createTicket(data) {
        const ticket = {
            id: Date.now().toString(),
            status: 'open',
            createdAt: new Date().toISOString(),
            ...data
        };
        
        this.tickets.push(ticket);
        this.saveTickets();
        return ticket;
    }

    getTicket(id) {
        return this.tickets.find(ticket => ticket.id === id);
    }

    updateTicket(id, updates) {
        const ticket = this.getTicket(id);
        if (ticket) {
            Object.assign(ticket, updates);
            this.saveTickets();
        }
        return ticket;
    }

    saveTickets() {
        localStorage.setItem('supportTickets', JSON.stringify(this.tickets));
    }
}

// Live Chat System
class LiveChat {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.chatWindow = null;
    }

    initialize() {
        this.createChatWindow();
        this.bindEvents();
    }

    createChatWindow() {
        const chatHTML = `
            <div id="chat-window" class="chat-window" style="display: none;">
                <div class="chat-header">
                    <h3>Live Chat Support</h3>
                    <button class="close-chat" onclick="supportChat.close()">×</button>
                </div>
                <div class="chat-messages"></div>
                <div class="chat-input">
                    <input type="text" placeholder="How can we help you today?" id="chat-message-input">
                    <button onclick="supportChat.sendMessage()">Send</button>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', chatHTML);
        this.chatWindow = document.getElementById('chat-window');
    }

    bindEvents() {
        const input = document.getElementById('chat-message-input');
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });
    }

    open() {
        this.isOpen = true;
        this.chatWindow.style.display = 'block';
        this.addSystemMessage('Welcome to RescuePC Repairs Support! How can we help you today?');
    }

    close() {
        this.isOpen = false;
        this.chatWindow.style.display = 'none';
    }

    sendMessage() {
        const input = document.getElementById('chat-message-input');
        const message = input.value.trim();
        
        if (message) {
            this.addMessage(message, 'user');
            input.value = '';
            
            // Simulate support response
            setTimeout(() => {
                this.addSystemMessage('Thank you for your message. A support agent will be with you shortly.');
            }, 1000);
        }
    }

    addMessage(text, sender) {
        const messagesContainer = this.chatWindow.querySelector('.chat-messages');
        const messageElement = document.createElement('div');
        messageElement.className = `chat-message ${sender}-message`;
        messageElement.textContent = text;
        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    addSystemMessage(text) {
        this.addMessage(text, 'system');
    }
}

// Initialize support systems
const ticketSystem = new TicketSystem();
const supportChat = new LiveChat();

// Add styles for chat window
const chatStyles = `
    .chat-window {
        position: fixed;
        bottom: 100px;
        right: 30px;
        width: 350px;
        height: 500px;
        background: white;
        border-radius: 10px;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
        display: flex;
        flex-direction: column;
        z-index: 1000;
    }

    .chat-header {
        padding: 15px;
        background: #2563eb;
        color: white;
        border-radius: 10px 10px 0 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .chat-header h3 {
        margin: 0;
        font-size: 1.1rem;
    }

    .close-chat {
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0 5px;
    }

    .chat-messages {
        flex: 1;
        padding: 15px;
        overflow-y: auto;
    }

    .chat-message {
        margin-bottom: 10px;
        padding: 10px;
        border-radius: 8px;
        max-width: 80%;
    }

    .user-message {
        background: #e3f2fd;
        margin-left: auto;
    }

    .system-message {
        background: #f1f5f9;
        margin-right: auto;
    }

    .chat-input {
        padding: 15px;
        border-top: 1px solid #e2e8f0;
        display: flex;
        gap: 10px;
    }

    .chat-input input {
        flex: 1;
        padding: 8px 12px;
        border: 1px solid #e2e8f0;
        border-radius: 6px;
        outline: none;
    }

    .chat-input button {
        padding: 8px 15px;
        background: #2563eb;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
    }

    .chat-input button:hover {
        background: #1d4ed8;
    }

    @media (max-width: 768px) {
        .chat-window {
            width: 100%;
            height: 100%;
            bottom: 0;
            right: 0;
            border-radius: 0;
        }
    }
`;

// Add styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = chatStyles;
document.head.appendChild(styleSheet);

// Initialize chat when document is ready
document.addEventListener('DOMContentLoaded', () => {
    supportChat.initialize();
});

// Export functions for use in HTML
window.openTicketForm = () => {
    const ticketData = {
        subject: prompt('What is your issue about?'),
        description: prompt('Please describe your issue in detail:'),
        email: prompt('Please enter your email address:')
    };

    if (ticketData.subject && ticketData.description && ticketData.email) {
        const ticket = ticketSystem.createTicket(ticketData);
        alert(`Ticket created successfully! Your ticket ID is: ${ticket.id}`);
    }
};

window.openLiveChat = () => {
    supportChat.open();
}; 