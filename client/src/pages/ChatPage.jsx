import { useParams } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { formatValue } from '../utils/valueCalculator';
import { getImageUrl } from '../utils/imageUtils';

const ChatPage = () => {
  const { swapId } = useParams();
  const { user: currentUser } = useAuth();
  const socketRef = useSocket();

  const [swap, setSwap] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  // Load swap and messages details
  useEffect(() => {
    const fetchChatData = async () => {
      setLoading(true);
      try {
        const swapRes = await api.get(`/swaps/${swapId}`);
        setSwap(swapRes.data.data);

        const msgRes = await api.get(`/chat/${swapId}`);
        setMessages(msgRes.data.data);
      } catch (err) {
        toast.error('Failed to load chat workspace.');
      } finally {
        setLoading(false);
      }
    };
    fetchChatData();
  }, [swapId]);

  // Socket setup
  useEffect(() => {
    if (socketRef.current && swap) {
      const socket = socketRef.current;
      socket.emit('joinRoom', swapId);

      socket.on('receiveMessage', (message) => {
        setMessages(prev => [...prev, message]);
      });

      socket.on('swapStatusUpdate', ({ status, confirmedBy }) => {
        setSwap(prev => ({ ...prev, status, confirmedBy }));
        if (status === 'Completed') {
          toast.success('Swap Exchange Completed!');
        }
      });

      return () => {
        socket.off('receiveMessage');
        socket.off('swapStatusUpdate');
      };
    }
  }, [socketRef, swap, swapId]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    if (socketRef.current) {
      socketRef.current.emit('sendMessage', {
        swapId,
        senderId: currentUser._id,
        content: inputText.trim(),
      });
      setInputText('');
    }
  };

  const handleConfirmSwap = () => {
    if (socketRef.current) {
      socketRef.current.emit('confirmSwap', {
        swapId,
        userId: currentUser._id,
      });
      toast.success('Swap exchange confirmation sent.');
    }
  };

  if (loading) {
    return (
      <div className="h-[75vh] flex justify-center items-center bg-ivory">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-champagne border-t-transparent"></div>
      </div>
    );
  }

  if (!swap) {
    return (
      <div className="section-pad text-center py-20 bg-ivory text-onyx">
        <h2 className="font-serif text-2xl">Negotiation Room Invalid</h2>
      </div>
    );
  }

  const hasConfirmed = swap.confirmedBy?.includes(currentUser._id);
  const isCompleted = swap.status === 'Completed';

  // Item images
  const offeredImg = getImageUrl(swap.offeredItem?.images?.[0]);
  const requestedImg = getImageUrl(swap.requestedItem?.images?.[0]);

  return (
    <div className="h-[85vh] flex flex-col md:flex-row bg-ivory border-t border-hairline">
      {/* Side details panel */}
      <div className="w-full md:w-80 bg-white border-b md:border-b-0 md:border-r border-hairline p-6 flex flex-col justify-between overflow-y-auto">
        <div className="space-y-6">
          <span className="font-sans text-[10px] tracking-widest uppercase text-champagne font-semibold block">Barter Details</span>

          {/* Swap Items comparative */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3 border-b border-hairline/50 pb-3">
              <img src={offeredImg} className="w-12 h-16 object-cover border border-hairline" alt="offered" />
              <div>
                <span className="text-[8px] font-sans tracking-widest text-warmgrey uppercase block">Offered</span>
                <p className="font-serif text-sm font-medium text-onyx line-clamp-1">{swap.offeredItem?.title}</p>
                <p className="text-xs text-champagne-dark font-medium">{formatValue(swap.offeredItem?.estimatedValue)}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 pb-3">
              <img src={requestedImg} className="w-12 h-16 object-cover border border-hairline" alt="requested" />
              <div>
                <span className="text-[8px] font-sans tracking-widest text-warmgrey uppercase block">Requested</span>
                <p className="font-serif text-sm font-medium text-onyx line-clamp-1">{swap.requestedItem?.title}</p>
                <p className="text-xs text-champagne-dark font-medium">{formatValue(swap.requestedItem?.estimatedValue)}</p>
              </div>
            </div>
          </div>

          <div className="bg-ivory p-3 border border-hairline border-dashed text-center">
            <span className="text-[9px] uppercase tracking-wider text-warmgrey block">Value Discrepancy</span>
            <span className="font-serif text-lg font-bold text-onyx">{swap.valueDifference}%</span>
            {swap.valueDifference > 30 && (
              <p className="text-[8px] font-sans text-burgundy uppercase font-semibold mt-1">Warning: Discrepancy &gt; 30%</p>
            )}
          </div>
        </div>

        {/* Confirmation Actions */}
        <div className="pt-6 border-t border-hairline">
          {isCompleted ? (
            <div className="bg-emerald text-ivory text-center py-3 text-xs tracking-wider uppercase font-semibold">
              Swap Exchange Completed
            </div>
          ) : (
            <button
              onClick={handleConfirmSwap}
              disabled={hasConfirmed}
              className={`w-full py-3 text-xs tracking-widest uppercase font-semibold border ${hasConfirmed ? 'bg-hairline text-warmgrey border-hairline cursor-not-allowed' : 'btn-gold'}`}
            >
              {hasConfirmed ? 'Waiting for counterpart' : 'Confirm Swap Exchange'}
            </button>
          )}
        </div>
      </div>

      {/* Chat Thread Panel */}
      <div className="flex-1 flex flex-col justify-between bg-ivory">
        {/* Messages */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map((msg) => {
            const isMe = msg.sender?._id === currentUser._id;
            return (
              <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] p-4 border rounded ${isMe ? 'bg-onyx text-ivory border-onyx' : 'bg-white text-onyx border-hairline'}`}>
                  <p className="text-xs font-sans font-semibold mb-1 uppercase tracking-wider text-champagne-light">
                    {msg.sender?.name}
                  </p>
                  <p className="text-sm font-sans leading-relaxed">{msg.content}</p>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Form Input */}
        <form onSubmit={handleSendMessage} className="border-t border-hairline bg-white p-4 flex items-center space-x-3">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Write message to negotiate exchange coordinates..."
            className="flex-1 bg-transparent border-0 focus:outline-none focus:ring-0 font-sans text-sm py-2 px-3 placeholder-warmgrey/50"
            disabled={isCompleted}
          />
          <button
            type="submit"
            className="btn-primary py-2 px-6"
            disabled={isCompleted}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPage;
