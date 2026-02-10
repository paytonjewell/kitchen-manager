import { Link, useLocation } from 'react-router-dom';

interface NavLinkProps {
  to: string;
  label: string;
  icon?: React.ReactNode;
}

export function NavLink({ to, label, icon }: NavLinkProps) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`nav-link ${isActive ? 'active' : ''}`}
    >
      {icon && <span style={{ marginRight: '0.5rem' }}>{icon}</span>}
      {label}
    </Link>
  );
}
