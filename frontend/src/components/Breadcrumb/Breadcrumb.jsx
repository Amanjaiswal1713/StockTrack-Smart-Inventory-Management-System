import { Link } from "react-router-dom";

function Breadcrumb({ items }) {
  return (
    <div>
      {items.map((item) => (
        <Link key={item.path} to={item.path}>
          {item.label}
        </Link>
      ))}
    </div>
  );
}

export default Breadcrumb;
