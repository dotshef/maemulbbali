create table user_area_request_log (
  id bigint primary key generated always as identity,
  user_id uuid not null references users(id) on delete cascade,
  sigungu_cd text not null,
  bjdong_cd text not null,
  bun text not null,
  ji text not null,
  dong text,
  ho text,
  created_at timestamptz not null default now()
);

create index idx_user_area_request_log_user_id on user_area_request_log(user_id);
create index idx_user_area_request_log_created_at on user_area_request_log(created_at);
