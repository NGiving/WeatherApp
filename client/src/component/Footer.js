import { Link } from "react-router-dom";

export default function Footer() {
    return (
      <footer className="sticky-footer">
        <span className="font--family-roboto">Copyright &copy; <Link to={"/"}>Weather</Link> {new Date().getFullYear()}</span>
      </footer>
    );
}