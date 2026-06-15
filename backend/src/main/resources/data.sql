insert into categories (name)
select '회사'
where not exists (select 1 from categories where name = '회사');

insert into categories (name)
select '연애'
where not exists (select 1 from categories where name = '연애');

insert into categories (name)
select '고민'
where not exists (select 1 from categories where name = '고민');

insert into categories (name)
select '일상'
where not exists (select 1 from categories where name = '일상');

insert into categories (name)
select '썰'
where not exists (select 1 from categories where name = '썰');

insert into categories (name)
select '기타'
where not exists (select 1 from categories where name = '기타');
