import React, { useState, useRef, useEffect } from 'react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CFormInput,
  CListGroup,
  CListGroupItem,
  CBadge,
  CSpinner
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import {
  cilEnvelopeClosed,
  cilBarChart,
  cilUser,
  cilPeople,
  cilFile
} from '@coreui/icons';

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Initial welcome message
  useEffect(() => {
    setMessages([
      {
        id: 1,
        text: "Hello! I'm your AI HR Assistant. I can help you with:",
        sender: 'bot',
        timestamp: new Date(),
        suggestions: [
          'Leave predictions',
          'Performance insights',
          'Salary trends',
          'Anomaly detection',
          'Workload optimization'
        ]
      }
    ]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputMessage);
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000); // Random delay for realistic feel
  };

  const generateAIResponse = (userInput) => {
    const input = userInput.toLowerCase();
    
    // Simple keyword-based responses
    if (input.includes('leave') || input.includes('vacation')) {
      return {
        id: Date.now(),
        text: "Based on current patterns, I predict higher leave usage in July and December. Consider implementing backup staffing plans for these periods.",
        sender: 'bot',
        timestamp: new Date(),
        suggestions: ['View leave predictions', 'Check leave balances', 'Review leave policies']
      };
    }
    
    if (input.includes('salary') || input.includes('pay')) {
      return {
        id: Date.now(),
        text: "Salary trends show a 5.2% average increase this year. High performers are seeing 8-12% increases. Would you like to see detailed salary analytics?",
        sender: 'bot',
        timestamp: new Date(),
        suggestions: ['View salary trends', 'Performance analysis', 'Market comparison']
      };
    }
    
    if (input.includes('performance') || input.includes('productivity')) {
      return {
        id: Date.now(),
        text: "I've identified 3 high-potential employees and 2 who may need performance support. Team productivity is trending upward by 12% this quarter.",
        sender: 'bot',
        timestamp: new Date(),
        suggestions: ['View performance data', 'High-potential list', 'Performance trends']
      };
    }
    
    if (input.includes('anomaly') || input.includes('issue') || input.includes('problem')) {
      return {
        id: Date.now(),
        text: "I've detected 2 attendance anomalies and 1 performance outlier this week. Risk level is currently MEDIUM. Would you like me to investigate further?",
        sender: 'bot',
        timestamp: new Date(),
        suggestions: ['View anomalies', 'Risk assessment', 'Investigation report']
      };
    }
    
    if (input.includes('workload') || input.includes('team') || input.includes('capacity')) {
      return {
        id: Date.now(),
        text: "Development team is at 95% capacity (high risk), while Design team is at 45% (underutilized). I recommend redistributing 3 projects for optimal balance.",
        sender: 'bot',
        timestamp: new Date(),
        suggestions: ['View workload analysis', 'Optimization plan', 'Team capacity report']
      };
    }
    
    if (input.includes('hello') || input.includes('hi') || input.includes('help')) {
      return {
        id: Date.now(),
        text: "Hello! I'm here to help with HR analytics and insights. You can ask me about leave patterns, salary trends, performance analysis, anomaly detection, or workload optimization.",
        sender: 'bot',
        timestamp: new Date(),
        suggestions: ['Leave predictions', 'Salary trends', 'Performance insights', 'Anomaly detection']
      };
    }

    // Default response
    return {
      id: Date.now(),
      text: "I understand you're asking about '" + userInput + "'. While I can provide insights on HR analytics, for specific operational questions, please consult your HR team. Would you like to explore any of our AI-powered analytics?",
      sender: 'bot',
      timestamp: new Date(),
      suggestions: ['Leave predictions', 'Salary trends', 'Performance insights', 'Workload analysis']
    };
  };

  const handleSuggestionClick = (suggestion) => {
    setInputMessage(suggestion);
    inputRef.current?.focus();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <CButton
        color="primary"
        className="position-fixed"
        style={{
          bottom: '20px',
          right: '20px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          zIndex: 1000,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}
        onClick={toggleChat}
      >
        <CIcon icon={isOpen ? cilFile : cilFile} size="lg" />
      </CButton>

      {/* Chat Window */}
      {isOpen && (
        <CCard
          className="position-fixed"
          style={{
            bottom: '90px',
            right: '20px',
            width: '350px',
            height: '500px',
            zIndex: 1000,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
          }}
        >
          <CCardHeader className="bg-primary text-white">
            <div className="d-flex align-items-center">
              <CIcon icon={cilBarChart} className="me-2" />
              <strong>AI HR Assistant</strong>
            </div>
          </CCardHeader>
          
          <CCardBody className="p-0 d-flex flex-column">
            {/* Messages Area */}
            <div 
              className="flex-grow-1 p-3"
              style={{ 
                height: '350px', 
                overflowY: 'auto',
                backgroundColor: '#f8f9fa'
              }}
            >
              <CListGroup flush>
                {messages.map((message) => (
                  <CListGroupItem key={message.id} className="border-0 p-2">
                    <div className={`d-flex ${message.sender === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
                      <div
                        className={`p-3 rounded ${
                          message.sender === 'user'
                            ? 'bg-primary text-white'
                            : 'bg-white border'
                        }`}
                        style={{ maxWidth: '80%' }}
                      >
                        <div className="d-flex align-items-center mb-2">
                                                     <CIcon 
                             icon={message.sender === 'user' ? cilUser : cilUser} 
                             size="sm" 
                             className="me-2"
                           />
                          <small className="text-muted">
                            {message.sender === 'user' ? 'You' : 'AI Assistant'}
                          </small>
                        </div>
                        
                        <p className="mb-2">{message.text}</p>
                        
                        {message.suggestions && (
                          <div className="mt-2">
                            {message.suggestions.map((suggestion, index) => (
                              <CButton
                                key={index}
                                color="outline-secondary"
                                size="sm"
                                className="me-1 mb-1"
                                onClick={() => handleSuggestionClick(suggestion)}
                              >
                                {suggestion}
                              </CButton>
                            ))}
                          </div>
                        )}
                        
                        <small className="text-muted">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </small>
                      </div>
                    </div>
                  </CListGroupItem>
                ))}
                
                {isTyping && (
                  <CListGroupItem className="border-0 p-2">
                    <div className="d-flex justify-content-start">
                      <div className="p-3 rounded bg-white border" style={{ maxWidth: '80%' }}>
                        <div className="d-flex align-items-center">
                                                     <CIcon icon={cilUser} size="sm" className="me-2" />
                          <span className="text-muted me-2">AI is typing</span>
                          <CSpinner size="sm" />
                        </div>
                      </div>
                    </div>
                  </CListGroupItem>
                )}
                
                <div ref={messagesEndRef} />
              </CListGroup>
            </div>
            
            {/* Input Area */}
            <div className="p-3 border-top">
              <div className="d-flex gap-2">
                <CFormInput
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me about HR analytics..."
                  className="flex-grow-1"
                />
                <CButton
                  color="primary"
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                >
                  <CIcon icon={cilEnvelopeClosed} />
                </CButton>
              </div>
            </div>
          </CCardBody>
        </CCard>
      )}
    </>
  );
};

export default AIChatbot;
