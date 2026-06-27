"use client";

export default function AdminPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: 700,
          width: "100%",
          background: "#111827",
          border: "2px solid #22c55e",
          borderRadius: 24,
          padding: 40,
          textAlign: "center",
          boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
        }}
      >
        <div
          style={{
            display: "inline-block",
            background: "#22c55e",
            color: "#052e16",
            padding: "8px 16px",
            borderRadius: 999,
            fontWeight: 800,
            marginBottom: 24,
          }}
        >
          TEST ADMIN VERSION
        </div>

        <h1
          style={{
            fontSize: 42,
            margin: "0 0 16px",
            color: "#ffffff",
          }}
        >
          Админка обновилась ✅
        </h1>

        <p
          style={{
            fontSize: 20,
            lineHeight: 1.6,
            color: "#cbd5e1",
            margin: "0 0 24px",
          }}
        >
          Если ты видишь этот экран на Vercel, значит файл
          <br />
          <b>src/app/adminanush1311/page.tsx</b>
          <br />
          реально обновляется.
        </p>

        <div
          style={{
            background: "#020617",
            border: "1px solid #334155",
            borderRadius: 16,
            padding: 18,
            color: "#93c5fd",
            fontSize: 18,
            fontWeight: 700,
          }}
        >
          Версия проверки: ADMIN-TEST-2026-06-27
        </div>

        <p
          style={{
            marginTop: 24,
            color: "#94a3b8",
            fontSize: 15,
          }}
        >
          После проверки вернём нормальную админку с годом, импортом и экспортом.
        </p>
      </div>
    </main>
  );
}