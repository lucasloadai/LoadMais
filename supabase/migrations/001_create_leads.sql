-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Leads table
create table if not exists public.leads (
  id            uuid primary key default uuid_generate_v4(),
  nome          text not null,
  whatsapp      text not null,
  ddd           text not null,
  instagram     text,
  instagram_followers  integer,
  instagram_verified   boolean default false,
  lead_score    integer default 0,
  lead_tier     text default 'curioso',
  utm_source    text,
  utm_medium    text,
  utm_campaign  text,
  created_at    timestamptz default now()
);

-- Indexes
create index if not exists leads_ddd_idx         on public.leads(ddd);
create index if not exists leads_lead_tier_idx   on public.leads(lead_tier);
create index if not exists leads_created_at_idx  on public.leads(created_at desc);

-- Row Level Security
alter table public.leads enable row level security;

-- Allow service role full access (used by API route)
create policy "service role full access"
  on public.leads
  for all
  using (true)
  with check (true);

-- Comments
comment on table public.leads is 'Lead capture from LOAD MAIS landing page';
comment on column public.leads.lead_tier is 'curioso | potencial | premium';
