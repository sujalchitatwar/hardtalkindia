import { useState, useEffect } from 'react';
import { Heart, Shield, QrCode, CreditCard, CheckCircle2, Copy, ExternalLink, Sparkles } from 'lucide-react';
import Layout, { useToastContext } from '@/components/layout/Layout';
import { createDonation, getSiteSettings } from '@/lib/dataService';

const amounts = [100, 250, 500, 1000, 2500, 5000];

export default function Donate() {
  const { addToast } = useToastContext();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(500);
  const [customAmount, setCustomAmount] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [transactionId, setTransactionId] = useState('');
  
  const [upiId, setUpiId] = useState('hardtalkindia@upi');
  const [processing, setProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [copied, setCopied] = useState(false);

  // Fetch dynamic UPI ID from settings on load
  useEffect(() => {
    async function fetchSettings() {
      try {
        const settings = await getSiteSettings();
        if (settings?.donation_upi_id) {
          setUpiId(settings.donation_upi_id);
        }
      } catch (err) {
        console.error('Failed to load donation settings, using fallback.', err);
      }
    }
    fetchSettings();
  }, []);

  const finalAmount = selectedAmount || Number(customAmount) || 0;

  // Build standard UPI URL
  // pa = Payee Address (UPI ID)
  // pn = Payee Name
  // am = Amount
  // cu = Currency (INR)
  // tn = Transaction Note
  const upiUri = `upi://pay?pa=${upiId}&pn=HardTalk%20India&am=${finalAmount}&cu=INR&tn=Donation%20to%20HardTalk%20India`;
  
  // Use QR Server API to generate a beautiful, dynamic QR code image online
  const qrCodeUrl = finalAmount >= 10 
    ? `https://api.qrserver.com/v1/create-qr-code/?size=250x250&color=0f172a&bgcolor=ffffff&qzone=2&data=${encodeURIComponent(upiUri)}`
    : null;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    addToast('UPI ID copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmitDonation = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (finalAmount < 10) {
      addToast('Minimum donation amount is ₹10', 'error');
      return;
    }

    if (!transactionId.trim()) {
      addToast('Please enter the 12-digit UTR / UPI Transaction Ref No', 'error');
      return;
    }

    if (!/^\d{12}$/.test(transactionId.trim())) {
      addToast('UPI UTR / Transaction ID must be exactly a 12-digit number', 'error');
      return;
    }

    setProcessing(true);
    try {
      await createDonation({
        donor_name: name.trim() || 'Anonymous Supporter',
        donor_email: email.trim() || undefined,
        amount: finalAmount,
        message: message.trim() || undefined,
        payment_id: transactionId.trim(),
        payment_status: 'pending', // Will be verified manually by admin
      });

      addToast('Donation logged successfully! Awaiting admin verification.', 'success');
      setCompleted(true);
      
      // Reset form fields
      setName('');
      setEmail('');
      setMessage('');
      setTransactionId('');
      setCustomAmount('');
      setSelectedAmount(500);
    } catch (err: any) {
      addToast(err.message || 'Failed to submit details. Please try again.', 'error');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Layout>
      <section className="pt-28 pb-16 min-h-screen bg-hti-bg text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Top Mission Section */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-hti-primary/10 border border-hti-primary/30 text-hti-primary text-xs font-semibold mb-4 animate-pulse">
              <Sparkles className="w-3.5 h-3.5" /> Support Free Press
            </div>
            <Heart className="w-12 h-12 text-hti-breaking mx-auto mb-4 animate-bounce" />
            <h1 className="text-3xl sm:text-4xl font-extrabold mb-3 tracking-tight">
              Support Our Mission
            </h1>
            <p className="text-hti-gray max-w-lg mx-auto text-sm sm:text-base leading-relaxed">
              HardTalkIndia is 100% reader-funded. Your donation keeps our journalism fiercely independent, unfiltered, and honest.
            </p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { value: '100%', label: 'Independent', border: 'border-hti-primary/20' },
              { value: '₹0', label: 'Corporate Influence', border: 'border-hti-green/20' },
              { value: '2M+', label: 'Readers Monthly', border: 'border-blue-500/20' },
            ].map((s) => (
              <div key={s.label} className={`card-glass rounded-xl p-4 text-center border ${s.border}`}>
                <div className="text-lg sm:text-2xl font-black bg-gradient-to-r from-hti-primary to-hti-orange bg-clip-text text-transparent">
                  {s.value}
                </div>
                <div className="text-[10px] sm:text-xs text-hti-gray font-medium mt-1 uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>

          {completed ? (
            /* Thank You Screen */
            <div className="card-glass rounded-2xl p-8 text-center border border-hti-green/30 max-w-xl mx-auto animate-fade-in">
              <CheckCircle2 className="w-16 h-16 text-hti-green mx-auto mb-6" />
              <h2 className="text-2xl font-bold mb-3">Thank You for Your Support!</h2>
              <p className="text-hti-gray text-sm leading-relaxed mb-6">
                Your transaction details have been submitted. Once verified by our team, your donation will be activated. 
                Your contribution directly keeps independent journalism alive in India.
              </p>
              <div className="bg-hti-bg/50 border border-hti-border rounded-xl p-4 mb-6 inline-block text-left w-full">
                <h3 className="text-xs font-semibold text-hti-gray uppercase tracking-wider mb-2">Submission Details</h3>
                <div className="space-y-1 text-sm">
                  <div><span className="text-hti-gray">Awaiting Amount:</span> <span className="font-bold text-white">₹{finalAmount}</span></div>
                  <div><span className="text-hti-gray">Payment Status:</span> <span className="text-amber-400 font-semibold">Under Verification</span></div>
                </div>
              </div>
              <button
                onClick={() => setCompleted(false)}
                className="btn-primary py-3 px-6 font-semibold"
              >
                Make Another Contribution
              </button>
            </div>
          ) : (
            /* Donation Form & Details Layout */
            <div className="grid md:grid-cols-12 gap-8">
              
              {/* Left Column: Form Setup (7/12) */}
              <div className="md:col-span-7 space-y-6">
                <div className="card-glass rounded-2xl p-6 border border-hti-border/60">
                  <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-hti-primary text-white text-xs flex items-center justify-center font-bold">1</span>
                    Choose Donation Amount
                  </h2>

                  {/* Quick Select Buttons */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {amounts.map((amt) => (
                      <button
                        key={amt}
                        onClick={() => { setSelectedAmount(amt); setCustomAmount(''); }}
                        className={`py-3 rounded-xl text-sm font-bold transition-all transform active:scale-95 ${
                          selectedAmount === amt
                            ? 'bg-hti-primary text-white shadow-lg shadow-hti-primary/30 border border-hti-primary'
                            : 'bg-hti-bg border border-hti-border text-hti-gray hover:text-white hover:border-hti-primary/50'
                        }`}
                      >
                        ₹{amt}
                      </button>
                    ))}
                  </div>

                  {/* Custom Amount Input */}
                  <div>
                    <label className="block text-xs text-hti-gray mb-1.5 font-semibold uppercase tracking-wider">Or Enter Custom Amount</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-semibold text-hti-gray">₹</span>
                      <input
                        type="number"
                        value={customAmount}
                        onChange={(e) => { setCustomAmount(e.target.value); setSelectedAmount(null); }}
                        placeholder="Min ₹10"
                        min={10}
                        className="w-full pl-8 pr-4 py-3 rounded-xl bg-hti-bg border border-hti-border text-white text-sm font-semibold placeholder:text-hti-gray/30 focus:outline-none focus:border-hti-primary transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div className="card-glass rounded-2xl p-6 border border-hti-border/60">
                  <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-hti-primary text-white text-xs flex items-center justify-center font-bold">2</span>
                    Donor Information
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs text-hti-gray mb-1.5 font-semibold uppercase tracking-wider">Your Name (Optional)</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Anonymous Supporter"
                        className="w-full px-4 py-3 rounded-xl bg-hti-bg border border-hti-border text-white text-sm placeholder:text-hti-gray/30 focus:outline-none focus:border-hti-primary transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-hti-gray mb-1.5 font-semibold uppercase tracking-wider">Email Address (Optional)</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="receipt@example.com"
                        className="w-full px-4 py-3 rounded-xl bg-hti-bg border border-hti-border text-white text-sm placeholder:text-hti-gray/30 focus:outline-none focus:border-hti-primary transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-hti-gray mb-1.5 font-semibold uppercase tracking-wider">Message for the Team (Optional)</label>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Send an encouraging word to our journalists..."
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl bg-hti-bg border border-hti-border text-white text-sm placeholder:text-hti-gray/30 focus:outline-none focus:border-hti-primary transition-colors resize-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Payment & QR code (5/12) */}
              <div className="md:col-span-5 space-y-6">
                
                {/* UPI QR Payment Card */}
                <div className="card-glass rounded-2xl p-6 border border-hti-primary/30 bg-gradient-to-b from-hti-card to-hti-bg relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-hti-primary/10 rounded-full blur-2xl" />
                  
                  <h2 className="text-lg font-bold mb-4 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <QrCode className="w-5 h-5 text-hti-primary" />
                      UPI QR Code
                    </span>
                    <span className="text-xs bg-hti-primary/20 text-hti-primary px-2 py-0.5 rounded-full font-semibold uppercase">
                      Primary
                    </span>
                  </h2>

                  {finalAmount >= 10 ? (
                    <div className="space-y-4 text-center">
                      
                      {/* QR Display Container */}
                      <div className="bg-white p-4 rounded-xl inline-block shadow-xl border border-hti-border/20 transform hover:scale-105 transition-transform duration-300">
                        {qrCodeUrl ? (
                          <img 
                            src={qrCodeUrl} 
                            alt={`UPI QR Code for ₹${finalAmount}`}
                            className="w-44 h-44 sm:w-48 sm:h-48 mx-auto"
                            onError={(e) => {
                              console.error('QR code generation failed');
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-44 h-44 flex items-center justify-center text-slate-800 text-xs">Generating QR...</div>
                        )}
                      </div>

                      {/* Display Amount and UPI Details */}
                      <div>
                        <div className="text-xl font-extrabold text-white">₹{finalAmount}</div>
                        <div className="text-[11px] text-hti-gray mt-1">Scan QR with any UPI App (GPay, PhonePe, Paytm, BHIM)</div>
                      </div>

                      {/* Direct UPI App link for mobile users */}
                      <div className="pt-2 block md:hidden">
                        <a 
                          href={upiUri}
                          className="w-full btn-primary py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform"
                        >
                          Pay via UPI App <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>

                      {/* Manual UPI ID Copy Option */}
                      <div className="bg-hti-bg/60 border border-hti-border rounded-xl p-2.5 flex items-center justify-between gap-2 max-w-xs mx-auto">
                        <div className="text-left min-w-0 flex-1">
                          <p className="text-[10px] text-hti-gray font-semibold uppercase tracking-wider">Payee UPI ID</p>
                          <p className="text-xs font-bold text-white truncate">{upiId}</p>
                        </div>
                        <button
                          type="button"
                          onClick={handleCopyUpi}
                          className="p-2 rounded-lg bg-hti-card hover:bg-hti-border text-hti-gray hover:text-white transition-colors"
                        >
                          {copied ? <CheckCircle2 className="w-4 h-4 text-hti-green" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>

                      {/* Verification Step */}
                      <div className="border-t border-hti-border/50 pt-4 text-left">
                        <label className="block text-xs font-semibold text-white mb-2 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-hti-primary animate-ping" />
                          Confirm Payment (Enter UTR / Ref No)
                        </label>
                        <input
                          type="text"
                          maxLength={12}
                          value={transactionId}
                          onChange={(e) => setTransactionId(e.target.value.replace(/\D/g, ''))}
                          placeholder="12-digit UPI UTR Number"
                          className="w-full px-3 py-2.5 rounded-lg bg-hti-bg border border-hti-border text-white text-xs font-mono placeholder:text-hti-gray/30 focus:outline-none focus:border-hti-primary text-center"
                        />
                        <p className="text-[10px] text-hti-gray mt-1 leading-normal">
                          *Mandatory. Enter the 12-digit transaction ID from your payment receipt to complete your donation log.
                        </p>
                      </div>

                      {/* Submit Details Button */}
                      <button
                        onClick={handleSubmitDonation}
                        disabled={processing || finalAmount < 10 || transactionId.length !== 12}
                        className="w-full btn-primary py-3.5 text-sm font-bold disabled:opacity-40 flex items-center justify-center gap-2 transform active:scale-95 transition-all"
                      >
                        {processing ? 'Logging transaction...' : 'Verify & Submit Donation'}
                      </button>

                    </div>
                  ) : (
                    <div className="py-12 text-center text-hti-gray text-sm border border-dashed border-hti-border rounded-xl">
                      Select an amount of ₹10 or more to generate your custom payment UPI QR code.
                    </div>
                  )}
                </div>

                {/* Secondary Payments: Razorpay (Postponed/Disabled) */}
                <div className="card-glass rounded-2xl p-5 border border-hti-border/50 bg-hti-card/40 opacity-70">
                  <h3 className="text-sm font-bold text-white mb-3 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-hti-gray" />
                      Cards & Netbanking
                    </span>
                    <span className="text-[10px] bg-hti-border text-hti-gray px-2 py-0.5 rounded-full font-medium">
                      Soon
                    </span>
                  </h3>
                  <p className="text-xs text-hti-gray leading-normal mb-3">
                    Razorpay, Netbanking, Credit/Debit cards will be added soon once our official gateway integrations are approved.
                  </p>
                  <button 
                    disabled 
                    className="w-full py-2.5 rounded-xl border border-hti-border/40 text-xs font-semibold text-hti-gray bg-transparent flex items-center justify-center gap-2"
                  >
                    Razorpay Disabled Temporarily
                  </button>
                </div>

                {/* Secure Trust Badge */}
                <div className="flex items-center gap-2 text-[11px] text-hti-gray/60 justify-center">
                  <Shield className="w-3.5 h-3.5 text-hti-green" />
                  Direct peer-to-peer secure encrypted UPI transfer.
                </div>

              </div>

            </div>
          )}

        </div>
      </section>
    </Layout>
  );
}
