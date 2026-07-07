import { MessageCircle, Instagram, Home, Mail } from "lucide-react";

export const RiosFooter = () => {
  return (
    <footer className="rios-footer-wrap">
      <div className="contact-card">
        <p className="rios-tagline text-center" style={{ color: "var(--blue-light)" }}>
          RIOS Hospedagens
        </p>
        <h3>Fala com a gente</h3>
        <p className="sub">A gente responde rápido — de verdade.</p>

        <div className="contact-grid">
          <a
            href="https://wa.me/5522999999999"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-item"
          >
            <MessageCircle className="icon" />
            <div>
              <div className="label">WhatsApp</div>
              <div className="value">(22) 99999-9999</div>
            </div>
          </a>
          <a
            href="https://instagram.com/rioshospedagens"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-item"
          >
            <Instagram className="icon" />
            <div>
              <div className="label">Instagram</div>
              <div className="value">@rioshospedagens</div>
            </div>
          </a>
          <a
            href="https://www.airbnb.com.br/users/profile/1465782997269992090"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-item"
          >
            <Home className="icon" />
            <div>
              <div className="label">Airbnb</div>
              <div className="value">Nossos imóveis</div>
            </div>
          </a>
          <a
            href="mailto:contato@rioshospedagens.com.br"
            className="contact-item"
          >
            <Mail className="icon" />
            <div>
              <div className="label">E-mail</div>
              <div className="value">contato@rioshospedagens.com.br</div>
            </div>
          </a>
        </div>

        <p className="rios-footer-copy">
          © {new Date().getFullYear()} RIOS Hospedagens · Cabo Frio, RJ
        </p>
      </div>
    </footer>
  );
};
