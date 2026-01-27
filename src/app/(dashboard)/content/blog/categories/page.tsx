import { requireAdmin } from '@/lib/auth/guards';
import { CategoriesList } from './categories-list';

export default async function BlogCategoriesPage() {
  await requireAdmin();

  return <CategoriesList />;
}
