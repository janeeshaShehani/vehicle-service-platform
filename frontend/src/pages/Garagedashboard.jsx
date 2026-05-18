
// src/pages/GarageDashboard.jsx
// Route: /dashboard  — NO Navbar/Footer (self-contained)
// Mobile-first design matching GarageHub style from reference image

import { useState, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";

// ─── Constants ────────────────────────────────────────────────────────────────
const DISTRICTS = ["Colombo","Gampaha","Kalutara","Kandy","Matale","Nuwara Eliya","Galle","Matara","Hambantota","Jaffna","Kurunegala","Puttalam","Anuradhapura","Polonnaruwa","Badulla","Ratnapura","Kegalle","Trincomalee","Batticaloa","Ampara"];
const ALL_SERVICES = ["Oil Change","Engine Repair","Battery Service","AC Repair","Wheel Alignment","Painting","Washing","Diagnostics","Tyre Service","Brake Repair","Towing","Electrical Repair"];
const ALL_VEHICLES  = ["Car","Bike","Van","SUV","Truck","Electric Vehicle","Bus","Three-Wheeler"];
const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
const MAX_PHOTOS = 10;

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK = {
  name:"Auto Care Garage", owner:"Kasun Perera", phone:"077 123 4567",
  email:"autocare@gmail.com", district:"Kandy", address:"No. 123, Peradeniya Road, Kandy",
  description:"We provide reliable and high quality vehicle services including repairs, maintenance, and diagnostics. Customer satisfaction is our priority.",
  services:["Oil Change","Engine Repair","Battery Service","AC Repair","Wheel Alignment","+3 more"],
  vehicles:["Car","Van","SUV","Bike"],
  hours:{ "Monday - Friday":"8:00 AM - 6:00 PM", Saturday:"8:00 AM - 2:00 PM", Sunday:"Closed" },
  isOpen:true, rating:4.8, reviews:128, profileViews:1240, totalReviews:128,
  coverUrl:"https://images.unsplash.com/photo-1625047509248-ec889cbff17f?w=800&q=80",
  photos:[
    {id:"p1",url:"https://images.unsplash.com/photo-1625047509248-ec889cbff17f?w=400&q=75",cover:true},
    {id:"p2",url:"https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&q=75",cover:false},
    {id:"p3",url:"https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=400&q=75",cover:false},
    {id:"p4",url:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=75",cover:false},
    {id:"p5",url:"https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400&q=75",cover:false},
    {id:"p6",url:"https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&q=75",cover:false},
  ],
};

const MOCK_REVIEWS = [
  {id:1,name:"Dilshan Silva",  initials:"DS",rating:5,date:"2 days ago",   text:"Very good service and friendly staff. Highly recommended!",    color:"#1D4ED8"},
  {id:2,name:"Tharindu Perera",initials:"TP",rating:5,date:"1 week ago",  text:"Professional work. My car feels like new!",                    color:"#059669"},
  {id:3,name:"Kasun Fernando", initials:"KF",rating:4,date:"2 weeks ago", text:"Great AC repair. Honest pricing and quick turnaround.",         color:"#7C3AED"},
];

// ─── Bottom nav tabs ──────────────────────────────────────────────────────────
const TABS = [
  {id:"dashboard", label:"Dashboard", icon:(a)=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={a?"#1D4ED8":"#94A3B8"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>},
  {id:"edit",      label:"Edit Garage",icon:(a)=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={a?"#1D4ED8":"#94A3B8"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>},
  {id:"photos",    label:"Photos",    icon:(a)=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={a?"#1D4ED8":"#94A3B8"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>},
  {id:"reviews",   label:"Reviews",   icon:(a)=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={a?"#1D4ED8":"#94A3B8"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>},
  {id:"more",      label:"More",      icon:(a)=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={a?"#1D4ED8":"#94A3B8"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>},
];

// ─── Tiny helpers ─────────────────────────────────────────────────────────────
const Stars = ({n=5,size=13})=>(
  <span style={{display:"inline-flex",gap:1}}>
    {[1,2,3,4,5].map(i=><svg key={i} width={size} height={size} viewBox="0 0 24 24" fill={i<=n?"#F59E0B":"#E2E8F0"} stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>)}
  </span>
);

const Avatar=({initials,bg="#1D4ED8",size=40})=>(
  <div style={{width:size,height:size,borderRadius:"50%",background:bg,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700,fontSize:size*0.33,flexShrink:0,fontFamily:"system-ui"}}>
    {initials}
  </div>
);

const FInput=({label,value,onChange,type="text",placeholder,hint})=>{
  const [f,setF]=useState(false);
  return(
    <div style={{marginBottom:14}}>
      {label&&<label style={{display:"block",fontSize:"0.78rem",fontWeight:600,color:"#374151",marginBottom:5}}>{label}</label>}
      <input type={type} value={value} onChange={onChange} placeholder={placeholder||label}
        onFocus={()=>setF(true)} onBlur={()=>setF(false)}
        style={{width:"100%",padding:"11px 13px",borderRadius:10,border:`1.5px solid ${f?"#1D4ED8":"#E2E8F0"}`,background:"#fff",fontSize:"0.9rem",color:"#111",outline:"none",fontFamily:"inherit",transition:"border-color 0.15s",boxSizing:"border-box"}}
      />
      {hint&&<p style={{fontSize:"0.72rem",color:"#94A3B8",marginTop:3}}>{hint}</p>}
    </div>
  );
};

const FSelect=({label,value,onChange,options})=>{
  const [f,setF]=useState(false);
  return(
    <div style={{marginBottom:14}}>
      {label&&<label style={{display:"block",fontSize:"0.78rem",fontWeight:600,color:"#374151",marginBottom:5}}>{label}</label>}
      <select value={value} onChange={onChange} onFocus={()=>setF(true)} onBlur={()=>setF(false)}
        style={{width:"100%",padding:"11px 13px",borderRadius:10,border:`1.5px solid ${f?"#1D4ED8":"#E2E8F0"}`,background:"#fff",fontSize:"0.9rem",color:"#111",outline:"none",fontFamily:"inherit",appearance:"none",backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2.5'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,backgroundRepeat:"no-repeat",backgroundPosition:"right 12px center",paddingRight:32,boxSizing:"border-box"}}>
        <option value="">Select</option>
        {options.map(o=><option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
};

const FTextarea=({label,value,onChange,rows=4})=>{
  const [f,setF]=useState(false);
  return(
    <div style={{marginBottom:14}}>
      {label&&<label style={{display:"block",fontSize:"0.78rem",fontWeight:600,color:"#374151",marginBottom:5}}>{label}</label>}
      <textarea value={value} onChange={onChange} rows={rows} onFocus={()=>setF(true)} onBlur={()=>setF(false)}
        style={{width:"100%",padding:"11px 13px",borderRadius:10,border:`1.5px solid ${f?"#1D4ED8":"#E2E8F0"}`,background:"#fff",fontSize:"0.9rem",color:"#111",outline:"none",fontFamily:"inherit",resize:"vertical",lineHeight:1.6,boxSizing:"border-box"}}
      />
    </div>
  );
};

// Collapsible section used in Edit tab
const Collapse=({icon,title,badge,children,defaultOpen=true})=>{
  const [open,setOpen]=useState(defaultOpen);
  return(
    <div style={{background:"#fff",borderRadius:14,border:"1px solid #E9EDF2",marginBottom:14,overflow:"hidden"}}>
      <button onClick={()=>setOpen(o=>!o)} style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"14px 16px",background:"none",border:"none",cursor:"pointer",textAlign:"left"}}>
        <span style={{fontSize:"1rem"}}>{icon}</span>
        <span style={{flex:1,fontWeight:700,fontSize:"0.92rem",color:"#0F172A"}}>{title}</span>
        {badge&&<span style={{fontSize:"0.72rem",color:"#64748B",fontWeight:500}}>{badge}</span>}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" style={{transition:"transform 0.2s",transform:open?"rotate(180deg)":"rotate(0deg)"}}>
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>
      {open&&<div style={{padding:"0 16px 16px"}}>{children}</div>}
    </div>
  );
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function GarageDashboard() {
  const navigate = useNavigate();
  const fileRef  = useRef(null);
  const [tab,    setTab]    = useState("dashboard");
  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);
  const [dragOver,setDragOver]=useState(false);

  // form state
  const [form,setForm]=useState({
    name:MOCK.name, owner:MOCK.owner, phone:MOCK.phone,
    email:MOCK.email, district:MOCK.district, address:MOCK.address,
    description:MOCK.description,
    services:[...MOCK.services.filter(s=>!s.includes("+"))],
    vehicles:[...MOCK.vehicles],
    hours:{...MOCK.hours},
    isOpen:MOCK.isOpen,
    openTime:"08:00", closeTime:"18:00",
  });
  const [photos,setPhotos]=useState(MOCK.photos);

  const setF=(k,v)=>setForm(f=>({...f,[k]:v}));

  const toggleSvc=s=>setF("services",form.services.includes(s)?form.services.filter(x=>x!==s):[...form.services,s]);
  const toggleVeh=v=>setF("vehicles",form.vehicles.includes(v)?form.vehicles.filter(x=>x!==v):[...form.vehicles,v]);

  const addPhotos=useCallback((files)=>{
    const rem=MAX_PHOTOS-photos.length;
    const newP=Array.from(files).slice(0,rem).map(f=>({id:`n${Date.now()}${Math.random()}`,url:URL.createObjectURL(f),cover:false}));
    setPhotos(p=>[...p,...newP]);
  },[photos.length]);

  const delPhoto=id=>setPhotos(p=>{
    const u=p.filter(x=>x.id!==id);
    if(u.length&&!u.find(x=>x.cover))u[0].cover=true;
    return u;
  });
  const setCover=id=>setPhotos(p=>p.map(x=>({...x,cover:x.id===id})));

  const handleSave=async()=>{
    setSaving(true);
    await new Promise(r=>setTimeout(r,1400));
    setSaving(false); setSaved(true);
    setTimeout(()=>setSaved(false),2500);
  };

  // ── DASHBOARD TAB ─────────────────────────────────────────────────────────
  const DashboardTab=()=>(
    <div>
      {/* Profile Hero Card */}
      <div style={{background:"linear-gradient(135deg,#1D4ED8,#1E3A8A)",borderRadius:16,overflow:"hidden",marginBottom:16,position:"relative"}}>
        <img src={photos.find(p=>p.cover)?.url||MOCK.coverUrl} alt="cover"
          style={{width:"100%",height:140,objectFit:"cover",opacity:0.35,display:"block"}}/>
        <div style={{position:"absolute",inset:0,padding:"16px"}}>
          {/* top row */}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
            <div style={{width:56,height:56,borderRadius:12,background:"rgba(255,255,255,0.15)",border:"2px solid rgba(255,255,255,0.3)",overflow:"hidden",flexShrink:0}}>
              <img src={photos.find(p=>p.cover)?.url||MOCK.coverUrl} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
            </div>
            <button style={{background:"rgba(255,255,255,0.15)",border:"1px solid rgba(255,255,255,0.25)",borderRadius:8,padding:"5px 10px",color:"#fff",fontSize:"0.72rem",fontWeight:600,cursor:"pointer"}}>⋯</button>
          </div>
          {/* name */}
          <h2 style={{fontWeight:800,fontSize:"1.1rem",color:"#fff",marginBottom:4,fontFamily:"system-ui"}}>{form.name}</h2>
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            <span style={{color:"rgba(255,255,255,0.75)",fontSize:"0.78rem"}}>{form.district}, Central Province</span>
          </div>
          {/* rating + status */}
          <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
            <div style={{display:"flex",alignItems:"center",gap:5}}>
              <Stars n={5} size={12}/>
              <span style={{color:"#FCD34D",fontWeight:700,fontSize:"0.82rem"}}>{MOCK.rating}</span>
              <span style={{color:"rgba(255,255,255,0.55)",fontSize:"0.75rem"}}>({MOCK.reviews} Reviews)</span>
            </div>
            <span style={{background:form.isOpen?"#059669":"#64748B",color:"#fff",fontSize:"0.68rem",fontWeight:800,padding:"3px 10px",borderRadius:999}}>
              {form.isOpen?"● Open Now":"● Closed"}
            </span>
          </div>
        </div>
      </div>

      {/* Quick action buttons */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:20}}>
        {[
          {icon:"✏️",label:"Edit Profile",  tab:"edit"},
          {icon:"📸",label:"Photos",        tab:"photos"},
          {icon:"⭐",label:"Reviews",       tab:"reviews"},
          {icon:"⚙️",label:"Settings",      tab:"more"},
        ].map(b=>(
          <button key={b.label} onClick={()=>setTab(b.tab)} style={{
            display:"flex",flexDirection:"column",alignItems:"center",gap:5,
            padding:"12px 6px",borderRadius:12,border:"1px solid #E9EDF2",
            background:"#fff",cursor:"pointer",transition:"all 0.15s",
            boxShadow:"0 1px 4px rgba(15,23,42,0.05)",
          }}
          onMouseEnter={e=>{e.currentTarget.style.borderColor="#BFDBFE";e.currentTarget.style.background="#EFF6FF";}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor="#E9EDF2";e.currentTarget.style.background="#fff";}}>
            <span style={{fontSize:"1.3rem"}}>{b.icon}</span>
            <span style={{fontSize:"0.65rem",fontWeight:600,color:"#475569",textAlign:"center",lineHeight:1.2}}>{b.label}</span>
          </button>
        ))}
      </div>

      {/* Overview stats */}
      <h3 style={{fontWeight:700,fontSize:"0.95rem",color:"#0F172A",marginBottom:10}}>Overview</h3>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:20}}>
        {[
          {icon:"👁️",label:"Profile Views",  value:"1,240",sub:"+12% this month",color:"#EFF6FF",ic:"#1D4ED8"},
          {icon:"💬",label:"Total Reviews",   value:"128",  sub:"+8% this month", color:"#D1FAE5",ic:"#059669"},
          {icon:"⭐",label:"Average Rating",  value:"4.8/5",sub:<Stars n={5} size={11}/>,      color:"#FEF3C7",ic:"#D97706"},
          {icon:"🔧",label:"Total Services",  value:"12",   sub:"Active Services", color:"#EDE9FE",ic:"#7C3AED"},
        ].map(s=>(
          <div key={s.label} style={{background:"#fff",borderRadius:14,border:"1px solid #E9EDF2",padding:"14px",boxShadow:"0 1px 4px rgba(15,23,42,0.04)"}}>
            <div style={{width:32,height:32,borderRadius:9,background:s.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.95rem",marginBottom:8}}>{s.icon}</div>
            <div style={{fontWeight:800,fontSize:"1.2rem",color:"#0F172A",lineHeight:1,marginBottom:2}}>{s.value}</div>
            <div style={{fontSize:"0.72rem",fontWeight:600,color:"#475569",marginBottom:2}}>{s.label}</div>
            <div style={{fontSize:"0.68rem",color:"#94A3B8"}}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Recent Reviews */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <h3 style={{fontWeight:700,fontSize:"0.95rem",color:"#0F172A"}}>Recent Reviews</h3>
        <button onClick={()=>setTab("reviews")} style={{fontSize:"0.78rem",color:"#1D4ED8",fontWeight:700,background:"none",border:"none",cursor:"pointer"}}>View All</button>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:24}}>
        {MOCK_REVIEWS.map(rv=>(
          <div key={rv.id} style={{background:"#fff",borderRadius:14,border:"1px solid #E9EDF2",padding:"14px",boxShadow:"0 1px 4px rgba(15,23,42,0.04)"}}>
            <div style={{display:"flex",alignItems:"flex-start",gap:10,marginBottom:6}}>
              <Avatar initials={rv.initials} bg={rv.color} size={38}/>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{fontWeight:700,fontSize:"0.88rem",color:"#0F172A"}}>{rv.name}</span>
                  <button style={{background:"none",border:"none",cursor:"pointer",color:"#94A3B8",fontSize:"1rem"}}>⋯</button>
                </div>
                <Stars n={rv.rating} size={12}/>
                <span style={{fontSize:"0.72rem",color:"#94A3B8",marginLeft:4}}>{rv.date}</span>
              </div>
            </div>
            <p style={{fontSize:"0.82rem",color:"#475569",lineHeight:1.6,margin:0}}>{rv.text}</p>
          </div>
        ))}
      </div>
    </div>
  );

  // ── EDIT TAB ──────────────────────────────────────────────────────────────
  const EditTab=()=>(
    <div>
      {saved&&(
        <div style={{background:"#D1FAE5",border:"1px solid #6EE7B7",borderRadius:10,padding:"10px 14px",marginBottom:14,display:"flex",alignItems:"center",gap:8,fontSize:"0.83rem",fontWeight:700,color:"#065F46"}}>
          ✓ Garage updated successfully!
        </div>
      )}

      {/* Basic Information */}
      <Collapse icon="ℹ️" title="Basic Information">
        <FInput label="Garage Name"  value={form.name}    onChange={e=>setF("name",e.target.value)}/>
        <FInput label="Owner Name"   value={form.owner}   onChange={e=>setF("owner",e.target.value)}/>
        <FInput label="Phone Number" value={form.phone}   onChange={e=>setF("phone",e.target.value)} type="tel"/>
        <FInput label="Email"        value={form.email}   onChange={e=>setF("email",e.target.value)} type="email"/>
        <FSelect label="District"    value={form.district} onChange={e=>setF("district",e.target.value)} options={DISTRICTS}/>
        <FInput label="Address"      value={form.address} onChange={e=>setF("address",e.target.value)}/>
      </Collapse>

      {/* Garage Information */}
      <Collapse icon="🔧" title="Garage Information">
        <FTextarea label="Description" value={form.description} onChange={e=>setF("description",e.target.value)} rows={4}/>

        <label style={{display:"block",fontSize:"0.78rem",fontWeight:600,color:"#374151",marginBottom:8}}>Services Offered</label>
        <div style={{display:"flex",flexWrap:"wrap",gap:7,marginBottom:14}}>
          {ALL_SERVICES.map(s=>{
            const on=form.services.includes(s);
            return(
              <button key={s} onClick={()=>toggleSvc(s)} style={{
                display:"flex",alignItems:"center",gap:4,
                padding:"5px 11px",borderRadius:999,border:`1.5px solid ${on?"#1D4ED8":"#E2E8F0"}`,
                background:on?"#EFF6FF":"#F8FAFC",color:on?"#1D4ED8":"#64748B",
                fontSize:"0.75rem",fontWeight:on?700:500,cursor:"pointer",transition:"all 0.13s",
              }}>
                {on&&<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#1D4ED8" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
                {s}
              </button>
            );
          })}
        </div>

        <label style={{display:"block",fontSize:"0.78rem",fontWeight:600,color:"#374151",marginBottom:8}}>Vehicle Types</label>
        <div style={{display:"flex",flexWrap:"wrap",gap:7,marginBottom:4}}>
          {ALL_VEHICLES.map(v=>{
            const on=form.vehicles.includes(v);
            return(
              <button key={v} onClick={()=>toggleVeh(v)} style={{
                display:"flex",alignItems:"center",gap:4,
                padding:"5px 11px",borderRadius:999,border:`1.5px solid ${on?"#059669":"#E2E8F0"}`,
                background:on?"#D1FAE5":"#F8FAFC",color:on?"#065F46":"#64748B",
                fontSize:"0.75rem",fontWeight:on?700:500,cursor:"pointer",transition:"all 0.13s",
              }}>
                {on&&<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
                {v}
              </button>
            );
          })}
        </div>
      </Collapse>

      {/* Working Hours */}
      <Collapse icon="🕐" title="Working Hours">
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 14px"}}>
          <FInput label="Opening Time" type="time" value={form.openTime}  onChange={e=>setF("openTime",e.target.value)}/>
          <FInput label="Closing Time" type="time" value={form.closeTime} onChange={e=>setF("closeTime",e.target.value)}/>
        </div>
        {/* Day toggles */}
        <div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:4}}>
          {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d,i)=>{
            const fullDay=DAYS[i]; const on=form.hours[fullDay]!=="Closed"&&!!form.hours[fullDay];
            return(
              <button key={d} style={{
                width:40,height:36,borderRadius:8,border:`1.5px solid ${on?"#1D4ED8":"#E2E8F0"}`,
                background:on?"#1D4ED8":"#F8FAFC",color:on?"#fff":"#64748B",
                fontSize:"0.72rem",fontWeight:700,cursor:"pointer",
              }}>{d}</button>
            );
          })}
        </div>
        {/* Hours table preview */}
        <div style={{marginTop:14,background:"#F8FAFC",borderRadius:10,padding:"10px 12px",border:"1px solid #E9EDF2"}}>
          {Object.entries(MOCK.hours).map(([day,hours])=>(
            <div key={day} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:"1px solid #F1F5F9",fontSize:"0.78rem"}}>
              <span style={{color:"#475569",fontWeight:500}}>{day}</span>
              <span style={{color:hours==="Closed"?"#EF4444":"#059669",fontWeight:700}}>{hours}</span>
            </div>
          ))}
        </div>
      </Collapse>

      {/* Photos summary */}
      <Collapse icon="📷" title={`Photos (${photos.length}/${MAX_PHOTOS})`}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:8}}>
          {photos.slice(0,6).map((p,i)=>(
            <div key={p.id} style={{aspectRatio:"1",borderRadius:10,overflow:"hidden",position:"relative",border:p.cover?"2.5px solid #1D4ED8":"1.5px solid #E9EDF2"}}>
              <img src={p.url} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
              {p.cover&&<span style={{position:"absolute",bottom:3,left:3,background:"#1D4ED8",color:"#fff",fontSize:"0.55rem",fontWeight:800,padding:"1px 5px",borderRadius:999}}>COVER</span>}
            </div>
          ))}
        </div>
        <button onClick={()=>setTab("photos")} style={{width:"100%",padding:"9px",borderRadius:9,border:"1.5px solid #E2E8F0",background:"#F8FAFC",color:"#475569",fontSize:"0.82rem",fontWeight:600,cursor:"pointer"}}>
          Manage Photos →
        </button>
      </Collapse>

      {/* Status toggle */}
      <Collapse icon="🟢" title="Status">
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"4px 0"}}>
          <div>
            <div style={{fontWeight:600,fontSize:"0.88rem",color:"#0F172A"}}>{form.isOpen?"Open Now":"Closed"}</div>
            <div style={{fontSize:"0.75rem",color:"#94A3B8"}}>Toggle your garage's current status</div>
          </div>
          {/* Toggle switch */}
          <div onClick={()=>setF("isOpen",!form.isOpen)} style={{
            width:48,height:26,borderRadius:999,
            background:form.isOpen?"#059669":"#CBD5E1",
            position:"relative",cursor:"pointer",transition:"background 0.25s",flexShrink:0,
          }}>
            <div style={{
              position:"absolute",top:3,left:form.isOpen?"calc(100% - 23px)":3,
              width:20,height:20,borderRadius:"50%",background:"#fff",
              transition:"left 0.25s",boxShadow:"0 1px 4px rgba(0,0,0,0.2)",
            }}/>
          </div>
        </div>
      </Collapse>

      {/* Save button */}
      <button onClick={handleSave} disabled={saving} style={{
        width:"100%",padding:"15px",borderRadius:13,border:"none",
        background:saving?"#93C5FD":"#1D4ED8",
        color:"#fff",fontSize:"1rem",fontWeight:800,
        cursor:saving?"not-allowed":"pointer",
        display:"flex",alignItems:"center",justifyContent:"center",gap:8,
        boxShadow:"0 4px 18px rgba(29,78,216,0.28)",marginTop:8,
        fontFamily:"inherit",transition:"all 0.2s",
      }}>
        {saving
          ?<><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" style={{animation:"spin 0.8s linear infinite"}}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>Saving…</>
          :"Update Garage"
        }
      </button>
    </div>
  );

  // ── PHOTOS TAB ────────────────────────────────────────────────────────────
  const PhotosTab=()=>(
    <div>
      {/* Upload zone */}
      <div
        onDragOver={e=>{e.preventDefault();setDragOver(true);}}
        onDragLeave={()=>setDragOver(false)}
        onDrop={e=>{e.preventDefault();setDragOver(false);addPhotos(e.dataTransfer.files);}}
        onClick={()=>photos.length<MAX_PHOTOS&&fileRef.current?.click()}
        style={{
          border:`2px dashed ${dragOver?"#1D4ED8":"#BFDBFE"}`,
          borderRadius:14,padding:"24px 16px",textAlign:"center",
          background:dragOver?"#EFF6FF":"#FAFBFF",
          cursor:photos.length<MAX_PHOTOS?"pointer":"not-allowed",
          marginBottom:16,transition:"all 0.2s",
        }}>
        <div style={{fontSize:"1.8rem",marginBottom:6}}>📤</div>
        <p style={{fontWeight:700,color:"#334155",fontSize:"0.88rem",marginBottom:3}}>
          {photos.length>=MAX_PHOTOS?"Maximum 10 photos reached":dragOver?"Drop here!":"Upload Photos"}
        </p>
        <p style={{fontSize:"0.75rem",color:"#94A3B8",marginBottom:photos.length<MAX_PHOTOS?10:0}}>Tap to browse · JPG, PNG · Max 5MB</p>
        {photos.length<MAX_PHOTOS&&(
          <span style={{display:"inline-block",padding:"7px 18px",borderRadius:8,background:"#1D4ED8",color:"#fff",fontSize:"0.78rem",fontWeight:700}}>Choose Photos</span>
        )}
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginTop:10}}>
          <div style={{width:100,height:4,background:"#E2E8F0",borderRadius:999,overflow:"hidden"}}>
            <div style={{height:"100%",width:`${(photos.length/MAX_PHOTOS)*100}%`,background:"#1D4ED8",borderRadius:999,transition:"width 0.3s"}}/>
          </div>
          <span style={{fontSize:"0.73rem",fontWeight:700,color:"#64748B"}}>{photos.length}/{MAX_PHOTOS}</span>
        </div>
        <input ref={fileRef} type="file" accept="image/*" multiple style={{display:"none"}}
          onChange={e=>{addPhotos(e.target.files);e.target.value="";}}/>
      </div>

      {/* Grid */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
        {photos.map((p,i)=>(
          <div key={p.id} style={{position:"relative",aspectRatio:"1",borderRadius:12,overflow:"hidden",border:p.cover?"2.5px solid #1D4ED8":"1.5px solid #E9EDF2"}}>
            <img src={p.url} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
            {p.cover&&<div style={{position:"absolute",top:4,left:4,background:"#1D4ED8",color:"#fff",fontSize:"0.55rem",fontWeight:800,padding:"2px 7px",borderRadius:999}}>⭐ COVER</div>}
            <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:4,opacity:0,transition:"all 0.2s"}}
              onMouseEnter={e=>{e.currentTarget.style.background="rgba(0,0,0,0.45)";e.currentTarget.style.opacity=1;}}
              onMouseLeave={e=>{e.currentTarget.style.background="rgba(0,0,0,0)";e.currentTarget.style.opacity=0;}}>
              {!p.cover&&<button onClick={()=>setCover(p.id)} style={{background:"rgba(255,255,255,0.2)",border:"1px solid rgba(255,255,255,0.4)",color:"#fff",fontSize:"0.65rem",fontWeight:700,padding:"3px 8px",borderRadius:6,cursor:"pointer"}}>Set Cover</button>}
              <button onClick={()=>delPhoto(p.id)} style={{background:"rgba(239,68,68,0.85)",border:"none",color:"#fff",fontSize:"0.65rem",fontWeight:700,padding:"3px 8px",borderRadius:6,cursor:"pointer"}}>Delete</button>
            </div>
            <div style={{position:"absolute",bottom:4,right:4,background:"rgba(0,0,0,0.5)",color:"#fff",fontSize:"0.6rem",fontWeight:700,padding:"1px 6px",borderRadius:999}}>{i+1}</div>
          </div>
        ))}
      </div>
      <p style={{fontSize:"0.73rem",color:"#94A3B8",textAlign:"center",marginTop:10}}>Tap a photo to set as cover or delete</p>
    </div>
  );

  // ── REVIEWS TAB ───────────────────────────────────────────────────────────
  const ReviewsTab=()=>{
    const avg=(MOCK_REVIEWS.reduce((s,r)=>s+r.rating,0)/MOCK_REVIEWS.length).toFixed(1);
    return(
      <div>
        {/* Summary */}
        <div style={{background:"#fff",borderRadius:14,border:"1px solid #E9EDF2",padding:"18px",marginBottom:14,display:"flex",gap:16,alignItems:"center"}}>
          <div style={{textAlign:"center",flexShrink:0}}>
            <div style={{fontWeight:800,fontSize:"2.4rem",color:"#0F172A",lineHeight:1}}>{avg}</div>
            <Stars n={5} size={14}/>
            <div style={{fontSize:"0.72rem",color:"#94A3B8",marginTop:3}}>{MOCK.reviews} reviews</div>
          </div>
          <div style={{flex:1}}>
            {[5,4,3,2,1].map(s=>{
              const c=MOCK_REVIEWS.filter(r=>r.rating===s).length;
              const pct=MOCK.reviews?Math.round((c/MOCK.reviews)*100):0;
              return(
                <div key={s} style={{display:"flex",alignItems:"center",gap:6,marginBottom:5}}>
                  <span style={{fontSize:"0.72rem",color:"#64748B",width:8}}>{s}</span>
                  <span style={{color:"#F59E0B",fontSize:"0.7rem"}}>★</span>
                  <div style={{flex:1,height:6,background:"#F1F5F9",borderRadius:999,overflow:"hidden"}}>
                    <div style={{height:"100%",width:`${pct}%`,background:s>=4?"#1D4ED8":s===3?"#F59E0B":"#EF4444",borderRadius:999}}/>
                  </div>
                  <span style={{fontSize:"0.68rem",color:"#94A3B8",width:20,textAlign:"right"}}>{c}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Review list */}
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {MOCK_REVIEWS.map(rv=>(
            <div key={rv.id} style={{background:"#fff",borderRadius:14,border:"1px solid #E9EDF2",padding:"14px",boxShadow:"0 1px 4px rgba(15,23,42,0.04)"}}>
              <div style={{display:"flex",alignItems:"flex-start",gap:10,marginBottom:8}}>
                <Avatar initials={rv.initials} bg={rv.color} size={38}/>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                    <div>
                      <div style={{fontWeight:700,fontSize:"0.88rem",color:"#0F172A"}}>{rv.name}</div>
                      <div style={{display:"flex",alignItems:"center",gap:5}}>
                        <Stars n={rv.rating} size={11}/>
                        <span style={{fontSize:"0.7rem",color:"#94A3B8"}}>{rv.date}</span>
                      </div>
                    </div>
                    <button style={{background:"none",border:"none",cursor:"pointer",color:"#94A3B8",fontSize:"1rem"}}>⋯</button>
                  </div>
                </div>
              </div>
              <p style={{fontSize:"0.83rem",color:"#475569",lineHeight:1.6,margin:0}}>{rv.text}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ── MORE TAB ──────────────────────────────────────────────────────────────
  const MoreTab=()=>(
    <div>
      {/* Profile card */}
      <div style={{background:"linear-gradient(135deg,#0F172A,#1E3A8A)",borderRadius:16,padding:"20px",marginBottom:16}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
          <div style={{width:48,height:48,borderRadius:13,background:"linear-gradient(135deg,#1D4ED8,#059669)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.3rem"}}>🔧</div>
          <div>
            <div style={{fontWeight:700,color:"#fff",fontSize:"0.95rem"}}>{form.name}</div>
            <div style={{fontSize:"0.75rem",color:"#64748B"}}>{form.district}</div>
          </div>
          <span style={{marginLeft:"auto",background:"rgba(234,88,12,0.2)",color:"#FED7AA",fontSize:"0.7rem",fontWeight:700,padding:"3px 9px",borderRadius:999,border:"1px solid rgba(234,88,12,0.3)"}}>FREE TRIAL</span>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,textAlign:"center"}}>
          {[{v:"4.8",l:"Rating"},{v:"128",l:"Reviews"},{v:`${photos.length}`,l:"Photos"}].map(s=>(
            <div key={s.l} style={{background:"rgba(255,255,255,0.08)",borderRadius:9,padding:"8px 4px"}}>
              <div style={{fontWeight:800,color:"#fff",fontSize:"1.1rem"}}>{s.v}</div>
              <div style={{fontSize:"0.68rem",color:"#64748B"}}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Settings items */}
      {[
        {icon:"👁️", label:"View Public Listing",  action:()=>navigate("/garage/1"),     color:"#1D4ED8"},
        {icon:"👑", label:"Upgrade to Pro — $10/mo",action:()=>{},                       color:"#EA580C"},
        {icon:"📞", label:"Contact Support",        action:()=>{},                       color:"#059669"},
        {icon:"🔒", label:"Change Password",        action:()=>{},                       color:"#7C3AED"},
        {icon:"🚪", label:"Sign Out",               action:()=>navigate("/login"),        color:"#EF4444"},
      ].map((item,i)=>(
        <button key={i} onClick={item.action} style={{
          width:"100%",display:"flex",alignItems:"center",gap:12,
          padding:"14px 16px",borderRadius:12,border:"1px solid #E9EDF2",
          background:"#fff",cursor:"pointer",marginBottom:8,textAlign:"left",
          boxShadow:"0 1px 3px rgba(15,23,42,0.04)",
          fontFamily:"inherit",
        }}
        onMouseEnter={e=>{e.currentTarget.style.background="#F8FAFC";}}
        onMouseLeave={e=>{e.currentTarget.style.background="#fff";}}>
          <div style={{width:36,height:36,borderRadius:10,background:`${item.color}15`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1rem",flexShrink:0}}>
            {item.icon}
          </div>
          <span style={{flex:1,fontWeight:600,fontSize:"0.88rem",color:item.color==="EF4444"?"#EF4444":"#0F172A"}}>{item.label}</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      ))}
    </div>
  );

  const CONTENT={dashboard:<DashboardTab/>,edit:<EditTab/>,photos:<PhotosTab/>,reviews:<ReviewsTab/>,more:<MoreTab/>};
  const PAGE_TITLES={dashboard:"Dashboard",edit:"Edit Garage",photos:"Photos",reviews:"Reviews",more:"More"};

  // ─── RENDER ───────────────────────────────────────────────────────────────
  return(
    <div style={{minHeight:"100vh",background:"#F0F4F8",fontFamily:"'DM Sans',system-ui,sans-serif",maxWidth:480,margin:"0 auto",position:"relative"}}>

      {/* ── HEADER ── */}
      <header style={{
        background:"#fff",position:"sticky",top:0,zIndex:200,
        borderBottom:"1px solid #E9EDF2",
        boxShadow:"0 1px 4px rgba(15,23,42,0.06)",
      }}>
        <div style={{display:"flex",alignItems:"center",padding:"0 16px",height:56}}>
          {tab!=="dashboard"
            ? <button onClick={()=>setTab("dashboard")} style={{background:"none",border:"none",cursor:"pointer",marginRight:10,display:"flex",alignItems:"center",justifyContent:"center",width:32,height:32,borderRadius:8}}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
              </button>
            : <button style={{background:"none",border:"none",cursor:"pointer",marginRight:10,display:"flex",alignItems:"center",justifyContent:"center",width:32,height:32}}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2.2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
              </button>
          }
          <span style={{flex:1,fontWeight:800,fontSize:"1.05rem",color:"#0F172A",letterSpacing:"-0.01em"}}>
            {tab==="dashboard"
              ? <><span style={{color:"#1D4ED8"}}>Garage</span>Hub</>
              : PAGE_TITLES[tab]
            }
          </span>
          <button style={{background:"none",border:"none",cursor:"pointer",position:"relative",padding:4}}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2" strokeLinecap="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            <span style={{position:"absolute",top:2,right:2,width:8,height:8,borderRadius:"50%",background:"#EF4444",border:"1.5px solid #fff"}}/>
          </button>
        </div>
      </header>

      {/* ── CONTENT ── */}
      <div style={{padding:"16px 14px 90px"}}>
        {CONTENT[tab]}
      </div>

      {/* ── BOTTOM TAB BAR ── */}
      <nav style={{
        position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",
        width:"100%",maxWidth:480,
        background:"#fff",
        borderTop:"1px solid #E9EDF2",
        display:"flex",
        zIndex:300,
        boxShadow:"0 -4px 20px rgba(15,23,42,0.08)",
        paddingBottom:"env(safe-area-inset-bottom,0px)",
      }}>
        {TABS.map(t=>{
          const isActive=tab===t.id;
          return(
            <button key={t.id} onClick={()=>setTab(t.id)} style={{
              flex:1,display:"flex",flexDirection:"column",
              alignItems:"center",justifyContent:"center",
              gap:3,padding:"10px 4px 12px",
              border:"none",background:"none",cursor:"pointer",
              position:"relative",
            }}>
              {isActive&&<span style={{position:"absolute",top:0,left:"50%",transform:"translateX(-50%)",width:24,height:3,borderRadius:"0 0 3px 3px",background:"#1D4ED8"}}/>}
              {t.icon(isActive)}
              <span style={{fontSize:"0.6rem",fontWeight:isActive?700:500,color:isActive?"#1D4ED8":"#94A3B8",letterSpacing:"0.01em"}}>{t.label}</span>
            </button>
          );
        })}
      </nav>

      <style>{`
        @keyframes spin { to{transform:rotate(360deg)} }
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
      `}</style>
    </div>
  );
}
