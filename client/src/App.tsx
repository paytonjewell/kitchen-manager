import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { RecipesView } from './pages/RecipesView';
import { InventoryView } from './pages/InventoryView';
import { MealPlanView } from './pages/MealPlanView';
import { ShoppingListView } from './pages/ShoppingListView';
import { RecipeDetailView } from './pages/RecipeDetailView';
import { NotFoundPage } from './pages/NotFoundPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<RecipesView />} />
          <Route path="inventory" element={<InventoryView />} />
          <Route path="meal-plan" element={<MealPlanView />} />
          <Route path="shopping-list" element={<ShoppingListView />} />
          <Route path="recipe/:id" element={<RecipeDetailView />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
