import { useState, useEffect, useRef, useCallback } from "react";

/* ─── inject global styles ─── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
:root{
  --bg:#04040a;
  --s1:rgba(255,255,255,0.04);
  --b1:rgba(0,220,255,0.14);
  --cyan:#00dcff;
  --mag:#ff2d78;
  --lime:#b8ff3c;
  --white:#eeeeff;
  --muted:#6677aa;
  --ff:'Syne',sans-serif;
  --fb:'DM Sans',sans-serif;
}
html{scroll-behavior:smooth}
body{background:var(--bg);color:var(--white);font-family:var(--fb);overflow-x:hidden}
::-webkit-scrollbar{width:3px}
::-webkit-scrollbar-thumb{background:var(--cyan);border-radius:2px}
.glass{background:rgba(10,10,25,0.6);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);border:1px solid var(--b1);border-radius:18px}
.glow-c{text-shadow:0 0 18px rgba(0,220,255,.9),0 0 40px rgba(0,220,255,.4)}
.glow-m{text-shadow:0 0 18px rgba(255,45,120,.9),0 0 40px rgba(255,45,120,.4)}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
@keyframes pulse-c{0%,100%{box-shadow:0 0 18px rgba(0,220,255,.35)}50%{box-shadow:0 0 44px rgba(0,220,255,.75),0 0 80px rgba(0,220,255,.25)}}
@keyframes glitch{
  0%,89%,100%{transform:none;opacity:1}
  90%{transform:skewX(-3deg);opacity:.8;color:var(--cyan)}
  91%{transform:skewX(3deg);opacity:.9;color:var(--mag)}
  92%{transform:none;opacity:1}
}
@keyframes fadeUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
@keyframes shimmer{0%{background-position:-400% center}100%{background-position:400% center}}
@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
@keyframes scanline{0%{top:-10%}100%{top:110%}}
@keyframes orbit{from{transform:rotate(0deg) translateX(90px) rotate(0deg)}to{transform:rotate(360deg) translateX(90px) rotate(-360deg)}}
.fade-up{animation:fadeUp .7s ease forwards}
.glitch-text{animation:glitch 5s infinite}
.float-anim{animation:float 4s ease-in-out infinite}
.pulse-c{animation:pulse-c 2.5s ease-in-out infinite}
`;

/* ─── data ─── */
const ROLES = ["Full Stack Developer", "AI Developer", "Python Engineer", "IoT Builder", "Problem Solver"];
const SKILLS = [
  { name: "Python", level: 88, color: "#00dcff" },
  { name: "React / JS", level: 82, color: "#ff2d78" },
  { name: "C Programming", level: 78, color: "#b8ff3c" },
  { name: "SQL / Databases", level: 75, color: "#a78bfa" },
  { name: "IoT Systems", level: 72, color: "#fb923c" },
  { name: "Machine Learning", level: 70, color: "#34d399" },
];
const TECH = [
  { name: "Python", icon: "🐍", cat: "Language" },
  { name: "React", icon: "⚛️", cat: "Frontend" },
  { name: "JavaScript", icon: "🟨", cat: "Language" },
  { name: "C", icon: "🔵", cat: "Language" },
  { name: "SQL", icon: "🗄️", cat: "Database" },
  { name: "MySQL", icon: "🐬", cat: "Database" },
  { name: "Flask", icon: "🌶️", cat: "Backend" },
  { name: "Django", icon: "🎸", cat: "Backend" },
  { name: "Node.js", icon: "💚", cat: "Backend" },
  { name: "IoT", icon: "📡", cat: "Hardware" },
  { name: "Arduino", icon: "🔌", cat: "Hardware" },
  { name: "Git", icon: "🌿", cat: "DevOps" },
  { name: "Linux", icon: "🐧", cat: "OS" },
  { name: "TensorFlow", icon: "🤖", cat: "AI/ML" },
  { name: "Scikit-learn", icon: "📊", cat: "AI/ML" },
  { name: "NumPy", icon: "🔢", cat: "Data" },
  { name: "Pandas", icon: "🐼", cat: "Data" },
];
const CERTS = [
  { title: "Microsoft AI Fundamentals", org: "Microsoft", badge: "🏆", color: "#00dcff", year: "2024" },
  { title: "Ethical Hacking (CEH)", org: "EC-Council — In Progress", badge: "🛡️", color: "#ff2d78", year: "2025" },
  { title: "Hackathon Participation", org: "CodTech IT Solutions", badge: "⚡", color: "#b8ff3c", year: "2024" },
];
const ACHIEVEMENTS = [
  { icon: "🏀", title: "State-Level Basketball", desc: "Competing at state tournaments representing the district", tag: "Sports" },
  { icon: "🏸", title: "State-Level Badminton", desc: "District representative in state-level championships", tag: "Sports" },
  { icon: "🎖️", title: "NCC Cadet", desc: "National Cadet Corps member — discipline, leadership & service", tag: "NCC" },
  { icon: "💡", title: "AI Innovator", desc: "Building real-world AI/ML applications as a first-year student", tag: "Tech" },
];

/* ─── Typewriter hook ─── */
function useTypewriter(words) {
  const [text, setText] = useState('');
  const [wi, setWi] = useState(0);
  const [del, setDel] = useState(false);
  useEffect(() => {
    const word = words[wi % words.length];
    const t = setTimeout(() => {
      if (!del) {
        setText(word.slice(0, text.length + 1));
        if (text === word) setTimeout(() => setDel(true), 1800);
      } else {
        setText(word.slice(0, text.length - 1));
        if (text === '') { setDel(false); setWi(i => i + 1); }
      }
    }, del ? 55 : 95);
    return () => clearTimeout(t);
  }, [text, del, wi, words]);
  return text;
}

/* ─── Particle Canvas ─── */
function Particles() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;
    const pts = Array.from({ length: 80 }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - .5) * .4, vy: (Math.random() - .5) * .4,
      r: Math.random() * 1.5 + .5,
      c: Math.random() > .5 ? '#00dcff' : '#ff2d78'
    }));
    let raf;
    function draw() {
      ctx.clearRect(0, 0, w, h);
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.c + '99';
        ctx.fill();
      });
      pts.forEach((a, i) => pts.slice(i + 1).forEach(b => {
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 130) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(0,220,255,${.12 * (1 - d / 130)})`;
          ctx.lineWidth = .5;
          ctx.stroke();
        }
      }));
      raf = requestAnimationFrame(draw);
    }
    draw();
    const onResize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; };
    window.addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); };
  }, []);
  return <canvas ref={ref} style={{ position: 'fixed', top: 0, left: 0, zIndex: 0, pointerEvents: 'none' }} />;
}

/* ─── Scroll fade hook ─── */
function useFade() {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: .15 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, vis];
}

/* ─── Section wrapper ─── */
function Section({ id, children, style }) {
  const [ref, vis] = useFade();
  return (
    <section id={id} ref={ref} style={{
      padding: '100px 0', position: 'relative', zIndex: 1,
      opacity: vis ? 1 : 0, transform: vis ? 'none' : 'translateY(32px)',
      transition: 'opacity .8s ease, transform .8s ease', ...style
    }}>
      {children}
    </section>
  );
}

/* ─── Nav ─── */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);
  const links = ['about', 'skills', 'projects', 'certs', 'stats', 'contact'];
  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      padding: '0 5%',
      background: scrolled ? 'rgba(4,4,10,0.85)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(0,220,255,0.1)' : 'none',
      transition: 'all .4s ease',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '70px',
    }}>
      <span style={{ fontFamily: 'var(--ff)', fontWeight: 800, fontSize: '1.4rem', letterSpacing: '-0.03em' }}>
        <span style={{ color: 'var(--cyan)' }}>K</span>umar<span style={{ color: 'var(--mag)' }}>.</span>
      </span>
      <div style={{ display: 'flex', gap: '32px' }}>
        {links.map(l => (
          <a key={l} href={`#${l}`} style={{
            color: 'var(--muted)', textDecoration: 'none', fontSize: '.85rem',
            fontWeight: 500, textTransform: 'capitalize', letterSpacing: '.05em',
            transition: 'color .2s',
          }}
            onMouseEnter={e => e.target.style.color = 'var(--cyan)'}
            onMouseLeave={e => e.target.style.color = 'var(--muted)'}
          >{l}</a>
        ))}
      </div>
    </nav>
  );
}

/* ─── Hero ─── */
function Hero() {
  const role = useTypewriter(ROLES);
  return (
    <section style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '0 5%', position: 'relative', zIndex: 1,
    }}>
      {/* grid overlay */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        backgroundImage: 'linear-gradient(rgba(0,220,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,220,255,0.04) 1px,transparent 1px)',
        backgroundSize: '60px 60px', pointerEvents: 'none'
      }} />

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '28px', maxWidth: '900px' }}>
        {/* avatar */}
        <div style={{ position: 'relative', width: '150px', height: '150px' }} className="float-anim">
          <div style={{
            width: '150px', height: '150px', borderRadius: '50%',
            border: '3px solid var(--cyan)',
            boxShadow: '0 0 30px rgba(0,220,255,.5), 0 0 60px rgba(0,220,255,.2)',
            overflow: 'hidden', background: '#0a0a18'
          }} className="pulse-c">
            <img src="https://github.com/kumar200608.png" alt="Kumar V"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={e => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:3.5rem">👨‍💻</div>'; }}
            />
          </div>
          {/* orbit dot */}
          <div style={{ position: 'absolute', top: '50%', left: '50%', width: '10px', height: '10px', marginTop: '-5px', marginLeft: '-5px' }}>
            <div style={{
              width: '10px', height: '10px', borderRadius: '50%',
              background: 'var(--mag)', boxShadow: '0 0 10px var(--mag)',
              animation: 'orbit 3s linear infinite'
            }} />
          </div>
        </div>

        {/* status badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '6px 18px', borderRadius: '999px',
          background: 'rgba(0,220,255,0.08)', border: '1px solid rgba(0,220,255,0.25)',
          fontSize: '.78rem', fontWeight: 600, color: 'var(--cyan)', letterSpacing: '.08em'
        }}>
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px #22c55e', display: 'inline-block' }} />
          AVAILABLE FOR OPPORTUNITIES
        </div>

        {/* name */}
        <h1 className="glitch-text" style={{
          fontFamily: 'var(--ff)', fontSize: 'clamp(3rem, 9vw, 6.5rem)',
          fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1,
        }}>
          <span>Kumar </span>
          <span className="glow-c" style={{ color: 'var(--cyan)' }}>V</span>
        </h1>

        {/* typewriter */}
        <div style={{ height: '44px', display: 'flex', alignItems: 'center', gap: '2px' }}>
          <span style={{
            fontFamily: 'var(--ff)', fontSize: 'clamp(1.1rem, 3vw, 1.7rem)',
            fontWeight: 700, color: 'var(--mag)'
          }}>{role}</span>
          <span style={{ width: '3px', height: '1.5em', background: 'var(--mag)', animation: 'blink 1s infinite', display: 'inline-block', marginLeft: '2px' }} />
        </div>

        {/* bio */}
        <p style={{ fontSize: '1.05rem', color: 'var(--muted)', maxWidth: '580px', lineHeight: 1.75 }}>
          First-year <strong style={{ color: 'var(--white)' }}>B.E. AI & Data Science</strong> student at ESEC, Salem •
          Building full-stack apps, AI models & IoT systems • State-level athlete • NCC cadet
        </p>

        {/* cta */}
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <a href="https://github.com/kumar200608" target="_blank" rel="noreferrer" style={{
            padding: '13px 32px', borderRadius: '999px', fontWeight: 700, fontSize: '.9rem',
            background: 'var(--cyan)', color: '#000', textDecoration: 'none', letterSpacing: '.04em',
            boxShadow: '0 0 24px rgba(0,220,255,.4)', transition: 'transform .2s, box-shadow .2s',
          }}
            onMouseEnter={e => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 0 40px rgba(0,220,255,.7)'; }}
            onMouseLeave={e => { e.target.style.transform = 'none'; e.target.style.boxShadow = '0 0 24px rgba(0,220,255,.4)'; }}>
            GitHub ↗
          </a>
          <a href="https://www.linkedin.com/in/kumar-v-a7405a339" target="_blank" rel="noreferrer" style={{
            padding: '13px 32px', borderRadius: '999px', fontWeight: 700, fontSize: '.9rem',
            background: 'transparent', color: 'var(--mag)', textDecoration: 'none', letterSpacing: '.04em',
            border: '2px solid var(--mag)', transition: 'all .2s',
          }}
            onMouseEnter={e => { e.target.style.background = 'rgba(255,45,120,.15)'; e.target.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.transform = 'none'; }}>
            LinkedIn ↗
          </a>
          <a href="#contact" style={{
            padding: '13px 32px', borderRadius: '999px', fontWeight: 700, fontSize: '.9rem',
            background: 'rgba(255,255,255,0.05)', color: 'var(--white)', textDecoration: 'none', letterSpacing: '.04em',
            border: '1px solid rgba(255,255,255,.12)', transition: 'all .2s',
          }}
            onMouseEnter={e => { e.target.style.background = 'rgba(255,255,255,0.1)'; }}
            onMouseLeave={e => { e.target.style.background = 'rgba(255,255,255,0.05)'; }}>
            Contact Me
          </a>
        </div>

        {/* scroll hint */}
        <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', opacity: .4 }}>
          <span style={{ fontSize: '.7rem', letterSpacing: '.12em', color: 'var(--muted)' }}>SCROLL TO EXPLORE</span>
          <div style={{ width: '1px', height: '40px', background: 'linear-gradient(to bottom, var(--cyan), transparent)' }} />
        </div>
      </div>
    </section>
  );
}

/* ─── About ─── */
function About() {
  const stats = [
    { val: '2028', label: 'Grad Year' },
    { val: '3+', label: 'Projects' },
    { val: '2', label: 'Certs' },
    { val: '2', label: 'Sports' },
  ];
  return (
    <Section id="about">
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 5%' }}>
        <p style={{ color: 'var(--cyan)', fontWeight: 700, letterSpacing: '.14em', fontSize: '.82rem', marginBottom: '12px' }}>// WHO AM I</p>
        <h2 className="section-title" style={{ fontFamily: 'var(--ff)', fontSize: 'clamp(2rem,5vw,3rem)', fontWeight: 800, marginBottom: '40px' }}>
          About <span style={{ color: 'var(--cyan)' }}>Me</span>
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <p style={{ color: 'var(--muted)', lineHeight: 1.85, fontSize: '1.02rem' }}>
              Hey! I'm <strong style={{ color: 'var(--white)' }}>Kumar V</strong>, a first-year B.E. student in
              <strong style={{ color: 'var(--cyan)' }}> Artificial Intelligence & Data Science</strong> at
              Erode Sengunthar Engineering College under Anna University's R-2023 regulation.
            </p>
            <p style={{ color: 'var(--muted)', lineHeight: 1.85, fontSize: '1.02rem' }}>
              I blend <strong style={{ color: 'var(--lime)' }}>full-stack development</strong> with
              <strong style={{ color: 'var(--mag)' }}> AI/ML engineering</strong> to build solutions that actually matter.
              From Python backends to IoT hardware hacks — if it runs code, I'll make it smarter.
            </p>
            <p style={{ color: 'var(--muted)', lineHeight: 1.85, fontSize: '1.02rem' }}>
              Off-screen, I'm an NCC cadet and a state-level athlete in basketball & badminton. Discipline on the court,
              clean code in the editor — same energy.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {stats.map(s => (
              <div key={s.label} className="glass" style={{ padding: '28px', textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--ff)', fontSize: '2.4rem', fontWeight: 800, color: 'var(--cyan)' }}>{s.val}</div>
                <div style={{ fontSize: '.82rem', color: 'var(--muted)', marginTop: '6px', letterSpacing: '.06em' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ─── Skills ─── */
function Skills() {
  const [ref, vis] = useFade();
  return (
    <Section id="skills">
      <div ref={ref} style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 5%' }}>
        <p style={{ color: 'var(--mag)', fontWeight: 700, letterSpacing: '.14em', fontSize: '.82rem', marginBottom: '12px' }}>// WHAT I KNOW</p>
        <h2 style={{ fontFamily: 'var(--ff)', fontSize: 'clamp(2rem,5vw,3rem)', fontWeight: 800, marginBottom: '48px' }}>
          Skills & <span style={{ color: 'var(--mag)' }}>Expertise</span>
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: '24px', marginBottom: '64px' }}>
          {SKILLS.map((s, i) => (
            <div key={s.name} className="glass" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontWeight: 600, fontSize: '.95rem' }}>{s.name}</span>
                <span style={{ color: s.color, fontWeight: 700, fontSize: '.9rem' }}>{s.level}%</span>
              </div>
              <div style={{ height: '6px', background: 'rgba(255,255,255,0.07)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%', background: s.color,
                  width: vis ? `${s.level}%` : '0%',
                  borderRadius: '3px',
                  boxShadow: `0 0 12px ${s.color}88`,
                  transition: `width 1.4s cubic-bezier(.4,0,.2,1) ${i * 120}ms`
                }} />
              </div>
            </div>
          ))}
        </div>
        <p style={{ color: 'var(--cyan)', fontWeight: 700, letterSpacing: '.14em', fontSize: '.82rem', marginBottom: '28px' }}>// TECH STACK</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          {TECH.map(t => (
            <div key={t.name} className="glass" style={{
              padding: '10px 18px', display: 'flex', alignItems: 'center', gap: '8px',
              cursor: 'default', transition: 'transform .2s, border-color .2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'rgba(0,220,255,0.45)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = 'rgba(0,220,255,0.14)'; }}>
              <span style={{ fontSize: '1.1rem' }}>{t.icon}</span>
              <span style={{ fontSize: '.88rem', fontWeight: 600 }}>{t.name}</span>
              <span style={{ fontSize: '.7rem', color: 'var(--muted)', background: 'rgba(255,255,255,0.05)', padding: '2px 7px', borderRadius: '99px' }}>{t.cat}</span>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ─── Projects ─── */
function Projects() {
  return (
    <Section id="projects">
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 5%' }}>
        <p style={{ color: 'var(--lime)', fontWeight: 700, letterSpacing: '.14em', fontSize: '.82rem', marginBottom: '12px' }}>// WHAT I BUILD</p>
        <h2 style={{ fontFamily: 'var(--ff)', fontSize: 'clamp(2rem,5vw,3rem)', fontWeight: 800, marginBottom: '48px' }}>
          Featured <span style={{ color: 'var(--lime)' }}>Projects</span>
        </h2>

        {/* Featured — Rovia Delice */}
        <div className="glass" style={{
          padding: '40px', marginBottom: '32px',
          background: 'linear-gradient(135deg, rgba(0,220,255,0.07) 0%, rgba(10,10,25,0.6) 60%)',
          borderColor: 'rgba(0,220,255,0.3)',
          position: 'relative', overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute', top: '-40px', right: '-40px',
            width: '200px', height: '200px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,220,255,0.15) 0%, transparent 70%)'
          }} />
          <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <span style={{ background: 'rgba(0,220,255,0.15)', color: 'var(--cyan)', padding: '4px 12px', borderRadius: '99px', fontSize: '.75rem', fontWeight: 700, letterSpacing: '.08em' }}>⭐ FEATURED</span>
            <span style={{ background: 'rgba(184,255,60,0.12)', color: 'var(--lime)', padding: '4px 12px', borderRadius: '99px', fontSize: '.75rem', fontWeight: 700 }}>Full Stack</span>
            <span style={{ background: 'rgba(255,45,120,0.12)', color: 'var(--mag)', padding: '4px 12px', borderRadius: '99px', fontSize: '.75rem', fontWeight: 700 }}>AI Powered</span>
          </div>
          <h3 style={{ fontFamily: 'var(--ff)', fontSize: '2rem', fontWeight: 800, marginBottom: '16px', color: 'var(--cyan)' }}>
            Rovia Delice 🍽️
          </h3>
          <p style={{ color: 'var(--muted)', lineHeight: 1.85, fontSize: '1rem', maxWidth: '680px', marginBottom: '28px' }}>
            A modern, full-stack restaurant & food discovery platform built with React and Python/Flask.
            Features AI-powered menu recommendations, real-time order tracking, smart search, and a
            beautifully crafted UX that blends aesthetics with performance. Think Zomato — but cooler.
          </p>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '28px' }}>
            {['React', 'Python', 'Flask', 'MySQL', 'AI/ML', 'REST API'].map(t => (
              <span key={t} style={{ padding: '5px 14px', borderRadius: '99px', fontSize: '.78rem', fontWeight: 600, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,.1)' }}>{t}</span>
            ))}
          </div>
          <a href="https://github.com/kumar200608/rovia-delice" target="_blank" rel="noreferrer" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '12px 28px', borderRadius: '999px', fontWeight: 700, fontSize: '.88rem',
            background: 'var(--cyan)', color: '#000', textDecoration: 'none',
            transition: 'transform .2s, box-shadow .2s',
            boxShadow: '0 0 24px rgba(0,220,255,.35)'
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 0 40px rgba(0,220,255,.6)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 0 24px rgba(0,220,255,.35)'; }}>
            View on GitHub ↗
          </a>
        </div>

        {/* Other project cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {[
            { name: 'Luxora Studio 💎', desc: 'Premium luxury studio platform with slick dark UI, smooth animations, and elite design aesthetic built for high-end brands and creative agencies.', tags: ['React', 'CSS3', 'Animations', 'UI/UX'], color: '#a78bfa', href: 'https://github.com/kumar200608/luxora-studio' },
            { name: 'Karsha AI Smart Grid ⚡', desc: 'AI-powered smart energy grid monitoring dashboard with real-time power consumption visualization, grid health tracking, and predictive analytics.', tags: ['Python', 'React', 'AI/ML', 'IoT', 'Dashboard'], color: '#b8ff3c', href: 'https://github.com/kumar200608/karshaaismartagridashboard' },
            { name: 'Complaint Management 📋', desc: 'Full-featured complaint tracking & resolution platform. Users lodge complaints, track status in real-time; admins manage and resolve with a clean dashboard.', tags: ['Python', 'Flask', 'SQL', 'React', 'REST API'], color: '#fb923c', href: 'https://github.com/kumar200608/complaintmanagementsystem' },
            { name: 'The Matrix — Exam Portal 🏫', desc: 'Smart exam hall allocation portal that automates seating, generates hall tickets, and manages student placement — eliminating manual scheduling chaos.', tags: ['React', 'Python', 'SQL', 'Algorithm', 'PDF Gen'], color: '#ff2d78', href: 'https://github.com/Kishoreramu25/The-Matrix---Exam-Hall-Allocation-Portal', collab: 'w/ Kishoreramu25' },
            { name: 'IoT Smart Monitor', desc: 'Real-time sensor data dashboard with Arduino & Python. Tracks temperature, humidity and sends smart alerts.', tags: ['Python', 'IoT', 'Arduino', 'Dashboard'], color: '#fb923c' },
            { name: 'AI Data Classifier', desc: 'ML classification pipeline with Scikit-learn. Trains, evaluates and deploys predictive models with clean APIs.', tags: ['Python', 'ML', 'Scikit-learn', 'REST API'], color: '#a78bfa' },
          ].map(p => (
            <div key={p.name} className="glass" style={{ padding: '28px', transition: 'transform .2s, border-color .2s', borderColor: p.color + '22' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.borderColor = p.color + '55'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = p.color + '22'; }}>
              <h3 style={{ fontFamily: 'var(--ff)', fontSize: '1.05rem', fontWeight: 700, color: p.color, marginBottom: '10px' }}>{p.name}</h3>
              <p style={{ color: 'var(--muted)', fontSize: '.88rem', lineHeight: 1.75, marginBottom: '18px' }}>{p.desc}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px', marginBottom: '18px' }}>
                {p.tags.map(t => <span key={t} style={{ padding: '3px 10px', borderRadius: '99px', fontSize: '.72rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,.1)' }}>{t}</span>)}
              </div>
              {p.href && <a href={p.href} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '7px 18px', borderRadius: '999px', fontSize: '.78rem', fontWeight: 700, background: `${p.color}18`, color: p.color, border: `1px solid ${p.color}35`, textDecoration: 'none', transition: 'opacity .2s' }} onMouseEnter={e => e.currentTarget.style.opacity = '.75'} onMouseLeave={e => e.currentTarget.style.opacity = '1'}>View Repo ↗</a>}
              {p.collab && <span style={{ marginLeft: '10px', fontSize: '.72rem', color: 'var(--muted)' }}>🤝 {p.collab}</span>}
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ─── Certifications ─── */
function Certifications() {
  return (
    <Section id="certs">
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 5%' }}>
        <p style={{ color: 'var(--cyan)', fontWeight: 700, letterSpacing: '.14em', fontSize: '.82rem', marginBottom: '12px' }}>// CREDENTIALS</p>
        <h2 style={{ fontFamily: 'var(--ff)', fontSize: 'clamp(2rem,5vw,3rem)', fontWeight: 800, marginBottom: '48px' }}>
          Certs & <span style={{ color: 'var(--cyan)' }}>Achievements</span>
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '20px', marginBottom: '60px' }}>
          {CERTS.map(c => (
            <div key={c.title} className="glass" style={{ padding: '28px', transition: 'transform .2s' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-6px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
              <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>{c.badge}</div>
              <div style={{ fontFamily: 'var(--ff)', fontSize: '1.05rem', fontWeight: 700, marginBottom: '8px', color: c.color }}>{c.title}</div>
              <div style={{ color: 'var(--muted)', fontSize: '.85rem', marginBottom: '12px' }}>{c.org}</div>
              <div style={{ fontSize: '.75rem', color: 'var(--muted)', background: 'rgba(255,255,255,0.04)', padding: '3px 10px', borderRadius: '99px', display: 'inline-block', border: `1px solid ${c.color}33` }}>{c.year}</div>
            </div>
          ))}
        </div>

        <p style={{ color: 'var(--mag)', fontWeight: 700, letterSpacing: '.14em', fontSize: '.82rem', marginBottom: '28px' }}>// LIFE ACHIEVEMENTS</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: '16px' }}>
          {ACHIEVEMENTS.map(a => (
            <div key={a.title} className="glass" style={{ padding: '24px', display: 'flex', gap: '16px', transition: 'transform .2s, border-color .2s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'rgba(255,45,120,0.3)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = 'rgba(0,220,255,0.14)'; }}>
              <span style={{ fontSize: '2rem', flexShrink: 0 }}>{a.icon}</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: '.9rem', marginBottom: '4px' }}>{a.title}</div>
                <div style={{ color: 'var(--muted)', fontSize: '.8rem', lineHeight: 1.6 }}>{a.desc}</div>
                <span style={{ display: 'inline-block', marginTop: '10px', fontSize: '.7rem', fontWeight: 700, color: 'var(--mag)', background: 'rgba(255,45,120,0.1)', padding: '2px 8px', borderRadius: '99px', border: '1px solid rgba(255,45,120,0.2)' }}>{a.tag}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ─── GitHub Stats ─── */
function GitHubStats() {
  const username = 'kumar200608';
  const theme = 'tokyonight';
  const imgs = [
    { src: `https://github-readme-stats.vercel.app/api?username=${username}&show_icons=true&theme=${theme}&hide_border=true&count_private=true&bg_color=0d0d1a`, alt: 'GitHub Stats', w: '100%' },
    { src: `https://github-readme-stats.vercel.app/api/top-langs/?username=${username}&layout=compact&theme=${theme}&hide_border=true&bg_color=0d0d1a`, alt: 'Top Languages', w: '100%' },
    { src: `https://streak-stats.demolab.com?user=${username}&theme=tokyonight-duo&hide_border=true&background=0d0d1a`, alt: 'GitHub Streak', w: '100%' },
    { src: `https://github-profile-trophy.vercel.app/?username=${username}&theme=tokyonight&no-frame=true&column=4&margin-w=8`, alt: 'Trophies', w: '100%' },
  ];
  return (
    <Section id="stats">
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 5%' }}>
        <p style={{ color: 'var(--lime)', fontWeight: 700, letterSpacing: '.14em', fontSize: '.82rem', marginBottom: '12px' }}>// GITHUB ACTIVITY</p>
        <h2 style={{ fontFamily: 'var(--ff)', fontSize: 'clamp(2rem,5vw,3rem)', fontWeight: 800, marginBottom: '48px' }}>
          GitHub <span style={{ color: 'var(--lime)' }}>Stats</span>
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          {imgs.slice(0, 2).map(img => (
            <div key={img.alt} className="glass" style={{ padding: '4px', overflow: 'hidden' }}>
              <img src={img.src} alt={img.alt} style={{ width: '100%', borderRadius: '14px', display: 'block' }}
                onError={e => { e.target.parentElement.style.display = 'none'; }} />
            </div>
          ))}
        </div>
        <div className="glass" style={{ padding: '4px', overflow: 'hidden', marginBottom: '20px' }}>
          <img src={imgs[2].src} alt={imgs[2].alt} style={{ width: '100%', borderRadius: '14px', display: 'block' }}
            onError={e => { e.target.parentElement.style.display = 'none'; }} />
        </div>
        <div className="glass" style={{ padding: '4px', overflow: 'hidden' }}>
          <img src={imgs[3].src} alt={imgs[3].alt} style={{ width: '100%', borderRadius: '14px', display: 'block' }}
            onError={e => { e.target.parentElement.style.display = 'none'; }} />
        </div>

        {/* Productivity metrics */}
        <div style={{ marginTop: '48px' }}>
          <p style={{ color: 'var(--cyan)', fontWeight: 700, letterSpacing: '.14em', fontSize: '.82rem', marginBottom: '28px' }}>// PRODUCTIVITY</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '16px' }}>
            {[
              { icon: '⚡', label: 'Code Daily', val: 'Yes', color: 'var(--cyan)' },
              { icon: '🌟', label: 'Open Source', val: 'Active', color: 'var(--lime)' },
              { icon: '🧠', label: 'Learning Pace', val: 'Fast', color: 'var(--mag)' },
              { icon: '🚀', label: 'Projects / Year', val: '3+', color: '#fb923c' },
              { icon: '🛡️', label: 'CEH Progress', val: '40%', color: '#a78bfa' },
              { icon: '📚', label: 'CGPA Target', val: '8.5+', color: '#34d399' },
            ].map(m => (
              <div key={m.label} className="glass" style={{ padding: '20px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>{m.icon}</div>
                <div style={{ fontFamily: 'var(--ff)', fontSize: '1.4rem', fontWeight: 800, color: m.color }}>{m.val}</div>
                <div style={{ fontSize: '.76rem', color: 'var(--muted)', marginTop: '4px' }}>{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ─── Contact ─── */
function Contact() {
  return (
    <Section id="contact">
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '0 5%', textAlign: 'center' }}>
        <p style={{ color: 'var(--mag)', fontWeight: 700, letterSpacing: '.14em', fontSize: '.82rem', marginBottom: '12px' }}>// GET IN TOUCH</p>
        <h2 style={{ fontFamily: 'var(--ff)', fontSize: 'clamp(2rem,5vw,3rem)', fontWeight: 800, marginBottom: '24px' }}>
          Let's <span style={{ color: 'var(--mag)' }}>Connect</span>
        </h2>
        <p style={{ color: 'var(--muted)', lineHeight: 1.8, marginBottom: '48px', fontSize: '1.02rem' }}>
          Open to internships, collaborations, freelance projects and cool ideas. If you're building something
          interesting in AI, full-stack or anything tech — I'm all in. Let's make it happen. 🚀
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '48px' }}>
          {[
            { href: 'https://www.linkedin.com/in/kumar-v-a7405a339', label: '💼 LinkedIn', bg: '#0077b5' },
            { href: 'https://github.com/kumar200608', label: '🐙 GitHub', bg: '#161b22' },
            { href: 'mailto:kumar@example.com', label: '📧 Email', bg: 'var(--mag)' },
          ].map(s => (
            <a key={s.label} href={s.href} target="_blank" rel="noreferrer" style={{
              padding: '14px 32px', borderRadius: '999px', fontWeight: 700, fontSize: '.92rem',
              background: s.bg, color: '#fff', textDecoration: 'none',
              border: '1px solid rgba(255,255,255,.12)',
              transition: 'transform .2s, opacity .2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.opacity = '.85'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.opacity = '1'; }}>
              {s.label}
            </a>
          ))}
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,.07)', paddingTop: '32px' }}>
          <p style={{ color: 'var(--muted)', fontSize: '.85rem' }}>
            Built with <span style={{ color: 'var(--cyan)' }}>React</span> &amp; <span style={{ color: 'var(--lime)' }}>Python</span> •
            Designed with 💙 by <span style={{ color: 'var(--white)', fontWeight: 600 }}>Kumar V</span>
          </p>
        </div>
      </div>
    </Section>
  );
}

/* ─── App ─── */
export default function Portfolio() {
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Particles />
      <Nav />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Certifications />
      <GitHubStats />
      <Contact />
    </div>
  );
}
