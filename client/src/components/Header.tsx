import { ChefHat } from 'lucide-react';

export function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-logo">
          <ChefHat size={24} />
          <h1 className="header-title">Recipe Manager</h1>
        </div>

        {/* Search bar - to be implemented later */}
        <div style={{ flex: 1, maxWidth: '28rem', margin: '0 1rem', display: 'none' }}>
          {/* Search component will go here */}
        </div>

        {/* Settings/menu - future enhancement */}
      </div>
    </header>
  );
}
