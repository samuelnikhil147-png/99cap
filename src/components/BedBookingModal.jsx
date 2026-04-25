import React, { useState } from 'react';
import { X, User, Phone, MapPin, CreditCard, Camera, FileText, Calendar, Clock } from 'lucide-react';
import { notify } from './Toast';

const BedBookingModal = ({ isOpen, onClose, selectedBed, onConfirm }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    aadhar: '',
    address: '',
    checkIn: new Date().toISOString().split('T')[0],
    checkOut: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    photo: null,
    aadharPhoto: null,
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const pricePerDay = 350;
  
  const today = new Date().toISOString().split('T')[0];

  const getNextDay = (dateStr) => {
    const d = new Date(dateStr);
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  const [stayDays, setStayDays] = useState(1);

  const calculateDays = () => {
    const start = new Date(formData.checkIn);
    const end = new Date(formData.checkOut);
    const diffTime = end - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const handleDaysChange = (val) => {
    const num = parseInt(val) || 1;
    setStayDays(num);
    const d = new Date(formData.checkIn);
    d.setDate(d.getDate() + num);
    const nextOut = d.toISOString().split('T')[0];
    setFormData({ ...formData, checkOut: nextOut });
  };

  const validateDates = (field, value, currentData) => {
    let newErrors = { ...errors };
    if (field === 'checkIn') {
      if (value < today) {
        newErrors.checkIn = "Check-In date cannot be in the past";
      } else {
        delete newErrors.checkIn;
      }
      
      // Keep number of days constant when check-in changes
      const d = new Date(value);
      d.setDate(d.getDate() + stayDays);
      setFormData(prev => ({ ...prev, checkIn: value, checkOut: d.toISOString().split('T')[0] }));
    }

    if (field === 'checkOut') {
      if (value <= currentData.checkIn) {
        newErrors.checkOut = "Check-Out must be after Check-In";
        setTimeout(() => {
          setFormData(prev => ({ ...prev, checkOut: getNextDay(prev.checkIn) }));
          setStayDays(1);
          setErrors(prev => {
            const e = { ...prev };
            delete e.checkOut;
            return e;
          });
        }, 1500);
      } else {
        delete newErrors.checkOut;
        const diff = Math.ceil((new Date(value) - new Date(currentData.checkIn)) / (1000 * 60 * 60 * 24));
        setStayDays(diff);
      }
      setFormData(prev => ({ ...prev, checkOut: value }));
    }
    setErrors(newErrors);
  };

  const days = calculateDays();
  const totalAmount = days * pricePerDay;

  const validatePhone = (phone) => {
    if (!phone) return "Phone number is required";
    if (!/^[6-9]\d{9}$/.test(phone)) {
      if (phone.length !== 10) return "Enter a valid 10-digit mobile number";
      return "Mobile number must start with 6, 7, 8, or 9";
    }
    return "";
  };

  const validateAadhar = (aadhar) => {
    const raw = aadhar.replace(/\s/g, '');
    if (!raw) return "Aadhaar number is required";
    if (!/^\d+$/.test(raw)) return "Only numbers are allowed";
    if (raw.length !== 12) return "Aadhaar number must be exactly 12 digits";
    return "";
  };

  const formatAadhar = (val) => {
    const raw = val.replace(/\D/g, '').substring(0, 12);
    const parts = raw.match(/.{1,4}/g) || [];
    return parts.join(' ');
  };

  const handlePhoneChange = (val) => {
    const numeric = val.replace(/\D/g, '').substring(0, 10);
    setFormData({ ...formData, phone: numeric });
    if (touched.phone) {
      setErrors(prev => ({ ...prev, phone: validatePhone(numeric) }));
    }
  };

  const handleAadharChange = (val) => {
    const formatted = formatAadhar(val);
    const raw = formatted.replace(/\s/g, '');
    setFormData({ ...formData, aadhar: formatted });
    if (touched.aadhar) {
      setErrors(prev => ({ ...prev, aadhar: validateAadhar(raw) }));
    }
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    if (field === 'phone') setErrors(prev => ({ ...prev, phone: validatePhone(formData.phone) }));
    if (field === 'aadhar') setErrors(prev => ({ ...prev, aadhar: validateAadhar(formData.aadhar) }));
  };

  const isFormValid = () => {
    return (
      formData.name && 
      !validatePhone(formData.phone) && 
      !validateAadhar(formData.aadhar) && 
      formData.address &&
      formData.checkIn >= today &&
      formData.checkOut > formData.checkIn
    );
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, [field]: URL.createObjectURL(file) });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Final validation
    if (formData.checkIn < today) {
      notify('Check-In date cannot be in the past', 'error');
      return;
    }
    if (formData.checkOut <= formData.checkIn) {
      notify('Check-Out date must be after Check-In date', 'error');
      return;
    }

    if (!isFormValid()) {
      notify('Please fix the errors before submitting', 'error');
      return;
    }
    
    notify(`Bed ${selectedBed} booked successfully for ${days} days!`, 'success');
    onConfirm(selectedBed, formData);
    onClose();
    // Reset form
    setFormData({
      name: '',
      phone: '',
      aadhar: '',
      address: '',
      checkIn: today,
      checkOut: getNextDay(today),
      photo: null,
      aadharPhoto: null,
    });
    setErrors({});
    setTouched({});
  };

  const getInputStyles = (field, isError, isSuccess) => {
    let base = "w-full h-[52px] bg-white dark:bg-slate-800 border rounded-[14px] pl-12 pr-4 text-sm font-bold text-slate-900 dark:text-white shadow-[0_2px_6px_rgba(0,0,0,0.06)] transition-all duration-200 outline-none placeholder:text-[#98A2B3] dark:placeholder:text-slate-500 placeholder:font-medium";
    
    if (isError) return `${base} border-[#EF4444] bg-[#FEF2F2] dark:bg-red-900/10 focus:ring-4 focus:ring-[#EF4444]/10`;
    if (isSuccess) return `${base} border-[#22C55E] bg-[#F0FDF4] dark:bg-emerald-900/10 focus:ring-4 focus:ring-[#22C55E]/10`;
    
    return `${base} border-[#D0D5DD] dark:border-slate-700 hover:border-[#B4B8FF] dark:hover:border-indigo-500/50 focus:border-[#6366F1] focus:ring-4 focus:ring-[#6366F1]/15`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose}></div>
      <div className="bg-[#F4F6F8] dark:bg-slate-950 rounded-[2.5rem] w-full max-w-2xl relative z-10 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-800">
        <div className="bg-white dark:bg-slate-900 p-8 flex justify-between items-center border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
              Book Bed <span className="text-[#6366F1]">#{selectedBed}</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">Please provide customer details for registration.</p>
          </div>
          <button 
            onClick={onClose}
            className="p-3 bg-white dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-2xl border border-slate-200 dark:border-slate-700 transition-all hover:rotate-90"
          >
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-5 space-y-5 max-h-[75vh] overflow-y-auto custom-scrollbar">
          {/* Row 1: Full Name | Phone Number */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-[13px] font-semibold text-[#344054] dark:text-slate-300 tracking-[0.5px] mb-[6px] ml-1 uppercase">Full Name</label>
              <div className="relative group">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#98A2B3] group-focus-within:text-[#6366F1] transition-colors" />
                <input 
                  required
                  type="text" 
                  placeholder="John Doe"
                  className={getInputStyles('name', false, formData.name.length > 2)}
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-[13px] font-semibold text-[#344054] dark:text-slate-300 tracking-[0.5px] mb-[6px] ml-1 uppercase">Phone Number</label>
              <div className="relative group">
                <div className="absolute left-12 top-1/2 -translate-y-1/2 text-[#344054] dark:text-slate-300 font-bold text-sm border-r border-slate-200 dark:border-slate-700 pr-2">+91</div>
                <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#98A2B3] group-focus-within:text-[#6366F1] transition-colors" />
                <input 
                  required
                  type="tel" 
                  inputMode="numeric"
                  placeholder="98765 43210"
                  className={getInputStyles('phone', touched.phone && errors.phone, touched.phone && !errors.phone)}
                  style={{ paddingLeft: '85px' }}
                  value={formData.phone}
                  onBlur={() => handleBlur('phone')}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                />
                {touched.phone && errors.phone && <p className="text-[10px] font-bold text-red-500 mt-1 ml-2">{errors.phone}</p>}
              </div>
            </div>
          </div>

          {/* Row 2: Aadhaar Number (Full Width) */}
          <div className="flex flex-col">
            <label className="text-[13px] font-semibold text-[#344054] dark:text-slate-300 tracking-[0.5px] mb-[6px] ml-1 uppercase">Aadhaar Number</label>
            <div className="relative group">
              <FileText size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#98A2B3] group-focus-within:text-[#6366F1] transition-colors" />
                <input 
                  required
                  type="text" 
                  inputMode="numeric"
                  placeholder="XXXX XXXX XXXX"
                  className={getInputStyles('aadhar', touched.aadhar && errors.aadhar, touched.aadhar && !errors.aadhar)}
                  value={formData.aadhar}
                  onBlur={() => handleBlur('aadhar')}
                  onChange={(e) => handleAadharChange(e.target.value)}
                />
              {touched.aadhar && errors.aadhar && <p className="text-[10px] font-bold text-red-500 mt-1 ml-2">{errors.aadhar}</p>}
            </div>
          </div>

          {/* Row 3: Check In | Number of Days | Check Out */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
            {/* Check In */}
            <div className="flex flex-col">
              <label className="text-[13px] font-semibold text-[#344054] dark:text-slate-300 tracking-[0.5px] mb-[6px] ml-1 uppercase">Check In</label>
              <div className="relative group">
                <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#98A2B3] group-focus-within:text-[#6366F1] transition-colors" />
                <input 
                  required
                  type="date" 
                  min={today}
                  className={getInputStyles('checkIn', errors.checkIn, true)}
                  value={formData.checkIn}
                  onChange={(e) => validateDates('checkIn', e.target.value, formData)}
                />
              </div>
              {errors.checkIn && <p className="text-[10px] font-bold text-red-500 mt-1 ml-2">{errors.checkIn}</p>}
            </div>

            {/* Number of Days */}
            <div className="flex flex-col">
              <label className="text-[13px] font-semibold text-[#344054] dark:text-slate-300 tracking-[0.5px] mb-[6px] ml-1 uppercase">Stay Days</label>
              <div className="relative group">
                <Clock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#98A2B3] group-focus-within:text-[#6366F1] transition-colors" />
                <input 
                  required
                  type="number" 
                  min="1"
                  placeholder="Days"
                  className={getInputStyles('stayDays', false, true)}
                  value={stayDays}
                  onChange={(e) => handleDaysChange(e.target.value)}
                />
              </div>
            </div>

            {/* Check Out */}
            <div className="flex flex-col">
              <label className="text-[13px] font-semibold text-[#344054] dark:text-slate-300 tracking-[0.5px] mb-[6px] ml-1 uppercase">Check Out</label>
              <div className="relative group">
                <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#98A2B3] group-focus-within:text-[#6366F1] transition-colors" />
                <input 
                  required
                  type="date" 
                  min={getNextDay(formData.checkIn)}
                  className={getInputStyles('checkOut', errors.checkOut, true)}
                  value={formData.checkOut}
                  onChange={(e) => validateDates('checkOut', e.target.value, formData)}
                />
              </div>
              {errors.checkOut && <p className="text-[10px] font-bold text-red-500 mt-1 ml-2">{errors.checkOut}</p>}
            </div>
          </div>

          {/* Row 4: Permanent Address */}
          <div className="flex flex-col">
            <label className="text-[13px] font-semibold text-[#344054] dark:text-slate-300 tracking-[0.5px] mb-[6px] ml-1 uppercase">Permanent Address</label>
            <div className="relative group">
              <MapPin size={18} className="absolute left-4 top-4 text-[#98A2B3] group-focus-within:text-[#6366F1] transition-colors" />
              <textarea 
                required
                placeholder="Enter full address..."
                className="w-full min-h-[100px] bg-white dark:bg-slate-800 border border-[#D0D5DD] dark:border-slate-700 rounded-[14px] pl-12 pr-4 py-3.5 text-sm font-bold text-slate-900 dark:text-white shadow-[0_2px_6px_rgba(0,0,0,0.06)] hover:border-[#B4B8FF] dark:hover:border-indigo-500/50 focus:border-[#6366F1] focus:ring-4 focus:ring-[#6366F1]/15 transition-all duration-200 outline-none resize-y placeholder:text-[#98A2B3] dark:placeholder:text-slate-500 placeholder:font-medium"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
              ></textarea>
            </div>
          </div>

          {/* Photo Uploads */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
            {/* Customer Photo */}
            <div className="flex flex-col">
              <label className="text-[13px] font-semibold text-[#344054] dark:text-slate-300 tracking-[0.5px] mb-[6px] ml-1 uppercase">Customer Photo</label>
              <div className="flex flex-col gap-3">
                <label className="flex flex-col items-center justify-center w-full h-32 border border-[#D0D5DD] dark:border-slate-700 rounded-[14px] cursor-pointer bg-white dark:bg-slate-800 shadow-[0_2px_6px_rgba(0,0,0,0.06)] hover:border-[#B4B8FF] dark:hover:border-indigo-500/50 transition-all duration-200 group">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Camera size={24} className="text-[#98A2B3] group-hover:text-[#6366F1] mb-2 transition-colors" />
                    <p className="text-xs font-bold text-[#98A2B3] group-hover:text-slate-600 dark:group-hover:text-slate-300">Upload Profile</p>
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'photo')} />
                </label>
                {formData.photo && (
                  <div className="w-full h-32 rounded-[14px] overflow-hidden border-2 border-white dark:border-slate-700 shadow-lg">
                    <img src={formData.photo} alt="Profile" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>

            {/* Aadhar Photo */}
            <div className="flex flex-col">
              <label className="text-[13px] font-semibold text-[#344054] dark:text-slate-300 tracking-[0.5px] mb-[6px] ml-1 uppercase">Aadhar Card Photo</label>
              <div className="flex flex-col gap-3">
                <label className="flex flex-col items-center justify-center w-full h-32 border border-[#D0D5DD] dark:border-slate-700 rounded-[14px] cursor-pointer bg-white dark:bg-slate-800 shadow-[0_2px_6px_rgba(0,0,0,0.06)] hover:border-[#B4B8FF] dark:hover:border-indigo-500/50 transition-all duration-200 group">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <FileText size={24} className="text-[#98A2B3] group-hover:text-[#6366F1] mb-2 transition-colors" />
                    <p className="text-xs font-bold text-[#98A2B3] group-hover:text-slate-600 dark:group-hover:text-slate-300">Upload Aadhar</p>
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'aadharPhoto')} />
                </label>
                {formData.aadharPhoto && (
                  <div className="w-full h-32 rounded-[14px] overflow-hidden border-2 border-white dark:border-slate-700 shadow-lg">
                    <img src={formData.aadharPhoto} alt="Aadhar" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Price Preview */}
          <div className="bg-[#6366F1] rounded-[14px] p-5 text-white flex items-center justify-between shadow-xl shadow-[#6366F1]/20 mt-5">
            <div>
              <p className="text-[#B4B8FF] text-[11px] font-black uppercase tracking-widest">Total Bill Amount</p>
              <p className="text-sm font-medium opacity-90">Stay Duration: {days} days × ₹{pricePerDay}/day</p>
            </div>
            <div className="text-right">
              <h3 className="text-3xl font-black">₹{totalAmount}</h3>
            </div>
          </div>

          <div className="pt-3 flex gap-4">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-4 bg-white dark:bg-slate-800 border border-[#D0D5DD] dark:border-slate-700 text-[#344054] dark:text-slate-300 rounded-[14px] font-bold shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-all active:scale-95"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={!isFormValid()}
              className={`flex-[2] px-6 py-4 rounded-[14px] font-bold transition-all active:scale-95 flex items-center justify-center gap-2 ${
                isFormValid() 
                ? "bg-[#6366F1] text-white shadow-lg shadow-[#6366F1]/20 hover:bg-[#4F46E5]" 
                : "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed"
              }`}
            >
              <CreditCard size={20} />
              <span>Confirm & Pay ₹{totalAmount}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BedBookingModal;
