

export default function Home() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Bienvenue sur HRDigitaze</h1>
      <p style={styles.paragraph}>Cette application a été conçue pour moderniser la gestion des ressources humaines en centralisant toutes les opérations essentielles dans une seule plateforme. Elle permet aux équipes RH de gérer les collaborateurs, les documents et les processus internes de manière simple, rapide et sécurisée, tout en réduisant les tâches répétitives et en améliorant l’efficacité globale.</p>

    </div>
  );
}

const styles = {
  container: {
    maxWidth: "900px",
    margin: "80px auto",
    padding: "50px",
    textAlign: "center",
    background: "linear-gradient(135deg, #b5cce4, #eef2ff)",
    borderRadius: "20px",
  },
  title: {
    fontSize: "3rem",
    fontWeight: "800",
    color: "#111827",
    marginBottom: "24px",
  },
  paragraph: {
    fontSize: "1.15rem",
    lineHeight: "1.9",
    color: "#374151",
  },
};


