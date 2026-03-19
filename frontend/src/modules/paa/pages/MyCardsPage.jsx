import { useEffect, useState } from 'react';
import { cardIssuanceService } from '../../cias/services/cardIssuanceService';
import { CreditCard, Shield, Calendar, CheckCircle, XCircle, Ban } from 'lucide-react';

const STATUS_ICONS = {
  ISSUED: <CheckCircle className="text-green-500" size={20} />,
  ACTIVE: <CheckCircle className="text-green-500" size={20} />,
  BLOCKED: <Ban className="text-red-500" size={20} />,
  EXPIRED: <XCircle className="text-gray-500" size={20} />,
};

export default function MyCardsPage() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cardIssuanceService.getMyCards()
      .then(res => setCards(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="page-header mb-8">
        <div>
          <h1 className="page-title text-2xl font-bold">My Credit Cards</h1>
          <p className="text-gray-500">Manage and view status of your issued cards</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12"><div className="spinner" /></div>
      ) : cards.length === 0 ? (
        <div className="card text-center p-12">
          <CreditCard size={48} className="mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-600">No cards issued yet</h3>
          <p className="text-gray-400">Apply for a new card to see it here.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {cards.map(card => (
            <div key={card.cardId} className="card hover:shadow-md transition-shadow overflow-hidden">
              <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x">
                {/* Visual Card Representation */}
                <div className="p-6 bg-gradient-to-br from-gray-800 to-gray-900 text-white w-full md:w-80 flex flex-col justify-between aspect-[1.6/1] rounded-lg m-4 shadow-xl">
                  <div className="flex justify-between items-start">
                    <Shield size={24} className="text-gold" />
                    <div className="text-xs font-bold opacity-60 uppercase tracking-widest">{card.product?.productName || 'Credit Card'}</div>
                  </div>
                  <div className="text-xl font-mono tracking-widest my-4">
                    {card.maskedCardNumber || '**** **** **** ****'}
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-[10px] opacity-60 uppercase">Card Holder</div>
                      <div className="text-sm font-semibold truncate max-w-[120px] uppercase">
                        {card.customer?.name || 'Customer'}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] opacity-60 uppercase">Expires</div>
                      <div className="text-sm font-semibold">{card.expiryDate || '--/--'}</div>
                    </div>
                  </div>
                </div>

                {/* Card Details & Status */}
                <div className="p-6 flex-grow flex flex-col justify-center">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-500 text-sm">Status</span>
                    <div className="flex items-center gap-2">
                       {STATUS_ICONS[card.status] || <Shield size={20} className="text-gray-400"/>}
                       <span className="font-bold text-sm uppercase tracking-wider">{card.status}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="stat-item">
                      <div className="text-xs text-gray-400 uppercase">Card Type</div>
                      <div className="font-semibold text-sm">{card.product?.type || 'Standard'}</div>
                    </div>
                    <div className="stat-item">
                      <div className="text-xs text-gray-400 uppercase">Limit</div>
                      <div className="font-semibold text-sm">₹{card.application?.requestedLimit?.toLocaleString() || 'N/A'}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
