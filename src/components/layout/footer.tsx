import { i18n } from "@/lib/i18n";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-12 border-t py-6 text-center text-sm text-muted-foreground">
      <p>
        © {currentYear} {i18n.app.name}. Wszelkie prawa zastrzeżone.
      </p>
    </footer>
  );
};

export default Footer;

