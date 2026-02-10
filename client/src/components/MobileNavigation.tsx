import { Link, useLocation } from 'react-router-dom';
import { ChefHat, Package, Calendar, ShoppingCart } from 'lucide-react';

interface MobileNavLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

function MobileNavLink({ to, icon, label }: MobileNavLinkProps) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`nav-mobile-link ${isActive ? 'active' : ''}`}
    >
      <span className="nav-mobile-icon">{icon}</span>
      <span>{label}</span>
    </Link>
  );
}

export function MobileNavigation() {
  return (
    <nav className="nav-mobile">
      <ul className="nav-mobile-list">
        <li>
          <MobileNavLink to="/" icon={<ChefHat size={24} />} label="Recipes" />
        </li>
        <li>
          <MobileNavLink to="/inventory" icon={<Package size={24} />} label="Inventory" />
        </li>
        <li>
          <MobileNavLink to="/meal-plan" icon={<Calendar size={24} />} label="Plan" />
        </li>
        <li>
          <MobileNavLink to="/shopping-list" icon={<ShoppingCart size={24} />} label="List" />
        </li>
      </ul>
    </nav>
  );
}
