import { useParams } from 'react-router-dom';

export function RecipeDetailView() {
  const { id } = useParams<{ id: string }>();

  return (
    <div>
      <h2 className="page-title">Recipe Details</h2>
      <p className="page-description">Recipe details for ID: {id}</p>
      <p className="page-description">Detailed recipe view will go here</p>
    </div>
  );
}
