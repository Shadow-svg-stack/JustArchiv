-- Table: categories
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  color text not null default '#3b82f6',
  icon text,
  document_count integer not null default 0,
  is_default boolean not null default false,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Index pour accélérer les requêtes par created_at
create index if not exists categories_created_at_idx on public.categories (created_at desc);

-- Trigger pour auto-update updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists categories_updated_at on public.categories;
create trigger categories_updated_at
before update on public.categories
for each row execute function public.handle_updated_at();

-- Politique RLS (Row Level Security)
alter table public.categories enable row level security;

-- Exemple de policies basiques
-- Lecture: tout le monde peut lire
create policy "Categories are viewable by everyone" 
on public.categories for select
using (true);

-- Insertion: seuls les utilisateurs authentifiés
create policy "Users can insert categories" 
on public.categories for insert
with check (auth.role() = 'authenticated');

-- Mise à jour / suppression : seuls le créateur ou un admin
create policy "Users can update their own categories" 
on public.categories for update
using (created_by = auth.uid());

create policy "Users can delete their own categories" 
on public.categories for delete
using (created_by = auth.uid());
