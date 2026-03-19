import { cardIssuanceService, accountSetupService } from '../services/cardIssuanceService';
import { CreditCard, ShieldOff, PlusCircle, Settings, CheckCircle } from 'lucide-react';

export default function CardIssuancePage() {
  const [card, setCard] = useState(null);
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [accountLoading, setAccountLoading] = useState(false);
  const { register, handleSubmit } = useForm();

  const onIssue = async (data) => {
    setLoading(true);
    try {
      const res = await cardIssuanceService.issueCard(data);
      setCard(res.data);
      setAccount(null); // Reset account if new card issued
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const onSetupAccount = async () => {
    if (!card) return;
    setAccountLoading(true);
    try {
      const res = await accountSetupService.createAccount({ cardId: card.cardId || card.id });
      setAccount(res.data);
    } catch (e) { console.error(e); }
    finally { setAccountLoading(false); }
  };
// ... rest of the file

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
        <h3 style={{ fontWeight:700, marginBottom:16 }}>Issue New Card</h3>
        <div><h1 className="page-title">Card Issuance & Account Setup</h1><p className="page-subtitle">Issue physical cards and initialize credit accounts</p></div>
      </div>

      <div className="card" style={{ marginBottom:24 }}>
        <h3 style={{ fontWeight:700, marginBottom:16 }}>1. Issue New Card</h3>
        <form onSubmit={handleSubmit(onIssue)} className="form-grid">
          <div className="form-group">
            <label className="required">Application ID</label>
            <input {...register('applicationId')} type="number" required placeholder="e.g. 1" />
          </div>
          <div className="form-group">
            <label className="required">Masked Card Number</label>
            <input {...register('maskedCardNumber')} type="text" required placeholder="XXXX-XXXX-XXXX-1234" />
          </div>
          <div className="form-group">
            <label className="required">Expiry Date</label>
            <input {...register('expiryDate')} type="date" required />
          </div>
          <div className="form-group">
            <label className="required">CVV / CVV Hash</label>
            <input {...register('cvvHash')} type="text" required placeholder="3-digit CVV or Hash" />
          </div>
          <div className="form-group">
            <label>Card Status</label>
            <select {...register('status')}>
              <option value="ISSUED">ISSUED</option>
              <option value="ACTIVE">ACTIVE</option>
            </select>
          </div>
          <div className="form-actions" style={{ marginTop:24 }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <PlusCircle size={16}/> {loading ? 'Issuing...' : 'Issue Card'}
            </button>
          </div>
        </form>
      </div>

      {card && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24 }}>
          <div className="card animate-fade-in shadow-sm">
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:16 }}>
              <h3 style={{ fontWeight:700 }}>Card Details</h3>
              <span className={`badge ${card.status==='ACTIVE'?'badge-success':'badge-info'}`}>{card.status}</span>
            </div>
            <div className="detail-grid">
              <div className="detail-item"><span className="detail-label">Card ID</span><span className="detail-value">#{card.cardId || card.id}</span></div>
              <div className="detail-item"><span className="detail-label">Number</span><span className="detail-value">{card.maskedCardNumber}</span></div>
              <div className="detail-item"><span className="detail-label">Expiry</span><span className="detail-value">{card.expiryDate}</span></div>
            </div>
            <div className="form-actions" style={{ marginTop:20 }}>
              {card.status !== 'BLOCKED' && (
                <button className="btn btn-danger btn-sm" onClick={onBlock}><ShieldOff size={14}/> Block Card</button>
              )}
            </div>
          </div>

          <div className="card animate-fade-in shadow-sm" style={{ borderTop:'4px solid var(--primary)' }}>
            <h3 style={{ fontWeight:700, marginBottom:16 }}>2. Account Setup</h3>
            {!account ? (
              <div style={{ textAlign:'center', padding:'20px 0' }}>
                <Settings size={32} style={{ color:'var(--text-muted)', marginBottom:12 }} className={accountLoading ? 'animate-spin' : ''}/>
                <p style={{ color:'var(--text-secondary)', fontSize:'.875rem', marginBottom:16 }}>Card issued successfully. Now initialize the credit account.</p>
                <button className="btn btn-primary" onClick={onSetupAccount} disabled={accountLoading}>
                  {accountLoading ? 'Initializing...' : 'Setup Credit Account'}
                </button>
              </div>
            ) : (
              <div>
                <div style={{ display:'flex', alignItems:'center', gap:8, color:'var(--success)', marginBottom:16 }}>
                  <CheckCircle size={20}/> <span style={{ fontWeight:700 }}>Account Active</span>
                </div>
                <div className="detail-grid">
                  <div className="detail-item"><span className="detail-label">Account ID</span><span className="detail-value">#{account.accountId || account.id}</span></div>
                  <div className="detail-item"><span className="detail-label">Credit Limit</span><span className="detail-value">₹{Number(account.creditLimit).toLocaleString()}</span></div>
                  <div className="detail-item"><span className="detail-label">Status</span><span className="badge badge-success">{account.status}</span></div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
