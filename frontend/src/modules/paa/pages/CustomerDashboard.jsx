import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { applicationService } from '../services/applicationService';
import { customerService } from '../services/customerService';
import { accountSetupService } from '../../cias/services/cardIssuanceService';
import { transactionService } from '../../tap/services/transactionService';
import { useAuth } from '../../../context/AuthContext';
import { 
  FileText, Clock, CheckCircle, XCircle, FilePlus, 
  CreditCard, Wallet, History, User, Mail, Phone, MapPin, 
  Calendar, IndianRupee, TrendingUp 
} from 'lucide-react';

const STATUS_BADGE = {
  PENDING: 'badge-warning', 
  APPROVED: 'badge-success', 
  REJECTED: 'badge-danger', 
  UNDER_REVIEW: 'badge-info',
};

export default function CustomerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [apps, setApps] = useState([]);
  const [account, setAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [appsRes, accRes, trxRes, profRes] = await Promise.all([
          applicationService.getAll(),
          accountSetupService.getMyAccount().catch(() => ({ data: null })),
          transactionService.listMy().catch(() => ({ data: [] })),
          customerService.getMyProfile().catch(() => ({ data: null }))
        ]);

        setApps(appsRes.data?.data || []);
        setAccount(accRes.data);
        setTransactions(trxRes.data || []);
        const prof = profRes.data?.data || null;
        setProfile(prof);
        if (prof) setEditData({
          name: prof.name,
          dob: prof.dob,
          income: prof.income,
          employmentType: prof.employmentType,
          contactInfo: prof.contactInfo
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const res = await customerService.updateMyProfile(editData);
      setProfile(res.data?.data);
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update profile", err);
      alert("Failed to update profile. Please check your inputs.");
    } finally {
      setSaving(false);
    }
  };

  const stats = {
    total:    apps?.length || 0,
    pending:  apps?.filter(a => a.status === 'PENDING').length || 0,
    approved: apps?.filter(a => a.status === 'APPROVED').length || 0,
    rejected: apps?.filter(a => a.status === 'REJECTED').length || 0,
  };

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Financial Hub</h1>
          <p className="page-subtitle">Welcome back, {profile?.name || user?.sub || 'Customer'}</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/applications/new')}>
          <FilePlus size={18}/> Apply for New Card
        </button>
      </div>

      {/* Profile & Account Summary Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Profile Card */}
        <div className="card lg:col-span-1">
          <div className="section-header flex justify-between items-center">
            <div className="flex items-center">
              <User size={20} className="text-blue-600 mr-2" />
              <span className="font-bold">Personal Information</span>
            </div>
            {!isEditing ? (
              <button 
                onClick={() => setIsEditing(true)}
                className="p-1 hover:bg-gray-100 rounded-full text-blue-600"
                title="Edit Profile"
              >
                <Settings size={16} />
              </button>
            ) : (
              <div className="flex gap-2">
                <button 
                  onClick={() => setIsEditing(false)}
                  className="text-xs font-semibold text-gray-400 hover:text-gray-600"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveProfile}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800"
                  disabled={saving}
                >
                  {saving ? '...' : 'Save'}
                </button>
              </div>
            )}
          </div>
          
          {loading ? <div className="spinner-sm" /> : (
            isEditing ? (
              <div className="space-y-3 pt-2">
                <div>
                  <label className="text-[10px] uppercase text-gray-400 font-bold">Full Name</label>
                  <input 
                    type="text" 
                    className="input-sm w-full" 
                    value={editData.name || ''} 
                    onChange={e => setEditData({...editData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase text-gray-400 font-bold">Date of Birth</label>
                  <input 
                    type="date" 
                    className="input-sm w-full" 
                    value={editData.dob || ''} 
                    onChange={e => setEditData({...editData, dob: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase text-gray-400 font-bold">Annual Income (₹)</label>
                  <input 
                    type="number" 
                    className="input-sm w-full" 
                    value={editData.income || ''} 
                    onChange={e => setEditData({...editData, income: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase text-gray-400 font-bold">Employment Type</label>
                  <select 
                    className="input-sm w-full"
                    value={editData.employmentType || ''}
                    onChange={e => setEditData({...editData, employmentType: e.target.value})}
                  >
                    <option value="SALARIED">Salaried</option>
                    <option value="SELF_EMPLOYED">Self Employed</option>
                    <option value="BUSINESS">Business</option>
                    <option value="STUDENT">Student</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>
            ) : (
              <div className="space-y-4 pt-2">
                <div className="flex items-center text-sm text-gray-600">
                  <User size={16} className="mr-3" /> {profile?.name || 'N/A'}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar size={16} className="mr-3" /> {profile?.dob || 'N/A'}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Mail size={16} className="mr-3" /> {profile?.contactInfo?.email || 'N/A'}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Phone size={16} className="mr-3" /> {profile?.contactInfo?.phone || 'N/A'}
                </div>
                <div className="flex items-center text-sm text-gray-600 border-t pt-3">
                  <TrendingUp size={16} className="mr-3" /> Income: ₹{profile?.income?.toLocaleString() || '0'}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle size={16} className="mr-3 text-green-500" /> Status: {profile?.status || 'ACTIVE'}
                </div>
              </div>
            )
          )}
        </div>

        {/* Account Metrics Card */}
        <div className="card lg:col-span-2">
          <div className="section-header">
            <CreditCard size={20} className="text-green-600 mr-2" />
            <span className="font-bold">Credit Account Overview</span>
          </div>
          {loading ? <div className="spinner-sm" /> : (
            account ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="stat-box p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">Total Limit</div>
                  <div className="text-2xl font-bold flex items-center">
                    <IndianRupee size={20} /> {account.creditLimit?.toLocaleString() || '0'}
                  </div>
                </div>
                <div className="stat-box p-4 bg-green-50 rounded-lg border border-green-100">
                  <div className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-1">Current Balance</div>
                  <div className="text-2xl font-bold flex items-center">
                    <IndianRupee size={20} /> {account.utilizedLimit?.toLocaleString() || '0'}
                  </div>
                </div>
                <div className="stat-box p-4 bg-red-50 rounded-lg border border-red-100">
                  <div className="text-xs font-semibold text-red-600 uppercase tracking-wider mb-1">Outstanding Due</div>
                  <div className="text-2xl font-bold flex items-center text-red-600">
                    <IndianRupee size={20} /> {(account.utilizedLimit || 0).toLocaleString()}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-gray-500 italic">
                <Wallet size={32} className="mb-2 opacity-20" />
                No active card account found.
              </div>
            )
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Recent Applications */}
        <div className="xl:col-span-2">
          <div className="card h-full">
            <div className="section-header flex justify-between">
              <div className="flex items-center">
                <FileText size={20} className="text-orange-600 mr-2" />
                <span className="font-bold">Recent Applications</span>
              </div>
            </div>
            {loading ? <div className="spinner" /> : (
              apps.length === 0 ? (
                <div className="empty-state p-10 text-center">
                  <FileText size={48} className="mx-auto mb-4 text-gray-300" />
                  <h3 className="font-semibold text-gray-500">No applications found</h3>
                </div>
              ) : (
                <div className="table-wrapper mt-4">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b text-gray-500 text-sm">
                        <th className="pb-3">App ID</th>
                        <th className="pb-3">Card Type</th>
                        <th className="pb-3">Limit Request</th>
                        <th className="pb-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {apps.slice(0, 5).map(a => (
                        <tr key={a.applicationId} className="hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/applications/${a.applicationId}`)}>
                          <td className="py-4 text-sm font-medium">#{a.applicationId}</td>
                          <td className="py-4 text-sm">{a.cardType || 'Credit Card'}</td>
                          <td className="py-4 text-sm font-semibold">₹{Number(a.requestedLimit).toLocaleString()}</td>
                          <td className="py-4"><span className={`badge ${STATUS_BADGE[a.status]}`}>{a.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            )}
          </div>
        </div>

        {/* Transaction History */}
        <div className="xl:col-span-1">
          <div className="card h-full">
            <div className="section-header">
              <History size={20} className="text-purple-600 mr-2" />
              <span className="font-bold">Transaction Statement</span>
            </div>
            <div className="mt-4 space-y-4">
              {loading ? <div className="spinner-sm" /> : (
                transactions.length === 0 ? (
                  <p className="text-center text-gray-400 py-10 italic">No transactions found</p>
                ) : (
                  transactions.slice(0, 8).map(tx => (
                    <div key={tx.transactionId} className="flex justify-between items-center p-3 border-b border-gray-50 hover:bg-gray-50 rounded">
                      <div>
                        <div className="text-sm font-bold truncate max-w-[150px]">{tx.merchant || 'Merchant'}</div>
                        <div className="text-xs text-gray-400">{tx.transactionDate || 'Recently'}</div>
                      </div>
                      <div className={`text-sm font-bold ${tx.type === 'DEBIT' ? 'text-red-500' : 'text-green-500'}`}>
                        {tx.type === 'DEBIT' ? '-' : '+'}₹{tx.amount?.toLocaleString()}
                      </div>
                    </div>
                  ))
                )
              )}
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        .dashboard-container { padding: 2rem; max-width: 1400px; margin: 0 auto; }
        .grid { display: grid; }
        .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
        .gap-6 { gap: 1.5rem; }
        .gap-8 { gap: 2rem; }
        .mb-8 { margin-bottom: 2rem; }
        .section-header { display: flex; align-items: center; border-bottom: 1px solid #f3f4f6; padding-bottom: 0.75rem; margin-bottom: 1rem; }
        
        @media (min-width: 1024px) {
          .lg\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
          .lg\\:col-span-1 { grid-column: span 1 / span 1; }
          .lg\\:col-span-2 { grid-column: span 2 / span 2; }
        }
        
        @media (min-width: 1280px) {
          .xl\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
          .xl\\:col-span-2 { grid-column: span 2 / span 2; }
          .xl\\:col-span-1 { grid-column: span 1 / span 1; }
        }
        
        .space-y-4 > * + * { margin-top: 1rem; }
        .pt-2 { padding-top: 0.5rem; }
        .text-gray-600 { color: #4b5563; }
        .text-sm { font-size: 0.875rem; }
        .mr-3 { margin-right: 0.75rem; }
        .border-t { border-top: 1px solid #f3f4f6; }
        .pt-3 { padding-top: 0.75rem; }
        .bg-blue-50 { background-color: #eff6ff; }
        .bg-green-50 { background-color: #f0fdf4; }
        .bg-red-50 { background-color: #fef2f2; }
        .text-blue-600 { color: #2563eb; }
        .text-green-600 { color: #16a34a; }
        .text-red-600 { color: #dc2626; }
        .truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .max-w-\\[150px\\] { max-width: 150px; }
      `}</style>
    </div>
  );
}
