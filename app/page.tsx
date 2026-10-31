
"use client";

import { useEffect, useState } from "react";
import {
  Box, Save, Copy, Trash2, Play, Pause,
  Upload, RotateCcw, Plus, Pencil, Tank
} from "lucide-react";

type TankDesign = {
  id: string;
  name: string;
  bodyColor: string;
  turretColor: string;
  size: number;
  rotation: number;
  wheels: number;
  turret: boolean;
  animation: boolean;
};

const starterTank: TankDesign = {
  id: "starter",
  name: "My First Tank",
  bodyColor: "#8cbf53",
  turretColor: "#a5d86b",
  size: 100,
  rotation: 0,
  wheels: 6,
  turret: true,
  animation: true
};

export default function Home() {
  const [tank, setTank] = useState<TankDesign>(starterTank);
  const [saved, setSaved] = useState<TankDesign[]>([]);
  const [moving, setMoving] = useState(false);
  const [tab, setTab] = useState("Editor");
  const [art, setArt] = useState("");

  useEffect(() => {
    try {
      const data = localStorage.getItem("tank-studio-designs");
      if (data) setSaved(JSON.parse(data));
    } catch {
      console.error("Could not load saved tanks.");
    }
  }, []);

  function update<K extends keyof TankDesign>(
    key: K,
    value: TankDesign[K]
  ) {
    setTank(previous => ({ ...previous, [key]: value }));
  }

  function saveTank() {
    const design = {
      ...tank,
      id: crypto.randomUUID()
    };

    const updated = [...saved, design].slice(-25);
    setSaved(updated);
    localStorage.setItem("tank-studio-designs", JSON.stringify(updated));
    alert("Tank saved!");
  }

  function deleteTank(id: string) {
    const updated = saved.filter(item => item.id !== id);
    setSaved(updated);
    localStorage.setItem("tank-studio-designs", JSON.stringify(updated));
  }

  function duplicateTank(item: TankDesign) {
    if (saved.length >= 25) {
      alert("You've reached the 25 tank save limit.");
      return;
    }

    const copy = {
      ...item,
      id: crypto.randomUUID(),
      name: item.name + " Copy"
    };

    const updated = [...saved, copy];
    setSaved(updated);
    localStorage.setItem("tank-studio-designs", JSON.stringify(updated));
  }

  function loadTank(item: TankDesign) {
    setTank(item);
    setTab("Editor");
  }

  function uploadArt(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please choose an image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Please choose an image smaller than 5 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") setArt(reader.result);
    };
    reader.readAsDataURL(file);
  }

  function resetTank() {
    setTank({
      ...starterTank,
      id: crypto.randomUUID(),
      name: "New Tank"
    });
    setArt("");
    setMoving(false);
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <div className="brand-icon">⚙</div>
          Tank Creator Studio
        </div>
        <div className="top-actions">
          <span className="status">● STUDIO ONLINE</span>
          <button className="button primary" onClick={saveTank}>
            <Save size={15} /> Save Tank
          </button>
        </div>
      </header>

      <main className="main">
        <section className="heading">
          <div>
            <h1>Create something legendary.</h1>
            <p className="subtitle">
              Build, customize, and test your own community tanks.
            </p>
          </div>
          <button className="button" onClick={resetTank}>
            <Plus size={16} /> New Tank
          </button>
        </section>

        <nav className="tabs">
          {["Editor", "My Tanks", "Testing Grounds", "Community"].map(item => (
            <button
              key={item}
              className={`tab ${tab === item ? "active" : ""}`}
              onClick={() => setTab(item)}
            >
              {item}
            </button>
          ))}
        </nav>

        {tab === "Editor" && (
          <div className="editor-grid">
            <section className="panel">
              <div className="panel-header">
                <div>
                  <strong>Tank Preview</strong>
                  <div className="notice">Live design preview</div>
                </div>
                <span className="status">● LIVE</span>
              </div>

              <div className="preview">
                <div
                  className={`tank ${moving && tank.animation ? "moving" : ""}`}
                  style={{
                    transform: `scale(${tank.size / 100}) rotate(${tank.rotation}deg)`
                  }}
                >
                  <div className="track">
                    {Array.from({ length: tank.wheels }).map((_, i) => (
                      <div className="wheel" key={i} />
                    ))}
                  </div>

                  <div
                    className="body-shape"
                    style={{ background: tank.bodyColor }}
                  />

                  {tank.turret && (
                    <div
                      className="turret"
                      style={{ background: tank.turretColor }}
                    >
                      <div className="barrel" />
                    </div>
                  )}

                  {art && <img src={art} className="uploaded-art" alt="Custom tank artwork" />}
                </div>
              </div>

              <div className="panel-body">
                <div className="button-row">
                  <button
                    className="button primary"
                    onClick={() => setMoving(!moving)}
                  >
                    {moving ? <Pause size={15} /> : <Play size={15} />}
                    {moving ? "Stop Movement" : "Test Movement"}
                  </button>
                  <button className="button" onClick={() => update("rotation", 0)}>
                    <RotateCcw size={15} /> Reset Rotation
                  </button>
                </div>
                <p className="notice" style={{ marginTop: 12 }}>
                  Your tank is a preview. Movement and physics will be expanded
                  in future testing features.
                </p>
              </div>
            </section>

            <aside className="panel">
              <div className="panel-header">
                <strong><Pencil size={15} /> Customize Tank</strong>
              </div>

              <div className="panel-body">
                <div className="control-group">
                  <label>Tank Name</label>
                  <input
                    type="text"
                    value={tank.name}
                    maxLength={40}
                    onChange={e => update("name", e.target.value)}
                  />
                </div>

                <div className="control-group">
                  <label>Body Color</label>
                  <input
                    type="color"
                    value={tank.bodyColor}
                    onChange={e => update("bodyColor", e.target.value)}
                  />
                </div>

                <div className="control-group">
                  <label>Turret Color</label>
                  <input
                    type="color"
                    value={tank.turretColor}
                    onChange={e => update("turretColor", e.target.value)}
                  />
                </div>

                <div className="control-group">
                  <label>
                    Overall Size <span>{tank.size}%</span>
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="150"
                    value={tank.size}
                    onChange={e => update("size", Number(e.target.value))}
                  />
                </div>

                <div className="control-group">
                  <label>
                    Rotation <span>{tank.rotation}°</span>
                  </label>
                  <input
                    type="range"
                    min="-180"
                    max="180"
                    value={tank.rotation}
                    onChange={e => update("rotation", Number(e.target.value))}
                  />
                </div>

                <div className="control-group">
                  <label>Wheels</label>
                  <input
                    type="range"
                    min="2"
                    max="10"
                    value={tank.wheels}
                    onChange={e => update("wheels", Number(e.target.value))}
                  />
                </div>

                <div className="control-group">
                  <label>Turret</label>
                  <select
                    value={tank.turret ? "yes" : "no"}
                    onChange={e => update("turret", e.target.value === "yes")}
                  >
                    <option value="yes">Enabled</option>
                    <option value="no">Disabled</option>
                  </select>
                </div>

                <div className="control-group">
                  <label>Movement Animation</label>
                  <select
                    value={tank.animation ? "yes" : "no"}
                    onChange={e => update("animation", e.target.value === "yes")}
                  >
                    <option value="yes">Enabled</option>
                    <option value="no">Disabled</option>
                  </select>
                </div>

                <div className="control-group">
                  <label>Upload Artwork</label>
                  <label className="button" style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <Upload size={15} /> Choose Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={uploadArt}
                      style={{ display: "none" }}
                    />
                  </label>
                  <p className="notice">Images must be 5 MB or smaller.</p>
                </div>

                <button className="button primary" style={{ width: "100%" }} onClick={saveTank}>
                  <Save size={16} /> Save My Tank
                </button>
              </div>
            </aside>
          </div>
        )}

        {tab === "My Tanks" && (
          <section>
            <div className="heading">
              <div>
                <h2>My Tank Collection</h2>
                <p className="subtitle">{saved.length} / 25 saved tanks</p>
              </div>
              <button className="button primary" onClick={resetTank}>
                <Plus size={15} /> New Tank
              </button>
            </div>

            {saved.length === 0 ? (
              <div className="panel empty">
                <h2>No saved tanks yet</h2>
                <p>Create your first tank and save it here.</p>
                <button className="button primary" onClick={() => setTab("Editor")}>
                  Open Editor
                </button>
              </div>
            ) : (
              <div className="saved-list">
                {saved.map(item => (
                  <article className="saved-card" key={item.id}>
                    <div
                      style={{
                        height: 75,
                        borderRadius: 9,
                        background: item.bodyColor,
                        marginBottom: 15,
                        border: "7px solid #303b48"
                      }}
                    />
                    <h3>{item.name}</h3>
                    <p className="notice">Tank design</p>
                    <div className="button-row">
                      <button className="button" onClick={() => loadTank(item)}>
                        Edit
                      </button>
                      <button className="button" onClick={() => duplicateTank(item)}>
                        <Copy size={14} />
                      </button>
                      <button className="button" onClick={() => deleteTank(item.id)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

        {tab === "Testing Grounds" && (
          <section className="panel">
            <div className="panel-header">
              <strong>Testing Grounds</strong>
              <span className="status">PREVIEW MODE</span>
            </div>
            <div className="panel-body">
              <h2>Test your creation</h2>
              <p className="subtitle">
                Try your tank's appearance and movement before saving it.
              </p>
              <div className="preview">
                <div className={`tank ${moving && tank.animation ? "moving" : ""}`}>
                  <div className="track">
                    {Array.from({ length: tank.wheels }).map((_, i) => (
                      <div className="wheel" key={i} />
                    ))}
                  </div>
                  <div className="body-shape" style={{ background: tank.bodyColor }} />
                  {tank.turret && (
                    <div className="turret" style={{ background: tank.turretColor }}>
                      <div className="barrel" />
                    </div>
                  )}
                </div>
              </div>
              <div className="button-row" style={{ marginTop: 18 }}>
                <button className="button primary" onClick={() => setMoving(!moving)}>
                  {moving ? <Pause size={15} /> : <Play size={15} />}
                  {moving ? "Stop Test" : "Start Test"}
                </button>
                <button className="button" onClick={() => setTab("Editor")}>
                  Back to Editor
                </button>
              </div>
            </div>
          </section>
        )}

        {tab === "Community" && (
          <section className="panel empty">
            <h2>Community Workshop</h2>
            <p>
              Community tank sharing, monthly submissions, voting, and developer
              selections are planned for a future release.
            </p>
            <span className="status">COMING IN A FUTURE UPDATE</span>
          </section>
        )}

        <p className="notice" style={{ marginTop: 25 }}>
          Tank Creator Studio · Early Development · Your current saved designs
          are stored in this browser only.
        </p>
      </main>
    </div>
  );
}
