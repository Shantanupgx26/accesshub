import { useState, useEffect, createContext, useContext } from "react";

// ── Auth Context ──────────────────────────────────────────────────────────────
const AuthContext = createContext(null);
const useAuth = () => useContext(AuthContext);

const USERS = {
  admin: { id: 1, name: "Alex Rivera", role: "admin", email: "alex@accesshub.io", avatar: "AR", dept: "Engineering" },
  user:  { id: 2, name: "Jordan Lee",  role: "user",  email: "jordan@accesshub.io", avatar: "JL", dept: "Marketing" },
};

// ── Fake API ──────────────────────────────────────────────────────────────────
const fakeLogin = (username, password) =>
  new Promise((res, rej) =>
    setTimeout(() => {
      const u = USERS[username];
      if (u && password === "password") res({ token: `tok_${Date.now()}`, user: u });
      else rej(new Error("Invalid credentials"));
    }, 900)
  );

// ── Icons (SVG inline) ────────────────────────────────────────────────────────
const Icon = ({ d, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);
const Icons = {
  shield:   "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  lock:     "M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2zM7 11V7a5 5 0 0110 0v4",
  unlock:   "M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2zM7 11V7a5 5 0 019.9-1",
  users:    "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75M9 7a4 4 0 100 8 4 4 0 000-8z",
  activity: "M22 12h-4l-3 9L9 3l-3 9H2",
  settings: "M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z",
  logout:   "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9",
  key:      "M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4",
  chart:    "M18 20V10M12 20V4M6 20v-6",
  bell:     "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0",
  check:    "M20 6L9 17l-5-5",
  x:        "M18 6L6 18M6 6l12 12",
  eye:      "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 100 6 3 3 0 000-6z",
  eyeOff:   "M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22",
  home:     "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
  db:       "M4 6c0 1.66 3.58 3 8 3s8-1.34 8-3M4 6c0-1.66 3.58-3 8-3s8 1.34 8 3M4 6v6c0 1.66 3.58 3 8 3s8-1.34 8-3V6M4 12v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6",
};

// ── Styles ────────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:        #080c12;
    --surface:   #0d1420;
    --surface2:  #111827;
    --border:    rgba(99,132,255,0.12);
    --border2:   rgba(99,132,255,0.22);
    --accent:    #6384ff;
    --accent2:   #a78bfa;
    --danger:    #f87171;
    --success:   #34d399;
    --warn:      #fbbf24;
    --text:      #e2e8f0;
    --muted:     #64748b;
    --glow:      rgba(99,132,255,0.18);
  }

  body { background: var(--bg); color: var(--text); font-family: 'Syne', sans-serif; min-height: 100vh; }

  /* ── Login ── */
  .login-wrap {
    min-height: 100vh; display: flex; align-items: center; justify-content: center;
    background: radial-gradient(ellipse 80% 60% at 50% 0%, rgba(99,132,255,0.12) 0%, transparent 70%),
                radial-gradient(ellipse 40% 40% at 80% 80%, rgba(167,139,250,0.07) 0%, transparent 60%),
                var(--bg);
    padding: 2rem;
    position: relative;
    overflow: hidden;
  }
  .login-grid {
    position: absolute; inset: 0;
    background-image: linear-gradient(var(--border) 1px, transparent 1px),
                      linear-gradient(90deg, var(--border) 1px, transparent 1px);
    background-size: 48px 48px;
    mask-image: radial-gradient(ellipse 70% 70% at 50% 50%, black 40%, transparent 100%);
  }
  .login-card {
    width: 100%; max-width: 420px; position: relative; z-index: 1;
    background: var(--surface); border: 1px solid var(--border2);
    border-radius: 20px; padding: 2.5rem;
    box-shadow: 0 0 0 1px rgba(99,132,255,0.06), 0 32px 80px rgba(0,0,0,0.5),
                inset 0 1px 0 rgba(255,255,255,0.06);
    animation: slideUp .5s cubic-bezier(.22,1,.36,1);
  }
  @keyframes slideUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }

  .login-logo { display: flex; align-items: center; gap: .7rem; margin-bottom: 2rem; }
  .logo-icon {
    width: 40px; height: 40px; background: linear-gradient(135deg, var(--accent), var(--accent2));
    border-radius: 10px; display: flex; align-items: center; justify-content: center;
    color: white; box-shadow: 0 0 20px var(--glow);
  }
  .logo-name { font-size: 1.4rem; font-weight: 800; letter-spacing: -.02em; }
  .logo-tag { font-size: .65rem; font-family: 'JetBrains Mono', monospace; color: var(--accent); letter-spacing: .12em; text-transform: uppercase; margin-top: 1px; }

  .login-title { font-size: 1.5rem; font-weight: 700; margin-bottom: .4rem; }
  .login-sub { font-size: .875rem; color: var(--muted); margin-bottom: 2rem; }

  .field { margin-bottom: 1.2rem; }
  .field label { display: block; font-size: .78rem; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: var(--muted); margin-bottom: .5rem; }
  .input-wrap { position: relative; }
  .input-wrap input {
    width: 100%; background: var(--bg); border: 1px solid var(--border2);
    border-radius: 10px; padding: .75rem 1rem; color: var(--text);
    font-family: 'JetBrains Mono', monospace; font-size: .9rem;
    outline: none; transition: border .2s, box-shadow .2s;
  }
  .input-wrap input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(99,132,255,0.15); }
  .input-wrap .eye-btn {
    position: absolute; right: .8rem; top: 50%; transform: translateY(-50%);
    background: none; border: none; color: var(--muted); cursor: pointer; padding: .2rem;
    transition: color .2s;
  }
  .input-wrap .eye-btn:hover { color: var(--text); }

  .demo-pills { display: flex; gap: .5rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
  .pill {
    font-size: .72rem; font-family: 'JetBrains Mono', monospace;
    padding: .3rem .7rem; border-radius: 6px; border: 1px solid var(--border2);
    background: var(--surface2); color: var(--muted); cursor: pointer;
    transition: all .2s; display: flex; align-items: center; gap: .4rem;
  }
  .pill:hover { border-color: var(--accent); color: var(--accent); }
  .pill .dot { width: 6px; height: 6px; border-radius: 50%; }
  .pill .dot.admin { background: var(--accent); }
  .pill .dot.user  { background: var(--success); }

  .btn-primary {
    width: 100%; background: linear-gradient(135deg, var(--accent), var(--accent2));
    color: white; font-family: 'Syne', sans-serif; font-weight: 700; font-size: .9rem;
    border: none; border-radius: 10px; padding: .85rem;
    cursor: pointer; position: relative; overflow: hidden;
    transition: opacity .2s, transform .1s;
    letter-spacing: .02em;
  }
  .btn-primary:hover:not(:disabled) { opacity: .9; }
  .btn-primary:active:not(:disabled) { transform: scale(.99); }
  .btn-primary:disabled { opacity: .5; cursor: default; }
  .btn-primary .spinner { display: inline-block; width: 14px; height: 14px; border: 2px solid rgba(255,255,255,.3); border-top-color: white; border-radius: 50%; animation: spin .6s linear infinite; margin-right: .5rem; vertical-align: middle; }
  @keyframes spin { to { transform: rotate(360deg); } }

  .error-msg { background: rgba(248,113,113,.1); border: 1px solid rgba(248,113,113,.3); color: var(--danger); font-size: .82rem; padding: .6rem .9rem; border-radius: 8px; margin-bottom: 1rem; display: flex; align-items: center; gap: .5rem; }

  /* ── Layout ── */
  .app { display: flex; min-height: 100vh; }

  .sidebar {
    width: 240px; flex-shrink: 0; background: var(--surface);
    border-right: 1px solid var(--border); display: flex; flex-direction: column;
    padding: 1.5rem 1rem; position: fixed; top: 0; bottom: 0; left: 0;
    transition: transform .3s cubic-bezier(.22,1,.36,1);
    z-index: 100;
  }
  .sidebar-logo { display: flex; align-items: center; gap: .6rem; padding: .5rem .5rem 1.5rem; }
  .sidebar-logo .logo-icon { width: 34px; height: 34px; border-radius: 8px; font-size: 14px; }
  .sidebar-logo .name { font-size: 1.1rem; font-weight: 800; letter-spacing: -.02em; }

  .nav-section { margin-bottom: 1.5rem; }
  .nav-label { font-size: .62rem; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: var(--muted); padding: 0 .5rem; margin-bottom: .5rem; }
  .nav-item {
    display: flex; align-items: center; gap: .7rem;
    padding: .6rem .75rem; border-radius: 8px; color: var(--muted);
    cursor: pointer; font-size: .875rem; font-weight: 500; transition: all .15s;
    border: 1px solid transparent; margin-bottom: 2px;
  }
  .nav-item:hover { color: var(--text); background: rgba(255,255,255,.04); }
  .nav-item.active { color: var(--accent); background: rgba(99,132,255,.1); border-color: rgba(99,132,255,.2); }
  .nav-item .badge { margin-left: auto; background: var(--accent); color: white; font-size: .65rem; font-weight: 700; padding: .1rem .45rem; border-radius: 20px; }
  .nav-item .badge.warn { background: var(--warn); color: #000; }

  .sidebar-footer { margin-top: auto; }
  .user-card {
    display: flex; align-items: center; gap: .7rem;
    padding: .7rem .75rem; border-radius: 10px;
    background: var(--surface2); border: 1px solid var(--border);
    margin-bottom: .75rem;
  }
  .avatar { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: .7rem; font-weight: 700; flex-shrink: 0; }
  .avatar.admin { background: linear-gradient(135deg, var(--accent), var(--accent2)); color: white; }
  .avatar.user  { background: linear-gradient(135deg, var(--success), #059669); color: white; }
  .user-info .uname { font-size: .82rem; font-weight: 600; }
  .user-info .urole { font-size: .68rem; color: var(--muted); font-family: 'JetBrains Mono', monospace; }
  .role-badge { margin-left: auto; font-size: .62rem; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; padding: .15rem .5rem; border-radius: 4px; }
  .role-badge.admin { background: rgba(99,132,255,.15); color: var(--accent); border: 1px solid rgba(99,132,255,.25); }
  .role-badge.user  { background: rgba(52,211,153,.12); color: var(--success); border: 1px solid rgba(52,211,153,.25); }
  .logout-btn { display: flex; align-items: center; gap: .6rem; width: 100%; background: none; border: 1px solid var(--border); border-radius: 8px; padding: .6rem .75rem; color: var(--muted); font-family: 'Syne', sans-serif; font-size: .82rem; cursor: pointer; transition: all .15s; }
  .logout-btn:hover { color: var(--danger); border-color: rgba(248,113,113,.35); background: rgba(248,113,113,.06); }

  /* ── Main ── */
  .main { margin-left: 240px; flex: 1; padding: 2rem; min-height: 100vh; background:
    radial-gradient(ellipse 60% 40% at 80% 0%, rgba(99,132,255,0.055) 0%, transparent 60%);
  }

  .topbar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 2rem; }
  .page-title { font-size: 1.5rem; font-weight: 800; letter-spacing: -.02em; }
  .page-sub { font-size: .82rem; color: var(--muted); margin-top: .2rem; }
  .topbar-right { display: flex; align-items: center; gap: .75rem; }
  .icon-btn { width: 36px; height: 36px; border-radius: 8px; background: var(--surface); border: 1px solid var(--border); color: var(--muted); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all .15s; }
  .icon-btn:hover { color: var(--text); border-color: var(--border2); }
  .notif-dot { position: relative; }
  .notif-dot::after { content:''; position:absolute; top:6px; right:6px; width:6px; height:6px; background:var(--accent); border-radius:50%; border: 1.5px solid var(--surface); }

  /* ── Stats grid ── */
  .stats { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.75rem; }
  .stat-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 14px; padding: 1.25rem;
    transition: border-color .2s, box-shadow .2s;
    animation: fadeIn .4s ease both;
  }
  .stat-card:hover { border-color: var(--border2); box-shadow: 0 0 20px var(--glow); }
  @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
  .stat-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: .9rem; }
  .stat-icon { width: 34px; height: 34px; border-radius: 8px; display: flex; align-items: center; justify-content: center; }
  .stat-icon.blue   { background: rgba(99,132,255,.15); color: var(--accent); }
  .stat-icon.purple { background: rgba(167,139,250,.15); color: var(--accent2); }
  .stat-icon.green  { background: rgba(52,211,153,.12); color: var(--success); }
  .stat-icon.amber  { background: rgba(251,191,36,.12); color: var(--warn); }
  .stat-delta { font-size: .7rem; font-family: 'JetBrains Mono', monospace; padding: .15rem .5rem; border-radius: 4px; }
  .stat-delta.up   { background: rgba(52,211,153,.12); color: var(--success); }
  .stat-delta.down { background: rgba(248,113,113,.1); color: var(--danger); }
  .stat-val { font-size: 1.8rem; font-weight: 800; letter-spacing: -.04em; margin-bottom: .15rem; }
  .stat-label { font-size: .75rem; color: var(--muted); font-weight: 500; }

  /* ── Cards ── */
  .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem; }
  .card { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 1.5rem; animation: fadeIn .5s ease both; }
  .card-title { font-size: .8rem; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--muted); margin-bottom: 1.2rem; display: flex; align-items: center; justify-content: space-between; }
  .card-badge { font-size: .65rem; padding: .2rem .55rem; border-radius: 5px; font-weight: 600; }
  .card-badge.admin-only { background: rgba(99,132,255,.12); color: var(--accent); border: 1px solid rgba(99,132,255,.2); }
  .card-badge.all-roles  { background: rgba(52,211,153,.1); color: var(--success); border: 1px solid rgba(52,211,153,.2); }

  /* ── Activity ── */
  .activity-list { list-style: none; display: flex; flex-direction: column; gap: .7rem; }
  .activity-item { display: flex; align-items: flex-start; gap: .85rem; }
  .act-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; margin-top: .35rem; }
  .act-dot.green  { background: var(--success); box-shadow: 0 0 6px var(--success); }
  .act-dot.blue   { background: var(--accent);  box-shadow: 0 0 6px var(--accent);  }
  .act-dot.amber  { background: var(--warn);    box-shadow: 0 0 6px var(--warn);    }
  .act-dot.red    { background: var(--danger);  box-shadow: 0 0 6px var(--danger);  }
  .act-text { font-size: .82rem; color: var(--text); }
  .act-time { font-size: .7rem; color: var(--muted); font-family: 'JetBrains Mono', monospace; margin-top: .1rem; }

  /* ── Users table ── */
  .table-wrap { overflow-x: auto; }
  table { width: 100%; border-collapse: collapse; font-size: .82rem; }
  thead th { text-align: left; font-size: .68rem; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--muted); padding: .5rem .75rem; border-bottom: 1px solid var(--border); }
  tbody td { padding: .75rem; border-bottom: 1px solid rgba(99,132,255,.06); vertical-align: middle; }
  tbody tr:last-child td { border-bottom: none; }
  tbody tr:hover td { background: rgba(255,255,255,.02); }
  .td-user { display: flex; align-items: center; gap: .65rem; }
  .td-badge { font-size: .65rem; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; padding: .18rem .55rem; border-radius: 5px; }
  .td-badge.admin { background: rgba(99,132,255,.12); color: var(--accent); border: 1px solid rgba(99,132,255,.2); }
  .td-badge.user  { background: rgba(52,211,153,.1); color: var(--success); border: 1px solid rgba(52,211,153,.2); }
  .td-status { display: flex; align-items: center; gap: .45rem; }
  .td-status .dot { width: 6px; height: 6px; border-radius: 50%; }
  .dot-active   { background: var(--success); box-shadow: 0 0 5px var(--success); }
  .dot-inactive { background: var(--muted); }

  /* ── Token panel ── */
  .token-box { background: var(--bg); border: 1px solid var(--border); border-radius: 10px; padding: 1rem; font-family: 'JetBrains Mono', monospace; font-size: .75rem; color: var(--accent); word-break: break-all; line-height: 1.6; }
  .token-row { display: flex; justify-content: space-between; margin-bottom: .5rem; }
  .token-key { color: var(--muted); }
  .token-val { color: var(--text); }

  /* ── Access denied ── */
  .denied {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    min-height: 60vh; text-align: center; gap: 1rem;
    animation: fadeIn .4s ease;
  }
  .denied-icon { width: 72px; height: 72px; background: rgba(248,113,113,.1); border: 1px solid rgba(248,113,113,.25); border-radius: 20px; display: flex; align-items: center; justify-content: center; color: var(--danger); margin-bottom: .5rem; }
  .denied h2 { font-size: 1.5rem; font-weight: 800; }
  .denied p { color: var(--muted); font-size: .875rem; max-width: 300px; }

  /* ── Tabs ── */
  .tabs { display: flex; gap: .4rem; margin-bottom: 1.5rem; border-bottom: 1px solid var(--border); padding-bottom: .5rem; }
  .tab { background: none; border: none; font-family: 'Syne', sans-serif; font-size: .82rem; font-weight: 600; color: var(--muted); cursor: pointer; padding: .4rem .75rem; border-radius: 6px; transition: all .15s; }
  .tab:hover { color: var(--text); }
  .tab.active { color: var(--accent); background: rgba(99,132,255,.1); }

  /* ── Scrollbar ── */
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 3px; }

  @media (max-width: 768px) {
    .sidebar { transform: translateX(-100%); }
    .main { margin-left: 0; padding: 1.2rem; }
    .grid2 { grid-template-columns: 1fr; }
    .stats { grid-template-columns: 1fr 1fr; }
  }
`;

// ── Data ──────────────────────────────────────────────────────────────────────
const STATS_ADMIN = [
  { label: "Total Users",    val: "2,481",  delta: "+12%",  dir: "up",   icon: "users",    cls: "blue"   },
  { label: "Active Sessions",val: "347",    delta: "+5%",   dir: "up",   icon: "activity", cls: "purple" },
  { label: "Access Tokens",  val: "1,204",  delta: "-2%",   dir: "down", icon: "key",      cls: "amber"  },
  { label: "Uptime",         val: "99.97%", delta: "+0.1%", dir: "up",   icon: "shield",   cls: "green"  },
];
const STATS_USER = [
  { label: "My Sessions",    val: "12",    delta: "+2",   dir: "up",  icon: "activity", cls: "blue"   },
  { label: "Token Expiry",   val: "23h",   delta: null,   dir: null,  icon: "key",      cls: "amber"  },
  { label: "Permissions",    val: "4 / 10",delta: null,   dir: null,  icon: "lock",     cls: "purple" },
  { label: "Last Login",     val: "2m ago",delta: null,   dir: null,  icon: "shield",   cls: "green"  },
];
const ACTIVITY = [
  { dot: "green", text: "User jordan@accesshub.io authenticated successfully", time: "2 min ago" },
  { dot: "blue",  text: "Token refresh issued for session #88A2",               time: "14 min ago" },
  { dot: "amber", text: "Failed login attempt from IP 192.168.4.21",           time: "31 min ago" },
  { dot: "green", text: "Admin alex@accesshub.io updated role permissions",    time: "1 hr ago"  },
  { dot: "red",   text: "Session #77B1 expired and terminated",                time: "2 hr ago"  },
  { dot: "blue",  text: "New user onboarded: sam@accesshub.io",                time: "3 hr ago"  },
];
const USERS_TABLE = [
  { name: "Alex Rivera",  email: "alex@accesshub.io",   role: "admin", status: "active",   dept: "Engineering" },
  { name: "Jordan Lee",   email: "jordan@accesshub.io", role: "user",  status: "active",   dept: "Marketing"   },
  { name: "Sam Chen",     email: "sam@accesshub.io",    role: "user",  status: "active",   dept: "Design"      },
  { name: "Taylor Moss",  email: "taylor@accesshub.io", role: "user",  status: "inactive", dept: "Sales"       },
  { name: "Morgan Blake", email: "morgan@accesshub.io", role: "admin", status: "active",   dept: "Security"    },
];

// ── Components ────────────────────────────────────────────────────────────────
function LoginPage({ onLogin }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fill = (u) => setForm({ username: u, password: "password" });

  const submit = async () => {
    setError(""); setLoading(true);
    try {
      const { token, user } = await fakeLogin(form.username, form.password);
      onLogin(token, user);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrap">
      <div className="login-grid" />
      <div className="login-card">
        <div className="login-logo">
          <div className="logo-icon"><Icon d={Icons.shield} size={18} /></div>
          <div>
            <div className="logo-name">AccessHub</div>
            <div className="logo-tag">Auth Platform</div>
          </div>
        </div>

        <div className="login-title">Welcome back</div>
        <div className="login-sub">Sign in to your secured dashboard</div>

        <div className="demo-pills">
          <div className="pill" onClick={() => fill("admin")}>
            <span className="dot admin" />admin / password
          </div>
          <div className="pill" onClick={() => fill("user")}>
            <span className="dot user" />user / password
          </div>
        </div>

        {error && (
          <div className="error-msg">
            <Icon d={Icons.x} size={14} /> {error}
          </div>
        )}

        <div className="field">
          <label>Username</label>
          <div className="input-wrap">
            <input
              value={form.username} placeholder="admin or user"
              onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
              onKeyDown={e => e.key === "Enter" && submit()}
            />
          </div>
        </div>

        <div className="field">
          <label>Password</label>
          <div className="input-wrap">
            <input
              type={show ? "text" : "password"}
              value={form.password} placeholder="••••••••"
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              onKeyDown={e => e.key === "Enter" && submit()}
              style={{ paddingRight: "2.5rem" }}
            />
            <button className="eye-btn" onClick={() => setShow(s => !s)}>
              <Icon d={show ? Icons.eyeOff : Icons.eye} size={15} />
            </button>
          </div>
        </div>

        <button className="btn-primary" onClick={submit} disabled={loading || !form.username || !form.password}>
          {loading && <span className="spinner" />}
          {loading ? "Authenticating…" : "Sign In"}
        </button>
      </div>
    </div>
  );
}

function Sidebar({ active, setActive, user, onLogout }) {
  const isAdmin = user.role === "admin";
  const navAll = [
    { id: "dashboard", icon: Icons.home,     label: "Dashboard" },
    { id: "activity",  icon: Icons.activity, label: "Activity Log", badge: "6" },
    { id: "tokens",    icon: Icons.key,       label: "My Token" },
    { id: "settings",  icon: Icons.settings,  label: "Settings" },
  ];
  const navAdmin = [
    { id: "users",   icon: Icons.users, label: "User Management", badge: "5" },
    { id: "system",  icon: Icons.db,    label: "System Monitor",  badge: "!", badgeCls: "warn" },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon" style={{ width:34,height:34,borderRadius:8,background:"linear-gradient(135deg,#6384ff,#a78bfa)",display:"flex",alignItems:"center",justifyContent:"center",color:"white" }}>
          <Icon d={Icons.shield} size={15} />
        </div>
        <span className="name">AccessHub</span>
      </div>

      <div className="nav-section">
        <div className="nav-label">Navigation</div>
        {navAll.map(n => (
          <div key={n.id} className={`nav-item ${active === n.id ? "active" : ""}`} onClick={() => setActive(n.id)}>
            <Icon d={n.icon} size={15} />
            {n.label}
            {n.badge && <span className={`badge ${n.badgeCls || ""}`}>{n.badge}</span>}
          </div>
        ))}
      </div>

      {isAdmin && (
        <div className="nav-section">
          <div className="nav-label">Admin Only</div>
          {navAdmin.map(n => (
            <div key={n.id} className={`nav-item ${active === n.id ? "active" : ""}`} onClick={() => setActive(n.id)}>
              <Icon d={n.icon} size={15} />
              {n.label}
              {n.badge && <span className={`badge ${n.badgeCls || ""}`}>{n.badge}</span>}
            </div>
          ))}
        </div>
      )}

      <div className="sidebar-footer">
        <div className="user-card">
          <div className={`avatar ${user.role}`}>{user.avatar}</div>
          <div className="user-info">
            <div className="uname">{user.name}</div>
            <div className="urole">{user.dept}</div>
          </div>
          <span className={`role-badge ${user.role}`}>{user.role}</span>
        </div>
        <button className="logout-btn" onClick={onLogout}>
          <Icon d={Icons.logout} size={14} /> Sign Out
        </button>
      </div>
    </aside>
  );
}

function StatCard({ label, val, delta, dir, icon, cls, delay = 0 }) {
  return (
    <div className="stat-card" style={{ animationDelay: `${delay}ms` }}>
      <div className="stat-header">
        <div className={`stat-icon ${cls}`}><Icon d={Icons[icon]} size={15} /></div>
        {delta && <span className={`stat-delta ${dir}`}>{delta}</span>}
      </div>
      <div className="stat-val">{val}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

function DashboardPage({ user }) {
  const isAdmin = user.role === "admin";
  const stats = isAdmin ? STATS_ADMIN : STATS_USER;
  return (
    <>
      <div className="topbar">
        <div>
          <div className="page-title">Dashboard</div>
          <div className="page-sub">
            {isAdmin ? "Full system visibility — Admin access" : `Welcome back, ${user.name.split(" ")[0]}`}
          </div>
        </div>
        <div className="topbar-right">
          <div className="icon-btn notif-dot"><Icon d={Icons.bell} size={15} /></div>
          <div className={`role-badge ${user.role}`} style={{ fontSize: ".75rem", padding: ".3rem .8rem", borderRadius: 8 }}>
            {isAdmin ? "🛡 Admin" : "👤 User"}
          </div>
        </div>
      </div>

      <div className="stats">
        {stats.map((s, i) => <StatCard key={s.label} {...s} delay={i * 60} />)}
      </div>

      <div className="grid2">
        <div className="card" style={{ animationDelay: "200ms" }}>
          <div className="card-title">
            Recent Activity
            <span className="card-badge all-roles">All Roles</span>
          </div>
          <ul className="activity-list">
            {ACTIVITY.slice(0, isAdmin ? 6 : 3).map((a, i) => (
              <li key={i} className="activity-item">
                <span className={`act-dot ${a.dot}`} />
                <div>
                  <div className="act-text">{a.text}</div>
                  <div className="act-time">{a.time}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="card" style={{ animationDelay: "280ms" }}>
          <div className="card-title">
            Session Token
            <span className="card-badge all-roles">JWT</span>
          </div>
          <TokenPanel user={user} />
        </div>
      </div>
    </>
  );
}

function TokenPanel({ user }) {
  const auth = useAuth();
  const claims = btoa(JSON.stringify({ sub: user.id, name: user.name, role: user.role, exp: Math.floor(Date.now()/1000)+86400 }));
  return (
    <div>
      <div className="token-box" style={{ marginBottom: ".85rem" }}>
        <span style={{ color: "#a78bfa" }}>eyJhbGciOiJIUzI1NiJ9</span>
        <span style={{ color: "#64748b" }}>.</span>
        <span style={{ color: "#6384ff" }}>{claims.slice(0,32)}…</span>
        <span style={{ color: "#64748b" }}>.</span>
        <span style={{ color: "#34d399" }}>SflKxw</span>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:".4rem" }}>
        {[
          ["Subject",  user.email],
          ["Role",     user.role],
          ["Issued",   new Date().toLocaleTimeString()],
          ["Expires",  "in 24 hours"],
          ["Token ID", `tok_${auth?.token?.slice(-8) || "xxxxxxxx"}`],
        ].map(([k, v]) => (
          <div className="token-row" key={k}>
            <span className="token-key">{k}</span>
            <span className="token-val">{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function UsersPage() {
  return (
    <>
      <div className="topbar">
        <div>
          <div className="page-title">User Management</div>
          <div className="page-sub">Manage accounts, roles, and permissions</div>
        </div>
        <div className="topbar-right">
          <div className={`role-badge admin`} style={{ fontSize:".75rem",padding:".3rem .8rem",borderRadius:8 }}>Admin Only</div>
        </div>
      </div>
      <div className="card">
        <div className="card-title">All Users <span className="card-badge admin-only">Admin View</span></div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>User</th><th>Role</th><th>Department</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {USERS_TABLE.map(u => (
                <tr key={u.email}>
                  <td>
                    <div className="td-user">
                      <div className={`avatar ${u.role}`} style={{ width:28,height:28,borderRadius:6,fontSize:".62rem" }}>
                        {u.name.split(" ").map(n=>n[0]).join("")}
                      </div>
                      <div>
                        <div style={{ fontWeight:600,fontSize:".82rem" }}>{u.name}</div>
                        <div style={{ fontSize:".7rem",color:"var(--muted)",fontFamily:"'JetBrains Mono',monospace" }}>{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td><span className={`td-badge ${u.role}`}>{u.role}</span></td>
                  <td style={{ color:"var(--muted)",fontSize:".78rem" }}>{u.dept}</td>
                  <td>
                    <div className="td-status">
                      <div className={`dot ${u.status === "active" ? "dot-active" : "dot-inactive"}`} />
                      <span style={{ fontSize:".78rem",color:u.status==="active"?"var(--success)":"var(--muted)" }}>{u.status}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function ActivityPage({ user }) {
  return (
    <>
      <div className="topbar">
        <div><div className="page-title">Activity Log</div><div className="page-sub">Authentication events and system actions</div></div>
      </div>
      <div className="card">
        <div className="card-title">Events <span className="card-badge all-roles">Live</span></div>
        <ul className="activity-list">
          {ACTIVITY.map((a, i) => (
            <li key={i} className="activity-item" style={{ padding:".6rem 0", borderBottom:"1px solid rgba(99,132,255,.06)" }}>
              <span className={`act-dot ${a.dot}`} />
              <div style={{ flex:1 }}>
                <div className="act-text">{a.text}</div>
                <div className="act-time">{a.time}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

function TokensPage({ user }) {
  return (
    <>
      <div className="topbar">
        <div><div className="page-title">My Token</div><div className="page-sub">Current session and JWT details</div></div>
      </div>
      <div className="grid2">
        <div className="card">
          <div className="card-title">Active Token <span className="card-badge all-roles">JWT</span></div>
          <TokenPanel user={user} />
        </div>
        <div className="card">
          <div className="card-title">Permissions</div>
          {["read:profile","read:activity","write:profile",
            ...(user.role==="admin"?["read:users","write:users","read:system","write:roles","admin:all"]:["read:public"])
          ].map(p => (
            <div key={p} style={{ display:"flex",alignItems:"center",gap:".6rem",padding:".45rem 0",borderBottom:"1px solid rgba(99,132,255,.06)",fontSize:".8rem" }}>
              <Icon d={user.role==="admin"||["read:profile","read:activity","write:profile","read:public"].includes(p)?Icons.check:Icons.x} size={13}
                style={{ color: user.role==="admin"||["read:profile","read:activity","write:profile","read:public"].includes(p) ? "var(--success)" : "var(--danger)" }} />
              <span style={{ fontFamily:"'JetBrains Mono',monospace",color:"var(--muted)" }}>{p}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function SystemPage() {
  const metrics = [
    { label:"CPU Usage",     val:"34%",  cls:"green"  },
    { label:"Memory",        val:"61%",  cls:"amber"  },
    { label:"Auth Requests", val:"1.2k/s",cls:"blue"  },
    { label:"Error Rate",    val:"0.03%",cls:"green"  },
  ];
  return (
    <>
      <div className="topbar">
        <div><div className="page-title">System Monitor</div><div className="page-sub">Infrastructure and service health</div></div>
        <div className="topbar-right"><div className={`role-badge admin`} style={{fontSize:".75rem",padding:".3rem .8rem",borderRadius:8}}>Admin Only</div></div>
      </div>
      <div className="stats">
        {metrics.map((m,i) => (
          <div className="stat-card" key={m.label} style={{ animationDelay:`${i*60}ms` }}>
            <div className="stat-header">
              <div className={`stat-icon ${m.cls}`}><Icon d={Icons.chart} size={15} /></div>
            </div>
            <div className="stat-val">{m.val}</div>
            <div className="stat-label">{m.label}</div>
          </div>
        ))}
      </div>
      <div className="card">
        <div className="card-title">Services <span className="card-badge admin-only">Live</span></div>
        {["Auth Service","Token Issuer","User Directory","Session Store","Audit Logger"].map(s => (
          <div key={s} style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:".65rem 0",borderBottom:"1px solid rgba(99,132,255,.06)",fontSize:".82rem" }}>
            <div style={{ display:"flex",alignItems:"center",gap:".65rem" }}>
              <div className="dot dot-active" />
              {s}
            </div>
            <span style={{ color:"var(--success)",fontSize:".75rem",fontFamily:"'JetBrains Mono',monospace" }}>operational</span>
          </div>
        ))}
      </div>
    </>
  );
}

function SettingsPage({ user }) {
  return (
    <>
      <div className="topbar"><div><div className="page-title">Settings</div><div className="page-sub">Account and security preferences</div></div></div>
      <div className="card">
        <div className="card-title">Profile</div>
        {[["Name", user.name],["Email", user.email],["Role", user.role],["Department", user.dept]].map(([k,v]) => (
          <div key={k} style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:".65rem 0",borderBottom:"1px solid rgba(99,132,255,.06)",fontSize:".85rem" }}>
            <span style={{ color:"var(--muted)",fontSize:".75rem",fontWeight:700,letterSpacing:".05em",textTransform:"uppercase" }}>{k}</span>
            <span>{v}</span>
          </div>
        ))}
      </div>
    </>
  );
}

function AccessDenied() {
  return (
    <div className="denied">
      <div className="denied-icon"><Icon d={Icons.lock} size={32} /></div>
      <h2>Access Restricted</h2>
      <p>You don't have permission to view this page. Admin privileges required.</p>
    </div>
  );
}

// ── Protected Route wrapper ───────────────────────────────────────────────────
function ProtectedRoute({ children, role }) {
  const { user } = useAuth();
  if (role && user.role !== role) return <AccessDenied />;
  return children;
}

// ── App Root ──────────────────────────────────────────────────────────────────
export default function App() {
  const [auth, setAuth] = useState(null); // { token, user }
  const [page, setPage] = useState("dashboard");

  const login = (token, user) => setAuth({ token, user });
  const logout = () => { setAuth(null); setPage("dashboard"); };

  if (!auth) return (
    <>
      <style>{css}</style>
      <LoginPage onLogin={login} />
    </>
  );

  const renderPage = () => {
    switch (page) {
      case "dashboard": return <DashboardPage user={auth.user} />;
      case "users":     return <ProtectedRoute role="admin"><UsersPage /></ProtectedRoute>;
      case "system":    return <ProtectedRoute role="admin"><SystemPage /></ProtectedRoute>;
      case "activity":  return <ActivityPage user={auth.user} />;
      case "tokens":    return <TokensPage user={auth.user} />;
      case "settings":  return <SettingsPage user={auth.user} />;
      default:          return <DashboardPage user={auth.user} />;
    }
  };

  return (
    <AuthContext.Provider value={auth}>
      <style>{css}</style>
      <div className="app">
        <Sidebar active={page} setActive={setPage} user={auth.user} onLogout={logout} />
        <main className="main">{renderPage()}</main>
      </div>
    </AuthContext.Provider>
  );
}
