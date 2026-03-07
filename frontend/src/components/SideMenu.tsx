import { useState } from "react";
import { points } from "../data/points";
import { login } from "../auth";

export default function SideMenu({
  onSelectVideo,
}: {
  onSelectVideo: (video: string, pointId: number) => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [user, setUser] = useState<any>(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const [showLogin, setShowLogin] = useState(false);

  // 🔐 LOGIN
  const handleLogin = async () => {
    try {
      const data = await login(email, password);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setUser(data.user);
      setShowLogin(false);

      setEmail("");
      setPassword("");
    } catch {
      alert("❌ Credenciales incorrectas");
    }
  };

  // 🚪 LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <aside style={styles.menu}>
      <h3 style={styles.title}>Cacao Project</h3>

      {/* 🔐 LOGIN */}
      {!user ? (
        <>
          <button
            style={styles.loginButton}
            onClick={() => setShowLogin(!showLogin)}
          >
            🔐 Iniciar sesión
          </button>

          {showLogin && (
            <div style={styles.loginBox}>
              <input
                style={styles.input}
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <input
                style={styles.input}
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button style={styles.loginConfirm} onClick={handleLogin}>
                Entrar
              </button>
            </div>
          )}
        </>
      ) : (
        <>
          <div style={styles.userBox}>
            👤 {user.name}
            <br />
            <small>{user.role}</small>
          </div>

          <button style={styles.logoutButton} onClick={handleLogout}>
            🚪 Cerrar sesión
          </button>
        </>
      )}

      {/* 🎥 VIDEOS */}
      {points.map((p) => (
        <button
          key={p.id}
          style={styles.button}
          onClick={() => onSelectVideo(p.video, p.id)}
        >
          {p.name}
        </button>
      ))}
    </aside>
  );
}

const styles: any = {
menu: {
  width: 240,
  height: "100vh",
  position: "relative",
  zIndex: 1000, // 🔥 MUY IMPORTANTE
  background: "#111827",
  color: "#fff",
  padding: 16,
  overflowY: "auto",
},
  title: {
    marginBottom: 16,
  },
  button: {
    display: "block",
    width: "100%",
    marginBottom: 10,
    padding: "10px 12px",
    background: "#1f2937",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    textAlign: "left",
  },
  loginButton: {
    width: "100%",
    padding: 10,
    marginBottom: 10,
    background: "#16a34a",
    color: "white",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  },
  loginBox: {
    background: "#1f2937",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  input: {
    width: "100%",
    padding: 8,
    marginBottom: 8,
  },
  loginConfirm: {
    width: "100%",
    padding: 8,
    background: "#22c55e",
    border: "none",
    borderRadius: 6,
    color: "white",
    cursor: "pointer",
  },
  userBox: {
    background: "#1f2937",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  logoutButton: {
    width: "100%",
    padding: 8,
    marginBottom: 12,
    background: "#dc2626",
    color: "white",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  },
};
