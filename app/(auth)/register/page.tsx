"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";

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
    setError(null); // Clear errors when user interacts
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

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please double-check.");
      return;
    }

    const formData = new FormData();
    formData.append("first_name", firstName); 
    formData.append("last_name", lastName);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("password", password);
    formData.append("role", "customer");
    if (age) formData.append("age", age);
    if (gender) formData.append("gender", gender);
    if (imageFile) formData.append("image", imageFile); 

    try {
      setLoading(true);
      const res = await fetch("http://localhost:3000/api/v1/customers/create", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        const errorMessage = data.errors ? data.errors.join(", ") : (data.error || "Registration failed");
        setError(errorMessage);
      } else {
        setSuccess("Account created successfully! Redirecting...");
        setTimeout(() => router.push("/policies"), 1500);
      }
    } catch (err: any) {
      setError("Connection lost. Please check your internet.");
    } finally {
      setLoading(false);
    }
  };

  // Reusable Styles
  const labelStyle = { display: "block", fontSize: "12px", fontWeight: "600", color: "#4b5563", marginBottom: "4px" };
  const inputStyle = { width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "14px", outline: "none", transition: "border-color 0.2s" };

  return (
    <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f3f4f6", overflow: "hidden" }}>
      <div style={{ width: 900, height: 640, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.15)", borderRadius: 20, background: "#fff", display: "flex", overflow: "hidden" }}>
        
        {/* Left Side Branding */}
        {/* <div style={{ flex: 1, padding: 48, background: "#1e3a8a", color: "white", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div style={{ width: 48, height: 48, background: "rgba(255,255,255,0.1)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 32 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <h1 style={{ fontSize: 32, fontWeight: "800", marginBottom: 16, letterSpacing: "-0.025em" }}>Join IMS </h1>
            <p style={{ fontSize: 16, lineHeight: "1.6", opacity: 0.8 }}>Experience the next generation of asset management with military-grade security protocols.</p>
          </div>
          <div style={{ fontSize: 13, opacity: 0.6 }}>© 2026 Insurance management System Global</div>
        </div> */}
        <div style={{ flex: 1, padding: 40, background: "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)", color: "white", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ width: 60, height: 60, background: "rgba(255,255,255,0.2)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
             <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <h1 style={{ fontSize: 28, fontWeight: "bold", marginBottom: 16 }}>IMS - Insurance Management System</h1>
          <p style={{ fontSize: 16, lineHeight: "1.5", opacity: 0.9 }}>Secure your future with our enterprise-grade identity management system. Simple, fast, and encrypted.</p>
        </div>

        {/* Right Side Form */}
        <div style={{ width: 520, padding: "40px 48px", display: "flex", flexDirection: "column" }}>
          <header style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 24, fontWeight: "700", color: "#111827" }}>Create Account</h2>
            <p style={{ color: "#6b7280", fontSize: 14 }}>Get started in less than 2 minutes.</p>
          </header>

          <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            <div style={{ gridColumn: "span 1" }}>
              <label style={labelStyle}>First Name</label>
              <input required placeholder="John" value={firstName} onChange={(e) => setFirstName(e.target.value)} style={inputStyle} />
            </div>
            <div style={{ gridColumn: "span 1" }}>
              <label style={labelStyle}>Last Name</label>
              <input required placeholder="Doe" value={lastName} onChange={(e) => setLastName(e.target.value)} style={inputStyle} />
            </div>
            <div style={{ gridColumn: "span 2" }}>
              <label style={labelStyle}>Email Address</label>
              <input required type="email" placeholder="john@example.com" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
            </div>
            <div style={{ gridColumn: "span 1" }}>
              <label style={labelStyle}>Phone Number</label>
              <input required placeholder="+1..." value={phone} onChange={(e) => setPhone(e.target.value)} style={inputStyle} />
            </div>
            <div style={{ gridColumn: "span 1" }}>
              <label style={labelStyle}>Age & Gender</label>
              <div style={{ display: "flex", gap: 8 }}>
                <input placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} style={{ ...inputStyle, flex: 1 }} />
                <select value={gender} onChange={(e) => setGender(e.target.value)} style={{ ...inputStyle, flex: 1.5 }}>
                  <option value="">Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>
            <div style={{ gridColumn: "span 1" }}>
              <label style={labelStyle}>Password</label>
              <input required type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} />
            </div>
            <div style={{ gridColumn: "span 1" }}>
              <label style={labelStyle}>Confirm Password</label>
              <input required type="password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} style={inputStyle} />
            </div>

            <div style={{ gridColumn: "span 2" }}>
              <label style={labelStyle}>Profile Photo</label>
              <div 
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: `2px dashed ${isDragging ? "#2563eb" : "#e5e7eb"}`,
                  borderRadius: "10px",
                  padding: "10px",
                  textAlign: "center",
                  cursor: "pointer",
                  background: isDragging ? "#eff6ff" : "#f9fafb",
                  transition: "all 0.2s ease"
                }}
              >
                <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleFileChange} />
                <span style={{ fontSize: "13px", color: imageFile ? "#1e40af" : "#6b7280", fontWeight: imageFile ? "600" : "400" }}>
                  {imageFile ? `✓ ${imageFile.name}` : "Drop image here or click to browse"}
                </span>
              </div>
            </div>

            {/* MESSAGE AREA */}
            <div style={{ gridColumn: "span 2", minHeight: "44px" }}>
              {error && (
                <div style={{ background: "#fef2f2", color: "#991b1b", padding: "10px 14px", borderRadius: "8px", fontSize: "13px", display: "flex", alignItems: "center", gap: "8px", border: "1px solid #fee2e2" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  {error}
                </div>
              )}
              {success && (
                <div style={{ background: "#f0fdf4", color: "#166534", padding: "10px 14px", borderRadius: "8px", fontSize: "13px", display: "flex", alignItems: "center", gap: "8px", border: "1px solid #dcfce7" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                  {success}
                </div>
              )}
            </div>

            <button type="submit" disabled={loading} style={{ 
              gridColumn: "span 2", 
              padding: "14px", 
              background: loading ? "#94a3b8" : "#2563eb", 
              color: "white", 
              borderRadius: "10px", 
              border: "none", 
              fontWeight: "700",
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: "0 4px 6px -1px rgba(37, 99, 235, 0.2)"
            }}>
              {loading ? "Creating your secure account..." : "Register Now"}
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: "auto", fontSize: "14px", color: "#6b7280" }}>
            Already a member? <a href="/auth/login" style={{ color: "#2563eb", fontWeight: "600", textDecoration: "none" }}>Log In</a>
          </p>
        </div>
      </div>
    </div>
  );
}