import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { cardIssuanceService } from '../services/cardIssuanceService';
import { CreditCard, ShieldOff, PlusCircle } from 'lucide-react';

export default function CardIssuancePage() {
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit } = useForm();

  const onIssue = async (data) => {
    setLoading(true);
    try {
      const res = await cardIssuanceService.issueCard(data);
      setCard(res.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const onBlock = async () => {
    if (!card) return;
    try {
      const res = await cardIssuanceService.blockCard(card.id);
      setCard(res.data);
    } catch (e) { console.error(e); }
  };

  return (
    <div>
      <div className="page-header">
        <div><h1 className="page-title">Card Issuance</h1><p className="page-subtitle">Issue and manage physical/virtual cards</p></div>
      </div>

      <div className="card" style={{ marginBottom:20 }}>
        <h3>Issue New Card</h3>
        <form onSubmit={handleSubmit(onIssue)} className="form-grid">
          <div className="form-group">
            <label>Application ID</label>
            <input {...register('applicationId')} type="number" required />
          </div>
          <div className="form-group">
            <label>Card Type</label>
            <select {...register('cardType')}>
              <option value="PLATINUM">PLATINUM</option>
              <option value="GOLD">GOLD</option>
            </select>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <PlusCircle size={16}/> {loading ? 'Issuing...' : 'Issue Card'}
            </button>
          </div>
        </form>
      </div>

      {card && (
        <div className="card">
          <h3>Card Details</h3>
          <div className="detail-grid" style={{ marginTop:20 }}>
            <div className="detail-item"><span className="detail-label">Card Number</span><span className="detail-value">{card.cardNumber}</span></div>
            <div className="detail-item"><span className="detail-label">Expiry</span><span className="detail-value">{card.expiryDate}</span></div>
            <div className="detail-item"><span className="detail-label">Status</span><span className={`badge ${card.status==='ACTIVE'?'badge-success':'badge-danger'}`}>{card.status}</span></div>
          </div>
          <div className="form-actions">
            {card.status === 'ACTIVE' && (
              <button className="btn btn-danger" onClick={onBlock}><ShieldOff size={16}/> Block Card</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
