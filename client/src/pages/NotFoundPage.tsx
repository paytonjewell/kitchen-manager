import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="not-found">
      <h1>404</h1>
      <p>Page not found</p>
      <Link to="/" className="btn">
        Go to Recipes
      </Link>
    </div>
  );
}
