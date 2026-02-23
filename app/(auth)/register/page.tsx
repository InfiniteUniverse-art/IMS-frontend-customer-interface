"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { REGISTER_TEXT, validatePasswords, prepareRegisterFormData } from "../../utils/register-validation";

export default function RegisterPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setImageFile(f);
    setError(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files?.[0] ?? null;
    setImageFile(f);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const validationError = validatePasswords(password, confirmPassword);
    if (validationError) {
      setError(validationError);
      return;
    }

    const formData = prepareRegisterFormData({
      firstName, lastName, email, phone, password, age, gender, imageFile
    });

    try {
      setLoading(true);
      const res = await fetch("http://localhost:3000/api/v1/customers/create", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        const errorMessage = data.errors ? data.errors.join(", ") : (data.error || REGISTER_TEXT.ERROR_GENERIC);
        setError(errorMessage);
      } else {
        setSuccess(REGISTER_TEXT.SUCCESS_REDIRECT);
        setTimeout(() => router.push("/policies"), 1500);
      }
    } catch (err: any) {
      setError(REGISTER_TEXT.ERROR_CONNECTION);
    } finally {
      setLoading(false);
    }
  };

  // Tailwind Constants for reusability
  const labelClass = "block text-[12px] font-semibold text-gray-600 mb-1";
  const inputClass = "w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm outline-none transition-colors focus:border-blue-500";

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100 overflow-hidden">
      <div className="flex w-[900px] h-[640px] bg-white rounded-[20px] shadow-2xl overflow-hidden">
        
        {/* Left Side Branding */}
        <div className="flex-1 p-10 bg-gradient-to-br from-[#1e40af] to-[#3b82f6] text-white flex flex-col justify-center">
          <div className="w-[60px] h-[60px] bg-white/20 rounded-xl flex items-center justify-center mb-6">
             <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
               <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
             </svg>
          </div>
          <h1 className="text-[28px] font-bold mb-4 leading-tight">{REGISTER_TEXT.BRAND_TITLE}</h1>
          <p className="text-base leading-relaxed opacity-90">{REGISTER_TEXT.BRAND_SUBTITLE}</p>
        </div>

        {/* Right Side Form */}
        <div className="w-[520px] p-[40px_48px] flex flex-col">
          <header className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{REGISTER_TEXT.FORM_TITLE}</h2>
            <p className="text-gray-500 text-sm">{REGISTER_TEXT.FORM_SUBTITLE}</p>
          </header>

          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-[14px]">
            <div className="col-span-1">
              <label className={labelClass}>First Name</label>
              <input required placeholder="John" value={firstName} onChange={(e) => setFirstName(e.target.value)} className={inputClass} />
            </div>
            <div className="col-span-1">
              <label className={labelClass}>Last Name</label>
              <input required placeholder="Doe" value={lastName} onChange={(e) => setLastName(e.target.value)} className={inputClass} />
            </div>
            <div className="col-span-2">
              <label className={labelClass}>Email Address</label>
              <input required type="email" placeholder="john@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
            </div>
            <div className="col-span-1">
              <label className={labelClass}>Phone Number</label>
              <input required placeholder="+1..." value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} />
            </div>
            <div className="col-span-1">
              <label className={labelClass}>Age & Gender</label>
              <div className="flex gap-2">
                <input placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} className={`${inputClass} flex-1`} />
                <select value={gender} onChange={(e) => setGender(e.target.value)} className={`${inputClass} flex-[1.5]`}>
                  <option value="">Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>
            <div className="col-span-1">
              <label className={labelClass}>Password</label>
              <input required type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} />
            </div>
            <div className="col-span-1">
              <label className={labelClass}>Confirm Password</label>
              <input required type="password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={inputClass} />
            </div>

            <div className="col-span-2">
              <label className={labelClass}>Profile Photo</label>
              <div 
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-2.5 text-center cursor-pointer transition-all duration-200 
                  ${isDragging ? "border-blue-600 bg-blue-50" : "border-gray-200 bg-gray-50"}`}
              >
                <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleFileChange} />
                <span className={`text-[13px] ${imageFile ? "text-blue-800 font-semibold" : "text-gray-500 font-normal"}`}>
                  {imageFile ? `✓ ${imageFile.name}` : "Drop image here or click to browse"}
                </span>
              </div>
            </div>

            {/* MESSAGE AREA */}
            <div className="col-span-2 min-h-[44px]">
              {error && (
                <div className="bg-red-50 text-red-800 p-[10px_14px] rounded-lg text-[13px] flex items-center gap-2 border border-red-100">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  {error}
                </div>
              )}
              {success && (
                <div className="bg-green-50 text-green-800 p-[10px_14px] rounded-lg text-[13px] flex items-center gap-2 border border-green-100">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                  {success}
                </div>
              )}
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className={`col-span-2 p-3.5 rounded-xl border-none font-bold text-white transition-all shadow-blue-600/20 shadow-lg
                ${loading ? "bg-slate-400 cursor-not-allowed" : "bg-blue-600 cursor-pointer hover:bg-blue-700 active:transform active:scale-[0.98]"}`}
            >
              {loading ? "Creating your secure account..." : "Register Now"}
            </button>
          </form>

          <p className="text-center mt-auto text-sm text-gray-500">
            {REGISTER_TEXT.LOGIN_PROMPT} <a href="/auth/login" className="text-blue-600 font-semibold no-underline hover:underline">{REGISTER_TEXT.LOGIN_LINK}</a>
          </p>
        </div>
      </div>
    </div>
  );
}