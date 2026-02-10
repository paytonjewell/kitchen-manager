import { NavLink } from './NavLink';

export function Navigation() {
  return (
    <nav className="nav-desktop">
      <div className="nav-container">
        <ul className="nav-list">
          <li>
            <NavLink to="/" label="Recipes" />
          </li>
          <li>
            <NavLink to="/inventory" label="Inventory" />
          </li>
          <li>
            <NavLink to="/meal-plan" label="Meal Plan" />
          </li>
          <li>
            <NavLink to="/shopping-list" label="Shopping List" />
          </li>
        </ul>
      </div>
    </nav>
  );
}
