export default function Footer() {
    return (
      <footer className="sticky-footer">
        <span className="font--family-roboto">Copyright &copy; <a href="/">Weather</a> {new Date().getFullYear()}</span>
      </footer>
    );
}