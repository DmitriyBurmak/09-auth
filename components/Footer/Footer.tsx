import css from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={css.footer}>
      <div className={css.content}>
        <p>© {new Date().getFullYear()} NoteHub. All rights reserved.</p>
        <div className={css.wrap}>
          <p>Developer: Dmytro Burmak</p>
          <p>
            Contact us:
            <a
              href="mailto:student@notehub.app"
              target="_blank"
              rel="noopener noreferrer"
            >
              student@notehub.app
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
