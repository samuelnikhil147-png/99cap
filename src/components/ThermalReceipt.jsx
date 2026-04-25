import React from 'react';

const ThermalReceipt = ({ data }) => {
  if (!data) return null;

  const {
    receiptNo = Math.floor(100000 + Math.random() * 900000),
    customerName,
    bedId,
    checkIn,
    checkOut,
    actualCheckOut,
    days,
    stayedDays,
    rate = 350,
    totalAmount
  } = data;

  const displayCheckOut = actualCheckOut || checkOut;
  const displayDays = stayedDays || days;

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-IN');
  const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  return (
    <div id="thermal-receipt" className="hidden print:block w-[80mm] p-2 bg-white text-black font-mono text-[13px] leading-snug mx-auto">
      <div className="text-center mb-2">
        <p className="text-[16px] font-bold">================================</p>
        <h1 className="text-[20px] font-black uppercase">99 CAPSULE</h1>
        <p className="text-[12px]">Opp. ETree Bus Stand, Vijayawada</p>
        <p className="text-[16px] font-bold">--------------------------------</p>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between">
          <span>Receipt No :</span>
          <span className="font-bold">{receiptNo}</span>
        </div>
        <div className="flex justify-between">
          <span>Date       :</span>
          <span>{dateStr}</span>
        </div>
        <div className="flex justify-between">
          <span>Time       :</span>
          <span>{timeStr}</span>
        </div>
      </div>

      <p className="text-[16px] font-bold my-1">--------------------------------</p>

      <div className="space-y-1">
        <div className="flex justify-between">
          <span>Customer   :</span>
          <span className="font-bold uppercase">{customerName}</span>
        </div>
        <div className="flex justify-between">
          <span>Bed No     :</span>
          <span className="font-bold">{bedId}</span>
        </div>
      </div>

      <p className="text-[16px] font-bold my-1">--------------------------------</p>

      <div className="space-y-1">
        <div className="flex justify-between">
          <span>Check-In   :</span>
          <span>{checkIn}</span>
        </div>
        <div className="flex justify-between">
          <span>Check-Out  :</span>
          <span>{displayCheckOut}</span>
        </div>
        <div className="flex justify-between">
          <span>Days Stay  :</span>
          <span className="font-bold">{displayDays}</span>
        </div>
        <div className="flex justify-between">
          <span>Rate/Day   :</span>
          <span>₹{rate}</span>
        </div>
      </div>

      <p className="text-[16px] font-bold my-1">--------------------------------</p>

      <div className="flex justify-between text-[18px] py-1">
        <span className="font-black">## TOTAL      :</span>
        <span className="font-black">₹{totalAmount}</span>
      </div>

      <div className="text-center mt-6 space-y-1">
        <p className="text-[18px] font-black italic"># THANK YOU</p>
        <p className="text-[11px]">VISIT AGAIN</p>
      </div>

      {/* Extra spacing for thermal printer tear-off */}
      <div className="h-16"></div>
    </div>
  );
};

export default ThermalReceipt;
