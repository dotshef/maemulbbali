create table user_area_request_log (
  id bigint generated always as identity primary key,
  user_id bigint not null references users(id),
  sigungu_cd text not null,
  bjdong_cd text not null,
  bun text not null,
  ji text not null,
  dong text,
  ho text not null,
  created_at timestamp not null default now()
);

create index idx_user_area_request_log_user_id on user_area_request_log(user_id);
create index idx_user_area_request_log_created_at on user_area_request_log(created_at);
