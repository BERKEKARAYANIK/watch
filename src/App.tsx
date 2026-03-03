import React, { useState, useEffect } from 'react';
import { WheelPicker } from './components/WheelPicker';
import { Settings, Moon, Sun } from 'lucide-react';

export default function App() {
  const [hour, setHour] = useState('08');
  const [minute, setMinute] = useState('30');
  const [isActive, setIsActive] = useState(true);
  const [timeUntil, setTimeUntil] = useState('');

  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

  useEffect(() => {
    const calculateTimeUntil = () => {
      const now = new Date();
      const alarmTime = new Date();
      alarmTime.setHours(parseInt(hour, 10));
      alarmTime.setMinutes(parseInt(minute, 10));
      alarmTime.setSeconds(0);

      if (alarmTime <= now) {
        alarmTime.setDate(alarmTime.getDate() + 1);
      }

      const diffMs = alarmTime.getTime() - now.getTime();
      const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

      setTimeUntil(`Rings in ${diffHrs} hours ${diffMins} mins`);
    };

    calculateTimeUntil();
    const interval = setInterval(calculateTimeUntil, 60000);
    return () => clearInterval(interval);
  }, [hour, minute]);

  const isMorning = parseInt(hour, 10) >= 6 && parseInt(hour, 10) < 18;

  return (
    <div className="min-h-screen bg-neutral-200 flex items-center justify-center p-4 font-sans text-neutral-900">
      <div className="w-full max-w-sm bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-neutral-200">
        {/* Header */}
        <div className="p-8 pb-6 flex justify-between items-center bg-neutral-50 border-b border-neutral-100">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Alarm</h1>
            <p className="text-neutral-500 text-sm mt-1">Wake up refreshed</p>
          </div>
          <button 
            onClick={() => setIsActive(!isActive)}
            className={`w-14 h-8 rounded-full transition-colors relative ${isActive ? 'bg-emerald-500' : 'bg-neutral-300'}`}
          >
            <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform shadow-sm ${isActive ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>

        {/* Picker Section */}
        <div className={`p-8 flex justify-center items-center gap-4 relative transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
          <WheelPicker options={hours} value={hour} onChange={setHour} width="w-20" />
          <span className="text-4xl font-bold text-neutral-300 -mt-2 animate-pulse">:</span>
          <WheelPicker options={minutes} value={minute} onChange={setMinute} width="w-20" />
        </div>

        {/* Info Section */}
        <div className="px-8 pb-8">
          <div className="bg-neutral-50 rounded-2xl p-4 flex items-center gap-4 border border-neutral-100">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isMorning ? 'bg-amber-100 text-amber-500' : 'bg-indigo-100 text-indigo-500'}`}>
              {isMorning ? <Sun size={24} /> : <Moon size={24} />}
            </div>
            <div>
              <p className="font-medium text-neutral-900">
                {isMorning ? 'Morning Alarm' : 'Night Alarm'}
              </p>
              <p className="text-sm text-neutral-500">
                {isActive ? timeUntil : 'Alarm is off'}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-neutral-900 text-white flex justify-between items-center m-4 rounded-2xl">
          <button className="p-3 hover:bg-neutral-800 rounded-xl transition-colors">
            <Settings size={20} className="text-neutral-400" />
          </button>
          <button className="px-6 py-3 bg-white text-neutral-900 font-semibold rounded-xl hover:bg-neutral-100 transition-colors">
            Save Alarm
          </button>
        </div>
      </div>
    </div>
  );
}