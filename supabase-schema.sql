-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Deals table
create table deals (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  brand_name text not null,
  platform text not null,
  contact text,
  status text not null,
  deal_value numeric,
  last_contacted_at timestamptz not null,
  next_follow_up_at timestamptz not null,
  follow_up_interval_days integer not null default 7,
  follow_up_count integer not null default 0,
  notes text,
  rate_check jsonb,
  brief_analysis jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Timeline events table
create table timeline_events (
  id uuid primary key default uuid_generate_v4(),
  deal_id uuid references deals(id) on delete cascade not null,
  type text not null,
  description text not null,
  metadata jsonb,
  created_at timestamptz default now()
);

-- Row Level Security
alter table deals enable row level security;
alter table timeline_events enable row level security;

-- Policies for deals
create policy "Users can view their own deals"
  on deals for select
  using (auth.uid() = user_id);

create policy "Users can insert their own deals"
  on deals for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own deals"
  on deals for update
  using (auth.uid() = user_id);

create policy "Users can delete their own deals"
  on deals for delete
  using (auth.uid() = user_id);

-- Policies for timeline_events
create policy "Users can view timeline events for their deals"
  on timeline_events for select
  using (exists (
    select 1 from deals
    where deals.id = timeline_events.deal_id
    and deals.user_id = auth.uid()
  ));

create policy "Users can insert timeline events for their deals"
  on timeline_events for insert
  with check (exists (
    select 1 from deals
    where deals.id = timeline_events.deal_id
    and deals.user_id = auth.uid()
  ));

-- Indexes for performance
create index deals_user_id_idx on deals(user_id);
create index deals_status_idx on deals(status);
create index timeline_events_deal_id_idx on timeline_events(deal_id);
create index timeline_events_created_at_idx on timeline_events(created_at);

-- Feedback table
create table user_feedback (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  type text not null,
  value text not null,
  comment text,
  created_at timestamptz default now()
);

alter table user_feedback enable row level security;

create policy "Users can insert their own feedback"
  on user_feedback for insert
  with check (auth.uid() = user_id);

create policy "Admins can view all feedback"
  on user_feedback for select
  using (true); -- In a real app, this would be restricted to admin roles
